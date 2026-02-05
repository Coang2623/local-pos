'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, ClipboardList, Settings, Coffee, LayoutGrid, Menu, X } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`admin-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="glass admin-sidebar">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'var(--system-blue)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Coffee color="white" size={20} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>Cafe POS</span>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="mobile-only"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--label-primary)' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SidebarLink href="/admin" icon={<LayoutDashboard size={18} />} label="Tổng quan" active={pathname === '/admin'} />
                    <SidebarLink href="/admin/areas" icon={<Store size={18} />} label="Khu vực & Bàn" active={pathname.startsWith('/admin/areas')} />
                    <SidebarLink href="/admin/table-map" icon={<LayoutGrid size={18} />} label="Sơ đồ bàn" active={pathname.startsWith('/admin/table-map')} />
                    <SidebarLink href="/admin/menu" icon={<Coffee size={18} />} label="Thực đơn" active={pathname.startsWith('/admin/menu')} />
                    <SidebarLink href="/admin/orders" icon={<ClipboardList size={18} />} label="Hóa đơn" active={pathname.startsWith('/admin/orders')} />
                    <div style={{ height: '1px', backgroundColor: 'var(--separator)', margin: '16px 8px' }} />
                    <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="Cài đặt" active={pathname.startsWith('/admin/settings')} />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="mobile-header-btn glass"
                    style={{
                        position: 'fixed', top: '16px', left: '16px', zIndex: 40,
                        padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--label-primary)'
                    }}
                >
                    <Menu size={24} />
                </button>

                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 45 }}
                        className="mobile-only"
                    />
                )}

                <div style={{ width: '100%' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href={href} className={`sidebar-item ${active ? 'active' : ''}`}>
            <span style={{ color: active ? 'var(--system-blue)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                {icon}
            </span>
            {label}
        </Link>
    );
}
