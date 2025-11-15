import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, SpinnerIcon, ShopifyIcon } from '../components/icons';

type ShopifyImage = { url: string; altText?: string };
type ShopifyVariant = { id: string; title: string; sku?: string; price?: string; inventoryQuantity?: number };
type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  totalInventory?: number;
  images?: { edges: { node: ShopifyImage }[] };
  variants?: { edges: { node: ShopifyVariant }[] };
};

function deriveApiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  if (envBase && envBase.trim().length > 0) return envBase.trim();
  const isBrowser = typeof window !== 'undefined';
  const host = isBrowser ? (window.location?.hostname || '') : '';
  const isLocal = /^localhost$|^127\.0\.0\.1$|^192\.168\./.test(host);
  return isLocal ? 'http://127.0.0.1:8000' : 'https://v9-api.azurewebsites.net';
}

const ProductShowcase = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const [productId, setProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<ShopifyProduct | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const features = [
        { text: "<strong>ดูภาพรวม:</strong> ติดตามยอดขาย, ออเดอร์ใหม่, และข้อความลูกค้าแบบเรียลไทม์" },
        { text: "<strong>จัดการสินค้า:</strong> เพิ่ม, แก้ไข, และเช็คสต็อกสินค้าได้ทันที ไม่ต้องรอ" },
        { text: "<strong>เข้าใจลูกค้า:</strong> ดูข้อมูลลูกค้าและประวัติการสั่งซื้อ เพื่อสร้างโปรโมชั่นที่โดนใจ" },
    ];

    async function fetchProduct() {
      const pid = productId.trim();
      if (!pid) return;
      setLoading(true);
      setError(null);
      setProduct(null);
      try {
        const res = await fetch(`${deriveApiBase()}/shopify/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: pid }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`${res.status} ${t}`);
        }
        const data = await res.json();
        setProduct(data as ShopifyProduct);
      } catch (e: any) {
        setError(e?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    return (
        <section ref={sectionRef} className="bg-primary-50 overflow-hidden">
            <div className="container two-col">
                <div className="relative">
                    {!product && (
                      <img 
                        src="https://cdn.dribbble.com/userupload/11293214/file/original-0975a415a7fba739a893339396e68051.png?resize=1024x768" 
                        alt="Automatic Thai shop management dashboard" 
                        className="rounded-lg shadow-2xl animate-subtle-pulse" 
                      />
                    )}
                    {product && (
                      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                        <div className="aspect-video bg-gray-100">
                          {product.images?.edges?.[0]?.node?.url ? (
                            <img src={product.images.edges[0].node.url} alt={product.images.edges[0].node.altText || product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2">
                            <ShopifyIcon className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800 font-serif">{product.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{product.vendor || ''} {product.productType ? `• ${product.productType}` : ''}</p>
                          <div className="mt-3 grid sm:grid-cols-2 gap-3">
                            {(product.variants?.edges || []).slice(0, 4).map((v, i) => (
                              <div key={v.node.id || i} className="border border-gray-200 rounded-md p-2 flex items-center justify-between text-sm">
                                <span className="text-gray-700">{v.node.title}</span>
                                <span className="font-mono text-gray-900">{v.node.price ? `฿${v.node.price}` : '-'}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-gray-500">Total Inventory: {product.totalInventory ?? '—'}</div>
                        </div>
                      </div>
                    )}
                     <style>{`
                        @keyframes subtle-pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.02); }
                        }
                        .animate-subtle-pulse {
                            animation: subtle-pulse 8s ease-in-out infinite;
                        }
                    `}</style>
                </div>
                <div>
                    <h2 className="heading-2 text-gray-800 font-serif">จัดการร้านค้าของคุณได้ในที่เดียว</h2>
                    <p className="mt-4 text-lg text-gray-700 section-intro">
                        ไม่ต้องสลับแอปไปมาให้วุ่นวายอีกต่อไป! Automatic Thai รวมทุกอย่างที่คุณต้องการไว้ในหน้าจอเดียว
                    </p>
                    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <ShopifyIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700">เชื่อมต่อ Shopify เพื่อดึงข้อมูลสินค้า</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Product ID หรือ gid://shopify/Product/..."
                          value={productId}
                          onChange={(e) => setProductId(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={fetchProduct}
                          disabled={loading || !productId.trim()}
                          className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-semibold disabled:opacity-50"
                        >
                          {loading ? <span className="inline-flex items-center gap-2"><SpinnerIcon className="w-4 h-4 text-white" /> Loading</span> : 'Fetch'}
                        </button>
                      </div>
                      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                    </div>
                    <ul className="mt-6 space-y-2">
                        {features.map((feature, index) => (
                           <li 
                             key={index} 
                             className={`flex items-start transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                             style={{ transitionDelay: `${index * 150}ms` }}
                           >
                            <CheckIcon className="h-6 w-6 text-primary-600 mr-2 flex-shrink-0 mt-1" />
                            <span dangerouslySetInnerHTML={{ __html: feature.text }} />
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;