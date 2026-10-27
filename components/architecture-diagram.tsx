'use client';

import {useEffect,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Play,Pause,RotateCcw,Terminal,FileText,GitBranch,CheckCircle2,ArrowRight,MousePointer2,Code2} from 'lucide-react';

const stages=[
 {title:'Briefing',status:'context received',command:'$ maestri note read "Spec"',detail:'O engenheiro registra o objetivo e as restrições. O contexto fica acessível aos agentes.',highlight:'spec'},
 {title:'Delegação',status:'task dispatched',command:'$ maestri ask "Builder" "Implementar a tarefa"',detail:'O agente coordenador encaminha a tarefa ao agente de implementação, com o contexto necessário.',highlight:'builder'},
 {title:'Colaboração',status:'review requested',command:'$ maestri ask "Reviewer" "Revisar a entrega"',detail:'O resultado passa para um segundo agente, que analisa e devolve observações.',highlight:'reviewer'},
 {title:'Validação',status:'human approval',command:'$ maestri check "Builder"',detail:'O engenheiro acompanha a saída, revisa o trabalho e decide os próximos passos.',highlight:'human'}
] as const;
const nodes=[
 {id:'human',label:'Engenheiro',role:'Direção e validação',icon:Code2},
 {id:'spec',label:'Spec.md',role:'Contexto compartilhado',icon:FileText},
 {id:'builder',label:'Builder',role:'Agente de implementação',icon:Terminal},
 {id:'reviewer',label:'Reviewer',role:'Agente de revisão',icon:Terminal}
] as const;
const coords={human:[80,52],spec:[270,52],builder:[80,207],reviewer:[270,207]} as const;
const connections=[['human','spec'],['spec','builder'],['builder','reviewer'],['reviewer','human']] as const;
export function ArchitectureDiagram({labels}:{labels?:{engineer:string;orchestrator:string;agentA:string;agentB:string;note:string}}){
 const reduced=useReducedMotion();
 const [step,setStep]=useState(0);
 const [playing,setPlaying]=useState(false);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  const element=document.getElementById('maestri-architecture');
  if(!element)return;
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});
  observer.observe(element);return ()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  if(!playing||!visible||reduced)return;
  const timer=window.setInterval(()=>setStep(current=>(current+1)%stages.length),3800);
  return ()=>window.clearInterval(timer);
 },[playing,visible,reduced]);
 const current=stages[step];
 return <div id="maestri-architecture" className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] border border-[#3ecf8e]/25 bg-[#0b110e] text-left shadow-[0_30px_90px_#0007]">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25" style={{backgroundImage:'radial-gradient(#85e9b5 1px,transparent 1px)',backgroundSize:'22px 22px',maskImage:'linear-gradient(to bottom,black,transparent 75%)'}}/>
  <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
   <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl border border-[#3ecf8e]/35 bg-[#3ecf8e]/10"><GitBranch size={18} className="text-[#85e9b5]"/></div><div><p className="font-mono text-[10px] tracking-[.22em] text-[#85e9b5]">MAESTRI / WORKSPACE</p><p className="mt-1 text-xs text-white/50">Simulação de um fluxo multiagente</p></div></div>
   <div className="flex items-center gap-2"><span className="rounded-full border border-[#85e9b5]/20 bg-[#85e9b5]/5 px-3 py-1 font-mono text-[10px] text-[#85e9b5]">0{step+1} / 04</span><button type="button" onClick={()=>{setPlaying(false);setStep(0);}} aria-label="Reiniciar simulação" className="rounded-full border border-white/15 p-2 text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[#85e9b5]"><RotateCcw size={14}/></button><button type="button" onClick={()=>setPlaying(v=>!v)} aria-label={playing?'Pausar simulação':'Reproduzir simulação'} aria-pressed={playing} className="flex items-center gap-1.5 rounded-full border border-[#3ecf8e]/40 bg-[#3ecf8e]/15 px-3 py-2 text-xs text-[#85e9b5] focus-visible:outline-2 focus-visible:outline-[#85e9b5]">{playing?<Pause size={13}/>:<Play size={13}/>}<span>{playing?'Pausar':'Reproduzir'}</span></button></div>
  </div>
  <div className="relative grid gap-4 p-4 sm:grid-cols-[1fr_210px] sm:gap-5 sm:p-6">
   <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101a14]/85 p-3 sm:p-4">
    <div className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[.15em] text-white/40"><span>CANVAS / NODES</span><span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-[#85e9b5]"/> CONNECTED</span></div>
    <div className="relative mx-auto aspect-[350/290] w-full max-w-[350px]">
     <svg viewBox="0 0 350 290" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {connections.map(([a,b],i)=>{
       const p=coords[a],q=coords[b];
       const d=i===3?`M ${p[0]+48} ${p[1]+26} C 360 210, 360 50, ${q[0]+48} ${q[1]+26}`:`M ${p[0]+48} ${p[1]+26} C ${(p[0]+q[0])/2+48} ${p[1]+26}, ${(p[0]+q[0])/2+48} ${q[1]+26}, ${q[0]+48} ${q[1]+26}`;
       return <g key={a+b}><path d={d} stroke="#3ecf8e" strokeOpacity=".23" strokeWidth="1.5" fill="none" strokeDasharray="4 5"/>{step===i&&<motion.path d={d} fill="none" stroke="#85e9b5" strokeWidth="2" strokeLinecap="round" initial={reduced?false:{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:1.8,ease:'easeInOut'}} style={{filter:'drop-shadow(0 0 4px #3ecf8e)'}}/>}</g>;
      })}
     </svg>
     {nodes.map((node)=>{
      const Icon=node.icon;
      const position=coords[node.id];
      const focused=node.id===current.highlight||(step===0&&node.id==='human')||(step===1&&node.id==='spec')||(step===2&&node.id==='builder')||(step===3&&node.id==='reviewer');
      return <motion.div key={node.id} animate={reduced?{}:{y:focused?-3:0}} className={`absolute flex h-[78px] w-[112px] flex-col justify-center rounded-xl border px-2 shadow-[0_10px_25px_#0007] transition-colors duration-300 sm:w-[128px] ${focused?'border-[#85e9b5]/75 bg-[#1b3928]':'border-white/15 bg-[#18231c]'}`} style={{left:`${position[0]/350*100}%`,top:`${position[1]/290*100}%`}}>
       <div className="flex items-center gap-1.5"><Icon size={13} className={focused?'text-[#85e9b5]':'text-white/55'}/><span className="truncate text-[11px] font-semibold text-white">{node.id==='human'?labels?.engineer||node.label:node.label}</span></div><span className="mt-2 text-[9px] leading-tight text-white/45">{node.role}</span>{focused&&<motion.span layoutId="maestri-node-indicator" className="absolute -right-1.5 -top-1.5 size-3 rounded-full border-2 border-[#0b110e] bg-[#85e9b5] shadow-[0_0_15px_#3ecf8e]"/>}
      </motion.div>;
     })}
    </div>
   </div>
   <div className="flex min-w-0 flex-col gap-3">
    <div className="rounded-xl border border-[#3ecf8e]/20 bg-[#132018] p-4"><p className="font-mono text-[10px] tracking-[.15em] text-[#85e9b5]">ACTIVE STEP</p><AnimatePresence mode="wait"><motion.div key={step} initial={reduced?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-8}} transition={{duration:.25}}><h3 className="mt-3 text-lg font-semibold text-white">{current.title}</h3><p className="mt-2 text-xs leading-5 text-white/55">{current.detail}</p></motion.div></AnimatePresence></div>
    <div className="flex-1 rounded-xl border border-white/10 bg-[#070c09] p-3 font-mono"><div className="flex items-center gap-1.5 border-b border-white/10 pb-2"><span className="size-1.5 rounded-full bg-[#f87171]/70"/><span className="size-1.5 rounded-full bg-[#facc15]/70"/><span className="size-1.5 rounded-full bg-[#85e9b5]/70"/><span className="ml-2 text-[9px] text-white/40">terminal / demo</span></div><AnimatePresence mode="wait"><motion.div key={step} initial={reduced?false:{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><p className="mt-4 break-words text-[10px] leading-5 text-[#85e9b5]">{current.command}</p><p className="mt-3 text-[10px] text-white/45">✓ {current.status}</p></motion.div></AnimatePresence></div>
   </div>
  </div>
  <div className="relative border-t border-white/10 px-4 py-4 sm:px-6"><div className="grid grid-cols-4 gap-2">{stages.map((stage,i)=><button type="button" key={stage.title} onClick={()=>{setPlaying(false);setStep(i);}} aria-current={step===i?'step':undefined} className="group text-left focus-visible:outline-2 focus-visible:outline-[#85e9b5]"><span className={`mb-2 block h-1 rounded-full transition-colors ${step===i?'bg-[#85e9b5]':i<step?'bg-[#3ecf8e]/50':'bg-white/10'}`}/><span className={`text-[9px] sm:text-[11px] ${step===i?'text-[#85e9b5]':'text-white/40'}`}>{stage.title}</span></button>)}</div><p className="mt-4 flex items-center gap-1.5 text-[10px] leading-5 text-white/40"><MousePointer2 size={12}/> Clique nas etapas ou use Reproduzir para acompanhar o fluxo.</p><p className="mt-1 text-[10px] leading-5 text-white/35">{labels?.note||'Simulação conceitual inspirada no Maestri; não representa um ambiente real ou arquitetura interna.'}</p></div>
 </div>;
}
