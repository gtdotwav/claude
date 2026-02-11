import { useState, useMemo, useRef, useEffect } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────
const USERNAMES = ["joana.silva","marcos_fit","farmacia.central","dra.patricia","saude_natural","lucas.med","paula_pf","rede_farma","ana.estetica","vitor.sales","bio_essence","mari_dermato"];
const COMMENT_TEXTS = [
  {text:"Quanto custa esse produto? Tem promoção?",classification:"preco",sentiment:0.1,purchaseIntent:0.8},
  {text:"Amei! Produto maravilhoso, já uso há meses",classification:"elogio",sentiment:0.9,purchaseIntent:0.2},
  {text:"Quero comprar! Como faço pedido?",classification:"interesse",sentiment:0.5,purchaseIntent:0.95},
  {text:"Vocês fazem entrega para o Rio de Janeiro?",classification:"duvida",sentiment:0.0,purchaseIntent:0.6},
  {text:"Esse produto serve pra pele oleosa?",classification:"duvida",sentiment:0.1,purchaseIntent:0.5},
  {text:"Comprei e não recebi ainda, péssimo atendimento",classification:"reclamacao",sentiment:-0.8,purchaseIntent:0.0},
  {text:"Sigam @promoção_falsa ganhem dinheiro!!!",classification:"spam",sentiment:0.0,purchaseIntent:0.0},
  {text:"Parabéns pelo trabalho! Top demais",classification:"elogio",sentiment:0.85,purchaseIntent:0.15},
  {text:"Tem desconto pra farmácia? Quero revender",classification:"interesse",sentiment:0.3,purchaseIntent:0.9},
  {text:"O produto quebrou depois de 2 dias",classification:"suporte",sentiment:-0.6,purchaseIntent:0.0},
  {text:"Aceita parceria? Tenho 50k seguidores",classification:"parceria",sentiment:0.2,purchaseIntent:0.0},
  {text:"Qual a diferença do normal pro premium?",classification:"duvida",sentiment:0.0,purchaseIntent:0.7},
  {text:"Tem tabela de preço por quantidade?",classification:"preco",sentiment:0.0,purchaseIntent:0.85},
  {text:"Melhor produto que já usei na vida!",classification:"elogio",sentiment:0.95,purchaseIntent:0.3},
  {text:"Preciso de ajuda com meu pedido #12345",classification:"suporte",sentiment:-0.3,purchaseIntent:0.0},
];
const STATUSES = ["pending","auto_replied","dm_invited","escalated","ignored","manually_replied"];
const STATUS_WEIGHTS = [15,40,15,10,10,10];
const weightedRandom = (items, weights) => { const t = weights.reduce((a,b)=>a+b,0); let r = Math.random()*t; for(let i=0;i<items.length;i++){r-=weights[i]; if(r<=0)return items[i];} return items[0]; };
const randomDate = (d) => new Date(Date.now()-Math.random()*d*864e5).toISOString();
const genComments = (n=40) => Array.from({length:n},(_,i)=>{const t=COMMENT_TEXTS[Math.floor(Math.random()*COMMENT_TEXTS.length)];return{id:`c-${i+1}`,igUsername:USERNAMES[Math.floor(Math.random()*USERNAMES.length)],text:t.text,igTimestamp:randomDate(30),classification:t.classification,classificationConfidence:0.7+Math.random()*0.3,sentiment:t.sentiment+(Math.random()*0.2-0.1),purchaseIntent:t.purchaseIntent+(Math.random()*0.1-0.05),actionStatus:weightedRandom(STATUSES,STATUS_WEIGHTS),replyText:Math.random()>0.4?"Obrigado pelo comentário! Enviamos detalhes no DM.":null};}).sort((a,b)=>new Date(b.igTimestamp)-new Date(a.igTimestamp));
const genSessions = (n=15) => {const sts=["active","waiting_reply","escalated","human_takeover","completed"];const origins=["organic","comment_invite","campaign"];return Array.from({length:n},(_,i)=>({id:`s-${i+1}`,igUsername:USERNAMES[i%USERNAMES.length],status:sts[Math.floor(Math.random()*3)],messageCount:2+Math.floor(Math.random()*15),lastUserMessage:["Olá, quero saber sobre preços","Vocês entregam no RJ?","Quero comprar em quantidade","Preciso de suporte"][i%4],lastBotMessage:"Claro! Vou te ajudar com isso.",lastActivityAt:randomDate(2),origin:origins[Math.floor(Math.random()*origins.length)],assignedAgentId:Math.random()>0.7?"agent-1":null}));};

