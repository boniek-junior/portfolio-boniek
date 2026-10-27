'use client';
import {useState} from 'react';
const nodes=[
 {name:'BUILD',x:50,y:7,delay:'0s'},
 {name:'DESIGN',x:87,y:30,delay:'-2s'},
 {name:'LEARN',x:75,y:82,delay:'-4s'},
 {name:'SHIP',x:25,y:82,delay:'-1s'},
 {name:'EXPLORE',x:13,y:30,delay:'-3s'},
];
export function OrbitSignature(){
 const [selected,setSelected]=useState<number|null>(null);
 return <div className="orbit-scene relative mx-auto aspect-square w-full max-w-[460px] select-none" aria-label="Five interconnected principles: build, design, learn, ship, explore">
  <div aria-hidden className="absolute inset-[12%] rounded-full border border-[#a5b8ff]/15 shadow-[inset_0_0_90px_#2448e515,0_0_100px_#2448e512]"/>
  <div aria-hidden className="orbit-ring absolute inset-[24%] rounded-full border border-dashed border-[#a5b8ff]/30"/>
  <div aria-hidden className="orbit-ring-reverse absolute inset-[5%] rounded-full border border-[#a5b8ff]/10"/>
  <div aria-hidden className="absolute inset-[34%] rounded-full bg-[#2448e5]/15 blur-3xl"/>
  <div className="absolute inset-[33%] flex items-center justify-center rounded-full border border-[#a5b8ff]/35 bg-[#101a32] shadow-[0_0_65px_#2448e54a]">
   <span className="text-3xl font-black tracking-[-.09em] text-white md:text-4xl">B<span className="text-[#a5b8ff]">.</span></span>
  </div>
  {nodes.map((node,i)=><button key={node.name} type="button" onClick={()=>setSelected(selected===i?null:i)} aria-pressed={selected===i} className="orbit-node absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a5b8ff]/35 bg-[#0b1325]/95 px-3 py-2 font-mono text-[9px] tracking-[.13em] text-[#dce4ff] shadow-[0_0_22px_#2448e52b] transition hover:scale-110 hover:border-[#a5b8ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a5b8ff] md:px-4 md:py-3 md:text-[10px]" style={{left:`${node.x}%`,top:`${node.y}%`,animationDelay:node.delay}}>{node.name}</button>)}
  <div aria-live="polite" className="absolute inset-x-0 bottom-0 text-center font-mono text-[10px] tracking-[.25em] text-[#a5b8ff]/75">{selected===null?'ENGINEERING / CREATIVITY':nodes[selected].name+' / 0'+(selected+1)}</div>
 </div>;
}
