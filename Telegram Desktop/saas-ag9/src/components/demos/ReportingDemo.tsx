import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../icons';

const ReportingDemo = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1100);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg font-sans">
                <SpinnerIcon className="w-12 h-12 text-primary-500" />
                <p className="mt-4 text-gray-600 font-semibold">Loading Reporting Demo...</p>
            </div>
        );
    }
     return (
        <div className="bg-white p-4 rounded-lg h-full font-sans">
            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Daily Sales Report</p>
                <p className="text-3xl font-bold text-gray-900">฿ 12,580.00</p>
            </div>
            <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Top Selling Products</h5>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-gray-700">
                            <span>เดรสลายดอกไม้</span>
                            <span className="font-mono text-green-500">฿ 5,340</span>
                        </div>
                         <div className="flex justify-between items-center text-gray-700">
                            <span>กางเกงยีนส์</span>
                            <span className="font-mono text-green-500">฿ 3,150</span>
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Sales Channels</h5>
                    <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden text-xs text-white font-semibold">
                        <div className="bg-blue-500 h-4 flex items-center justify-center" style={{width: '60%'}}><span>FB</span></div>
                        <div className="bg-green-500 h-4 flex items-center justify-center" style={{width: '25%'}}><span>LINE</span></div>
                        <div className="bg-pink-500 h-4 flex items-center justify-center" style={{width: '15%'}}><span>IG</span></div>
                    </div>
                </div>
            </div>
        </div>
     )
}

export default ReportingDemo;