const ACCOUNTS = [{id:"acc-1",username:"dryon_farma",status:"active",tokenExpiresAt:new Date(Date.now()+45*864e5).toISOString(),features:{autoReplyComments:true,autoReplyDMs:true,aiClassification:true},totalCommentsProcessed:1247,totalDmsProcessed:389,totalAutoReplies:892,createdAt:"2025-11-15T10:00:00Z"},{id:"acc-2",username:"axl_farma_oficial",status:"active",tokenExpiresAt:new Date(Date.now()+20*864e5).toISOString(),features:{autoReplyComments:true,autoReplyDMs:false,aiClassification:true},totalCommentsProcessed:523,totalDmsProcessed:145,totalAutoReplies:312,createdAt:"2026-01-03T10:00:00Z"}];
const METRICS = {totalComments:1770,totalDMs:534,totalAutoReplies:1204,totalEscalated:105,conversionRate:0.23,responseTimeAvg:38,topClassifications:[{classification:"duvida",count:445},{classification:"elogio",count:389},{classification:"preco",count:312},{classification:"interesse",count:267},{classification:"spam",count:156},{classification:"reclamacao",count:89},{classification:"suporte",count:67},{classification:"parceria",count:34}]};
const RULES = [{id:"r-1",name:"Interesse de Compra → DM",description:"Quando detecta interesse, convida para DM.",priority:10,isActive:true,triggerType:"classification",actionType:"reply_both",useAiPersonalization:true,delaySeconds:45,maxRepliesPerDay:100,repliesToday:37,totalMatches:412,totalRepliesSent:398,replyTemplates:["Olá @{{username}}! Te mandei detalhes por DM 📩"],crmTags:["lead_quente","instagram"]},{id:"r-2",name:"Elogio → Agradecimento",description:"Responde elogios com agradecimento.",priority:20,isActive:true,triggerType:"classification",actionType:"reply_public",useAiPersonalization:true,delaySeconds:60,maxRepliesPerDay:200,repliesToday:12,totalMatches:289,totalRepliesSent:285,replyTemplates:["Muito obrigado @{{username}}! 💙"],crmTags:["cliente_satisfeito"]},{id:"r-3",name:"Reclamação → Escalar",description:"Escala reclamações para humano.",priority:5,isActive:true,triggerType:"sentiment",actionType:"escalate",useAiPersonalization:false,delaySeconds:15,maxRepliesPerDay:50,repliesToday:3,totalMatches:67,totalRepliesSent:64,replyTemplates:["@{{username}} pedimos desculpas!"],crmTags:["suporte_urgente"]},{id:"r-4",name:"Spam → Ocultar",description:"Oculta comentários de spam.",priority:1,isActive:true,triggerType:"classification",actionType:"ignore",useAiPersonalization:false,delaySeconds:5,maxRepliesPerDay:500,repliesToday:8,totalMatches:156,totalRepliesSent:0,replyTemplates:[],crmTags:[]},{id:"r-5",name:"Dúvida → Resposta IA",description:"Responde dúvidas com IA.",priority:30,isActive:true,triggerType:"classification",actionType:"reply_public",useAiPersonalization:true,delaySeconds:30,maxRepliesPerDay:150,repliesToday:22,totalMatches:198,totalRepliesSent:190,replyTemplates:["Oi @{{username}}!"],crmTags:["duvida_produto"]}];
const FLOWS = [{id:"f-1",name:"Boas-vindas DM",description:"Fluxo de boas-vindas para novas DMs.",trigger:"new_dm",status:"active",useAi:true,totalSessions:245,totalCompleted:198,totalEscalated:32,steps:[{},{},{},{}]},{id:"f-2",name:"Consulta de Preço",description:"Fluxo quando cliente pergunta sobre preço.",trigger:"keyword",status:"active",useAi:true,totalSessions:167,totalCompleted:143,totalEscalated:18,steps:[{},{},{},{},{}]},{id:"f-3",name:"Suporte Pós-Venda",description:"Atendimento para problemas com pedidos.",trigger:"keyword",status:"active",useAi:false,totalSessions:89,totalCompleted:45,totalEscalated:38,steps:[{},{},{},{},{},{}]},{id:"f-4",name:"Parceria / Influencer",description:"Fluxo para propostas de parceria.",trigger:"comment_escalation",status:"paused",useAi:false,totalSessions:34,totalCompleted:28,totalEscalated:6,steps:[{},{}]}];

