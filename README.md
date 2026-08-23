# Social Media Content Analyzer (SocialIQ)

An intelligent, full-stack web application designed to analyze social media posts, calculate explainable content-quality metrics, and generate AI-powered engagement improvement suggestions and platform-tailored post rewrites.

---

## 📌 Problem Statement

Creating engaging social media content requires balancing attention-grabbing hooks, clear structure, optimal readability, strong call-to-actions (CTAs), and platform-specific hashtag strategies. Without empirical feedback, creators and marketers struggle to diagnose why posts underperform before publishing.

**SocialIQ** solves this problem by providing immediate, explainable diagnostics on post quality alongside actionable AI recommendations and rewritten post versions customized for **LinkedIn**, **Instagram**, **X (Twitter)**, and **Facebook**.

---

## ✨ Key Features

1. **Document & Image Upload (OCR)**:
   - Drag-and-drop support for **PDF**, **PNG**, **JPG**, and **JPEG** files.
   - Extracts text from multi-page PDFs using `PyMuPDF (fitz)` while preserving paragraphs and line breaks.
   - Perceptual OCR text extraction for scanned images via `Tesseract OCR` and `Pillow`.
2. **Direct Text Entry & Editing**:
   - Live character and word counters.
   - Verification editor allowing creators to review and tweak extracted text before running analysis.
3. **Explainable Content Quality Score (0–100)**:
   - **Hook Quality (20%)**: Opening line punchiness, length (3-12 words ideal), question triggers, and power words.
   - **Content Clarity (20%)**: Line spacing, paragraph formatting, and sentence length.
   - **Readability (20%)**: Adapted Flesch Reading Ease algorithm assessing syllable density for fast mobile reading.
   - **CTA Quality (20%)**: Detection of action verbs and strategic placement.
   - **Engagement Potential (10%)**: Question frequency, emotional keywords, open loops.
   - **Hashtag Optimization (10%)**: Platform-tailored hashtag density rules.
4. **Detailed Metrics & Sentiment Analysis**:
   - Word count, character count, sentence count, average sentence length.
   - Regex extraction of hashtags, @mentions, URLs, and questions.
   - Rule-based sentiment classification (`Positive`, `Neutral`, `Negative`) with tone indicators.
5. **Platform-Tailored AI Recommendations**:
   - 3–5 specific actionable improvement tips.
   - Generated **Improved Opening Hook**, **Actionable CTA**, **Comment-Triggering Question**, and **Recommended Hashtags**.
   - Platform-optimized post rewrite for LinkedIn, Instagram, X/Twitter, or Facebook.
   - Gemini API integration with automatic fallback to a smart offline recommendation engine when no API key is set.
6. **Side-by-Side Post Comparison**:
   - Original Post vs. AI-Optimized Post with 1-click copy to clipboard.
7. **Downloadable PDF Report**:
   - Download a professionally styled PDF report (`ReportLab`) summarizing post scores, metrics, recommendations, and rewrites.
8. **Analysis History Persistence**:
   - Lightweight embedded **SQLite** database (`analyzer.db`) storing historical analyses.

---

## 🛠️ Technology Stack

### Backend
- **Python 3.10**
- **FastAPI**: Lightweight, high-performance API server framework.
- **PyMuPDF (`fitz`)**: Fast PDF text extraction across multi-page documents.
- **Pytesseract & Pillow**: Image pre-processing and Tesseract OCR engine integration.
- **Google Gemini API (`google-genai`)**: LLM integration for structured post recommendations.
- **SQLite3**: Zero-config embedded database for analysis history storage.
- **ReportLab**: PDF report generation.

### Frontend
- **React 18** + **JavaScript (ES6+)**
- **Vite**: Ultra-fast frontend build tool and development server.
- **Vanilla CSS**: Custom design system using CSS custom properties (variables), glassmorphic elevation, dynamic dark mode, and glow effects.
- **Lucide React**: Modern iconography.

---

## 🏗️ System Architecture & Workflow

```
[ User Document / Text Input ]
          │
          ▼
┌─────────────────────────┐
│   POST /api/extract     │  ◄──  PyMuPDF (PDF) / Tesseract (OCR)
└─────────┬───────────────┘
          │ (Extracted Text)
          ▼
┌─────────────────────────┐
│   POST /api/analyze     │  ◄──  NLP Heuristics, Readability, Hook, CTA, Sentiment
└─────────┬───────────────┘
          │ (Metrics & Scores)
          ▼
┌─────────────────────────┐
│   POST /api/improve     │  ◄──  Gemini API (or Fallback Engine)
└─────────┬───────────────┘
          │
  ┌───────┴───────────────┐
  ▼                       ▼
[(SQLite History)]    [POST /api/export-pdf] ──► (Download PDF Report)
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- (Optional) **Tesseract OCR binary** installed on host machine for image OCR support.

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   DB_PATH=analyzer.db
   ```
   *(If no API key is provided, SocialIQ automatically uses its built-in smart recommendation engine)*

4. Run FastAPI Backend Server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API will be live at `http://127.0.0.1:8000`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Run Vite Development Server:
   ```bash
   npm run dev
   ```
   The frontend UI will be live at `http://localhost:5173`.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and active AI engine mode |
| `POST` | `/api/extract` | Upload PDF/image file to extract clean post text |
| `POST` | `/api/analyze` | Calculate word count, readability, hook quality, CTA, sentiment, and Content Quality Score |
| `POST` | `/api/improve` | Generate structured AI recommendations and platform post rewrites (saves to SQLite history) |
| `GET` | `/api/history` | Retrieve saved analysis history list from SQLite |
| `GET` | `/api/history/{id}` | Retrieve specific history record details |
| `DELETE` | `/api/history/{id}` | Delete specific history item |
| `DELETE` | `/api/history` | Clear all history records |
| `POST` | `/api/export-pdf` | Download formatted ReportLab PDF report |

---

## 🔮 Future Improvements

- **Multi-lingual Analysis**: Extend readability heuristics and sentiment dictionaries for Spanish, French, and German.
- **Image Post Visual Analysis**: Analyze image color contrast and text overlay density alongside text.
- **A/B Hook Tester**: Generate 3 distinct hook variations with instant engagement prediction preview.
