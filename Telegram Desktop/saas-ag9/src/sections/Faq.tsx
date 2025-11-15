import React, { useState } from 'react';
import { ChevronDownIcon } from '../components/icons';
import { faqData } from '../data/mockData';
import type { FaqItemData } from '../types';

const FaqItem: React.FC<{ item: FaqItemData }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800">
                <span className="font-serif">{item.question}</span>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform text-primary-700 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-4 text-gray-600">{item.answer}</div>}
        </div>
    );
};

const FaqSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

const Faq = () => (
    <section id="faq" className="py-20 bg-primary-50">
        <FaqSchema />
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10 font-serif">คำถามที่พบบ่อย</h2>
            {faqData.map((item, index) => (
                <FaqItem key={index} item={item} />
            ))}
        </div>
    </section>
);

export default Faq;