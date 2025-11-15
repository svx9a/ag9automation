import React from 'react';

const GifHero = ({ onSignupClick, logoUrl }: { onSignupClick: () => void; logoUrl?: string }) => {
  return (
    <section className="relative bg-black text-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image (Mistral) */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://cdn.shopify.com/s/files/1/0715/6924/4207/files/mistral-hero-img_-_Copy.webp?v=1762658081')" }}
      ></div>
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="AG9 logo"
            className="h-16 md:h-20 mx-auto mb-3 select-none pointer-events-none mix-blend-multiply"
            decoding="async"
            fetchpriority="high"
          />
        )}
        <h1 className="heading-1 my-4 font-serif">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary-400 to-primary-600">ขีดสุดแห่งประสิทธิภาพ:</span>
          <span className="text-gray-300"> ยอดขายทะยาน</span>
          <span className="text-gray-300"> คุณมีเวลามากขึ้น</span>
        </h1>
        <p className="text-sm text-gray-400">(The Peak of Efficiency: Soaring Sales, More Time for You.)</p>
        <p className="mt-4 text-lg text-gray-300 section-intro">
          ถึงเวลาปฏิวัติธุรกิจคุณ! แพลตฟอร์มอัจฉริยะของเราสร้างมาเพื่อการเติบโตอย่างไร้รอยต่อในตลาดไทยและอาเซียน จัดการทุกอย่างตั้งแต่ ลูกค้าเริ่มสนทนา ไปจนถึง สรุปยอดขายด้วย AI อัตโนมัติ — ลดภาระงาน เพิ่มผลกำไร ให้คุณโฟกัสกับการขยายอาณาจักรได้อย่างแท้จริง.
        </p>
        <button
          onClick={onSignupClick}
          className="mt-8 cta-primary"
        >
          Book a demo →
        </button>
      </div>

      <div className="relative mt-10 z-10 w-full max-w-4xl px-4">
        <div className="relative rounded-xl p-0.5 bg-gradient-to-br from-primary-500/50 via-transparent to-primary-500/50 shadow-2xl shadow-primary-900/40">
           <div className="bg-black rounded-[10px]">
             <img
               src="https://cdn.shopify.com/s/files/1/0715/6924/4207/files/grok-video-8250c387-a53a-4a5c-bb3d-75a94b53ed6e-ezgif.com-optimize_cef36895-cd75-4a0c-b408-c19ec730d4fd.gif?v=1762654718"
               alt="Automation preview"
               className="w-full h-auto rounded-lg"
               loading="lazy"
               decoding="async"
             />
           </div>
        </div>
      </div>
    </section>
  );
};

export default GifHero;
