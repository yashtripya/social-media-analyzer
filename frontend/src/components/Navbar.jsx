import React from 'react';
import { BarChart3, Globe, Sparkles } from 'lucide-react';

export default function Navbar({ platform, setPlatform, healthStatus }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="brand-title">SocialIQ</h1>
          <span className="brand-tagline">Content Quality & Engagement Analyzer</span>
        </div>
      </div>

      <div className="nav-controls">
        <div className="platform-selector">
          <Globe size={16} style={{ color: 'var(--text-muted)' }} />
          <label htmlFor="platform-select">Target Platform:</label>
          <select
            id="platform-select"
            className="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
            <option value="X/Twitter">X / Twitter</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>

        <div className="status-badge" title={healthStatus?.ai_engine || 'API Status'}>
          <div className="status-dot"></div>
          <span>{healthStatus?.ai_engine ? `Engine: ${healthStatus.ai_engine}` : 'Online'}</span>
        </div>
      </div>
    </header>
  );
}
