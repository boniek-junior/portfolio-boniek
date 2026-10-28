'use client';

import {useEffect,useRef} from 'react';
import Hls from 'hls.js';

const VIDEO_URL='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

/** Exact HLS cinematic background from the supplied CTA + Footer reference. */
export function FooterVideo(){
 const videoRef=useRef<HTMLVideoElement>(null);

 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;

  let hls:Hls|undefined;
  video.muted=true;
  video.defaultMuted=true;

  const tryPlay=()=>{
   const result=video.play();
   if(result)void result.catch(()=>{});
  };

  if(Hls.isSupported()){
   hls=new Hls();
   hls.loadSource(VIDEO_URL);
   hls.attachMedia(video);
   hls.on(Hls.Events.MANIFEST_PARSED,tryPlay);
  }else if(video.canPlayType('application/vnd.apple.mpegurl')){
   video.src=VIDEO_URL;
   video.load();
  }

  video.addEventListener('canplay',tryPlay);
  const onVisible=()=>{if(!document.hidden)tryPlay();};
  document.addEventListener('visibilitychange',onVisible);

  return ()=>{
   video.removeEventListener('canplay',tryPlay);
   document.removeEventListener('visibilitychange',onVisible);
   hls?.destroy();
   video.pause();
   video.removeAttribute('src');
  };
 },[]);

 return <video
  ref={videoRef}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover [filter:grayscale(1)_sepia(.65)_hue-rotate(85deg)_saturate(2)_brightness(.85)_contrast(1.12)]"
 />;
}
