import React from 'react';
import { Award, Zap, HelpCircle } from 'lucide-react';

export default function ScoreOverview({ analysis }) {
  if (!analysis || !analysis.scores) return null;

  const { overall_score, rating_label, rating_color, scores, platform } = analysis;

  const metricsList = [
    { label: 'Hook Quality', key: 'hook', score: scores.hook, desc: 'Opening line punchiness & scroll-stopping impact' },
    { label: 'Content Clarity', key: 'clarity', score: scores.clarity, desc: 'Sentence conciseness & paragraph formatting' },
    { label: 'Readability', key: 'readability', score: scores.readability, desc: 'Ease of comprehension & syllable density' },
    { label: 'Call To Action (CTA)', key: 'cta', score: scores.cta, desc: 'Presence of direct engagement trigger' },
    { label: 'Engagement Potential', key: 'engagement', score: scores.engagement, desc: 'Question frequency & emotional keywords' },
    { label: 'Hashtags', key: 'hashtags', score: scores.hashtags, desc: `Tag count & density for ${platform}` },
  ];

  const getProgressColor = (val) => {
    if (val >= 80) return 'var(--accent-emerald)';
    if (val >= 65) return 'var(--accent-cyan)';
    if (val >= 50) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  return (
    <div className="card" style={{ boxShadow: 'var(--shadow-glow)' }}>
      <h3 className="card-title">
        <Award size={22} style={{ color: 'var(--accent-amber)' }} />
        Content Quality Score Overview
      </h3>

      <div className="score-overview-grid">
        {/* Left Gauge Box */}
        <div className="gauge-box">
          <div className="score-circle" style={{ borderColor: rating_color }}>
            <span className="score-number" style={{ color: rating_color }}>
              {overall_score}
            </span>
            <span className="score-max">/ 100</span>
          </div>

          <span
            className="score-badge"
            style={{
              backgroundColor: `${rating_color}20`,
              color: rating_color,
              border: `1px solid ${rating_color}40`,
            }}
          >
            {rating_label}
          </span>
        </div>

        {/* Right Breakdown List */}
        <div className="metric-progress-list">
          {metricsList.map((m) => (
            <div key={m.key} className="metric-item">
              <div className="metric-label-row">
                <span style={{ color: 'var(--text-main)' }}>{m.label}</span>
                <span style={{ color: getProgressColor(m.score) }}>{m.score} / 100</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${m.score}%`,
                    backgroundColor: getProgressColor(m.score),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
