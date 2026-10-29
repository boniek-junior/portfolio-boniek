'use client';

import * as React from 'react';
import {ArrowUpRight, X} from 'lucide-react';
import {AutoplayVideo} from '@/components/autoplay-video';

type Project = {name:string;category:string;description:string;stack:string[];image?:string;video?:string;links:{label:string;href:string}[]};
type Props = {projects:Project[];viewDetails:string;closeLabel:string;selectLabel:string;heading:string;subtitle:string;locale:string};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const smooth=(a:number,b:number,t:number)=>a+(b-a)*t;

export function ProjectCarousel3D({projects,viewDetails,closeLabel,selectLabel,heading,subtitle,locale}:Props){
 const outer=React.useRef<HTMLElement>(null);
 const progress=React.useRef(0);
 const desired=React.useRef(0);
 const [current,setCurrent]=React.useState(0);
 const [opened,setOpened]=React.useState<number|null>(null);
 const [reduced,setReduced]=React.useState(false);
 const closeRef=React.useRef<HTMLButtonElement>(null);
 const returnFocus=React.useRef<HTMLElement|null>(null);
 const cardRefs=React.useRef<(HTMLButtonElement|null)[]>([]);
 const count=projects.length;
 React.useEffect(()=>{
   const media=window.matchMedia('(prefers-reduced-motion: reduce)');
   const update=()=>setReduced(media.matches);update();
   media.addEventListener('change',update);
   return()=>media.removeEventListener('change',update);
 },[]);
 React.useEffect(()=>{
   if(window.matchMedia('(max-width: 767px)').matches)return;
   let raf=0;
   const update=()=>{
     const el=outer.current;
     if(!el)return;
     const rect=el.getBoundingClientRect();
     const available=Math.max(1,rect.height-window.innerHeight);
     desired.current=clamp(-rect.top/available,0,1)*Math.max(0,count-1);
   };
   const frame=()=>{
     const delta=desired.current-progress.current;
     progress.current=Math.abs(delta)<.0005?desired.current:smooth(progress.current,desired.current,reduced?1:.065);
     const focus=progress.current;
     const nearest=clamp(Math.round(focus),0,count-1);
     setCurrent(prev=>prev===nearest?prev:nearest);
     const narrow=window.innerWidth<768;
     cardRefs.current.forEach((card,i)=>{
       if(!card)return;
       const d=i-focus;
       const abs=Math.abs(d);
       const depth=-(abs*205);
       const y=d*(narrow?190:275);
       const x=-(Math.min(abs,2.5))*(narrow?16:34);
       const tilt=clamp(-d*16,-35,35);
       const scale=1-Math.min(abs,2.5)*.13;
       card.style.transform=`translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${depth}px) rotateX(${tilt}deg) rotateY(${-clamp(d,-2,2)*7}deg) scale(${scale})`;
       card.style.opacity=String(clamp(1-Math.max(0,abs-1.2)*.72,.08,1));
       card.style.zIndex=String(100-Math.round(abs*10));
       card.style.pointerEvents=abs<1.35?'auto':'none';
       card.style.filter=`brightness(${clamp(1-abs*.23,.5,1)}) saturate(${clamp(1-abs*.14,.6,1)})`;
     });
     raf=requestAnimationFrame(frame);
   };
   update();raf=requestAnimationFrame(frame);
   window.addEventListener('scroll',update,{passive:true});
   window.addEventListener('resize',update);
   return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
 },[count,reduced]);
 React.useEffect(()=>{
   if(opened===null)return;
   const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpened(null);};
   document.addEventListener('keydown',onKey);
   returnFocus.current=document.activeElement as HTMLElement;
   requestAnimationFrame(()=>closeRef.current?.focus());
   const previous=document.body.style.overflow;
   document.body.style.overflow='hidden';
   return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=previous;returnFocus.current?.focus();};
 },[opened]);
 const focusProject=(i:number)=>{
   const el=outer.current;if(!el)return;
   const top=window.scrollY+el.getBoundingClientRect().top;
   const travel=Math.max(0,el.offsetHeight-window.innerHeight);
   window.scrollTo({top:top+(i/Math.max(1,count-1))*travel,behavior:reduced?'instant':'smooth'});
 };
 return <>
 <section className="bg-[#050908] px-5 pb-16 pt-24 md:hidden" aria-label={heading}>
  <p className="font-mono text-xs tracking-[.2em] text-[#85e9b5]">01 / {locale==='pt'?'PROJETOS':'PROJECTS'}</p>
  <h2 className="mt-3 text-4xl font-semibold tracking-[-.06em] text-white">{heading}</h2>
  <p className="mt-4 max-w-md text-sm leading-7 text-white/65">{subtitle}</p>
  <div className="mt-8 grid gap-5">{projects.map((p,i)=><button key={p.name} type="button" onClick={()=>setOpened(i)} aria-label={selectLabel+' '+p.name} className="overflow-hidden rounded-2xl border border-[#85e9b5]/25 bg-[#101813] text-left focus-visible:outline-2 focus-visible:outline-[#85e9b5]">
   <div className="relative h-48 overflow-hidden bg-[#0a1310]">{p.image?<img src={p.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover"/>:p.video?<video src={p.video} muted playsInline preload="none" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-2xl font-bold text-[#85e9b5]">{p.name}</div>}<div className="absolute inset-0 bg-gradient-to-t from-[#07110b] to-transparent"/></div>
   <div className="p-5"><p className="font-mono text-xs uppercase tracking-[.12em] text-[#85e9b5]">{String(i+1).padStart(2,'0')} / {p.category}</p><h3 className="mt-2 text-2xl font-semibold text-white">{p.name}</h3><p className="mt-2 text-sm leading-6 text-white/65">{p.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#85e9b5]">{viewDetails}<ArrowUpRight size={17}/></span></div>
  </button>)}</div>
 </section>
 <section ref={outer} className="relative hidden w-full md:block" style={{height:`calc(100svh + ${Math.max(1,count-1)*125}svh)`}} aria-label={heading}>
  <div className="sticky top-0 isolate flex h-[100svh] w-full items-center overflow-hidden bg-[#050908]">
   <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_48%,rgba(26,87,63,.21),transparent_54%),radial-gradient(ellipse_at_52%_100%,rgba(32,113,78,.12),transparent_45%)]"/>
   <div aria-hidden="true" className="pointer-events-none absolute left-[40%] top-1/2 h-[58vw] max-h-[750px] w-[58vw] max-w-[750px] -translate-y-1/2 rounded-full border border-[#85e9b5]/[.06] [transform:translateY(-50%)_rotateX(70deg)]"/>
   <div aria-hidden="true" className="pointer-events-none absolute left-[42%] top-1/2 h-[46vw] max-h-[610px] w-[46vw] max-w-[610px] -translate-y-1/2 rounded-full border border-[#85e9b5]/[.07] [transform:translateY(-50%)_rotateX(70deg)]"/>
   <div className="relative z-20 hidden w-[27%] shrink-0 pl-[max(5vw,24px)] text-left md:block">
    <div className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[.24em] text-[#85e9b5]"><span>01</span><span className="h-px w-9 bg-[#85e9b5]/70"/></div>
    <h2 className="max-w-[330px] text-[clamp(34px,4.1vw,72px)] font-semibold leading-[1.02] tracking-[-.075em] text-white">{heading}</h2>
    <p className="mt-7 max-w-[265px] text-sm leading-7 text-white/45">{subtitle}</p>
    <div className="mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.18em] text-[#85e9b5]/70"><span className="h-14 w-px bg-gradient-to-b from-[#85e9b5] to-transparent"/><span>{locale==='pt'?'Role para explorar':'Scroll to explore'}</span></div>
   </div>
   <div className="pointer-events-none absolute left-5 top-[10%] z-20 max-w-[60%] text-left md:hidden"><span className="font-mono text-[10px] tracking-[.2em] text-[#85e9b5]">01 / {locale==='pt'?'PROJETOS':'PROJECTS'}</span><h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-.06em] text-white">{heading}</h2></div>
   <div className="pointer-events-none absolute inset-x-0 top-[24%] bottom-[10%] z-10 md:left-[26%] md:right-[24%] md:top-[6%] md:bottom-[5%]" style={{perspective:'1350px',perspectiveOrigin:'50% 45%'}}>
    <div className="absolute inset-0" style={{transformStyle:'preserve-3d'}}>
     {projects.map((p,i)=><button key={p.name} ref={node=>{cardRefs.current[i]=node;}} type="button" aria-label={selectLabel+' '+p.name} onClick={()=>{if(current===i)setOpened(i);else focusProject(i);}} className="pointer-events-auto absolute left-1/2 top-1/2 h-[clamp(150px,25vw,295px)] w-[min(75vw,540px)] overflow-hidden rounded-2xl border border-[#85e9b5]/35 bg-[#0b1510] text-left shadow-[0_30px_100px_#000d,0_0_32px_#3ecf8e18] transition-[border-color,box-shadow] duration-300 hover:border-[#85e9b5]/80 hover:shadow-[0_30px_100px_#000d,0_0_42px_#3ecf8e44] focus-visible:outline-2 focus-visible:outline-[#85e9b5] md:h-[clamp(185px,26vw,340px)] md:w-[min(43vw,600px)]" style={{transform:'translate(-50%,-50%)',pointerEvents:'auto'}}>
      <div className="absolute inset-0 bg-[#0a1310]">
       {p.image?<img src={p.image} alt="" className="h-full w-full object-cover" onError={e=>{e.currentTarget.style.display='none';}}/>:p.video?<video src={p.video} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse,#164f35,transparent_70%)]"><span className="font-mono text-3xl font-bold text-[#85e9b5]">{p.name}</span></div>}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020a06]/95 via-transparent to-black/10"/>
      <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3"><div><span className="font-mono text-[9px] uppercase tracking-[.2em] text-[#85e9b5]">{p.category}</span><p className="mt-1 text-xl font-semibold tracking-[-.05em] text-white md:text-2xl">{p.name}</p></div><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white"><ArrowUpRight size={17}/></span></div>
     </button>)}
    </div>
   </div>
   <div className="pointer-events-none absolute bottom-[4%] left-5 right-5 z-20 flex items-end justify-between gap-5 md:bottom-auto md:left-auto md:right-[4%] md:top-1/2 md:w-[21%] md:-translate-y-1/2 md:block">
    <div className="max-w-[65%] rounded-xl border border-white/10 bg-[#07110be8] p-3 text-left backdrop-blur-lg md:max-w-none md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none" key={current}>
     <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#85e9b5]">{String(current+1).padStart(2,'0')} / {String(count).padStart(2,'0')} · {projects[current]?.category}</span>
     <h3 className="mt-2 text-lg font-semibold tracking-[-.045em] text-white md:mt-4 md:text-[clamp(22px,2.3vw,38px)]">{projects[current]?.name}</h3>
     <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/60 md:mt-4 md:line-clamp-none md:text-sm md:leading-6">{projects[current]?.description}</p>
     <div className="mt-5 hidden flex-wrap gap-2 md:flex">{projects[current]?.stack.map(tech=><span key={tech} className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-white/70">{tech}</span>)}</div>
    </div>
    <div className="flex flex-col gap-3 md:absolute md:-right-7 md:top-0">{projects.map((p,i)=><span key={p.name} className={'block h-7 w-[2px] transition-colors duration-500 '+(current===i?'bg-[#85e9b5]':'bg-white/20')}/>)}</div>
   </div>
  </div>
 </section>
 {opened!==null&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-8" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpened(null);}}>
  <section role="dialog" aria-modal="true" aria-label={projects[opened].name} className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#85e9b5]/30 bg-[#111915] text-left text-white shadow-[0_30px_120px_#000]">
   <button type="button" onClick={()=>setOpened(null)} aria-label={closeLabel} ref={closeRef} className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:text-[#85e9b5]"><X size={20}/></button>
   <div className="relative h-52 overflow-hidden bg-[#08110b] sm:h-80">{projects[opened].image?<img src={projects[opened].image} alt="" className="h-full w-full object-contain" onError={e=>{e.currentTarget.style.display='none';}}/>:projects[opened].video?<AutoplayVideo src={projects[opened].video!} className="h-full w-full object-cover" ariaLabel={projects[opened].name}/>:<div className="h-full bg-[radial-gradient(circle_at_center,#3ecf8e45,transparent_65%)]"/>}<div className="absolute inset-0 bg-gradient-to-t from-[#111915] to-transparent"/></div>
   <div className="relative -mt-8 px-6 pb-9 sm:px-10"><span className="font-mono text-xs tracking-[.2em] text-[#85e9b5]">{projects[opened].category}</span><h3 className="mt-3 text-4xl font-semibold tracking-[-.06em] sm:text-6xl">{projects[opened].name}</h3><p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{projects[opened].description}</p><div className="mt-7 flex flex-wrap gap-2">{projects[opened].stack.map(item=><span key={item} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/75">{item}</span>)}</div><div className="mt-8 flex flex-wrap gap-4">{projects[opened].links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#85e9b5]/40 px-5 py-3 text-sm text-[#85e9b5] transition hover:bg-[#85e9b5] hover:text-[#08110b]">{link.label}<ArrowUpRight size={16}/></a>)}</div></div>
  </section>
 </div>}
 </>;
}
