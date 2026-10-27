'use client';

import {useEffect,useRef,useState} from 'react';

const STILL='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/f1631235-0a76-464d-8f1d-2c4b48a997d5.jpg';
const VIDEO='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e71aea27-a808-4ae3-8231-a469d49285d4.mp4';
const tools=[
 {name:'React',company:'Meta',logo:'react/react-original.svg',orbit:0,angle:-72},
 {name:'TypeScript',company:'Microsoft',logo:'typescript/typescript-original.svg',orbit:1,angle:-37},
 {name:'Python',company:'Python Software Foundation',logo:'python/python-original.svg',orbit:0,angle:19},
 {name:'Next.js',company:'Vercel',logo:'nextjs/nextjs-original.svg',orbit:1,angle:55},
 {name:'Supabase',company:'Supabase',logo:'supabase/supabase-original.svg',orbit:0,angle:135},
 {name:'Java',company:'Oracle',logo:'java/java-original.svg',orbit:1,angle:171},
 {name:'Docker',company:'Docker',logo:'docker/docker-original.svg',orbit:0,angle:225},
 {name:'Git',company:'Open source',logo:'git/git-original.svg',orbit:1,angle:258},
] as const;

export function OrbitSignature(){
 const video=useRef<HTMLVideoElement>(null);
 const [playing,setPlaying]=useState(false);
 const [selected,setSelected]=useState<number|null>(null);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const query=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setReduced(query.matches);
  sync();query.addEventListener('change',sync);
  return ()=>query.removeEventListener('change',sync);
 },[]);
 useEffect(()=>{
  const el=video.current;
  if(!el||reduced)return;
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){void el.play().catch(()=>setPlaying(false));}
   else el.pause();
  },{threshold:.08});
  observer.observe(el);
  return ()=>{observer.disconnect();el.pause();};
 },[reduced]);
 return <div className="signature-universe relative mx-auto w-full max-w-[850px]" aria-label="Universo de tecnologias orbitando um globo luminoso">
  <div className="signature-universe-scene relative mx-auto aspect-square w-full">
   <div aria-hidden="true" className="signature-universe-glow absolute inset-[16%] rounded-full"/>
   <div className="signature-universe-plate pointer-events-none absolute inset-[-4%] overflow-hidden" aria-hidden="true">
    <img src={STILL} alt="" loading="lazy" className="signature-universe-media absolute inset-0 h-full w-full object-cover"/>
    {!reduced&&<video ref={video} src={VIDEO} muted loop playsInline preload="none" onLoadedData={()=>{setPlaying(true);}} className={`signature-universe-media absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing?'opacity-100':'opacity-0'}`}/>}
   </div>
   <div aria-hidden="true" className="signature-universe-ring signature-universe-ring-a absolute inset-[14%] rounded-full"/>
   <div aria-hidden="true" className="signature-universe-ring signature-universe-ring-b absolute inset-[5%] rounded-full"/>
   <div aria-hidden="true" className="signature-universe-ring signature-universe-ring-c absolute inset-[24%] rounded-full"/>
   {[0,1].map(orbit=><div key={orbit} className={`signature-universe-orbit-layer signature-universe-orbit-layer-${orbit} pointer-events-none absolute inset-0`}>
   {tools.map((item,i)=>{
    if(item.orbit!==orbit)return null;
    const angle=item.angle*Math.PI/180;
    const radius=item.orbit===0?35:45;
    const x=50+Math.cos(angle)*radius;
    const y=50+Math.sin(angle)*radius;
    return <div key={item.name} className={`signature-universe-satellite absolute z-20`} style={{left:`${x}%`,top:`${y}%`,animationDelay:`${-i*3.7}s`}}>
     <button type="button" onClick={()=>setSelected(selected===i?null:i)} aria-pressed={selected===i} aria-label={`${item.name} — ${item.company}`} title={`${item.name} · ${item.company}`} className={`signature-universe-chip pointer-events-auto group flex size-11 items-center justify-center rounded-2xl border border-[#85e9b5]/30 bg-[#0b1711]/85 p-2 shadow-[0_8px_32px_#000a,inset_0_1px_#ffffff20] backdrop-blur-xl transition-all hover:scale-125 hover:border-[#85e9b5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85e9b5] sm:size-16 sm:p-3 ${selected===i?'border-[#85e9b5] shadow-[0_0_35px_#3ecf8e70]':''}`}>
      <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${item.logo}`} alt="" loading="lazy" width="48" height="48" className={`h-full w-full object-contain ${item.name==='Next.js'?'brightness-0 invert':''}`}/>
     </button>
    </div>;
   })}
   </div>)}
   <div className="pointer-events-none absolute inset-x-0 bottom-[9%] z-10 text-center"><span className="font-mono text-[9px] tracking-[.35em] text-[#85e9b5]/75 sm:text-xs">THE UNIVERSE / 001</span></div>
  </div>
  <div aria-live="polite" className="relative z-30 mx-auto mt-2 min-h-12 text-center font-mono text-[10px] tracking-[.16em] text-white/60 sm:text-xs">{selected===null?'EXPLORE THE ORBIT · SELECT A TECHNOLOGY':`${tools[selected].name.toUpperCase()} / ${tools[selected].company.toUpperCase()}`}</div>
 </div>;
}
