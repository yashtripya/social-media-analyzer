from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analyzer_service import analyze_post_content

router = APIRouter(prefix="/analyze", tags=["Content Analysis"])

class AnalyzeRequest(BaseModel):
    text: str
    platform: str = "LinkedIn"

@router.post("")
async def analyze_post(req: AnalyzeRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(
            status_code=400,
            detail="Post text cannot be empty. Please provide text or upload a document."
        )

    analysis_result = analyze_post_content(text, platform=req.platform)
    if "error" in analysis_result:
        raise HTTPException(status_code=400, detail=analysis_result["error"])

    return analysis_result
