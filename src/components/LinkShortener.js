import React, { useState, useEffect } from 'react';
import './LinkShortener.css';

const LinkShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    // Load saved links from localStorage
    const savedLinks = localStorage.getItem('shortenedLinks');
    if (savedLinks) {
      setShortenedLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    // Save links to localStorage
    localStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks));
  }, [shortenedLinks]);

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = () => {
    if (!originalUrl.trim()) {
      alert('Please enter a URL to shorten');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      alert('Please enter a valid URL (include http:// or https://)');
      return;
    }

    const shortCode = customAlias.trim() || generateShortCode();
    
    // Check if custom alias already exists
    if (shortenedLinks.some(link => link.shortCode === shortCode)) {
      alert('This alias is already taken. Please choose a different one.');
      return;
    }

    const newLink = {
      id: Date.now(),
      originalUrl: originalUrl.trim(),
      shortCode,
      shortUrl: `https://short.ly/${shortCode}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastClicked: null
    };

    setShortenedLinks([newLink, ...shortenedLinks]);
    setOriginalUrl('');
    setCustomAlias('');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteLink = (id) => {
    setShortenedLinks(shortenedLinks.filter(link => link.id !== id));
  };

  const simulateClick = (id) => {
    const link = shortenedLinks.find(l => l.id === id);
    if (link) {
      // Open the original URL in a new tab
      window.open(link.originalUrl, '_blank');

      // Update click count
      setShortenedLinks(shortenedLinks.map(l =>
        l.id === id
          ? {
              ...l,
              clicks: l.clicks + 1,
              lastClicked: new Date().toISOString()
            }
          : l
      ));
    }
  };

  const clearAllLinks = () => {
    if (window.confirm('Are you sure you want to delete all shortened links?')) {
      setShortenedLinks([]);
    }
  };

  const getTotalClicks = () => {
    return shortenedLinks.reduce((total, link) => total + link.clicks, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Invalid URL';
    }
  };

  return (
    <div className="link-shortener">
      {/* Header */}
      <div className="shortener-header">
        <div className="header-left">
          <h2>🔗 Link Shortener</h2>
          <div className="stats-badges">
            <span className="stat-badge">
              {shortenedLinks.length} Links
            </span>
            <span className="stat-badge">
              {getTotalClicks()} Clicks
            </span>
          </div>
        </div>
        <div className="header-actions">
          {shortenedLinks.length > 0 && (
            <button onClick={clearAllLinks} className="clear-all-btn">
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      <div className="shortener-content">
        {/* URL Shortener Form */}
        <div className="shortener-form">
          <h4>Shorten Your Link</h4>
          <div className="form-section">
            <div className="url-input-group">
              <label>Original URL</label>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="url-input"
              />
            </div>
            
            <div className="alias-input-group">
              <label>Custom Alias (Optional)</label>
              <div className="alias-input-container">
                <span className="domain-prefix">short.ly/</span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  placeholder="custom-name"
                  className="alias-input"
                  maxLength="20"
                />
              </div>
              <div className="alias-hint">
                Leave empty for auto-generated code
              </div>
            </div>

            <button 
              onClick={shortenUrl} 
              className="shorten-btn"
              disabled={!originalUrl.trim()}
            >
              ✂️ Shorten URL
            </button>
          </div>
        </div>

        {/* Shortened Links List */}
        {shortenedLinks.length > 0 && (
          <div className="links-section">
            <h4>Your Shortened Links</h4>
            <div className="links-list">
              {shortenedLinks.map((link) => (
                <div key={link.id} className="link-card">
                  <div className="link-header">
                    <div className="link-info">
                      <div className="original-url">
                        <span className="url-icon">🌐</span>
                        <span className="url-text" title={link.originalUrl}>
                          {getDomainFromUrl(link.originalUrl)}
                        </span>
                      </div>
                      <div className="short-url">
                        <span className="short-icon">🔗</span>
                        <span className="short-text">{link.shortUrl}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="delete-btn"
                      title="Delete link"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="link-actions">
                    <button
                      onClick={() => copyToClipboard(link.shortUrl)}
                      className={`copy-btn ${copied === link.shortUrl ? 'copied' : ''}`}
                    >
                      {copied === link.shortUrl ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(link.originalUrl)}
                      className="copy-original-btn"
                    >
                      📄 Copy Original
                    </button>
                    <button
                      onClick={() => simulateClick(link.id)}
                      className="visit-btn"
                    >
                      🔗 Visit
                    </button>
                  </div>

                  <div className="link-stats">
                    <div className="stat-item">
                      <span className="stat-label">Clicks:</span>
                      <span className="stat-value">{link.clicks}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Created:</span>
                      <span className="stat-value">{formatDate(link.createdAt)}</span>
                    </div>
                    {link.lastClicked && (
                      <div className="stat-item">
                        <span className="stat-label">Last Clicked:</span>
                        <span className="stat-value">{formatDate(link.lastClicked)}</span>
                      </div>
                    )}
                  </div>

                  <div className="full-url">
                    <span className="full-url-label">Full URL:</span>
                    <span className="full-url-text">{link.originalUrl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="features-section">
          <h4>Features</h4>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">✂️</span>
              <div className="feature-content">
                <h5>URL Shortening</h5>
                <p>Convert long URLs into short, manageable links</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div className="feature-content">
                <h5>Custom Aliases</h5>
                <p>Create memorable custom short links</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div className="feature-content">
                <h5>Click Tracking</h5>
                <p>Monitor how many times your links are clicked</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💾</span>
              <div className="feature-content">
                <h5>Local Storage</h5>
                <p>Your links are saved locally in your browser</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {shortenedLinks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>No shortened links yet</h3>
            <p>Create your first shortened link by entering a URL above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkShortener;
