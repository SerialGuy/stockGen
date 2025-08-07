/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { TooltipItem } from 'chart.js';
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

// Types for the Gold Trading API
interface HistoricalDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  volume: number;
  RSI: number;
  MACD: number;
  MACD_signal: number;
  MACD_diff: number;
  SMA_20: number;
  SMA_50: number;
  EMA_12: number;
  EMA_26: number;
  BB_upper: number;
  BB_lower: number;
  BB_middle: number;
  BB_width: number;
  ATR: number;
  is_prediction?: boolean;
  confidence?: number;
}

interface PredictionData {
  timestamp: string;
  current_price: number;
  predicted_change: number;
  predicted_price: number;
  multi_hour_predictions: Array<{
    hour_ahead: number;
    timestamp: string;
    predicted_change: number;
    cumulative_change: number;
    predicted_price: number;
    confidence_decay: number;
  }>;
  signal: string;
  signal_strength: string;
  confidence: number;
}

interface ApiResponse {
  data?: HistoricalDataPoint[];
  historical_count?: number;
  prediction_count?: number;
  total_records?: number;
  last_updated?: string;
  prediction_available?: boolean;
}

export default function ForexPredictionsPage() {
  const { selectedMarket, currentMarket, getMarketsForTheme, switchMarket } = useMarket();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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
      marginBottom: '2rem',
    },
    predictionDetails: {
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    predictionTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '1rem',
    },
    predictionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
    },
    predictionItem: {
      padding: '0.75rem',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
    },
    predictionLabel: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    predictionValue: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    signalContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    signalInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    signalLabel: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontWeight: 500,
    },
    signalValue: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    buySignal: {
      color: '#10b981',
    },
    sellSignal: {
      color: '#ef4444',
    },
    holdSignal: {
      color: '#f59e0b',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      padding: '1rem',
      background: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      textAlign: 'center' as const,
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '0.25rem',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#64748b',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap' as const,
      gap: '1rem',
    },
    refreshButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    lastUpdated: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontStyle: 'italic',
    },
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_GOLD_API_BASE_URL || 'http://localhost:8000';
    
    try {
      // Fetch data from multiple endpoints
      const [dataResponse, predictionResponse, statusResponse] = await Promise.all([
        // Get historical data with next hour prediction
        fetch(`${API_BASE_URL}/data?records=60`).then(res => {
          if (!res.ok) throw new Error(`Data API error: ${res.status}`);
          return res.json();
        }),
        // Get current prediction
        fetch(`${API_BASE_URL}/prediction`).then(res => {
          if (!res.ok) throw new Error(`Prediction API error: ${res.status}`);
          return res.json();
        }),
        // Get system status
        fetch(`${API_BASE_URL}/status`).then(res => {
          if (!res.ok) throw new Error(`Status API error: ${res.status}`);
          return res.json();
        })
      ]);

      console.log("Data API Response:", dataResponse);
      console.log("Prediction API Response:", predictionResponse);
      console.log("Status API Response:", statusResponse);

      // Set historical data
      if (dataResponse.data && Array.isArray(dataResponse.data)) {
        setHistoricalData(dataResponse.data);
      }

      // Set prediction data
      if (predictionResponse) {
        setPredictionData(predictionResponse);
      }

      // Set API status
      setApiStatus(statusResponse);

      // Set last updated timestamp
      setLastUpdated(new Date().toLocaleString());

      setLoading(false);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(`Failed to fetch data: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (historicalData.length === 0) return { labels: [], datasets: [] };

    const labels = historicalData.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });

    // Historical prices
    const historicalPrices = historicalData.map(item => item.close);
    
    // Bollinger Bands
    const bbUpper = historicalData.map(item => item.BB_upper);
    const bbLower = historicalData.map(item => item.BB_lower);
    const bbMiddle = historicalData.map(item => item.BB_middle);

    // Moving averages
    const sma20 = historicalData.map(item => item.SMA_20);
    const sma50 = historicalData.map(item => item.SMA_50);

    // RSI (scaled to price range for visualization)
    const priceRange = Math.max(...historicalPrices) - Math.min(...historicalPrices);
    const rsiScaled = historicalData.map(item => {
      const minPrice = Math.min(...historicalPrices);
      return minPrice + (item.RSI / 100) * priceRange;
    });

    // MACD
    const macd = historicalData.map(item => item.MACD);
    const macdSignal = historicalData.map(item => item.MACD_signal);

    const datasets = [
      {
        label: `Gold Price (${currentCurrency})`,
        data: historicalPrices,
        fill: false,
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
        hoverBorderWidth: 3,
        lineCap: "round" as const,
        order: 1,
      },
      {
        label: 'SMA 20',
        data: sma20,
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
        order: 2,
      },
      {
        label: 'SMA 50',
        data: sma50,
        fill: false,
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
        order: 3,
      },
      {
        label: 'Bollinger Upper',
        data: bbUpper,
        fill: false,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1,
        borderDash: [3, 3],
        order: 4,
      },
      {
        label: 'Bollinger Lower',
        data: bbLower,
        fill: false,
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1,
        borderDash: [3, 3],
        order: 5,
      }
    ];

    // Add prediction data if available
    if (predictionData && predictionData.multi_hour_predictions.length > 0) {
      const predictionLabels = predictionData.multi_hour_predictions.map(pred => {
        const date = new Date(pred.timestamp);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      });

      const predictionPrices = predictionData.multi_hour_predictions.map(pred => pred.predicted_price);

      datasets.push({
        label: `Prediction (${currentCurrency})`,
        data: [...Array(historicalPrices.length).fill(NaN), ...predictionPrices],
        fill: false,
        borderColor: "#ec4899",
        backgroundColor: "#ec4899",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
        borderDash: [8, 4],
        order: 6,
      });

      // Extend labels to include predictions
      labels.push(...predictionLabels);
    }

    return { labels, datasets };
  }, [historicalData, predictionData, currentCurrency]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: true, 
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: `${currentDisplayName} Price Chart with Predictions`,
        font: { size: 20 },
        color: "#222",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#fff",
        titleColor: "#2563eb",
        bodyColor: "#222",
        borderColor: "#2563eb",
        borderWidth: 1,
        titleFont: { weight: 700, size: 16 },
        bodyFont: { size: 15 },
        callbacks: {
          title: (items: TooltipItem<'line'>[]) =>
            items && items.length > 0 ? items[0].label : "",
            
          label: (context: TooltipItem<'line'>) => {
            const datasetLabel = context.dataset.label || '';
            if (datasetLabel.includes('Price') || datasetLabel.includes('Prediction')) {
              return `${datasetLabel}: ${currentCurrency} ${context.parsed.y.toFixed(2)}`;
            }
            return `${datasetLabel}: ${context.parsed.y.toFixed(2)}`;
          }
        },
        displayColors: true,
        padding: 12,
        caretSize: 8,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        title: { display: true, text: "Date & Time", color: "#888", font: { size: 15 } },
        grid: { display: true, color: "#e5e7eb" },
        ticks: {
          color: "#888",
          maxTicksLimit: 12,
          autoSkip: true,
          font: { size: 12 },
        },
      },
      y: {
        title: { display: true, text: `Price (${currentCurrency})`, color: "#888", font: { size: 15 } },
        grid: { display: true, color: "#e5e7eb" },
        ticks: {
          color: "#888",
          font: { size: 13 },
          callback: (value: string | number) => `${currentCurrency} ${Number(value).toFixed(2)}`,
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: "round" as const,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
    maintainAspectRatio: false,
  };

  // Get current price and signal info
  const currentPrice = historicalData.length > 0 ? historicalData[historicalData.length - 1]?.close : null;
  const signal = predictionData?.signal || 'HOLD';
  const signalStrength = predictionData?.signal_strength || 'NEUTRAL';
  const confidence = predictionData?.confidence || 0;

  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'BUY': return pageStyles.buySignal.color;
      case 'SELL': return pageStyles.sellSignal.color;
      default: return pageStyles.holdSignal.color;
    }
  };

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.headerContainer}>
        <h1 style={pageStyles.title}>{currentDisplayName} Trading Analysis</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button 
            style={pageStyles.refreshButton}
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
          </button>
          <button
            onClick={() => switchMarket('bursa')}
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
                ? '0 4px 16px rgba(96, 165, 250, 0.4)' 
                : '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>📈</span>
            <span>Switch to KLSE</span>
          </button>
          {lastUpdated && (
            <span style={pageStyles.lastUpdated}>
              Last updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>
      
      {loading && <div style={pageStyles.loadingContainer}>Loading market data and predictions...</div>}
      
      {error && <div style={pageStyles.errorContainer}>{error}</div>}
      
      {!loading && !error && (
        <>
          {/* Trading Signal Card */}
          <div style={pageStyles.signalContainer}>
            <div style={pageStyles.signalInfo}>
              <span style={pageStyles.signalLabel}>Trading Signal</span>
              <span style={{...pageStyles.signalValue, color: getSignalColor(signal)}}>
                {signal} ({signalStrength})
              </span>
            </div>
            <div style={pageStyles.signalInfo}>
              <span style={pageStyles.signalLabel}>Current Price</span>
              <span style={pageStyles.signalValue}>
                {currentPrice ? `${currentCurrency} ${currentPrice.toFixed(2)}` : 'N/A'}
              </span>
            </div>
            <div style={pageStyles.signalInfo}>
              <span style={pageStyles.signalLabel}>Confidence</span>
              <span style={pageStyles.signalValue}>
                {confidence ? `${(confidence * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={pageStyles.statsGrid}>
            <div style={pageStyles.statCard}>
              <div style={pageStyles.statValue}>
                {historicalData.length > 0 ? historicalData.length : 0}
              </div>
              <div style={pageStyles.statLabel}>Data Points</div>
            </div>
            <div style={pageStyles.statCard}>
              <div style={pageStyles.statValue}>
                {predictionData?.multi_hour_predictions?.length || 0}
              </div>
              <div style={pageStyles.statLabel}>Predictions</div>
            </div>
            <div style={pageStyles.statCard}>
              <div style={pageStyles.statValue}>
                {apiStatus?.system_status || 'Unknown'}
              </div>
              <div style={pageStyles.statLabel}>System Status</div>
            </div>
            <div style={pageStyles.statCard}>
              <div style={pageStyles.statValue}>
                {apiStatus?.model_loaded ? 'Loaded' : 'Not Loaded'}
              </div>
              <div style={pageStyles.statLabel}>ML Model</div>
            </div>
          </div>

          {/* Technical Indicators Grid */}
          {historicalData.length > 0 && (
            <div style={pageStyles.statsGrid}>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statValue}>
                  {historicalData[historicalData.length - 1]?.RSI?.toFixed(1) || 'N/A'}
                </div>
                <div style={pageStyles.statLabel}>RSI</div>
              </div>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statValue}>
                  {historicalData[historicalData.length - 1]?.MACD?.toFixed(2) || 'N/A'}
                </div>
                <div style={pageStyles.statLabel}>MACD</div>
              </div>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statValue}>
                  {historicalData[historicalData.length - 1]?.BB_width?.toFixed(3) || 'N/A'}
                </div>
                <div style={pageStyles.statLabel}>BB Width</div>
              </div>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statValue}>
                  {historicalData[historicalData.length - 1]?.ATR?.toFixed(1) || 'N/A'}
                </div>
                <div style={pageStyles.statLabel}>ATR</div>
              </div>
            </div>
          )}

          {/* Prediction Details */}
          {predictionData && predictionData.multi_hour_predictions.length > 0 && (
            <div style={pageStyles.predictionDetails}>
              <h3 style={pageStyles.predictionTitle}>Multi-Hour Predictions</h3>
              <div style={pageStyles.predictionGrid}>
                {predictionData.multi_hour_predictions.slice(0, 6).map((pred, index) => (
                  <div key={index} style={pageStyles.predictionItem}>
                    <div style={pageStyles.predictionLabel}>
                      {pred.hour_ahead === 1 ? '1 Hour' : `${pred.hour_ahead} Hours`} Ahead
                    </div>
                    <div style={pageStyles.predictionValue}>
                      {currentCurrency} {pred.predicted_price.toFixed(2)}
                    </div>
                    <div style={{...pageStyles.predictionLabel, marginTop: '0.25rem'}}>
                      Change: {pred.predicted_change > 0 ? '+' : ''}{pred.predicted_change.toFixed(2)}%
                    </div>
                    <div style={{...pageStyles.predictionLabel, fontSize: '0.7rem'}}>
                      Confidence: {(pred.confidence_decay * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          {chartData.labels.length > 0 && (
            <div style={pageStyles.chartContainer}>
          <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
