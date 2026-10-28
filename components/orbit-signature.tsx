'use client';

import {useEffect,useRef,useState} from 'react';
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import {Pause,Play,RotateCcw,MousePointer2} from 'lucide-react';

const tech=[
 {name:'React',company:'Meta',icon:'react/react-original.svg',detail:'Interfaces reativas e experiências interativas.'},
 {name:'TypeScript',company:'Microsoft',icon:'typescript/typescript-original.svg',detail:'Código previsível, tipado e sustentável.'},
 {name:'Python',company:'Python Software Foundation',icon:'python/python-original.svg',detail:'Automação, serviços e inteligência artificial.'},
 {name:'Supabase',company:'Supabase',icon:'supabase/supabase-original.svg',detail:'Dados, autenticação e infraestrutura de produto.'},
 {name:'Docker',company:'Docker',icon:'docker/docker-original.svg',detail:'Ambientes reproduzíveis para aplicações.'},
 {name:'Git',company:'Open source',icon:'git/git-original.svg',detail:'Histórico, colaboração e evolução contínua.'},
 {name:'Java',company:'Oracle',icon:'java/java-original.svg',detail:'Aplicações robustas e arquitetura de serviços.'},
 {name:'Next.js',company:'Vercel',icon:'nextjs/nextjs-original.svg',detail:'Experiências web rápidas e escaláveis.'}
] as const;

function ParticleGlobe({paused}:{paused:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const reduced=useReducedMotion();
 useEffect(()=>{
  const element=canvas.current;if(!element)return;
  const context=element.getContext('2d');if(!context)return;
  const count=1100;
  const points=Array.from({length:count},(_,i)=>{
   const y=1-2*(i+.5)/count;
   const radial=Math.sqrt(1-y*y);
   const angle=i*Math.PI*(3-Math.sqrt(5));
   return [Math.cos(angle)*radial,y,Math.sin(angle)*radial] as const;
  });
  let raf=0,rotation=.35,visible=true,last=0;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{threshold:0});
  observer.observe(element);
  const render=(time:number)=>{
   const rect=element.getBoundingClientRect();
   const side=Math.max(1,Math.round(Math.min(rect.width,rect.height)));
   const pixelRatio=Math.min(window.devicePixelRatio||1,2);
   const target=Math.round(side*pixelRatio);
   if(element.width!==target||element.height!==target){element.width=target;element.height=target;}
   context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
   context.clearRect(0,0,side,side);
   if(visible){
    const dt=last?Math.min(48,time-last):16;last=time;
    if(!paused&&!reduced)rotation+=dt*.00023;
    const r=side*.37,c=side/2;
    const cos=Math.cos(rotation),sin=Math.sin(rotation);
    const tilt=.22,ct=Math.cos(tilt),st=Math.sin(tilt);
    for(const [x,y,z] of points){
     const rx=x*cos-z*sin,rz=x*sin+z*cos;
     const ry=y*ct-rz*st,depth=y*st+rz*ct;
     const scale=1+depth*.10;
     const px=c+rx*r*scale,py=c+ry*r*scale;
     const alpha=(depth+1)/2;
     context.beginPath();
     context.arc(px,py,Math.max(.35,side*.0015)*(0.65+alpha*.75),0,Math.PI*2);
     context.fillStyle=`rgba(133,233,181,${.08+alpha*.73})`;
     context.fill();
    }
    const halo=context.createRadialGradient(c,c,side*.19,c,c,side*.45);
    halo.addColorStop(0,'rgba(62,207,142,0)');
    halo.addColorStop(.7,'rgba(62,207,142,.04)');
    halo.addColorStop(1,'rgba(62,207,142,0)');
    context.fillStyle=halo;context.fillRect(0,0,side,side);
   }
   raf=requestAnimationFrame(render);
  };
  raf=requestAnimationFrame(render);
  return ()=>{cancelAnimationFrame(raf);observer.disconnect();};
 },[paused,reduced]);
 return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true"/>;
}

