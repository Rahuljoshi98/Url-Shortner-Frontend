'use client';

import { useState, useEffect } from 'react';

let toastId = 0;

const listeners = new Set();

export function showToast(message, type = 'success') {
  const id = ++toastId;
  listeners.forEach((fn) => fn({ id, message, type }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {toast.message}
        </div>
      ))}

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(20px);
          animation: toastIn 0.3s ease forwards;
          min-width: 280px;
          max-width: 380px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .toast-success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }
        .toast-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        .toast-info {
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #c4b5fd;
        }
        .toast-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .toast-success .toast-icon { background: rgba(16,185,129,0.3); }
        .toast-error   .toast-icon { background: rgba(239,68,68,0.3); }
        .toast-info    .toast-icon { background: rgba(124,58,237,0.3); }
      `}</style>
    </div>
  );
}
