import React from 'react';
import { ArrowRightLeft, Copy, Download, Sparkles } from 'lucide-react';
import { exportPdfReport } from '../services/api';

export default function PostComparison({ originalPost, improvedPost, platform, analysis, recommendations, showToast }) {
  if (!improvedPost) return null;

  const handleCopyImproved = () => {
    navigator.clipboard.writeText(improvedPost);
    if (showToast) showToast('Improved post copied to clipboard!');
  };

  const handleExportPdf = async () => {
    try {
      if (showToast) showToast('Generating PDF Report...');
      await exportPdfReport({
        original_post: originalPost,
        platform: platform,
        analysis: analysis,
        recommendations: recommendations,
        improved_post: improvedPost
      });
      if (showToast) showToast('PDF Report downloaded successfully!');
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to download PDF report');
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ marginBottom: 0 }}>
          <ArrowRightLeft size={22} style={{ color: 'var(--accent-emerald)' }} />
          Post Comparison: Original vs AI Optimized ({platform})
        </h3>

        <button
          className="btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          onClick={handleExportPdf}
          id="download-pdf-report-btn"
        >
          <Download size={15} /> Download PDF Report
        </button>
      </div>

      <div className="comparison-grid">
        {/* Original Post */}
        <div>
          <div className="post-box-header">
            <span>ORIGINAL POST</span>
          </div>
          <div className="post-box" style={{ opacity: 0.85 }}>
            {originalPost}
          </div>
        </div>

        {/* AI Improved Post */}
        <div>
          <div className="post-box-header" style={{ color: 'var(--accent-purple)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> AI OPTIMIZED VERSION ({platform})
            </span>
            <button
              className="btn-secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={handleCopyImproved}
              id="copy-improved-post-btn"
            >
              <Copy size={12} /> Copy Post
            </button>
          </div>
          <div className="post-box" style={{ borderColor: 'rgba(139, 92, 246, 0.4)', background: 'rgba(139, 92, 246, 0.04)' }}>
            {improvedPost}
          </div>
        </div>
      </div>
    </div>
  );
}