// ── Color Maps ─────────────────────────────────────────────────────────
const classLabels = {duvida:"Dúvida",elogio:"Elogio",preco:"Preço",interesse:"Interesse",reclamacao:"Reclamação",spam:"Spam",suporte:"Suporte",parceria:"Parceria"};
const classColors = {duvida:"#3b82f6",elogio:"#22c55e",preco:"#f59e0b",interesse:"#8b5cf6",reclamacao:"#ef4444",spam:"#6b7280",suporte:"#06b6d4",parceria:"#ec4899"};
const classBg = {duvida:"bg-blue-100 text-blue-800",elogio:"bg-green-100 text-green-800",preco:"bg-orange-100 text-orange-800",interesse:"bg-purple-100 text-purple-800",reclamacao:"bg-red-100 text-red-800",spam:"bg-gray-100 text-gray-800",suporte:"bg-cyan-100 text-cyan-800",parceria:"bg-pink-100 text-pink-800"};
const statusLabels = {pending:"Pendente",auto_replied:"Auto-reply",dm_invited:"DM Enviada",escalated:"Escalado",ignored:"Ignorado",manually_replied:"Resp. Manual"};
const statusBg = {pending:"bg-yellow-100 text-yellow-800",auto_replied:"bg-blue-100 text-blue-800",dm_invited:"bg-purple-100 text-purple-800",escalated:"bg-red-100 text-red-800",ignored:"bg-gray-100 text-gray-600",manually_replied:"bg-green-100 text-green-800"};
const sessionStatusCfg = {active:{label:"Ativa",cls:"bg-green-100 text-green-800"},waiting_reply:{label:"Aguardando",cls:"bg-blue-100 text-blue-800"},escalated:{label:"Escalada",cls:"bg-red-100 text-red-800"},human_takeover:{label:"Humano",cls:"bg-purple-100 text-purple-800"},completed:{label:"Concluída",cls:"bg-gray-100 text-gray-600"}};
const triggerLabels = {classification:"Classificação IA",keyword:"Palavra-chave",sentiment:"Sentimento",purchase_intent:"Intenção Compra",all_comments:"Todos"};
const actionLabels = {reply_public:"Resp. Pública",reply_dm:"Enviar DM",reply_both:"Público + DM",escalate:"Escalar",ignore:"Ignorar",tag_only:"Classificar"};
const actionBg = {reply_public:"bg-green-100 text-green-700",reply_dm:"bg-blue-100 text-blue-700",reply_both:"bg-purple-100 text-purple-700",escalate:"bg-red-100 text-red-700",ignore:"bg-gray-100 text-gray-500",tag_only:"bg-yellow-100 text-yellow-700"};
const flowTriggerLabels = {new_dm:"Nova DM",keyword:"Palavra-chave",comment_escalation:"Escalação",campaign_reply:"Campanha",manual:"Manual"};
const flowStatusCfg = {draft:{l:"Rascunho",c:"bg-gray-100 text-gray-600"},active:{l:"Ativo",c:"bg-green-100 text-green-700"},paused:{l:"Pausado",c:"bg-yellow-100 text-yellow-700"},archived:{l:"Arquivado",c:"bg-gray-50 text-gray-400"}};

