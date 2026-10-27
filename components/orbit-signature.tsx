'use client';

import {useEffect,useRef,useState} from 'react';

const STILL='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/f1631235-0a76-464d-8f1d-2c4b48a997d5.jpg';
const VIDEO='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e71aea27-a808-4ae3-8231-a469d49285d4.mp4';
const stack=[
 {name:'React',company:'Meta',logo:'react/react-original.svg'},
 {name:'TypeScript',company:'Microsoft',logo:'typescript/typescript-original.svg'},
 {name:'Python',company:'Python Software Foundation',logo:'python/python-original.svg'},
 {name:'Supabase',company:'Supabase',logo:'supabase/supabase-original.svg'},
 {name:'Docker',company:'Docker',logo:'docker/docker-original.svg'},
 {name:'Git',company:'Open source',logo:'git/git-original.svg'},
 {name:'Java',company:'Oracle',logo:'java/java-original.svg'},
 {name:'Next.js',company:'Vercel',logo:'nextjs/nextjs-original.svg'},
] as const;

export function OrbitSignature(){
 const videoRef=useRef<HTMLVideoElement>(null);
 const [ready,setReady]=useState(false);
 const [selected,setSelected]=useState<number|null>(null);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(media.matches);
  update();media.addEventListener('change',update);
  return ()=>media.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video||reduced)return;
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){void video.play().catch(()=>setReady(false));}
   else video.pause();
  },{threshold:.1});
  observer.observe(video);
  return ()=>{observer.disconnect();video.pause();};
 },[reduced]);
 return <div className="signature-cosmos mx-auto w-full max-w-[590px]">
  <div className="signature-cosmos-stage relative mx-auto aspect-square w-full" aria-label="Universo de tecnologias em órbita">
   <div aria-hidden="true" className="signature-cosmos-halo absolute inset-[18%] rounded-full"/>
   <div aria-hidden="true" className="signature-cosmos-orbit signature-cosmos-orbit-outer absolute inset-[8%] rounded-full"/>
   <div aria-hidden="true" className="signature-cosmos-orbit signature-cosmos-orbit-inner absolute inset-[20%] rounded-full"/>
   <div aria-hidden="true" className="signature-cosmos-globe absolute inset-[24%] overflow-hidden rounded-full">
    <img src={STILL} alt="" loading="lazy" className="signature-cosmos-media absolute inset-0 h-full w-full object-cover"/>
    {!reduced&&<video ref={videoRef} src={VIDEO} muted loop playsInline preload="metadata" onPlaying={()=>setReady(true)} className={`signature-cosmos-media absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready?'opacity-100':'opacity-0'}`}/>}
    <div className="signature-cosmos-shade absolute inset-0"/>
   </div>
   {[0,1].map(orbit=><div key={orbit} className={`signature-cosmos-track signature-cosmos-track-${orbit} pointer-events-none absolute inset-0`}>
    {stack.map((item,i)=>{
     if(i%2!==orbit)return null;
     const angle=(i*45-90)*Math.PI/180;
     const radius=orbit===0?30:42;
     return <div key={item.name} className="signature-cosmos-node absolute" style={{left:`${50+Math.cos(angle)*radius}%`,top:`${50+Math.sin(angle)*radius}%`}}>
      <div className="signature-cosmos-counter">
       <button type="button" aria-label={`${item.name}, ${item.company}`} aria-pressed={selected===i} onClick={()=>setSelected(selected===i?null:i)} className={`signature-cosmos-chip pointer-events-auto flex size-10 items-center justify-center rounded-2xl border bg-[#0d1712]/95 p-2 shadow-[0_12px_32px_#000b] backdrop-blur-lg transition-colors hover:border-[#85e9b5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85e9b5] sm:size-14 sm:p-3 ${selected===i?'border-[#85e9b5]':'border-[#85e9b5]/25'}`}>
        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${item.logo}`} alt="" width="40" height="40" loading="lazy" className={`h-full w-full object-contain ${item.name==='Next.js'?'brightness-0 invert':''}`}/>
       </button>
      </div>
     </div>;
    })}
   </div>)}
   <div aria-hidden="true" className="signature-cosmos-center pointer-events-none absolute inset-0 flex items-center justify-center"><span className="translate-y-[72px] rounded-full border border-[#85e9b5]/20 bg-[#08120d]/85 px-3 py-1 font-mono text-[8px] tracking-[.23em] text-[#85e9b5]/80 backdrop-blur-md sm:translate-y-[95px]">001 / THE UNIVERSE</span></div>
  </div>
  <p aria-live="polite" className="mx-auto mt-2 min-h-8 text-center font-mono text-[10px] tracking-[.14em] text-white/50">{selected===null?'EXPLORE AS TECNOLOGIAS':`${stack[selected].name.toUpperCase()}  /  ${stack[selected].company.toUpperCase()}`}</p>
 </div>;
}
