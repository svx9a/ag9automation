import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckIcon } from '../components/icons';
import { howItWorksData } from '../data/mockData';
import type { HowItWorksItem } from '../types';

const HowItWorksCard: React.FC<{ item: HowItWorksItem; isActive: boolean; onClick: () => void }> = ({ item, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-6 rounded-xl border-2 transition-colors duration-300 ${isActive ? 'bg-white border-primary-500' : 'bg-white border-gray-200 hover:border-primary-300'}`}
  >
    <h3 className="text-xl font-semibold text-gray-900 font-serif">{item.title}</h3>
    {item.description && <p className="mt-2 text-gray-600">{item.description}</p>}
    <ul className="mt-4 space-y-2 text-sm">
      {item.features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-700">
          <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </button>
);


const HowItWorks = () => {
    const [activeItem, setActiveItem] = useState(2); // Start with the 3rd item active as per screenshot
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const demoRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    const stopAutoPlay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const startAutoPlay = useCallback(() => {
        stopAutoPlay();
        intervalRef.current = window.setInterval(() => {
            setActiveItem(prev => (prev + 1) % howItWorksData.length);
        }, 5000); // 5 seconds
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    startAutoPlay();
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            stopAutoPlay();
            if (sectionRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(sectionRef.current);
            }
        };
    }, [startAutoPlay]);

    useEffect(() => {
        if(demoRef.current){
            demoRef.current.classList.remove('opacity-100', 'scale-100');
            demoRef.current.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                demoRef.current?.classList.remove('opacity-0', 'scale-95');
                demoRef.current?.classList.add('opacity-100', 'scale-100');
            }, 150);
        }
    }, [activeItem]);

    const ActiveDemo = howItWorksData[activeItem].demo;

    return (
        <section 
            ref={sectionRef} 
            id="how-it-works" 
            className="py-20 bg-white overflow-hidden"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
        >
            <div className="container mx-auto px-4">
                <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif">
                        <span className="text-gray-800">ทำงานน้อยลง แต่</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary-500 to-primary-600">ขายได้มากขึ้น</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        โซลูชันถูกออกแบบให้ปรับใช้ได้รวดเร็วสำหรับธุรกิจในไทยและอาเซียน ตั้งแต่ลูกค้าทัก จนถึงรายงานสรุปยอดอัตโนมัติ
                    </p>
                </div>
                
                <div className={`mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="lg:col-span-1">
                       <div className="space-y-4">
                         {howItWorksData.map((item, index) => (
                             <HowItWorksCard
                                key={index}
                                item={item}
                                isActive={activeItem === index}
                                onClick={() => {
                                  setActiveItem(index);
                                  stopAutoPlay(); // Stop autoplay when user interacts
                                }}
                            />
                         ))}
                       </div>
                    </div>

                    <div ref={demoRef} className="lg:col-span-2 min-h-[480px] lg:min-h-[500px] bg-white border border-gray-200 rounded-xl p-2 shadow-inner transition-all duration-300 ease-in-out">
                        <ActiveDemo />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;