import React from 'react';
import { ArrowRightOnRectangleIcon, PlusIcon } from '../components/icons';
import { quickStats, recentOrders, topProducts } from '../data/mockData';
import type { RecentOrder } from '../types';
import { useAutomation } from '../components/AutomationProvider';
import AutomationWidget from '../components/common/AutomationWidget';

const getStatusClass = (status: RecentOrder['status']) => {
    switch (status) {
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Processing': return 'bg-yellow-100 text-yellow-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const Dashboard = ({ onLogoutClick }: { onLogoutClick: () => void }) => {
    const { backendStatus } = useAutomation();
    return (
    <div className="bg-primary-50 min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
            
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 font-serif">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's a summary of your shop's activity.</p>
                </div>
                <button 
                    onClick={onLogoutClick} 
                    className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Log Out
                </button>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center gap-4">
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Orders Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 font-serif mb-4">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Order ID</th>
                                        <th scope="col" className="px-4 py-3">Customer</th>
                                        <th scope="col" className="px-4 py-3">Amount</th>
                                        <th scope="col" className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-4 font-medium text-gray-900">{order.id}</td>
                                            <td className="px-4 py-4">{order.customer}</td>
                                            <td className="px-4 py-4">{order.amount}</td>
                                            <td className="px-4 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Automation Flow Widget */}
                    <AutomationWidget />
                    {/* Backend Status Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 font-serif mb-4">Backend Status</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>
                                <span className="text-gray-500">Wallet Balance:</span>
                                <span className="ml-2 font-mono">
                                    {backendStatus?.wallet_balance_eth !== undefined ? `${backendStatus.wallet_balance_eth?.toFixed(4)} ETH` : '—'}
                                </span>
                            </li>
                            <li>
                                <span className="text-gray-500">ETH Price:</span>
                                <span className="ml-2 font-mono">
                                    {backendStatus?.eth_price_usd !== undefined ? `$${Number(backendStatus.eth_price_usd).toFixed(2)}` : '—'}
                                </span>
                            </li>
                            <li>
                                <span className="text-gray-500">EKS Ready:</span>
                                <span className="ml-2 font-mono">
                                    {backendStatus?.eks_ready === undefined ? '—' : backendStatus.eks_ready ? 'Yes' : 'No'}
                                </span>
                            </li>
                            <li>
                                <span className="text-gray-500">Updated:</span>
                                <span className="ml-2 font-mono">{backendStatus?.last_updated ?? '—'}</span>
                            </li>
                        </ul>
                        <p className="mt-3 text-xs text-gray-500">Polling localhost:8000/status</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 font-serif mb-4">Product Management</h2>
                        <ul className="space-y-3 mb-4">
                            {topProducts.map((product, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">{product.name}</span>
                                    <span className="text-gray-500 font-mono">Stock: {product.stock}</span>
                                </li>
                            ))}
                        </ul>
                         <button className="w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2.5 rounded-lg font-semibold border-2 border-dashed border-primary-200 transition-colors">
                            <PlusIcon className="w-5 h-5"/>
                            Add New Product
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 font-serif mb-4">Next Steps</h2>
                         <ul className="text-left space-y-2 text-gray-700 text-sm list-disc list-inside">
                            <li>Connect your Facebook Page and LINE OA.</li>
                            <li>Set up your first automated post.</li>
                            <li>Review your sales report tomorrow morning.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>
    );
};

export default Dashboard;