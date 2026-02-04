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
