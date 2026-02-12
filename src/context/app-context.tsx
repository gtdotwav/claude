'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import HalideTopoHero from '@/components/ui/halide-topo-hero';
import SetupWizard from '@/components/setup-wizard';
import { DEMO_ACCOUNTS, type MockAccount } from '@/lib/mock-data';

type AppPhase = 'hero' | 'setup' | 'app';

const STORAGE_KEY = 'ig-crm-state';

interface AppContextType {
  isDemo: boolean;
  accounts: MockAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<MockAccount[]>>;
  phase: AppPhase;
  setPhase: (v: AppPhase) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

/** Try to restore persisted state from localStorage */
function loadPersistedState(): { phase: AppPhase; accounts: MockAccount[]; isDemo: boolean } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.phase === 'app' && Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
      return {
        phase: 'app',
        accounts: parsed.accounts,
        isDemo: Boolean(parsed.isDemo),
      };
    }
  } catch {
    // Corrupted state — ignore
  }
  return null;
}

function persistState(phase: AppPhase, accounts: MockAccount[], isDemo: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (phase === 'app' && accounts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, accounts, isDemo }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage full or disabled — ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhaseRaw] = useState<AppPhase>('hero');
  const [isDemo, setIsDemo] = useState(false);
  const [accounts, setAccounts] = useState<MockAccount[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) {
      setPhaseRaw(saved.phase);
      setAccounts(saved.accounts);
      setIsDemo(saved.isDemo);
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (hydrated) {
      persistState(phase, accounts, isDemo);
    }
  }, [phase, accounts, isDemo, hydrated]);

  const setPhase = (p: AppPhase) => setPhaseRaw(p);

  // Show nothing while hydrating to avoid flash
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-white/20" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

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
        onComplete={(account) => {
          setIsDemo(false);
          setAccounts([account]);
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
    <AppContext.Provider value={{ isDemo, accounts, setAccounts, phase, setPhase }}>
      {children}
    </AppContext.Provider>
  );
}
