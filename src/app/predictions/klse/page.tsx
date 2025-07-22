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

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const API_URL = `${API_BASE_URL}/predict/v1`;
const API_V2_URL = `${API_BASE_URL}/predict/v2`;

export default function KLSEPredictionsPage() {
  const { selectedMarket, currentMarket, getMarketsForTheme } = useMarket();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [forecast, setForecast] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [historyPrices, setHistoryPrices] = useState<number[]>([]);
  const [historyDates, setHistoryDates] = useState<string[]>([]);
  const [forecastV2, setForecastV2] = useState<number[]>([]);
  const [datesV2, setDatesV2] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current market data - for KLSE, we'll use the KLSE market data
  const marketData = getMarketsForTheme(theme)['bursa'];
  
  // Get the first symbol from the KLSE market's watchlist as the default
  const currentSymbol = marketData?.watchlist?.[0]?.symbol || 'MYR';
  const currentDisplayName = marketData?.watchlist?.[0]?.name || 'Maybank (1155.KL)';
  const currentCurrency = 'MYR';

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

  useEffect(() => {
    setLoading(true);
    // Add symbol parameter to API calls
    const apiUrlWithSymbol = `${API_URL}?symbol=${currentSymbol}`;
    const apiV2UrlWithSymbol = `${API_V2_URL}?symbol=${currentSymbol}`;
    
    Promise.all([
      fetch(apiUrlWithSymbol).then(res => res.json()),
      fetch(apiV2UrlWithSymbol).then(res => res.json()),
    ])
      .then(([data1, data2]) => {
        // Log raw responses before any parsing
        console.log("RAW API v1 response:", data1);
        console.log("RAW API v2 response:", data2);
        // Parse v1
        let parsed1 = data1;
        if (typeof data1.Content === "string") {
          try {
            parsed1 = JSON.parse(data1.Content);
          } catch (e) {}
        }
        // Parse v2
        let parsed2 = data2;
        if (typeof data2.Content === "string") {
          try {
            parsed2 = JSON.parse(data2.Content);
          } catch (e) {}
        }
        setForecast(Array.isArray(parsed1.forecast) ? parsed1.forecast : []);
        setDates(Array.isArray(parsed1.dates) ? parsed1.dates : []);
        type HistoryPrice = [number, ...unknown[]]; // assuming first element is a number (e.g., price)
        const historyPricesRaw = parsed1.history_prices;

        if (Array.isArray(historyPricesRaw)) {
          if (Array.isArray(historyPricesRaw[0])) {
            // it's an array of arrays
            setHistoryPrices(
              (historyPricesRaw as HistoryPrice[]).map(([price]) => price)
            );
          } else {
            // it's already a flat array
            setHistoryPrices(historyPricesRaw as number[]);
          }
        }
        setHistoryDates(Array.isArray(parsed1.history_dates) ? parsed1.history_dates : []);
        setForecastV2(Array.isArray(parsed2.forecast) ? parsed2.forecast : []);
        setDatesV2(Array.isArray(parsed2.dates) ? parsed2.dates : []);
        setLoading(false);
        setError(null);
        // Debug: log the parsed API responses
        console.log("API v1:", parsed1);
        console.log("API v2:", parsed2);
      })
      .catch((err) => {
        setError("Failed to fetch predictions: " + err.message);
        setLoading(false);
      });
  }, [currentSymbol]); // Re-fetch when symbol changes

  // Only show chart if all arrays are valid and lengths match
  const hasChartData =
    historyPrices.length > 0 &&
    historyDates.length > 0 &&
    forecast.length > 0 &&
    dates.length > 0 &&
    historyPrices.length === historyDates.length &&
    forecast.length === dates.length;

  const chartData = React.useMemo(() => {
    if (!hasChartData) return { labels: [], datasets: [] };
    const labels = [...historyDates, ...dates];
    const datasets = [
      {
        label: `Actual Price (${currentCurrency})`,
        data: [...historyPrices, ...Array(dates.length).fill(NaN)],
        fill: false,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        hoverBorderWidth: 3,
        lineCap: "round",
        order: 1,
      },
      {
        label: `Original Model Prediction (${currentCurrency})`,
        data: [
          ...Array(historyPrices.length).fill(NaN),
          ...forecast
        ],
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        hoverBorderWidth: 3,
        lineCap: "round",
        order: 2,
      }
    ];
    // Only add advanced model if lengths match
    if (
      forecastV2.length > 0 &&
      datesV2.length === forecastV2.length &&
      forecastV2.length === dates.length
    ) {
      datasets.push({
        label: `Advanced Model Prediction (${currentCurrency})`,
        data: [
          ...Array(historyPrices.length).fill(NaN),
          ...forecastV2
        ],
        fill: false,
        borderColor: "#f59e42",
        backgroundColor: "#f59e42",
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        hoverBorderWidth: 3,
        lineCap: "round",
        order: 3,
      });
    }
    return { labels, datasets };
  }, [hasChartData, historyPrices, historyDates, forecast, dates, forecastV2, datesV2, currentCurrency]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: {
        display: true,
        text: `${currentDisplayName} 30-Day Price Forecast`,
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
            
          label: (context: TooltipItem<'line'>) =>
            `${currentCurrency} ${context.parsed.y.toFixed(2)}`
        },
        displayColors: false,
        padding: 12,
        caretSize: 8,
      },
      crosshair: false, // Chart.js v4+ has built-in hover line
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        title: { display: true, text: "Date", color: "#888", font: { size: 15 } },
        grid: { display: true, color: "#e5e7eb" },
        ticks: {
          color: "#888",
          maxTicksLimit: 10,
          autoSkip: true,
          font: { size: 13 },
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
        hoverRadius: 5,
      },
    },
    hover: {
      mode: "index" as const,
      intersect: false,
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.title}>{currentDisplayName} 30-Day Forecast</h1>
      {loading && <div style={pageStyles.loadingContainer}>Loading predictions...</div>}
      {error && <div style={pageStyles.errorContainer}>{error}</div>}
      {hasChartData && (
        <div style={pageStyles.chartContainer}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
