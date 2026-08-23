import pytest
from app.services.analyzer_service import analyze_post_content, count_syllables
from app.services.ai_service import generate_fallback_recommendations

def test_count_syllables():
    assert count_syllables("hello") == 2
    assert count_syllables("artificially") >= 3
    assert count_syllables("the") == 1

def test_analyzer_service_linkedin_sample():
    sample_text = (
        "I am thrilled to announce that I've joined Deloitte as a Senior AI Software Engineer!\n\n"
        "After 4 incredible years of building scale systems, I am embarking on a new journey focused on building production agentic AI tools.\n\n"
        "Huge thanks to my mentors and team. What is the #1 piece of career advice that helped you most? Let me know in the comments below!"
    )
    result = analyze_post_content(sample_text, platform="LinkedIn")
    
    assert "overall_score" in result
    assert result["overall_score"] >= 50
    assert result["scores"]["hook"] >= 70
    assert result["social_elements"]["cta_detected"] is True
    assert result["social_elements"]["question_count"] >= 1

def test_analyzer_service_instagram_sample():
    sample_text = (
        "Stop scrolling! 🔥 Check out our new AI content optimizer.\n\n"
        "Boost your social media engagement by 3x with automated score auditing.\n\n"
        "Comment 'DEMO' to get early access! Link in bio.\n\n"
        "#AI #TechTools #SaaS #Productivity #Coding"
    )
    result = analyze_post_content(sample_text, platform="Instagram")
    
    assert result["scores"]["hashtags"] >= 80
    assert result["social_elements"]["hashtag_count"] == 5
    assert result["social_elements"]["cta_detected"] is True

def test_analyzer_unformatted_raw_text():
    sample_text = "artificial intelligence is transforming software engineering in 2026. developers need to master new tools."
    result = analyze_post_content(sample_text, platform="LinkedIn")
    
    assert result["overall_score"] > 0
    # No CTA in raw text
    assert result["social_elements"]["cta_detected"] is False

def test_ai_fallback_recommendations():
    sample_text = "Check out my new blog post on AI agent architecture."
    analysis = analyze_post_content(sample_text, platform="LinkedIn")
    recs = generate_fallback_recommendations(sample_text, platform="LinkedIn", analysis=analysis)
    
    assert "improved_hook" in recs
    assert "improved_cta" in recs
    assert "improved_post" in recs
    assert len(recs["hashtags"]) >= 3

def test_state_independence():
    # Verify two distinct calls return independent metric objects
    res1 = analyze_post_content("Short post 1", platform="LinkedIn")
    res2 = analyze_post_content("This is a much longer post with many words and a question? #tech", platform="Instagram")
    
    assert res1["basic_metrics"]["word_count"] != res2["basic_metrics"]["word_count"]
    assert res1["scores"]["hashtags"] != res2["scores"]["hashtags"]
