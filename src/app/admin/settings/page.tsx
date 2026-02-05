'use client'

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Info, LogOut, Save, Moon, Sun, Upload } from 'lucide-react';
import { getStoreSettings, updateStoreSettings } from './actions';

export default function SettingsPage() {
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(false);

    // Accent Color Options (Apple Style)
    const accentColors = [
        { value: '#007aff', name: 'Blue (Mặc định)' },
        { value: '#34c759', name: 'Green' },
        { value: '#ff9500', name: 'Orange' },
        { value: '#ff3b30', name: 'Red' },
        { value: '#af52de', name: 'Purple' },
        { value: '#ff2d55', name: 'Pink' },
    ];
    const [accentColor, setAccentColor] = useState('#007aff');
    const [accentColorName, setAccentColorName] = useState('Blue (Mặc định)');

    // Store Settings State
    const [storeInfo, setStoreInfo] = useState({
        store_name: '',
        address: '',
        phone: '',
        wifi_pass: ''
    });
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    useEffect(() => {
        // Load settings
        getStoreSettings().then(data => {
            if (data) {
                setStoreInfo({
                    store_name: data.store_name || '',
                    address: data.address || '',
                    phone: data.phone || '',
                    wifi_pass: data.wifi_pass || ''
                });
            }
        });

        // Load theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Load accent color
        const savedAccent = localStorage.getItem('accentColor') || '#007aff';
        setAccentColor(savedAccent);
        const found = accentColors.find(c => c.value === savedAccent);
        setAccentColorName(found?.name || 'Blue (Mặc định)');
        document.documentElement.style.setProperty('--system-blue', savedAccent);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const changeAccentColor = (color: string, name: string) => {
        setAccentColor(color);
        setAccentColorName(name);
        localStorage.setItem('accentColor', color);
        document.documentElement.style.setProperty('--system-blue', color);
    };

    const handleSaveInfo = async () => {
        setIsLoading(true);
        try {
            await updateStoreSettings(storeInfo);
            setIsEditingInfo(false);
            alert('Đã cập nhật thông tin quán thành công!');
        } catch (error) {
            alert('Lỗi: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 700, letterSpacing: '-1px' }}>Cài đặt</h1>
                <p style={{ color: 'var(--label-secondary)', fontSize: '17px', marginTop: '4px' }}>Quản lý tùy chỉnh và cấu hình hệ thống</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

                {/* Giao diện */}
                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Palette size={24} color="var(--system-blue)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Giao diện</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 500 }}>Chế độ tối</div>
                                <div style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>{theme === 'dark' ? 'Đang bật' : 'Đang tắt'}</div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="btn-apple secondary"
                                style={{ width: 'auto', padding: '8px 16px' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 500 }}>Màu chủ đạo</div>
                                <div style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>{accentColorName}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {accentColors.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => changeAccentColor(c.value, c.name)}
                                        title={c.name}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            backgroundColor: c.value,
                                            border: accentColor === c.value ? '3px solid var(--label-primary)' : '2px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s',
                                            transform: accentColor === c.value ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Thông tin quán */}
                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Info size={24} color="var(--system-red)" />
                            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Thông tin quán</h2>
                        </div>
                        <button
                            onClick={() => isEditingInfo ? handleSaveInfo() : setIsEditingInfo(true)}
                            className={`btn-apple ${isEditingInfo ? 'primary' : 'secondary'}`}
                            style={{ width: 'auto', padding: '6px 16px', fontSize: '14px' }}
                        >
                            {isEditingInfo ? (isLoading ? 'Đang lưu...' : 'Lưu') : 'Chỉnh sửa'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <InputGroup
                            label="Tên quán"
                            value={storeInfo.store_name}
                            onChange={v => setStoreInfo({ ...storeInfo, store_name: v })}
                            disabled={!isEditingInfo}
                        />
                        <InputGroup
                            label="Địa chỉ"
                            value={storeInfo.address}
                            onChange={v => setStoreInfo({ ...storeInfo, address: v })}
                            disabled={!isEditingInfo}
                        />
                        <InputGroup
                            label="Số điện thoại"
                            value={storeInfo.phone}
                            onChange={v => setStoreInfo({ ...storeInfo, phone: v })}
                            disabled={!isEditingInfo}
                        />
                        <InputGroup
                            label="Mật khẩu Wifi"
                            value={storeInfo.wifi_pass}
                            onChange={v => setStoreInfo({ ...storeInfo, wifi_pass: v })}
                            disabled={!isEditingInfo}
                        />
                    </div>
                </section>

                {/* Dữ liệu */}
                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Database size={24} color="var(--system-green)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Dữ liệu</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '14px' }}>
                            Database Status: <span style={{ color: 'var(--system-green)', fontWeight: 600 }}>Connected</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-apple secondary" style={{ flex: 1 }}>Sao lưu đơn hàng</button>
                            <button className="btn-apple secondary" style={{ flex: 1 }}>Sao lưu menu</button>
                        </div>
                    </div>
                </section>

                {/* Bảo mật */}
                <section className="sf-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Shield size={24} color="var(--system-orange)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Bảo mật</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 500 }}>Mật khẩu Admin</div>
                                <div style={{ fontSize: '13px', color: 'var(--label-secondary)' }}>Chưa thiết lập</div>
                            </div>
                            <button className="btn-apple secondary" style={{ width: 'auto' }}>Thiết lập</button>
                        </div>
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

function InputGroup({ label, value, onChange, disabled }: { label: string, value: string, onChange: (v: string) => void, disabled: boolean }) {
    return (
        <div>
            <label style={{ fontSize: '13px', color: 'var(--label-secondary)', marginBottom: '4px', display: 'block' }}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: disabled ? 'none' : '1px solid var(--system-blue)',
                    backgroundColor: disabled ? 'transparent' : 'var(--bg-color)',
                    paddingLeft: disabled ? 0 : '12px',
                    color: 'var(--label-primary)',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontWeight: 500
                }}
            />
            {disabled && <div style={{ height: '1px', backgroundColor: 'var(--separator)', marginTop: '4px' }} />}
        </div>
    );
}
