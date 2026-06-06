"use client";

import { useState } from "react";
import { deleteUrl } from "@/lib/api";
import { showToast } from "./Toast";

const BASE_URL =
  (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/") +
  "v1/url/code/";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(str, n = 50) {
  return str?.length > n ? str.slice(0, n) + "…" : str;
}

export default function UrlCard({ url, onDeleted, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortLink = `${BASE_URL}${url.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    showToast("Copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this short URL?")) return;
    setDeleting(true);
    try {
      await deleteUrl(url._id);
      showToast("URL deleted", "info");
      onDeleted?.(url._id);
    } catch {
      showToast("Failed to delete", "error");
      setDeleting(false);
    }
  };

  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <div className={`url-card glass-card ${isExpired ? "expired" : ""}`}>
      <div className="url-card-header">
        <div className="url-info">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="original-url"
            title={url.originalUrl}
          >
            {truncate(url.originalUrl, 55)}
          </a>
          <div className="short-link-row">
            <a
              href={shortLink}
              target="_blank"
              rel="noopener noreferrer"
              className="short-link"
            >
              ⚡ {url.shortCode}
            </a>
            <button
              className={`copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              title="Copy short link"
              id={`copy-${url._id}`}
            >
              {copied ? "✓ Copied" : "⎘ Copy"}
            </button>
          </div>
        </div>

        <div className="url-stats">
          <div className="stat">
            <span className="stat-value">{url.clicks ?? 0}</span>
            <span className="stat-label">clicks</span>
          </div>
        </div>
      </div>

      <div className="url-card-footer">
        <div className="url-meta">
          <span className="meta-item">📅 {formatDate(url.createdAt)}</span>
          {url.expiresAt && (
            <span
              className={`meta-item ${isExpired ? "expired-badge" : "expiry-badge"}`}
            >
              {isExpired
                ? "⚠ Expired"
                : `⏱ Expires ${formatDate(url.expiresAt)}`}
            </span>
          )}
        </div>
        <div className="url-actions">
          <button
            className="btn-ghost"
            onClick={() => onEdit?.(url)}
            id={`edit-${url._id}`}
          >
            ✏ Edit
          </button>
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={deleting}
            id={`delete-${url._id}`}
          >
            {deleting ? "…" : "🗑 Delete"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .url-card {
          padding: 20px 24px;
          transition: var(--transition);
          border: 1px solid var(--border-glass);
        }
        .url-card:hover {
          border-color: var(--border-accent);
          transform: translateY(-2px);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.5),
            var(--shadow-glow);
        }
        .url-card.expired {
          opacity: 0.6;
        }
        .url-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .url-info {
          flex: 1;
          min-width: 0;
        }
        .original-url {
          display: block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.2s;
          margin-bottom: 8px;
        }
        .original-url:hover {
          color: var(--text-primary);
        }
        .short-link-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .short-link {
          font-size: 1rem;
          font-weight: 600;
          background: var(--gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .copy-btn {
          padding: 4px 12px;
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: 20px;
          border: 1px solid var(--border-accent);
          background: rgba(124, 58, 237, 0.1);
          color: var(--accent-2);
          cursor: pointer;
          transition: var(--transition);
        }
        .copy-btn:hover {
          background: rgba(124, 58, 237, 0.2);
        }
        .copy-btn.copied {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #6ee7b7;
        }
        .url-stats {
          text-align: center;
          padding: 8px 16px;
          background: var(--bg-glass);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          min-width: 70px;
        }
        .stat-value {
          display: block;
          font-size: 1.4rem;
          font-weight: 700;
          background: var(--gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .url-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-glass);
          gap: 12px;
        }
        .url-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .meta-item {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .expiry-badge {
          color: var(--warning) !important;
        }
        .expired-badge {
          color: var(--error) !important;
        }
        .url-actions {
          display: flex;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
