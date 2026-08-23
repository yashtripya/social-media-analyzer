import React, { useState } from 'react';
import { History, Trash2, Eye, Calendar, Award, Globe } from 'lucide-react';
import { deleteHistoryItem } from '../services/api';

export default function HistoryView({ historyList, onRefreshHistory, onLoadHistoryItem, showToast }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      if (showToast) showToast('Deleted history entry');
      onRefreshHistory();
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete');
    }
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <History size={22} style={{ color: 'var(--accent-purple)' }} />
        Analysis History (SQLite DB)
      </h3>

      {historyList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <History size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h4>No Saved Analysis History Yet</h4>
          <p style={{ fontSize: '0.88rem' }}>Run an analysis on your post to store history automatically.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {historyList.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              onClick={() => onLoadHistoryItem(item)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: 'var(--accent-purple)',
                    padding: '0.15rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {item.platform}
                  </span>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Calendar size={12} /> {formatDate(item.timestamp)}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.original_post}
                </p>
              </div>

              {/* Score Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: item.score >= 75 ? 'var(--accent-emerald)' : item.score >= 55 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                  }}>
                    {item.score}/100
                  </span>
                </div>

                <button
                  className="btn-secondary"
                  style={{ padding: '0.4rem', color: 'var(--accent-rose)' }}
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Delete record"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
