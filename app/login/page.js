'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/components/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back!', 'success');
      router.push('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error?.explanations?.[0] || 'Login failed. Check your credentials.';
      showToast(msg, 'error');
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setErrors({}); };

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="auth-card glass-card animate-scale-in">
        <div className="auth-header">
          <Link href="/" className="auth-logo">⚡ <span className="gradient-text">SnapLink</span></Link>
          <h1>Welcome back</h1>
          <p>Sign in to manage your short links</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className={`input-field ${errors.password ? 'error' : ''}`}
              placeholder="Your password"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {errors.general && <p className="general-error">{errors.general}</p>}

          <button type="submit" className="btn-primary auth-btn" disabled={loading} id="login-submit-btn">
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link href="/register" className="switch-link" id="switch-to-register">
            Create one free
          </Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 24px 40px;
          position: relative;
          overflow: hidden;
        }
        .blob {
          position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.1; pointer-events: none;
          animation: blob 12s infinite ease-in-out;
        }
        .blob-1 { width: 500px; height: 500px; background: #7c3aed; top: -100px; left: -100px; }
        .blob-2 { width: 400px; height: 400px; background: #ec4899; bottom: -100px; right: -100px; animation-delay: -6s; }
        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          position: relative;
          z-index: 1;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .auth-header h1 {
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .field-error { font-size: 0.8rem; color: var(--error); }
        .general-error {
          text-align: center;
          font-size: 0.85rem;
          color: var(--error);
          padding: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: var(--radius-sm);
        }
        .auth-btn { width: 100%; height: 52px; font-size: 1rem; margin-top: 4px; }
        .auth-switch {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .switch-link { color: var(--accent-2); text-decoration: underline; }
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