// ── Sub-Components ─────────────────────────────────────────────────────
const KPI = ({title,value,color,sub,pulse}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-1">
      <div className={`w-2 h-2 rounded-full ${pulse?"animate-pulse":""}`} style={{backgroundColor:color}}/>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
    </div>
    <div className="text-2xl font-bold" style={{color}}>{value}</div>
    {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
  </div>
);

const SentimentBar = ({value}) => { const p = Math.max(0,Math.min(100,(value+1)*50)); const c = value<-0.3?"bg-red-500":value<0.3?"bg-yellow-500":"bg-green-500"; return <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${c}`} style={{width:`${p}%`}}/></div><span className="text-xs text-gray-500 w-8">{value.toFixed(1)}</span></div>; };
const IntentBar = ({value}) => { const p = Math.max(0,Math.min(100,value*100)); const c = value<0.3?"bg-blue-400":value<0.7?"bg-cyan-500":"bg-green-500"; return <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${c}`} style={{width:`${p}%`}}/></div><span className="text-xs text-gray-500 w-8">{(value*100).toFixed(0)}%</span></div>; };

// ── Pages ──────────────────────────────────────────────────────────────
function DashboardPage() {
  const comments = useMemo(()=>genComments(8),[]);
  const sessions = useMemo(()=>genSessions(6),[]);
  const pendingCount = useMemo(()=>genComments(40).filter(c=>c.actionStatus==="pending").length,[]);
  const activeSessions = sessions.filter(s=>["active","waiting_reply","escalated"].includes(s.status));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instagram Dashboard</h1>
        <p className="text-sm text-gray-500">Automação, métricas e CRM em tempo real</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Pendentes" value={pendingCount} color="#f59e0b" sub="Aguardando" pulse/>
        <KPI title="Conversas Abertas" value={activeSessions.length} color="#3b82f6" sub="DMs ativas" pulse/>
        <KPI title="Tempo Médio" value={`${METRICS.responseTimeAvg}s`} color="#22c55e" sub="Resposta"/>
        <KPI title="Conversão" value={`${(METRICS.conversionRate*100).toFixed(1)}%`} color="#6366f1" sub="Prospect→Cliente"/>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Comentários" value={METRICS.totalComments.toLocaleString()} color="#3b82f6" sub="30d"/>
        <KPI title="DMs" value={METRICS.totalDMs.toLocaleString()} color="#22c55e" sub="30d"/>
        <KPI title="Auto-Replies" value={METRICS.totalAutoReplies.toLocaleString()} color="#6366f1" sub="Automáticos"/>
        <KPI title="Escalados" value={METRICS.totalEscalated} color="#ef4444" sub="Para humano"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 text-gray-900">Classificação de Comentários</h3>
          <div className="space-y-3">
            {METRICS.topClassifications.map(item=>{const max=METRICS.topClassifications[0].count;return(
              <div key={item.classification} className="flex items-center gap-3">
                <span className="text-xs w-24 text-right text-gray-500">{classLabels[item.classification]}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-end pr-2 text-xs text-white font-semibold transition-all duration-700" style={{width:`${(item.count/max)*100}%`,backgroundColor:classColors[item.classification],minWidth:"2.5rem"}}>{item.count}</div>
                </div>
              </div>
            );})}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 text-gray-900">Comentários Recentes</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {comments.map(c=>(
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor:classColors[c.classification]}}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">@{c.igUsername}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">{classLabels[c.classification]}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusBg[c.actionStatus]||""}`}>{statusLabels[c.actionStatus]||c.actionStatus}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold mb-4 text-gray-900">Sessões de DM Ativas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="text-left text-gray-500 border-b"><th className="pb-3 font-medium">Usuário</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Msgs</th><th className="pb-3 font-medium">Última Msg</th><th className="pb-3 font-medium">Origem</th></tr></thead>
          <tbody>{activeSessions.map(s=>{const sc=sessionStatusCfg[s.status]||sessionStatusCfg.active;return(
            <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50"><td className="py-3 font-medium">@{s.igUsername}</td><td className="py-3"><span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${sc.cls}`}>{s.status==="active"&&<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>}{sc.label}</span></td><td className="py-3">{s.messageCount}</td><td className="py-3 text-gray-500 max-w-[200px] truncate">{s.lastUserMessage}</td><td className="py-3 text-gray-500">{s.origin}</td></tr>
          );})}</tbody></table>
        </div>
      </div>
    </div>
  );
}

