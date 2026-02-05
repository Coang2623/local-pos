'use server'

import { supabase } from '@/lib/supabase';

export async function getTableInfo(tableId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

    try {
        const { data, error } = await supabase
            .from('tables')
            .select(`
                *,
                areas (name)
            `)
            .eq('id', tableId)
            .single();

        if (error) return null;
        return data;
    } catch (e) {
        return null;
    }
}

export async function getMenuForCustomer() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { categories: [], products: [] };

    try {
        const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        const { data: products } = await supabase
            .from('products')
            .select(`*, categories (name)`)
            .eq('is_active', true)
            .order('name');

        return {
            categories: categories || [],
            products: products || []
        };
    } catch (e) {
        return { categories: [], products: [] };
    }
}

export async function createOrder(tableId: string, items: { product_id: string; quantity: number; notes?: string }[]) {
    // 1. Validation
    if (!items || items.length === 0) {
        throw new Error('Đơn hàng phải có ít nhất một món');
    }

    if (items.some(item => item.quantity <= 0)) {
        throw new Error('Số lượng món ăn phải lớn hơn 0');
    }

    // 2. Get product prices and verify existence
    const productIds = items.map(i => i.product_id);
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price, is_active')
        .in('id', productIds);

    if (productsError) throw new Error(productsError.message);
    if (!products || products.length !== new Set(productIds).size) {
        throw new Error('Một số sản phẩm không tồn tại hoặc đã bị xóa');
    }

    if (products.some(p => !p.is_active)) {
        throw new Error('Một số sản phẩm hiện không còn bán');
    }

    // 3. Calculate total and prepare items
    let total = 0;
    const itemsToInsert = items.map(item => {
        const product = products.find(p => p.id === item.product_id)!;
        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        return {
            product_id: item.product_id,
            quantity: item.quantity,
            note: item.notes || '',
            price_at_order: product.price
        };
    });

    // 4. Create Order (Sequence: Order -> Order Items)
    // Note: Ideally use a Database Function (RPC) for transaction safety
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
            table_id: tableId,
            status: 'pending',
            total_amount: total
        }])
        .select()
        .single();

    if (orderError) throw new Error('Lỗi tạo đơn hàng: ' + orderError.message);

    // 5. Add Order Items
    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert.map(item => ({
            ...item,
            order_id: order.id
        })));

    if (itemsError) {
        // Rollback attempt (Simplified)
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error('Lỗi thêm món vào đơn: ' + itemsError.message);
    }

    return { ...order, items: itemsToInsert };
}

export async function getStoreInfo() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

    try {
        const { data } = await supabase
            .from('store_settings')
            .select('*')
            .limit(1)
            .single();
        return data;
    } catch (e) {
        return null;
    }
}

export async function getOrdersByTable(tableId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

    try {
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (name)
                )
            `)
            .eq('table_id', tableId)
            .not('status', 'in', '("paid","cancelled")')
            .gt('created_at', yesterday.toISOString())
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (e) {
        console.error('Error fetching table orders:', e);
        return [];
    }
}

export async function cancelOrderById(orderId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: false };

    try {
        // Kiểm tra trạng thái đơn hàng trước khi hủy
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) throw new Error('Không tìm thấy đơn hàng');
        if (order.status !== 'pending') {
            throw new Error('Chỉ có thể hủy đơn hàng đang chờ xác nhận');
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId);

        if (updateError) throw updateError;
        return { success: true };
    } catch (e) {
        console.error('Error cancelling order:', e);
        return { success: false, message: (e as Error).message };
    }
}

export async function callStaff(tableId: string, note?: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: false };

    try {
        const { error } = await supabase
            .from('staff_calls')
            .insert([{
                table_id: tableId,
                note: note || 'Khách gọi nhân viên',
                status: 'pending'
            }]);

        if (error) throw error;
        return { success: true };
    } catch (e) {
        console.error('Error calling staff:', e);
        return { success: false, message: (e as Error).message };
    }
}
