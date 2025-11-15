import React, { useMemo } from 'react';
import { CheckIcon } from '../components/icons';
import { pricingTiers } from '../data/mockData';
const Pricing = ({ onSelectPlan }: { onSelectPlan: () => void }) => {
  const apiBase = useMemo(() => {
    const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
    if (envBase && envBase.trim().length > 0) return envBase.trim();
    const isBrowser = typeof window !== 'undefined';
    const host = isBrowser ? (window.location?.hostname || '') : '';
    const isLocal = /^localhost$|^127\.0\.0\.1$|^192\.168\./.test(host);
    return isLocal ? 'http://127.0.0.1:8001' : 'https://v9-api.azurewebsites.net';
  }, []);

  async function startCheckout(tierName: string) {
    let plan = '';
    const n = tierName.toLowerCase();
    if (n.includes('ignite')) plan = 'startup';
    else if (n.includes('ascend')) plan = 'growth';
    else if (n.includes('apex')) plan = 'enterprise';
    else {
      onSelectPlan();
      return;
    }
    try {
      const res = await fetch(`${apiBase}/billing/checkout?plan=${plan}`, { method: 'POST' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json() as any;
      const url = data?.url as string | undefined;
      if (url) window.location.assign(url);
      else onSelectPlan();
    } catch {
      onSelectPlan();
    }
  }

  return (
  <section id="pricing" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">แพ็กเกจที่ใช่สำหรับร้านคุณ</h2>
        <p className="mt-4 text-lg text-gray-600">เลือกแพ็กเกจที่เหมาะกับขนาดธุรกิจของคุณที่สุด</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
        {pricingTiers.map(tier => (
          <div key={tier.name} className={`border rounded-lg p-8 text-center transition-all relative flex flex-col ${tier.popular ? 'border-primary-500 border-2 scale-105 bg-primary-50' : 'border-gray-200 bg-white'}`}>
            {tier.popular && <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4 left-1/2 -translate-x-1/2">ยอดนิยม</span>}
            <h3 className="text-2xl font-semibold text-gray-800 font-serif">{tier.name}</h3>
            <p className="my-4">
              {tier.priceLabel ? (
                <span className="text-3xl font-bold">{tier.priceLabel}</span>
              ) : tier.price ? (
                <>
                  <span className="text-4xl font-bold">฿{tier.price}</span>
                  <span className="text-gray-500">/เดือน</span>
                </>
              ) : (
                <span className="text-xl font-semibold text-gray-600">Contact sales</span>
              )}
            </p>
            {tier.subtitle && (
              <p className="text-sm text-gray-600">{tier.subtitle}</p>
            )}
            <ul className="space-y-3 text-left my-8 flex-grow">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => startCheckout(tier.name)} className={`${tier.popular ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white hover:shadow-lg shadow-gold-500/40' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} w-full py-3 rounded-lg font-semibold transition-all mt-auto`}>
              เลือกแพ็กเกจนี้
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Pricing;