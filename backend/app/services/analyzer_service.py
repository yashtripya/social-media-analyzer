import re
import math

# Lexicons for Sentiment & Power Words
POSITIVE_WORDS = {
    "great", "awesome", "amazing", "transform", "growth", "success", "proven", "boost",
    "best", "love", "excited", "happy", "powerful", "ultimate", "win", "value", "free",
    "easy", "master", "unlock", "innovative", "leader", "opportunity", "breakthrough",
    "impact", "results", "inspire", "elevate", "game-changer", "secret", "profit",
    "thrilled", "incredible", "thanks", "thankful", "grateful", "honored", "delighted",
    "proud", "journey", "milestone", "celebrate", "building", "partner", "community",
    "launch", "launched", "double", "productivity", "optimum", "optimized", "optimizer",
    "exclusive", "access", "advantage", "benefit", "valuable", "rewarding", "successful",
    "prosper", "empower", "empowered", "inspiring", "inspired", "welcome", "support", "supported"
}

NEGATIVE_WORDS = {
    "fail", "failure", "bad", "worst", "mistake", "wrong", "problem", "crisis", "hate",
    "stuck", "frustrated", "lose", "risk", "stop", "hard", "tough", "avoid", "costly",
    "danger", "warning", "flaw", "terrible", "struggle", "decline", "fear", "loss", "pain"
}

POWER_HOOK_WORDS = {
    "how", "why", "stop", "secret", "proven", "unpopular", "truth", "mistake", "never",
    "always", "top", "essential", "simple", "hack", "guide", "framework", "blueprint",
    "lessons", "steal", "reasons", "tired", "imagine", "what if"
}

CTA_KEYWORDS = {
    "comment", "reply", "share", "repost", "retweet", "save", "link in bio", "click",
    "check out", "dm me", "subscribe", "follow", "let me know", "tag a friend",
    "tell me below", "drop a", "read more", "sign up", "register", "join"
}

def count_syllables(word: str) -> int:
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
    word = re.sub(r'^y', '', word)
    syllables = len(re.findall(r'[aeiouy]{1,2}', word))
    return max(1, syllables)

def analyze_sentiment(words: list[str]) -> dict:
    pos_count = sum(1 for w in words if w.lower() in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w.lower() in NEGATIVE_WORDS)
    total = pos_count + neg_count
    
    if total == 0:
        return {
            "label": "Neutral",
            "score": 0.0,
            "positive_count": 0,
            "negative_count": 0,
            "tone": "Informative / Neutral"
        }
        
    net_score = (pos_count - neg_count) / max(1, len(words) * 0.05)
    net_score = max(-1.0, min(1.0, net_score))
    
    if pos_count > neg_count:
        label = "Positive"
        tone = "Uplifting & Encouraging"
    elif neg_count > pos_count:
        label = "Negative"
        tone = "Urgent & Problem-focused"
    else:
        label = "Neutral"
        tone = "Balanced & Direct"
        
    return {
        "label": label,
        "score": round(net_score, 2),
        "positive_count": pos_count,
        "negative_count": neg_count,
        "tone": tone
    }

