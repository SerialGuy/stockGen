"use client";
import React, { useEffect, useRef, useCallback } from 'react';


interface TradingViewChartProps {
  symbol: string;
  name: string;
  height?: number;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    TradingView: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol, name, height = 500 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const createWidget = useCallback(() => {
    if (containerRef.current && window.TradingView) {
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        gridColor: 'rgba(240, 243, 250, 1)',
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
        calendar: false,
        hide_volume: true,
        support_host: 'https://www.tradingview.com',
        container_id: containerRef.current.id
      });
    }
  }, [symbol]);

  useEffect(() => {
    // Clean up previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        gridColor: 'rgba(240, 243, 250, 1)',
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
        calendar: false,
        hide_volume: true,
        support_host: 'https://www.tradingview.com'
      });

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }
    } else {
      // Create widget directly if TradingView is already loaded
      createWidget();
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [symbol, createWidget]);

  const containerId = `tradingview-widget-${symbol.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;

  return (
    <div
      ref={containerRef}
      id={containerId}
      style={{ 
        width: '100%', 
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e0e7ef',
        background: '#f7f8fa'
      }}
    >
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        Loading {name} chart...
      </div>
    </div>
  );
};

export default TradingViewChart;
