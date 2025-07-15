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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:8000/predict";
const API_V2_URL = "http://localhost:8001/predict";

export default function PredictionsPage() {
  const [forecast, setForecast] = useState<number[] | null>(null);
  const [dates, setDates] = useState<string[] | null>(null);
  const [historyPrices, setHistoryPrices] = useState<number[] | null>(null);
  const [historyDates, setHistoryDates] = useState<string[] | null>(null);
  const [forecastV2, setForecastV2] = useState<number[] | null>(null);
  const [datesV2, setDatesV2] = useState<string[] | null>(null);
  const [historyPricesV2, setHistoryPricesV2] = useState<number[] | null>(null);
  const [historyDatesV2, setHistoryDatesV2] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(API_URL)
        .then((res) => {
          if (!res.ok) throw new Error("API error");
          return res.json();
        })
        .then((data) => {
          let parsed = data;
          if (data && typeof data.Content === 'string') {
            try {
              parsed = JSON.parse(data.Content);
            } catch {}
          }
          setForecast(parsed.forecast);
          setDates(parsed.dates);
          if (Array.isArray(parsed.history_prices) && Array.isArray(parsed.history_prices[0])) {
            setHistoryPrices(parsed.history_prices.map((v: any) => v[0]));
          } else {
            setHistoryPrices(parsed.history_prices);
          }
          setHistoryDates(parsed.history_dates);
        }),
      fetch(API_V2_URL)
        .then((res) => {
          if (!res.ok) throw new Error("API v2 error");
          return res.json();
        })
        .then((data) => {
          let parsed = data;
          if (data && typeof data.Content === 'string') {
            try {
              parsed = JSON.parse(data.Content);
            } catch {}
          }
          setForecastV2(parsed.forecast);
          setDatesV2(parsed.dates);
          setHistoryPricesV2(parsed.history_prices);
          setHistoryDatesV2(parsed.history_dates);
        })
    ])
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasChartData =
    Array.isArray(historyPrices) &&
    Array.isArray(historyDates) &&
    Array.isArray(forecast) &&
    Array.isArray(dates) &&
    historyPrices.length === historyDates.length &&
    forecast.length === dates.length &&
    historyPrices.length > 0 &&
    forecast.length > 0 &&
    historyPrices.some((v) => typeof v === 'number') &&
    forecast.some((v) => typeof v === 'number');

  const chartData = React.useMemo(() => {
    if (hasChartData) {
      const datasets = [
        {
          label: "Actual Price (MYR)",
          data: historyPrices.concat(Array(dates.length).fill(null)),
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
          label: "Original Model Prediction (MYR)",
          data: Array(historyPrices.length).fill(null).concat(forecast),
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
      if (forecastV2 && forecastV2.length > 0 && datesV2 && datesV2.length === forecastV2.length) {
        // Align advanced model forecast with its own dates
        datasets.push({
          label: "Advanced Model Prediction (MYR)",
          data: Array(historyPrices.length).fill(null).concat(
            dates.map((d, i) => {
              const v2Idx = datesV2.indexOf(d);
              return v2Idx !== -1 ? forecastV2[v2Idx] : null;
            })
          ),
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
      return {
        labels: [...historyDates, ...dates],
        datasets
      };
    }
    return { labels: [], datasets: [] };
  }, [hasChartData, historyPrices, historyDates, forecast, dates, forecastV2, datesV2]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: {
        display: true,
        text: "Maybank (1155.KL) 30-Day Price Forecast",
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
          title: (items: any) => (items && items[0] ? items[0].label : ""),
          label: (context: any) => `MYR ${context.parsed.y.toFixed(2)}`,
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
        title: { display: true, text: "Price (MYR)", color: "#888", font: { size: 15 } },
        grid: { display: true, color: "#e5e7eb" },
        ticks: {
          color: "#888",
          font: { size: 13 },
          callback: (value: string | number) => `MYR ${Number(value).toFixed(2)}`,
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
    <div style={{ maxWidth: 1200, width: '100%', margin: "40px auto", padding: 24, background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #0001" }}>
      <h1 style={{ textAlign: "center", color: "#2563eb", marginBottom: 32 }}>Maybank (1155.KL) 30-Day Forecast</h1>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: 'red', textAlign: "center" }}>{error}</p>}
      {hasChartData && (
        <div style={{ height: 400 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: "#222", marginBottom: 8 }}>Forecast Table</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Date</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Predicted Price (MYR)</th>
              </tr>
            </thead>
            <tbody>
              {forecast && dates && forecast.map((value, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 8, border: "1px solid #eee", textAlign: "center" }}>{dates[idx]}</td>
                  <td style={{ padding: 8, border: "1px solid #eee", textAlign: "center" }}>{value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 