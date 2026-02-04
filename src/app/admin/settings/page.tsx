'use client'

import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Info, LogOut } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Cài đặt</h1>
                <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>Quản lý tùy chỉnh và cấu hình hệ thống</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Palette size={24} color="var(--system-blue)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Giao diện</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <SettingItem label="Chế độ tối" description="Tự động theo hệ thống" />
                        <SettingItem label="Màu chủ đạo" description="Blue (Mặc định Apple)" />
                    </div>
                </section>

                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Database size={24} color="var(--system-green)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Dữ liệu</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <SettingItem label="Kết nối Supabase" description="Đã thiết lập (.env.local)" />
                        <button className="btn-apple secondary" style={{ width: 'fit-content' }}>Sao lưu dữ liệu</button>
                    </div>
                </section>

                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Shield size={24} color="var(--system-orange)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Bảo mật</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <SettingItem label="Mật khẩu Admin" description="Chưa thiết lập" />
                    </div>
                </section>

                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Info size={24} color="var(--system-red)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Thông tin</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--label-secondary)' }}>
                        <p>Phiên bản: v1.0.0 (Phase 1 Complete)</p>
                        <p>Đơn vị phát triển: Antigravity AI</p>
                    </div>
                </section>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button className="btn-apple secondary" style={{ color: 'var(--system-red)', border: '1px solid var(--system-red)', padding: '12px 24px' }}>
                    <LogOut size={18} />
                    Đăng xuất hệ thống
                </button>
            </div>
        </div>
    );
}

function SettingItem({ label, description }: { label: string, description: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--separator)' }}>
            <div>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>{description}</div>
            </div>
            <div style={{ color: 'var(--label-tertiary)' }}>➔</div>
        </div>
    );
}
