import os
import asyncio
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.database import init_db
from app.api.routes import router as tutor_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Non-blocking / resilient database initialization
    try:
        async with asyncio.timeout(5.0):
            await init_db()
    except Exception as e:
        print(f"Database initialization note: {e}")
    yield

app = FastAPI(
    title="AI Quest - Real AI Tutor Agent Service",
    description="Adaptive AI Tutor Agent powered by OpenAI Agents SDK and curriculum learning context.",
    version="1.0.0",
    lifespan=lifespan
)

# PRIMARY root-independent health endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor_router)

@app.get("/")
async def root():
    return {
        "message": "AI Quest Real AI Tutor Agent Backend is running.",
        "documentation": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )