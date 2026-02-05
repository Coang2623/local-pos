'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, Coffee, Receipt, MapPin } from 'lucide-react';
import { updateOrderStatus } from './actions';
import { supabase } from '@/lib/supabase';

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: 'pending' | 'preparing' | 'served' | 'paid' | 'cancelled';
    tables: {
        name: string;
        areas: { name: string }
    };
    order_items: {
        id: string;
        quantity: number;
        price_at_order: number;
        note?: string;
        products: { name: string }
    }[];
}

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        const channel = supabase
            .channel('admin_orders_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        // Fetch the full order
                        const { data } = await supabase
                            .from('orders')
                            .select(`*, tables (name, areas (name)), order_items (*, products (name))`)
                            .eq('id', payload.new.id)
                            .single();

                        if (data) {
                            setOrders(prev => [data as any, ...prev]);
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, status: payload.new.status } : o));
                    } else if (payload.eventType === 'DELETE') {
                        setOrders(prev => prev.filter(o => o.id !== payload.old.id));
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_items' },
                async (payload) => {
                    // Update the specific order when items are added
                    // This handles the race condition where order is created before items
                    const { data } = await supabase
                        .from('orders')
                        .select(`*, tables (name, areas (name)), order_items (*, products (name))`)
                        .eq('id', payload.new.order_id)
                        .single();

                    if (data) {
                        setOrders(prev => {
                            const exists = prev.find(o => o.id === data.id);
                            if (exists) {
                                return prev.map(o => o.id === data.id ? data as any : o);
                            } else {
                                return [data as any, ...prev];
                            }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const filteredOrders = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'var(--system-orange)';
            case 'preparing': return 'var(--system-blue)';
            case 'served': return 'var(--system-green)';
            case 'paid': return 'var(--system-gray)';
            case 'cancelled': return 'var(--system-red)';
            default: return 'var(--system-gray)';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'preparing': return 'Đang pha chế';
            case 'served': return 'Đã phục vụ';
            case 'paid': return 'Đã thanh toán';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await updateOrderStatus(id, newStatus);
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as Order['status'] } : o));
        } catch (error) {
            alert('Lỗi: ' + (error as Error).message);
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Hóa đơn</h1>
                    <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>Theo dõi và quản lý các đơn hàng đang diễn ra</p>
                </div>
            </header>

            {/* Filters */}
            <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['all', 'pending', 'preparing', 'served', 'paid', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`btn-apple ${statusFilter === status ? 'primary' : 'secondary'}`}
                        style={{ borderRadius: '20px', padding: '8px 20px', fontSize: '14px' }}
                    >
                        {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                {filteredOrders.map((order, index) => (
                    <div key={order.id} className="sf-card animate-fade-up" style={{
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0,
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Receipt size={20} color="var(--system-blue)" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>#{order.id.slice(0, 8)}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--label-secondary)', fontSize: '13px' }}>
                                        <MapPin size={12} />
                                        {order.tables.areas.name} - {order.tables.name}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: getStatusColor(order.status),
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                            }}>
                                {getStatusLabel(order.status)}
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                            {order.order_items.map(item => (
                                <div key={item.id} style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--label-primary)' }}>
                                            <strong style={{ color: 'var(--system-blue)' }}>{item.quantity}x</strong> {item.products.name}
                                        </span>
                                        <span style={{ fontWeight: 500 }}>
                                            {new Intl.NumberFormat('vi-VN').format(item.price_at_order * item.quantity)}
                                        </span>
                                    </div>
                                    {item.note && (
                                        <div style={{ fontSize: '12px', color: 'var(--system-orange)', marginTop: '2px', fontStyle: 'italic' }}>
                                            Ghi chú: {item.note}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div style={{ height: '1px', backgroundColor: 'var(--separator)', margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: 'var(--system-blue)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {order.status === 'pending' && (
                                <button onClick={() => handleUpdateStatus(order.id, 'preparing')} className="btn-apple primary" style={{ flex: 1, padding: '10px' }}>
                                    Xác nhận
                                </button>
                            )}
                            {order.status === 'preparing' && (
                                <button onClick={() => handleUpdateStatus(order.id, 'served')} className="btn-apple primary" style={{ flex: 1, padding: '10px' }}>
                                    Xong món
                                </button>
                            )}
                            {['pending', 'preparing', 'served'].includes(order.status) && (
                                <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="btn-apple secondary" style={{ color: 'var(--system-red)', padding: '10px' }}>
                                    Hủy
                                </button>
                            )}
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--label-tertiary)', fontSize: '12px' }}>
                            <Clock size={12} />
                            Order lúc: {new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0', color: 'var(--label-tertiary)' }}>
                        <Coffee size={64} style={{ marginBottom: '16px', opacity: 0.2 }} />
                        <p>Không có hóa đơn nào trong danh sách này</p>
                    </div>
                )}
            </div>
        </div>
    );
}
