import React from 'react';
import { ShoppingCartIcon, ArrowDownIcon } from '../icons';

const AutomationDemo = () => {
  return (
    <div className="bg-white p-6 rounded-lg h-full flex flex-col items-center justify-center text-center font-sans">
        <h4 className="font-bold text-xl text-gray-800 font-serif">สร้างระบบอัตโนมัติได้ในคลิกเดียว</h4>
        <p className="text-sm text-gray-600 mt-1 mb-6">เลือกเงื่อนไข แล้วให้ AI จัดการที่เหลือ</p>

        <div className="w-full max-w-xs mx-auto">
            {/* Trigger Block */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">เมื่อเกิดเหตุการณ์นี้...</p>
                <div className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left font-semibold text-primary-700 shadow-sm flex items-center gap-2">
                    <ShoppingCartIcon className="w-5 h-5 text-primary-600" />
                    <span>ลูกค้าทิ้งตะกร้าสินค้า</span>
                </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center my-3">
                <ArrowDownIcon className="w-6 h-6 text-gray-400" />
            </div>

            {/* Action Block */}
            <div className="bg-primary-50 border-2 border-dashed border-primary-200 rounded-lg p-4">
                 <p className="text-sm font-medium text-gray-500 mb-2">ให้ทำสิ่งนี้...</p>
                 <div className="flex items-center justify-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                       <ShoppingCartIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-left">ส่งข้อความทวงตะกร้า</p>
                        <p className="text-xs text-gray-500 text-left">หลังจาก 1 ชั่วโมง</p>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
export default AutomationDemo;