export function OrbitSignature(){
 const reduced=useReducedMotion();
 const [selected,setSelected]=useState<number|null>(null);
 const [paused,setPaused]=useState(false);
 const [time,setTime]=useState(0);
 const stage=useRef<HTMLDivElement>(null);
 const state=useRef({paused:false,reduced:false,visible:false});
 const last=useRef(0);
 useEffect(()=>{state.current.paused=paused;state.current.reduced=!!reduced;},[paused,reduced]);
 useEffect(()=>{
  const el=stage.current;if(!el)return;
  const observer=new IntersectionObserver(([entry])=>{state.current.visible=entry.isIntersecting;},{threshold:.05});
  observer.observe(el);
  let raf=0;
  const tick=(now:number)=>{
   const dt=last.current?Math.min(50,now-last.current):0;last.current=now;
   if(state.current.visible&&!state.current.paused&&!state.current.reduced)setTime(t=>t+dt*.00022);
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return ()=>{cancelAnimationFrame(raf);observer.disconnect();};
 },[]);
 return <div className="relative mx-auto w-full max-w-[670px]">
  <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[9px] tracking-[.18em] text-[#85e9b5]/60 sm:text-[10px]"><span>TECHNOLOGY UNIVERSE</span><span className="flex items-center gap-2"><span className="size-1.5 animate-pulse rounded-full bg-[#85e9b5]"/> INTERACTIVE / 3D</span></div>
  <div ref={stage} className="relative mx-auto aspect-square w-full overflow-hidden rounded-[28px] border border-[#3ecf8e]/10 bg-[radial-gradient(ellipse_at_50%_50%,#102419_0%,#08110c_43%,#080b09_78%)]" role="group" aria-label="Universo interativo de tecnologias com globo de partículas e órbita tridimensional">
   <div className="pointer-events-none absolute inset-0 opacity-25" style={{backgroundImage:'radial-gradient(#85e9b5 0.7px,transparent 0.7px)',backgroundSize:'23px 23px',maskImage:'radial-gradient(circle,transparent 24%,black 90%)'}}/>
   <div className="pointer-events-none absolute inset-[19%] rounded-full border border-[#85e9b5]/10 shadow-[0_0_65px_#3ecf8e12]"/>
   <div className="pointer-events-none absolute inset-[26%] rounded-full bg-[#3ecf8e]/5 blur-[35px]"/>
   <ParticleGlobe paused={paused}/>
   <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#85e9b5]/20"/>
   {tech.map((tool,i)=>{
    const angle=time+i*Math.PI*2/tech.length;
    const z=Math.sin(angle);
    const depth=(z+1)/2;
    const x=50+Math.cos(angle)*35;
    const y=50+Math.sin(angle)*35;
    const scale=.82+depth*.25;
    return <button key={tool.name} type="button" onClick={()=>{setSelected(i);setPaused(true);}} aria-pressed={selected===i} aria-label={`Explorar ${tool.name}`} className={`absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border bg-[#14231a]/90 p-2 shadow-[0_10px_25px_#0009] backdrop-blur-md transition-[border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#85e9b5] sm:size-[58px] sm:rounded-2xl sm:p-3 ${selected===i?'border-[#85e9b5] shadow-[0_0_30px_#3ecf8e60]':'border-[#85e9b5]/30 hover:border-[#85e9b5] hover:shadow-[0_0_25px_#3ecf8e40]'}`} style={{left:`${x}%`,top:`${y}%`,opacity:.5+depth*.5,zIndex:Math.round(depth*20)+1,transform:`translate(-50%,-50%) scale(${scale})`,filter:z<-.4?'blur(.35px)':undefined}}>
     <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.icon}`} width={36} height={36} loading="lazy" alt="" className={`h-full w-full object-contain ${tool.name==='Next.js'?'brightness-0 invert':''}`}/>
     {selected===i&&<span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#85e9b5]/25 bg-[#0b150f] px-2 py-1 text-[10px] text-[#baf8d7]">{tool.name}</span>}
    </button>;
   })}
   <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[9px] tracking-[.2em] text-[#85e9b5]/45 sm:bottom-6 sm:left-6">THE SIGNATURE / 001</div>
   <button type="button" onClick={()=>setPaused(v=>!v)} className="absolute bottom-3 right-3 z-30 flex items-center gap-2 rounded-full border border-[#85e9b5]/25 bg-[#0b160f]/85 px-3 py-2 font-mono text-[10px] text-[#baf8d7] backdrop-blur-sm hover:border-[#85e9b5]/70 focus-visible:outline-2 focus-visible:outline-[#85e9b5] sm:bottom-5 sm:right-5">{paused?<Play size={12}/>:<Pause size={12}/>} {paused?'CONTINUAR':'PAUSAR'}</button>
  </div>
  <div className="mt-4 min-h-[108px] rounded-2xl border border-[#85e9b5]/15 bg-[#0d1711]/80 p-4 text-center sm:min-h-[100px]" aria-live="polite">
   <AnimatePresence mode="wait"><motion.div key={selected===null?'intro':selected} initial={reduced?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-8}} transition={{duration:.2}}>
    {selected===null?<><p className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[.15em] text-[#85e9b5]"><MousePointer2 size={13}/> EXPLORE A ÓRBITA</p><p className="mt-2 text-xs leading-6 text-white/45">Selecione uma tecnologia para descobrir como ela faz parte do meu universo.</p></>:<><p className="font-mono text-[10px] tracking-[.15em] text-[#85e9b5]">{tech[selected].company.toUpperCase()} / {tech[selected].name.toUpperCase()}</p><p className="mt-2 text-sm leading-6 text-white/70">{tech[selected].detail}</p></>}
   </motion.div></AnimatePresence>
   {selected!==null&&<button type="button" onClick={()=>{setSelected(null);setPaused(false);}} className="mx-auto mt-3 flex items-center gap-1.5 font-mono text-[10px] text-[#85e9b5]/75 hover:text-[#85e9b5]"><RotateCcw size={12}/> RETOMAR EXPLORAÇÃO</button>}
  </div>
 </div>;
}
