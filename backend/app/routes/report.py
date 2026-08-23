from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.report_service import generate_pdf_report

router = APIRouter(prefix="/export-pdf", tags=["PDF Report Export"])

class ExportReportRequest(BaseModel):
    original_post: str
    platform: str = "LinkedIn"
    analysis: Dict[str, Any]
    recommendations: Dict[str, Any]
    improved_post: str

@router.post("")
async def export_pdf_report(req: ExportReportRequest):
    try:
        pdf_bytes = generate_pdf_report(
            original_post=req.original_post,
            platform=req.platform,
            analysis=req.analysis,
            recommendations=req.recommendations,
            improved_post=req.improved_post
        )
        
        filename = f"Social_Media_Analysis_{req.platform}_Report.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate PDF report: {str(e)}"
        )
