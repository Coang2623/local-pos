'use client'

import { useState } from 'react';
import { Plus, Search, MoreVertical, Coffee } from 'lucide-react';
import { createCategory, createProduct } from './actions';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    base_cost: number;
    image_url?: string;
    is_active: boolean;
    category_id: string;
    categories: { name: string };
}

export default function MenuList({ initialCategories, initialProducts }: { initialCategories: Category[], initialProducts: Product[] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [products, setProducts] = useState(initialProducts);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [newCatName, setNewCatName] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        base_cost: 0,
        category_id: initialCategories[0]?.id || '',
        is_active: true
    });

    const filteredProducts = products.filter(p => {
        const matchesCategory = !selectedCategoryId || p.category_id === selectedCategoryId;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        try {
            const cat = await createCategory(newCatName);
            setCategories([...categories, cat]);
            setNewCatName('');
            setIsCategoryModalOpen(false);
        } catch (error) {
            alert('Lỗi: ' + (error as Error).message);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.category_id) return;
        try {
            const prod = await createProduct(newProduct);
            // Refresh or add locally
            setProducts([...products, { ...prod, categories: { name: categories.find(c => c.id === prod.category_id)?.name || '' } }]);
            setIsProductModalOpen(false);
            setNewProduct({ ...newProduct, name: '', price: 0, base_cost: 0 });
        } catch (error) {
            alert('Lỗi: ' + (error as Error).message);
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Thực đơn</h1>
                    <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>Quản lý danh mục và sản phẩm của quán</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-apple secondary" onClick={() => setIsCategoryModalOpen(true)}>
                        Thêm danh mục
                    </button>
                    <button className="btn-apple primary" onClick={() => setIsProductModalOpen(true)}>
                        <Plus size={20} />
                        Thêm món mới
                    </button>
                </div>
            </header>

            {/* Tabs / Filters */}
            <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`btn-apple ${selectedCategoryId === null ? 'primary' : 'secondary'}`}
                    style={{ borderRadius: '20px', padding: '8px 20px' }}
                >
                    Tất cả
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`btn-apple ${selectedCategoryId === cat.id ? 'primary' : 'secondary'}`}
                        style={{ borderRadius: '20px', padding: '8px 20px' }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Search & Stats */}
            <div className="sf-card" style={{ marginBottom: '32px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Search size={20} color="var(--label-tertiary)" />
                <input
                    type="text"
                    placeholder="Tìm kiếm tên món..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '16px',
                        color: 'var(--label-primary)'
                    }}
                />
                <div style={{ borderLeft: '1px solid var(--separator)', height: '24px', margin: '0 8px' }} />
                <span style={{ fontSize: '14px', color: 'var(--label-secondary)' }}>
                    Đang hiển thị: <strong>{filteredProducts.length}</strong> món
                </span>
            </div>

            {/* Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {filteredProducts.map((product, index) => (
                    <div key={product.id} className="sf-card animate-fade-up" style={{
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0,
                        padding: 0,
                        overflow: 'hidden'
                    }}>
                        <div style={{ height: '160px', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                < Coffee size={48} color="var(--label-tertiary)" />
                            )}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: product.is_active ? 'var(--system-green)' : 'var(--system-gray)',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 600,
                                textTransform: 'uppercase'
                            }}>
                                {product.is_active ? 'Đang bán' : 'Ngưng bán'}
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--system-blue)', textTransform: 'uppercase' }}>
                                        {product.categories.name}
                                    </span>
                                    <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 600 }}>{product.name}</h3>
                                </div>
                                <button style={{ background: 'none', border: 'none', color: 'var(--label-tertiary)', cursor: 'pointer' }}>
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--label-primary)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                                <span style={{ fontSize: '13px', color: 'var(--label-secondary)', textDecoration: 'line-through' }}>
                                    {/* Example base cost or old price */}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div className="sf-card" style={{ width: '400px', padding: '24px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Thêm danh mục</h2>
                        <form onSubmit={handleAddCategory}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Ví dụ: Đồ uống, Đồ ăn..."
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)', color: 'var(--label-primary)', fontSize: '16px', marginBottom: '24px', outline: 'none' }}
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-apple secondary" style={{ flex: 1 }} onClick={() => setIsCategoryModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-apple primary" style={{ flex: 1 }}>Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div className="sf-card" style={{ width: '500px', padding: '24px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Thêm món mới</h2>
                        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--label-secondary)', marginBottom: '8px', display: 'block' }}>Tên món</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Nhập tên món..."
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)', color: 'var(--label-primary)', fontSize: '16px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--label-secondary)', marginBottom: '8px', display: 'block' }}>Giá bán (VND)</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)', color: 'var(--label-primary)', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--label-secondary)', marginBottom: '8px', display: 'block' }}>Giá vốn (VND)</label>
                                    <input
                                        type="number"
                                        value={newProduct.base_cost}
                                        onChange={e => setNewProduct({ ...newProduct, base_cost: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)', color: 'var(--label-primary)', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--label-secondary)', marginBottom: '8px', display: 'block' }}>Danh mục</label>
                                <select
                                    value={newProduct.category_id}
                                    onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)', color: 'var(--label-primary)', fontSize: '16px', outline: 'none' }}
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" className="btn-apple secondary" style={{ flex: 1 }} onClick={() => setIsProductModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-apple primary" style={{ flex: 1 }}>Tạo món</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
