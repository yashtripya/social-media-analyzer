import React from 'react';
import { Info, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="card">
      <h3 className="card-title">
        <Info size={22} style={{ color: 'var(--accent-cyan)' }} />
        About SocialIQ & Scoring Methodology
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
        <p>
          <strong>SocialIQ</strong> is an intuitive, full-stack content analysis engine designed to evaluate social media posts, diagnose engagement bottlenecks, and generate platform-optimized content rewrites.
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} style={{ color: 'var(--accent-purple)' }} />
            Explainable Content Quality Score (0–100)
          </h4>
          <p style={{ marginBottom: '0.75rem' }}>
            The <strong>Content Quality Score</strong> is an explainable weighted metric calculated deterministically across 6 core post dimensions:
          </p>

          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><strong>Hook Quality (20%):</strong> Evaluates opening line punchiness, length (3-12 words ideal), question triggers, and high-impact power words.</li>
            <li><strong>Content Clarity (20%):</strong> Evaluates line spacing, paragraph formatting (avoiding wall-of-text blocks), and sentence length.</li>
            <li><strong>Readability (20%):</strong> Adapted Flesch Reading Ease algorithm assessing syllable density for fast mobile scanning.</li>
            <li><strong>Call To Action Quality (20%):</strong> Detects direct action verbs (comment, link in bio, share, reply) and placement in final lines.</li>
            <li><strong>Engagement Potential (10%):</strong> Assesses comment triggers, emotional keywords, open loops, and optimal word length.</li>
            <li><strong>Hashtag Optimization (10%):</strong> Checks tag density against target platform best practices (LinkedIn 3-5, IG 3-10, X/Twitter 1-3).</li>
          </ul>
        </div>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
            System Architecture & AI Reliability
          </h4>
          <p>
            • <strong>Backend:</strong> Fast, lightweight Python FastAPI server with PyMuPDF for PDF text extraction and Tesseract OCR for scanned images.<br />
            • <strong>AI Engine:</strong> Powered by Google Gemini LLM API with an offline fallback engine when API keys are unconfigured.<br />
            • <strong>Storage:</strong> Embedded SQLite database storing post history without requiring external database dependencies.
          </p>
        </div>
      </div>
    </div>
  );
}
