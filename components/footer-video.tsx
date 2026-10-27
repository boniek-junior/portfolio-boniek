'use client';

import {useEffect,useRef} from 'react';

const STREAM='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
type HlsPlayer={loadSource:(src:string)=>void;attachMedia:(video:HTMLVideoElement)=>void;destroy:()=>void};
type HlsConstructor={new():HlsPlayer;isSupported:()=>boolean};

export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches)return;
  let disposed=false;
  let player:HlsPlayer|undefined;
  const start=()=>{
   if(disposed)return;
   const Hls=(window as Window & {Hls?:HlsConstructor}).Hls;
   if(Hls?.isSupported()){
    player=new Hls();
    player.loadSource(STREAM);
    player.attachMedia(video);
    void video.play().catch(()=>{});
   }
  };
  if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=STREAM;
   void video.play().catch(()=>{});
  }else{
   const existing=document.querySelector<HTMLScriptElement>('script[data-footer-hls]');
   if(existing){
    if((window as Window & {Hls?:HlsConstructor}).Hls)start();
    else existing.addEventListener('load',start,{once:true});
   }else{
    const script=document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
    script.async=true;
    script.dataset.footerHls='true';
    script.addEventListener('load',start,{once:true});
    document.head.appendChild(script);
   }
  }
  return ()=>{disposed=true;player?.destroy();video.pause();video.removeAttribute('src');video.load();};
 },[]);
 return <video ref={videoRef} aria-hidden="true" autoPlay muted loop playsInline preload="none" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"/>;
}
