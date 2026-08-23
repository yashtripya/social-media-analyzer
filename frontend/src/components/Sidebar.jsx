import React from 'react';
import { Sparkles, History, Info } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, historyCount }) {
  return (
    <aside className="sidebar">
      <button
        className={`sidebar-btn ${activeTab === 'analyze' ? 'active' : ''}`}
        onClick={() => setActiveTab('analyze')}
        id="tab-analyze-btn"
      >
        <Sparkles size={18} />
        <span>Analyzer</span>
      </button>

      <button
        className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => setActiveTab('history')}
        id="tab-history-btn"
      >
        <History size={18} />
        <span>History</span>
        {historyCount > 0 && (
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.15)',
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            {historyCount}
          </span>
        )}
      </button>

      <button
        className={`sidebar-btn ${activeTab === 'about' ? 'active' : ''}`}
        onClick={() => setActiveTab('about')}
        id="tab-about-btn"
      >
        <Info size={18} />
        <span>About & Scoring</span>
      </button>
    </aside>
  );
}
