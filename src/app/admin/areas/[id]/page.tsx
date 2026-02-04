import { getAreaById, getTables } from '../actions';
import TableList from './TableList';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AreaDetailPage({ params }: PageProps) {
    const { id } = await params;

    const [area, tables] = await Promise.all([
        getAreaById(id),
        getTables(id)
    ]);

    if (!area) {
        notFound();
    }

    return (
        <TableList area={area} initialTables={tables} />
    );
}
