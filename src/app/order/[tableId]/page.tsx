import { getTableInfo, getMenuForCustomer, getStoreInfo, getOrdersByTable } from '../actions';
import CustomerMenu from './CustomerMenu';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ tableId: string }>;
}

export default async function OrderPage({ params }: PageProps) {
    const { tableId } = await params;

    const [table, menuData, storeInfo, initialOrders] = await Promise.all([
        getTableInfo(tableId),
        getMenuForCustomer(),
        getStoreInfo(),
        getOrdersByTable(tableId)
    ]);

    if (!table) {
        notFound();
    }

    return (
        <CustomerMenu
            table={table}
            categories={menuData.categories}
            products={menuData.products}
            storeInfo={storeInfo}
            initialOrders={initialOrders}
        />
    );
}
