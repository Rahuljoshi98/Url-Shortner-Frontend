'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllUrls } from '@/lib/api';
import UrlForm from '@/components/UrlForm';
import UrlCard from '@/components/UrlCard';
import EditModal from '@/components/EditModal';
import { showToast } from '@/components/Toast';

function SkeletonCard() {
  return (
    <div className="skeleton-card glass-card">
      <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: '35%', marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ height: 32, width: 90 }} />
        <div className="skeleton" style={{ height: 32, width: 70 }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  const [urls, setUrls]           = useState([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [editTarget, setEditTarget]   = useState(null);
  const [search, setSearch]       = useState('');

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchUrls = useCallback(async () => {
    setLoadingUrls(true);
    try {
      const res = await getAllUrls();
      setUrls(res.data.data || []);
    } catch {
      showToast('Failed to load URLs', 'error');
    } finally {
      setLoadingUrls(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchUrls();
  }, [isAuthenticated, fetchUrls]);

  const handleCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleDeleted = (id) => {
    setUrls((prev) => prev.filter((u) => u._id !== id));
  };

  const handleUpdated = (updated) => {
    setUrls((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
  };

  const filtered = urls.filter((u) =>
    u.originalUrl?.toLowerCase().includes(search.toLowerCase()) ||
    u.shortCode?.toLowerCase().includes(search.toLowerCase())
  );

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="dashboard">
      <div className="blob blob-1" />

      <div className="page-container dashboard-inner">
        {/* Header */}
        <div className="dash-header animate-fade-up">
          <div>
            <h1 className="dash-title">
              Your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="dash-sub">Welcome back, {user?.email}</p>
          </div>
          <button className="btn-secondary refresh-btn" onClick={fetchUrls} id="refresh-btn" title="Refresh">
            ↻ Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card glass-card">
            <span className="stat-icon">🔗</span>
            <div>
              <p className="stat-num gradient-text">{urls.length}</p>
              <p className="stat-lbl">Total Links</p>
            </div>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-icon">👆</span>
            <div>
              <p className="stat-num gradient-text">{totalClicks}</p>
              <p className="stat-lbl">Total Clicks</p>
            </div>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-icon">✅</span>
            <div>
              <p className="stat-num gradient-text">
                {urls.filter((u) => !u.expiresAt || new Date(u.expiresAt) > new Date()).length}
              </p>
              <p className="stat-lbl">Active Links</p>
            </div>
          </div>
        </div>

        {/* Create form */}
        <div className="form-section glass-card animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="section-head">⚡ Shorten a New URL</h2>
          <UrlForm onCreated={handleCreated} />
        </div>

        {/* URL list */}
        <div className="urls-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="urls-header">
            <h2 className="section-head">Your Links <span className="count-badge">{urls.length}</span></h2>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                id="search-urls"
                type="text"
                className="input-field search-input"
                placeholder="Search URLs or codes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loadingUrls ? (
            <div className="url-list">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state glass-card">
              <span className="empty-icon">{search ? '🔍' : '🔗'}</span>
              <p className="empty-title">{search ? 'No matching links found' : 'No links yet'}</p>
              <p className="empty-sub">
                {search ? 'Try a different search term.' : 'Use the form above to shorten your first URL!'}
              </p>
            </div>
          ) : (
            <div className="url-list">
              {filtered.map((url) => (
                <UrlCard
                  key={url._id}
                  url={url}
                  onDeleted={handleDeleted}
                  onEdit={setEditTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editTarget && (
        <EditModal
          url={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleUpdated}
        />
      )}

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding: 100px 0 60px;
          position: relative;
        }
        .blob {
          position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.07; pointer-events: none;
          width: 700px; height: 700px; background: var(--accent-1); top: -200px; right: -200px;
          animation: blob 15s infinite ease-in-out;
        }
        .dashboard-inner {
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: relative;
          z-index: 1;
        }

        /* header */
        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding-top: 12px;
        }
        .dash-title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -1px; }
        .dash-sub { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; }
        .refresh-btn { padding: 10px 20px; }

        /* stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          transition: var(--transition);
        }
        .stat-card:hover { border-color: var(--border-accent); transform: translateY(-2px); }
        .stat-icon { font-size: 2rem; }
        .stat-num { font-size: 2rem; font-weight: 800; }
        .stat-lbl { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

        /* form section */
        .form-section { padding: 28px 32px; }
        .section-head {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 18px;
          letter-spacing: -0.3px;
        }

        /* url list */
        .urls-section { display: flex; flex-direction: column; gap: 16px; }
        .urls-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .urls-header .section-head { margin-bottom: 0; }
        .count-badge {
          display: inline-block;
          padding: 2px 10px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-2);
          vertical-align: middle;
          margin-left: 8px;
        }
        .search-wrap { position: relative; }
        .search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 0.9rem; pointer-events: none;
        }
        .search-input { width: 260px; padding-left: 38px; height: 42px; font-size: 0.9rem; }
        .url-list { display: flex; flex-direction: column; gap: 14px; }

        /* skeleton */
        .skeleton-card { padding: 22px 24px; }

        /* empty */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
          gap: 10px;
        }
        .empty-icon { font-size: 3rem; }
        .empty-title { font-size: 1.1rem; font-weight: 600; }
        .empty-sub { color: var(--text-muted); font-size: 0.9rem; }

        @media (max-width: 700px) {
          .stats-row { grid-template-columns: 1fr; }
          .dash-header { flex-direction: column; }
          .search-input { width: 100%; }
          .urls-header { flex-direction: column; align-items: flex-start; }
          .form-section { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
