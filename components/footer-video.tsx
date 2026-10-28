'use client';

import {useEffect,useRef,useState} from 'react';
import Hls from 'hls.js';

const STREAM='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

/**
 * The original cinematic footer uses the Mux video itself as its animation.
 * Keep the video mounted, visible and full-bleed on both desktop and mobile.
 */
export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);
 const [failed,setFailed]=useState(false);

 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  let hls:Hls|undefined;
  let disposed=false;
  let inView=false;
  

  const play=()=>{
   if(disposed||document.hidden||!inView)return;
   video.muted=true;
   video.defaultMuted=true;
   const promise=video.play();
   if(promise)void promise.catch(()=>{});
  };
  const onVisibility=()=>{if(document.hidden)video.pause();else play();};
  const onError=()=>setFailed(true);
  const onPlaying=()=>setFailed(false);
  video.addEventListener('canplay',play);
  video.addEventListener('loadeddata',play);
  video.addEventListener('playing',onPlaying);
  video.addEventListener('error',onError);
  document.addEventListener('visibilitychange',onVisibility);

  const observer=new IntersectionObserver(([entry])=>{
   inView=entry.isIntersecting;
   if(inView)play();
   else video.pause();
  },{threshold:0});
  observer.observe(video);

  // Native HLS for Safari/iOS; hls.js with the original loadSource/attachMedia
  // initialization pattern for Chrome, Edge, Firefox and other MSE browsers.
  if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=STREAM;
   video.load();
  }else if(Hls.isSupported()){
   hls=new Hls({enableWorker:true});
   hls.on(Hls.Events.MANIFEST_PARSED,play);
   hls.on(Hls.Events.ERROR,(_event,data)=>{
    if(!data.fatal)return;
    if(data.type===Hls.ErrorTypes.NETWORK_ERROR)hls?.startLoad();
    else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)hls?.recoverMediaError();
    else setFailed(true);
   });
   hls.loadSource(STREAM);
   hls.attachMedia(video);
  }else{
   setFailed(true);
  }

  const retryTimer=window.setInterval(()=>{
   if(inView&&video.paused&&!document.hidden)play();
  },4000);

  return ()=>{
   disposed=true;
   window.clearInterval(retryTimer);
   observer.disconnect();
   document.removeEventListener('visibilitychange',onVisibility);
   video.removeEventListener('canplay',play);
   video.removeEventListener('loadeddata',play);
   video.removeEventListener('playing',onPlaying);
   video.removeEventListener('error',onError);
   hls?.destroy();
   video.pause();
   video.removeAttribute('src');
   video.load();
  };
 },[]);

 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
  <video
   ref={videoRef}
   autoPlay
   loop
   muted
   playsInline
   preload="auto"
   disablePictureInPicture
   className="footer-video-tint absolute inset-0 h-full w-full object-cover"
  />
  {failed&&<div className="footer-ambient absolute inset-[-20%] opacity-60"/>}
 </div>;
}
