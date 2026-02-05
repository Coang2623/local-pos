'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getOrders() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                tables (name, areas (name)),
                order_items (
                    *,
                    products (name)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Connection error:', e);
        return [];
    }
}

export async function updateOrderStatus(id: string, status: string) {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/orders');
}

export async function getStaffCalls() {
    try {
        const { data, error } = await supabase
            .from('staff_calls')
            .select(`
                *,
                tables (name, areas (name))
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error('Error fetching staff calls:', e);
        return [];
    }
}

export async function updateStaffCallStatus(id: string, status: 'pending' | 'completed') {
    try {
        const { error } = await supabase
            .from('staff_calls')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (e) {
        console.error('Error updating staff call status:', e);
        return { success: false };
    }
}
