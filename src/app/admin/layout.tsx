import Link from 'next/link';
import { LayoutDashboard, Store, ClipboardList, Settings, Coffee } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar - MacOS Style */}
            <aside className="glass" style={{
                width: '260px',
                borderRight: '1px solid var(--separator)',
                padding: '24px 16px',
                position: 'fixed',
                height: '100vh',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
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

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SidebarLink href="/admin" icon={<LayoutDashboard size={18} />} label="Tổng quan" />
                    <SidebarLink href="/admin/areas" icon={<Store size={18} />} label="Khu vực & Bàn" active />
                    <SidebarLink href="/admin/menu" icon={<Coffee size={18} />} label="Thực đơn" />
                    <SidebarLink href="/admin/orders" icon={<ClipboardList size={18} />} label="Hóa đơn" />
                    <div style={{ height: '1px', backgroundColor: 'var(--separator)', margin: '16px 8px' }} />
                    <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="Cài đặt" />
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
