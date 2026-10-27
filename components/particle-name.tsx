'use client';

import {useEffect,useRef} from 'react';

/** Particle typography inspired by the v0 icon motion study. */
export function ParticleName(){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer={x:-1000,y:-1000};
  let width=0,height=0,frame=0,raf=0,visible=true;
  type Dot={x:number;y:number;ox:number;oy:number;size:number;phase:number;drift:number};
  let dots:Dot[]=[];
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible&&!raf&&!reduce.matches)raf=requestAnimationFrame(draw)},{threshold:0.05});
  observer.observe(canvas);
  function setup(){
   const rect=canvas!.getBoundingClientRect();
   width=Math.max(1,Math.round(rect.width));height=Math.max(1,Math.round(rect.height));
   const dpr=Math.min(window.devicePixelRatio||1,2);
   canvas!.width=Math.round(width*dpr);canvas!.height=Math.round(height*dpr);
   ctx!.setTransform(dpr,0,0,dpr,0,0);
   const off=document.createElement('canvas');off.width=width;off.height=height;
   const offctx=off.getContext('2d',{willReadFrequently:true});if(!offctx)return;
   const fontSize=Math.min(width*.145,height*.64,132);
   offctx.fillStyle='#fff';
   offctx.font=`900 ${fontSize}px Arial, Helvetica, sans-serif`;
   offctx.textAlign='center';offctx.textBaseline='middle';
   offctx.fillText('BONIEK',width/2,height*.51,width*.88);
   const pixels=offctx.getImageData(0,0,width,height).data;
   const step=Math.max(4,Math.round(width/180));
   dots=[];
   for(let y=0;y<height;y+=step)for(let x=0;x<width;x+=step){
    if(pixels[(y*width+x)*4+3]>128){
     const jitter=Math.random()*.7;
     dots.push({x:x+(Math.random()-.5)*12,y:y+(Math.random()-.5)*12,ox:x,oy:y,size:Math.max(.6,step*.23+jitter),phase:Math.random()*Math.PI*2,drift:Math.random()*.65+.35});
    }
   }
   render(true);
  }
  function render(still=false){
   ctx!.clearRect(0,0,width,height);
   const time=frame*.035;
   for(const dot of dots){
    const wave=still?0:Math.sin(time*dot.drift+dot.phase+dot.ox*.025)*2.8;
    const swirl=still?0:Math.cos(time*.7+dot.phase+dot.oy*.035)*2.2;
    const dx=dot.ox-pointer.x,dy=dot.oy-pointer.y;
    const distance=Math.hypot(dx,dy)||1;
    const force=still?0:Math.pow(Math.max(0,1-distance/165),1.4);
    const angle=Math.atan2(dy,dx)+time*.25;
    const tx=dot.ox+wave+Math.cos(angle)*force*70-Math.sin(angle)*force*16;
    const ty=dot.oy+swirl+Math.sin(angle)*force*70+Math.cos(angle)*force*16;
    dot.x+=(tx-dot.x)*(still?1:.12);dot.y+=(ty-dot.y)*(still?1:.12);
    const shimmer=still?0:.22*Math.sin(time*1.3+dot.phase+dot.ox*.04);
    ctx!.fillStyle=`rgba(105,214,156,${Math.max(.26,Math.min(.92,.62+shimmer+force*.22))})`;
    ctx!.beginPath();ctx!.arc(dot.x,dot.y,dot.size*(1+force*.5),0,Math.PI*2);ctx!.fill();
   }
  }
  function draw(){raf=0;if(!visible||reduce.matches)return;frame++;render();raf=requestAnimationFrame(draw);}
  function move(e:PointerEvent){const rect=canvas!.getBoundingClientRect();pointer.x=e.clientX-rect.left;pointer.y=e.clientY-rect.top;}
  function leave(){pointer.x=-1000;pointer.y=-1000;}
  const resize=new ResizeObserver(setup);resize.observe(canvas);
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
  function motionChange(){if(reduce.matches){cancelAnimationFrame(raf);raf=0;render(true);}else if(!raf&&visible)raf=requestAnimationFrame(draw);}
  reduce.addEventListener('change',motionChange);
  setup();if(!reduce.matches)raf=requestAnimationFrame(draw);
  return ()=>{cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);reduce.removeEventListener('change',motionChange);};
 },[]);
 return <div className="relative w-full overflow-hidden" aria-label="Boniek">
  <canvas ref={canvasRef} aria-hidden="true" className="block h-[100px] w-full sm:h-[140px] lg:h-[180px]"/>
  <span className="sr-only">BONIEK</span>
 </div>;
}