function CommentsPage() {
  const [comments] = useState(()=>genComments(40));
  const [search,setSearch] = useState("");
  const [clsFilter,setClsFilter] = useState("all");
  const [statusFilter,setStatusFilter] = useState("all");
  const filtered = useMemo(()=>comments.filter(c=>{
    const ms = c.text.toLowerCase().includes(search.toLowerCase())||c.igUsername.toLowerCase().includes(search.toLowerCase());
    const mc = clsFilter==="all"||c.classification===clsFilter;
    const mt = statusFilter==="all"||c.actionStatus===statusFilter;
    return ms&&mc&&mt;
  }),[comments,search,clsFilter,statusFilter]);
  const uniqueCls = [...new Set(comments.map(c=>c.classification))];
  const uniqueStatus = [...new Set(comments.map(c=>c.actionStatus))];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Comentários</h1><p className="text-sm text-gray-500">Gerenciar e responder comentários do Instagram</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label><input type="text" placeholder="Texto ou usuário..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Classificação</label><select value={clsFilter} onChange={e=>setClsFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="all">Todas</option>{uniqueCls.map(c=><option key={c} value={c}>{classLabels[c]}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="all">Todos</option>{uniqueStatus.map(s=><option key={s} value={s}>{statusLabels[s]}</option>)}</select></div>
          <div className="flex items-end"><span className="text-sm text-gray-500">{filtered.length} de {comments.length} comentários</span></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left font-semibold text-gray-700">Usuário</th><th className="px-4 py-3 text-left font-semibold text-gray-700">Comentário</th><th className="px-4 py-3 text-left font-semibold text-gray-700">Classificação</th><th className="px-4 py-3 text-left font-semibold text-gray-700">Sentimento</th><th className="px-4 py-3 text-left font-semibold text-gray-700">Intenção</th><th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th><th className="px-4 py-3 text-left font-semibold text-gray-700">Ações</th></tr></thead>
          <tbody className="divide-y divide-gray-100">{filtered.map(c=>(
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3"><div className="font-medium text-gray-900">@{c.igUsername}</div><div className="text-xs text-gray-400">{c.id}</div></td>
              <td className="px-4 py-3 max-w-xs"><p className="text-gray-700 line-clamp-2">{c.text}</p></td>
              <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded text-xs font-medium ${classBg[c.classification]}`}>{classLabels[c.classification]}</span></td>
              <td className="px-4 py-3 w-32"><SentimentBar value={c.sentiment}/></td>
              <td className="px-4 py-3 w-32"><IntentBar value={c.purchaseIntent}/></td>
              <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBg[c.actionStatus]}`}>{statusLabels[c.actionStatus]}</span></td>
              <td className="px-4 py-3"><div className="flex gap-1"><button className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs hover:bg-blue-100">Responder</button><button className="px-2 py-1 rounded bg-gray-50 text-gray-600 text-xs hover:bg-gray-100">Ocultar</button></div></td>
            </tr>
          ))}</tbody></table>
        </div>
        {filtered.length===0&&<div className="px-4 py-8 text-center text-gray-400">Nenhum comentário encontrado.</div>}
      </div>
    </div>
  );
}

