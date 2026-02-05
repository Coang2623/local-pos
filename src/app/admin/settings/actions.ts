'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getStoreSettings() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

    try {
        const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            // If table doesn't exist or is empty
            return {
                store_name: 'Local Cafe',
                address: 'Chưa cập nhật',
                phone: '',
                wifi_pass: ''
            };
        }
        return data;
    } catch (e) {
        return null;
    }
}

export async function updateStoreSettings(settings: {
    store_name: string;
    address: string;
    phone: string;
    wifi_pass: string;
}) {
    // Check if row exists
    const { data: existing } = await supabase.from('store_settings').select('id').limit(1).single();

    if (existing) {
        const { error } = await supabase
            .from('store_settings')
            .update(settings)
            .eq('id', existing.id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('store_settings')
            .insert([settings]);
        if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/settings');
}
