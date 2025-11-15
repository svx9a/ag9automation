import React, { useEffect, useState } from 'react';
import Tooltip from '../components/common/Tooltip';

type LogoItem = { name: string; src?: string; href?: string; badge?: string };

const fallbackLogos: LogoItem[] = [
  { name: 'xAI', src: '/images/xai.svg', href: 'https://x.ai/' },
  { name: 'Microsoft Azure', src: '/images/azure.svg', href: 'https://azure.microsoft.com/' },
  { name: 'Cloudflare', src: '/images/cloudflare.svg', href: 'https://www.cloudflare.com/' },
  { name: 'Partner 3', src: '/images/partner-3.svg' },
  { name: 'Partner 4', src: '/images/partner-4.svg' },
  { name: 'Vercel', src: '/images/vercel.svg', href: 'https://vercel.com' },
  { name: 'OpenAI', src: '/images/openai.svg', href: 'https://openai.com' },
  { name: 'Anthropic', src: '/images/anthropic.svg', href: 'https://www.anthropic.com' },
  { name: 'Google Cloud', src: '/images/google-cloud.svg', href: 'https://cloud.google.com' },
  { name: 'AWS', src: '/images/aws.svg', href: 'https://aws.amazon.com' },
  { name: 'Hugging Face', src: '/images/huggingface.svg', href: 'https://huggingface.co' },
  { name: 'Mistral AI', src: '/images/mistral.svg', href: 'https://mistral.ai' },
  { name: 'Stability AI', src: '/images/stabilityai.svg', href: 'https://stability.ai' },
  { name: 'Meta', src: '/images/meta.svg', href: 'https://ai.meta.com' },
  { name: 'Cohere', src: '/images/cohere.svg', href: 'https://cohere.com' },
  { name: 'Fetch.ai', src: 'https://seeklogo.com/images/F/fetch-ai-fet-logo-398557.svg', href: 'https://fetch.ai' },
  { name: 'Trae AI', badge: 'Trae AI' },
];

const Partners = () => {
  const [logos, setLogos] = useState<LogoItem[]>(fallbackLogos);
  useEffect(() => {
    const host = window.location.hostname || '';
    const isLocal = host === 'localhost' || host === '127.0.0.1' || /^192\.168\./.test(host);
    const base = isLocal ? 'http://127.0.0.1:8000' : 'https://v9-api.azurewebsites.net';
    const load = async () => {
      try {
        const res = await fetch(base + '/partners/logos');
        if (!res.ok) return;
        const data: { name: string; logo_url?: string; use?: boolean }[] = await res.json();
        const mapped: LogoItem[] = data.map(d => {
          const use = !!d.use;
          const hasSrc = !!d.logo_url;
          if (use && hasSrc) return { name: d.name, src: d.logo_url };
          return { name: d.name, badge: d.name };
        });
        if (mapped.length) setLogos(mapped);
      } catch {}
    };
    load();
  }, []);
  const renderRow = (items: LogoItem[]) => (
    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
      {items.map((logo, index) => (
        <li key={index}>
          <Tooltip text={logo.name}>
            {logo.badge ? (
              <span className="inline-flex items-center justify-center h-9 px-3 rounded-full bg-gold-600 text-white font-semibold text-sm">{logo.badge}</span>
            ) : logo.href ? (
              <a href={logo.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                <img src={logo.src!} alt={`${logo.name} logo`} className="partner-logo opacity-80 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0" loading="lazy" decoding="async" fetchpriority="low" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
              </a>
            ) : (
              <img src={logo.src!} alt={`${logo.name} logo`} className="partner-logo opacity-80 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0" loading="lazy" decoding="async" fetchpriority="low" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
            )}
          </Tooltip>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <h3 className="text-lg font-semibold mb-8 font-serif">ASEAN Automation House โดยทีมไทย — ขับเคลื่อนด้วยเทคโนโลยีระดับโลก</h3>
        <div className="ticker w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          {renderRow(logos)}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll" aria-hidden="true">
            {logos.map((logo, index) => (
              <li key={index}>
                <Tooltip text={logo.name}>
                  {logo.badge ? (
                    <span className="inline-flex items-center justify-center h-9 px-3 rounded-full bg-gold-600 text-white font-semibold text-sm">{logo.badge}</span>
                  ) : logo.href ? (
                    <a href={logo.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      <img src={logo.src!} alt={`${logo.name} logo`} className="partner-logo opacity-80 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0" loading="lazy" decoding="async" fetchpriority="low" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
                    </a>
                  ) : (
                    <img src={logo.src!} alt={`${logo.name} logo`} className="partner-logo opacity-80 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0" loading="lazy" decoding="async" fetchpriority="low" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        <style>{`
          @keyframes infinite-scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } }
          .animate-infinite-scroll { animation: infinite-scroll 40s linear infinite; }
          .ticker:hover .animate-infinite-scroll { animation-play-state: paused; }
          .partner-logo { height: 2.25rem; width: auto; vertical-align: middle; }
          @media (max-width: 768px) { .animate-infinite-scroll { animation: infinite-scroll 60s linear infinite; } }
        `}</style>
      </div>
    </div>
  );
};

export default Partners;