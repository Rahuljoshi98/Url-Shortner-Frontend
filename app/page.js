'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createShortUrl } from '@/lib/api';
import { showToast } from '@/components/Toast';

const FEATURES = [
  { icon: '⚡', title: 'Instant Shortening', desc: 'Get a short link in under a second. No friction, no fuss.' },
  { icon: '📊', title: 'Click Analytics', desc: 'Track every click on your links with real-time counters.' },
  { icon: '🔐', title: 'Secure & Private', desc: 'JWT-authenticated links tied to your account only.' },
  { icon: '✏️', title: 'Edit Anytime', desc: 'Update the destination URL without changing the short link.' },
  { icon: '⏱', title: 'Link Expiry', desc: 'Set an expiry date so links automatically stop working.' },
  { icon: '🗑', title: 'Full Control', desc: 'Delete links whenever you want. Your data, your rules.' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await createShortUrl({ originalUrl: url.trim() });
      setResult(res.data.data);
      showToast('Short URL created!', 'success');
    } catch (err) {
      const msg = err.response?.data?.error?.explanations?.[0] || 'Failed to shorten URL';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const shortLink = result ? `http://localhost:3000/api/v1/url/code/${result.shortCode}` : '';

  return (
    <main className="landing">
      {/* Animated bg blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Hero */}
      <section className="hero">
        <div className="page-container hero-inner">
          <div className="hero-badge animate-fade-up">
            <span>🚀</span> The smartest way to share links
          </div>
          <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Shorten. Share.<br />
            <span className="gradient-text">Track Everything.</span>
          </h1>
          <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Create short, powerful links in seconds. Monitor clicks, set expiry dates,
            and manage all your URLs from one beautiful dashboard.
          </p>

          {/* Inline shortener */}
          <div className="hero-form glass-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleShorten} className="hero-form-inner">
              <div className="hero-input-wrap">
                <span className="hero-input-icon">🔗</span>
                <input
                  id="hero-url-input"
                  type="url"
                  className="input-field hero-input"
                  placeholder="https://your-very-long-url.com/path?query=example"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setResult(null); }}
                />
              </div>
              <button type="submit" className="btn-primary hero-btn" disabled={loading} id="hero-shorten-btn">
                {loading ? <span className="spinner" /> : '⚡ Shorten URL'}
              </button>
            </form>

            {result && (
              <div className="hero-result animate-slide-down">
                <span className="result-label">Your short link:</span>
                <a href={shortLink} target="_blank" rel="noopener noreferrer" className="result-link gradient-text">
                  {shortLink}
                </a>
                <button
                  className="copy-pill"
                  onClick={() => { navigator.clipboard.writeText(shortLink); showToast('Copied!', 'success'); }}
                  id="hero-copy-btn"
                >
                  ⎘ Copy
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <p className="login-hint">
                <Link href="/login" className="login-link">Log in</Link> to start shortening URLs and track your links.
              </p>
            )}
          </div>

          <div className="hero-cta animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary" id="go-dashboard-btn">
                📊 Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary" id="hero-register-btn">
                  Get Started Free
                </Link>
                <Link href="/login" className="btn-secondary" id="hero-login-btn">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="page-container">
          <h2 className="section-title">Everything you need to manage links</h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feature-card glass-card animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="page-container cta-inner">
          <h2>Ready to supercharge your links?</h2>
          <p>Join thousands of users and start shortening URLs for free today.</p>
          <Link href="/register" className="btn-primary cta-btn" id="cta-register-btn">
            Create Free Account →
          </Link>
        </div>
      </section>

      <style jsx>{`
        .landing {
          position: relative;
          overflow: hidden;
        }
        /* blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          pointer-events: none;
          animation: blob 12s infinite ease-in-out;
        }
        .blob-1 { width: 600px; height: 600px; background: #7c3aed; top: -200px; left: -200px; }
        .blob-2 { width: 500px; height: 500px; background: #ec4899; top: 50%; right: -150px; animation-delay: -4s; }
        .blob-3 { width: 400px; height: 400px; background: #a855f7; bottom: -100px; left: 30%; animation-delay: -8s; }

        /* hero */
        .hero { padding: 160px 0 100px; }
        .hero-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 28px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-2);
        }
        .hero-title {
          font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          max-width: 800px;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.7;
        }
        .hero-form {
          width: 100%;
          max-width: 700px;
          padding: 24px;
        }
        .hero-form-inner {
          display: flex;
          gap: 12px;
        }
        .hero-input-wrap { flex: 1; position: relative; }
        .hero-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-size: 1rem; pointer-events: none;
        }
        .hero-input { padding-left: 44px; height: 54px; font-size: 1rem; }
        .hero-btn { height: 54px; padding: 0 28px; font-size: 1rem; white-space: nowrap; }
        .hero-result {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          padding: 12px 16px;
          background: var(--bg-glass);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
          flex-wrap: wrap;
        }
        .result-label { font-size: 0.85rem; color: var(--text-muted); }
        .result-link { font-weight: 600; font-size: 0.95rem; }
        .copy-pill {
          margin-left: auto;
          padding: 4px 14px;
          font-size: 0.8rem;
          border-radius: 20px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          color: var(--accent-2);
          cursor: pointer;
          transition: var(--transition);
        }
        .copy-pill:hover { background: rgba(124,58,237,0.25); }
        .login-hint {
          margin-top: 14px;
          font-size: 0.85rem;
          color: var(--text-muted);
          text-align: center;
        }
        .login-link { color: var(--accent-2); text-decoration: underline; }
        .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }

        /* features */
        .features { padding: 80px 0; }
        .section-title {
          text-align: center;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 700;
          margin-bottom: 48px;
          letter-spacing: -0.5px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .feature-card { padding: 28px; }
        .feature-card:hover { border-color: var(--border-accent); transform: translateY(-3px); }
        .feature-icon { font-size: 2rem; display: block; margin-bottom: 14px; }
        .feature-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
        .feature-card p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }

        /* cta */
        .cta-section {
          padding: 80px 0 120px;
        }
        .cta-inner {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .cta-inner h2 { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.5px; }
        .cta-inner p { color: var(--text-secondary); font-size: 1.05rem; }
        .cta-btn { padding: 16px 40px; font-size: 1.05rem; }

        /* spinner */
        .spinner {
          display: inline-block;
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .hero-form-inner { flex-direction: column; }
          .hero-btn { width: 100%; }
        }
      `}</style>
    </main>
  );
}
