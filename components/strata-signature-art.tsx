'use client';

import {useEffect,useRef} from 'react';
import {Layers3,ShieldCheck,DatabaseZap} from 'lucide-react';

const VIDEO='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/435a4fe7-e43b-4e7c-af78-0be083e73569.mp4';
const POSTER='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/782a4a52-4c1e-4471-bb0c-aa232927f4a6.webp';

export function StrataSignatureArt({labels}:{labels:{data:string;dataTitle:string;systems:string;systemsTitle:string;caption:string}}){
 const videoRef=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches)return;
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){const p=video.play();if(p)void p.catch(()=>{});}
   else video.pause();
  },{threshold:0.05});
  observer.observe(video);
  return ()=>observer.disconnect();
 },[]);
 return <div className="relative isolate mx-auto w-full max-w-[680px] min-w-0 overflow-visible py-14 sm:py-20 lg:py-24">
  <div aria-hidden="true" className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(62,207,142,.18),transparent_67%)] blur-3xl"/>
  <div className="relative mx-auto aspect-square w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_73%)]">
   <img src={POSTER} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain [filter:grayscale(1)_brightness(1.3)_contrast(1.12)]"/>
   <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster={POSTER} aria-label={labels.caption} className="absolute inset-0 h-full w-full object-contain [filter:grayscale(1)_sepia(1)_hue-rotate(82deg)_saturate(2.2)_brightness(1.24)_contrast(1.12)]">
    <source src={VIDEO} type="video/mp4"/>
   </video>
  </div>
  <div className="absolute left-0 top-[10%] z-10 w-[min(68%,295px)] rounded-2xl border border-white/15 bg-[#101a17]/75 p-4 shadow-[0_12px_50px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl sm:p-5">
   <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#85e9b5]/20 bg-[#85e9b5]/10"><DatabaseZap size={21} className="text-[#a5f3d0]"/></div><div className="min-w-0"><p className="font-mono text-[10px] tracking-[.15em] text-[#a5f3d0]">{labels.data}</p><p className="mt-2 text-sm font-medium leading-5 text-white sm:text-base">{labels.dataTitle}</p></div></div>
  </div>
  <div className="absolute bottom-[9%] right-0 z-10 w-[min(70%,305px)] rounded-2xl border border-white/15 bg-[#101a17]/75 p-4 shadow-[0_12px_50px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl sm:p-5">
   <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#85e9b5]/20 bg-[#85e9b5]/10"><ShieldCheck size={21} className="text-[#a5f3d0]"/></div><div className="min-w-0"><p className="font-mono text-[10px] tracking-[.15em] text-[#a5f3d0]">{labels.systems}</p><p className="mt-2 text-sm font-medium leading-5 text-white sm:text-base">{labels.systemsTitle}</p></div></div>
  </div>
  <div className="absolute bottom-[5%] left-[7%] flex items-center gap-2 font-mono text-[9px] tracking-[.18em] text-[#85e9b5]/75"><Layers3 size={13}/>{labels.caption}</div>
 </div>;
}
