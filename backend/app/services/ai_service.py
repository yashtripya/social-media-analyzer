import json
import re
from app.config import settings

def generate_fallback_recommendations(text: str, platform: str, analysis: dict) -> dict:
    """
    Smart, deterministic offline AI recommendation engine used when Gemini API key is unavailable or fails.
    Generates high quality, platform-tailored post improvements.
    """
    scores = analysis.get("scores", {})
    hook_score = scores.get("hook", 50)
    cta_score = scores.get("cta", 50)
    clarity_score = scores.get("clarity", 50)
    hashtags_score = scores.get("hashtags", 50)
    basic = analysis.get("basic_metrics", {})
    social = analysis.get("social_elements", {})

    lines = [line.strip() for line in text.strip().splitlines() if line.strip()]
    first_line = lines[0] if lines else text.strip()[:60]
    
    # 1. Recommendations List
    recs = []
    if hook_score < 75:
        recs.append("Strengthen your opening hook: Lead with a bold statement, question, or counter-intuitive stat to stop the scroll.")
    else:
        recs.append("Great hook opening! Maintain this punchy tone in future posts.")

    if cta_score < 70:
        recs.append("Add a direct, specific Call to Action (CTA) at the end asking readers to comment, share, or click a link.")
    else:
        recs.append("Solid call-to-action detected. Ensure it aligns directly with your post's main goal.")

    if clarity_score < 70:
        recs.append("Break down wall of text into smaller 1-2 sentence paragraphs with whitespace for mobile readability.")
    else:
        recs.append("Good line spacing and visual structure.")

    if social.get("question_count", 0) == 0:
        recs.append("End your post with an open-ended question to boost comment section engagement.")

    if social.get("hashtag_count", 0) < 3:
        recs.append(f"Add 3-5 niche-relevant hashtags targeted for {platform} to improve content discoverability.")

    # 2. Improved Hook Generation
    is_announcement = any(word in text.lower() for word in ["excited", "thrilled", "joined", "announced", "happy to share", "starting", "hired", "deloitte", "google", "microsoft", "amazon", "promoted"])

    if is_announcement:
        improved_hook = f"🚀 Big Personal News! {first_line}"
    elif "?" in first_line:
        improved_hook = f"Here is the truth behind: \"{first_line.strip('?')}\""
    elif re.search(r'\b(how|why|stop|never|always)\b', first_line.lower()):
        improved_hook = f"🔥 {first_line.strip('.')} — Here is the step-by-step breakdown:"
    else:
        improved_hook = f"💡 {first_line}"

    # 3. Improved CTA Generation
    if is_announcement:
        improved_cta = "🙌 Thank you to everyone who has been part of my journey! Feel free to connect or drop a message below."
    elif platform.lower() == "linkedin":
        improved_cta = "💡 Have you experienced this in your work? Drop your perspective in the comments below!"
    elif platform.lower() == "instagram":
        improved_cta = "📌 Save this post for later and double-tap if you agree! Link in bio for full details."
    elif platform.lower() in ["twitter", "x/twitter", "x"]:
        improved_cta = "🔁 Repost if this helped and reply with your top takeaway below!"
    else:  # Facebook
        improved_cta = "👉 Share this with your network and leave a comment below with your thoughts!"

    # 4. Smart Topic & Hashtag Extraction
    stop_words = {
        "this", "that", "with", "from", "have", "your", "yours", "more", "make", "just", "along", "so", "far",
        "here", "they", "them", "been", "were", "what", "which", "when", "where", "how", "who", "will",
        "some", "like", "stop", "start", "check", "click", "know", "make", "take", "look", "getting",
        "doing", "think", "want", "need", "using", "write", "writing", "read", "share", "follow",
        "scrolling", "scroll", "below", "above", "today", "yesterday", "tomorrow", "about", "their",
        "there", "would", "could", "should", "being", "first", "second", "third", "other", "also", "into",
        "double", "launch", "launched", "designed", "creators", "developers", "posting", "posts"
    }

    # Extract clean topic keywords
    raw_keywords = re.findall(r'\b[A-Za-z]{4,}\b', text)
    filtered_keywords = [w.title() for w in raw_keywords if w.lower() not in stop_words]
    unique_kw = list(dict.fromkeys(filtered_keywords))

    # Domain topic mapping for natural question phrasing
    domain_topics = {
        "coding": "coding productivity and developer workflows",
        "developer": "developer productivity and tool selection",
        "productivity": "boosting productivity and daily output",
        "software": "software engineering and architecture",
        "engineering": "engineering leadership and scale",
        "ai": "leveraging AI tools in your workflow",
        "tech": "navigating new tech tools and frameworks",
        "career": "career growth and professional development",
        "marketing": "content marketing and audience growth",
        "growth": "scaling audience reach and engagement",
        "automation": "workflow automation and optimization",
        "design": "user experience and design systems",
        "social": "social media strategy and engagement",
        "content": "content creation and audience strategy",
        "business": "business strategy and growth",
        "creator": "content creation and creator workflows",
        "data": "data analytics and insights"
    }

    lower_text = text.lower()
    matched_topic_phrase = None
    for key, phrase in domain_topics.items():
        if key in lower_text:
            matched_topic_phrase = phrase
            break

    suggested_tags = [f"#{kw}" for kw in unique_kw[:3] if len(kw) >= 4]
    default_tags = [f"#{platform}Strategy", "#CareerGrowth", "#ProfessionalDevelopment", "#TechCommunity"]
    all_tags = list(dict.fromkeys(suggested_tags + default_tags))[:5]

    # 5. Engagement Question Generation
    if is_announcement:
        engagement_question = "What is the #1 piece of career advice that helped you most in your professional journey?"
    elif matched_topic_phrase:
        engagement_question = f"What is your #1 biggest challenge when it comes to {matched_topic_phrase}?"
    elif unique_kw and len(unique_kw[0]) > 4:
        engagement_question = f"What is your top perspective or takeaway when it comes to {unique_kw[0].lower()}?"
    else:
        engagement_question = "What is your #1 takeaway or experience regarding this topic? Drop a comment below!"

    # 6. Platform-tailored Improved Post Rewrite
    body_rest = "\n\n".join(lines[1:]) if len(lines) > 1 else text.strip()
    
    if platform.lower() == "linkedin":
        if is_announcement:
            improved_post = (
                f"{improved_hook}\n\n"
                f"{body_rest}\n\n"
                f"{improved_cta}\n\n"
                f"{' '.join(all_tags)}"
            ).strip()
        else:
            improved_post = (
                f"{improved_hook}\n\n"
                f"{body_rest}\n\n"
                f"Key Takeaways:\n"
                f"1. Focus on clarity over complexity\n"
                f"2. Keep sentences concise\n"
                f"3. Deliver actionable value\n\n"
                f"{improved_cta}\n\n"
                f"{' '.join(all_tags)}"
            )
    elif platform.lower() == "instagram":
        improved_post = (
            f"{improved_hook}\n\n"
            f"✨ {body_rest}\n\n"
            f"{improved_cta}\n.\n.\n"
            f"{' '.join(all_tags)}"
        )
    elif platform.lower() in ["twitter", "x/twitter", "x"]:
        improved_post = (
            f"{improved_hook}\n\n"
            f"{body_rest[:180]}\n\n"
            f"{improved_cta}\n\n"
            f"{' '.join(all_tags[:3])}"
        )
    else:  # Facebook
        improved_post = (
            f"{improved_hook}\n\n"
            f"{body_rest}\n\n"
            f"{engagement_question}\n\n"
            f"{improved_cta}\n\n"
            f"{' '.join(all_tags)}"
        )

    summary = (
        f"Your post scores {analysis.get('overall_score', 70)}/100 for {platform}. "
        f"The post has {analysis.get('rating_label', 'good potential')}. "
        f"By sharpening your opening hook and adding a strong CTA, you can significantly boost engagement."
    )

    return {
        "summary": summary,
        "recommendations": recs[:5],
        "improved_hook": improved_hook,
        "improved_cta": improved_cta,
        "hashtags": all_tags,
        "engagement_question": engagement_question,
        "improved_post": improved_post
    }

