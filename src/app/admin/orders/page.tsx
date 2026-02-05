import { getOrders, getStaffCalls } from './actions';
import OrderList from './OrderList';
import StaffCalls from './StaffCalls';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const [orders, staffCalls] = await Promise.all([
        getOrders(),
        getStaffCalls()
    ]);

    return (
        <div className="animate-fade-in">
            <StaffCalls initialCalls={staffCalls as any} />
            <OrderList initialOrders={orders as any} />
        </div>
    );
}
