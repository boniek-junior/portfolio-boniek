'use client';
import {useRef,type ReactNode,type PointerEvent} from 'react';

type Props={children:ReactNode;className?:string;intensity?:number};

/** Subtle pointer depth without React re-renders on every pointer frame. */
export function TiltStage({children,className='',intensity=7}:Props){
 const surface=useRef<HTMLDivElement>(null);
 const raf=useRef<number|null>(null);
 const next=useRef({x:0,y:0});
 const active=useRef(false);
 function update(x:number,y:number){
  next.current={x,y};
  if(raf.current!==null)return;
  raf.current=requestAnimationFrame(()=>{
   raf.current=null;
   if(!surface.current)return;
   surface.current.style.transform=`rotateX(${next.current.x}deg) rotateY(${next.current.y}deg) translateZ(${active.current?10:0}px)`;
  });
 }
 function move(event:PointerEvent<HTMLDivElement>){
  if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const rect=event.currentTarget.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  update(-((event.clientY-rect.top)/rect.height-.5)*intensity,((event.clientX-rect.left)/rect.width-.5)*intensity);
 }
 function enter(event:PointerEvent<HTMLDivElement>){
  if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  active.current=true;
  if(surface.current)surface.current.style.transition='transform 90ms linear';
 }
 function leave(){
  active.current=false;
  if(surface.current)surface.current.style.transition='transform 650ms cubic-bezier(.2,.8,.2,1)';
  update(0,0);
 }
 return <div className={'tilt-stage '+className} onPointerMove={move} onPointerEnter={enter} onPointerLeave={leave} style={{perspective:'1200px'}}>
  <div ref={surface} className="tilt-stage-inner" style={{transformStyle:'preserve-3d',transition:'transform 650ms cubic-bezier(.2,.8,.2,1)'}}>{children}</div>
 </div>;
}
