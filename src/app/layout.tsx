"use client";
import React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarStyle: CSSProperties = {
  width: 200,
  background: '#fff',
  borderRight: '1px solid #f0f0f0',
  padding: '32px 16px 20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  minWidth: 0,
  boxSizing: 'border-box',
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  zIndex: 20,
};
const logoRowStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
};
const logoDotStyle: CSSProperties = {
  width: 16, height: 16, background: '#fbbf24', borderRadius: '50%', display: 'inline-block',
};
const logoTextStyle: CSSProperties = {
  fontSize: '1.2rem', fontWeight: 'bold', color: '#222',
};
const navStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 8,
};
const navLinkStyle: CSSProperties = {
  color: '#444', textDecoration: 'none', fontSize: '1rem', padding: '10px 16px', borderRadius: 8, fontWeight: 500,
};
const navLinkActiveStyle: CSSProperties = {
  ...navLinkStyle,
  background: '#e0e7ff', // More prominent highlight
  color: '#2563eb',
  fontWeight: 700,
  boxShadow: '0 2px 8px #2563eb22',
  border: '1.5px solid #2563eb',
};
const navSectionStyle: CSSProperties = {
  margin: '18px 0 4px 8px', fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' as CSSProperties['textTransform'], letterSpacing: 1, fontWeight: 600,
};
const mainWrapperStyle: CSSProperties = {
  marginLeft: 200,
  minHeight: '100vh',
  background: '#f7f8fa',
  width: 'calc(100vw - 200px)',
  display: 'flex',
  flexDirection: 'column',
};
const mainStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  background: 'none',
};
const headerStyle: CSSProperties = {
  width: '100%',
  background: '#fff',
  borderBottom: '1px solid #f0f0f0',
  padding: '16px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  position: 'sticky' as CSSProperties['position'],
  top: 0,
  zIndex: 10,
  minHeight: 64,
};
const searchStyle: CSSProperties = {
  flex: 1,
  maxWidth: 400,
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#f3f4f6',
  fontSize: '1rem',
  outline: 'none',
};
const headerActionsStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 18,
};
const headerIconStyle: CSSProperties = {
  fontSize: 26, color: '#888', cursor: 'pointer',
};
const avatarStyle: CSSProperties = {
  width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' as CSSProperties['objectFit'], border: '2px solid #e0e7ef',
};
const usernameStyle: CSSProperties = {
  fontWeight: 600, color: '#333', fontSize: '1rem',
};
const contentStyle: CSSProperties = {
  padding: '24px 0 0 0',
  flex: 1,
  minWidth: 0,
  maxWidth: 2000,
  width: '100%',
  boxSizing: 'border-box',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f7f8fa', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', width: '100vw', overflowX: 'hidden' }}>
        <aside style={sidebarStyle}>
          <div style={logoRowStyle}>
            <span style={logoDotStyle} />
            <span style={logoTextStyle}>Bursa Malaysia</span>
          </div>
          <nav style={navStyle}>
            <Link href="/" style={pathname === "/" ? navLinkActiveStyle : navLinkStyle}>Dashboard</Link>
            <a style={navLinkStyle} href="#">Market</a>
            <a style={navLinkStyle} href="#">Portfolio</a>
            <a style={navLinkStyle} href="#">News</a>
            <Link href="/predictions" style={pathname.startsWith("/predictions") ? navLinkActiveStyle : navLinkStyle}>Predictions</Link>
            <div style={navSectionStyle}>Account</div>
            <a style={navLinkStyle} href="#">Profile</a>
            <a style={navLinkStyle} href="#">Contact Us</a>
            <a style={navLinkStyle} href="#">Logout</a>
          </nav>
        </aside>
        <div style={mainWrapperStyle}>
          <header style={headerStyle}>
            <input style={searchStyle} type="text" placeholder="Search Bursa Malaysia..." />
            <div style={headerActionsStyle}>
              <span className="material-icons" style={headerIconStyle}>notifications_none</span>
              <img style={avatarStyle} src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
              <span style={usernameStyle}>Trader</span>
            </div>
          </header>
          <main style={mainStyle}>
            <div style={contentStyle}>{children}</div>
          </main>
        </div>
        {/* Material Icons font */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <style>{`
          @media (max-width: 900px) {
            aside { width: 60px !important; padding: 16px 4px 16px 4px !important; }
            .mainWrapper { margin-left: 60px !important; width: calc(100vw - 60px) !important; }
            header { padding: 12px 8px !important; }
            main { padding: 0 !important; }
            .content { max-width: 100vw !important; padding: 0 4px !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
