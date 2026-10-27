'use client';

import {useState} from 'react';
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import {Code2,GitBranch,Layers3,ArrowRight,CheckCircle2,MousePointer2} from 'lucide-react';

type NodeId='engineer'|'orchestrator'|'agentA'|'agentB';
type Node={id:NodeId;title:string;subtitle:string;description:string;index:string};
const nodes:Node[]=[
 {id:'engineer',title:'Engenheiro',subtitle:'Intenção e contexto',description:'Define o problema, estabelece restrições e valida o resultado. O julgamento técnico permanece humano.',index:'01'},
 {id:'orchestrator',title:'Orquestrador',subtitle:'Coordenação',description:'Organiza o fluxo de trabalho e distribui etapas entre agentes especializados.',index:'02'},
 {id:'agentA',title:'Agente A',subtitle:'Implementação',description:'Executa uma etapa especializada de desenvolvimento sob a coordenação do fluxo.',index:'03'},
 {id:'agentB',title:'Agente B',subtitle:'Revisão e apoio',description:'Colabora em outra etapa do processo, permitindo separar responsabilidades.',index:'04'},
];
const paths=['M 280 112 V 153','M 280 249 V 286 H 139 V 315','M 280 286 H 421 V 315'];
export function ArchitectureDiagram({labels}:{labels?:{engineer:string;orchestrator:string;agentA:string;agentB:string;note:string}}){
 const [active,setActive]=useState<NodeId>('orchestrator');
 const reduce=useReducedMotion();
 const selected=nodes.find(n=>n.id===active)!;
 const title=(id:NodeId)=>labels?.[id]||nodes.find(n=>n.id===id)!.title;
 return <div className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[28px] border border-[#3ecf8e]/25 bg-[#101712] p-4 text-left shadow-[0_35px_100px_rgba(0,0,0,.35),0_0_70px_rgba(62,207,142,.045)] sm:p-7">
  <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{backgroundImage:'radial-gradient(rgba(133,233,181,.18) 1px, transparent 1px)',backgroundSize:'23px 23px',maskImage:'linear-gradient(to bottom,black,transparent 90%)'}}/>
  <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
   <div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#85e9b5]">SYSTEM / ARCHITECTURE</p><p className="mt-2 text-sm font-medium text-white/80">Human-guided agent workflow</p></div>
   <span className="inline-flex items-center gap-2 rounded-full border border-[#3ecf8e]/20 bg-[#3ecf8e]/10 px-3 py-1.5 font-mono text-[10px] text-[#85e9b5]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#85e9b5]"/> LIVE FLOW</span>
  </div>
  <div className="relative mx-auto w-full max-w-[560px]" style={{aspectRatio:'560 / 424'}}>
   <svg viewBox="0 0 560 424" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
    <defs><linearGradient id="architecture-line" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3ecf8e" stopOpacity=".22"/><stop offset=".5" stopColor="#85e9b5" stopOpacity=".95"/><stop offset="1" stopColor="#3ecf8e" stopOpacity=".25"/></linearGradient></defs>
    {paths.map((d,i)=><g key={i}><path d={d} fill="none" stroke="#3ecf8e" strokeOpacity=".17" strokeWidth="2"/><motion.path d={d} fill="none" stroke="url(#architecture-line)" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 11" animate={reduce?{}:{strokeDashoffset:[36,0]}} transition={{duration:2.2,repeat:Infinity,ease:'linear'}}/><motion.circle r="4" fill="#85e9b5" style={{filter:'drop-shadow(0 0 5px #3ecf8e)'}} animate={reduce?{}:{opacity:[0,1,1,0]}} transition={{duration:2.5,repeat:Infinity,delay:i*.55}}><animateMotion dur="2.5s" repeatCount="indefinite" begin={i*.55+'s'} path={d}/></motion.circle></g>)}
   </svg>
   {([{id:'engineer',x:50,y:17,w:44},{id:'orchestrator',x:50,y:47,w:48},{id:'agentA',x:25,y:85,w:42},{id:'agentB',x:75,y:85,w:42}] as const).map(n=>{
    const Icon=n.id==='engineer'?Code2:n.id==='orchestrator'?GitBranch:Layers3;
    const isActive=active===n.id;
    return <motion.button key={n.id} type="button" aria-pressed={isActive} onClick={()=>setActive(n.id)} whileHover={reduce?undefined:{scale:1.035,y:-3}} whileTap={reduce?undefined:{scale:.98}} className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border px-1 py-2 text-center transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85e9b5] sm:rounded-2xl ${isActive?'border-[#85e9b5]/70 bg-[#193a2a] shadow-[0_0_35px_rgba(62,207,142,.18)]':'border-white/15 bg-[#18211b] hover:border-[#85e9b5]/45'}`} style={{left:n.x+'%',top:n.y+'%',width:n.w+'%',height:n.id==='engineer'?'24%':n.id==='orchestrator'?'23%':'23%'}}>
     <Icon className={`mb-1 h-4 w-4 sm:h-6 sm:w-6 ${isActive?'text-[#85e9b5]':'text-white/65'}`}/>
     <span className="text-[10px] font-semibold text-white sm:text-sm">{title(n.id)}</span>
     <span className="mt-1 hidden text-[9px] text-white/45 sm:block">{nodes.find(x=>x.id===n.id)?.subtitle}</span>
    </motion.button>;
   })}
  </div>
  <div className="relative mt-1 min-h-[124px] rounded-2xl border border-[#3ecf8e]/20 bg-[#0b110e]/90 p-4 sm:p-5" aria-live="polite">
   <AnimatePresence mode="wait"><motion.div key={active} initial={reduce?false:{opacity:0,y:9}} animate={{opacity:1,y:0}} exit={reduce?undefined:{opacity:0,y:-7}} transition={{duration:.22}}>
    <div className="flex items-center gap-3"><span className="font-mono text-[10px] text-[#85e9b5]">{selected.index} / 04</span><ArrowRight size={13} className="text-[#85e9b5]"/><strong className="text-sm font-semibold text-white">{title(active)}</strong></div>
    <p className="mt-3 text-xs leading-6 text-white/60 sm:text-sm">{selected.description}</p>
   </motion.div></AnimatePresence>
  </div>
  <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/35"><span className="inline-flex items-center gap-1.5"><MousePointer2 size={12}/> Clique nos nós para explorar</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#85e9b5]"/> {labels?.note||'Ilustração conceitual — não representa sistemas internos.'}</span></div>
 </div>;
}
