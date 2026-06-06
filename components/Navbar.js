'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner page-container">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="gradient-text">SnapLink</span>
        </Link>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="btn-ghost">
                Dashboard
              </Link>
              <span className="user-email">{user?.email}</span>
              <button className="btn-secondary" onClick={handleLogout} id="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" id="nav-login">
                Login
              </Link>
              <Link href="/register" className="btn-primary" id="nav-register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 16px 0;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(8, 12, 24, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-glass);
          padding: 12px 0;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .logo-icon {
          font-size: 1.3rem;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-email {
          font-size: 0.85rem;
          color: var(--text-muted);
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </nav>
  );
}
