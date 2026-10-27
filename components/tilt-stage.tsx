'use client';
import {useRef,useState,type ReactNode,type PointerEvent} from 'react';
type Props={children:ReactNode;className?:string;intensity?:number};
export function TiltStage({children,className='',intensity=7}:Props){
 const ref=useRef<HTMLDivElement>(null);
 const [angle,setAngle]=useState({x:0,y:0});
 const [active,setActive]=useState(false);
 function move(event:PointerEvent<HTMLDivElement>){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||event.pointerType==='touch')return;
  const rect=ref.current?.getBoundingClientRect();if(!rect)return;
  const x=(event.clientX-rect.left)/rect.width-.5;
  const y=(event.clientY-rect.top)/rect.height-.5;
  setAngle({x:-y*intensity,y:x*intensity});
 }
 return <div ref={ref} className={'tilt-stage '+className} onPointerMove={move} onPointerEnter={()=>setActive(true)} onPointerLeave={()=>{setActive(false);setAngle({x:0,y:0})}} style={{perspective:'1200px'}}>
  <div className="tilt-stage-inner" style={{transform:`rotateX(${angle.x}deg) rotateY(${angle.y}deg) translateZ(${active?10:0}px)`,transformStyle:'preserve-3d',transition:active?'transform 90ms linear':'transform 650ms cubic-bezier(.2,.8,.2,1)'}}>{children}</div>
 </div>;
}
