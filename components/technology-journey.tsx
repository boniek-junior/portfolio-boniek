'use client';

import {useEffect,useRef,useState} from 'react';

type Props={items:string[];eyebrow:string;title:string;explore:string;enter:string;end:string;journey:string;all:string};
const descriptions:Record<string,string>={
 Java:'Backend / JVM',Python:'Automation / AI',JavaScript:'Web / Interaction',
 TypeScript:'Typed applications',React:'Interfaces / UI',SQL:'Data / Queries',
 FastAPI:'Python APIs','Spring Boot':'Java services',
 Nextjs:'Full-stack web',Supabase:'Database / Auth',Git:'Version control',
 GitHub:'Collaboration',Docker:'Containers',Tailwind:'Design systems',
 'Microsoft Clarity':'Behavior analytics',GA4:'Product analytics',
 'Zoho PageSense':'Experimentation'
};
const glyphs:Record<string,string>={
 Java:'J',Python:'Py',JavaScript:'JS',TypeScript:'TS',React:'⚛',SQL:'DB',
 FastAPI:'API','Spring Boot':'SB',Nextjs:'N',Supabase:'S',Git:'Git',
 GitHub:'GH',Docker:'D',Tailwind:'TW','Microsoft Clarity':'MC',GA4:'G4','Zoho PageSense':'ZP'
};

export function TechnologyJourney({items,eyebrow,title,explore,enter,end,journey,all}:Props){
 const root=useRef<HTMLElement>(null);
 const track=useRef<HTMLDivElement>(null);
 const [progress,setProgress]=useState(0);
 const [active,setActive]=useState(false);
 const [motionReduced,setMotionReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMedia=()=>setMotionReduced(media.matches);
  updateMedia();media.addEventListener('change',updateMedia);
  return ()=>media.removeEventListener('change',updateMedia);
 },[]);
 useEffect(()=>{
  const section=root.current;
  const rail=track.current;
  if(!section||!rail||motionReduced)return;
  let frame=0;
  const update=()=>{
   frame=0;
   const rect=section.getBoundingClientRect();
   const distance=Math.max(0,section.offsetHeight-window.innerHeight);
   const fraction=distance>0?Math.max(0,Math.min(1,-rect.top/distance)):0;
   const maxShift=Math.max(0,rail.scrollWidth-rail.clientWidth);
   rail.style.transform=`translate3d(${-maxShift*fraction}px,0,0)`;
   setProgress(old=>Math.abs(old-fraction)>.005?fraction:old);
   setActive(rect.top<=window.innerHeight*.35&&rect.bottom>=window.innerHeight*.65);
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
  update();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  return ()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(frame);};
 },[motionReduced,items]);
 return <section ref={root} aria-label={eyebrow} className="technology-journey relative border-y border-white/10 bg-[#0c0c0c]" style={{height:motionReduced?'auto':`calc(100vh + ${Math.max(items.length-2,1)*260}px)`}}>
  <div className={motionReduced?'relative overflow-hidden py-20':'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-20'}>
   <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_50%,#235e4226,transparent_60%)]"/>
   <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
    <div className="flex items-center justify-center gap-6 text-center">
     <div><p className="font-mono text-[10px] tracking-[.28em] text-[#85e9b5]">{eyebrow} / TOOLKIT</p>
      <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.06em] sm:text-5xl">{title}<span className="text-[#85e9b5]">.</span></h3></div>
     <span aria-live="off" className="absolute right-6 hidden font-mono text-xs tabular-nums text-white/50 sm:block md:right-12">{String(Math.min(items.length,Math.floor(progress*items.length)+1)).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span>
    </div>
    <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/10"><div className="h-full origin-left bg-gradient-to-r from-[#3ecf8e] to-[#85e9b5]" style={{transform:`scaleX(${motionReduced?1:progress})`,transition:'transform 100ms linear'}}/></div>
   </div>
   <div className="relative mt-10 w-full overflow-hidden">
    <div ref={track} className={motionReduced?'flex flex-wrap justify-center gap-4 px-6':'flex w-full gap-5 px-[max(24px,calc((100vw_-_1152px)/2))] will-change-transform'} style={{transform:motionReduced?'none':undefined}}>
     {items.map((item,i)=><article key={item} className="technology-card group relative flex h-[300px] w-[250px] shrink-0 flex-col justify-between overflow-hidden rounded-[28px] border border-[#85e9b5]/15 bg-gradient-to-br from-[#202420] via-[#181b19] to-[#121212] p-7 transition-colors duration-300 hover:border-[#85e9b5]/65 sm:h-[350px] sm:w-[310px]">
      <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#3ecf8e]/10 blur-3xl transition group-hover:bg-[#3ecf8e]/25"/>
      <div className="relative flex items-center justify-between"><span className="font-mono text-xs tracking-[.2em] text-[#85e9b5]/60">{String(i+1).padStart(2,'0')}</span><span className="h-2 w-2 rounded-full bg-[#85e9b5] shadow-[0_0_16px_#85e9b5]"/></div>
      <div className="relative flex h-28 items-center justify-center"><div className="flex h-24 w-24 items-center justify-center rounded-[26px] border border-[#85e9b5]/30 bg-[#25382e]/70 font-mono text-3xl font-bold tracking-[-.09em] text-[#e1f8e9] shadow-[0_16px_50px_#3ecf8e20] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-8deg]">{glyphs[item]||item.slice(0,2).toUpperCase()}</div></div>
      <div className="relative"><h4 className="text-2xl font-semibold tracking-[-.05em] text-white">{item}</h4><p className="mt-2 text-xs text-white/45">{descriptions[item]||'Development / Technology'}</p></div>
     </article>)}
    </div>
   </div>
   <div className="relative mx-auto mt-8 flex w-full max-w-7xl items-center justify-between px-6 font-mono text-[10px] tracking-[.18em] text-white/40 md:px-12"><span>{motionReduced?all:active?explore:enter}</span><span>{motionReduced?all:progress>=.99?end:journey}</span></div>
  </div>
 </section>;
}
