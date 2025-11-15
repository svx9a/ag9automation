import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../icons';

const SmartPromotionsDemo = () => {
    const [loading, setLoading] = useState(true);
    const [promo, setPromo] = useState({ sale: false, shipping: false });
    const originalPrice = 890;
    const salePrice = 750;
    const products = [{
        name: 'ชุดเดรสลายดอกไม้',
        price: '฿890',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop',
    }];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1300);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg font-sans">
                <SpinnerIcon className="w-12 h-12 text-primary-500" />
                <p className="mt-4 text-gray-600 font-semibold">Loading Promotions Demo...</p>
            </div>
        );
    }
    
    return(
      <div className="bg-white p-6 rounded-lg shadow-inner grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-gray-800 font-serif">Run promotions that convert</h4>
          <p className="text-sm text-gray-600">Activate smart rules and watch your sales grow. The AI can automatically enable these based on holidays, stock levels, or user behavior.</p>
           <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={promo.sale} onChange={() => setPromo(p => ({...p, sale: !p.sale}))} className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"/>
                Activate 2-Hour Flash Sale
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={promo.shipping} onChange={() => setPromo(p => ({...p, shipping: !p.shipping}))} className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"/>
                Offer Free Shipping
              </label>
            </div>
        </div>
        <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
          {promo.sale && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">SALE!</div>}
          <div className="aspect-square bg-gray-200">
            <img src={products[0].imageUrl} alt={products[0].name} className="w-full h-full object-cover object-center" />
          </div>
          <div className="p-4">
             {promo.shipping && <p className="text-xs font-bold text-green-600">✓ Free Shipping Unlocked</p>}
            <h3 className="text-lg font-semibold text-gray-800 font-serif">{products[0].name}</h3>
            <p className="mt-1 text-gray-600">
                {promo.sale ? (
                  <>
                    <span className="line-through text-gray-400">฿{originalPrice}</span>
                    <span className="font-bold text-red-600 ml-2">฿{salePrice}</span>
                  </>
                ) : `฿${originalPrice}`}
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default SmartPromotionsDemo;