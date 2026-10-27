import '../globals.css';
import type {Metadata} from 'next';
import {NextIntlClientProvider,hasLocale} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
export const metadata:Metadata={title:'Boniek | Digital Architect',description:'Software engineering, AI and products — Boniek.',alternates:{languages:{en:'/en',pt:'/pt'}}};
export function generateStaticParams(){return routing.locales.map(locale=>({locale}));}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!hasLocale(routing.locales,locale))notFound();const messages=await getMessages();return <html lang={locale}><body><NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider></body></html>}
