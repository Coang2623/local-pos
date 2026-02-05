import { getTableDetails, getMenuData, getTableOrder } from './actions';
import TableDetail from './TableDetail';
import { notFound } from 'next/navigation';

export default async function TableDetailPage({ params }: { params: { tableId: string } }) {
    const table = await getTableDetails(params.tableId);

    if (!table) {
        notFound();
    }

    const menu = await getMenuData();
    const currentOrder = await getTableOrder(params.tableId);

    return (
        <TableDetail
            table={table}
            initialMenu={menu}
            initialOrder={currentOrder}
        />
    );
}
