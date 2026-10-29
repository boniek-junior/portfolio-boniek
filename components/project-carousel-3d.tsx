'use client';
import * as React from 'react';
import {ArrowUpRight,X,ChevronUp,ChevronDown} from 'lucide-react';
import {AutoplayVideo} from '@/components/autoplay-video';

type Project={name:string;category:string;description:string;stack:string[];image?:string;video?:string;links:{label:string;href:string}[]};
type Props={projects:Project[];viewDetails:string;closeLabel:string;selectLabel:string};
const clamp=(v:number,lo:number,hi:number)=>Math.min(hi,Math.max(lo,v));
const rad=(v:number)=>v*Math.PI/180;
const CARD_H=.38,CARD_MAX_W=.34,CARD_RATIO=1.45,STEP=40,DRUM=2.22,LENS=2.7,RING_R=1.14,BOW=1.82,CULL=1.6,EASE=.12;

export function ProjectCarousel3D({projects,viewDetails,closeLabel,selectLabel}:Props){
 const stageRef=React.useRef<HTMLDivElement>(null);
 const wheelRef=React.useRef<HTMLDivElement>(null);
 const cardRefs=React.useRef<(HTMLButtonElement|null)[]>([]);
 const ringLabelRef=React.useRef<HTMLDivElement>(null);
 const drumTitleRef=React.useRef<HTMLDivElement>(null);
 const turn=React.useRef(0),target=React.useRef(0),drag=React.useRef<number|null>(null),settling=React.useRef<ReturnType<typeof setTimeout>|null>(null);
 const [stage,setStage]=React.useState({w:0,h:0});
 const [active,setActive]=React.useState(0);
 const [expanded,setExpanded]=React.useState(false);
 const [started,setStarted]=React.useState(false);
 const [reduced,setReduced]=React.useState(false);
 const count=projects.length,last=Math.max(count-1,0);
 React.useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)');const read=()=>setReduced(q.matches);read();q.addEventListener('change',read);return()=>q.removeEventListener('change',read);},[]);
 React.useEffect(()=>{const el=stageRef.current;if(!el)return;const read=()=>setStage({w:el.clientWidth,h:el.clientHeight});read();const ro=new ResizeObserver(read);ro.observe(el);return()=>ro.disconnect();},[]);
 const metrics=React.useMemo(()=>{const cardW=Math.min(stage.h*CARD_H*CARD_RATIO,stage.w*CARD_MAX_W);const cardH=cardW/CARD_RATIO;const ringR=cardH*RING_R;return{cardW,cardH,ringR,ringScale:count?clamp((2*Math.PI*ringR/count*.82)/(cardW||1),.16,1):1,drumR:cardH*DRUM,bow:cardH*BOW,depth:cardH*LENS};},[stage,count]);
 const to=React.useCallback((next:number)=>{target.current=clamp(next,0,last+1);setStarted(target.current>=.5);},[last]);
 const settle=React.useCallback(()=>{if(settling.current)clearTimeout(settling.current);settling.current=setTimeout(()=>to(Math.round(target.current)),140);},[to]);
 React.useEffect(()=>{if(!stage.h||!count)return;let frame=0;const draw=()=>{frame=requestAnimationFrame(draw);const gap=target.current-turn.current;turn.current=Math.abs(gap)<.0005?target.current:turn.current+gap*(reduced?1:EASE);
 const t=turn.current,m=clamp(t,0,1),pos=Math.max(0,t-1);
 if(wheelRef.current)wheelRef.current.style.transform=`translateZ(${-m*metrics.drumR}px)`;
 cardRefs.current.forEach((card,i)=>{if(!card)return;const d=i-pos,drumDeg=d*STEP,ringDeg=d*(360/count),bowX=-metrics.bow*(1-Math.cos(rad(drumDeg)));card.style.transform=`translateX(${m*bowX}px) rotateZ(${(1-m)*ringDeg}deg) translateY(${-(1-m)*metrics.ringR}px) rotateX(${m*drumDeg}deg) translateZ(${m*metrics.drumR}px)`;card.style.opacity=m>.5&&Math.abs(d)>CULL?'0':'1';card.style.zIndex=String(Math.round(100-Math.abs(d)*2));card.style.pointerEvents=m>.5&&Math.abs(d)>CULL?'none':'auto';const face=card.firstElementChild as HTMLElement|null;if(face)face.style.transform=`scale(${metrics.ringScale+(1-metrics.ringScale)*m})`;});
 if(ringLabelRef.current)ringLabelRef.current.style.opacity=String(1-m);
 if(drumTitleRef.current)drumTitleRef.current.style.opacity=String(m);
 const near=clamp(Math.round(pos),0,last);setActive(prev=>prev===near?prev:near);
 };frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);},[metrics,stage.h,count,last,reduced]);
 React.useEffect(()=>{const el=stageRef.current;if(!el)return;const onWheel=(e:WheelEvent)=>{if(expanded)return;const next=target.current+e.deltaY/900;if(next>0&&next<last+1){e.preventDefault();to(next);settle();}};el.addEventListener('wheel',onWheel,{passive:false});return()=>el.removeEventListener('wheel',onWheel);},[to,settle,last,expanded]);
 React.useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(false);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 React.useEffect(()=>()=>{if(settling.current)clearTimeout(settling.current);},[]);
 return <div className="relative mx-auto mt-10 w-full max-w-6xl">
 <div ref={stageRef} tabIndex={0} aria-label={selectLabel} className="relative h-[440px] w-full touch-pan-x select-none overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_50%_50%,#173c2b35,transparent_65%)] outline-none focus-visible:outline-2 focus-visible:outline-[#85e9b5] sm:h-[580px] md:h-[660px]" style={{perspective:metrics.depth||800}}
 onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag.current=e.clientY;e.currentTarget.setPointerCapture(e.pointerId);}}
 onPointerMove={e=>{if(drag.current===null)return;const delta=drag.current-e.clientY;if(Math.abs(delta)>2){to(target.current+delta/420);drag.current=e.clientY;}}}
 onPointerUp={()=>{drag.current=null;if(target.current>0)to(Math.max(1,Math.round(target.current)));}}
 onPointerCancel={()=>{drag.current=null;settle();}}
 onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){to(Math.round(target.current)+1);e.preventDefault();}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){to(Math.round(target.current)-1);e.preventDefault();}else if(e.key==='Enter'){if(target.current<.5)to(1);else setExpanded(true);e.preventDefault();}}}>
 <div aria-hidden className="pointer-events-none absolute inset-x-[20%] bottom-[15%] h-16 rounded-full bg-[#3ecf8e]/15 blur-3xl"/>
 <div ref={wheelRef} className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
 {projects.map((p,i)=><button key={p.name} ref={node=>{cardRefs.current[i]=node;}} type="button" aria-label={selectLabel+' '+p.name} onClick={()=>{if(target.current<.5){to(i+1);return;}if(active===i){setExpanded(true);}else to(i+1);}} className="group absolute cursor-pointer [backface-visibility:hidden] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#85e9b5]" style={{width:metrics.cardW,height:metrics.cardH,marginLeft:-metrics.cardW/2,marginTop:-metrics.cardH/2}}>
 <span className="relative block h-full w-full overflow-hidden rounded-xl border border-[#85e9b5]/25 bg-[#111a15] shadow-[0_18px_45px_#000a] transition-[border-color,transform] duration-200 group-hover:border-[#85e9b5]/80">
 {p.image?<img src={p.image} alt={p.name} draggable={false} onError={e=>{e.currentTarget.style.opacity="0";}} className="h-full w-full object-contain"/>:p.video?<video src={p.video} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-hidden="true"/>:<div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#27694c,transparent_70%)]"><span className="font-mono text-4xl font-bold tracking-tight text-[#85e9b5]">JUST / ANALYTICS</span></div>}
 <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-3 pt-12 text-left text-[clamp(10px,1.6vw,17px)] font-semibold text-white">{p.name}</span>
 </span></button>)}
 </div>
 <div ref={ringLabelRef} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"><span className="font-mono text-[10px] tracking-[.35em] text-[#85e9b5]">SELECTED WORK</span><span className="text-[clamp(26px,5vw,60px)] font-semibold tracking-[-.07em] text-white">Works / 26</span><span className="mt-3 font-mono text-[10px] tracking-[.15em] text-white/50">↓ SCROLL TO EXPLORE</span></div>
 <div ref={drumTitleRef} className="pointer-events-none absolute bottom-[4%] left-[4%] z-10 w-[min(58%,360px)] rounded-2xl border border-[#85e9b5]/20 bg-[#08120ee8] p-4 text-left opacity-0 shadow-[0_20px_55px_#0009] backdrop-blur-xl sm:bottom-auto sm:top-1/2 sm:w-[min(30%,310px)] sm:-translate-y-1/2 sm:p-6">
 <span className="font-mono text-[10px] tracking-[.2em] text-[#85e9b5]">{String(active+1).padStart(2,'0')} / {String(count).padStart(2,'0')} · {projects[active]?.category}</span>
 <h3 className="mt-3 text-xl font-semibold tracking-[-.05em] text-white sm:text-3xl">{projects[active]?.name}</h3>
 <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/65 sm:line-clamp-5 sm:text-sm sm:leading-6">{projects[active]?.description}</p>
 <div className="mt-4 hidden flex-wrap gap-1.5 sm:flex">{projects[active]?.stack.map(tech=><span key={tech} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/65">{tech}</span>)}</div>
 <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#85e9b5]">{viewDetails}<ArrowUpRight size={13}/></span>
 </div>
 <ol className="absolute right-[3%] top-[8%] z-10 space-y-2 text-right">{projects.map((p,i)=><li key={p.name}><button type="button" onClick={()=>to(i+1)} className={'font-mono text-[10px] transition-colors sm:text-xs '+(active===i&&started?'text-[#85e9b5]':'text-white/40 hover:text-white')}>{String(i+1).padStart(2,'0')} / {p.name}</button></li>)}</ol>
 </div>
 <div className="mt-4 flex items-center justify-center gap-5"><button type="button" aria-label="Previous project" onClick={()=>to(Math.max(1,Math.round(target.current)-1))} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:border-[#85e9b5]"><ChevronUp size={20}/></button><button type="button" onClick={()=>{if(target.current<.5)to(1);else setExpanded(true);}} className="rounded-full border border-[#85e9b5]/50 bg-[#85e9b5]/10 px-6 py-3 text-xs font-semibold tracking-[.1em] text-[#85e9b5] hover:bg-[#85e9b5]/20">{started?viewDetails:selectLabel}</button><button type="button" aria-label="Next project" onClick={()=>to(Math.min(last+1,Math.max(1,Math.round(target.current)+1)))} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:border-[#85e9b5]"><ChevronDown size={20}/></button></div>
     {expanded&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-8" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setExpanded(false);}}>
      <section role="dialog" aria-modal="true" aria-label={projects[active].name} className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#85e9b5]/30 bg-[#111915] text-left shadow-[0_30px_120px_#000]">
        <button type="button" onClick={()=>setExpanded(false)} aria-label={closeLabel} className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:text-[#85e9b5]"><X size={20}/></button>
        <div className="relative h-52 overflow-hidden bg-[#08110b] sm:h-80">{projects[active].image?<img src={projects[active].image} alt="" onError={e=>{e.currentTarget.style.opacity="0";}} className="h-full w-full object-contain"/>:projects[active].video?<AutoplayVideo src={projects[active].video!} className="h-full w-full object-cover" ariaLabel={projects[active].name}/>:<div className="h-full bg-[radial-gradient(circle_at_center,#3ecf8e45,transparent_65%)]"/>}<div className="absolute inset-0 bg-gradient-to-t from-[#111915] to-transparent"/></div>
        <div className="relative -mt-8 px-6 pb-9 sm:px-10"><span className="font-mono text-xs tracking-[.2em] text-[#85e9b5]">{projects[active].category}</span><h3 className="mt-3 text-4xl font-semibold tracking-[-.06em] sm:text-6xl">{projects[active].name}</h3><p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{projects[active].description}</p><div className="mt-7 flex flex-wrap gap-2">{projects[active].stack.map(item=><span key={item} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/75">{item}</span>)}</div><div className="mt-8 flex flex-wrap gap-4">{projects[active].links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#85e9b5]/40 px-5 py-3 text-sm text-[#85e9b5] transition hover:bg-[#85e9b5] hover:text-[#08110b]">{link.label}<ArrowUpRight size={16}/></a>)}</div></div>
      </section>
    </div>}
 </div>;
}
