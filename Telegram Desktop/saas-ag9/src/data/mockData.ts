import React from 'react';
import {
  MegaphoneIcon,
  SparklesIcon,
  TagIcon,
  VercelIcon,
  AzureIcon,
  GoogleCloudIcon,
  AwsIcon,
  OpenAiIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatIcon,
} from '../components/icons';
import type { QuickStat, RecentOrder, TopProduct, HowItWorksItem, TechPartner, PricingTier, FaqItemData } from '../types';
import AutomationDemo from '../components/demos/AutomationDemo';
import ReportingDemo from '../components/demos/ReportingDemo';
import StoreDesignDemo from '../components/demos/StoreDesignDemo';
import InvoiceProcessingDemo from '../components/demos/InvoiceProcessingDemo';


// Data for Dashboard.tsx
export const quickStats: QuickStat[] = [
  {
    title: "Today's Sales",
    value: '฿12,580',
    icon: CurrencyDollarIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'New Orders',
    value: '15',
    icon: DocumentTextIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Pending Messages',
    value: '3',
    icon: ChatIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
];

export const recentOrders: RecentOrder[] = [
  { id: 'ORD-001', customer: 'Somchai Jaidee', amount: '฿1,250', status: 'Shipped' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: '฿890', status: 'Processing' },
  { id: 'ORD-003', customer: 'Mana Deekun', amount: '฿2,100', status: 'Shipped' },
  { id: 'ORD-004', customer: 'John Doe', amount: '฿450', status: 'Delivered' },
  { id: 'ORD-005', customer: 'Suda Rakdee', amount: '฿1,750', status: 'Cancelled' },
];

export const topProducts: TopProduct[] = [
    { name: 'เดรสลายดอกไม้', stock: 12 },
    { name: 'กางเกงยีนส์ขาสั้น', stock: 8 },
    { name: 'ครีมกันแดด', stock: 25 },
];

// Data for HowItWorks.tsx
export const howItWorksData: HowItWorksItem[] = [
  {
    title: 'สร้างระบบอัตโนมัติได้ในคลิกเดียว',
    description: 'เลือกเงื่อนไข แล้วให้ AI จัดการที่เหลือ',
    features: ["ทวงตะกร้าสินค้า", "ขอรีวิวอัตโนมัติ", "ส่งโค้ดส่วนลดต้อนรับ"],
    demo: AutomationDemo,
  },
  {
    title: "จัดการร้านค้าในที่เดียว",
    description: "รวมทุกช่องทางการขายมาไว้ในหน้าจอเดียว พร้อมรายงานเชิงลึกที่เข้าใจง่าย",
    features: ["รวมทุกแพลตฟอร์ม", "จัดการสต็อก & ออเดอร์", "รายงานสรุปยอดขาย"],
    demo: ReportingDemo,
  },
  {
    title: "สร้างร้านค้าด้วย AI",
    description: "เปลี่ยนไอเดียของคุณให้เป็นร้านค้าออนไลน์ที่สวยงามและพร้อมขายในไม่กี่นาที",
    features: ["ออกแบบธีมอัตโนมัติ", "สร้างโลโก้ & แบนเนอร์", "ลงสินค้าด้วยรูปถ่าย"],
    demo: StoreDesignDemo,
  },
  {
    title: "ประมวลผลใบแจ้งหนี้แบบเกม",
    description: "ดูคะแนน Processing Power พร้อมเทอร์มินอลสไตล์เรโทรและอังเปา",
    features: ["เทอร์มินอลไทย/จีน", "คอนเฟตตี้ฉลอง", "อีสเตอร์เอ้กมังกร", "อังเปาแจกโค้ด"],
    demo: InvoiceProcessingDemo,
  },
];


// Data for Partners.tsx
export const techPartners: TechPartner[] = [
  { name: 'Vercel', icon: VercelIcon },
  { name: 'Microsoft Azure', icon: AzureIcon },
  { name: 'Google Cloud', icon: GoogleCloudIcon },
  { name: 'Amazon Web Services', icon: AwsIcon },
  { name: 'OpenAI', icon: OpenAiIcon },
  { name: 'Generative AI', icon: SparklesIcon },
];

// Data for Pricing.tsx
export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    priceLabel: "FREE",
    popular: false,
    subtitle: "The beginning, zero commitment.",
    features: ["FREE STARTER AUTOMATE", "Basic workflows", "Community support"],
  },
  {
    name: "Ignite",
    popular: true,
    subtitle: "Time to spark your first major workflow; turning on the fire.",
    features: ["Advanced automations", "Priority support", "Analytics basics"],
  },
  {
    name: "Ascend",
    popular: false,
    subtitle: "Scaling up, moving higher, more power and fewer limits.",
    features: ["Multi-tenant", "Streaming AI orchestration", "Team roles & SSO"],
  },
  {
    name: "Apex",
    popular: false,
    subtitle: "The peak of capability; maximum scale and enterprise features.",
    features: ["Enterprise security", "Custom SLAs", "API & white-label"],
  },
];

// Data for Faq.tsx
export const faqData: FaqItemData[] = [
    { 
        question: "ต้องมีพื้นฐานไอที หรือความรู้ทางเทคนิคไหม?", 
        answer: "ไม่จำเป็นเลยครับ! ระบบของเราออกแบบมาให้ใช้งานง่าย คนที่ไม่เคยใช้โปรแกรม quản lý cửa hàngมาก่อนก็สามารถเรียนรู้ได้อย่างรวดเร็ว และเรามีทีมงานคอยช่วยเหลือตลอดครับ" 
    },
    { 
        question: "ใช้เวลานานแค่ไหนกว่าจะเริ่มใช้งานระบบได้?", 
        answer: "หลังจากสมัครแพ็กเกจ เราจะตั้งค่าระบบพื้นฐานให้คุณภายใน 1 วันทำการ จากนั้นคุณสามารถเริ่มใช้งานได้ทันทีครับ" 
    },
    { 
        question: "มีค่าใช้จ่ายอื่นๆ แอบแฝงไหม?", 
        answer: "ไม่มีครับ ราคาที่แสดงเป็นราคาสุทธิ ไม่มีค่าใช้จ่ายแอบแฝงใดๆ ทั้งสิ้น คุณสามารถเลือกจ่ายเป็นรายเดือนหรือรายปีได้ตามสะดวก" 
    },
    { 
        question: "บริการทั่วประเทศไทยไหม?", 
        answer: "ใช่ครับ เราให้บริการลูกค้าทั่วประเทศไทย ไม่ว่าร้านของคุณจะอยู่ที่ไหนก็สามารถใช้ระบบของเราได้ครับ" 
    },
];