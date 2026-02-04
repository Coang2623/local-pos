import Link from 'next/link';
import { LayoutDashboard, Store, ClipboardList, Settings, Coffee } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside className="glass" style={{
                width: '260px',
                background: 'var(--sidebar-bg)',
                borderRight: '1px solid rgba(0,0,0,0.1)',
                padding: '2rem 1rem',
                position: 'fixed',
                height: '100vh'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
                    <Coffee color="var(--accent-color)" size={28} />
                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Cafe POS</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Tổng quan" />
                    <SidebarLink href="/admin/areas" icon={<Store size={20} />} label="Khu vực & Bàn" active />
                    <SidebarLink href="/admin/menu" icon={<Coffee size={20} />} label="Thực đơn" />
                    <SidebarLink href="/admin/orders" icon={<ClipboardList size={20} />} label="Hóa đơn" />
                    <SidebarLink href="/admin/settings" icon={<Settings size={20} />} label="Cài đặt" />
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            textDecoration: 'none',
            color: active ? 'white' : 'var(--text-primary)',
            backgroundColor: active ? 'var(--accent-color)' : 'transparent',
            fontWeight: 500,
            transition: 'all 0.2s ease'
        }}>
            {icon}
            {label}
        </Link>
    );
}
