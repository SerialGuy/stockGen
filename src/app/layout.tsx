/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketProvider, useMarket } from "../contexts/MarketContext";
import { ThemeProvider, useTheme, getThemeColors } from "../contexts/ThemeContext";
import Image from "next/image";

const sidebarStyle: CSSProperties = {
  width: 240,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  borderRight: '1px solid #e2e8f0',
  padding: '28px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  minWidth: 0,
  boxSizing: 'border-box',
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  zIndex: 30,
  boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
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
  color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', padding: '12px 16px', borderRadius: 10, fontWeight: 500, transition: 'all 0.2s ease',
};
const navLinkActiveStyle: CSSProperties = {
  ...navLinkStyle,
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  color: '#ffffff',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  border: 'none',
};
const navSectionStyle: CSSProperties = {
  margin: '18px 0 4px 8px', fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' as CSSProperties['textTransform'], letterSpacing: 1, fontWeight: 600,
};
const mainWrapperStyle: CSSProperties = {
  marginLeft: 240,
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
  width: 'calc(100vw - 240px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};
const mainStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  width: '100%',
  background: 'none',
  overflow: 'hidden',
};
const headerStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #e2e8f0',
  padding: '20px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  position: 'sticky' as CSSProperties['position'],
  top: 0,
  zIndex: 20,
  minHeight: 72,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
};
const searchStyle: CSSProperties = {
  flex: 1,
  maxWidth: 400,
  padding: '12px 16px',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  background: 'rgba(248,250,252,0.8)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
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
  flex: 1,
  minWidth: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

function LayoutContent({ children, pathname }: { children: React.ReactNode; pathname: string }) {
  const { selectedMarket, switchMarket, getMarketsForTheme } = useMarket();
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);
  
  // Get theme-aware market data for header
  const currentMarket = getMarketsForTheme(theme)[selectedMarket];



  // Dynamic styles based on theme
  const dynamicSidebarStyle = {
    ...sidebarStyle,
    background: theme === 'dark' 
      ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)' 
      : colors.bg.sidebar,
    borderRight: `1px solid ${colors.border.primary}`,
    boxShadow: theme === 'dark' 
      ? '0 8px 32px rgba(0,0,0,0.6)' 
      : '2px 0 10px rgba(0,0,0,0.05)',
  };

  const dynamicLogoTextStyle = {
    ...logoTextStyle,
    color: colors.text.primary,
  };

  const dynamicNavLinkStyle = {
    ...navLinkStyle,
    color: colors.text.secondary,
  };

  const dynamicNavSectionStyle = {
    ...navSectionStyle,
    color: colors.text.tertiary,
  };

  const dynamicMainWrapperStyle = {
    ...mainWrapperStyle,
    background: colors.bg.gradient,
  };

  const dynamicHeaderStyle = {
    ...headerStyle,
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))' 
      : 'rgba(255, 255, 255, 0.95)',
    borderBottom: `1px solid ${colors.border.primary}`,
    boxShadow: theme === 'dark' 
      ? '0 4px 16px rgba(0,0,0,0.5)' 
      : '0 2px 8px rgba(0,0,0,0.1)',
  };

  const dynamicSearchStyle = {
    ...searchStyle,
    border: `1px solid ${colors.border.primary}`,
    background: theme === 'dark' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(248,250,252,0.8)',
    color: colors.text.primary,
  };

  const dynamicUsernameStyle = {
    ...usernameStyle,
    color: colors.text.primary,
  };

  return (
    <>
      <aside style={dynamicSidebarStyle}>
        <div style={logoRowStyle}>
          <span style={logoDotStyle} />
          <span style={dynamicLogoTextStyle}>
            StockAPI
          </span>
        </div>
        <nav style={{ ...navStyle, flex: 1 }}>
          <Link href="/" style={pathname === "/" ? navLinkActiveStyle : dynamicNavLinkStyle}>Dashboard</Link>
          <a style={dynamicNavLinkStyle} href="#">Market</a>
          <Link href="/portfolio" style={pathname === "/portfolio" ? navLinkActiveStyle : dynamicNavLinkStyle}>Portfolio</Link>
          <Link href="/news" style={pathname === "/news" ? navLinkActiveStyle : dynamicNavLinkStyle}>News</Link>
          <Link href={selectedMarket === 'bursa' ? '/predictions/klse' : '/predictions/forex'} style={pathname.startsWith("/predictions") ? navLinkActiveStyle : dynamicNavLinkStyle}>Predictions</Link>
          <div style={dynamicNavSectionStyle}>Account</div>
          <a style={dynamicNavLinkStyle} href="#">Profile</a>
          <a style={dynamicNavLinkStyle} href="#">Contact Us</a>
          <a style={dynamicNavLinkStyle} href="#">Logout</a>
        </nav>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            border: 'none',
            borderRadius: 10,
            background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: colors.text.primary,
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
            marginTop: 16,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.05)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{theme === 'light' ? '🌙' : '☀️'}</span>
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </aside>
      <div style={dynamicMainWrapperStyle}>
        <header style={dynamicHeaderStyle}>
          {/* Market Title and Description */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h1 style={{ 
              fontWeight: 700, 
              fontSize: '1.5rem', 
              letterSpacing: -0.5, 
              color: colors.text.accent, 
              margin: 0,
              lineHeight: 1.2
            }}>
              {currentMarket.displayName}
            </h1>
            <div style={{ 
              color: colors.text.secondary, 
              fontSize: '0.9rem', 
              marginTop: 2,
              lineHeight: 1.3
            }}>
              {currentMarket.description}
            </div>
          </div>
          <div style={headerActionsStyle}>
          <span className="material-icons" style={{ ...headerIconStyle, color: colors.text.tertiary }}>
            notifications_none
          </span>

          <Image
            style={{ ...avatarStyle, border: `2px solid ${colors.border.primary}` }}
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            width={40} // set your preferred size
            height={40}
          />

          <span style={dynamicUsernameStyle}>Trader</span>

          </div>
        </header>
        <main style={mainStyle}>
          <div style={contentStyle}>{children}</div>
        </main>
      </div>
    </>
  );
}

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
        <ThemeProvider>
          <MarketProvider>
            <LayoutContent pathname={pathname}>{children}</LayoutContent>
          </MarketProvider>
        </ThemeProvider>
        {/* Material Icons font */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <style>{`
          @media (max-width: 900px) {
            aside { 
              width: 60px !important; 
              padding: 16px 4px 16px 4px !important; 
            }
            .mainWrapper { 
              margin-left: 60px !important; 
              width: calc(100vw - 60px) !important; 
            }
            header { 
              padding: 12px 8px !important; 
            }
            main { 
              padding: 0 !important; 
            }
            .content { 
              max-width: 100vw !important; 
              padding: 0 4px !important; 
            }
          }
          
          @media (max-width: 768px) {
            aside { 
              width: 50px !important; 
              padding: 12px 2px 12px 2px !important; 
            }
            .mainWrapper { 
              margin-left: 50px !important; 
              width: calc(100vw - 50px) !important; 
            }
            header { 
              padding: 8px 6px !important; 
              min-height: 56px !important;
            }
            .chart-title {
              font-size: 1.25rem !important;
            }
            .market-info {
              font-size: 0.75rem !important;
            }
          }
          
          @media (max-width: 480px) {
            aside { 
              width: 40px !important; 
              padding: 8px 1px 8px 1px !important; 
            }
            .mainWrapper { 
              margin-left: 40px !important; 
              width: calc(100vw - 40px) !important; 
            }
            header { 
              padding: 6px 4px !important; 
              min-height: 48px !important;
            }
            .chart-title {
              font-size: 1.125rem !important;
            }
            .market-info {
              font-size: 0.7rem !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
