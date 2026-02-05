'use server'

import { supabase } from '@/lib/supabase';

export async function getTableDetails(tableId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

    try {
        const { data: table, error } = await supabase
            .from('tables')
            .select(`
                id,
                name,
                areas (id, name)
            `)
            .eq('id', tableId)
            .single();

        if (error) throw error;
        return table;
    } catch (e) {
        console.error('Error fetching table details:', e);
        return null;
    }
}

export async function getMenuData() {
    try {
        const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .order('created_at');

        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('name');

        return {
            categories: categories || [],
            products: products || []
        };
    } catch {
        return { categories: [], products: [] };
    }
}

export async function getTableOrder(tableId: string) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (name, price, image_url)
                )
            `)
            .eq('table_id', tableId)
            .in('status', ['pending', 'preparing', 'served'])
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found
        return data || null;
    } catch (e) {
        console.error('Error fetching table order:', e);
        return null;
    }
}

interface CartItem {
    product_id: string;
    quantity: number;
    note?: string;
    price: number;
}

export async function addToOrder(tableId: string, items: CartItem[]) {
    try {
        // 1. Check if active order exists
        let order = await getTableOrder(tableId);

        if (!order) {
            // Create new order
            const { data: newOrder, error: createError } = await supabase
                .from('orders')
                .insert([{
                    table_id: tableId,
                    status: 'pending',
                    total_amount: 0
                }])
                .select()
                .single();

            if (createError) throw createError;
            order = newOrder;
        }

        // 2. Add items
        const itemsToInsert = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            note: item.note,
            price_at_order: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        // 3. Update total amount
        const currentTotal = order.total_amount || 0;
        const newItemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await supabase
            .from('orders')
            .update({ total_amount: currentTotal + newItemsTotal })
            .eq('id', order.id);

        return { success: true };
    } catch (e) {
        console.error('Error adding to order:', e);
        return { success: false, message: (e as Error).message };
    }
}
