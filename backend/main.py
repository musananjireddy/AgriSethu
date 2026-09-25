from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import edge_tts
import uuid

from crop_ai import analyze_crop_image

app = FastAPI(title="AgriAgent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AgriAgent backend is running"}

@app.post("/api/tts/telugu")
async def telugu_tts(text: str = Form(...)):
    output_dir = Path("tts_cache")
    output_dir.mkdir(exist_ok=True)

    filename = f"{uuid.uuid4().hex}.mp3"
    output_path = output_dir / filename

    communicate = edge_tts.Communicate(
        text,
        "te-IN-ShrutiNeural",
    )
    await communicate.save(str(output_path))

    return FileResponse(
        path=str(output_path),
        media_type="audio/mpeg",
        filename="telugu_analysis.mp3",
    )


@app.post("/api/crop/analyze")
async def analyze_crop(
    file: UploadFile = File(...),
    language: str = Form("en"),
):
    image_bytes = await file.read()

    result = analyze_crop_image(
        image_bytes=image_bytes,
        mime_type=file.content_type or "image/jpeg",
        language=language,
    )

    return {
        "message": "Crop analysis completed",
        "filename": file.filename,
        "language": language,
        "analysis": result,
    }



