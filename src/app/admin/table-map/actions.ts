'use server'

import { supabase } from '@/lib/supabase';

export async function getTableMapData() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

    try {
        // 1. Get all areas with tables
        const { data: areas, error: areasError } = await supabase
            .from('areas')
            .select(`
                id,
                name,
                tables (
                    id,
                    name,
                    is_available
                )
            `)
            .order('created_at');

        if (areasError) throw areasError;

        // 2. Get all active orders (not paid, not cancelled)
        const { data: activeOrders, error: ordersError } = await supabase
            .from('orders')
            .select(`
                id,
                table_id,
                status,
                total_amount,
                created_at,
                order_items (
                    id,
                    quantity,
                    price_at_order
                )
            `)
            .in('status', ['pending', 'preparing', 'served']);

        if (ordersError) throw ordersError;

        // 3. Merge data
        return areas.map(area => ({
            ...area,
            tables: area.tables.map(table => {
                const tableOrders = activeOrders?.filter(o => o.table_id === table.id) || [];

                // Active order is one that is not paid/cancelled
                // Usually a table has only 1 active order, but if multiple, we sum them
                const isActive = tableOrders.length > 0;

                if (!isActive) {
                    return {
                        ...table,
                        status: 'empty',
                        duration: 0,
                        total_amount: 0,
                        item_count: 0
                    };
                }

                // If active, calculate stats
                const oldestOrder = tableOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
                const startTime = new Date(oldestOrder.created_at).getTime();
                const now = new Date().getTime();
                const duration = Math.floor((now - startTime) / 60000); // Minutes

                const totalAmount = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);

                // Count items not fully served sequence? 
                // Currently user requirement: "còn bao nhiêu món chưa phục vụ"
                // Our order_items don't have active status yet (only orders do).
                // So we assume items in 'pending'/'preparing' orders are "not served".
                // Items in 'served' orders are "served".
                // This is an approximation. Ideally order_items should have status.
                // For now: Count items where order status is pending or preparing.

                let pendingItems = 0;
                tableOrders.forEach(o => {
                    if (o.status === 'pending' || o.status === 'preparing') {
                        pendingItems += o.order_items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
                    }
                });

                return {
                    ...table,
                    status: 'occupied',
                    duration,
                    total_amount: totalAmount,
                    item_count: pendingItems
                };
            })
        }));

    } catch (e) {
        console.error('Error fetching table map data:', e);
        return [];
    }
}
