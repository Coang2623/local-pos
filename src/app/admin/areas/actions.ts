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

// Table Actions
export async function getAreaById(id: string) {
    const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export async function getTables(areaId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return [];
    }

    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('area_id', areaId)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching tables:', error);
        return [];
    }

    return data || [];
}

export async function createTable(areaId: string, name: string) {
    const { data, error } = await supabase
        .from('tables')
        .insert([{ area_id: areaId, name, is_available: true }])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/admin/areas/${areaId}`);
    return data[0];
}

export async function deleteTable(areaId: string, tableId: string) {
    const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/admin/areas/${areaId}`);
}
