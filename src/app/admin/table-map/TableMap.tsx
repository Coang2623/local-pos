'use client'

import { useState, useEffect } from 'react';
import { getTableMapData } from './actions';
import { Clock, Coffee, DollarSign, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export interface TableNode {
    id: string;
    name: string;
    status: 'empty' | 'occupied';
    duration: number; // minutes
    total_amount: number;
    item_count: number; // pending items
}

export interface AreaNode {
    id: string;
    name: string;
    tables: TableNode[];
}

export default function TableMap({ initialData }: { initialData: AreaNode[] }) {
    const [areas, setAreas] = useState<AreaNode[]>(initialData);
    const [selectedAreaId, setSelectedAreaId] = useState<string>(initialData[0]?.id || '');

    const refreshData = async () => {
        const data = await getTableMapData();
        setAreas(data as AreaNode[]);
    };

    useEffect(() => {
        // Simple polling for "duration" updates every minute
        const timer = setInterval(() => {
            setAreas(prev => prev.map(area => ({
                ...area,
                tables: area.tables.map(t => t.status === 'occupied' ? { ...t, duration: t.duration + 1 } : t)
            }) as AreaNode));
        }, 60000);

        // Realtime subscription for orders
        const channel = supabase
            .channel('table_map_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, refreshData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, refreshData)
            .subscribe();

        return () => {
            clearInterval(timer);
            supabase.removeChannel(channel);
        };
    }, []);

    const selectedArea = areas.find(a => a.id === selectedAreaId);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0) return `${h}h ${m}p`;
        return `${m}p`;
    };

    return (
        <div>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Sơ đồ bàn</h1>
                <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>
                    Theo dõi trạng thái hoạt động của từng bàn
                </p>
            </header>

            {/* Area Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                {areas.map(area => (
                    <button
                        key={area.id}
                        onClick={() => setSelectedAreaId(area.id)}
                        className={`btn-apple ${selectedAreaId === area.id ? 'primary' : 'secondary'}`}
                        style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '15px' }}
                    >
                        {area.name}
                    </button>
                ))}
            </div>

            {/* Tables Grid */}
            {selectedArea ? (
                <div className="table-map-grid" style={{ display: 'grid', gap: '20px' }}>
                    {selectedArea.tables.map((table, index) => (
                        <Link href={`/admin/table-map/${table.id}`} key={table.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="sf-card animate-fade-up" style={{
                                animationDelay: `${index * 0.05}s`,
                                padding: '20px',
                                border: table.status === 'occupied' ? '1px solid var(--system-blue)' : '1px solid transparent',
                                background: table.status === 'occupied' ? 'var(--bg-color)' : 'var(--secondary-bg-color)',
                                opacity: table.status === 'occupied' ? 1 : 0.7
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{table.name}</h3>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: table.status === 'occupied' ? 'var(--system-blue)' : 'var(--label-tertiary)',
                                        color: 'white'
                                    }}>
                                        {table.status === 'occupied' ? 'Có khách' : 'Trống'}
                                    </span>
                                </div>

                                {table.status === 'occupied' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--label-secondary)' }}>
                                            <Clock size={16} />
                                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{formatDuration(table.duration)}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--label-secondary)' }}>
                                            <DollarSign size={16} />
                                            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--system-green)' }}>
                                                {formatCurrency(table.total_amount)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--label-secondary)' }}>
                                            <Utensils size={16} />
                                            <span style={{ fontSize: '14px' }}>
                                                {table.item_count > 0 ? (
                                                    <>Chưa phục vụ: <strong style={{ color: 'var(--system-orange)' }}>{table.item_count}</strong> món</>
                                                ) : (
                                                    <strong style={{ color: 'var(--system-green)' }}>Đã lên đủ món</strong>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--label-tertiary)' }}>
                                        <Coffee size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
                                        <div style={{ fontSize: '13px' }}>Chưa có đơn hàng</div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--label-secondary)' }}>
                    Chưa có dữ liệu khu vực
                </div>
            )}
        </div>
    );
}
