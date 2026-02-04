import { getCategories, getProducts } from './actions';
import MenuList from './MenuList';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts()
    ]);

    return (
        <MenuList initialCategories={categories} initialProducts={products as any} />
    );
}
