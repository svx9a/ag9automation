import React, { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import { SpinnerIcon, DocumentTextIcon, GiftIcon, BoltIcon } from '../icons';

type ExtractedInvoice = {
  company: string;
  vatRate: number;
  subtotal: number;
  vatAmount: number;
  total: number;
};

const InvoiceProcessingDemo = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [invoiceData, setInvoiceData] = useState<ExtractedInvoice | null>(null);
  const [easterEgg, setEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(false);

  const viewport = useMemo(() => ({ width: window.innerWidth, height: window.innerHeight }), []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!processing) return;
    setStep(0);
    setInvoiceData(null);
    setScore(0);
    const s1 = setTimeout(() => setStep(1), 400);
    const s2 = setTimeout(() => setStep(2), 900);
    const s3 = setTimeout(() => setStep(3), 1400);
    const s4 = setTimeout(() => {
      setStep(4);
      const subtotal = 12580;
      const vatRate = 0.07;
      const vatAmount = Math.round(subtotal * vatRate);
      const total = subtotal + vatAmount;
      setInvoiceData({ company: 'บริษัท ตัวอย่าง จำกัด', vatRate: 7, subtotal, vatAmount, total });
      setScore(Math.floor(Math.random() * 20) + 80);
      setProcessing(false);
    }, 2000);
    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); clearTimeout(s4); };
  }, [processing]);

  const handleLogoClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setEasterEgg(true);
      setTimeout(() => setEasterEgg(false), 3000);
      setClickCount(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg shadow-inner font-sans">
        <SpinnerIcon className="w-12 h-12 text-primary-500" />
        <p className="mt-4 text-gray-600 font-semibold">Loading Invoice Demo...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      {easterEgg && (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pixel_Dragon.png/128px-Pixel_Dragon.png"
          alt="Dragon!"
          className="fixed top-10 right-10 w-20 animate-fly"
        />
      )}

      {invoiceData && (
        <Confetti width={viewport.width} height={viewport.height} colors={["#FF6600", "#FFD700", "#000000"]} />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BoltIcon className="w-6 h-6 text-primary-600" />
          <h4 className="font-bold text-lg text-gray-800 font-serif">AI Invoice Processing</h4>
        </div>
        <button onClick={handleLogoClick} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-black text-white">
          <img src="/images/trae-ai.svg" alt="Trae AI" className="w-4 h-4" />
          <span>Trae AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative max-w-xl mx-auto aspect-video rounded-lg overflow-hidden border-4 border-gray-300">
          <img
            src="https://images.unsplash.com/photo-1522260634262-11b8023f03b4?q=80&w=1024&auto=format&fit=crop"
            alt="Invoice Preview"
            className="w-full h-full object-cover absolute"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-green-400 p-3 text-xs font-mono">
            {processing ? (
              <div>
                <p>&gt; อ่านข้อมูลใบแจ้งหนี้...</p>
                <p>&gt; พบบริษัท: บริษัท ตัวอย่าง จำกัด</p>
                <p>&gt; คำนวณภาษี: VAT 7% █</p>
                <p className="animate-blink">▮</p>
              </div>
            ) : (
              <div className="text-white text-xs">
                <p>พร้อมประมวลผลใบแจ้งหนี้ คลิก "Process" เพื่อเริ่มต้น</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DocumentTextIcon className="w-5 h-5 text-gray-700" />
            <p className="text-sm text-gray-700">Steps</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className={`px-3 py-2 rounded ${step >= 1 ? 'bg-green-50 text-green-700' : 'bg-white text-gray-700 border'}`}>Read invoice</li>
            <li className={`px-3 py-2 rounded ${step >= 2 ? 'bg-green-50 text-green-700' : 'bg-white text-gray-700 border'}`}>Detect vendor</li>
            <li className={`px-3 py-2 rounded ${step >= 3 ? 'bg-green-50 text-green-700' : 'bg-white text-gray-700 border'}`}>Compute VAT</li>
            <li className={`px-3 py-2 rounded ${step >= 4 ? 'bg-green-50 text-green-700' : 'bg-white text-gray-700 border'}`}>Extract totals</li>
          </ul>

          <div className="mt-4">
            <button
              onClick={() => setProcessing(true)}
              disabled={processing}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${processing ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-500'}`}
            >
              {processing ? 'Processing...' : 'Process'}
            </button>
          </div>

          {invoiceData && (
            <div className="mt-6">
              <div className="text-center mb-4">
                <div className="bg-gray-200 rounded-full h-4 w-full">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full h-4" style={{ width: `${score}%` }}></div>
                </div>
                <p className="font-bold text-orange-600 mt-2">Processing Power: {score}/100 {score >= 90 ? '🏆 Excellent!' : '👍 Good!'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="font-semibold text-gray-800">บริษัท</p>
                  <p className="text-gray-700">{invoiceData.company}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="font-semibold text-gray-800">VAT</p>
                  <p className="text-gray-700">{invoiceData.vatRate}%</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="font-semibold text-gray-800">Subtotal</p>
                  <p className="font-mono text-green-600">฿{invoiceData.subtotal.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="font-semibold text-gray-800">VAT Amount</p>
                  <p className="font-mono text-green-600">฿{invoiceData.vatAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3 col-span-2">
                  <p className="font-semibold text-gray-800">Total</p>
                  <p className="font-mono text-green-700 text-lg">฿{invoiceData.total.toLocaleString()}</p>
                </div>
              </div>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform mt-4 inline-flex items-center gap-2"
                onClick={() => setShowEnvelope(true)}
              >
                <GiftIcon className="w-5 h-5" /> เปิดอังเปา 🎉
              </button>
              {showEnvelope && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  🧧 คุณได้รับส่วนลด 10%! รหัส: <span className="font-mono">LUCKY2025</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceProcessingDemo;