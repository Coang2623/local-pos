'use client'

import { useState, useEffect } from 'react';
import { Bell, Check, Clock, UserCheck } from 'lucide-react';
import { updateStaffCallStatus } from './actions';
import { supabase } from '@/lib/supabase';

interface StaffCall {
    id: string;
    created_at: string;
    note: string;
    status: 'pending' | 'completed';
    tables: {
        name: string;
        areas: { name: string }
    };
}

export default function StaffCalls({ initialCalls }: { initialCalls: StaffCall[] }) {
    const [calls, setCalls] = useState(initialCalls);

    useEffect(() => {
        const channel = supabase
            .channel('staff_calls_realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'staff_calls' },
                async (payload) => {
                    // Fetch full data with table info
                    const { data, error } = await supabase
                        .from('staff_calls')
                        .select('*, tables (name, areas (name))')
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        setCalls(prev => [data as StaffCall, ...prev]);
                        // Optional: Play sound notification
                        try {
                            const audio = new Audio('/notification.mp3');
                            audio.play().catch(e => console.log('Audio play failed', e));
                        } catch (e) { }
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'staff_calls' },
                (payload) => {
                    if (payload.new.status === 'completed') {
                        setCalls(prev => prev.filter(c => c.id !== payload.new.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleComplete = async (id: string) => {
        const result = await updateStaffCallStatus(id, 'completed');
        if (result.success) {
            setCalls(prev => prev.filter(c => c.id !== id));
        }
    };

    if (calls.length === 0) return null;

    return (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'var(--system-orange)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255,159,10,0.3)'
                }}>
                    <Bell size={24} className="animate-pulse" />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Yêu cầu hỗ trợ</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--label-secondary)' }}>
                        Có {calls.length} bàn đang cần nhân viên
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                {calls.map((call) => (
                    <div key={call.id} className="sf-card animate-fade-up" style={{
                        minWidth: '280px',
                        padding: '16px',
                        borderLeft: '4px solid var(--system-orange)',
                        background: 'var(--secondary-bg-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '17px' }}>{call.tables.name}</div>
                                <div style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>{call.tables.areas.name}</div>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--label-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} />
                                {new Date(call.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255,159,10,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '14px',
                            color: 'var(--label-primary)',
                            fontWeight: 500
                        }}>
                            &quot;{call.note}&quot;
                        </div>

                        <button
                            onClick={() => handleComplete(call.id)}
                            className="btn-apple primary"
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'var(--system-orange)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <UserCheck size={18} />
                            Đã xử lý
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
