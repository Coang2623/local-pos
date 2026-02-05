
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    { name: 'Espresso', price: 25000, category: 'Coffee' },
    { name: 'Americano', price: 30000, category: 'Coffee' },
    { name: 'Latte', price: 40000, category: 'Coffee' },
    { name: 'Mocha', price: 45000, category: 'Coffee' },
    { name: 'Capuchino Caramel', price: 50000, category: 'Coffee' },
    { name: 'Macchiato', price: 40000, category: 'Coffee' },
    { name: 'Cold Brew', price: 45000, category: 'Coffee' },
    { name: 'Bac Siu', price: 35000, category: 'Coffee' },
    { name: 'Tra Dao Cam Sa', price: 45000, category: 'Tea' },
    { name: 'Tra Vai', price: 45000, category: 'Tea' },
    { name: 'Tra Oolong Sen', price: 40000, category: 'Tea' },
    { name: 'Tra Chanh Leo', price: 40000, category: 'Tea' },
    { name: 'Sinh To Bo', price: 50000, category: 'Smoothie' },
    { name: 'Sinh To Xoai', price: 45000, category: 'Smoothie' },
    { name: 'Sinh To Dau', price: 50000, category: 'Smoothie' },
    { name: 'Nuoc Ep Cam', price: 40000, category: 'Juice' },
    { name: 'Nuoc Ep Tao', price: 40000, category: 'Juice' },
    { name: 'Banh Croissant', price: 30000, category: 'Pastry' },
    { name: 'Banh Tiramisu', price: 45000, category: 'Pastry' },
    { name: 'Banh Cheese', price: 40000, category: 'Pastry' },
];

async function seed() {
    console.log('Seeding menu...');

    // 1. Get or Create Categories
    const categoriesMap = new Map();
    const uniqueCats = [...new Set(products.map(p => p.category))];

    for (const catName of uniqueCats) {
        let { data: cat } = await supabase.from('categories').select('id').eq('name', catName).single();
        if (!cat) {
            const { data: newCat, error } = await supabase.from('categories').insert({ name: catName }).select('id').single();
            if (error) console.error('Error creating category', catName, error);
            else cat = newCat;
        }
        if (cat) categoriesMap.set(catName, cat.id);
    }

    // 2. Insert Products
    for (const p of products) {
        const category_id = categoriesMap.get(p.category);
        if (!category_id) continue;

        const { error } = await supabase.from('products').insert({
            name: p.name,
            price: p.price,
            category_id: category_id,
            is_active: true
        });

        if (error) console.log(`Error inserting ${p.name}:`, error.message);
        else console.log(`Inserted ${p.name}`);
    }

    console.log('Done!');
}

seed();
