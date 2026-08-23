import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadSection from './components/UploadSection';
import TextInputSection from './components/TextInputSection';
import ScoreOverview from './components/ScoreOverview';
import MetricsGrid from './components/MetricsGrid';
import AnalyticsVisualizer from './components/AnalyticsVisualizer';
import RecommendationsView from './components/RecommendationsView';
import PostComparison from './components/PostComparison';
import HistoryView from './components/HistoryView';
import AboutView from './components/AboutView';
import Toast from './components/Toast';

import {
  checkHealth,
  analyzePostText,
  generatePostImprovements,
  fetchHistory
} from './services/api';

import { Sparkles, AlertCircle, FileText, Upload, RefreshCw, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'direct'
  const [platform, setPlatform] = useState('LinkedIn');
  const [postText, setPostText] = useState('');
  
  // Loading & state flags
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStepMessage, setLoadingStepMessage] = useState('');
  
  // Results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [improvementsResult, setImprovementsResult] = useState(null);
  
  // History & System Health
  const [historyList, setHistoryList] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Initial load
  useEffect(() => {
    checkHealth()
      .then(setHealthStatus)
      .catch(() => setHealthStatus({ ai_engine: 'Offline' }));

    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const items = await fetchHistory();
      setHistoryList(items);
    } catch (e) {
      console.warn("History fetch failed", e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // State Invalidation Handler: Ensures previous analysis results do NOT linger
  const clearResults = () => {
    setAnalysisResult(null);
    setImprovementsResult(null);
    setError(null);
  };

  // Handle Platform Change
  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    if (analysisResult || improvementsResult) {
      clearResults();
      showToast(`Platform switched to ${newPlatform}. Results reset for fresh analysis.`);
    }
  };

  // Handle Input Mode Switch
  const handleInputModeSwitch = (mode) => {
    setInputMode(mode);
  };

  // Main Analysis Workflow Trigger
  const handleRunFullAnalysis = async () => {
    if (!postText || !postText.trim()) {
      setError("Please upload a file or type a post before running analysis.");
      return;
    }

    // Reset previous results immediately
    clearResults();
    setIsAnalyzing(true);
    setLoadingStepMessage('Analyzing post metrics, sentiment & hook...');

    try {
      // Step 1: Analyze text metrics
      const analysis = await analyzePostText(postText, platform);
      setAnalysisResult(analysis);

      // Step 2: Generate AI recommendations & improved post rewrite
      setLoadingStepMessage(`Generating platform-tailored AI recommendations for ${platform}...`);
      const improvements = await generatePostImprovements(postText, platform, analysis);
      setImprovementsResult(improvements.recommendations);

      setIsAnalyzing(false);
      setLoadingStepMessage('');
      showToast(`Analysis completed successfully for ${platform}!`);
      loadHistory();
    } catch (err) {
      setIsAnalyzing(false);
      setLoadingStepMessage('');
      setError(err.message || "Failed to analyze post");
    }
  };

  const handleTextExtracted = (extractedText) => {
    clearResults();
    setPostText(extractedText);
    showToast("Text extracted successfully!");
  };

  const handleLoadHistoryItem = (item) => {
    clearResults();
    setPlatform(item.platform);
    setPostText(item.original_post);
    setAnalysisResult(item.analysis);
    setImprovementsResult(item.recommendations);
    setActiveTab('analyze');
    showToast(`Loaded analysis record from ${item.platform}`);
  };

  const handleResetAll = () => {
    clearResults();
    setPostText('');
    showToast("Cleared input and reset all results.");
  };

  return (
    <div className="app-layout">
      <Navbar
        platform={platform}
        setPlatform={handlePlatformChange}
        healthStatus={healthStatus}
      />

      <div className="main-container">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          historyCount={historyList.length}
        />

        <main className="content-area">
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--accent-rose)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === 'analyze' && (
            <>
              {/* Top Controls: Input Mode Tab Switcher & Clear Reset All */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div className="tab-switcher" style={{ marginBottom: 0 }}>
                  <button
                    className={`tab-switcher-btn ${inputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => handleInputModeSwitch('upload')}
                    id="mode-upload-btn"
                  >
                    <Upload size={16} /> Document / Image Upload
                  </button>
                  <button
                    className={`tab-switcher-btn ${inputMode === 'direct' ? 'active' : ''}`}
                    onClick={() => handleInputModeSwitch('direct')}
                    id="mode-direct-btn"
                  >
                    <FileText size={16} /> Direct Text Input
                  </button>
                </div>

                {(postText || analysisResult) && (
                  <button
                    className="btn-secondary"
                    onClick={handleResetAll}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', color: 'var(--accent-rose)' }}
                    id="reset-all-btn"
                  >
                    <Trash2 size={14} /> Start Fresh / Reset All
                  </button>
                )}
              </div>

              {/* Input Component */}
              {inputMode === 'upload' ? (
                <UploadSection
                  onTextExtracted={handleTextExtracted}
                  isExtracting={isExtracting}
                  setIsExtracting={setIsExtracting}
                  setError={setError}
                  onClearResults={clearResults}
                />
              ) : (
                <TextInputSection
                  postText={postText}
                  setPostText={setPostText}
                  onClearResults={clearResults}
                  platform={platform}
                />
              )}

              {/* Text Verification / Edit Area (If text exists from document upload) */}
              {inputMode === 'upload' && postText && (
                <TextInputSection
                  postText={postText}
                  setPostText={setPostText}
                  onClearResults={clearResults}
                  platform={platform}
                />
              )}

              {/* Main Action Trigger */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-primary"
                  onClick={handleRunFullAnalysis}
                  disabled={!postText.trim() || isAnalyzing || isExtracting}
                  id="analyze-post-action-btn"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="spinner" />
                      <span>{loadingStepMessage || 'Analyzing post...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Analyze Post for {platform}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Results Display */}
              {analysisResult && (
                <>
                  <ScoreOverview analysis={analysisResult} />
                  <MetricsGrid analysis={analysisResult} />
                  <AnalyticsVisualizer
                    analysis={analysisResult}
                    recommendations={improvementsResult}
                  />
                </>
              )}

              {improvementsResult && (
                <>
                  <RecommendationsView
                    recommendations={improvementsResult}
                    showToast={showToast}
                  />
                  <PostComparison
                    originalPost={postText}
                    improvedPost={improvementsResult.improved_post}
                    platform={platform}
                    analysis={analysisResult}
                    recommendations={improvementsResult}
                    showToast={showToast}
                  />
                </>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <HistoryView
              historyList={historyList}
              onRefreshHistory={loadHistory}
              onLoadHistoryItem={handleLoadHistoryItem}
              showToast={showToast}
            />
          )}

          {activeTab === 'about' && (
            <AboutView />
          )}
        </main>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