def generate_ai_recommendations(text: str, platform: str, analysis: dict) -> dict:
    """
    Main AI service entry point. Uses Gemini API when GEMINI_API_KEY is configured,
    or smoothly falls back to the deterministic recommendation engine.
    """
    api_key = settings.GEMINI_API_KEY.strip()
    
    if not api_key or api_key == "your_gemini_api_key_here":
        # Fallback engine
        return generate_fallback_recommendations(text, platform, analysis)

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
You are an expert Social Media Content Strategist and Copywriter.
Analyze the following post intended for {platform}.

POST CONTENT:
\"\"\"
{text}
\"\"\"

ANALYSIS DATA:
- Overall Content Score: {analysis.get('overall_score')}/100
- Hook Quality Score: {analysis.get('scores', {}).get('hook')}/100
- CTA Quality Score: {analysis.get('scores', {}).get('cta')}/100
- Readability Score: {analysis.get('scores', {}).get('readability')}/100
- Sentiment: {analysis.get('sentiment', {}).get('label')}

Your task is to return a strict valid JSON object (and NOTHING else) with the following structure:
{{
  "summary": "Brief 2-3 sentence overview of post quality and key areas to improve for {platform}.",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4"
  ],
  "improved_hook": "A magnetic opening line (first sentence) designed for {platform}.",
  "improved_cta": "A compelling, specific call-to-action.",
  "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
  "engagement_question": "A clear question to spark comments in the response section.",
  "improved_post": "The full rewritten post formatted perfectly for {platform} incorporating line breaks, emojis if appropriate, the improved hook, clear value, CTA, and hashtags."
}}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        raw_text = response.text.strip()
        # Clean markdown formatting if returned
        clean_json = re.sub(r'^```json\s*|\s*```$', '', raw_text, flags=re.MULTILINE).strip()
        parsed = json.loads(clean_json)
        
        # Ensure all required keys exist
        required_keys = ["summary", "recommendations", "improved_hook", "improved_cta", "hashtags", "engagement_question", "improved_post"]
        for key in required_keys:
            if key not in parsed:
                raise ValueError(f"Missing key in LLM response: {key}")
                
        return parsed

    except Exception as e:
        print(f"[AI Service Warning] Gemini API call failed or unavailable ({str(e)}). Using smart fallback engine.")
        return generate_fallback_recommendations(text, platform, analysis)
