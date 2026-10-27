'use client';
import {motion,useReducedMotion} from 'motion/react';
export function Reveal({children,delay=0,className=''}:{children:React.ReactNode;delay?:number;className?:string}){const reduced=useReducedMotion();return <motion.div initial={reduced?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay,ease:[.22,1,.36,1]}} className={className}>{children}</motion.div>}
