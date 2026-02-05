import Link from 'next/link';

export default function NotFoundTable() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)'
        }}>
            <div style={{
                fontSize: '72px',
                marginBottom: '16px'
            }}>
                🪑
            </div>
            <h1 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '12px'
            }}>
                Không tìm thấy bàn
            </h1>
            <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '16px',
                marginBottom: '32px',
                maxWidth: '280px'
            }}>
                Mã QR không hợp lệ hoặc bàn đã bị xóa khỏi hệ thống.
            </p>
            <Link
                href="/"
                style={{
                    background: 'white',
                    color: '#ee5a5a',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: 600,
                    textDecoration: 'none'
                }}
            >
                Về trang chủ
            </Link>
        </div>
    );
}
