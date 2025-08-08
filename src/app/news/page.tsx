"use client";
import React, { useEffect, useState } from "react";
import { useTheme, getThemeColors } from "../../contexts/ThemeContext";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category?: string;
  sentiment?: string;
}

interface GoogleSheetsCell {
  v: string;
}

interface GoogleSheetsRow {
  c: GoogleSheetsCell[];
}

interface GoogleSheetsTable {
  rows: GoogleSheetsRow[];
}

interface GoogleSheetsResponse {
  table: GoogleSheetsTable;
}

export default function NewsPage() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

    // Fetch news from Google Sheets with fallback
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Google Sheets first
        try {
          const sheetId = '1vRD6zDwY_p-Hhqq8g2chiigNgonlXe8umIN3vpnmzcc';
          const sheetName = 'n8n-newsfeed';
          const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const text = await response.text();
          
          // Parse the Google Sheets response
          const jsonText = text.substring(47).slice(0, -2); // Remove Google's wrapper
          const data: GoogleSheetsResponse = JSON.parse(jsonText);
          
          if (data.table && data.table.rows) {
            const newsItems: NewsItem[] = data.table.rows
              .slice(1) // Skip header row
              .map((row: GoogleSheetsRow, index: number) => {
                const cells = row.c || [];
                return {
                  id: `news-${index}`,
                  title: cells[0]?.v || '',
                  description: cells[3]?.v || '',
                  url: cells[1]?.v || '',
                  publishedAt: cells[2]?.v || '',
                  source: 'Gold News',
                };
              })
              .filter((item: NewsItem) => item.title && item.description) // Filter out empty items
              .sort((a: NewsItem, b: NewsItem) => {
                // Sort by publication date in descending order (newest first)
                const dateA = new Date(a.publishedAt);
                const dateB = new Date(b.publishedAt);
                return dateB.getTime() - dateA.getTime();
              });
            
            setNews(newsItems);
            return; // Success, exit early
          }
        } catch (sheetsError) {
          console.warn('Google Sheets fetch failed, using fallback data:', sheetsError);
        }
        
        // Fallback: Use mock data if Google Sheets fails
        const fallbackNews: NewsItem[] = [
          {
            id: 'fallback-1',
            title: 'Gold Prices Surge Amid Economic Uncertainty',
            description: 'Gold prices have reached new highs as investors seek safe-haven assets during global economic uncertainty. The precious metal continues to show strong performance.',
            url: 'https://example.com/gold-prices-surge',
            publishedAt: new Date().toISOString(),
            source: 'Gold News',
          },
          {
            id: 'fallback-2',
            title: 'Central Banks Increase Gold Reserves',
            description: 'Major central banks around the world are increasing their gold reserves as part of their diversification strategy and risk management approach.',
            url: 'https://example.com/central-banks-gold',
            publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            source: 'Gold News',
          },
          {
            id: 'fallback-3',
            title: 'Gold Mining Stocks Show Strong Performance',
            description: 'Gold mining companies are experiencing significant growth as gold prices continue to rise, creating opportunities for investors in the sector.',
            url: 'https://example.com/gold-mining-stocks',
            publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            source: 'Gold News',
          },
          {
            id: 'fallback-4',
            title: 'Technical Analysis: Gold Support Levels',
            description: 'Technical analysts are identifying key support levels for gold prices, suggesting potential entry points for traders and investors.',
            url: 'https://example.com/gold-technical-analysis',
            publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            source: 'Gold News',
          },
          {
            id: 'fallback-5',
            title: 'Gold ETFs See Record Inflows',
            description: 'Gold exchange-traded funds are experiencing record inflows as retail and institutional investors increase their exposure to the precious metal.',
            url: 'https://example.com/gold-etfs-inflows',
            publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            source: 'Gold News',
          },
        ];
        
        setNews(fallbackNews);
        
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on search and category
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories (now just XAUUSD)
  const categories = ['all', 'XAUUSD'];

  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.bg.gradient,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      padding: '24px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent' as const,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '1.125rem',
      color: colors.text.secondary,
      marginBottom: '24px',
    },
    controls: {
      display: 'flex',
      gap: '16px',
      marginBottom: '32px',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchInput: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: `1px solid ${colors.border.primary}`,
      background: colors.bg.card,
      color: colors.text.primary,
      fontSize: '1rem',
      minWidth: '300px',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    categorySelect: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: `1px solid ${colors.border.primary}`,
      background: colors.bg.card,
      color: colors.text.primary,
      fontSize: '1rem',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    newsList: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    newsCard: {
      background: colors.bg.card,
      borderRadius: '16px',
      border: `1px solid ${colors.border.primary}`,
      boxShadow: colors.shadow.md,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row' as const,
      minHeight: '160px',
      width: '100%',
    },
    newsImage: {
      width: '200px',
      minWidth: '200px',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)' 
        : 'linear-gradient(135deg, #f59e0b, #d97706)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '3rem',
      fontWeight: 700,
      boxShadow: theme === 'dark' 
        ? '0 4px 16px rgba(251, 191, 36, 0.3)' 
        : 'none',
    },
    newsContent: {
      padding: '24px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
    },
    newsTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.text.primary,
      marginBottom: '12px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    },
    newsDescription: {
      fontSize: '0.95rem',
      color: colors.text.secondary,
      lineHeight: '1.6',
      marginBottom: '16px',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
      flex: 1,
    },
    newsMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: colors.text.tertiary,
    },
    newsSource: {
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)' 
        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: '#ffffff',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 600,
      boxShadow: theme === 'dark' 
        ? '0 2px 8px rgba(96, 165, 250, 0.3)' 
        : 'none',
    },
    newsDate: {
      fontSize: '0.875rem',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: colors.text.secondary,
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: `4px solid ${colors.border.secondary}`,
      borderTop: `4px solid ${colors.text.accent}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px',
    },
    errorContainer: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: '#ef4444',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.text.secondary,
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '32px',
      flexWrap: 'wrap' as const,
    },
    statCard: {
      background: colors.bg.card,
      padding: '16px 24px',
      borderRadius: '12px',
      border: `1px solid ${colors.border.primary}`,
      textAlign: 'center' as const,
      minWidth: '120px',
    },
    statNumber: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: colors.text.accent,
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: colors.text.secondary,
    },
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle different date formats
      let date: Date;
      
      // Try parsing as ISO string first
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else {
        // Try parsing as different formats
        const parsed = Date.parse(dateString);
        if (!isNaN(parsed)) {
          date = new Date(parsed);
        } else {
          // If all else fails, return the original string
          return dateString;
        }
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div style={styles.container}>
             <div style={styles.header}>
         <h1 style={styles.title}>Gold Market News</h1>
         <p style={styles.subtitle}>Stay updated with the latest XAUUSD news and market insights</p>
         {news.length > 0 && news[0]?.id?.startsWith('fallback') && (
           <div style={{
             background: 'rgba(251, 191, 36, 0.1)',
             border: '1px solid rgba(251, 191, 36, 0.3)',
             borderRadius: '8px',
             padding: '8px 16px',
             marginTop: '16px',
             fontSize: '0.875rem',
             color: '#92400e',
             display: 'inline-block',
           }}>
             📡 Showing sample data - Live feed temporarily unavailable
           </div>
         )}
       </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{news.length}</div>
          <div style={styles.statLabel}>Total Articles</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{filteredNews.length}</div>
          <div style={styles.statLabel}>Filtered Results</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>XAUUSD</div>
          <div style={styles.statLabel}>Category</div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search gold news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.categorySelect}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All News' : category}
            </option>
          ))}
        </select>
      </div>

      {/* News List */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner} />
          <p>Loading latest gold news...</p>
        </div>
             ) : error ? (
         <div style={styles.errorContainer}>
           <p>{error}</p>
           <p style={{ marginTop: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
             Showing sample gold market news. Live news feed will be available when connection is restored.
           </p>
         </div>
      ) : filteredNews.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No gold news articles found matching your criteria.</p>
        </div>
      ) : (
        <div style={styles.newsList}>
          {filteredNews.map((item) => (
            <div
              key={item.id}
              style={styles.newsCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = colors.shadow.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = colors.shadow.md;
              }}
              onClick={() => window.open(item.url, '_blank')}
            >
              <div style={styles.newsImage}>
                🥇
              </div>
              <div style={styles.newsContent}>
                <div>
                  <h3 style={styles.newsTitle}>{item.title}</h3>
                  <p style={styles.newsDescription}>{item.description}</p>
                </div>
                <div style={styles.newsMeta}>
                  <span style={styles.newsSource}>{item.source}</span>
                  <span style={styles.newsDate}>{formatDate(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .news-card {
            flex-direction: column !important;
          }
          
          .news-image {
            width: 100% !important;
            min-width: auto !important;
            height: 120px !important;
          }
          
          .controls {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .search-input {
            min-width: auto !important;
          }
          
          .stats-container {
            gap: 16px !important;
          }
          
          .stat-card {
            min-width: 100px !important;
            padding: 12px 16px !important;
          }
        }
      `}</style>
    </div>
  );
} 