import io
import fitz  # PyMuPDF
from PIL import Image
import pytesseract

def extract_text_from_pdf(pdf_bytes: bytes) -> dict:
    """
    Extracts text from PDF file bytes using PyMuPDF (fitz).
    Supports multi-page documents, cleans text, and preserves line breaks.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        page_count = len(doc)
        extracted_pages = []
        
        for i in range(page_count):
            page = doc.load_page(i)
            text = page.get_text("text")
            if text and text.strip():
                extracted_pages.append(text.strip())
                
        doc.close()
        
        combined_text = "\n\n".join(extracted_pages).strip()
        
        if not combined_text or len(combined_text) < 10:
            return {
                "success": False,
                "text": "",
                "page_count": page_count,
                "extraction_method": "PyMuPDF",
                "error": "No extractable text found in this PDF. It may be a scanned document or image-only PDF. Please convert pages to PNG/JPG or run OCR."
            }
            
        return {
            "success": True,
            "text": combined_text,
            "page_count": page_count,
            "extraction_method": "PyMuPDF",
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "text": "",
            "page_count": 0,
            "extraction_method": "PyMuPDF",
            "error": f"Failed to extract PDF text: {str(e)}"
        }

def extract_text_from_image(image_bytes: bytes) -> dict:
    """
    Extracts text from image file bytes using Pillow and Tesseract OCR.
    Handles Tesseract missing binary gracefully.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # Basic preprocessing: convert to RGB / grayscale for better OCR accuracy
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Perform OCR
        extracted_text = pytesseract.image_to_string(img)
        cleaned_text = extracted_text.strip()
        
        if not cleaned_text:
            return {
                "success": False,
                "text": "",
                "extraction_method": "Tesseract OCR",
                "error": "OCR processed the image but no text could be recognized. Ensure the image is clear and contains legible post text."
            }
            
        return {
            "success": True,
            "text": cleaned_text,
            "extraction_method": "Tesseract OCR",
            "error": None
        }
    except pytesseract.TesseractNotFoundError:
        return {
            "success": False,
            "text": "",
            "extraction_method": "Tesseract OCR",
            "error": "Tesseract OCR engine executable is not installed or not configured in system PATH. To use image OCR on Windows, install Tesseract OCR (or paste post text directly in the editor)."
        }
    except Exception as e:
        return {
            "success": False,
            "text": "",
            "extraction_method": "Tesseract OCR",
            "error": f"OCR extraction error: {str(e)}"
        }
