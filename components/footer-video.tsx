'use client';

import {useEffect,useRef,useState} from 'react';
import Hls from 'hls.js';

const STREAM='https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';


function FooterMotionCanvas({subtle}:{subtle:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;
  const ctx=canvas?.getContext('2d');
  if(!canvas||!ctx)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible=true;
  let raf=0;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{threshold:0});
  observer.observe(canvas);
  const render=(now:number)=>{
   const width=canvas.clientWidth,height=canvas.clientHeight;
   const dpr=Math.min(window.devicePixelRatio||1,1.5);
   const pw=Math.round(width*dpr),ph=Math.round(height*dpr);
   if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
   ctx.setTransform(dpr,0,0,dpr,0,0);
   ctx.clearRect(0,0,width,height);
   if(visible&&width>0&&height>0){
    const t=reduced.matches?0:now*.00017;
    const spread=Math.max(width,height);
    const glow=ctx.createRadialGradient(width*(.48+Math.sin(t)*.12),height*(.55+Math.cos(t*.7)*.12),0,width*.5,height*.55,spread*.7);
    glow.addColorStop(0,'rgba(62,207,142,.13)');
    glow.addColorStop(.55,'rgba(62,207,142,.035)');
    glow.addColorStop(1,'rgba(62,207,142,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    for(let layer=0;layer<5;layer++){
     const phase=t*(.5+layer*.12)+layer*1.35;
     const centerY=height*(.44+layer*.035);
     ctx.beginPath();
     for(let i=0;i<=110;i++){
      const x=width*i/110;
      const u=i/110;
      const envelope=Math.pow(Math.sin(Math.PI*u),1.25);
      const y=centerY+Math.sin(u*Math.PI*(2.3+layer*.19)+phase)*height*(.12+layer*.025)*envelope+Math.cos(u*11-phase*.7)*height*.017;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
     }
     ctx.strokeStyle='rgba(98,237,165,'+(.10+layer*.035)+')';
     ctx.lineWidth=.7+layer*.32;
     ctx.shadowColor='#3ecf8e';
     ctx.shadowBlur=10+layer*4;
     ctx.stroke();
    }
    ctx.shadowBlur=0;
    for(let i=0;i<72;i++){
     const seed=i*2.399963;
     const u=(i*.61803398875)%1;
     const x=width*(.08+.84*u);
     const y=height*(.18+.64*((i*.754877666)%1))+Math.sin(t*2+seed)*height*.025;
     const alpha=.08+.3*(.5+.5*Math.sin(t*3+seed));
     ctx.beginPath();ctx.arc(x,y,i%9===0?1.8:.8,0,Math.PI*2);
     ctx.fillStyle='rgba(133,233,181,'+alpha+')';ctx.fill();
    }
   }
   raf=window.requestAnimationFrame(render);
  };
  raf=window.requestAnimationFrame(render);
  return ()=>{window.cancelAnimationFrame(raf);observer.disconnect();};
 },[]);
 return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${subtle?'opacity-35':'opacity-100'}`}/>;
}

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
  <FooterMotionCanvas subtle={playing&&!failed&&!reduced}/>
  <div className={`footer-ambient absolute inset-[-20%] opacity-70 ${!playing||reduced||failed?'footer-ambient-fallback':''}`}/>
  <video ref={videoRef} autoPlay loop muted playsInline preload="auto" disablePictureInPicture className={`footer-video-tint absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing&&!failed&&!reduced?'opacity-70':'opacity-0'}`}/>
  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,11,9,.46),rgba(14,39,27,.09)_45%,rgba(8,11,9,.52))]"/>
 </div>;
}
