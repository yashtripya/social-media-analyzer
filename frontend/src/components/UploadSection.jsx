import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, AlertCircle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { extractDocument } from '../services/api';

export default function UploadSection({ onTextExtracted, isExtracting, setIsExtracting, setError, onClearResults }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractionInfo, setExtractionInfo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = async (file) => {
    if (!file) return;
    
    // Clear previous analysis results immediately upon uploading new file
    if (onClearResults) onClearResults();

    // Reset local upload state
    setError(null);
    setExtractionInfo(null);

    // Extension check
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];
    const fileName = file.name || '';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    
    if (!validExts.includes(ext)) {
      setError(`Invalid file format '${ext}'. Please upload a PDF, PNG, JPG, or JPEG file.`);
      return;
    }

    // Size check (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of 10 MB.`);
      return;
    }

    if (file.size === 0) {
      setError("Uploaded file is empty (0 bytes).");
      return;
    }

    setUploadedFile(file);
    setIsExtracting(true);

    try {
      const data = await extractDocument(file);
      setIsExtracting(false);
      setExtractionInfo(data);
      if (data.text) {
        onTextExtracted(data.text);
      }
    } catch (err) {
      setIsExtracting(false);
      setError(err.message || "Failed to extract text from document");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setExtractionInfo(null);
    if (onClearResults) onClearResults();
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <UploadCloud size={20} style={{ color: 'var(--accent-purple)' }} />
        Document & Image Upload (PDF Extraction / OCR Engine)
      </h3>

      <div
        className={`dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="dropzone-area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          style={{ display: 'none' }}
          onChange={handleChange}
          id="file-upload-input"
        />

        <div className="dropzone-icon">
          {isExtracting ? (
            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          ) : (
            <UploadCloud size={32} />
          )}
        </div>

        {isExtracting ? (
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: 4 }}>Extracting text...</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Parsing PDF layout structure & running Tesseract OCR engine...
            </p>
          </div>
        ) : (
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: 4 }}>
              Drag & Drop your social media post document or image
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Supports PDF documents, PNG, JPG, JPEG scanned posts up to 10MB
            </p>
            <button type="button" className="btn-secondary" id="browse-files-btn">
              Browse Files
            </button>
          </div>
        )}
      </div>

      {uploadedFile && extractionInfo && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--accent-emerald)' }} />
            <span>
              <strong>{uploadedFile.name}</strong> ({extractionInfo.file_size_kb} KB) — Extracted via {extractionInfo.extraction_method}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <RefreshCw size={12} /> Replace File
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', color: 'var(--accent-rose)' }}
              onClick={handleRemoveFile}
            >
              <XCircle size={12} /> Clear File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
