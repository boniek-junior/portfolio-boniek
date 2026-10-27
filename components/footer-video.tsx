'use client';

import {useEffect,useRef,useState} from 'react';
import Hls from 'hls.js';

const STREAM='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  let player:Hls|undefined;
  const play=()=>{void video.play().catch(()=>{});};
  const onError=()=>setFailed(true);
  video.addEventListener('error',onError);
  video.addEventListener('canplay',play);
  if(Hls.isSupported()){
   player=new Hls({enableWorker:true,lowLatencyMode:false});
   player.on(Hls.Events.ERROR,(_event,data)=>{
    if(data.fatal){
     if(data.type===Hls.ErrorTypes.NETWORK_ERROR)player?.startLoad();
     else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)player?.recoverMediaError();
     else setFailed(true);
    }
   });
   player.loadSource(STREAM);
   player.attachMedia(video);
  }else if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=STREAM;
   video.load();
   play();
  }else setFailed(true);
  return ()=>{video.removeEventListener('error',onError);video.removeEventListener('canplay',play);player?.destroy();video.pause();video.removeAttribute('src');video.load();};
 },[]);
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,#103629_0%,#08140f_50%,#080b09_100%)]"/>
  <div className="footer-ambient absolute inset-[-20%] opacity-70"/>
  <video ref={videoRef} autoPlay loop muted playsInline preload="auto" className={`footer-video-tint absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${failed?'opacity-0':'opacity-55'}`}/>
  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,11,9,.58),rgba(14,39,27,.16)_45%,rgba(8,11,9,.65))]"/>
 </div>;
}
