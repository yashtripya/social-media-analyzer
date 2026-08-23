import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.services.analyzer_service import analyze_post_content, count_syllables
from app.services.ai_service import generate_fallback_recommendations

def run_all_tests():
    print("==================================================")
    print("   Running SocialIQ Automated Test Suite")
    print("==================================================")
    
    passed = 0
    failed = 0

    def test(name, fn):
        nonlocal passed, failed
        try:
            fn()
            print(f"  [PASS] {name}")
            passed += 1
        except Exception as e:
            import traceback
            print(f"  [FAIL] {name}: {str(e)}")
            traceback.print_exc()
            failed += 1

    def t_count_syllables():
        assert count_syllables("hello") == 2
        assert count_syllables("artificially") >= 3
        assert count_syllables("the") == 1

    def t_linkedin_analysis():
        text = "I am thrilled to announce that I've joined Deloitte as a Senior AI Engineer!\n\nHuge thanks to my team. What career advice helped you most?"
        res = analyze_post_content(text, platform="LinkedIn")
        print("LINKEDIN METRICS:", res)
        assert res["overall_score"] >= 50
        assert res["scores"]["hook"] >= 50
        assert res["social_elements"]["cta_detected"] is True

    def t_instagram_analysis():
        text = "Stop scrolling! 🔥 Check out our new AI content optimizer.\n\n#AI #TechTools #SaaS #Productivity #Coding"
        res = analyze_post_content(text, platform="Instagram")
        assert res["scores"]["hashtags"] >= 80
        assert res["social_elements"]["hashtag_count"] == 5

    def t_unformatted_raw_text():
        text = "artificial intelligence is transforming software engineering in 2026."
        res = analyze_post_content(text, platform="LinkedIn")
        assert res["overall_score"] > 0
        assert res["social_elements"]["cta_detected"] is False

    def t_ai_fallback():
        text = "Check out my new blog post on AI agent architecture."
        analysis = analyze_post_content(text, platform="LinkedIn")
        recs = generate_fallback_recommendations(text, platform="LinkedIn", analysis=analysis)
        assert "improved_hook" in recs
        assert "improved_cta" in recs
        assert "improved_post" in recs
        assert len(recs["hashtags"]) >= 3

    def t_state_independence():
        res1 = analyze_post_content("Short post 1", platform="LinkedIn")
        res2 = analyze_post_content("This is a much longer post with many words and a question? #tech", platform="Instagram")
        assert res1["basic_metrics"]["word_count"] != res2["basic_metrics"]["word_count"]
        assert res1["scores"]["hashtags"] != res2["scores"]["hashtags"]

    test("Syllable Counting Logic", t_count_syllables)
    test("LinkedIn Sample Analysis", t_linkedin_analysis)
    test("Instagram Sample Analysis", t_instagram_analysis)
    test("Unformatted Raw Text Analysis", t_unformatted_raw_text)
    test("AI Fallback Engine Generation", t_ai_fallback)
    test("State Independence Across Analysis Requests", t_state_independence)

    print("==================================================")
    print(f"   Test Summary: {passed} PASSED, {failed} FAILED")
    print("==================================================")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()
