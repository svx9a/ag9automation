import React from 'react';

const Hero = ({ onSignupClick }: { onSignupClick: () => void }) => (
  <section className="relative h-[60vh] md:h-[70vh] bg-primary-950 text-white flex items-center justify-center text-center">
    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522260634262-11b8023f03b4?q=80&w=2070&auto=format&fit=crop')" }}></div>
    <div className="relative z-10 p-4">
      <h2 className="font-normal font-serif text-xl md:text-2xl tracking-wider">童年·自动</h2>
      <h1 className="text-4xl md:text-6xl font-bold my-4 font-serif">AI ดูแลร้าน คุณไปปล่อยว่าว</h1>
      <button onClick={onSignupClick} className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl shadow-primary-500/30 transition-all transform hover:scale-105">
        ทดลองฟรี 7 วัน →
      </button>
    </div>
  </section>
);

export default Hero;
