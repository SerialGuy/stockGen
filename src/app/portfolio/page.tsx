"use client";
import React, { useState } from "react";
import { useTheme, getThemeColors } from "../../contexts/ThemeContext";

export default function PortfolioPage() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [activeTab, setActiveTab] = useState('overview');

  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.bg.gradient,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      padding: '24px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent' as const,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '1.125rem',
      color: colors.text.secondary,
      marginBottom: '24px',
    },
    tabsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '32px',
      flexWrap: 'wrap' as const,
    },
    tab: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      background: colors.bg.card,
      color: colors.text.secondary,
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderBottom: `2px solid transparent`,
    },
    activeTab: {
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: '#ffffff',
      boxShadow: theme === 'dark' 
        ? '0 4px 16px rgba(96, 165, 250, 0.4)' 
        : '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    statCard: {
      background: colors.bg.card,
      borderRadius: '16px',
      border: `1px solid ${colors.border.primary}`,
      padding: '24px',
      boxShadow: colors.shadow.md,
      transition: 'all 0.3s ease',
    },
    statCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: colors.shadow.lg,
    },
    statTitle: {
      fontSize: '0.875rem',
      color: colors.text.tertiary,
      fontWeight: 600,
      marginBottom: '8px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.text.primary,
      marginBottom: '4px',
    },
    statChange: {
      fontSize: '0.875rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    positiveChange: {
      color: '#10b981',
    },
    negativeChange: {
      color: '#ef4444',
    },
    neutralChange: {
      color: colors.text.secondary,
    },
    placeholder: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.text.secondary,
      fontSize: '1.125rem',
    },
    comingSoon: {
      background: colors.bg.card,
      borderRadius: '16px',
      border: `1px solid ${colors.border.primary}`,
      padding: '48px 24px',
      textAlign: 'center' as const,
      boxShadow: colors.shadow.md,
    },
    comingSoonIcon: {
      fontSize: '4rem',
      marginBottom: '16px',
    },
    comingSoonTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: colors.text.primary,
      marginBottom: '8px',
    },
    comingSoonText: {
      fontSize: '1rem',
      color: colors.text.secondary,
      lineHeight: '1.6',
    },
  };

  const mockStats = [
    {
      title: 'Total Portfolio Value',
      value: '$125,430.50',
      change: '+2.45%',
      isPositive: true,
    },
    {
      title: 'Today\'s Gain/Loss',
      value: '+$3,120.75',
      change: '+2.54%',
      isPositive: true,
    },
    {
      title: 'Total Return',
      value: '+$18,430.50',
      change: '+17.2%',
      isPositive: true,
    },
    {
      title: 'Risk Level',
      value: 'Moderate',
      change: 'Balanced',
      isPositive: null,
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Portfolio</h1>
        <p style={styles.subtitle}>Track your investments and performance</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {['overview', 'holdings', 'transactions', 'analytics'].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab && styles.activeTab),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div style={styles.statsGrid}>
              {mockStats.map((stat, index) => (
                <div
                  key={index}
                  style={styles.statCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = colors.shadow.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = colors.shadow.md;
                  }}
                >
                  <div style={styles.statTitle}>{stat.title}</div>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={{
                    ...styles.statChange,
                    ...(stat.isPositive === true ? styles.positiveChange : 
                         stat.isPositive === false ? styles.negativeChange : 
                         styles.neutralChange),
                  }}>
                    {stat.isPositive !== null && (
                      <span>{stat.isPositive ? '↗' : '↘'}</span>
                    )}
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Coming Soon Section */}
            <div style={styles.comingSoon}>
              <div style={styles.comingSoonIcon}>📊</div>
              <h2 style={styles.comingSoonTitle}>Portfolio Analytics Coming Soon</h2>
              <p style={styles.comingSoonText}>
                We're working on advanced portfolio analytics including performance charts, 
                risk analysis, and investment recommendations. Stay tuned for updates!
              </p>
            </div>
          </>
        )}

        {activeTab === 'holdings' && (
          <div style={styles.placeholder}>
            <h3>Holdings</h3>
            <p>Your investment holdings will be displayed here.</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={styles.placeholder}>
            <h3>Transaction History</h3>
            <p>Your buy/sell transactions will be displayed here.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={styles.placeholder}>
            <h3>Portfolio Analytics</h3>
            <p>Advanced analytics and insights will be displayed here.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            gap: 16px !important;
          }
          
          .tabs-container {
            gap: 4px !important;
          }
          
          .tab {
            padding: 10px 16px !important;
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
} 