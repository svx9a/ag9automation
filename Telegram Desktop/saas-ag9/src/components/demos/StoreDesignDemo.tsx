import React, { useState, useEffect } from 'react';
import { useAutomation } from '../AutomationProvider';
import { SpinnerIcon } from '../icons';

const StoreDesignDemo = () => {
    const [isAfter, setIsAfter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<number>(0);
    const [logs, setLogs] = useState<{ ts: number; text: string }[]>([]);
    const [startAt, setStartAt] = useState<number | null>(null);
    const { trackConversion } = useAutomation();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1400);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isAfter) {
            setStep(0);
            const api: any = (window as any).AutomationAPI;
            try { api?.triggerFlow('storefront_transform', { stage: 'start' }); } catch {}
            setStartAt(Date.now());
            setLogs((prev) => [{ ts: Date.now(), text: 'Flow started' }, ...prev].slice(0, 100));
            const t1 = setTimeout(() => { setStep(1); try { api?.webhookEvent('render_stage', { stage: 'analyze' }); } catch {} }, 400);
            const l1 = setTimeout(() => setLogs((prev) => [{ ts: Date.now(), text: 'Stage: Analyze' }, ...prev].slice(0, 100)), 400);
            const t2 = setTimeout(() => { setStep(2); try { api?.webhookEvent('render_stage', { stage: 'layout' }); } catch {} }, 900);
            const l2 = setTimeout(() => setLogs((prev) => [{ ts: Date.now(), text: 'Stage: Layout' }, ...prev].slice(0, 100)), 900);
            const t3 = setTimeout(() => { setStep(3); try { api?.webhookEvent('render_stage', { stage: 'polish' }); } catch {} }, 1400);
            const l3 = setTimeout(() => setLogs((prev) => [{ ts: Date.now(), text: 'Stage: Polish' }, ...prev].slice(0, 100)), 1400);
            const t4 = setTimeout(() => { try { api?.webhookEvent('render_complete', { ok: true }); trackConversion('storefront_after'); } catch {} }, 1800);
            const l4 = setTimeout(() => setLogs((prev) => [{ ts: Date.now(), text: 'Flow complete ✅' }, ...prev].slice(0, 100)), 1800);
            return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(l1); clearTimeout(l2); clearTimeout(l3); clearTimeout(l4); };
        } else {
            setStep(0);
            const api: any = (window as any).AutomationAPI;
            try { api?.triggerFlow('storefront_reset', { stage: 'reset' }); } catch {}
        }
    }, [isAfter, trackConversion]);

    const replay = () => {
      setLogs([]);
      setStartAt(Date.now());
      if (isAfter) {
        setIsAfter(false);
        setTimeout(() => setIsAfter(true), 60);
      } else {
        setIsAfter(true);
      }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg shadow-inner font-sans">
                <SpinnerIcon className="w-12 h-12 text-primary-500" />
                <p className="mt-4 text-gray-600 font-semibold">Loading Store Design Demo...</p>
            </div>
        );
    }
    
    return(
      <div className="bg-white p-6 rounded-lg shadow-inner text-center">
        <h4 className="font-bold text-lg text-gray-800 mb-2 font-serif">Get a stunning storefront, instantly</h4>
        <p className="text-sm text-gray-600 mb-4">Toggle to see the transformation.</p>
        <div className="relative max-w-lg mx-auto aspect-video rounded-lg overflow-hidden border-4 border-gray-300">
           <img src="https://user-images.githubusercontent.com/10927233/213233868-8120dac8-4063-4809-9856-12ba205b38d3.png" alt="Before AI Design" className={`w-full h-full object-cover absolute transition-opacity duration-700 ${isAfter ? 'opacity-0' : 'opacity-100'}`} />
           <img src="https://cdn.dribbble.com/userupload/12513292/file/original-b1843d10f8221c548a8a6144e187515a.png?resize=1024x768" alt="After AI Design" className={`w-full h-full object-cover absolute transition-opacity duration-700 ${!isAfter ? 'opacity-0' : 'opacity-100'}`} />
           {isAfter && (
             <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white p-3 text-xs">
               <div className="flex items-center gap-2">
                 <div className="flex-1 h-1 bg-white/20 rounded">
                   <div className={`h-1 bg-gradient-to-r from-gold-500 to-gold-600 rounded transition-all duration-500 ${step >= 1 ? 'w-1/3' : 'w-0'}`}></div>
                 </div>
                 <div className="flex-1 h-1 bg-white/20 rounded">
                   <div className={`h-1 bg-gradient-to-r from-gold-500 to-gold-600 rounded transition-all duration-500 ${step >= 2 ? 'w-2/3' : 'w-0'}`}></div>
                 </div>
                 <div className="flex-1 h-1 bg-white/20 rounded">
                   <div className={`h-1 bg-gradient-to-r from-gold-500 to-gold-600 rounded transition-all duration-500 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                 </div>
               </div>
               <div className="mt-2 flex justify-between">
                 <span className={step >= 1 ? 'text-white' : 'text-white/60'}>Analyze</span>
                 <span className={step >= 2 ? 'text-white' : 'text-white/60'}>Layout</span>
                 <span className={step >= 3 ? 'text-white' : 'text-white/60'}>Polish</span>
               </div>
             </div>
           )}
        </div>
        <div className="mt-4 inline-flex items-center bg-gray-200 rounded-full p-1">
          <button onClick={() => setIsAfter(false)} className={`px-4 py-1 text-sm rounded-full ${!isAfter ? 'bg-white shadow' : 'text-gray-600'}`}>Before AI</button>
          <button onClick={() => setIsAfter(true)} className={`px-4 py-1 text-sm rounded-full ${isAfter ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow' : 'text-gray-600'}`}>After AI</button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={replay} className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow hover:shadow-lg transition-all">
            🔁 Replay
          </button>
        </div>

        <div className="mt-3 text-left">
          <div className="bg-white/95 border border-gray-200 rounded-lg shadow-inner max-h-52 overflow-y-auto transition-opacity duration-300">
            <ul className="divide-y divide-gray-100">
              {logs.map((l, idx) => {
                const base = (startAt ?? l.ts);
                const diffMs = Math.max(0, l.ts - base);
                const mm = String(Math.floor(diffMs / 60000)).padStart(2, '0');
                const ss = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
                return (
                  <li key={idx} className="px-3 py-2 text-xs text-gray-700">
                    <span className="font-mono text-gray-500 mr-2">[{mm}:{ss}]</span>
                    <span>{l.text}</span>
                  </li>
                );
              })}
              {logs.length === 0 && (
                <li className="px-3 py-2 text-xs text-gray-500">No events yet. Toggle "After AI" or hit Replay.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  export default StoreDesignDemo;