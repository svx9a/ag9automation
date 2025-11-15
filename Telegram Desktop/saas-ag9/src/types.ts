import React from 'react';

// For App.tsx
export type AppView = 'landing' | 'dashboard';

// For AuthModal.tsx
export type AuthView = 'social' | 'email';
export type AuthMode = 'login' | 'signup';

// For Dashboard.tsx
export type QuickStat = {
  title: string;
  value: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
};

export type OrderStatus = 'Shipped' | 'Processing' | 'Delivered' | 'Cancelled';

export type RecentOrder = {
  id: string;
  customer: string;
  amount: string;
  status: OrderStatus;
};

export type TopProduct = {
  name: string;
  stock: number;
};

// For HowItWorks.tsx
export type HowItWorksItem = {
    title: string;
    description: string;
    features: string[];
    demo: React.FC;
};

// For Partners.tsx
export type TechPartner = {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

// For Pricing.tsx
export type PricingTier = {
    name: string;
    price?: string;
    priceLabel?: string;
    popular: boolean;
    features: string[];
    subtitle?: string;
};

// For Faq.tsx
export type FaqItemData = {
    question: string;
    answer: string;
};