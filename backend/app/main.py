from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.database import init_db
from app.routes import extract, analyze, improve, history, report

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI-powered social media content analyzer and engagement optimization API."
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event: Initialize SQLite Database
@app.on_event("startup")
def on_startup():
    init_db()

# Register API Routers
app.include_router(extract.router, prefix=settings.API_PREFIX)
app.include_router(analyze.router, prefix=settings.API_PREFIX)
app.include_router(improve.router, prefix=settings.API_PREFIX)
app.include_router(history.router, prefix=settings.API_PREFIX)
app.include_router(report.router, prefix=settings.API_PREFIX)

@app.get(f"{settings.API_PREFIX}/health", tags=["Health Check"])
async def health_check():
    has_gemini_key = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_engine": "Gemini API" if has_gemini_key else "Smart Offline Engine (Fallback)"
    }

# Mount Frontend Static Files for Production / Public Deployment
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", tags=["Frontend"])
    async def serve_frontend(full_path: str = ""):
        target_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
