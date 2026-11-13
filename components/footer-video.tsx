'use client';

import {useEffect,useRef} from 'react';
import Hls from 'hls.js';

const VIDEO_URL='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
const FALLBACK_MP4='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/435a4fe7-e43b-4e7c-af78-0be083e73569.mp4';
const FALLBACK_POSTER='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/782a4a52-4c1e-4471-bb0c-aa232927f4a6.webp';

export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  let hls:Hls|undefined;
  let fallback=false;
  let ready=false;
  const timer:{id:number|undefined}={id:undefined};
  video.muted=true;
  video.defaultMuted=true;
  video.playsInline=true;

  const tryPlay=()=>{
   if(document.hidden)return;
   const attempt=video.play();
   if(attempt)void attempt.catch(()=>{});
  };
  const activateFallback=()=>{
   if(fallback)return;
   fallback=true;
   if(timer.id!==undefined)window.clearTimeout(timer.id);
   hls?.destroy();
   hls=undefined;
   video.pause();
   video.src=FALLBACK_MP4;
   video.load();
   tryPlay();
  };
  const onReady=()=>{
   ready=true;
   if(timer.id!==undefined)window.clearTimeout(timer.id);
   tryPlay();
  };
  const onError=()=>activateFallback();
  const onVisibility=()=>{if(!document.hidden)tryPlay();};
  video.addEventListener('loadeddata',onReady);
  video.addEventListener('canplay',tryPlay);
  video.addEventListener('error',onError);
  document.addEventListener('visibilitychange',onVisibility);
  window.addEventListener('pageshow',tryPlay);

  // Avoid an indefinitely black footer if the HLS stream stalls.
  timer.id=window.setTimeout(()=>{if(!ready)activateFallback();},7000);
  if(Hls.isSupported()){
   hls=new Hls({enableWorker:true});
   hls.on(Hls.Events.ERROR,(_event,data)=>{if(data.fatal)activateFallback();});
   hls.on(Hls.Events.MANIFEST_PARSED,tryPlay);
   hls.attachMedia(video);
   hls.loadSource(VIDEO_URL);
  }else if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=VIDEO_URL;
   video.load();
  }else{
   activateFallback();
  }

  return ()=>{
   if(timer.id!==undefined)window.clearTimeout(timer.id);
   document.removeEventListener('visibilitychange',onVisibility);
   window.removeEventListener('pageshow',tryPlay);
   video.removeEventListener('loadeddata',onReady);
   video.removeEventListener('canplay',tryPlay);
   video.removeEventListener('error',onError);
   hls?.destroy();
   video.pause();
  };
 },[]);
 return <>
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(30,100,65,.28),#020906_80%)]"/>
  <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster={FALLBACK_POSTER} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-70 [filter:grayscale(1)_sepia(.65)_hue-rotate(85deg)_saturate(2)_brightness(.85)_contrast(1.12)]"/>
 </>;
}
