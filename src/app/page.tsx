"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRef } from "react";

// SymbolDetails component
function SymbolDetails({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div>
      <div><strong>Company Name:</strong> {data.companyName || '-'}</div>
      <div><strong>Ticker:</strong> {data.ticker || '-'}</div>
      <div><strong>Last Price:</strong> {data.stockPrice || '-'}</div>
      <div><strong>Change:</strong> {data.change && data.change.amount ? `${data.change.amount} (${data.change.percentage || '-'})` : '-'}</div>
    </div>
  );
}

export default function Home() {
  // Symbol search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // KLSE chart state
  const watchlist = [
    { symbol: 'FBMKLCI', name: 'KLSE Index', url: 'https://www.klsescreener.com/v2/charts/indices/FBMKLCI', embeddable: false },
    { symbol: 'SET', name: 'SETIA RESOURCES', url: 'https://www.klsescreener.com/v2/stocks/view/9611/', embeddable: false },
    { symbol: 'WCT', name: 'WCT HOLDINGS', url: 'https://www.klsescreener.com/v2/stocks/view/9679/', embeddable: true },
    { symbol: 'IGBREIT', name: 'IGB REIT', url: 'https://www.klsescreener.com/v2/stocks/view/5227/', embeddable: true },
    { symbol: 'UNIQUE', name: 'UNIQUE FIRE', url: 'https://www.klsescreener.com/v2/stocks/view/0257/', embeddable: true },
    { symbol: 'KENERGY', name: 'KUMPULAN ENERGI', url: 'https://www.klsescreener.com/v2/stocks/view/7000/', embeddable: true },
    { symbol: 'BPURI', name: 'BINA PURI', url: 'https://www.klsescreener.com/v2/stocks/view/5932/', embeddable: true },
    { symbol: 'PEOPLE', name: 'PEOPLELOGY BERHAD', url: 'https://www.klsescreener.com/v2/stocks/view/0356/', embeddable: true },
    { symbol: 'E&O', name: 'EASTERN & ORIENTAL', url: 'https://www.klsescreener.com/v2/stocks/view/3417/', embeddable: true },
    { symbol: 'NE', name: 'NE TECH', url: 'https://www.klsescreener.com/v2/stocks/view/03013/', embeddable: true },
  ];
  const [selectedSymbol, setSelectedSymbol] = useState(watchlist[2]); // Default to first working symbol

  return (
    <div className="dashboard-root" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f8fa 0%, #e3e9f7 100%)', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ width: '100%', padding: '32px 0 16px 0', textAlign: 'center', background: 'none' }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, letterSpacing: -1, color: '#2563eb', margin: 0 }}>KLSE Dashboard</h1>
        <div style={{ color: '#888', fontSize: 16, marginTop: 4 }}>Live Malaysian Market Charts & Watchlist</div>
      </header>
      {/* Main Content */}
      <main style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, padding: '0 8px' }}>
        {/* Chart + Watchlist Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', width: '100%' }}>
          {/* Chart Card */}
          <div className="chart-card" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '32px 24px 24px 24px', border: '1px solid #e0e7ef', width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div className="chart-header" style={{ justifyContent: 'center', marginBottom: 12, width: '100%' }}>
              <span className="chart-title" style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', letterSpacing: -0.5 }}>{selectedSymbol.name} Chart</span>
            </div>
            {/* Chart or Fallback */}
            {selectedSymbol.embeddable ? (
              <iframe
                src={selectedSymbol.url}
                width="100%"
                height={500}
                frameBorder={0}
                style={{ border: "1px solid #ccc", borderRadius: 12, minWidth: 320, marginBottom: 0, background: '#f7f8fa' }}
                title={`${selectedSymbol.name} Chart`}
                allowFullScreen
              />
            ) : (
              <div style={{ width: '100%', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f8fa', border: '1px solid #ccc', borderRadius: 12, color: '#888', fontSize: 20, fontWeight: 600 }}>
                {selectedSymbol.symbol === 'FBMKLCI'
                  ? 'KLSE Index chart is not embeddable. Please use a stock from the watchlist.'
                  : 'This symbol is not embeddable.'}
              </div>
            )}
          </div>
          {/* Watchlist Section */}
          <div className="klse-watchlist" style={{ display: 'flex', gap: 18, overflowX: 'auto', marginTop: 0, paddingBottom: 8, justifyContent: 'center', width: '100%', maxWidth: 1200 }}>
            {watchlist.map(stock => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedSymbol(stock)}
                className="watchlist-card"
                style={{
                  background: selectedSymbol.symbol === stock.symbol ? '#2563eb' : '#fff',
                  border: selectedSymbol.symbol === stock.symbol ? '2px solid #2563eb' : '1px solid #e0e7ef',
                  borderRadius: 14,
                  padding: '18px 20px',
                  minWidth: 130,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: selectedSymbol.symbol === stock.symbol ? '0 4px 16px rgba(37,99,235,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
                  color: selectedSymbol.symbol === stock.symbol ? '#fff' : '#2563eb',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  outline: 'none',
                  marginBottom: 0,
                  marginTop: 0,
                  transition: 'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{stock.symbol}</span>
                <span style={{ fontSize: 13, color: selectedSymbol.symbol === stock.symbol ? '#fff' : '#888', marginBottom: 0 }}>{stock.name}</span>
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
