'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,X,ChevronLeft,ChevronRight} from 'lucide-react';
import {AutoplayVideo} from '@/components/autoplay-video';

type Project={name:string;category:string;description:string;stack:string[];image?:string;video?:string;links:{label:string;href:string}[]};
type Props={projects:Project[];viewDetails:string;closeLabel:string;selectLabel:string};

export function ProjectCarousel3D({projects,viewDetails,closeLabel,selectLabel}:Props){
  const [active,setActive]=useState(0);
  const [expanded,setExpanded]=useState(false);
  const [dragging,setDragging]=useState(false);
  const touchX=useRef<number|null>(null);
  const count=projects.length;
  const rotate=(direction:number)=>{setExpanded(false);setActive(a=>(a+direction+count)%count);};
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape')setExpanded(false);
      if(event.key==='ArrowLeft'){event.preventDefault();rotate(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();rotate(1);}
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[count]);
  return <div className="relative mx-auto mt-14 w-full max-w-6xl">
    <div className="relative h-[420px] overflow-hidden sm:h-[500px] md:h-[520px]" style={{perspective:'1250px'}} onTouchStart={e=>{touchX.current=e.touches[0].clientX;}} onTouchEnd={e=>{if(touchX.current!==null){const delta=e.changedTouches[0].clientX-touchX.current;if(Math.abs(delta)>45)rotate(delta>0?-1:1);touchX.current=null;}}} onPointerDown={e=>{if(e.pointerType==='mouse')touchX.current=e.clientX;}} onPointerUp={e=>{if(e.pointerType==='mouse'&&touchX.current!==null){const delta=e.clientX-touchX.current;if(Math.abs(delta)>60){rotate(delta>0?-1:1);setDragging(true);setTimeout(()=>setDragging(false),150);}touchX.current=null;}}}>
      <div aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-4 h-20 rounded-[100%] bg-[#3ecf8e]/15 blur-[50px]"/>
      {projects.map((project,index)=>{
        let offset=(index-active+count)%count;
        if(offset>count/2)offset-=count;
        const isActive=offset===0;
        const abs=Math.abs(offset);
        const visible=abs<=2;
        return <button key={project.name} type="button" aria-label={isActive?viewDetails+' '+project.name:selectLabel+' '+project.name} aria-current={isActive?'true':undefined} tabIndex={visible?0:-1} onClick={()=>{if(dragging)return;if(isActive)setExpanded(true);else{setExpanded(false);setActive(index);}}} className={'absolute left-1/2 top-1/2 w-[min(72vw,480px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border bg-[#131a16] text-left shadow-[0_25px_80px_#000b] transition-[transform,opacity,filter,border-color] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#85e9b5] sm:w-[min(65vw,480px)] '+(isActive?'border-[#85e9b5]/60':'border-white/15')} style={{height:'clamp(300px,38vw,390px)',transform:`translate(-50%,-50%) translateX(calc(${offset} * min(33vw, 370px))) translateZ(${isActive?80:-abs*140}px) rotateY(${-offset*24}deg) scale(${isActive?1:.82})`,opacity:visible?isActive?1:.75:0,zIndex:10-abs,pointerEvents:visible?'auto':'none',filter:isActive?'none':'brightness(.8)'}} >
          <div className="relative h-[65%] overflow-hidden bg-[#0a130e]">
            {project.image?<img src={project.image} alt="" className="h-full w-full object-contain"/>:project.video?<video src={project.video} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-hidden="true"/>:<div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#22654555,transparent_65%)]"><span className="font-mono text-6xl font-semibold text-[#85e9b5]/75">{String(index+1).padStart(2,'0')}</span></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131a16] via-transparent to-transparent"/>
            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 font-mono text-[10px] tracking-[.16em] text-[#85e9b5]">{String(index+1).padStart(2,'0')} / {String(count).padStart(2,'0')}</span>
          </div>
          <div className="flex h-[35%] flex-col justify-center px-6">
            <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#85e9b5]">{project.category}</span>
            <div className="mt-2 flex items-center justify-between gap-3"><h3 className="text-2xl font-semibold tracking-[-.05em] text-white sm:text-3xl">{project.name}</h3><ArrowUpRight className="shrink-0 text-[#85e9b5]" size={20}/></div>
            {isActive&&<span className="mt-2 font-mono text-[10px] tracking-[.13em] text-white/55">{viewDetails} ↗</span>}
          </div>
        </button>;
      })}
    </div>
    <div className="relative z-20 -mt-5 flex items-center justify-center gap-6">
      <button type="button" onClick={()=>rotate(-1)} aria-label="Previous project" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[#85e9b5] hover:text-[#85e9b5]"><ChevronLeft size={22}/></button>
      <div className="flex items-center gap-2">{projects.map((p,i)=><button key={p.name} type="button" aria-label={selectLabel+' '+p.name} aria-current={active===i?'true':undefined} onClick={()=>{setExpanded(false);setActive(i);}} className={'h-1.5 rounded-full transition-all duration-300 '+(active===i?'w-9 bg-[#85e9b5]':'w-2 bg-white/25 hover:bg-white/60')}/>)}</div>
      <button type="button" onClick={()=>rotate(1)} aria-label="Next project" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[#85e9b5] hover:text-[#85e9b5]"><ChevronRight size={22}/></button>
    </div>
    {expanded&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-8" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setExpanded(false);}}>
      <section role="dialog" aria-modal="true" aria-label={projects[active].name} className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#85e9b5]/30 bg-[#111915] text-left shadow-[0_30px_120px_#000]">
        <button type="button" onClick={()=>setExpanded(false)} aria-label={closeLabel} className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:text-[#85e9b5]"><X size={20}/></button>
        <div className="relative h-52 overflow-hidden bg-[#08110b] sm:h-80">{projects[active].image?<img src={projects[active].image} alt="" className="h-full w-full object-contain"/>:projects[active].video?<AutoplayVideo src={projects[active].video!} className="h-full w-full object-cover" ariaLabel={projects[active].name}/>:<div className="h-full bg-[radial-gradient(circle_at_center,#3ecf8e45,transparent_65%)]"/>}<div className="absolute inset-0 bg-gradient-to-t from-[#111915] to-transparent"/></div>
        <div className="relative -mt-8 px-6 pb-9 sm:px-10"><span className="font-mono text-xs tracking-[.2em] text-[#85e9b5]">{projects[active].category}</span><h3 className="mt-3 text-4xl font-semibold tracking-[-.06em] sm:text-6xl">{projects[active].name}</h3><p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{projects[active].description}</p><div className="mt-7 flex flex-wrap gap-2">{projects[active].stack.map(item=><span key={item} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/75">{item}</span>)}</div><div className="mt-8 flex flex-wrap gap-4">{projects[active].links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#85e9b5]/40 px-5 py-3 text-sm text-[#85e9b5] transition hover:bg-[#85e9b5] hover:text-[#08110b]">{link.label}<ArrowUpRight size={16}/></a>)}</div></div>
      </section>
    </div>}
  </div>;
}