def analyze_post_content(text: str, platform: str = "LinkedIn") -> dict:
    """
    Comprehensive social media content analyzer calculating explainable scores and metrics.
    """
    cleaned_text = text.strip()
    if not cleaned_text:
        return {
            "error": "Input text is empty"
        }

    # Line & Paragraph Split
    lines = [line.strip() for line in cleaned_text.splitlines() if line.strip()]
    paragraphs = [p.strip() for p in cleaned_text.split("\n\n") if p.strip()]

    # Sentences split
    sentences = [s.strip() for s in re.split(r'[.!?]+', cleaned_text) if s.strip()]
    sentence_count = max(1, len(sentences))

    # Words split
    raw_words = re.findall(r'\b\w+\b', cleaned_text)
    word_count = max(1, len(raw_words))
    char_count = len(cleaned_text)
    avg_sentence_length = round(word_count / sentence_count, 1)

    # Social Elements
    hashtags = re.findall(r'#\w+', cleaned_text)
    hashtag_count = len(hashtags)
    questions = re.findall(r'\?', cleaned_text)
    question_count = len(questions)
    mentions = re.findall(r'@\w+', cleaned_text)
    mention_count = len(mentions)
    urls = re.findall(r'https?://[^\s]+|www\.[^\s]+', cleaned_text)
    url_count = len(urls)

    # 1. READABILITY SCORE (0-100)
    total_syllables = sum(count_syllables(w) for w in raw_words)
    syllables_per_word = total_syllables / word_count
    # Flesch Reading Ease Formula
    flesch_score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * syllables_per_word)
    readability_score = max(0, min(100, int(round(flesch_score))))

    # 2. HOOK QUALITY SCORE (0-100)
    first_sentence = sentences[0] if sentences else ""
    first_line = lines[0] if lines else ""
    hook_text = first_line.lower()
    
    hook_score = 50  # Base
    # Check length (short, punchy opening is best)
    first_sentence_words = len(re.findall(r'\b\w+\b', first_sentence))
    if 3 <= first_sentence_words <= 12:
        hook_score += 20
    elif first_sentence_words <= 18:
        hook_score += 10

    # Power words check
    power_matches = [w for w in POWER_HOOK_WORDS if w in hook_text]
    if power_matches:
        hook_score += min(20, len(power_matches) * 10)

    # Numbers in hook (e.g., "5 mistakes...", "3 ways...")
    if re.search(r'\b\d+\b', hook_text):
        hook_score += 15

    # Question hook
    if "?" in first_line:
        hook_score += 10

    hook_score = max(20, min(100, hook_score))

    # 3. CONTENT CLARITY SCORE (0-100)
    clarity_score = 70  # Base
    # Penalize giant unformatted blocks of text
    if len(paragraphs) == 1 and word_count > 60:
        clarity_score -= 25
    elif len(paragraphs) >= 2:
        clarity_score += 15

    # Ideal average sentence length is 10 to 18 words for social reading
    if 8 <= avg_sentence_length <= 16:
        clarity_score += 15
    elif avg_sentence_length > 25:
        clarity_score -= 15

    clarity_score = max(20, min(100, clarity_score))

    # 4. CTA PRESENCE & QUALITY SCORE (0-100)
    cta_detected = False
    cta_score = 20  # Base if no CTA found
    lower_text = cleaned_text.lower()
    
    found_ctas = []
    for cta_kw in CTA_KEYWORDS:
        if cta_kw in lower_text:
            cta_detected = True
            found_ctas.append(cta_kw)
            
    if cta_detected:
        cta_score = 70
        # Check if CTA is in the final lines/paragraph
        last_paragraph = paragraphs[-1].lower() if paragraphs else ""
        if any(kw in last_paragraph for kw in CTA_KEYWORDS):
            cta_score += 20
        if question_count > 0:
            cta_score += 10
    else:
        # Check if ending with a question mark as implicit CTA
        if sentences and "?" in sentences[-1]:
            cta_detected = True
            cta_score = 65

    cta_score = max(10, min(100, cta_score))

    # 5. HASHTAG RELEVANCE & QUALITY SCORE (0-100)
    hashtag_score = 70
    if platform.lower() in ["instagram"]:
        if 3 <= hashtag_count <= 15:
            hashtag_score = 90
        elif hashtag_count == 0:
            hashtag_score = 40
        else:
            hashtag_score = 75
    elif platform.lower() in ["linkedin"]:
        if 3 <= hashtag_count <= 5:
            hashtag_score = 95
        elif hashtag_count > 7:
            hashtag_score = 55
        elif hashtag_count == 0:
            hashtag_score = 50
    elif platform.lower() in ["twitter", "x/twitter", "x"]:
        if 1 <= hashtag_count <= 3:
            hashtag_score = 90
        elif hashtag_count > 4:
            hashtag_score = 50
        elif hashtag_count == 0:
            hashtag_score = 65
    else:  # Facebook / default
        if 1 <= hashtag_count <= 3:
            hashtag_score = 85
        else:
            hashtag_score = 70

    # 6. ENGAGEMENT POTENTIAL SCORE (0-100)
    engagement_score = int(round(
        (hook_score * 0.3) +
        (cta_score * 0.3) +
        (15 if question_count >= 1 else 0) +
        (15 if 40 <= word_count <= 250 else 5) +
        (10 if len(paragraphs) > 1 else 0)
    ))
    engagement_score = max(20, min(100, engagement_score))

    # 7. OVERALL CONTENT QUALITY SCORE (0-100)
    overall_score = int(round(
        (hook_score * 0.20) +
        (clarity_score * 0.20) +
        (readability_score * 0.20) +
        (cta_score * 0.20) +
        (engagement_score * 0.10) +
        (hashtag_score * 0.10)
    ))
    overall_score = max(10, min(100, overall_score))

    # Rating Tier
    if overall_score >= 85:
        rating_label = "Viral Ready"
        rating_color = "#10b981"
    elif overall_score >= 70:
        rating_label = "Good Content"
        rating_color = "#3b82f6"
    elif overall_score >= 50:
        rating_label = "Needs Optimization"
        rating_color = "#f59e0b"
    else:
        rating_label = "Needs Work"
        rating_color = "#ef4444"

    # Sentiment Analysis
    sentiment_data = analyze_sentiment(raw_words)

    return {
        "overall_score": overall_score,
        "rating_label": rating_label,
        "rating_color": rating_color,
        "platform": platform,
        "scores": {
            "hook": hook_score,
            "clarity": clarity_score,
            "readability": readability_score,
            "cta": cta_score,
            "engagement": engagement_score,
            "hashtags": hashtag_score
        },
        "basic_metrics": {
            "word_count": word_count,
            "char_count": char_count,
            "sentence_count": sentence_count,
            "avg_sentence_length": avg_sentence_length
        },
        "social_elements": {
            "hashtag_count": hashtag_count,
            "hashtags": hashtags,
            "question_count": question_count,
            "mention_count": mention_count,
            "mentions": mentions,
            "url_count": url_count,
            "urls": urls,
            "cta_detected": cta_detected,
            "detected_ctas": found_ctas
        },
        "sentiment": sentiment_data
    }
