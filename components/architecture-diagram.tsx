'use client';

import {useEffect,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Play,Pause,RotateCcw,Terminal,FileText,GitBranch,MousePointer2,Code2,CheckCircle2,ArrowUpRight} from 'lucide-react';

const steps=[
 {title:'Briefing',subtitle:'Contexto compartilhado',command:'maestri note read "Spec"',result:'✓ Contexto carregado',detail:'O engenheiro define a intenção. A especificação fica disponível para todos os agentes.',from:'human',to:'spec'},
 {title:'Delegação',subtitle:'Tarefa enviada',command:'maestri ask "Builder" "Implementar"',result:'✓ Builder iniciou a tarefa',detail:'O agente recebe o contexto, interpreta os requisitos e inicia a implementação.',from:'spec',to:'builder'},
 {title:'Colaboração',subtitle:'Revisão em andamento',command:'maestri ask "Reviewer" "Revisar"',result:'✓ Revisão solicitada',detail:'O segundo agente analisa a entrega e envia observações para melhorar a solução.',from:'builder',to:'reviewer'},
 {title:'Validação',subtitle:'Decisão humana',command:'maestri check "Builder"',result:'✓ Resultado disponível',detail:'O engenheiro inspeciona a saída e decide se o trabalho está pronto.',from:'reviewer',to:'human'}
] as const;
const nodes=[
 {id:'human',name:'Engenheiro',caption:'Direção & aprovação',icon:Code2,number:'01'},
 {id:'spec',name:'Spec.md',caption:'Memória compartilhada',icon:FileText,number:'02'},
 {id:'builder',name:'Builder',caption:'Implementação',icon:Terminal,number:'03'},
 {id:'reviewer',name:'Reviewer',caption:'Qualidade & revisão',icon:Terminal,number:'04'}
] as const;
const links=[
 'M 25 26 C 42 26, 58 26, 75 26',
 'M 75 26 C 94 26, 94 74, 25 74',
 'M 25 74 C 42 74, 58 74, 75 74',
 'M 75 74 C 105 74, 105 5, 25 26'
];
export function ArchitectureDiagram({labels}:{labels?:{engineer:string;orchestrator:string;agentA:string;agentB:string;note:string}}){
 const reduced=useReducedMotion();
 const [step,setStep]=useState(0);
 const [playing,setPlaying]=useState(true);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  const element=document.getElementById('maestri-architecture');if(!element)return;
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.12});
  observer.observe(element);return ()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  if(!playing||!visible||reduced)return;
  const timer=window.setInterval(()=>setStep(s=>(s+1)%steps.length),4300);
  return ()=>window.clearInterval(timer);
 },[playing,visible,reduced]);
 const current=steps[step];
 return <div id="maestri-architecture" className="relative mx-auto w-full min-w-0 max-w-[900px] overflow-hidden rounded-[28px] border border-[#3ecf8e]/25 bg-[#0a100d] text-left shadow-[0_35px_110px_#0008,0_0_55px_#3ecf8e09]">
  <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" style={{backgroundImage:'radial-gradient(#3ecf8e 0.7px,transparent 0.7px)',backgroundSize:'22px 22px',maskImage:'linear-gradient(to bottom,black,transparent 85%)'}}/>
  <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
   <div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#3ecf8e]/35 bg-[#3ecf8e]/10"><GitBranch size={19} className="text-[#85e9b5]"/></div><div className="min-w-0"><p className="font-mono text-[10px] font-semibold tracking-[.16em] text-[#85e9b5]">MAESTRI / LIVE WORKSPACE</p><p className="mt-1 text-[11px] text-white/50">Orquestração de agentes • demonstração interativa</p></div></div>
   <div className="flex shrink-0 items-center gap-2"><span className="rounded-full border border-[#85e9b5]/20 bg-[#85e9b5]/5 px-3 py-1.5 font-mono text-[10px] text-[#85e9b5]">0{step+1} / 04</span><button type="button" onClick={()=>{setStep(0);setPlaying(true);}} aria-label="Reiniciar fluxo" className="rounded-full border border-white/15 p-2.5 text-white/65 transition-colors hover:border-[#85e9b5]/50 hover:text-white focus-visible:outline-2 focus-visible:outline-[#85e9b5]"><RotateCcw size={14}/></button><button type="button" onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pausar':'Reproduzir'} className="flex items-center gap-2 rounded-full border border-[#3ecf8e]/40 bg-[#3ecf8e]/15 px-3 py-2 text-xs text-[#85e9b5] transition-colors hover:bg-[#3ecf8e]/25 focus-visible:outline-2 focus-visible:outline-[#85e9b5]">{playing?<Pause size={13}/>:<Play size={13}/>} {playing?'Pausar':'Play'}</button></div>
  </div>
  <div className="relative grid min-w-0 gap-4 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] md:gap-5 md:p-5">
   <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101a14]/85 p-3 sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-2 font-mono text-[9px] tracking-[.14em] text-white/45"><span>CANVAS / AGENTS</span><span className="inline-flex items-center gap-1.5 text-[#85e9b5]"><span className="size-1.5 animate-pulse rounded-full bg-[#85e9b5]"/> CONNECTED</span></div>
    <div className="relative min-h-[280px] w-full sm:min-h-[330px]">
     <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {links.map((path,i)=><g key={path}><path d={path} stroke="#3ecf8e" strokeOpacity=".22" strokeWidth=".65" strokeDasharray="1.2 1.2" fill="none"/>{step===i&&<motion.path d={path} fill="none" stroke="#85e9b5" strokeWidth="1.15" strokeLinecap="round" initial={reduced?false:{pathLength:0,opacity:.2}} animate={{pathLength:1,opacity:1}} transition={{duration:2.3,ease:'easeInOut'}} style={{filter:'drop-shadow(0 0 2px #85e9b5)'}}/>}</g>)}
     </svg>
     <div className="relative grid h-full min-h-[280px] grid-cols-2 grid-rows-2 gap-x-[12%] gap-y-14 px-1 py-5 sm:min-h-[330px] sm:gap-x-[18%] sm:gap-y-20 sm:px-4">
      {nodes.map(node=>{
       const Icon=node.icon;
       const focus=node.id===current.from||node.id===current.to;
       const destination=node.id===current.to;
       return <motion.button key={node.id} type="button" onClick={()=>{const index=steps.findIndex(s=>s.to===node.id);setStep(index>=0?index:0);setPlaying(false);}} whileHover={reduced?undefined:{y:-4,scale:1.02}} whileTap={reduced?undefined:{scale:.98}} className={`relative z-10 flex min-w-0 flex-col justify-center rounded-xl border px-2 py-3 text-left shadow-[0_10px_30px_#0008] transition-[border-color,background-color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#85e9b5] sm:rounded-2xl sm:px-4 ${destination?'border-[#85e9b5] bg-[#1a3a28] shadow-[0_0_32px_#3ecf8e28]':focus?'border-[#85e9b5]/40 bg-[#192b20]':'border-white/15 bg-[#17211b] hover:border-[#85e9b5]/50'}`}>
        <div className="flex items-center justify-between gap-1"><Icon size={18} className={focus?'text-[#85e9b5]':'text-white/50'}/><span className="font-mono text-[9px] text-white/25">{node.number}</span></div>
        <strong className="mt-3 truncate text-[12px] text-white sm:text-sm">{node.id==='human'?labels?.engineer||node.name:node.name}</strong>
        <span className="mt-1 text-[9px] leading-4 text-white/45 sm:text-[10px]">{node.caption}</span>
        {destination&&<motion.span layoutId="maestri-focus" className="absolute -right-1.5 -top-1.5 size-3 rounded-full border-2 border-[#0a100d] bg-[#85e9b5] shadow-[0_0_18px_#3ecf8e]"/>}
       </motion.button>;
      })}
     </div>
    </div>
   </div>
   <div className="flex min-w-0 flex-col gap-3">
    <div className="relative min-h-[172px] overflow-hidden rounded-2xl border border-[#3ecf8e]/20 bg-[#14231a] p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><p className="font-mono text-[10px] tracking-[.13em] text-[#85e9b5]">CURRENT OPERATION</p><CheckCircle2 size={14} className="text-[#85e9b5]"/></div><AnimatePresence mode="wait"><motion.div key={step} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-10}} transition={{duration:.28}}><h3 className="mt-4 text-xl font-semibold text-white">{current.title}</h3><p className="mt-1 font-mono text-[10px] text-[#85e9b5]/75">{current.subtitle}</p><p className="mt-4 text-xs leading-6 text-white/60">{current.detail}</p></motion.div></AnimatePresence></div>
    <div className="min-h-[170px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#050907] p-4 font-mono"><div className="flex items-center gap-1.5 border-b border-white/10 pb-3"><span className="size-2 rounded-full bg-[#f87171]/70"/><span className="size-2 rounded-full bg-[#facc15]/70"/><span className="size-2 rounded-full bg-[#85e9b5]/70"/><span className="ml-2 text-[10px] text-white/40">maestri — terminal</span></div><AnimatePresence mode="wait"><motion.div key={step} initial={reduced?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}><p className="mt-5 break-words text-[11px] leading-6 text-[#85e9b5]"><span className="text-white/35">$ </span>{current.command}<span className="ml-1 inline-block h-3 w-1 animate-pulse bg-[#85e9b5] align-middle"/></p><p className="mt-4 text-[10px] text-white/50">{current.result}</p></motion.div></AnimatePresence></div>
   </div>
  </div>
  <div className="relative border-t border-white/10 px-4 py-4 sm:px-6"><div className="grid grid-cols-4 gap-2">{steps.map((s,i)=><button type="button" key={s.title} onClick={()=>{setStep(i);setPlaying(false);}} aria-current={step===i?'step':undefined} className="min-w-0 text-left focus-visible:outline-2 focus-visible:outline-[#85e9b5]"><span className={`mb-2 block h-1 rounded-full transition-colors ${step===i?'bg-[#85e9b5]':i<step?'bg-[#3ecf8e]/40':'bg-white/10'}`}/><span className={`text-[10px] sm:text-xs ${step===i?'text-[#85e9b5]':'text-white/45'}`}>{s.title}</span></button>)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="flex items-center gap-1.5 text-[10px] text-white/45"><MousePointer2 size={12}/> Selecione agentes ou etapas para explorar</p><span className="inline-flex items-center gap-1 text-[10px] text-[#85e9b5]/65">LIVE DEMO <ArrowUpRight size={12}/></span></div><p className="mt-2 text-[10px] leading-5 text-white/35">{labels?.note||'Fluxo conceitual inspirado no Maestri; não representa sistemas internos.'}</p></div>
 </div>;
}
