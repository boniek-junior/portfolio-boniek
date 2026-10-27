import '../globals.css';
import type {Metadata} from 'next';
import {NextIntlClientProvider,hasLocale} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
export const metadata:Metadata={title:'Boniek — Software, AI & Digital Experiences',description:'Boniek Araujo: software development, artificial intelligence and digital products. Explore real projects including Just Analytics, BarberPro and MindDrop.',openGraph:{type:'website',title:'Boniek — Software, AI & Digital Experiences',description:'Engineering meets design. Explore selected software and AI projects.'},robots:{index:true,follow:true},alternates:{languages:{en:'/en',pt:'/pt'}}};
export function generateStaticParams(){return routing.locales.map(locale=>({locale}));}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!hasLocale(routing.locales,locale))notFound();const messages=await getMessages();return <html lang={locale}><body><NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider></body></html>}
