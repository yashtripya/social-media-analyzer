import React from 'react';
import { Sparkles, CheckCircle2, Copy, Hash, HelpCircle, ArrowRight } from 'lucide-react';

export default function RecommendationsView({ recommendations, onCopyText, showToast }) {
  if (!recommendations) return null;

  const {
    summary,
    recommendations: recsList,
    improved_hook,
    improved_cta,
    hashtags,
    engagement_question
  } = recommendations;

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    if (showToast) showToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="card" style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}>
      <h3 className="card-title">
        <Sparkles size={22} style={{ color: 'var(--accent-purple)' }} />
        AI Engagement Improvement Recommendations
      </h3>

      {summary && (
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          borderLeft: '4px solid var(--accent-purple)',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem',
          fontSize: '0.92rem',
          lineHeight: '1.6'
        }}>
          <strong>Summary: </strong> {summary}
        </div>
      )}

      {/* Recommendations Checklist */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Actionable Recommendations
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {recsList && recsList.map((rec, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', marginTop: 2, flexShrink: 0 }} />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Components Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Improved Hook */}
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
              ⚡ Improved Opening Hook
            </span>
            <button
              className="btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleCopy(improved_hook, 'Improved Hook')}
              id="copy-hook-btn"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-main)' }}>
            "{improved_hook}"
          </p>
        </div>

        {/* Improved CTA */}
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
              🎯 Improved Call To Action (CTA)
            </span>
            <button
              className="btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleCopy(improved_cta, 'Improved CTA')}
              id="copy-cta-btn"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-main)' }}>
            "{improved_cta}"
          </p>
        </div>
      </div>

      {/* Engagement Question & Hashtags */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Question */}
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
              ❓ Comment-Triggering Question
            </span>
            <button
              className="btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleCopy(engagement_question, 'Engagement Question')}
              id="copy-question-btn"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            {engagement_question}
          </p>
        </div>

        {/* Recommended Hashtags */}
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
              🏷️ Recommended Hashtags
            </span>
            <button
              className="btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleCopy(hashtags.join(' '), 'Hashtags')}
              id="copy-hashtags-btn"
            >
              <Copy size={12} /> Copy All
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
            {hashtags && hashtags.map((tag, idx) => (
              <span key={idx} className="chip-tag" onClick={() => handleCopy(tag, tag)}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
