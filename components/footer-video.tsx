'use client';

import {useEffect,useRef} from 'react';
import Hls from 'hls.js';

// Original Mux wave animation. Never substitute the Signature video.
const WAVES_URL='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  let hls:Hls|undefined;
  video.muted=true;
  video.defaultMuted=true;
  video.playsInline=true;

  const play=()=>{
   if(document.hidden)return;
   const attempt=video.play();
   if(attempt)void attempt.catch(()=>{});
  };
  const onVisible=()=>{if(!document.hidden)play();};
  video.addEventListener('canplay',play);
  document.addEventListener('visibilitychange',onVisible);
  window.addEventListener('pageshow',play);

  if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=WAVES_URL;
   video.load();
  }else if(Hls.isSupported()){
   hls=new Hls({enableWorker:true});
   hls.on(Hls.Events.MEDIA_ATTACHED,()=>hls?.loadSource(WAVES_URL));
   hls.on(Hls.Events.MANIFEST_PARSED,play);
   hls.on(Hls.Events.ERROR,(_event,data)=>{
    if(!data.fatal)return;
    if(data.type===Hls.ErrorTypes.NETWORK_ERROR)hls?.startLoad();
    else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)hls?.recoverMediaError();
   });
   hls.attachMedia(video);
  }

  return ()=>{
   video.removeEventListener('canplay',play);
   document.removeEventListener('visibilitychange',onVisible);
   window.removeEventListener('pageshow',play);
   hls?.destroy();
   video.pause();
   video.removeAttribute('src');
  };
 },[]);
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#06120c]">
  <video ref={videoRef} autoPlay muted loop playsInline preload="auto" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_sepia(.65)_hue-rotate(85deg)_saturate(2)_brightness(.85)_contrast(1.12)]"/>
 </div>;
}
