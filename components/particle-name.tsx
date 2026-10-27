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
  type Dot={x:number;y:number;ox:number;oy:number;size:number;phase:number};
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
   const fontSize=Math.min(width*.172,height*.43,225);
   offctx.fillStyle='#fff';
   offctx.font=`900 ${fontSize}px Arial, Helvetica, sans-serif`;
   offctx.textAlign='center';offctx.textBaseline='middle';
   offctx.fillText('BONIEK',width/2,height*.36,width*.94);
   offctx.font=`700 ${Math.min(fontSize*.31,height*.13)}px Arial, Helvetica, sans-serif`;
   offctx.fillText('JUNIOR',width/2,height*.74,width*.7);
   const pixels=offctx.getImageData(0,0,width,height).data;
   const step=Math.max(3,Math.round(width/235));
   dots=[];
   for(let y=0;y<height;y+=step)for(let x=0;x<width;x+=step){
    if(pixels[(y*width+x)*4+3]>128){
     const jitter=Math.random()*.7;
     dots.push({x:x+(Math.random()-.5)*12,y:y+(Math.random()-.5)*12,ox:x,oy:y,size:Math.max(.6,step*.23+jitter),phase:Math.random()*Math.PI*2});
    }
   }
   render(true);
  }
  function render(still=false){
   ctx!.clearRect(0,0,width,height);
   for(const dot of dots){
    const dx=dot.x-pointer.x,dy=dot.y-pointer.y;
    const distance=Math.hypot(dx,dy)||1;
    const force=still?0:Math.max(0,1-distance/130);
    const tx=dot.ox+(dx/distance)*force*38;
    const ty=dot.oy+(dy/distance)*force*38;
    dot.x+=(tx-dot.x)*(still?1:.085);dot.y+=(ty-dot.y)*(still?1:.085);
    const glow=still?0:.18*Math.sin(frame*.025+dot.phase);
    ctx!.fillStyle=`rgba(166,193,255,${Math.max(.35,.8+glow)})`;
    ctx!.beginPath();ctx!.arc(dot.x,dot.y,dot.size,0,Math.PI*2);ctx!.fill();
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
 return <div className="relative w-full overflow-hidden" aria-label="Boniek Junior">
  <canvas ref={canvasRef} aria-hidden="true" className="block h-[200px] w-full sm:h-[280px] lg:h-[370px]"/>
  <span className="sr-only">BONIEK JUNIOR</span>
 </div>;
}
