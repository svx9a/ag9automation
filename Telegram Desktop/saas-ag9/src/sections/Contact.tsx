import React, { useState } from 'react';
import { LineIcon, PhoneIcon, MapPinIcon, SpinnerIcon } from '../components/icons';

const Contact = () => {
    const [isLoading, setIsLoading] = useState(false);
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a network request
        setTimeout(() => {
            setIsLoading(false);
            alert("Thank you for your message! We'll get back to you soon.");
            formRef.current?.reset();
        }, 2000);
    };

    return (
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">ติดต่อเรา</h2>
                    <p className="mt-4 text-lg text-gray-600">มีคำถามเพิ่มเติม หรือต้องการโซลูชันพิเศษสำหรับธุรกิจคุณ? เรายินดีให้คำปรึกษาครับ</p>
                </div>
                <div className="mt-12 bg-white border border-gray-200 rounded-lg p-8 grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-semibold mb-6 font-serif">ข้อมูลการติดต่อ</h3>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-center gap-3">
                                <LineIcon className="w-6 h-6 text-primary-600"/>
                                <div><strong>LINE Official:</strong> @automaticthai</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="w-6 h-6 text-primary-600"/>
                                <div><strong>โทรศัพท์:</strong> 082-XXX-XXXX</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPinIcon className="w-6 h-6 text-primary-600"/>
                                <div><strong>ออฟฟิศ:</strong> กรุงเทพมหานคร, ประเทศไทย</div>
                            </div>
                        </div>
                        <div className="mt-8 bg-gray-200 rounded-md h-64 flex items-center justify-center text-gray-500">
                            Map Placeholder
                        </div>
                    </div>
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                            <input type="text" id="name" required disabled={isLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input type="email" id="email" required disabled={isLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">หัวข้อ</label>
                            <input type="text" id="subject" disabled={isLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">ข้อความ</label>
                            <textarea id="message" rows={4} required disabled={isLoading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"></textarea>
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg shadow-primary-500/40 transition-shadow flex items-center justify-center disabled:bg-primary-300">
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5 mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    'ส่งข้อความ'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;