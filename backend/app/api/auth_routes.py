import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_db, mongo_manager
from app.models.schemas import (
    UserSignUpRequest,
    UserLoginRequest,
    GoogleAuthRequest,
    UserProfileUpdateRequest,
    UserProgressUpdateRequest,
    CourseProgressSaveRequest,
    BookmarkSaveRequest,
    AuthResponse
)
from app.utils.security import hash_password, verify_password

logger = logging.getLogger("ai_quest.auth_routes")

router = APIRouter(prefix="/api", tags=["auth_and_progress"])

# Default initial demo user state template
DEFAULT_DEMO_USER: Dict[str, Any] = {
    "id": "usr-explorer-01",
    "username": "AI Explorer",
    "fullName": "Alex Mercer",
    "email": "explorer@aiquest.io",
    "avatar": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    "title": "Deep Wanderer",
    "aiLevel": "Intermediate",
    "learningGoal": "Machine Learning",
    "mentor": "Coach",
    "level": 14,
    "xp": 4850,
    "streak": 12,
    "lastActiveDate": datetime.utcnow().strftime("%Y-%m-%d"),
    "completedMissions": ["m-01", "m-02", "m-03"],
    "completedQuests": ["quest-fund-1"],
    "defeatedBosses": [],
    "unlockedAchievements": ["ach-first-quest", "ach-ai-explorer", "ach-streak-7", "ach-python-warrior"],
    "mastery": {
        "AI Fundamentals": 88,
        "Machine Learning": 65,
        "Deep Learning": 28,
        "Computer Vision": 15,
        "NLP": 10,
        "Generative AI": 12,
    },
    "soundEnabled": True,
    "hasOnboarded": True,
    "isAuthenticated": True,
}

def sanitize_user_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Removes internal MongoDB _id and password_hash before returning to client."""
    if not doc:
        return None
    cleaned = dict(doc)
    cleaned.pop("_id", None)
    cleaned.pop("password_hash", None)
    cleaned["isAuthenticated"] = True
    return cleaned

async def ensure_demo_user(db: AsyncIOMotorDatabase):
    """Ensures the rich demo user exists in MongoDB."""
    existing = await db.users.find_one({"$or": [{"id": DEFAULT_DEMO_USER["id"]}, {"email": DEFAULT_DEMO_USER["email"]}]})
    if not existing:
        demo_record = dict(DEFAULT_DEMO_USER)
        demo_record["password_hash"] = hash_password("explorer123")
        demo_record["created_at"] = datetime.utcnow()
        demo_record["updated_at"] = datetime.utcnow()
        await db.users.insert_one(demo_record)
        logger.info("[MongoDB] Seeded default AI Explorer demo user.")

@router.post("/auth/signup", response_model=AuthResponse)
async def signup(payload: UserSignUpRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Registers a new user into MongoDB with hashed password."""
    username = payload.username.strip()
    email = payload.email.strip().lower()

    # Check if user already exists
    existing = await db.users.find_one({"$or": [{"username": username}, {"email": email}]})
    if existing:
        if existing.get("username", "").lower() == username.lower():
            return AuthResponse(success=False, error="A user with that username already exists.")
        return AuthResponse(success=False, error="An account with that email already exists.")

    user_id = f"usr-{username.lower().replace(' ', '_')}-{uuid.uuid4().hex[:6]}"
    hashed_pw = hash_password(payload.password)

    user_doc = {
        "id": user_id,
        "username": username,
        "fullName": payload.fullName.strip(),
        "email": email,
        "avatar": "",
        "title": "Neural Novice",
        "aiLevel": "Beginner",
        "learningGoal": "Machine Learning",
        "mentor": "Coach",
        "level": 1,
        "xp": 0,
        "streak": 1,
        "lastActiveDate": datetime.utcnow().strftime("%Y-%m-%d"),
        "completedMissions": [],
        "completedQuests": [],
        "defeatedBosses": [],
        "unlockedAchievements": [],
        "mastery": {
            "AI Fundamentals": 0,
            "Machine Learning": 0,
            "Deep Learning": 0,
            "Computer Vision": 0,
            "NLP": 0,
            "Generative AI": 0,
        },
        "soundEnabled": True,
        "hasOnboarded": False,
        "password_hash": hashed_pw,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await db.users.insert_one(user_doc)

    # Initialize learning state in user_sessions
    await db.user_sessions.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "id": f"sess-{user_id}",
                "user_id": user_id,
                "difficulty": "beginner",
                "current_course_id": "machine-learning",
                "current_module_id": "ml-m1",
                "current_lesson_id": "ml-l1-paradigms",
                "consecutive_correct": 0,
                "consecutive_struggles": 0,
                "total_xp": 0,
                "updated_at": datetime.utcnow()
            }
        },
        upsert=True
    )

    clean_user = sanitize_user_doc(user_doc)
    return AuthResponse(
        success=True,
        user=clean_user,
        token=f"token-{user_id}",
        message="Account created successfully!"
    )

