"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Helper function to generate TradingView URL with theme support
function generateTradingViewUrl(symbol: string, theme: 'light' | 'dark'): string {
  const themeParam = theme === 'dark' ? 'Dark' : 'Light';
  const toolbarBg = theme === 'dark' ? '1e293b' : 'F1F3F6';
  
  return `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${symbol}&interval=D&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=${toolbarBg}&studies=[]&hideideas=1&theme=${themeParam}&style=1&timezone=Etc%2FUTC&withdateranges=1&hidemarks=1&hidetoptoolbar=1&hidesidetoolbar=1&locale=en`;
}

// Market data configuration
const getMarkets = (theme: 'light' | 'dark' = 'light') => ({
  bursa: {
    name: 'Bursa Malaysia',
    displayName: 'KLSE Dashboard',
    description: 'Live Malaysian Market Charts & Watchlist',
    searchPlaceholder: 'Search Bursa Malaysia...',
    watchlist: [
      { symbol: 'FBMKLCI', name: 'KLSE Index', url: 'https://www.klsescreener.com/v2/stocks/view/0200I/', embeddable: true },
      { symbol: 'SET', name: 'SETIA RESOURCES', url: 'https://www.klsescreener.com/v2/stocks/view/0337/', embeddable: true },
      { symbol: 'WCT', name: 'WCT HOLDINGS', url: 'https://www.klsescreener.com/v2/stocks/view/9679/', embeddable: true },
      { symbol: 'IGBREIT', name: 'IGB REIT', url: 'https://www.klsescreener.com/v2/stocks/view/5227/', embeddable: true },
      { symbol: 'UNIQUE', name: 'UNIQUE FIRE', url: 'https://www.klsescreener.com/v2/stocks/view/0257/', embeddable: true },
      { symbol: 'KENERGY', name: 'KUMPULAN ENERGI', url: 'https://www.klsescreener.com/v2/stocks/view/0307/', embeddable: true },
      { symbol: 'BPURI', name: 'BINA PURI', url: 'https://www.klsescreener.com/v2/stocks/view/5932/', embeddable: true },
      { symbol: 'PEOPLE', name: 'PEOPLELOGY BERHAD', url: 'https://www.klsescreener.com/v2/stocks/view/0356/', embeddable: true },
      { symbol: 'E&O', name: 'EASTERN & ORIENTAL', url: 'https://www.klsescreener.com/v2/stocks/view/3417/', embeddable: true },
      { symbol: 'NE', name: 'NE TECH', url: 'https://www.klsescreener.com/v2/stocks/view/03013/', embeddable: true },
      { symbol: 'MYR', name: 'Malayan Banking Berhad ', url: 'https://finance.yahoo.com/view/1155.KL/', embeddable: true },
    ]
  },
  forex: {
    name: 'Forex',
    displayName: 'Forex Dashboard',
    description: 'Live Foreign Exchange Market Charts & Pairs',
    searchPlaceholder: 'Search Forex pairs...',
    watchlist: [
      { symbol: 'XAU/USD', name: 'GOLD/ US Dollar', url: generateTradingViewUrl('XAUUSD', theme), embeddable: true },
      { symbol: 'GBP/USD', name: 'British Pound / US Dollar', url: generateTradingViewUrl('FX%3AGBPUSD', theme), embeddable: true },
      { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', url: generateTradingViewUrl('FX%3AUSDJPY', theme), embeddable: true },
      { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', url: generateTradingViewUrl('FX%3AUSDCHF', theme), embeddable: true },
      { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', url: generateTradingViewUrl('FX%3AAUDUSD', theme), embeddable: true },
      { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', url: generateTradingViewUrl('FX%3AUSDCAD', theme), embeddable: true },
      { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', url: generateTradingViewUrl('FX%3ANZDUSD', theme), embeddable: true },
      { symbol: 'EUR/GBP', name: 'Euro / British Pound', url: generateTradingViewUrl('FX%3AEURGBP', theme), embeddable: true },
      { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', url: generateTradingViewUrl('FX%3AEURJPY', theme), embeddable: true },
      { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', url: generateTradingViewUrl('FX%3AGBPJPY', theme), embeddable: true },
    ]
  }
});

type MarketKey = keyof ReturnType<typeof getMarkets>;

interface MarketContextType {
  selectedMarket: MarketKey;
  currentMarket: ReturnType<typeof getMarkets>[MarketKey];
  switchMarket: (market: MarketKey) => void;
  getMarketsForTheme: (theme: 'light' | 'dark') => ReturnType<typeof getMarkets>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>('bursa');
  
  // Default to light theme for initial load
  const markets = getMarkets('light');
  const currentMarket = markets[selectedMarket];

  const switchMarket = (market: MarketKey) => {
    setSelectedMarket(market);
  };

  const getMarketsForTheme = (theme: 'light' | 'dark') => {
    return getMarkets(theme);
  };

  return (
    <MarketContext.Provider value={{
      selectedMarket,
      currentMarket,
      switchMarket,
      getMarketsForTheme
    }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
