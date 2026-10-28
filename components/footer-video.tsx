'use client';

import {useEffect,useRef,useState} from 'react';
import Hls from 'hls.js';

const STREAM='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);
 const [playing,setPlaying]=useState(false);
 const [failed,setFailed]=useState(false);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotion=()=>setReduced(motion.matches);
  updateMotion();
  motion.addEventListener('change',updateMotion);
  let hls:Hls|undefined;
  let disposed=false;
  let inView=false;
  let recovery=0;
  const attemptPlay=()=>{
   if(disposed||!inView||document.hidden||motion.matches)return;
   video.muted=true;
   const promise=video.play();
   if(promise)void promise.then(()=>{if(!disposed)setPlaying(true);}).catch(()=>{if(!disposed)setPlaying(false);});
  };
  const onPlaying=()=>{setPlaying(true);setFailed(false);};
  const onPause=()=>setPlaying(false);
  const onError=()=>{setPlaying(false);setFailed(true);};
  const onVisibility=()=>{if(document.hidden)video.pause();else attemptPlay();};
  const onMotion=()=>{updateMotion();if(motion.matches)video.pause();else attemptPlay();};
  video.addEventListener('playing',onPlaying);
  video.addEventListener('pause',onPause);
  video.addEventListener('canplay',attemptPlay);
  video.addEventListener('loadeddata',attemptPlay);
  video.addEventListener('error',onError);
  document.addEventListener('visibilitychange',onVisibility);
  motion.addEventListener('change',onMotion);
  const observer=new IntersectionObserver(([entry])=>{
   inView=entry.isIntersecting;
   if(inView)attemptPlay();
   else video.pause();
  },{threshold:0});
  observer.observe(video);
  if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=STREAM;
   video.load();
  }else if(Hls.isSupported()){
   hls=new Hls({enableWorker:true,lowLatencyMode:false,maxBufferLength:20});
   hls.on(Hls.Events.MEDIA_ATTACHED,()=>hls?.loadSource(STREAM));
   hls.on(Hls.Events.MANIFEST_PARSED,attemptPlay);
   hls.on(Hls.Events.ERROR,(_event,data)=>{
    if(!data.fatal)return;
    recovery++;
    if(recovery>5){setFailed(true);return;}
    if(data.type===Hls.ErrorTypes.NETWORK_ERROR)hls?.startLoad();
    else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)hls?.recoverMediaError();
    else setFailed(true);
   });
   hls.attachMedia(video);
  }else setFailed(true);
  const retry=window.setInterval(()=>{
   if(inView&&video.paused&&!motion.matches&&!document.hidden)attemptPlay();
  },4000);
  return ()=>{
   disposed=true;
   window.clearInterval(retry);
   observer.disconnect();
   document.removeEventListener('visibilitychange',onVisibility);
   motion.removeEventListener('change',updateMotion);
   motion.removeEventListener('change',onMotion);
   video.removeEventListener('playing',onPlaying);
   video.removeEventListener('pause',onPause);
   video.removeEventListener('canplay',attemptPlay);
   video.removeEventListener('loadeddata',attemptPlay);
   video.removeEventListener('error',onError);
   hls?.destroy();
   video.pause();
   video.removeAttribute('src');
   video.load();
  };
 },[]);
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,#103629_0%,#08140f_50%,#080b09_100%)]"/>
  <div className={`footer-ambient absolute inset-[-20%] opacity-70 ${!playing||reduced||failed?'footer-ambient-fallback':''}`}/>
  <video ref={videoRef} autoPlay loop muted playsInline preload="auto" disablePictureInPicture className={`footer-video-tint absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing&&!failed&&!reduced?'opacity-70':'opacity-0'}`}/>
  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,11,9,.46),rgba(14,39,27,.09)_45%,rgba(8,11,9,.52))]"/>
 </div>;
}
