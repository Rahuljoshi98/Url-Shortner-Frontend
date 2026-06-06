'use client';

import { useState } from 'react';
import { createShortUrl } from '@/lib/api';
import { showToast } from './Toast';

export default function UrlForm({ onCreated }) {
  const [url, setUrl]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) { setError('Please enter a URL'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await createShortUrl({ originalUrl: url.trim() });
      showToast('Short URL created!', 'success');
      setUrl('');
      onCreated?.(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error?.explanations?.[0] || 'Failed to create short URL';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit} id="url-create-form">
      <div className="url-form-inner">
        <div className="input-wrapper">
          <span className="input-icon">🔗</span>
          <input
            id="url-input"
            type="url"
            className={`input-field url-input ${error ? 'error' : ''}`}
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
          />
        </div>
        <button type="submit" className="btn-primary shorten-btn" disabled={loading} id="shorten-btn">
          {loading ? (
            <span className="spinner" />
          ) : (
            <>⚡ Shorten</>
          )}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}

      <style jsx>{`
        .url-form {
          width: 100%;
        }
        .url-form-inner {
          display: flex;
          gap: 12px;
        }
        .input-wrapper {
          flex: 1;
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          pointer-events: none;
        }
        .url-input {
          padding-left: 44px;
          height: 52px;
          font-size: 0.95rem;
        }
        .shorten-btn {
          height: 52px;
          padding: 0 28px;
          font-size: 1rem;
          border-radius: var(--radius-md);
          white-space: nowrap;
        }
        .form-error {
          margin-top: 8px;
          font-size: 0.85rem;
          color: var(--error);
        }
        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .url-form-inner { flex-direction: column; }
          .shorten-btn { width: 100%; }
        }
      `}</style>
    </form>
  );
}
