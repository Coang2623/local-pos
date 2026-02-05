'use client'

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Coffee, MapPin, Wifi, Send, CheckCircle, ChevronLeft, Sun, Moon, ClipboardList, Clock, LayoutGrid, List, Trash2, Bell } from 'lucide-react';
import { createOrder, cancelOrderById, callStaff } from '../actions';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    category_id: string;
    categories: { name: string };
}

interface CartItem {
    product: Product;
    quantity: number;
    notes?: string;
}

interface Props {
    table: { id: string; name: string; areas: { name: string } };
    categories: Category[];
    products: Product[];
    storeInfo: { store_name: string; address?: string; wifi_pass?: string } | null;
    initialOrders: any[];
}

export default function CustomerMenu({ table, categories, products, storeInfo, initialOrders }: Props) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [orders, setOrders] = useState<any[]>(initialOrders);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'individual' | 'grouped'>('individual');
    const [isCallStaffOpen, setIsCallStaffOpen] = useState(false);
    const [staffNote, setStaffNote] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const [callSuccess, setCallSuccess] = useState(false);

    // Theme initialization
    useEffect(() => {
        const getInitialTheme = () => {
            const saved = sessionStorage.getItem('customer-theme');
            if (saved) return saved as 'light' | 'dark';
            const hour = new Date().getHours();
            return (hour >= 6 && hour < 18) ? 'light' : 'dark';
        };
        const initialTheme = getInitialTheme();
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    // Real-time Orders Subscription
    useEffect(() => {
        const channel = supabase
            .channel(`customer_orders_realtime_${table.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders', filter: `table_id=eq.${table.id}` },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const { data } = await supabase
                            .from('orders')
                            .select('*, order_items (*, products (name))')
                            .eq('id', payload.new.id)
                            .single();
                        if (data) setOrders(prev => [data, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, status: payload.new.status } : o));
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_items' },
                async (payload) => {
                    // Check if this item belongs to an order of this table
                    // Since we can't easily filter order_items by table_id directly in subscription (join needed),
                    // we fetch the related order and check.
                    // Optimization: subscribe to specific order_ids if possible, but simplest is to just fetch.
                    const { data: orderData } = await supabase
                        .from('orders')
                        .select('*, order_items (*, products (name))')
                        .eq('id', payload.new.order_id)
                        .eq('table_id', table.id)
                        .single();

                    if (orderData) {
                        setOrders(prev => {
                            const exists = prev.find(o => o.id === orderData.id);
                            if (exists) {
                                return prev.map(o => o.id === orderData.id ? orderData : o);
                            } else {
                                return [orderData, ...prev];
                            }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table.id]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        sessionStorage.setItem('customer-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const updateNote = (productId: string, notes: string) => {
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, notes } : item
        ));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleOrder = async () => {
        if (cart.length === 0) return;

        setIsOrdering(true);
        try {
            const newOrder = await createOrder(
                table.id,
                cart.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    notes: item.notes
                }))
            );
            setOrderSuccess(true);
            setCart([]);
            setIsCartOpen(false);
            // Cập nhật danh sách đơn hàng cục bộ
            setOrders([newOrder, ...orders]);
        } catch (error) {
            alert('Có lỗi xảy ra: ' + (error as Error).message);
        } finally {
            setIsOrdering(false);
        }
    };

    const getGroupedItems = () => {
        const itemMap: {
            [key: string]: {
                name: string;
                quantity: number;
                totalPrice: number;
                statusCounts: { [key: string]: number }
            }
        } = {};

        orders.forEach(order => {
            order.order_items?.forEach((item: any) => {
                const name = item.products?.name || 'Sản phẩm';
                const status = order.status; // Lấy trạng thái từ đơn hàng

                if (!itemMap[name]) {
                    itemMap[name] = {
                        name,
                        quantity: 0,
                        totalPrice: 0,
                        statusCounts: {
                            pending: 0,
                            cooking: 0,
                            served: 0
                        }
                    };
                }

                itemMap[name].quantity += item.quantity;
                itemMap[name].totalPrice += (item.price_at_order * item.quantity);

                // Map order status to display status
                if (status === 'pending') itemMap[name].statusCounts.pending += item.quantity;
                else if (status === 'confirmed') itemMap[name].statusCounts.cooking += item.quantity;
                else if (status === 'completed' || status === 'served') itemMap[name].statusCounts.served += item.quantity;
            });
        });
        return Object.values(itemMap);
    };

    const totalOrdersAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);

    const handleCallStaff = async (note: string = staffNote) => {
        setIsCalling(true);
        const result = await callStaff(table.id, note);
        setIsCalling(false);
        if (result.success) {
            setIsCallStaffOpen(false);
            setStaffNote('');
            setCallSuccess(true);
            setTimeout(() => {
                setCallSuccess(false);
            }, 3000);
        } else {
            alert('Không thể gọi nhân viên lúc này. Vui lòng thử lại.');
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

        const result = await cancelOrderById(orderId);
        if (result.success) {
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } else {
            alert(result.message || 'Không thể hủy đơn hàng này.');
        }
    };

    if (orderSuccess) {
        return (
            <div className="customer-page animate-fade-up" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                background: 'var(--bg-color)'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--system-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 8px 32px rgba(48, 209, 88, 0.3)'
                }}>
                    <CheckCircle size={56} color="white" />
                </div>
                <h1 style={{ color: 'var(--label-primary)', fontSize: '28px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-1px' }}>
                    Đặt món thành công!
                </h1>
                <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginBottom: '32px', lineHeight: 1.5 }}>
                    Món của bạn sẽ được chuẩn bị ngay.
                    <br />Vui lòng chờ trong giây lát.
                </p>
                <button
                    onClick={() => setOrderSuccess(false)}
                    className="btn-apple primary"
                    style={{
                        padding: '16px 48px',
                        borderRadius: '14px',
                        fontSize: '17px',
                        fontWeight: 600
                    }}
                >
                    Đặt thêm món
                </button>
            </div>
        );
    }

    return (
        <div className="customer-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            paddingBottom: cart.length > 0 ? '100px' : '20px'
        }}>
            {/* Header */}
            <header className="glass" style={{
                padding: '32px 20px 24px',
                borderRadius: '0 0 24px 24px',
                marginBottom: '24px',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                borderTop: 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '12px',
                            background: 'var(--system-blue)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)'
                        }}>
                            <Coffee size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                                {storeInfo?.store_name || 'Local Cafe'}
                            </h1>
                            <p style={{ fontSize: '15px', color: 'var(--label-secondary)', margin: '2px 0 0' }}>
                                {table.name} • {table.areas.name}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => setIsCallStaffOpen(true)}
                            style={{
                                height: '40px',
                                padding: '0 12px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--system-orange)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255,159,10,0.2)',
                                transition: 'all 0.2s ease'
                            }}
                            className="btn-apple-active"
                        >
                            <Bell size={18} />
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>Gọi NV</span>
                        </button>
                        {orders.length > 0 && (
                            <button
                                onClick={() => setIsOrdersOpen(true)}
                                style={{
                                    height: '40px',
                                    padding: '0 12px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--system-blue)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,122,255,0.2)',
                                    transition: 'all 0.2s ease'
                                }}
                                className="btn-apple-active"
                            >
                                <ClipboardList size={18} />
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>Hóa đơn</span>
                            </button>
                        )}
                        <button
                            onClick={toggleTheme}
                            style={{
                                height: '40px',
                                padding: '0 12px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--secondary-bg-color)',
                                color: 'var(--label-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease'
                            }}
                            className="btn-apple-active"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            <span style={{ fontSize: '12px', fontWeight: 500 }}>{theme === 'light' ? 'Tối' : 'Sáng'}</span>
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {storeInfo?.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--label-secondary)', fontSize: '13px' }}>
                            <MapPin size={14} />
                            <span>{storeInfo.address}</span>
                        </div>
                    )}
                    {storeInfo?.wifi_pass && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--label-secondary)', fontSize: '13px' }}>
                            <Wifi size={14} />
                            <span style={{ fontWeight: 500 }}>Wifi: {storeInfo.wifi_pass}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Category Tabs */}
            <div style={{
                padding: '0 20px',
                marginBottom: '24px',
                overflowX: 'auto',
                display: 'flex',
                gap: '10px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none'
            }}>
                <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                        padding: '10px 22px',
                        borderRadius: '12px',
                        border: 'none',
                        background: !selectedCategory ? 'var(--system-blue)' : 'var(--separator)',
                        color: !selectedCategory ? 'white' : 'var(--label-primary)',
                        fontSize: '15px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Tất cả
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                            padding: '10px 22px',
                            borderRadius: '12px',
                            border: 'none',
                            background: selectedCategory === cat.id ? 'var(--system-blue)' : 'var(--separator)',
                            color: selectedCategory === cat.id ? 'white' : 'var(--label-primary)',
                            fontSize: '15px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Product List */}
            <div style={{ padding: '0 20px' }}>
                {filteredProducts.map((product, index) => {
                    const cartItem = cart.find(item => item.product.id === product.id);
                    return (
                        <div
                            key={product.id}
                            className="sf-card animate-fade-up"
                            style={{
                                padding: '12px',
                                marginBottom: '16px',
                                display: 'flex',
                                gap: '16px',
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '14px',
                                background: 'var(--bg-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden'
                            }}>
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Coffee size={36} color="var(--label-tertiary)" />
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span style={{
                                    fontSize: '12px',
                                    color: 'var(--system-blue)',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    marginBottom: '4px',
                                    letterSpacing: '0.5px'
                                }}>
                                    {product.categories.name}
                                </span>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    color: 'var(--label-primary)',
                                    lineHeight: 1.3
                                }}>
                                    {product.name}
                                </h3>
                                <span style={{
                                    fontSize: '17px',
                                    fontWeight: 700,
                                    color: 'var(--label-primary)',
                                    marginTop: '6px'
                                }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                            </div>

                            {/* Add Button */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {cartItem ? (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        background: 'var(--bg-color)',
                                        borderRadius: '12px',
                                        padding: '6px'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(product.id, -1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: 'var(--label-primary)',
                                                color: 'var(--bg-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span style={{
                                            fontWeight: 700,
                                            fontSize: '17px',
                                            minWidth: '24px',
                                            textAlign: 'center'
                                        }}>
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: 'var(--system-blue)',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product)}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: 'var(--system-blue)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0,122,255,0.3)'
                                        }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Cart Button */}
            {cart.length > 0 && !isCartOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '16px',
                    right: '16px',
                    zIndex: 50
                }}>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="glass animate-fade-up"
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            borderRadius: '18px',
                            border: '1px solid var(--system-blue)',
                            color: 'var(--label-primary)',
                            fontSize: '17px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 8px 32px rgba(0,122,255,0.15)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--system-blue)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShoppingCart size={18} />
                            </div>
                            <span>Giỏ hàng • {totalItems} món</span>
                        </div>
                        <span style={{ color: 'var(--system-blue)' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                        </span>
                    </button>
                </div>
            )}

            {/* Cart Modal */}
            {isCartOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}>
                    <div style={{
                        background: 'var(--secondary-bg-color)',
                        borderRadius: '24px 24px 0 0',
                        maxHeight: '80vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Cart Header */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid var(--separator)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Giỏ hàng của bạn</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'var(--bg-color)',
                                    color: 'var(--label-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div style={{ flex: 1, overflow: 'auto', padding: '10px 20px' }}>
                            {cart.map(item => (
                                <div
                                    key={item.product.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px 0',
                                        borderBottom: '1px solid var(--separator)'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
                                            {item.product.name}
                                        </h4>
                                        <div style={{ color: 'var(--label-secondary)', fontSize: '15px', marginBottom: '8px' }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}
                                        </div>
                                        <input
                                            type="text"
                                            value={item.notes || ''}
                                            onChange={(e) => updateNote(item.product.id, e.target.value)}
                                            placeholder="Ghi chú (ví dụ: Ít đường...)"
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--separator)',
                                                background: 'var(--bg-color)',
                                                color: 'var(--label-primary)',
                                                fontSize: '13px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, -1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                border: '1px solid var(--separator)',
                                                background: 'transparent',
                                                color: 'var(--label-primary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span style={{ fontWeight: 700, fontSize: '17px', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: 'var(--system-blue)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Footer */}
                        <div className="glass" style={{
                            padding: '24px 20px env(safe-area-inset-bottom, 24px)',
                            borderTop: '1px solid var(--separator)',
                            borderRadius: '24px 24px 0 0'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '20px',
                                fontSize: '20px',
                                fontWeight: 800,
                                letterSpacing: '-0.5px'
                            }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: 'var(--system-blue)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                </span>
                            </div>
                            <button
                                onClick={handleOrder}
                                disabled={isOrdering}
                                className="btn-apple primary"
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    borderRadius: '16px',
                                    fontSize: '17px',
                                    fontWeight: 700,
                                    opacity: isOrdering ? 0.7 : 1
                                }}
                            >
                                <Send size={20} />
                                {isOrdering ? 'Đang gửi đơn...' : 'Gửi đơn hàng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Call Staff Modal */}
            {isCallStaffOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 110,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="animate-fade-up glass" style={{
                        background: 'var(--secondary-bg-color)',
                        borderRadius: '24px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Gọi nhân viên</h2>
                                <button onClick={() => setIsCallStaffOpen(false)} style={{ border: 'none', background: 'transparent', color: 'var(--label-secondary)' }}><X size={24} /></button>
                            </div>

                            <p style={{ fontSize: '15px', color: 'var(--label-secondary)', marginBottom: '16px' }}>Bạn cần hỗ trợ gì không?</p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                {['Lấy khăn giấy', 'Thêm nước lọc', 'Lấy tăm', 'Thanh toán'].map(item => (
                                    <button
                                        key={item}
                                        onClick={() => setStaffNote(item)}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '20px',
                                            border: '1px solid',
                                            borderColor: staffNote === item ? 'var(--system-orange)' : 'var(--separator)',
                                            background: staffNote === item ? 'rgba(255,159,10,0.1)' : 'var(--bg-color)',
                                            color: staffNote === item ? 'var(--system-orange)' : 'var(--label-primary)',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        className="btn-apple-active"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <textarea
                                    value={staffNote}
                                    onChange={(e) => setStaffNote(e.target.value)}
                                    placeholder="Nhập yêu cầu khác (ví dụ: Thêm ghế...)"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--separator)',
                                        background: 'var(--bg-color)',
                                        color: 'var(--label-primary)',
                                        fontSize: '15px',
                                        minHeight: '80px',
                                        resize: 'none',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => handleCallStaff()}
                                disabled={isCalling}
                                className="btn-apple primary"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '14px',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    opacity: isCalling ? 0.7 : 1
                                }}
                            >
                                {isCalling ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                        </>
                    </div>
                </div>
            )}

            {/* Global Success Call Notification */}
            {callSuccess && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 200,
                    width: 'calc(100% - 40px)',
                    maxWidth: '360px'
                }}>
                    <div className="animate-fade-up glass" style={{
                        background: 'var(--bg-color)',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        border: '1px solid var(--system-green)'
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', background: 'var(--system-green)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <CheckCircle size={18} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>Đã gọi nhân viên</div>
                            <div style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>Yêu cầu đã được gửi đi thành công.</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders History Modal */}
            {isOrdersOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}>
                    <div className="animate-fade-up" style={{
                        background: 'var(--secondary-bg-color)',
                        borderRadius: '24px 24px 0 0',
                        maxHeight: '85vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid var(--separator)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Đơn hàng của bàn</h2>
                            <button
                                onClick={() => setIsOrdersOpen(false)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'var(--bg-color)',
                                    color: 'var(--label-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--separator)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg-color)'
                        }}>
                            <div style={{
                                display: 'flex',
                                background: 'var(--secondary-bg-color)',
                                padding: '3px',
                                borderRadius: '10px',
                                border: '1px solid var(--separator)'
                            }}>
                                <button
                                    onClick={() => setViewMode('individual')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: viewMode === 'individual' ? 'var(--bg-color)' : 'transparent',
                                        color: viewMode === 'individual' ? 'var(--label-primary)' : 'var(--label-secondary)',
                                        boxShadow: viewMode === 'individual' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <List size={14} /> Tách đơn
                                </button>
                                <button
                                    onClick={() => setViewMode('grouped')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: viewMode === 'grouped' ? 'var(--bg-color)' : 'transparent',
                                        color: viewMode === 'grouped' ? 'var(--label-primary)' : 'var(--label-secondary)',
                                        boxShadow: viewMode === 'grouped' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <LayoutGrid size={14} /> Gộp món
                                </button>
                            </div>

                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--label-secondary)' }}>
                                Tổng: <span style={{ color: 'var(--system-blue)' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrdersAmount)}</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--label-secondary)' }}>
                                    Chưa có đơn hàng nào được đặt.
                                </div>
                            ) : viewMode === 'grouped' ? (
                                <div className="sf-card" style={{ padding: '16px', border: '1px solid var(--separator)', boxShadow: 'none' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {getGroupedItems().map((item, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                padding: '8px 0',
                                                borderBottom: i === getGroupedItems().length - 1 ? 'none' : '1px solid var(--separator)'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{
                                                            background: 'var(--system-blue)',
                                                            color: 'white',
                                                            borderRadius: '6px',
                                                            padding: '2px 8px',
                                                            fontSize: '13px',
                                                            fontWeight: 700
                                                        }}>
                                                            {item.quantity}
                                                        </span>
                                                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                                                    </div>
                                                    <span style={{ color: 'var(--label-primary)', fontWeight: 600, fontSize: '14px' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '40px' }}>
                                                    {item.statusCounts.served > 0 && (
                                                        <span style={{ fontSize: '11px', background: 'var(--system-green)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                                            ✓ Đã phục vụ: {item.statusCounts.served}
                                                        </span>
                                                    )}
                                                    {item.statusCounts.cooking > 0 && (
                                                        <span style={{ fontSize: '11px', background: 'var(--system-blue)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                                            ⚙ Đang làm: {item.statusCounts.cooking}
                                                        </span>
                                                    )}
                                                    {item.statusCounts.pending > 0 && (
                                                        <span style={{ fontSize: '11px', background: 'var(--system-orange)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                                            ⋯ Chờ xác nhận: {item.statusCounts.pending}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderTop: '2px solid var(--separator)', margin: '16px 0 12px' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px' }}>
                                        <span>Tổng thanh toán</span>
                                        <span style={{ color: 'var(--system-blue)' }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrdersAmount)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                orders.map((order, idx) => (
                                    <div key={order.id} className="sf-card" style={{
                                        marginBottom: '16px',
                                        padding: '16px',
                                        boxShadow: 'none',
                                        border: '1px solid var(--separator)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '15px' }}>Đơn #{order.id.slice(0, 8)}</span>
                                            <span style={{
                                                fontSize: '12px',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                background: order.status === 'pending' ? 'var(--system-orange)' :
                                                    order.status === 'confirmed' ? 'var(--system-blue)' :
                                                        order.status === 'completed' ? 'var(--system-green)' : 'var(--separator)',
                                                color: 'white',
                                                fontWeight: 600
                                            }}>
                                                {order.status === 'pending' ? 'Chờ xác nhận' :
                                                    order.status === 'confirmed' ? 'Đang chế biến' :
                                                        order.status === 'completed' ? 'Đã hoàn thành' : order.status}
                                            </span>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed var(--separator)', margin: '8px 0' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {order.order_items?.map((item: any, i: number) => (
                                                <div key={i} style={{ marginBottom: '8px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                        <span>{item.quantity}x {item.products?.name || 'Sản phẩm'}</span>
                                                        <span style={{ color: 'var(--label-secondary)' }}>
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_order * item.quantity)}
                                                        </span>
                                                    </div>
                                                    {item.note && (
                                                        <div style={{ fontSize: '12px', color: 'var(--system-orange)', marginTop: '2px', fontStyle: 'italic' }}>
                                                            Ghi chú: {item.note}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ borderBottom: '1px dashed var(--separator)', margin: '8px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', marginTop: '4px' }}>
                                            <span>Tổng cộng</span>
                                            <span style={{ color: 'var(--system-blue)' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--label-secondary)', marginTop: '8px', marginBottom: order.status === 'pending' ? '12px' : '0' }}>
                                            <Clock size={12} />
                                            <span>{new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                style={{
                                                    marginTop: '12px',
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--system-red)',
                                                    background: 'transparent',
                                                    color: 'var(--system-red)',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer'
                                                }}
                                                className="btn-apple-active"
                                            >
                                                <Trash2 size={16} /> Hủy đơn hàng này
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .btn-apple-active:active {
                    transform: scale(0.9);
                }
            `}</style>
        </div>
    );
}
