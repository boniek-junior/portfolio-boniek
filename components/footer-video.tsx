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
  updateMotion();motion.addEventListener('change',updateMotion);
  let player:Hls|undefined;
  let disposed=false;
  
  const attemptPlay=()=>{
   if(disposed||motion.matches||document.hidden)return;
   video.muted=true;
   void video.play().then(()=>{if(!disposed)setPlaying(true);}).catch(()=>{if(!disposed)setPlaying(false);});
  };
  const onPlaying=()=>setPlaying(true);
  const onPause=()=>setPlaying(false);
  const onError=()=>{setPlaying(false);setFailed(true);};
  const onVisibility=()=>{if(document.hidden)video.pause();else attemptPlay();};
  video.addEventListener('playing',onPlaying);
  video.addEventListener('pause',onPause);
  video.addEventListener('canplay',attemptPlay);
  video.addEventListener('error',onError);
  document.addEventListener('visibilitychange',onVisibility);
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting)attemptPlay();
   else video.pause();
  },{threshold:0});
  observer.observe(video);
  // Native HLS is preferred on iOS/Safari. MSE/Hls.js is a fallback for other browsers.
  if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=STREAM;
   video.load();
  }else if(Hls.isSupported()){
   player=new Hls({enableWorker:true,lowLatencyMode:false});
   player.on(Hls.Events.ERROR,(_event,data)=>{
    if(!data.fatal)return;
    if(data.type===Hls.ErrorTypes.NETWORK_ERROR)player?.startLoad();
    else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)player?.recoverMediaError();
    else setFailed(true);
   });
   player.on(Hls.Events.MANIFEST_PARSED,attemptPlay);
   player.attachMedia(video);
   player.loadSource(STREAM);
  }else setFailed(true);
  attemptPlay();
  const retry=window.setInterval(()=>{
   if(!video.paused||document.hidden||motion.matches)return;
   attemptPlay();
  },5000);
  return ()=>{
   disposed=true;
   window.clearInterval(retry);
   motion.removeEventListener('change',updateMotion);
   video.removeEventListener('playing',onPlaying);
   video.removeEventListener('pause',onPause);
   video.removeEventListener('canplay',attemptPlay);
   video.removeEventListener('error',onError);
   document.removeEventListener('visibilitychange',onVisibility);
   observer.disconnect();
   player?.destroy();
   video.pause();
   video.removeAttribute('src');
   video.load();
  };
 },[]);
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,#103629_0%,#08140f_50%,#080b09_100%)]"/>
  <div className={`footer-ambient absolute inset-[-20%] opacity-70 ${!playing||reduced||failed?'footer-ambient-fallback':''}`}/>
  <video ref={videoRef} autoPlay loop muted playsInline preload="metadata" disablePictureInPicture className={`footer-video-tint absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing&&!failed&&!reduced?'opacity-55':'opacity-0'}`}/>
  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,11,9,.58),rgba(14,39,27,.16)_45%,rgba(8,11,9,.65))]"/>
 </div>;
}
