from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# =========================================================================
# AI TUTOR SCHEMAS
# =========================================================================

class TutorChatRequest(BaseModel):
    message: str = Field(..., max_length=3000, description="The student's question or input message", json_schema_extra={"example": "What is CNN?"})
    course_id: Optional[str] = Field(None, description="Current course identifier", json_schema_extra={"example": "machine-learning"})
    module_id: Optional[str] = Field(None, description="Current module identifier", json_schema_extra={"example": "ml-m1"})
    lesson_id: Optional[str] = Field(None, description="Current lesson identifier", json_schema_extra={"example": "ml-l5-classification"})
    conversation_id: Optional[str] = Field(None, description="Optional conversation tracking ID (leave null for new conversation)", json_schema_extra={"example": None})
    user_id: Optional[str] = Field("student_explorer", description="Student ID", json_schema_extra={"example": "student_explorer"})
    student_name: Optional[str] = Field("AI Explorer", description="Student display name", json_schema_extra={"example": "AI Explorer"})
    mentor_style: Optional[str] = Field("Friend", description="Mentor persona (Friend | Professor | Coach)", json_schema_extra={"example": "Friend"})
    action_type: Optional[str] = Field("ask", description="Pedagogy action type (ask, explain_simply, example, hint, quiz, test_understanding)", json_schema_extra={"example": "ask"})
    current_difficulty: Optional[str] = Field("beginner", description="Current learning difficulty level", json_schema_extra={"example": "beginner"})
    progress_percent: Optional[int] = Field(0, ge=0, le=100, description="Course syllabus progress percentage", json_schema_extra={"example": 0})
    topic: Optional[str] = Field(None, description="Active topic under discussion (leave null to auto-detect from user question)", json_schema_extra={"example": None})

class TutorChatResponse(BaseModel):
    message: str
    conversation_id: str
    difficulty: str
    suggested_action: str
    xp: int = 0
    concept_tags: List[str] = []
    followup_suggestions: List[str] = []

class TutorEvaluateRequest(BaseModel):
    user_id: Optional[str] = Field("student_explorer", description="Student ID")
    course_id: str = Field(..., description="Target course ID")
    lesson_id: str = Field(..., description="Target lesson ID")
    question: str = Field(..., description="Question prompt that was posed to student")
    user_answer: str = Field(..., max_length=3000, description="Student's submitted answer")
    current_difficulty: Optional[str] = Field("intermediate", description="Current difficulty tier")

class TutorEvaluateResponse(BaseModel):
    correct: bool
    feedback: str
    explanation: str
    difficulty: str
    next_action: str
    xp_awarded: int

class ConversationHistoryMessage(BaseModel):
    id: str
    sender: str
    text: str
    concept_tags: List[str] = []
    followup_suggestions: List[str] = []
    difficulty: Optional[str] = None
    timestamp: str

class ConversationHistoryResponse(BaseModel):
    conversation_id: str
    messages: List[ConversationHistoryMessage]

# =========================================================================
# AUTHENTICATION & USER PROFILE SCHEMAS (MongoDB Persistence)
# =========================================================================

class UserSignUpRequest(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=6, max_length=100)

class UserLoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=150)
    password: str = Field(..., min_length=1, max_length=100)
    rememberMe: Optional[bool] = False

class GoogleAuthRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=150)
    fullName: Optional[str] = "Alex Mercer"
    avatar: Optional[str] = ""

class UserProfileUpdateRequest(BaseModel):
    fullName: Optional[str] = None
    avatar: Optional[str] = None
    title: Optional[str] = None
    aiLevel: Optional[str] = None
    learningGoal: Optional[str] = None
    mentor: Optional[str] = None
    soundEnabled: Optional[bool] = None

class UserProgressUpdateRequest(BaseModel):
    level: Optional[int] = None
    xp: Optional[int] = None
    streak: Optional[int] = None
    completedMissions: Optional[List[str]] = None
    completedQuests: Optional[List[str]] = None
    defeatedBosses: Optional[List[str]] = None
    unlockedAchievements: Optional[List[str]] = None
    mastery: Optional[Dict[str, int]] = None
    lastActiveDate: Optional[str] = None

class CourseProgressSaveRequest(BaseModel):
    courseId: str
    completedLessons: List[str] = []
    completedModules: List[str] = []
    xp: int = 0
    progressPercentage: int = 0
    currentLessonId: Optional[str] = None
    currentModuleId: Optional[str] = None
    lastAccessedDate: Optional[str] = None

class BookmarkSaveRequest(BaseModel):
    id: Optional[str] = None
    courseId: str
    courseTitle: str
    moduleId: str
    moduleTitle: str
    lessonId: str
    lessonTitle: str
    addedAt: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    user: Optional[Dict[str, Any]] = None
    token: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None
