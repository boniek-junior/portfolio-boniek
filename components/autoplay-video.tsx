'use client';

import {useEffect,useRef} from 'react';

export function AutoplayVideo({src,poster,className,ariaLabel}:{src:string;poster?:string;className:string;ariaLabel:string}){
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=ref.current;
  if(!video)return;
  video.muted=true;
  video.defaultMuted=true;
  video.playsInline=true;
  const play=()=>{
   if(document.hidden||!video.isConnected)return;
   const promise=video.play();
   if(promise)void promise.catch(()=>{});
  };
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting)play();
   else video.pause();
  },{threshold:0.01});
  observer.observe(video);
  video.addEventListener('loadeddata',play);
  video.addEventListener('canplay',play);
  document.addEventListener('visibilitychange',play);
  window.addEventListener('pageshow',play);
  const onInteraction=()=>play();
  document.addEventListener('pointerdown',onInteraction,{passive:true});
  return ()=>{
   observer.disconnect();
   video.removeEventListener('loadeddata',play);
   video.removeEventListener('canplay',play);
   document.removeEventListener('visibilitychange',play);
   window.removeEventListener('pageshow',play);
   document.removeEventListener('pointerdown',onInteraction);
  };
 },[]);
 return <video ref={ref} autoPlay muted loop playsInline preload="auto" poster={poster} className={className} aria-label={ariaLabel}><source src={src} type="video/mp4"/></video>;
}
