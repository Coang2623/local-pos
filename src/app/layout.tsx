import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Local Cafe POS",
    description: "Hệ thống order cafe nội bộ",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body>{children}</body>
        </html>
    );
}
