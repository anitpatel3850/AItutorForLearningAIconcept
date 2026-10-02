import json
from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Text
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

class Base(DeclarativeBase):
    pass

class UserSession(Base):
    __tablename__ = "user_sessions"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), index=True)
    difficulty: Mapped[str] = mapped_column(String(50), default="beginner")
    current_course_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    current_module_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    current_lesson_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    consecutive_correct: Mapped[int] = mapped_column(Integer, default=0)
    consecutive_struggles: Mapped[int] = mapped_column(Integer, default=0)
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), index=True)
    course_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    lesson_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages: Mapped[List["MessageRecord"]] = relationship("MessageRecord", back_populates="conversation", cascade="all, delete-orphan", order_by="MessageRecord.created_at")

class MessageRecord(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String(100), ForeignKey("conversations.id"), index=True)
    sender: Mapped[str] = mapped_column(String(20)) # 'user' or 'tutor'
    text: Mapped[str] = mapped_column(Text)
    concept_tags: Mapped[str] = mapped_column(Text, default="[]") # JSON list
    followup_suggestions: Mapped[str] = mapped_column(Text, default="[]") # JSON list
    difficulty: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")

    def get_concept_tags(self) -> List[str]:
        try:
            return json.loads(self.concept_tags)
        except Exception:
            return []

    def get_followup_suggestions(self) -> List[str]:
        try:
            return json.loads(self.followup_suggestions)
        except Exception:
            return []

class QuizEvaluationRecord(Base):
    __tablename__ = "quiz_evaluations"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), index=True)
    course_id: Mapped[str] = mapped_column(String(100))
    lesson_id: Mapped[str] = mapped_column(String(100))
    question: Mapped[str] = mapped_column(Text)
    user_answer: Mapped[str] = mapped_column(Text)
    correct: Mapped[bool] = mapped_column(Boolean)
    feedback: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[str] = mapped_column(String(50), default="intermediate")
    xp_awarded: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
