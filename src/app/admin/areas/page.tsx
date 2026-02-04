import { getAreas } from './actions';
import AreaList from './AreaList';

export const dynamic = 'force-dynamic';

export default async function AreasPage() {
    const areas = await getAreas();

    return (
        <AreaList initialAreas={areas} />
    );
}
