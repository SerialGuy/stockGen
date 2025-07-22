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

  // Use market and theme context
  const { selectedMarket, getMarketsForTheme } = useMarket();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  // Get theme-aware market data
  const currentMarket = getMarketsForTheme(theme)[selectedMarket];
  const [selectedSymbol, setSelectedSymbol] = useState(currentMarket.watchlist[0]); // Default to first symbol

  // Update selected symbol when market or theme changes
  useEffect(() => {
    const themeAwareMarket = getMarketsForTheme(theme)[selectedMarket];
    setSelectedSymbol(themeAwareMarket.watchlist[0]);
  }, [selectedMarket, theme, getMarketsForTheme]);

  // Dynamic styles based on theme
  const additionalStyles = {
    container: {
      minHeight: '100vh',
      background: colors.bg.gradient,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    },
    card: {
      borderRadius: '12px',
      boxShadow: colors.shadow.lg,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    cardHover: {
      transform: 'scale(1.02)',
      boxShadow: colors.shadow.lg,
    },
    button: {
      transition: 'background 0.3s ease',
    },
  };

  return (
    <div className="dashboard-root" style={additionalStyles.container}>
      {/* Main Content */}
      <main style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, padding: '32px 8px 0 8px' }}>
        {/* Chart + Watchlist Section */}
<section style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', width: '100%' }}>
          {/* Chart Card */}
          <div className="chart-card" style={{ ...additionalStyles.card, background: colors.bg.card, padding: '32px 24px 24px 24px', border: `1px solid ${colors.border.primary}`, width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div className="chart-header" style={{ justifyContent: 'center', marginBottom: 12, width: '100%' }}>
              <span className="chart-title" style={{ fontSize: 24, fontWeight: 700, color: colors.text.accent, letterSpacing: -0.5 }}>{selectedSymbol.name} Chart</span>
            </div>
            {/* Chart or Fallback */}
            {selectedSymbol.embeddable ? (
              <iframe
                key={`${selectedSymbol.symbol}-${theme}`}
                src={selectedSymbol.url}
                width="100%"
                height={500}
                frameBorder={0}
                style={{ 
                  border: `1px solid ${colors.border.secondary}`, 
                  borderRadius: 12, 
                  minWidth: 320, 
                  marginBottom: 0, 
                  background: colors.bg.chart,
                  transition: 'opacity 0.3s ease'
                }}
                title={`${selectedSymbol.name} Chart`}
                allowFullScreen
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  iframe.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error('Chart loading error:', e);
                  const iframe = e.target as HTMLIFrameElement;
                  iframe.style.display = 'none';
                }}
              />
            ) : (
              <div style={{ width: '100%', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg.chart, border: `1px solid ${colors.border.secondary}`, borderRadius: 12, color: colors.text.secondary, fontSize: 20, fontWeight: 600 }}>
                {selectedSymbol.symbol === 'FBMKLCI'
                  ? 'KLSE Index chart is not embeddable. Please use a stock from the watchlist.'
                  : 'This symbol is not embeddable.'}
              </div>
            )}
          </div>
          {/* Watchlist Section */}
          <div className="klse-watchlist" style={{ display: 'flex', gap: 12, overflowX: 'auto', marginTop: 16, paddingBottom: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: '100%', maxWidth: 1200 }}>
            {currentMarket.watchlist.map(stock => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedSymbol(stock)}
                className="watchlist-card"
                style={{
                  background: selectedSymbol.symbol === stock.symbol 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                    : `linear-gradient(135deg, ${colors.bg.primary}, ${colors.bg.secondary})`,
                  border: selectedSymbol.symbol === stock.symbol ? `2px solid ${colors.border.accent}` : `1px solid ${colors.border.secondary}`,
                  borderRadius: 12,
                  padding: '16px 20px',
                  minWidth: 160,
                  maxWidth: 160,
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: selectedSymbol.symbol === stock.symbol 
                    ? colors.shadow.accent
                    : colors.shadow.sm,
                  color: selectedSymbol.symbol === stock.symbol ? colors.text.inverse : colors.text.primary,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  outline: 'none',
                  margin: '4px',
                  transition: 'all 0.3s ease',
                  transform: selectedSymbol.symbol === stock.symbol ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  if (selectedSymbol.symbol !== stock.symbol) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = colors.shadow.md;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSymbol.symbol !== stock.symbol) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = colors.shadow.sm;
                  }
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{stock.symbol}</span>
                <span style={{ fontSize: 13, color: selectedSymbol.symbol === stock.symbol ? colors.text.inverse : colors.text.secondary, marginBottom: 0 }}>{stock.name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      <style jsx global>{`
        body { background: none !important; }
      `}</style>
    </div>
  );
}
