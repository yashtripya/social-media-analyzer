from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.analyzer_service import analyze_post_content
from app.services.ai_service import generate_ai_recommendations
from app.database import save_analysis

router = APIRouter(prefix="/improve", tags=["AI Recommendations"])

class ImproveRequest(BaseModel):
    text: str
    platform: str = "LinkedIn"
    analysis: Optional[Dict[str, Any]] = None
    save_to_history: bool = True

@router.post("")
async def generate_improvements(req: ImproveRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(
            status_code=400,
            detail="Post text cannot be empty."
        )

    # Compute analysis if not passed
    analysis_data = req.analysis
    if not analysis_data:
        analysis_data = analyze_post_content(text, platform=req.platform)

    # Call AI recommendations service
    recommendations_data = generate_ai_recommendations(text, req.platform, analysis_data)

    # Save to SQLite History DB if enabled
    history_id = None
    if req.save_to_history:
        try:
            score = analysis_data.get("overall_score", 0)
            improved_post = recommendations_data.get("improved_post", "")
            history_id = save_analysis(
                platform=req.platform,
                original_post=text,
                score=score,
                analysis=analysis_data,
                recommendations=recommendations_data,
                improved_post=improved_post
            )
        except Exception as e:
            print(f"[History Save Warning] {str(e)}")

    return {
        "text": text,
        "platform": req.platform,
        "analysis": analysis_data,
        "recommendations": recommendations_data,
        "history_id": history_id
    }
