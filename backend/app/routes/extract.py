from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from app.services.extractor_service import extract_text_from_pdf, extract_text_from_image

router = APIRouter(prefix="/extract", tags=["Document Extraction"])

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit

@router.post("")
async def extract_document_text(file: UploadFile = File(...)):
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported formats: PDF, PNG, JPG, JPEG."
        )

    # Read content
    contents = await file.read()
    file_size = len(contents)

    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty (0 bytes)."
        )

    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum limit of 10 MB ({round(file_size / (1024*1024), 2)} MB)."
        )

    if ext == ".pdf":
        result = extract_text_from_pdf(contents)
    else:  # PNG, JPG, JPEG
        result = extract_text_from_image(contents)

    result["filename"] = filename
    result["file_size_kb"] = round(file_size / 1024, 1)

    if not result.get("success"):
        raise HTTPException(
            status_code=422,
            detail=result.get("error", "Text extraction failed.")
        )

    return result
