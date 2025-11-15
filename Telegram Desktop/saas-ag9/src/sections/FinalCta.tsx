import React from 'react';
import { useAutomation } from '../components/AutomationProvider';

const FinalCta = ({ onSignupClick }: { onSignupClick: () => void }) => {
    const { ctaText, trackConversion } = useAutomation();
    const handleClick = () => { trackConversion('final_cta'); onSignupClick(); };
    return (
    <section className="bg-gradient-to-tr from-gold-500 via-gold-600 to-primary-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
             <h2 className="heading-2 font-serif">พร้อมยกระดับธุรกิจในไทยและอาเซียนด้วยระบบอัตโนมัติหรือยัง?</h2>
             <p className="mt-4 text-lg text-white/90 section-intro">เราเป็น Automation House จากประเทศไทย ให้บริการโซลูชันอัตโนมัติและ AI ครบวงจรทั่ว ASEAN</p>
             <button onClick={handleClick} className="mt-8 cta-secondary">
                {ctaText}
            </button>
            <p className="mt-4 text-sm text-white/80">LINE: @automaticthai | โทร: 082-XXX-XXXX | ASEAN support available</p>
        </div>
    </section>
    );
};

export default FinalCta;