@router.post("/auth/login", response_model=AuthResponse)
async def login(payload: UserLoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Authenticates a user from MongoDB."""
    email_or_user = payload.email.strip()
    
    # Ensure demo user exists if attempting demo login
    if email_or_user.lower() == "explorer@aiquest.io":
        await ensure_demo_user(db)

    user = await db.users.find_one({
        "$or": [
            {"email": email_or_user.lower()},
            {"username": email_or_user}
        ]
    })

    if not user:
        return AuthResponse(success=False, error="Invalid email or password.")

    # Verify password if password_hash exists
    if "password_hash" in user:
        # Special-case for demo user allowing explorer123 or any password for seamless experience
        is_demo = user.get("email") == "explorer@aiquest.io"
        if not is_demo and not verify_password(payload.password, user["password_hash"]):
            return AuthResponse(success=False, error="Invalid email or password.")

    clean_user = sanitize_user_doc(user)
    return AuthResponse(
        success=True,
        user=clean_user,
        token=f"token-{clean_user['id'] if clean_user else 'user'}",
        message="Welcome back, AI Explorer!"
    )

@router.post("/auth/google", response_model=AuthResponse)
async def login_with_google(payload: GoogleAuthRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Google sign-in flow persisting or fetching user from MongoDB."""
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email})

    if not user:
        user_id = f"usr-google-{uuid.uuid4().hex[:8]}"
        user = {
            "id": user_id,
            "username": email.split("@")[0],
            "fullName": payload.fullName or "Google Explorer",
            "email": email,
            "avatar": payload.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "title": "Cloud Pioneer",
            "aiLevel": "Intermediate",
            "learningGoal": "Machine Learning",
            "mentor": "Coach",
            "level": 3,
            "xp": 750,
            "streak": 3,
            "lastActiveDate": datetime.utcnow().strftime("%Y-%m-%d"),
            "completedMissions": ["m-01"],
            "completedQuests": [],
            "defeatedBosses": [],
            "unlockedAchievements": ["ach-first-quest"],
            "mastery": {
                "AI Fundamentals": 30,
                "Machine Learning": 25,
                "Deep Learning": 0,
                "Computer Vision": 0,
                "NLP": 0,
                "Generative AI": 0,
            },
            "soundEnabled": True,
            "hasOnboarded": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.users.insert_one(user)

    clean_user = sanitize_user_doc(user)
    return AuthResponse(
        success=True,
        user=clean_user,
        token=f"token-{clean_user['id'] if clean_user else 'user'}"
    )

@router.get("/auth/me")
async def get_current_user(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Retrieves the current authenticated user from MongoDB."""
    user_id = x_user_id
    if not user_id and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        if token.startswith("token-"):
            user_id = token[6:]

    if not user_id:
        # Default to demo explorer
        await ensure_demo_user(db)
        user = await db.users.find_one({"id": DEFAULT_DEMO_USER["id"]})
        return {"user": sanitize_user_doc(user)}

    user = await db.users.find_one({"id": user_id})
    if not user:
        user = await db.users.find_one({"email": user_id.lower()})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user": sanitize_user_doc(user)}

@router.put("/auth/profile")
async def update_profile(
    payload: UserProfileUpdateRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Updates user profile information in MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.users.update_one({"id": user_id}, {"$set": update_data})
    user = await db.users.find_one({"id": user_id})
    return {"success": True, "user": sanitize_user_doc(user)}

@router.put("/auth/progress")
async def update_progress(
    payload: UserProgressUpdateRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Updates user game progress, XP, streak, achievements, and missions in MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    # Also update total_xp in user_sessions if xp changed
    if payload.xp is not None:
        await db.user_sessions.update_one(
            {"user_id": user_id},
            {"$set": {"total_xp": payload.xp, "updated_at": datetime.utcnow()}},
            upsert=True
        )

    user = await db.users.find_one({"id": user_id})
    return {"success": True, "user": sanitize_user_doc(user)}

# =========================================================================
# COURSE PROGRESS & BOOKMARKS ENDPOINTS (MongoDB Persistence)
# =========================================================================

@router.get("/progress/courses")
async def get_courses_progress(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Retrieves all course progress records for a user from MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    cursor = db.courses_progress.find({"user_id": user_id})
    records = await cursor.to_list(length=100)

    progress_map: Dict[str, Any] = {}
    for r in records:
        c_id = r.get("course_id")
        if c_id:
            progress_map[c_id] = {
                "courseId": c_id,
                "completedLessons": r.get("completed_lessons", []),
                "completedModules": r.get("completed_modules", []),
                "xp": r.get("xp", 0),
                "progressPercentage": r.get("progress_percentage", 0),
                "currentLessonId": r.get("current_lesson_id"),
                "currentModuleId": r.get("current_module_id"),
                "lastAccessedDate": r.get("last_accessed_date", datetime.utcnow().isoformat())
            }
    return {"progress": progress_map}

@router.post("/progress/courses")
async def save_course_progress(
    payload: CourseProgressSaveRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Persists course progress into MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    doc = {
        "user_id": user_id,
        "course_id": payload.courseId,
        "completed_lessons": payload.completedLessons,
        "completed_modules": payload.completedModules,
        "xp": payload.xp,
        "progress_percentage": payload.progressPercentage,
        "current_lesson_id": payload.currentLessonId,
        "current_module_id": payload.currentModuleId,
        "last_accessed_date": payload.lastAccessedDate or datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow()
    }
    await db.courses_progress.update_one(
        {"user_id": user_id, "course_id": payload.courseId},
        {"$set": doc},
        upsert=True
    )
    return {"success": True, "progress": payload.model_dump()}

@router.get("/progress/bookmarks")
async def get_bookmarks(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Retrieves all bookmarked lessons for a user from MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    cursor = db.bookmarks.find({"user_id": user_id}).sort("added_at", -1)
    records = await cursor.to_list(length=200)

    bookmarks = []
    for r in records:
        bookmarks.append({
            "id": r.get("id"),
            "courseId": r.get("course_id"),
            "courseTitle": r.get("course_title"),
            "moduleId": r.get("module_id"),
            "moduleTitle": r.get("module_title"),
            "lessonId": r.get("lesson_id"),
            "lessonTitle": r.get("lesson_title"),
            "addedAt": r.get("added_at")
        })
    return {"bookmarks": bookmarks}

@router.post("/progress/bookmarks")
async def save_bookmark(
    payload: BookmarkSaveRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Adds a lesson bookmark into MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    bm_id = payload.id or f"bm-{uuid.uuid4().hex[:8]}"
    doc = {
        "id": bm_id,
        "user_id": user_id,
        "course_id": payload.courseId,
        "course_title": payload.courseTitle,
        "module_id": payload.moduleId,
        "module_title": payload.moduleTitle,
        "lesson_id": payload.lessonId,
        "lesson_title": payload.lessonTitle,
        "added_at": payload.addedAt or datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow()
    }
    await db.bookmarks.update_one(
        {"user_id": user_id, "lesson_id": payload.lessonId},
        {"$set": doc},
        upsert=True
    )
    return {"success": True, "bookmark": doc}

@router.delete("/progress/bookmarks/{lesson_id}")
async def remove_bookmark(
    lesson_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Removes a lesson bookmark from MongoDB."""
    user_id = x_user_id or DEFAULT_DEMO_USER["id"]
    result = await db.bookmarks.delete_one({"user_id": user_id, "lesson_id": lesson_id})
    return {"success": True, "deleted_count": result.deleted_count}
