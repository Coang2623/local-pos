'use client'

import { useState } from 'react';
import { Plus, MoreHorizontal, QrCode, MapPin, Trash2, X } from 'lucide-react';
import { createArea, deleteArea } from './actions';

interface Area {
    id: string;
    name: string;
    tableCount: number;
}

export default function AreaList({ initialAreas }: { initialAreas: Area[] }) {
    const [areas, setAreas] = useState(initialAreas);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAreaName, setNewAreaName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddArea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAreaName.trim()) return;

        setIsLoading(true);
        try {
            const area = await createArea(newAreaName);
            setAreas([...areas, { ...area, tableCount: 0 }]);
            setNewAreaName('');
            setIsModalOpen(false);
        } catch (error) {
            alert('Không thể thêm khu vực: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa khu vực "${name}"? Tất cả bàn trong khu vực này cũng sẽ bị xóa.`)) return;

        try {
            await deleteArea(id);
            setAreas(areas.filter(a => a.id !== id));
        } catch (error) {
            alert('Không thể xóa khu vực: ' + (error as Error).message);
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Khu vực & Bàn</h1>
                    <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>Quản lý không gian và sơ đồ bàn của quán</p>
                </div>
                <button className="btn-apple primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Tạo khu vực
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {areas.map((area, index) => (
                    <div key={area.id} className="sf-card" style={{ animation: `fadeUp 0.5s ease forwards ${index * 0.1}s`, opacity: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: ['var(--system-blue)', 'var(--system-green)', 'var(--system-orange)', 'var(--system-red)'][index % 4],
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{area.name}</h3>
                                    <span style={{ color: 'var(--label-secondary)', fontSize: '15px' }}>{area.tableCount} bàn đang hoạt động</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(area.id, area.name)}
                                style={{ background: 'none', border: 'none', color: 'var(--label-tertiary)', cursor: 'pointer', padding: '4px' }}
                                title="Xóa khu vực"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-apple secondary" style={{ flex: 1 }}>
                                Chi tiết bàn
                            </button>
                            <button className="btn-apple secondary" style={{ flex: 1 }}>
                                <QrCode size={18} />
                                Xuất QR
                            </button>
                        </div>
                    </div>
                ))}

                <div className="sf-card"
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        border: '2px dashed var(--separator)',
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        minHeight: '180px',
                        boxShadow: 'none'
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--separator)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Plus size={24} color="var(--label-secondary)" />
                    </div>
                    <span style={{ color: 'var(--label-secondary)', fontWeight: 500 }}>Thêm khu vực mới</span>
                </div>
            </div>

            {/* MacOS Style Modal */}
            {isModalOpen && (
                <div className="glass" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                }}>
                    <div className="sf-card" style={{ width: '400px', padding: '24px', position: 'relative' }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--label-tertiary)' }}
                        >
                            <X size={20} />
                        </button>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Thêm khu vực</h2>
                        <p style={{ color: 'var(--label-secondary)', fontSize: '15px', marginBottom: '24px' }}>Nhập tên khu vực bạn muốn thêm (ví dụ: Tầng 1, Sân vườn...)</p>

                        <form onSubmit={handleAddArea}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Tên khu vực"
                                value={newAreaName}
                                onChange={(e) => setNewAreaName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--separator)',
                                    backgroundColor: 'var(--bg-color)',
                                    color: 'var(--label-primary)',
                                    fontSize: '16px',
                                    marginBottom: '24px',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="btn-apple secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn-apple primary"
                                    style={{ flex: 1 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
