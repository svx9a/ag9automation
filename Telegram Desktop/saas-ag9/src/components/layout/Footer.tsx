import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../icons';

const Footer = () => (
    <footer className="bg-stone-900">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
            <div className="flex justify-center items-center gap-2">
                <img src="https://cdn.shopify.com/s/files/1/0767/5537/0199/files/GX-09.png?v=1763106361" alt="AG9 logo" className="h-6 w-auto" decoding="async" />
                <span className="font-bold text-gray-200 font-serif">Automatic Thai</span>
            </div>
            <p className="text-sm my-2">"ระบบที่เข้าใจร้านค้าเล็กเหมือนเข้าใจเพื่อน"</p>
            
            <div className="flex justify-center items-center gap-6 my-4">
              <a href="https://www.facebook.com/ag9automate" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/ag9automate" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://x.com/ag9automate" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <TwitterIcon className="w-6 h-6" />
              </a>
            </div>

            <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Automatic Thai. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;