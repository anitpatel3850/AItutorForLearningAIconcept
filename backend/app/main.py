import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection, mongo_manager
from app.api.routes import router as tutor_router
from app.api.auth_routes import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Lifecycle initialization for MongoDB Atlas connection
    await connect_to_mongo()
    yield
    # Clean shutdown on application exit
    await close_mongo_connection()

app = FastAPI(
    title="AI Quest - Real AI Tutor & Game Engine Service",
    description="Backend service with MongoDB Atlas persistence and Gemini 3.5 Flash Lite adaptive AI Tutor.",
    version="2.0.0",
    lifespan=lifespan
)

# PRIMARY root-independent health endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "database": "connected" if mongo_manager.is_connected else "disconnected",
        "storage": "MongoDB Atlas",
        "database_name": settings.MONGODB_DATABASE if mongo_manager.is_connected else None
    }

# CORS configuration for local development and production
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
app.include_router(auth_router)

@app.get("/")
async def root():
    return {
        "message": "AI Quest Real AI Tutor & MongoDB Game Engine Backend is running.",
        "documentation": "/docs",
        "health": "/health",
        "database_status": "connected" if mongo_manager.is_connected else "disconnected"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", str(settings.PORT)))
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=port,
        reload=settings.DEBUG
    )