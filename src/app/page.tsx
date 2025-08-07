/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useEffect, useState } from "react";
import { useMarket } from "../contexts/MarketContext";
import { useTheme, getThemeColors } from "../contexts/ThemeContext";

// SymbolDetails component
type SymbolData = {
  companyName?: string;
  ticker?: string;
  stockPrice?: number | string;
  change?: {
    amount?: number | string;
    percentage?: string | number;
  };
};

function SymbolDetails({ data }: { data: SymbolData }) {
  if (!data) return null;

  return (
    <div>
      <div><strong>Company Name:</strong> {data.companyName || '-'}</div>
      <div><strong>Ticker:</strong> {data.ticker || '-'}</div>
      <div><strong>Last Price:</strong> {data.stockPrice ?? '-'}</div>
      <div>
        <strong>Change:</strong>{" "}
        {data.change?.amount != null
          ? `${data.change.amount} (${data.change.percentage ?? '-'})`
          : '-'}
      </div>
    </div>
  );
}

export default function Home() {
  // Symbol search state
  const [searchTerm, setSearchTerm] = useState("");
  type SearchResult = {
    symbol: string;
    name: string;
    exchange: string;
    [key: string]: unknown; // allows for additional properties if needed
  };
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(true);

  // Use market and theme context
  const { selectedMarket, getMarketsForTheme, switchMarket } = useMarket();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  // Get theme-aware market data
  const currentMarket = getMarketsForTheme(theme)[selectedMarket];
  const [selectedSymbol, setSelectedSymbol] = useState(currentMarket.watchlist[0]); // Default to first symbol

  // Update selected symbol when market or theme changes
  useEffect(() => {
    const themeAwareMarket = getMarketsForTheme(theme)[selectedMarket];
    setSelectedSymbol(themeAwareMarket.watchlist[0]);
    setChartLoading(true); // Reset loading state when symbol changes
  }, [selectedMarket, theme, getMarketsForTheme]);

  // Dynamic styles based on theme
  const additionalStyles = {
    container: {
      minHeight: '100vh',
      background: colors.bg.gradient,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      width: '100%',
      height: '100%',
    },
    mainContent: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
      padding: '20px',
      boxSizing: 'border-box' as const,
      maxWidth: '100%',
    },
    chartSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      width: '100%',
      flex: 1,
      minHeight: 0,
    },
    chartCard: {
      background: colors.bg.card,
      borderRadius: '16px',
      boxShadow: colors.shadow.lg,
      border: `1px solid ${colors.border.primary}`,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    chartHeader: {
      padding: '20px 24px 16px 24px',
      borderBottom: `1px solid ${colors.border.secondary}`,
      background: colors.bg.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    },
    chartTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: colors.text.accent,
      letterSpacing: '-0.025em',
      margin: 0,
    },
    chartContainer: {
      flex: 1,
      minHeight: 0,
      position: 'relative' as const,
      padding: '0 24px 24px 24px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    iframe: {
      width: '100%',
      height: '100%',
      minHeight: '600px',
      border: `1px solid ${colors.border.secondary}`,
      borderRadius: '12px',
      background: colors.bg.chart,
      transition: 'opacity 0.3s ease',
      opacity: 0,
      flex: 1,
    },
    loadingContainer: {
      width: '100%',
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.bg.chart,
      border: `1px solid ${colors.border.secondary}`,
      borderRadius: '12px',
      color: colors.text.secondary,
      fontSize: '1rem',
      fontWeight: 500,
      flex: 1,
    },
    fallbackContainer: {
      width: '100%',
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.bg.chart,
      border: `1px solid ${colors.border.secondary}`,
      borderRadius: '12px',
      color: colors.text.secondary,
      fontSize: '1.125rem',
      fontWeight: 600,
      textAlign: 'center' as const,
      padding: '2rem',
      flex: 1,
    },
    watchlistSection: {
      display: 'flex',
      gap: '12px',
      overflowX: 'auto' as const,
      padding: '8px 0',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      flexShrink: 0,
      scrollbarWidth: 'thin' as const,
      scrollbarColor: `${colors.border.secondary} transparent`,
      height: '100px',
    },
    watchlistCard: {
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      border: theme === 'dark' 
        ? '2px solid #60a5fa' 
        : '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '16px 20px',
      minWidth: '160px',
      maxWidth: '160px',
      height: '80px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme === 'dark' 
        ? '0 4px 16px rgba(59, 130, 246, 0.4)' 
        : colors.shadow.md,
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '16px',
      cursor: 'pointer',
      outline: 'none',
      margin: '4px',
      transition: 'all 0.3s ease',
      transform: 'translateY(0)',
      flexShrink: 0,
    },
    watchlistCardInactive: {
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #334155, #475569)' 
        : `linear-gradient(135deg, ${colors.bg.primary}, ${colors.bg.secondary})`,
      border: theme === 'dark' 
        ? '1px solid #475569' 
        : `1px solid ${colors.border.secondary}`,
      color: colors.text.primary,
      boxShadow: theme === 'dark' 
        ? '0 2px 8px rgba(0,0,0,0.4)' 
        : colors.shadow.sm,
    },
    watchlistSymbol: {
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '4px',
      textAlign: 'center' as const,
    },
    watchlistName: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center' as const,
      lineHeight: '1.2',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
      width: '100%',
    },
    watchlistNameInactive: {
      color: colors.text.secondary,
    },
    marketInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.875rem',
      color: colors.text.tertiary,
    },
    marketToggle: {
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <div className="dashboard-root" style={additionalStyles.container}>
      <main style={additionalStyles.mainContent}>
        {/* Chart Section */}
        <section style={additionalStyles.chartSection}>
          {/* Chart Card */}
          <div className="chart-card" style={additionalStyles.chartCard}>
            <div className="chart-header" style={additionalStyles.chartHeader}>
              <div>
                <h2 className="chart-title" style={additionalStyles.chartTitle}>
                  {selectedSymbol.name} Chart
                </h2>
                <div style={additionalStyles.marketInfo}>
                  <span>📊 {selectedSymbol.symbol}</span>
                  <span>•</span>
                  <span>{currentMarket.name}</span>
                </div>
              </div>
              <div style={additionalStyles.marketToggle}>
                                  <button
                    onClick={() => switchMarket(selectedMarket === 'bursa' ? 'forex' : 'bursa')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: theme === 'dark' 
                        ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' 
                        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                                      onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = theme === 'dark' 
                        ? '0 4px 12px rgba(96, 165, 250, 0.3)' 
                        : '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                  <span>{selectedMarket === 'bursa' ? '📈' : '💱'}</span>
                  <span>Switch to {selectedMarket === 'bursa' ? 'Forex' : 'Bursa'}</span>
                </button>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="chart-container" style={additionalStyles.chartContainer}>
            {selectedSymbol.embeddable ? (
                <>
                  {chartLoading && (
                    <div style={additionalStyles.loadingContainer}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          border: `3px solid ${colors.border.secondary}`, 
                          borderTop: `3px solid ${colors.text.accent}`, 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }} />
                        <span>Loading chart...</span>
                      </div>
                    </div>
                  )}
              <iframe
                key={`${selectedSymbol.symbol}-${theme}`}
                src={selectedSymbol.url}
                    style={additionalStyles.iframe}
                title={`${selectedSymbol.name} Chart`}
                allowFullScreen
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  iframe.style.opacity = '1';
                      setChartLoading(false);
                }}
                onError={(e) => {
                  console.error('Chart loading error:', e);
                  const iframe = e.target as HTMLIFrameElement;
                  iframe.style.display = 'none';
                      setChartLoading(false);
                }}
              />
                </>
            ) : (
                <div style={additionalStyles.fallbackContainer}>
                {selectedSymbol.symbol === 'FBMKLCI'
                  ? 'KLSE Index chart is not embeddable. Please use a stock from the watchlist.'
                  : 'This symbol is not embeddable.'}
              </div>
            )}
          </div>
          </div>
        </section>

          {/* Watchlist Section */}
        <div className="watchlist-section" style={additionalStyles.watchlistSection}>
            {currentMarket.watchlist.map(stock => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedSymbol(stock)}
                className="watchlist-card"
                style={{
                ...additionalStyles.watchlistCard,
                ...(selectedSymbol.symbol !== stock.symbol && additionalStyles.watchlistCardInactive),
                }}
                onMouseEnter={(e) => {
                  if (selectedSymbol.symbol !== stock.symbol) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = colors.shadow.lg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSymbol.symbol !== stock.symbol) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = colors.shadow.sm;
                  }
                }}
              >
              <span style={additionalStyles.watchlistSymbol}>{stock.symbol}</span>
              <span style={{
                ...additionalStyles.watchlistName,
                ...(selectedSymbol.symbol !== stock.symbol && additionalStyles.watchlistNameInactive),
              }}>
                {stock.name}
              </span>
              </button>
            ))}
          </div>
      </main>

      <style jsx global>{`
        body { 
          background: none !important; 
          margin: 0;
          padding: 0;
        }
        
        /* Loading spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom scrollbar for watchlist */
        .watchlist-section::-webkit-scrollbar {
          height: 6px;
        }
        
        .watchlist-section::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .watchlist-section::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        .watchlist-section::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .chart-header {
            padding: 16px 16px 12px 16px !important;
          }
          
          .chart-container {
            padding: 0 16px 16px 16px !important;
          }
          
          .chart-title {
            font-size: 1.25rem !important;
          }
          
          .watchlist-card {
            min-width: 140px !important;
            max-width: 140px !important;
            padding: 12px 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .watchlist-card {
            min-width: 120px !important;
            max-width: 120px !important;
            height: 70px !important;
            padding: 10px 12px !important;
          }
          
          .watchlist-symbol {
            font-size: 16px !important;
          }
          
          .watchlist-name {
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
