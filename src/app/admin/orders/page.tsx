import { getOrders } from './actions';
import OrderList from './OrderList';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <OrderList initialOrders={orders as any} />
    );
}
