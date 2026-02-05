'use client'

import { useState, useEffect } from 'react';
import { addToOrder } from './actions';
import { supabase } from '@/lib/supabase';
import { Search, ChevronLeft, Minus, Plus, ShoppingCart, Trash2, Save } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    category_id: string;
    image_url?: string;
}

interface Category {
    id: string;
    name: string;
}

interface OrderItem {
    id?: string;
    product_id: string;
    product: Product;
    quantity: number;
    price: number;
    note?: string;
}

export default function TableDetail({ table, initialMenu, initialOrder }: any) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<any>(initialOrder);
    const [isLoading, setIsLoading] = useState(false);

    const refreshOrder = async () => {
        const { data } = await supabase
            .from('orders')
            .select(`*, order_items (*, products (name, price, image_url))`)
            .eq('table_id', table.id)
            .in('status', ['pending', 'preparing', 'served'])
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data) setCurrentOrder(data);
        else setCurrentOrder(null);
    };

    useEffect(() => {
        const channel = supabase
            .channel(`admin_table_${table.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `table_id=eq.${table.id}` }, refreshOrder)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_items' }, () => {
                // Optimization: Check order_id match before refresh
                refreshOrder();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table.id]);

    const filteredProducts = initialMenu.products.filter((p: Product) => {
        const matchCategory = activeCategory === 'all' || p.category_id === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product_id: product.id, product, quantity: 1, price: product.price }];
        });
    };

    const updateCartJson = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product_id === productId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) return;
        setIsLoading(true);
        try {
            await addToOrder(table.id, cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                note: item.note,
                price: item.price
            })));
            setCart([]);
            // refreshOrder triggered by realtime
        } catch (e) {
            alert('Lỗi: ' + e);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="table-detail-container">
            {/* LEFT: MENU */}
            <div className="table-detail-left">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href="/admin/table-map" style={{
                        padding: '8px',
                        borderRadius: '50%',
                        background: 'var(--bg-color)',
                        color: 'var(--label-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{table.name}</h1>
                        <span style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>{table.areas?.name}</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ position: 'relative', width: '240px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--label-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Tìm món..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 36px',
                                borderRadius: '12px',
                                border: '1px solid var(--separator)',
                                background: 'var(--bg-color)',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`btn-apple ${activeCategory === 'all' ? 'primary' : 'secondary'}`}
                        style={{ padding: '8px 16px', borderRadius: '16px', fontSize: '14px', whiteSpace: 'nowrap' }}
                    >
                        Tất cả
                    </button>
                    {initialMenu.categories.map((cat: Category) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`btn-apple ${activeCategory === cat.id ? 'primary' : 'secondary'}`}
                            style={{ padding: '8px 16px', borderRadius: '16px', fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                        {filteredProducts.map((product: Product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="sf-card"
                                style={{
                                    padding: '12px',
                                    cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', gap: '8px',
                                    transition: 'transform 0.1s',
                                    border: '1px solid var(--separator)'
                                }}
                            >
                                <div style={{
                                    width: '100%', aspectRatio: '1/1',
                                    borderRadius: '8px',
                                    background: '#f0f0f0',
                                    backgroundImage: product.image_url ? `url(${product.image_url})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--system-blue)', fontWeight: 700 }}>{formatMoney(product.price)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: BILL / ORDERS */}
            <div className="table-detail-right">
                {/* Cart (New Items) */}
                {cart.length > 0 && (
                    <div style={{ marginBottom: '20px', flex: '0 0 auto', maxHeight: '40%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Món mới đang chọn</span>
                            <button onClick={() => setCart([])} style={{ border: 'none', background: 'transparent', color: 'var(--system-red)', cursor: 'pointer' }}>Xóa hết</button>
                        </div>
                        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--secondary-bg-color)', borderRadius: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.product.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--label-secondary)' }}>{formatMoney(item.price)}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => updateCartJson(item.product_id, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                                        <span style={{ fontSize: '14px', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateCartJson(item.product_id, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--system-blue)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <button
                                onClick={handleSubmitOrder}
                                disabled={isLoading}
                                className="btn-apple primary"
                                style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                            >
                                <Save size={18} /> {isLoading ? 'Đang lưu...' : 'Thêm vào đơn'}
                            </button>
                        </div>
                        <div style={{ height: '1px', background: 'var(--separator)', margin: '20px 0' }} />
                    </div>
                )}

                {/* Current Order */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px', display: 'flex', justifyContent: 'space-between' }}>
                        Hóa đơn hiện tại
                        {currentOrder && <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--label-secondary)' }}>#{currentOrder.id.slice(0, 8)}</span>}
                    </h2>

                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentOrder ? (
                            currentOrder.order_items.map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--system-blue)', width: '24px' }}>{item.quantity}x</span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{item.products?.name}</span>
                                            <span style={{ fontSize: '11px', color: 'var(--label-tertiary)' }}>
                                                {new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {item.note && <span style={{ fontSize: '11px', color: 'var(--system-orange)', fontStyle: 'italic' }}>{item.note}</span>}
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: 500 }}>{formatMoney(item.price_at_order * item.quantity)}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--label-tertiary)', marginTop: '40px' }}>
                                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🧾</div>
                                Bàn trống
                            </div>
                        )}
                    </div>

                    {/* Footer Totals */}
                    {currentOrder && (
                        <div style={{ marginTop: '20px', borderTop: '2px solid var(--separator)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--label-secondary)' }}>
                                <span>Tạm tính</span>
                                <span>{formatMoney(currentOrder.total_amount)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 800 }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: 'var(--system-blue)' }}>{formatMoney(currentOrder.total_amount)}</span>
                            </div>

                            <button className="btn-apple primary" style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '16px' }}>
                                Thanh toán
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