function InboxPage() {
  const [sessions] = useState(()=>genSessions(12));
  const [selected,setSelected] = useState(null);
  const [filter,setFilter] = useState("all");
  const filtered = sessions.filter(s=>filter==="all"||s.status===filter);
  const mockMsgs = selected ? [
    {dir:"recebida",content:selected.lastUserMessage,time:selected.lastActivityAt},
    {dir:"enviada",content:selected.lastBotMessage,time:new Date(new Date(selected.lastActivityAt).getTime()+30000).toISOString()},
    {dir:"recebida",content:"Qual o prazo de entrega?",time:new Date(new Date(selected.lastActivityAt).getTime()+60000).toISOString()},
    {dir:"enviada",content:"Entregamos em até 3 dias úteis para sua região!",time:new Date(new Date(selected.lastActivityAt).getTime()+90000).toISOString()},
  ] : [];
  return (
    <div className="space-y-4" style={{height:"calc(100vh - 10rem)"}}>
      <div><h1 className="text-2xl font-bold text-gray-900">Inbox DMs</h1><p className="text-sm text-gray-500">Conversas do Instagram em tempo real</p></div>
      <div className="flex gap-4 h-full">
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="flex border-b px-2 pt-2">{[{k:"all",l:"Todas"},{k:"active",l:"Ativas"},{k:"escalated",l:"Escaladas"},{k:"human_takeover",l:"Humano"}].map(f=>(<button key={f.k} onClick={()=>setFilter(f.k)} className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${filter===f.k?"bg-indigo-600 text-white":"text-gray-500 hover:bg-gray-50"}`}>{f.l}</button>))}</div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">{filtered.map(s=>{const sc=sessionStatusCfg[s.status]||sessionStatusCfg.active;const isSel=selected?.id===s.id;return(
            <button key={s.id} onClick={()=>setSelected(s)} className={`w-full text-left p-3 rounded-lg transition-colors ${isSel?"bg-blue-50 border border-blue-200":"hover:bg-gray-50"}`}>
              <div className="flex items-center justify-between"><span className="font-medium text-sm">@{s.igUsername}</span><span className={`text-xs px-1.5 py-0.5 rounded ${sc.cls}`}>{sc.label}</span></div>
              <p className="text-xs text-gray-500 truncate mt-1">{s.lastUserMessage}</p>
              <div className="flex items-center justify-between mt-1"><span className="text-xs text-gray-400">{s.messageCount} msgs</span><span className="text-xs text-gray-400">{new Date(s.lastActivityAt).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span></div>
            </button>
          );})}{!filtered.length&&<div className="text-center py-12 text-sm text-gray-400">Nenhuma sessão</div>}</div>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {selected ? (<>
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div><span className="font-semibold">@{selected.igUsername}</span><span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${(sessionStatusCfg[selected.status]||sessionStatusCfg.active).cls}`}>{(sessionStatusCfg[selected.status]||sessionStatusCfg.active).label}</span></div>
              <div className="flex gap-2">{selected.status!=="human_takeover"&&<button className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">Assumir</button>}<button className="px-3 py-1.5 text-xs bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">Encerrar</button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">{mockMsgs.map((m,i)=>(
              <div key={i} className={`flex ${m.dir==="enviada"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${m.dir==="enviada"?"bg-indigo-600 text-white rounded-br-md":"bg-gray-100 text-gray-900 rounded-bl-md"}`}>
                  <p className="text-sm">{m.content}</p>
                  <p className={`text-xs mt-1 ${m.dir==="enviada"?"text-white/60":"text-gray-400"}`}>{new Date(m.time).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p>
                </div>
              </div>
            ))}</div>
            <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500 flex justify-between"><span>Origem: {selected.origin} | Msgs: {selected.messageCount}</span>{selected.assignedAgentId&&<span>Agente: {selected.assignedAgentId}</span>}</div>
          </>) : (
            <div className="flex-1 flex items-center justify-center text-gray-400"><div className="text-center"><p className="text-4xl mb-3">💬</p><p className="font-medium">Selecione uma conversa</p></div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Fluxos Conversacionais</h1><p className="text-sm text-gray-500">Automação de DMs com fluxos inteligentes</p></div><button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Novo Fluxo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{FLOWS.map(f=>{const sc=flowStatusCfg[f.status]||flowStatusCfg.draft;return(
        <div key={f.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold text-gray-900">{f.name}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${sc.c}`}>{sc.l}</span></div><button className={`p-1.5 rounded text-xs ${f.status==="active"?"bg-yellow-50 text-yellow-600 hover:bg-yellow-100":"bg-green-50 text-green-600 hover:bg-green-100"}`}>{f.status==="active"?"Pausar":"Ativar"}</button></div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{f.description}</p>
          <div className="flex items-center gap-2 mb-3"><span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">{flowTriggerLabels[f.trigger]||f.trigger}</span>{f.useAi&&<span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded">IA Ativa</span>}<span className="text-xs text-gray-400">{f.steps.length} steps</span></div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t"><div className="text-center"><div className="text-lg font-bold text-indigo-600">{f.totalSessions}</div><div className="text-xs text-gray-500">Sessões</div></div><div className="text-center"><div className="text-lg font-bold text-green-600">{f.totalCompleted}</div><div className="text-xs text-gray-500">Concluídas</div></div><div className="text-center"><div className="text-lg font-bold text-red-500">{f.totalEscalated}</div><div className="text-xs text-gray-500">Escaladas</div></div></div>
          <div className="flex gap-2 mt-3 pt-3 border-t"><button className="flex-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100 text-center">Editar</button><button className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100">Excluir</button></div>
        </div>
      );})}</div>
    </div>
  );
}

function RulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Regras Auto-Reply</h1><p className="text-sm text-gray-500">Configure respostas automáticas para comentários</p></div><button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Nova Regra</button></div>
      <div className="space-y-3">{RULES.map(r=>(
        <div key={r.id} className={`bg-white rounded-xl border border-gray-200 p-5 ${!r.isActive?"opacity-60":""}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3"><span className="text-lg font-bold text-gray-400 w-8">#{r.priority}</span><div><div className="flex items-center gap-2"><h3 className="font-semibold text-gray-900">{r.name}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${r.isActive?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{r.isActive?"Ativa":"Inativa"}</span></div><p className="text-sm text-gray-500 mt-1">{r.description}</p></div></div>
            <div className="flex gap-2"><button className={`px-3 py-1.5 text-xs rounded ${r.isActive?"bg-yellow-50 text-yellow-600 hover:bg-yellow-100":"bg-green-50 text-green-600 hover:bg-green-100"}`}>{r.isActive?"Desativar":"Ativar"}</button><button className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100">Excluir</button></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3"><span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded">Trigger: {triggerLabels[r.triggerType]||r.triggerType}</span><span className={`text-xs px-2 py-1 rounded ${actionBg[r.actionType]||"bg-gray-100"}`}>Ação: {actionLabels[r.actionType]||r.actionType}</span>{r.useAiPersonalization&&<span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded">IA Personalização</span>}<span className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded">Delay: {r.delaySeconds}s</span></div>
          {r.replyTemplates?.length>0&&<div className="mt-3 p-3 bg-gray-50 rounded-lg"><p className="text-xs font-medium text-gray-500 mb-1">Template:</p><p className="text-sm text-gray-700 italic">"{r.replyTemplates[0]}"</p></div>}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t text-xs text-gray-500"><span>Matches: <strong className="text-gray-900">{r.totalMatches}</strong></span><span>Replies: <strong className="text-gray-900">{r.totalRepliesSent}</strong></span><span>Hoje: <strong className="text-gray-900">{r.repliesToday}</strong>/{r.maxRepliesPerDay}</span>{r.crmTags?.length>0&&<span>Tags: {r.crmTags.join(", ")}</span>}</div>
        </div>
      ))}</div>
    </div>
  );
}

function SettingsPage() {
  const [accounts,setAccounts] = useState(ACCOUNTS);
  const [expanded,setExpanded] = useState(accounts[0]?.id);
  const toggle = (id,feat) => setAccounts(prev=>prev.map(a=>a.id===id?{...a,features:{...a.features,[feat]:!a.features[feat]}}:a));
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Contas</h1><p className="text-sm text-gray-500">Gerenciar contas do Instagram e configurações</p></div>
      <div className="flex justify-end"><button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Conectar nova conta</button></div>
      <div className="space-y-4">{accounts.map(a=>{const exp=expanded===a.id;const days=Math.ceil((new Date(a.tokenExpiresAt)-Date.now())/864e5);const tokenCls=days<0?"bg-red-100 text-red-800":days<14?"bg-orange-100 text-orange-800":"bg-green-100 text-green-800";const tokenTxt=days<0?"Expirado":days<14?`Expira em ${days}d`:`Válido ${days}d`;return(
        <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <button onClick={()=>setExpanded(exp?null:a.id)} className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">{a.username[0].toUpperCase()}</div>
              <div><h3 className="text-lg font-semibold text-gray-900">@{a.username}</h3><div className="flex items-center gap-3 mt-1"><span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Ativa</span><span className="text-xs text-gray-500">Conectada em {new Date(a.createdAt).toLocaleDateString("pt-BR")}</span></div></div>
            </div>
            <div className="flex items-center gap-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${tokenCls}`}>{tokenTxt}</span><span className="text-gray-400">{exp?"▼":"▶"}</span></div>
          </button>
          {exp&&<>
            <div className="border-t p-6 bg-gray-50 space-y-6">
              <div><h4 className="text-sm font-semibold text-gray-900 mb-3">Estatísticas</h4><div className="grid grid-cols-3 gap-4">{[["Comentários",a.totalCommentsProcessed],["DMs",a.totalDmsProcessed],["Auto-replies",a.totalAutoReplies]].map(([l,v])=><div key={l} className="bg-white rounded p-3 text-center border"><div className="text-xs text-gray-500 mb-1">{l}</div><div className="text-lg font-bold text-gray-900">{v}</div></div>)}</div></div>
              <div><h4 className="text-sm font-semibold text-gray-900 mb-3">Recursos</h4><div className="bg-white rounded p-4 space-y-2 border">{[["Auto-responder comentários","autoReplyComments"],["Auto-responder DMs","autoReplyDMs"],["Classificação com IA","aiClassification"]].map(([label,key])=>(
                <div key={key} className="flex items-center justify-between py-2"><span className="text-sm text-gray-700">{label}</span><button onClick={()=>toggle(a.id,key)} className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${a.features[key]?"bg-green-500":"bg-gray-300"}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${a.features[key]?"translate-x-6":"translate-x-1"} mt-1`}/></button></div>
              ))}</div></div>
            </div>
            <div className="border-t p-6 bg-white flex gap-2"><button className="flex-1 px-4 py-2 rounded bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100">Editar</button><button className="flex-1 px-4 py-2 rounded bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100">Renovar token</button><button className="px-4 py-2 rounded bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100">Desconectar</button></div>
          </>}
        </div>
      );})}</div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────
const NAV = [{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"comments",label:"Comentários",icon:"💬"},{id:"inbox",label:"Inbox DMs",icon:"📩"},{id:"flows",label:"Fluxos",icon:"🔄"},{id:"rules",label:"Auto-Reply",icon:"🤖"},{id:"settings",label:"Contas",icon:"⚙️"}];

export default function App() {
  const [page,setPage] = useState("dashboard");
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed inset-y-0 z-20 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{background:"linear-gradient(135deg,#833AB4,#E1306C,#F77737)"}}>IG</div>
            <div><div className="text-sm font-bold tracking-wide">IndustryOS 360</div><div className="text-[10px] text-white/50 uppercase tracking-widest">Instagram CRM</div></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">{NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${page===n.id?"bg-white/15 text-white":"text-slate-400 hover:bg-white/10 hover:text-white"}`}><span className="text-base">{n.icon}</span>{n.label}</button>
        ))}</nav>
        <div className="p-4 border-t border-white/10"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold">GT</div><div><div className="text-sm font-medium">GTzen</div><div className="text-xs text-white/50">Admin</div></div></div></div>
      </aside>
      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen"><div className="p-6 md:p-8">
        {page==="dashboard"&&<DashboardPage/>}
        {page==="comments"&&<CommentsPage/>}
        {page==="inbox"&&<InboxPage/>}
        {page==="flows"&&<FlowsPage/>}
        {page==="rules"&&<RulesPage/>}
        {page==="settings"&&<SettingsPage/>}
      </div></main>
    </div>
  );
}
