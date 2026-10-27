'use client';

import {useEffect,useState} from 'react';

const principles=[
 {name:'BUILD',detail:'01 / ENGINEERING',angle:-90,orbit:1,color:'#9af5b5'},
 {name:'DESIGN',detail:'02 / EXPERIENCE',angle:25,orbit:2,color:'#a0e9a8'},
 {name:'LEARN',detail:'03 / CURIOSITY',angle:155,orbit:2,color:'#74edb5'},
 {name:'SHIP',detail:'04 / IMPACT',angle:220,orbit:3,color:'#8ce5a6'},
 {name:'EXPLORE',detail:'05 / POSSIBILITY',angle:315,orbit:3,color:'#b2f4c6'},
] as const;

function useCountUp(target:number,enabled:boolean){
 const [value,setValue]=useState(0);
 useEffect(()=>{
  if(!enabled)return;
  let frame=0;
  const start=performance.now();
  const tick=(now:number)=>{
   const p=Math.min((now-start)/1800,1);
   setValue(Math.round(target*(1-Math.pow(1-p,3))));
   if(p<1)frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return ()=>cancelAnimationFrame(frame);
 },[enabled,target]);
 return value;
}

export function OrbitSignature(){
 const [selected,setSelected]=useState<number|null>(null);
 const [ready,setReady]=useState(false);
 const count=useCountUp(5,ready);
 useEffect(()=>{
  const element=document.getElementById('signature-orbit');
  if(!element)return;
  const observer=new IntersectionObserver(entries=>{
   if(entries[0]?.isIntersecting){setReady(true);observer.disconnect();}
  },{threshold:.15});
  observer.observe(element);
  return ()=>observer.disconnect();
 },[]);
 return <div id="signature-orbit" className="signature-system relative mx-auto aspect-square w-full max-w-[610px] select-none" aria-label="Interactive orbit of five creative principles">
  <div className="signature-aura pointer-events-none absolute inset-[18%] rounded-full bg-[#248a4d]/20 blur-[72px]" aria-hidden="true"/>
  {[1,2,3].map((orbit)=><div key={orbit} aria-hidden="true" className={`signature-orbit signature-orbit-${orbit} pointer-events-none absolute left-1/2 top-1/2 rounded-full`}/>)}
  <div aria-hidden="true" className="signature-center absolute left-1/2 top-1/2 z-10 flex aspect-square w-[29%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#a3f5b7]/25 bg-[#0c1b12]/95 text-center shadow-[0_0_90px_#3bd67a25,inset_0_0_35px_#3bd67a15]">
   <span className="font-mono text-[9px] tracking-[.25em] text-[#9af5b5]/60 sm:text-xs">THE CORE</span>
   <span className="mt-1 font-semibold text-4xl tracking-[-.1em] text-white sm:text-6xl">{count.toString().padStart(2,'0')}</span>
   <span className="mt-1 font-mono text-[8px] tracking-[.12em] text-white/50 sm:text-[10px]">PRINCIPLES</span>
  </div>
  {principles.map((item,i)=>{
   const angle=item.angle*Math.PI/180;
   const radius=item.orbit===1?25:item.orbit===2?36:47;
   const x=50+Math.cos(angle)*radius;
   const y=50+Math.sin(angle)*radius;
   return <div key={item.name} className="signature-satellite absolute z-20" style={{left:`${x}%`,top:`${y}%`,animationDelay:`${.4+i*.17}s`}}>
    <button type="button" onClick={()=>setSelected(selected===i?null:i)} aria-pressed={selected===i} aria-label={`${item.name}: ${item.detail}`} className={`signature-node group relative flex h-[54px] w-[54px] flex-col items-center justify-center rounded-2xl border bg-[#102219]/95 shadow-[0_0_25px_#48d78325] transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9af5b5] sm:h-[76px] sm:w-[76px] ${selected===i?'border-[#b8f7c5] shadow-[0_0_35px_#65df9160]':'border-[#9af5b5]/35 hover:border-[#b8f7c5]'}`}>
     <span aria-hidden="true" className="absolute -top-1 -right-1 h-2 w-2 rounded-full" style={{background:item.color,boxShadow:`0 0 14px ${item.color}`}}/>
     <span className="font-mono text-[8px] font-semibold tracking-[.06em] text-white sm:text-[10px]">{item.name}</span>
     <span className="mt-1 h-[2px] w-4 rounded-full opacity-80 sm:w-6" style={{background:item.color}}/>
    </button>
   </div>;
  })}
  <div aria-live="polite" className="absolute bottom-0 left-1/2 z-20 w-full -translate-x-1/2 text-center font-mono text-[9px] tracking-[.2em] text-[#a2f0b7]/70 sm:text-[11px]">{selected===null?'SELECT A NODE / EXPLORE THE SYSTEM':principles[selected].detail}</div>
 </div>;
}
