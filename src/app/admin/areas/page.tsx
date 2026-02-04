import { Plus, MoreHorizontal, QrCode, MapPin } from 'lucide-react';

export default function AreasPage() {
    const mockAreas = [
        { id: '1', name: 'Tầng 1', tables: 8, color: 'var(--system-blue)' },
        { id: '2', name: 'Sân vườn', tables: 5, color: 'var(--system-green)' },
        { id: '3', name: 'Tầng 2', tables: 6, color: 'var(--system-orange)' },
    ];

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Khu vực & Bàn</h1>
                    <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>Quản lý không gian và sơ đồ bàn của quán</p>
                </div>
                <button className="btn-apple primary">
                    <Plus size={20} />
                    Tạo khu vực
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {mockAreas.map(area => (
                    <div key={area.id} className="sf-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: area.color,
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
                                    <span style={{ color: 'var(--label-secondary)', fontSize: '15px' }}>{area.tables} bàn đang hoạt động</span>
                                </div>
                            </div>
                            <button style={{ background: 'none', border: 'none', color: 'var(--label-tertiary)', cursor: 'pointer', padding: '4px' }}>
                                <MoreHorizontal size={20} />
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

                {/* Placeholder for new area */}
                <div className="sf-card" style={{
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
                }}>
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
        </div>
    );
}
