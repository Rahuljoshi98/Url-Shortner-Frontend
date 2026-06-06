'use client';

import { useState, useEffect } from 'react';
import { updateUrl } from '@/lib/api';
import { showToast } from './Toast';

export default function EditModal({ url, onClose, onUpdated }) {
  const [originalUrl, setOriginalUrl] = useState(url?.originalUrl || '');
  const [shortCode, setShortCode]     = useState(url?.shortCode || '');
  const [expiresAt, setExpiresAt]     = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (url) {
      setOriginalUrl(url.originalUrl || '');
      setShortCode(url.shortCode || '');
      setExpiresAt(url.expiresAt ? url.expiresAt.slice(0, 10) : '');
    }
  }, [url]);

  if (!url) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) { setError('Original URL is required'); return; }
    if (!shortCode.trim()) { setError('Short Code is required'); return; }
    
    setError('');
    setLoading(true);
    try {
      const payload = { 
        originalUrl: originalUrl.trim(),
        shortCode: shortCode.trim()
      };
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();
      const res = await updateUrl(url._id, payload);
      showToast('URL updated successfully!', 'success');
      onUpdated?.(res.data.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error?.explanation?.[0] || err.response?.data?.message || 'Update failed';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="edit-modal-overlay">
      <div className="modal-box glass-card animate-scale-in" onClick={(e) => e.stopPropagation()} id="edit-modal">
        <div className="modal-header">
          <h2>Edit Short URL</h2>
          <button className="close-btn" onClick={onClose} id="modal-close-btn">✕</button>
        </div>

        <div className="modal-info">
          <p className="modal-clicks">👆 Clicks: <strong>{url.clicks}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-short-code">Short Code</label>
            <input
              id="edit-short-code"
              type="text"
              className={`input-field ${error && error.includes('Code') ? 'error' : ''}`}
              value={shortCode}
              onChange={(e) => { setShortCode(e.target.value); setError(''); }}
              placeholder="e.g. my-custom-link"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-original-url">Original URL</label>
            <input
              id="edit-original-url"
              type="url"
              className={`input-field ${error && error.includes('URL') ? 'error' : ''}`}
              value={originalUrl}
              onChange={(e) => { setOriginalUrl(e.target.value); setError(''); }}
              placeholder="https://example.com/very-long-url"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-expires">Expiry Date <span className="optional">(optional)</span></label>
            <input
              id="edit-expires"
              type="date"
              className="input-field date-input"
              value={expiresAt}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} id="cancel-edit-btn">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} id="save-edit-btn">
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        .modal-box {
          width: 100%;
          max-width: 480px;
          padding: 32px;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .modal-header h2 {
          font-size: 1.3rem;
          font-weight: 700;
        }
        .close-btn {
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          padding: 6px 10px;
          cursor: pointer;
          transition: var(--transition);
        }
        .close-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.08);
        }
        .modal-info {
          display: flex;
          gap: 20px;
          padding: 12px 16px;
          background: var(--bg-glass);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
          margin-bottom: 24px;
        }
        .modal-code, .modal-clicks {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .modal-code strong, .modal-clicks strong {
          color: var(--text-primary);
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .optional {
          color: var(--text-muted);
          font-weight: 400;
        }
        .date-input {
          color-scheme: dark;
        }
        .form-error {
          font-size: 0.85rem;
          color: var(--error);
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
