import { Plus, MoreHorizontal, QrCode } from 'lucide-react';

export default function AreasPage() {
    const mockAreas = [
        { id: '1', name: 'Tầng 1', tables: 8 },
        { id: '2', name: 'Sân vườn', tables: 5 },
        { id: '3', name: 'Tầng 2', tables: 6 },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Quản lý Khu vực & Bàn</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>Cấu hình không gian quán của bạn</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} />
                    Thêm Khu vực
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {mockAreas.map(area => (
                    <div key={area.id} className="card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{area.name}</h3>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{area.tables} bàn</span>
                            </div>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-primary" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                Xem bàn
                            </button>
                            <button className="btn-primary" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <QrCode size={18} />
                                Tất cả QR
                            </button>
                        </div>
                    </div>
                ))}

                {/* Placeholder for new area */}
                <div className="card" style={{
                    border: '2px dashed rgba(0,0,0,0.1)',
                    background: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    minHeight: '160px'
                }}>
                    <Plus size={32} color="var(--text-secondary)" />
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Thêm khu vực mới</span>
                </div>
            </div>
        </div>
    );
}
