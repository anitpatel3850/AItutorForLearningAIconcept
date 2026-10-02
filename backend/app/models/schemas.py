from typing import List, Optional
from pydantic import BaseModel, Field

class TutorChatRequest(BaseModel):
    message: str = Field(..., max_length=3000, description="The student's question or input message")
    course_id: Optional[str] = Field(None, description="Current course identifier")
    module_id: Optional[str] = Field(None, description="Current module identifier")
    lesson_id: Optional[str] = Field(None, description="Current lesson identifier")
    conversation_id: Optional[str] = Field(None, description="Optional conversation tracking ID")
    user_id: Optional[str] = Field("student_explorer", description="Student ID")
    student_name: Optional[str] = Field("AI Explorer", description="Student display name")
    mentor_style: Optional[str] = Field("Friend", description="Mentor persona (Friend | Professor | Coach)")
    action_type: Optional[str] = Field("ask", description="Pedagogy action type (ask, explain_simply, example, hint, quiz, test_understanding)")
    current_difficulty: Optional[str] = Field("beginner", description="Current learning difficulty level")
    progress_percent: Optional[int] = Field(0, ge=0, le=100, description="Course syllabus progress percentage")
    topic: Optional[str] = Field(None, description="Active topic or concept under discussion")

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
