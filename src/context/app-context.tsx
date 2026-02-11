'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import HalideTopoHero from '@/components/ui/halide-topo-hero';
import SetupWizard, { type AppConfig } from '@/components/setup-wizard';
import { DEMO_ACCOUNTS, type MockAccount } from '@/lib/mock-data';
import { DEFAULT_API } from '@/lib/api-client';

type AppPhase = 'hero' | 'setup' | 'app';

interface AppContextType {
  isDemo: boolean;
  accounts: MockAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<MockAccount[]>>;
  config: AppConfig | null;
  phase: AppPhase;
  setPhase: (v: AppPhase) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [isDemo, setIsDemo] = useState(false);
  const [accounts, setAccounts] = useState<MockAccount[]>([]);
  const [config, setConfig] = useState<AppConfig | null>({
    apiUrl: DEFAULT_API,
    metaAppId: '',
    metaAppSecret: '',
    openaiKey: '',
    webhookToken: '',
  });

  // Phase 1: Cinematic Hero Landing
  if (phase === 'hero') {
    return (
      <HalideTopoHero
        onConfigure={() => setPhase('setup')}
        onDemo={() => {
          setIsDemo(true);
          setAccounts(DEMO_ACCOUNTS);
          setPhase('app');
        }}
      />
    );
  }

  // Phase 2: Setup Wizard
  if (phase === 'setup') {
    return (
      <SetupWizard
        onComplete={(cfg) => {
          setConfig(cfg);
          setIsDemo(false);
          setAccounts([]);
          setPhase('app');
        }}
        onSkipDemo={() => {
          setIsDemo(true);
          setAccounts(DEMO_ACCOUNTS);
          setPhase('app');
        }}
      />
    );
  }

  // Phase 3: Dashboard App
  return (
    <AppContext.Provider value={{ isDemo, accounts, setAccounts, config, phase, setPhase }}>
      {children}
    </AppContext.Provider>
  );
}
