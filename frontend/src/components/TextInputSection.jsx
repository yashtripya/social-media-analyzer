import React from 'react';
import { Edit3, Trash2, Sparkles, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';

export default function TextInputSection({ postText, setPostText, onClearResults, platform }) {
  const wordCount = postText.trim() ? postText.trim().split(/\s+/).length : 0;
  const charCount = postText.length;

  const handleTextChange = (e) => {
    if (onClearResults && postText !== e.target.value) {
      onClearResults();
    }
    setPostText(e.target.value);
  };

  const handleClearText = () => {
    if (onClearResults) onClearResults();
    setPostText('');
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: 0 }}>
          <Edit3 size={20} style={{ color: 'var(--accent-cyan)' }} />
          Direct Text Entry / Verification
        </h3>

        {postText && (
          <button
            className="btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', color: 'var(--accent-rose)' }}
            onClick={handleClearText}
            title="Clear text & reset analysis"
            id="clear-text-btn"
          >
            <Trash2 size={13} /> Clear Input
          </button>
        )}
      </div>

      <div className="textarea-container">
        <textarea
          className="custom-textarea"
          placeholder="Paste or type your social media post here..."
          value={postText}
          onChange={handleTextChange}
          id="post-text-input"
        />

        <div className="textarea-footer">
          <span>Verify or edit post text before triggering AI analysis</span>
          <span>
            <strong>{wordCount}</strong> words | <strong>{charCount}</strong> characters
          </span>
        </div>
      </div>
    </div>
  );
}
