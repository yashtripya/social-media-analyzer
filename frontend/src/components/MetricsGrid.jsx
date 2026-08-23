import React from 'react';
import { Type, Hash, HelpCircle, AtSign, Link2, Smile, AlertCircle } from 'lucide-react';

export default function MetricsGrid({ analysis }) {
  if (!analysis) return null;

  const { basic_metrics, social_elements, sentiment } = analysis;

  const getSentimentBadge = (label) => {
    if (label === 'Positive') return { color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.15)' };
    if (label === 'Negative') return { color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.15)' };
    return { color: 'var(--accent-cyan)', bg: 'rgba(6, 182, 212, 0.15)' };
  };

  const sentBadge = getSentimentBadge(sentiment.label);

  return (
    <div className="card">
      <h3 className="card-title">
        <Type size={20} style={{ color: 'var(--accent-cyan)' }} />
        Detailed Post Metrics & Social Elements
      </h3>

      <div className="metrics-cards-grid">
        {/* Basic Stats */}
        <div className="stat-card">
          <div className="stat-header">
            <span>WORD COUNT</span>
            <Type size={16} />
          </div>
          <span className="stat-value">{basic_metrics.word_count}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            {basic_metrics.char_count} total characters
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>SENTENCE COUNT</span>
            <Type size={16} />
          </div>
          <span className="stat-value">{basic_metrics.sentence_count}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Avg {basic_metrics.avg_sentence_length} words / sentence
          </span>
        </div>

        {/* Social Elements */}
        <div className="stat-card">
          <div className="stat-header">
            <span>HASHTAGS</span>
            <Hash size={16} />
          </div>
          <span className="stat-value">{social_elements.hashtag_count}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
            {social_elements.hashtags.length > 0 ? (
              social_elements.hashtags.map((tag, idx) => (
                <span key={idx} className="chip-tag">{tag}</span>
              ))
            ) : (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>No hashtags detected</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>QUESTIONS & MENTIONS</span>
            <HelpCircle size={16} />
          </div>
          <span className="stat-value">{social_elements.question_count} Qs</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            {social_elements.mention_count} @mentions | {social_elements.url_count} URLs
          </span>
        </div>

        {/* Sentiment Analysis */}
        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div className="stat-header">
            <span>SENTIMENT & TONE ANALYSIS</span>
            <Smile size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem' }}>
            <span
              style={{
                background: sentBadge.bg,
                color: sentBadge.color,
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: `1px solid ${sentBadge.color}40`,
              }}
            >
              {sentiment.label} ({sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score})
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Tone: {sentiment.tone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
