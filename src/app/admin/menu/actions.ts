'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Category Actions
export async function getCategories() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Connection error:', e);
        return [];
    }
}

export async function createCategory(name: string) {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/menu');
    return data[0];
}

// Product Actions
export async function getProducts(categoryId?: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return [];
    }

    try {
        let query = supabase
            .from('products')
            .select(`
                *,
                categories (name)
            `)
            .order('name', { ascending: true });

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Connection error:', e);
        return [];
    }
}

export async function createProduct(product: {
    category_id: string;
    name: string;
    price: number;
    base_cost: number;
    image_url?: string;
    is_active: boolean;
}) {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/menu');
    return data[0];
}

export async function updateProduct(id: string, updates: {
    category_id?: string;
    name?: string;
    price?: number;
    base_cost?: number;
    image_url?: string;
    is_active?: boolean;
}) {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/menu');
    return data[0];
}
