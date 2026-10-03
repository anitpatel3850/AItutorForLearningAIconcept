import re
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, IndexModel
from app.config import settings

logger = logging.getLogger("ai_quest.database")

class MongoDBManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

mongo_manager = MongoDBManager()

def mask_mongo_uri(uri: str) -> str:
    """Masks credentials in MongoDB URI to prevent secret leakage in logs."""
    if not uri:
        return "<EMPTY>"
    try:
        # Match mongodb://user:pass@host or mongodb+srv://user:pass@host
        return re.sub(r'://([^:]+):([^@]+)@', r'://\1:****@', uri)
    except Exception:
        return "<MASKED_URI>"

async def connect_to_mongo():
    """Initializes the MongoDB connection and establishes collections & indexes."""
    if not settings.MONGODB_URI:
        logger.warning("[MongoDB] MONGODB_URI is not set. Database persistence will be disabled until configured.")
        mongo_manager.is_connected = False
        return

    masked_uri = mask_mongo_uri(settings.MONGODB_URI)
    logger.info(f"[MongoDB] Connecting to MongoDB Atlas / Instance at {masked_uri} (db: {settings.MONGODB_DATABASE})...")

    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        db = client[settings.MONGODB_DATABASE]

        # Verify connectivity via ping command
        await db.command("ping")
        mongo_manager.client = client
        mongo_manager.db = db
        mongo_manager.is_connected = True
        logger.info(f"[MongoDB] Successfully connected to MongoDB database '{settings.MONGODB_DATABASE}'.")

        # Create indexes
        await init_mongo_indexes()
    except Exception as e:
        mongo_manager.is_connected = False
        logger.error(f"[MongoDB] Connection warning (running in resilient mode): {e}")

async def close_mongo_connection():
    """Closes the MongoDB connection cleanly on shutdown."""
    if mongo_manager.client:
        logger.info("[MongoDB] Closing MongoDB client connection...")
        mongo_manager.client.close()
        mongo_manager.client = None
        mongo_manager.db = None
        mongo_manager.is_connected = False
        logger.info("[MongoDB] Connection closed cleanly.")

async def init_mongo_indexes():
    """Ensures required indexes exist across all application collections."""
    if not mongo_manager.is_connected or mongo_manager.db is None:
        return

    try:
        db = mongo_manager.db

        # 1. users: unique username and unique email (sparse)
        await db.users.create_indexes([
            IndexModel([("username", ASCENDING)], unique=True, name="idx_users_username_unique"),
            IndexModel([("email", ASCENDING)], unique=True, sparse=True, name="idx_users_email_unique"),
            IndexModel([("id", ASCENDING)], unique=True, name="idx_users_id_unique"),
        ])

        # 2. user_sessions / learning state
        await db.user_sessions.create_indexes([
            IndexModel([("user_id", ASCENDING)], unique=True, name="idx_user_sessions_user_id"),
            IndexModel([("id", ASCENDING)], unique=True, name="idx_user_sessions_id"),
        ])

        # 3. courses_progress: compound user_id + course_id
        await db.courses_progress.create_indexes([
            IndexModel([("user_id", ASCENDING), ("course_id", ASCENDING)], unique=True, name="idx_course_progress_user_course"),
        ])

        # 4. bookmarks: compound user_id + lesson_id
        await db.bookmarks.create_indexes([
            IndexModel([("user_id", ASCENDING), ("lesson_id", ASCENDING)], unique=True, name="idx_bookmarks_user_lesson"),
            IndexModel([("user_id", ASCENDING)], name="idx_bookmarks_user"),
        ])

        # 5. conversations: id (unique), user_id
        await db.conversations.create_indexes([
            IndexModel([("id", ASCENDING)], unique=True, name="idx_conversations_id"),
            IndexModel([("user_id", ASCENDING)], name="idx_conversations_user_id"),
            IndexModel([("updated_at", ASCENDING)], name="idx_conversations_updated_at"),
        ])

        # 6. messages: id (unique), conversation_id + created_at
        await db.messages.create_indexes([
            IndexModel([("id", ASCENDING)], unique=True, name="idx_messages_id"),
            IndexModel([("conversation_id", ASCENDING), ("created_at", ASCENDING)], name="idx_messages_conv_created"),
        ])

        # 7. quiz_evaluations: id (unique), user_id
        await db.quiz_evaluations.create_indexes([
            IndexModel([("id", ASCENDING)], unique=True, name="idx_quiz_evaluations_id"),
            IndexModel([("user_id", ASCENDING)], name="idx_quiz_evaluations_user_id"),
            IndexModel([("created_at", ASCENDING)], name="idx_quiz_evaluations_created_at"),
        ])

        logger.info("[MongoDB] All collections & indexes initialized successfully.")
    except Exception as e:
        logger.warning(f"[MongoDB] Index creation note: {e}")

async def get_db() -> AsyncIOMotorDatabase:
    """Dependency provider returning the active MongoDB database."""
    if mongo_manager.db is None:
        raise RuntimeError("MongoDB connection is not established. Verify MONGODB_URI in settings.")
    return mongo_manager.db
