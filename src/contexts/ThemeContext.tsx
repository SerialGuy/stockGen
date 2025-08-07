"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update document class for global styling
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme colors
export const themes = {
  light: {
    // Background colors
    bg: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      gradient: 'linear-gradient(145deg, #f0f4f8, #d9e2f4)',
      sidebar: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      card: '#ffffff',
      chart: '#f7f8fa'
    },
    // Text colors
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      accent: '#2563eb',
      inverse: '#ffffff'
    },
    // Border colors
    border: {
      primary: '#e2e8f0',
      secondary: '#d1d5db',
      accent: '#3b82f6'
    },
    // Shadow colors
    shadow: {
      sm: '0 2px 8px rgba(0,0,0,0.08)',
      md: '0 4px 12px rgba(0,0,0,0.1)',
      lg: '0 6px 20px rgba(0,0,0,0.15)',
      accent: '0 4px 12px rgba(59,130,246,0.3)'
    }
  },
  dark: {
    // Background colors
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      gradient: 'linear-gradient(145deg, #0f172a, #1e293b, #334155)',
      sidebar: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      card: '#1e293b',
      chart: '#1e293b'
    },
    // Text colors
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      tertiary: '#cbd5e1',
      accent: '#60a5fa',
      inverse: '#0f172a'
    },
    // Border colors
    border: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#3b82f6'
    },
    // Shadow colors
    shadow: {
      sm: '0 2px 8px rgba(0,0,0,0.4)',
      md: '0 4px 16px rgba(0,0,0,0.5)',
      lg: '0 8px 32px rgba(0,0,0,0.6)',
      accent: '0 4px 16px rgba(96,165,250,0.4)'
    }
  }
};

export function getThemeColors(theme: Theme) {
  return themes[theme];
}
