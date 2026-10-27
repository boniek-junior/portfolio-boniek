'use client';

import {useEffect,useRef,useState} from 'react';

const symbols=[
 {x:16,y:25,size:9,delay:0},{x:76,y:18,size:6,delay:1.1},{x:31,y:75,size:7,delay:2.2},
 {x:88,y:65,size:10,delay:.6},{x:56,y:13,size:5,delay:1.7},{x:9,y:72,size:5,delay:2.8},
 {x:64,y:87,size:7,delay:1.4},{x:42,y:45,size:4,delay:2.6}
];
export function CreationAnimation(){
 const root=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(false);
 useEffect(()=>{
  const element=root.current;
  if(!element)return;
  const observer=new IntersectionObserver(([entry])=>setActive(entry.isIntersecting),{threshold:.15});
  observer.observe(element);
  return ()=>observer.disconnect();
 },[]);
 return <div ref={root} className={`creation-stage relative mx-auto mt-8 h-[175px] w-full max-w-[580px] overflow-hidden rounded-2xl border border-[#85e9b5]/15 bg-[#0b100d] sm:h-[210px] ${active?'creation-active':''}`} role="img" aria-label="Animação abstrata de uma ideia sendo construída, com pontos, traços e formas que se conectam">
  <div className="creation-grid absolute inset-0"/>
  <div className="creation-beam absolute inset-y-0 left-0 w-[45%]"/>
  <div className="creation-orbit creation-orbit-one absolute left-1/2 top-1/2 h-32 w-32 rounded-full border border-[#85e9b5]/25 sm:h-40 sm:w-40"/>
  <div className="creation-orbit creation-orbit-two absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-dashed border-[#3ecf8e]/40 sm:h-32 sm:w-32"/>
  <div className="creation-core absolute left-1/2 top-1/2 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#85e9b5]/40 bg-[#133525]/70 shadow-[0_0_55px_#3ecf8e25] backdrop-blur-md sm:h-20 sm:w-20">
   <svg aria-hidden="true" viewBox="0 0 64 64" className="h-10 w-10 text-[#85e9b5]"><path d="M32 4 56 18v28L32 60 8 46V18L32 4Z M8 18l24 14 24-14 M32 32v28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m32 12 17 10-17 10-17-10 17-10Z" fill="currentColor" opacity=".12"/></svg>
  </div>
  {symbols.map((p,i)=><span key={i} className="creation-spark absolute rounded-full bg-[#85e9b5]" style={{left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,animationDelay:`${p.delay}s`}}/>)}
  <div className="creation-caption absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 font-mono text-[9px] tracking-[.23em] text-[#85e9b5]/65 sm:text-[10px]"><span className="creation-status-dot h-1.5 w-1.5 rounded-full bg-[#85e9b5]"/>IDEA → BUILD → ITERATE</div>
 </div>;
}
