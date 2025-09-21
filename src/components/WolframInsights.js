import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WolframInsights.css';

const WolframInsights = () => {
  const [query, setQuery] = useState('');
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentQueries, setRecentQueries] = useState([
    'harmful algal blooms in freshwater',
    'water quality parameters',
    'cyanobacteria toxicity',
    'safe drinking water pH levels'
  ]);
  const [showWolframOneInfo, setShowWolframOneInfo] = useState(true);
  const W_APP_ID = process.env.REACT_APP_WOLFRAM_APP_ID;

  const fetchWolframResults = async () => {
    if (!query.trim() || !W_APP_ID) {
      if (!W_APP_ID) {
        setError("Wolfram App ID is not configured. Please check your environment variables.");
      } else {
        setError("Please enter a query to get insights.");
      }
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const wolframUrl = `https://api.wolframalpha.com/v1/simple?appid=${W_APP_ID}&i=${encodeURIComponent(query)}&width=800&fontsize=16&background=white`;

      // Create a promise that resolves when image loads or rejects on error
      const imageLoadPromise = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = wolframUrl;

        img.onload = () => resolve(wolframUrl);
        img.onerror = () => reject(new Error('Image failed to load'));

        // Add timeout to prevent hanging
        setTimeout(() => reject(new Error('Request timeout')), 15000);
      });

      const result = await imageLoadPromise;
      setResultUrl(result);
      setShowWolframOneInfo(false);

      // Add to recent queries if not already present
      if (!recentQueries.includes(query)) {
        setRecentQueries(prev => [query, ...prev.slice(0, 3)]);
      }

      setLoading(false);

    } catch (err) {
      console.error('Wolfram API error:', err);
      if (err.message === 'Request timeout') {
        setError('Request timed out. The query may be too complex. Please try a simpler question.');
      } else {
        setError('Could not retrieve insight. The query may be too complex or not understood by Wolfram Alpha. Try rephrasing your question.');
      }
      setLoading(false);
    }
  };

  const handleRecentQueryClick = (recentQuery) => {
    setQuery(recentQuery);
    setShowWolframOneInfo(false);
    // Use setTimeout to ensure the query state is updated before fetching
    setTimeout(() => {
      fetchWolframResults();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      fetchWolframResults();
    }
  };

  const clearResults = () => {
    setResultUrl(null);
    setError(null);
    setQuery('');
    setShowWolframOneInfo(true);
  };

  return (
    <div className="wolfram-insights">
      <h2>🧠 AI-Powered Water Insights</h2>

      <div className="wolfram-search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about water quality, e.g., 'optimal pH for drinking water' or 'effects of nitrates in water'"
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button onClick={fetchWolframResults} disabled={loading || !query.trim()}>
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Analyzing...
            </>
          ) : (
            '🔍 Get Insight'
          )}
        </button>
      </div>

      <div className="recent-queries">
        <strong>💡 Try these sample queries:</strong>
        <div className="query-pills">
          {recentQueries.map((q, index) => (
            <span
              key={index}
              onClick={() => handleRecentQueryClick(q)}
              className="recent-query"
              title={`Click to search: ${q}`}
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="wolfram-error">
          <strong>⚠️ Error:</strong> {error}
          {resultUrl && (
            <button onClick={clearResults} className="clear-btn">
              Try Again
            </button>
          )}
        </div>
      )}

      {showWolframOneInfo && !loading && !resultUrl && (
        <div className="wolfram-info">
          <h3>🌊 Powered by Wolfram Alpha</h3>
          <p>
            Get instant computational insights about water quality, environmental science,
            and chemistry. Ask questions about pH levels, water treatment, pollutants,
            aquatic ecosystems, and more!
          </p>
          <div className="info-examples">
            <h4>Example questions you can ask:</h4>
            <ul>
              <li>"What is the ideal pH range for drinking water?"</li>
              <li>"Effects of high nitrate levels in groundwater"</li>
              <li>"Water temperature impact on dissolved oxygen"</li>
              <li>"Heavy metal contamination in water sources"</li>
            </ul>
          </div>
        </div>
      )}

      {loading && (
        <div className="wolfram-loading">
          <div className="spinner"></div>
          <p>🔄 Contacting Wolfram Alpha...</p>
          <small>This may take a few seconds for complex queries</small>
        </div>
      )}

      {resultUrl && (
        <div className="wolfram-results">
          <h3>📊 Insight for "{query}"</h3>
          <div className="result-image">
            <img
              src={resultUrl}
              alt={`Wolfram Alpha results for ${query}`}
              loading="lazy"
            />
          </div>
          <div className="result-actions">
            <button onClick={clearResults} className="new-search-btn">
              🔍 New Search
            </button>
            <p className="wolfram-attribution">
              Computed with Wolfram Alpha® |
              <a
                href={`https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Wolfram Alpha
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WolframInsights;
