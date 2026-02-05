import { getTableMapData } from './actions';
import TableMap from './TableMap';

export const metadata = {
    title: 'Sơ đồ bàn | Admin',
};

export default async function TableMapPage() {
    const data = await getTableMapData();

    return (
        <TableMap initialData={data as any} />
    );
}
