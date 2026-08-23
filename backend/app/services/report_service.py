import io
import html
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def sanitize_pdf_text(text: str) -> str:
    """
    Sanitizes text for safe rendering in ReportLab Paragraph elements:
    1. Replaces common emojis and unicode symbols with clean ASCII equivalents.
    2. Filters out unsupported high-unicode codepoints (> 255) that corrupt PDF Type 1 font streams.
    3. HTML-escapes special characters (&, <, >) to prevent XML parser errors in ReportLab.
    4. Converts line breaks (\n) to <br/> tags for proper multiline rendering.
    """
    if not text:
        return ""

    replacements = {
        '🚀': '[Launch] ',
        '🔥': '[Trending] ',
        '💡': '[Idea] ',
        '✨': '[Highlight] ',
        '🙌': '[Applaud] ',
        '📌': '[Pin] ',
        '🔁': '[Repost] ',
        '👉': '-> ',
        '🎯': '[Target] ',
        '📈': '[Growth] ',
        '•': '- ',
        '—': ' - ',
        '–': ' - ',
        '“': '"',
        '”': '"',
        '‘': "'",
        '’': "'",
    }

    for char, repl in replacements.items():
        text = text.replace(char, repl)

    # Filter out remaining high-unicode codepoints (> 255) that Helvetica standard font cannot render
    cleaned_chars = []
    for ch in text:
        if ord(ch) <= 255 or ch in ['\n', '\r', '\t']:
            cleaned_chars.append(ch)
        else:
            cleaned_chars.append(' ')
    text = "".join(cleaned_chars)

    # HTML escape for ReportLab XML parser safety (handles &, <, >)
    escaped = html.escape(text)

    # Convert newline to <br/>
    formatted = escaped.replace('\n', '<br/>')

    # Restore allowed ReportLab <br/> tags
    formatted = formatted.replace('&lt;br/&gt;', '<br/>')

    return formatted

def generate_pdf_report(original_post: str, platform: str, analysis: dict, recommendations: dict, improved_post: str) -> bytes:
    """
    Generates a formatted PDF report summarizing post analysis results using ReportLab.
    Returns PDF file bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#1e1b4b"),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=15
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#312e81"),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b")
    )

    box_style = ParagraphStyle(
        'BoxText',
        parent=body_style,
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    story = []

    # Title Banner
    clean_platform = sanitize_pdf_text(platform)
    rating_label = sanitize_pdf_text(analysis.get('rating_label', ''))
    overall_score = analysis.get('overall_score', 0)

    story.append(Paragraph("Social Media Content Analysis Report", title_style))
    story.append(Paragraph(f"Platform: <b>{clean_platform}</b> | Overall Quality Score: <b>{overall_score}/100 ({rating_label})</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=15))

    # 1. Scores Summary Table
    story.append(Paragraph("1. Content Quality Metrics", section_heading))
    scores = analysis.get("scores", {})
    
    table_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Score</b>", body_style), Paragraph("<b>Status</b>", body_style)],
        ["Hook Quality", f"{scores.get('hook', 0)} / 100", "Strong" if scores.get('hook', 0) >= 70 else "Needs Improvement"],
        ["Content Clarity", f"{scores.get('clarity', 0)} / 100", "Good" if scores.get('clarity', 0) >= 70 else "Fair"],
        ["Readability", f"{scores.get('readability', 0)} / 100", "Optimal" if scores.get('readability', 0) >= 70 else "Complex"],
        ["Call To Action (CTA)", f"{scores.get('cta', 0)} / 100", "Effective" if scores.get('cta', 0) >= 70 else "Weak / Missing"],
        ["Engagement Potential", f"{scores.get('engagement', 0)} / 100", "High" if scores.get('engagement', 0) >= 70 else "Moderate"],
        ["Hashtag Optimization", f"{scores.get('hashtags', 0)} / 100", "Optimal" if scores.get('hashtags', 0) >= 70 else "Sub-optimal"]
    ]

    t = Table(table_data, colWidths=[200, 150, 180])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # 2. Key Recommendations
    story.append(Paragraph("2. Actionable AI Recommendations", section_heading))
    recs = recommendations.get("recommendations", [])
    for rec in recs:
        clean_rec = sanitize_pdf_text(rec)
        story.append(Paragraph(f"- {clean_rec}", body_style))
        story.append(Spacer(1, 3))
        
    story.append(Spacer(1, 10))

    # 3. Original vs Improved Post
    story.append(Paragraph("3. Original Post", section_heading))
    clean_orig = sanitize_pdf_text(original_post)
    story.append(Paragraph(clean_orig, box_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("4. Platform Optimized Improved Post", section_heading))
    clean_imp = sanitize_pdf_text(improved_post)
    story.append(Paragraph(clean_imp, box_style))
    story.append(Spacer(1, 15))

    # Footer note
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0"), spaceBefore=10, spaceAfter=10))
    story.append(Paragraph("Generated by Social Media Content Analyzer - AI Engagement Optimization Engine", subtitle_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

