'use client';

import {useEffect,useState} from 'react';

const technologies=[
 {name:'React',company:'Meta',logo:'react/react-original.svg',orbit:0,angle:-90},
 {name:'TypeScript',company:'Microsoft',logo:'typescript/typescript-original.svg',orbit:1,angle:-45},
 {name:'Python',company:'Python Software Foundation',logo:'python/python-original.svg',orbit:0,angle:0},
 {name:'Supabase',company:'Supabase',logo:'supabase/supabase-original.svg',orbit:1,angle:45},
 {name:'Docker',company:'Docker',logo:'docker/docker-original.svg',orbit:0,angle:90},
 {name:'Git',company:'Open source',logo:'git/git-original.svg',orbit:1,angle:135},
 {name:'Java',company:'Oracle',logo:'java/java-original.svg',orbit:0,angle:180},
 {name:'Next.js',company:'Vercel',logo:'nextjs/nextjs-original.svg',orbit:1,angle:225},
] as const;

export function OrbitSignature(){
 const [selected,setSelected]=useState<number|null>(null);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(mq.matches);
  update();mq.addEventListener('change',update);
  return ()=>mq.removeEventListener('change',update);
 },[]);
 return <div className="cosmos-v2 mx-auto w-full max-w-[610px]">
  <div className="cosmos-v2-stage relative mx-auto aspect-square w-full" role="group" aria-label="Universo de tecnologias orbitando um planeta digital">
   <div className="cosmos-v2-aura pointer-events-none absolute inset-[12%] rounded-full"/>
   <div className="cosmos-v2-orbit cosmos-v2-orbit-outer pointer-events-none absolute inset-[7%] rounded-full"/>
   <div className="cosmos-v2-orbit cosmos-v2-orbit-inner pointer-events-none absolute inset-[19%] rounded-full"/>
   <div className="cosmos-v2-sphere pointer-events-none absolute inset-[27%] overflow-hidden rounded-full" aria-hidden="true">
    <div className="cosmos-v2-sphere-texture absolute inset-[-10%]"/>
    <div className="cosmos-v2-sphere-shading absolute inset-0"/>
    <div className="cosmos-v2-sphere-glint absolute inset-0"/>
   </div>
   <div className="cosmos-v2-core-label pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true"><span className="translate-y-[17px] font-mono text-[9px] tracking-[.34em] text-[#c4fce0]/70 sm:text-[11px]">BUILD / CONNECT</span></div>
   {[0,1].map(orbit=><div key={orbit} className={`cosmos-v2-track cosmos-v2-track-${orbit} pointer-events-none absolute inset-0`}>
    {technologies.map((tool,i)=>{
     if(tool.orbit!==orbit)return null;
     const theta=tool.angle*Math.PI/180;
     const radius=orbit===0?31:43;
     return <div key={tool.name} className="cosmos-v2-node absolute" style={{left:`${50+Math.cos(theta)*radius}%`,top:`${50+Math.sin(theta)*radius}%`}}>
      <div className="cosmos-v2-counter">
       <button type="button" onClick={()=>setSelected(selected===i?null:i)} aria-label={`${tool.name}, ${tool.company}`} aria-pressed={selected===i} className={`cosmos-v2-chip pointer-events-auto relative flex size-10 items-center justify-center rounded-full border p-2 transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85e9b5] sm:size-[58px] sm:p-3 ${selected===i?'border-[#85e9b5] bg-[#193c2b] shadow-[0_0_35px_#3ecf8e40]':'border-[#85e9b5]/25 bg-[#101a15]/95 hover:border-[#85e9b5]/75'}`}>
        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.logo}`} width={36} height={36} loading="lazy" alt="" className={`h-full w-full object-contain ${tool.name==='Next.js'?'brightness-0 invert':''}`}/>
       </button>
      </div>
     </div>;
    })}
   </div>)}
   <span className="cosmos-v2-index pointer-events-none absolute bottom-[4%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[.3em] text-[#85e9b5]/60">THE SIGNATURE / 001</span>
  </div>
  <div aria-live="polite" className="mx-auto mt-2 flex min-h-12 items-center justify-center text-center font-mono text-[10px] tracking-[.13em] text-white/55">{selected===null?'SELECIONE UMA TECNOLOGIA':`${technologies[selected].name.toUpperCase()}  ·  ${technologies[selected].company.toUpperCase()}`}</div>
 </div>;
}
