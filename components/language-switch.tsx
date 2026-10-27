'use client';
import {useLocale} from 'next-intl';
import {usePathname,useRouter} from '@/i18n/navigation';
export function LanguageSwitch(){const locale=useLocale();const pathname=usePathname();const router=useRouter();return <div aria-label="Language / Idioma" className="flex items-center rounded-full border border-white/15 p-1 text-xs">{(['en','pt'] as const).map(l=><button key={l} type="button" aria-pressed={locale===l} onClick={()=>router.replace(pathname,{locale:l})} className={`rounded-full px-3 py-1.5 transition ${locale===l?'bg-white text-[#0c0c0c]':'text-white/60 hover:text-white'}`}>{l.toUpperCase()}</button>)}</div>}
