'use client'

import { useState } from 'react';
import { Plus, QrCode, Trash2, X, ChevronLeft, LayoutGrid, Download } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { createTable, deleteTable } from '../actions';

interface Table {
    id: string;
    name: string;
    is_available: boolean;
}

interface Area {
    id: string;
    name: string;
}

export default function TableList({ initialTables, area }: { initialTables: Table[], area: Area }) {
    const [tables, setTables] = useState(initialTables);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTableForQR, setSelectedTableForQR] = useState<Table | null>(null);
    const [newTableName, setNewTableName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadQR = (tableName: string) => {
        const svg = document.getElementById('table-qr');
        if (!svg) return;

        // Handle Unicode characters for btoa to prevent errors with Vietnamese names in SVG
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Set canvas size with padding for the text
            canvas.width = img.width + 40;
            canvas.height = img.height + 80;

            if (ctx) {
                // Background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw QR Code
                ctx.drawImage(img, 20, 20);

                // Draw Text (Table Name - Area Name)
                ctx.fillStyle = 'black';
                ctx.font = 'bold 20px Inter, sans-serif';
                ctx.textAlign = 'center';
                const displayName = `${tableName} - ${area.name}`;
                ctx.fillText(displayName, canvas.width / 2, canvas.height - 25);
            }

            // Convert to Blob for more reliable downloading in modern browsers
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');

                // Use a safer filename (remove spaces if needed, but original name is fine in most OS)
                downloadLink.download = `QR_Code_${tableName}.png`;
                downloadLink.href = url;

                // Must append to body for some browsers to respect the download attribute
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Clean up
                URL.revokeObjectURL(url);
            }, 'image/png');
        };

        // Load SVG as data URL
        img.src = 'data:image/svg+xml;base64,' + svgBase64;
    };

    const handleAddTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTableName.trim()) return;

        setIsLoading(true);
        try {
            const table = await createTable(area.id, newTableName);
            setTables([...tables, table].sort((a, b) => a.name.localeCompare(b.name)));
            setNewTableName('');
            setIsModalOpen(false);
        } catch (error) {
            alert('Không thể thêm bàn: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa bàn "${name}"?`)) return;

        try {
            await deleteTable(area.id, id);
            setTables(tables.filter(t => t.id !== id));
        } catch (error) {
            alert('Không thể xóa bàn: ' + (error as Error).message);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Link href="/admin/areas" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--system-blue)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: 500
                }}>
                    <ChevronLeft size={18} />
                    Quay lại Khu vực
                </Link>
            </div>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>{area.name}</h1>
                    <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>
                        Tổng số: {tables.length} bàn
                    </p>
                </div>
                <button className="btn-apple primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Thêm bàn
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {tables.map((table, index) => (
                    <div key={table.id} className="sf-card animate-fade-up" style={{
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0,
                        padding: '20px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            backgroundColor: table.is_available ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: table.is_available ? 'var(--system-green)' : 'var(--system-red)'
                        }}>
                            <LayoutGrid size={28} />
                        </div>

                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{table.name}</h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                marginTop: '4px',
                                fontSize: '13px',
                                color: table.is_available ? 'var(--system-green)' : 'var(--system-red)'
                            }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                                {table.is_available ? 'Đang trống' : 'Đang dùng'}
                            </div>
                        </div>

                        <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--separator)', margin: '4px 0' }} />

                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <button
                                onClick={() => setSelectedTableForQR(table)}
                                title="Xem QR Code"
                                className="btn-apple secondary"
                                style={{ padding: '8px', flex: 1 }}
                            >
                                <QrCode size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(table.id, table.name)}
                                title="Xóa bàn"
                                className="btn-apple secondary"
                                style={{ padding: '8px', color: 'var(--system-red)' }}
                            >
                                <Trash2 size={18} />
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
                    <Plus size={24} color="var(--label-secondary)" />
                    <span style={{ color: 'var(--label-secondary)', fontWeight: 500, fontSize: '14px' }}>Thêm bàn</span>
                </div>
            </div>

            {/* Modal */}
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
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Thêm bàn mới</h2>
                        <p style={{ color: 'var(--label-secondary)', fontSize: '15px', marginBottom: '24px' }}>Nhập tên hoặc số bàn bạn muốn thêm vào {area.name}.</p>

                        <form onSubmit={handleAddTable}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Ví dụ: Bàn 05"
                                value={newTableName}
                                onChange={(e) => setNewTableName(e.target.value)}
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
            {/* QR Modal */}
            {selectedTableForQR && (
                <div className="glass" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                }}>
                    <div className="sf-card" style={{ width: '320px', padding: '32px', textAlign: 'center', position: 'relative' }}>
                        <button
                            onClick={() => setSelectedTableForQR(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--label-tertiary)' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>QR Code - {selectedTableForQR.name}</h2>
                        <p style={{ color: 'var(--label-secondary)', fontSize: '14px', marginBottom: '24px' }}>Khách quét mã này để đặt món</p>

                        <div style={{
                            background: 'white',
                            padding: '16px',
                            borderRadius: '16px',
                            display: 'inline-block',
                            marginBottom: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <QRCodeSVG
                                id="table-qr"
                                value={`${window.location.origin}/order/${selectedTableForQR.id}`}
                                size={200}
                                level="H"
                                includeMargin={false}
                            />
                        </div>

                        <button
                            className="btn-apple primary"
                            style={{ width: '100%', gap: '8px' }}
                            onClick={() => handleDownloadQR(selectedTableForQR.name)}
                        >
                            <Download size={18} />
                            Tải mã QR (PNG)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
