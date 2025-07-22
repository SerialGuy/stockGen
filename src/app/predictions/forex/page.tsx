/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMarket } from "../../../contexts/MarketContext";
import { useTheme, getThemeColors } from "../../../contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ForexPredictionsPage() {
  const { selectedMarket, currentMarket, getMarketsForTheme } = useMarket();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [forecast, setForecast] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [historyPrices, setHistoryPrices] = useState<number[]>([]);
  const [historyDates, setHistoryDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current market data - for Forex, we'll use the Forex market data
  const marketData = getMarketsForTheme(theme)['forex'];
  
  // Get the first symbol from the Forex market's watchlist (Gold/USD)
  const currentSymbol = marketData?.watchlist?.[0]?.symbol || 'XAU/USD';
  const currentDisplayName = marketData?.watchlist?.[0]?.name || 'Gold/US Dollar';
  const currentCurrency = 'USD';

  const pageStyles = {
    container: {
      maxWidth: 1200,
      width: '100%',
      margin: '32px auto',
      padding: '32px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
    },
    title: {
      textAlign: 'center' as const,
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '2rem',
      letterSpacing: '-0.025em',
    },
    loadingContainer: {
      textAlign: 'center' as const,
      padding: '3rem',
      color: '#64748b',
      fontSize: '1.1rem',
    },
    errorContainer: {
      color: '#ef4444',
      textAlign: 'center' as const,
      padding: '2rem',
      background: '#fef2f2',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      fontSize: '1.1rem',
    },
    chartContainer: {
      height: 480,
      padding: '1rem',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
  };

  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.title}>{currentDisplayName} 30-Day Forecast</h1>
      {loading && <div style={pageStyles.loadingContainer}>Loading predictions...</div>}
      {error && <div style={pageStyles.errorContainer}>{error}</div>}
      {/* Mock-up chart demo here */}
      {/* <div style={pageStyles.chartContainer}>
          <Line data={chartData} options={chartOptions} />
       </div> */}
    </div>
  );
}
