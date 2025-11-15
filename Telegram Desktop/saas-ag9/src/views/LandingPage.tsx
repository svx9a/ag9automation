import React from 'react';
import GifHero from '../sections/GifHero';
import Partners from '../sections/Partners';
import HowItWorks from '../sections/HowItWorks';
import ProductShowcase from '../sections/ProductShowcase';
import Pricing from '../sections/Pricing';
import Faq from '../sections/Faq';
import Contact from '../sections/Contact';
import FinalCta from '../sections/FinalCta';

const LandingPage = ({ onSignupClick }: { onSignupClick: () => void }) => {
    return (
        <div className="design-system">
            <GifHero onSignupClick={onSignupClick} logoUrl={"https://cdn.shopify.com/s/files/1/0767/5537/0199/files/GX-09.png?v=1763106361"} />
            <div className="bg-white text-gray-800">
                <Partners />
                <HowItWorks />
                <ProductShowcase />
                <Pricing onSelectPlan={onSignupClick}/>
                <Faq />
                <Contact />
            </div>
            <FinalCta onSignupClick={onSignupClick} />
        </div>
    );
};

export default LandingPage;