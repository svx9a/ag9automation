import React, { useState, useEffect } from 'react';
import { SpinnerIcon, ShoppingCartIcon, StarIcon, GiftIcon, ArrowDownIcon } from '../icons';

type TriggerType = 'abandoned_cart' | 'order_complete' | 'new_subscriber';

interface AutomationFlow {
  trigger: {
    value: TriggerType;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  action: {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  };
}

const automationFlows: Record<TriggerType, AutomationFlow> = {
  abandoned_cart: {
    trigger: {
      value: 'abandoned_cart',
      label: 'ลูกค้าทิ้งตะกร้าสินค้า',
      icon: ShoppingCartIcon,
    },
    action: {
      title: 'ส่งข้อความทวงตะกร้า',
      description: 'หลังจาก 1 ชั่วโมง',
      icon: ShoppingCartIcon,
    },
  },
  order_complete: {
    trigger: {
      value: 'order_complete',
      label: 'ลูกค้าสั่งซื้อสำเร็จ',
      icon: StarIcon,
    },
    action: {
      title: 'ขอรีวิวสินค้า',
      description: 'หลังจาก 3 วัน',
      icon: StarIcon,
    },
  },
  new_subscriber: {
    trigger: {
      value: 'new_subscriber',
      label: 'ลูกค้าสมัครสมาชิกใหม่',
      icon: GiftIcon,
    },
    action: {
      title: 'ส่งโค้ดส่วนลดต้อนรับ',
      description: 'ทันที',
      icon: GiftIcon,
    },
  },
};

const AdAutomationDemo = () => {
  const [loading, setLoading] = useState(true);
  const [activeTrigger, setActiveTrigger] = useState<TriggerType>('abandoned_cart');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  const activeFlow = automationFlows[activeTrigger];
  const TriggerIcon = activeFlow.trigger.icon;
  const ActionIcon = activeFlow.action.icon;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg font-sans">
        <SpinnerIcon className="w-12 h-12 text-primary-500" />
        <p className="mt-4 text-gray-600 font-semibold">Loading Automation Demo...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg h-full flex flex-col items-center justify-center text-center">
        <h4 className="font-bold text-xl text-gray-800 font-serif">สร้างระบบอัตโนมัติได้ในคลิกเดียว</h4>
        <p className="text-sm text-gray-600 mt-1 mb-6">เลือกเงื่อนไข แล้วให้ AI จัดการที่เหลือ</p>

        <div className="w-full max-w-xs mx-auto">
            {/* Trigger Block */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <label htmlFor="trigger-select" className="text-sm font-medium text-gray-500">เมื่อเกิดเหตุการณ์นี้...</label>
                <div className="relative mt-2">
                    <select 
                        id="trigger-select"
                        value={activeTrigger}
                        onChange={(e) => setActiveTrigger(e.target.value as TriggerType)}
                        className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-left font-semibold text-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                        {Object.values(automationFlows).map(flow => (
                            <option key={flow.trigger.value} value={flow.trigger.value}>
                                {flow.trigger.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <TriggerIcon className="w-5 h-5 text-primary-600" />
                    </div>
                </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center my-3">
                <ArrowDownIcon className="w-6 h-6 text-gray-400" />
            </div>

            {/* Action Block */}
            <div className="bg-primary-50 border-2 border-dashed border-primary-200 rounded-lg p-4 transition-all duration-300 ease-in-out">
                 <p className="text-sm font-medium text-gray-500">ให้ทำสิ่งนี้...</p>
                 <div className="flex items-center justify-center gap-3 mt-2">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                       <ActionIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{activeFlow.action.title}</p>
                        <p className="text-xs text-gray-500">{activeFlow.action.description}</p>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
export default AdAutomationDemo;