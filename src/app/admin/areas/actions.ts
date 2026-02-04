'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getAreas() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return [];
    }
    try {
        const { data, error } = await supabase
            .from('areas')
            .select(`
                *,
                tables (count)
            `)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching areas:', error);
            return [];
        }

        return data?.map(area => ({
            ...area,
            tableCount: area.tables?.[0]?.count || 0
        })) || [];
    } catch (e) {
        console.error('Connection error:', e);
        return [];
    }
}

export async function createArea(name: string) {
    const { data, error } = await supabase
        .from('areas')
        .insert([{ name }])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/areas');
    return data[0];
}

export async function deleteArea(id: string) {
    const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/areas');
}
