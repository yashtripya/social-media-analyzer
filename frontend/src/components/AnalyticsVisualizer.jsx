import React from 'react';
import { BarChart2, PieChart, Layers, Clock, Smile, Award, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AnalyticsVisualizer({ analysis, recommendations }) {
  if (!analysis || !analysis.scores) return null;

  const { scores, platform, basic_metrics, social_elements, sentiment, overall_score } = analysis;

  // 1. Radar Chart Setup (6 Axes)
  const metrics = [
    { label: 'Hook', val: scores.hook || 0 },
    { label: 'Clarity', val: scores.clarity || 0 },
    { label: 'Readability', val: scores.readability || 0 },
    { label: 'CTA', val: scores.cta || 0 },
    { label: 'Engagement', val: scores.engagement || 0 },
    { label: 'Hashtags', val: scores.hashtags || 0 },
  ];

  const size = 260;
  const center = size / 2;
  const radius = 95;
  const totalAxes = metrics.length;

  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate Radar Polygon points string
  const polygonPoints = metrics
    .map((m, i) => {
      const { x, y } = getCoordinates(i, m.val);
      return `${x},${y}`;
    })
    .join(' ');

  // 2. Platform Benchmarks
  const platformBenchmarks = {
    LinkedIn: { topScore: 84, avgWordCount: '150-250', bestTime: 'Tues-Thurs 8-10 AM' },
    Instagram: { topScore: 82, avgWordCount: '30-80', bestTime: 'Wed-Fri 11 AM-1 PM' },
    'X/Twitter': { topScore: 78, avgWordCount: '15-40', bestTime: 'Mon-Fri 9-11 AM' },
    Facebook: { topScore: 76, avgWordCount: '40-100', bestTime: 'Wed-Fri 1-3 PM' },
  };
  const currentBenchmark = platformBenchmarks[platform] || platformBenchmarks['LinkedIn'];

  // 3. Content Structure Timeline Items
  const structureItems = [
    {
      title: 'Opening Hook',
      status: scores.hook >= 75 ? 'Strong' : scores.hook >= 50 ? 'Moderate' : 'Needs Punch',
      color: scores.hook >= 75 ? 'var(--accent-emerald)' : scores.hook >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)',
      desc: scores.hook >= 75 ? 'Scroll-stopping opening line detected' : 'Consider leading with a counter-intuitive stat or bold question'
    },
    {
      title: 'Body Formatting & Whitespace',
      status: scores.clarity >= 70 ? 'Optimal Spacing' : 'Dense Block',
      color: scores.clarity >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
      desc: basic_metrics.sentence_count > 1 ? `${basic_metrics.sentence_count} sentences across ${basic_metrics.word_count} words` : 'Single line post'
    },
    {
      title: 'Call to Action (CTA)',
      status: social_elements.cta_detected ? 'Detected' : 'Missing',
      color: social_elements.cta_detected ? 'var(--accent-emerald)' : 'var(--accent-rose)',
      desc: social_elements.cta_detected 
        ? `Found engagement triggers: ${social_elements.detected_ctas?.slice(0, 2).join(', ') || 'Direct action'}` 
        : 'No direct CTA keywords found'
    },
    {
      title: 'Hashtag Density',
      status: social_elements.hashtag_count > 0 ? `${social_elements.hashtag_count} Tags` : 'None',
      color: scores.hashtags >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
      desc: social_elements.hashtag_count > 0 ? `Targeted tag count for ${platform}` : 'Consider adding 3-5 platform tags'
    }
  ];

  // 4. Reading Time Calculation
  const words = basic_metrics.word_count || 0;
  const readingTimeSec = Math.max(5, Math.round((words / 200) * 60));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Visual Analytics Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Activity size={24} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Visual Content Analytics & Intelligence</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Multidimensional breakdown of post strength for <strong>{platform}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Reading Time</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                <Clock size={15} /> ~{readingTimeSec} sec
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flesch Readability</span>
              <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                {scores.readability}/100 Ease
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Radar Chart & Benchmark Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Radar Spider Chart Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 className="card-title" style={{ fontSize: '1rem', width: '100%', marginBottom: '0.5rem' }}>
            <PieChart size={18} style={{ color: 'var(--accent-purple)' }} />
            6-Dimensional Content Radar
          </h4>

          <div style={{ position: 'relative', width: size, height: size, margin: '0.5rem 0' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* Concentric Grid Circles */}
              {[0.25, 0.5, 0.75, 1].map((level, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray={level === 1 ? 'none' : '3,3'}
                />
              ))}

              {/* Axis Spoke Lines */}
              {metrics.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(139, 92, 246, 0.35)"
                stroke="var(--accent-purple)"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              {metrics.map((m, i) => {
                const { x, y } = getCoordinates(i, m.val);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--accent-cyan)"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Axis Labels */}
              {metrics.map((m, i) => {
                const { x, y } = getCoordinates(i, 118);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {m.label} ({m.val})
                  </text>
                );
              })}
            </svg>
          </div>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
            Inner area represents balanced performance across all core metrics
          </span>
        </div>

        {/* Industry Benchmark Comparison Card */}
        <div className="card">
          <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            <BarChart2 size={18} style={{ color: 'var(--accent-cyan)' }} />
            {platform} Industry Benchmark Comparison
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Current Score Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Your Post Score</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{overall_score} / 100</span>
              </div>
              <div className="progress-track" style={{ height: '10px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${overall_score}%`, background: 'var(--primary-glow)' }}
                />
              </div>
            </div>

            {/* Top Performer Benchmark Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Top {platform} Posts Average</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{currentBenchmark.topScore} / 100</span>
              </div>
              <div className="progress-track" style={{ height: '10px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${currentBenchmark.topScore}%`, background: 'var(--accent-emerald)' }}
                />
              </div>
            </div>

            {/* Benchmark Insights */}
            <div style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              border: '1px solid var(--border-color)',
              marginTop: '0.5rem',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Ideal Word Count ({platform}):</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentBenchmark.avgWordCount} words</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Best Posting Window:</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>{currentBenchmark.bestTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Your Current Length:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{words} words</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Structure Timeline & Sentiment Arc */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Content Structure Component Breakdown */}
        <div className="card">
          <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            <Layers size={18} style={{ color: 'var(--accent-amber)' }} />
            Post Structure Audit
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {structureItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    {item.desc}
                  </div>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: `${item.color}20`,
                  color: item.color,
                  border: `1px solid ${item.color}40`,
                  whiteSpace: 'nowrap'
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment & Tone Classification Card */}
        <div className="card">
          <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            <Smile size={18} style={{ color: 'var(--accent-emerald)' }} />
            Sentiment & Emotional Tone Gauge
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
            {/* Tone Arc Gauge */}
            <div style={{
              background: 'rgba(18, 25, 39, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              width: '100%',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: sentiment.label === 'Positive' ? 'var(--accent-emerald)' : sentiment.label === 'Negative' ? 'var(--accent-rose)' : 'var(--accent-cyan)'
              }}>
                {sentiment.label} Tone
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Classification: <strong>{sentiment.tone}</strong>
              </div>

              {/* Sentiment Score Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.85rem',
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                fontSize: '0.82rem'
              }}>
                <span>Positive Words: <strong style={{ color: 'var(--accent-emerald)' }}>{sentiment.positive_count}</strong></span>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <span>Problem Words: <strong style={{ color: 'var(--accent-rose)' }}>{sentiment.negative_count}</strong></span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textAlign: 'center', margin: 0 }}>
              Posts with high positive sentiment or urgency drive up to 35% more audience comments and saves.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
