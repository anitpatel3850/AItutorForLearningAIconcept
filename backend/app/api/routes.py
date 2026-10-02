import json
import logging
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logger = logging.getLogger("ai_tutor.routes")

from app.models.schemas import (
    TutorChatRequest,
    TutorChatResponse,
    TutorEvaluateRequest,
    TutorEvaluateResponse,
    ConversationHistoryResponse,
    ConversationHistoryMessage
)
from app.models.database import (
    get_db,
    Conversation,
    MessageRecord,
    UserSession,
    QuizEvaluationRecord
)
from app.ai.tutor_agent import tutor_agent_service
from app.data.courses_data import COURSES_CATALOG, get_lesson_data

router = APIRouter(prefix="/api/tutor", tags=["tutor"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Quest Tutor Agent Service",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/context")
async def get_tutor_curriculum_context():
    """Provides courses and modules available for contextual tutoring."""
    curriculum = []
    for c_id, course in COURSES_CATALOG.items():
        mods = []
        for m_id, mod in course.get("modules", {}).items():
            lessons = []
            for l_id, les in mod.get("lessons", {}).items():
                lessons.append({
                    "id": l_id,
                    "title": les.get("title"),
                    "learning_objective": les.get("learning_objective")
                })
            mods.append({
                "id": m_id,
                "title": mod.get("title"),
                "module_number": mod.get("module_number"),
                "lessons": lessons
            })
        curriculum.append({
            "id": c_id,
            "title": course.get("title"),
            "category": course.get("category"),
            "level": course.get("level"),
            "modules": mods
        })
    return {"courses": curriculum}

@router.post("/chat", response_model=TutorChatResponse)
async def tutor_chat(
    payload: TutorChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """Processes student message using the AI Tutor Agent with adaptive pedagogy and conversation memory."""
    try:
        user_id = payload.user_id or "student_explorer"
        conversation_id = payload.conversation_id or f"conv-{uuid.uuid4().hex[:12]}"

        # 1. Fetch or initialize UserSession for adaptive tracking
        session_result = await db.execute(
            select(UserSession).where(UserSession.user_id == user_id)
        )
        user_session = session_result.scalar_one_or_none()
        if not user_session:
            user_session = UserSession(
                id=f"sess-{user_id}",
                user_id=user_id,
                difficulty=payload.current_difficulty or "beginner",
                current_course_id=payload.course_id,
                current_module_id=payload.module_id,
                current_lesson_id=payload.lesson_id
            )
            db.add(user_session)
        else:
            if payload.course_id:
                user_session.current_course_id = payload.course_id
            if payload.module_id:
                user_session.current_module_id = payload.module_id
            if payload.lesson_id:
                user_session.current_lesson_id = payload.lesson_id

        # 2. Fetch or create Conversation
        conv_result = await db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conversation = conv_result.scalar_one_or_none()
        if not conversation:
            conversation = Conversation(
                id=conversation_id,
                user_id=user_id,
                course_id=payload.course_id,
                lesson_id=payload.lesson_id
            )
            db.add(conversation)
            await db.flush()

        # 3. Retrieve recent conversation history for agent context
        history_result = await db.execute(
            select(MessageRecord)
            .where(MessageRecord.conversation_id == conversation_id)
            .order_by(MessageRecord.created_at.desc())
            .limit(6)
        )
        past_messages = list(reversed(history_result.scalars().all()))
        history_lines = [f"{m.sender.upper()}: {m.text}" for m in past_messages]
        history_summary = "\n".join(history_lines)

        # 4. Save incoming user message
        user_msg_id = f"msg-{uuid.uuid4().hex[:12]}"
        user_record = MessageRecord(
            id=user_msg_id,
            conversation_id=conversation_id,
            sender="user",
            text=payload.message,
            difficulty=user_session.difficulty
        )
        db.add(user_record)
        await db.flush()

        # 5. Execute Agent Turn
        logger.info(f"Received message: {payload.message}")
        logger.info(f"Current course: {payload.course_id or user_session.current_course_id}")
        logger.info(f"Current lesson: {payload.lesson_id or user_session.current_lesson_id}")

        agent_result = await tutor_agent_service.execute_tutor_turn(
            user_message=payload.message,
            course_id=payload.course_id or user_session.current_course_id,
            module_id=payload.module_id or user_session.current_module_id,
            lesson_id=payload.lesson_id or user_session.current_lesson_id,
            mentor_style=payload.mentor_style or "Friend",
            difficulty=user_session.difficulty,
            progress_percent=payload.progress_percent or 0,
            student_name=payload.student_name or "AI Explorer",
            action_type=payload.action_type or "ask",
            history_summary=history_summary,
            topic=payload.topic
        )

        logger.info(f"Agent response generated: {agent_result.get('text', '')[:120]}...")

        # 6. Save Tutor Response Message
        tutor_msg_id = f"msg-{uuid.uuid4().hex[:12]}"
        tutor_record = MessageRecord(
            id=tutor_msg_id,
            conversation_id=conversation_id,
            sender="tutor",
            text=agent_result["text"],
            concept_tags=json.dumps(agent_result.get("concept_tags", [])),
            followup_suggestions=json.dumps(agent_result.get("followup_suggestions", [])),
            difficulty=user_session.difficulty
        )
        db.add(tutor_record)

        # Award conversational engagement XP
        user_session.total_xp += agent_result.get("xp", 20)
        await db.commit()

        return TutorChatResponse(
            message=agent_result["text"],
            conversation_id=conversation_id,
            difficulty=user_session.difficulty,
            suggested_action=agent_result.get("suggested_action", "continue"),
            xp=agent_result.get("xp", 20),
            concept_tags=agent_result.get("concept_tags", []),
            followup_suggestions=agent_result.get("followup_suggestions", [])
        )
    except Exception as e:
        await db.rollback()
        # Clean safe response per security and error handling requirements
        return TutorChatResponse(
            message="AI Tutor is temporarily unavailable. Please try again in a moment.",
            conversation_id=payload.conversation_id or f"conv-{uuid.uuid4().hex[:12]}",
            difficulty=payload.current_difficulty or "beginner",
            suggested_action="retry",
            xp=0,
            concept_tags=["System", "Retry"],
            followup_suggestions=["Ask again", "Explain simply", "Test my understanding"]
        )

@router.post("/evaluate", response_model=TutorEvaluateResponse)
async def evaluate_answer(
    payload: TutorEvaluateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Evaluates a student's answer, awards XP, and adaptively updates difficulty level."""
    user_id = payload.user_id or "student_explorer"
    lesson_data = get_lesson_data(payload.course_id, payload.lesson_id) or {}
    
    # Analyze student answer
    ans = payload.user_answer.strip().lower()
    words = ans.split()
    q_lower = payload.question.lower()

    # Determine topic from question prompt
    if "overfit" in q_lower:
        is_correct = any(t in ans for t in ["overfit", "variance", "regularization", "dropout", "prun", "more data", "early stop"])
        if is_correct:
            feedback = "Spot on! Outstanding analytical insight on Overfitting. You correctly diagnosed that training accuracy far exceeding validation accuracy indicates High Variance (memorization)."
            explanation = "Overfitting occurs when a model learns noise in the training set. Applying regularization (L1/L2), dropout, or collecting more training data restores generalization."
        else:
            feedback = "Good effort, but examine the gap: 99.8% train vs 61.4% test means the model memorized the training data rather than generalizing."
            explanation = "When a model excels on training data but collapses on unseen test data, it is Overfitting (High Variance). Use regularization, dropout, or pruning to fix it."
    elif "underfit" in q_lower or "high bias" in q_lower:
        is_correct = any(t in ans for t in ["underfit", "bias", "capacity", "feature", "epoch", "complex", "simple"])
        if is_correct:
            feedback = "Excellent deduction! Low performance across both training and validation sets clearly signifies Underfitting (High Bias)."
            explanation = "Underfitting happens when the model is too simple to capture dominant patterns. Increasing model capacity, adding polynomial/interaction features, or training longer resolves this."
        else:
            feedback = "Not quite. Since accuracy is low on both training and test data, the model hasn't learned the patterns yet."
            explanation = "Poor performance on training data indicates Underfitting (High Bias). Boost model capacity or engineer richer features."
    elif "precision" in q_lower or "recall" in q_lower:
        is_correct = "recall" in ans or "false negative" in ans or "miss" in ans
        if is_correct:
            feedback = "Precisely right! In life-critical medical diagnostics, maximizing Recall is paramount to avoid missing any true disease cases (False Negatives)."
            explanation = "Recall measures the fraction of actual positive cases detected. False alarms can be ruled out with follow-up scans, but a missed case can be fatal."
        else:
            feedback = "Consider the consequence of an error: if a sick patient is missed (False Negative), they won't get treatment."
            explanation = "In medical screening, missing a positive case is far worse than a false alarm. Therefore, Recall must be prioritized."
    elif "decision tree" in q_lower or "tree" in q_lower:
        is_correct = any(t in ans for t in ["overfit", "depth", "prun", "variance", "leaf", "split"])
        if is_correct:
            feedback = "Brilliant! An unconstrained decision tree splits until every sample has its own leaf, causing severe Overfitting."
            explanation = "Constraining tree growth with hyperparameters like max_depth, min_samples_split, or post-pruning prevents trees from memorizing training outliers."
        else:
            feedback = "Think about what happens when each training data point gets its own leaf node: the tree memorizes the training data completely."
            explanation = "Without depth limits, decision trees overfit heavily. You tune max_depth or apply pruning to regularize them."
    elif "gradient" in q_lower or "learning rate" in q_lower:
        is_correct = any(t in ans for t in ["diverg", "large", "high", "decrease", "lower", "step", "nan", "overshoot", "alpha"])
        if is_correct:
            feedback = "Spot on! When loss explodes and oscillates toward NaN, the learning rate is too large and overshoots the minimum."
            explanation = "A learning rate that is too high causes gradient descent steps to diverge and bounce out of the loss valley. Lowering alpha restores smooth convergence."
        else:
            feedback = "Take a close look at the loss jumping from 2.1 to 890 to NaN: the updates are overshooting the valley."
            explanation = "Exploding loss indicates the learning rate is too large and diverging. Decreasing the learning rate stabilizes optimization."
    else:
        # Classification vs Regression check
        is_correct = any(term in ans for term in ["classification", "category", "categories", "discrete", "buckets", "classes", "multi-class", "fraud"]) and "regression" not in ans[:15]
        if is_correct:
            feedback = f"Spot on! Outstanding analytical insight. You correctly identified the core principle."
            explanation = "Because the target labels are discrete categories rather than a continuous numerical spectrum, the algorithm creates decision boundaries."
        else:
            feedback = "Good effort, but not quite. Remember: numbers with continuous decimals mean regression; distinct category labels mean classification."
            explanation = "Since the choices are distinct categories rather than continuous quantities, this problem is solved using Classification."

    # Fetch UserSession to apply adaptive difficulty adjustments
    session_result = await db.execute(
        select(UserSession).where(UserSession.user_id == user_id)
    )
    user_session = session_result.scalar_one_or_none()
    if not user_session:
        user_session = UserSession(
            id=f"sess-{user_id}",
            user_id=user_id,
            difficulty=payload.current_difficulty or "beginner"
        )
        db.add(user_session)

    # Adaptive difficulty progression logic
    current_diff = user_session.difficulty.lower()
    if is_correct:
        user_session.consecutive_correct += 1
        user_session.consecutive_struggles = 0
        
        if user_session.consecutive_correct >= 2 and current_diff == "beginner":
            user_session.difficulty = "intermediate"
        elif user_session.consecutive_correct >= 3 and current_diff == "intermediate":
            user_session.difficulty = "advanced"

        xp_awarded = 30
        next_action = "next_question"
    else:
        user_session.consecutive_struggles += 1
        user_session.consecutive_correct = 0
        
        if user_session.consecutive_struggles >= 2 and current_diff == "advanced":
            user_session.difficulty = "intermediate"
        elif user_session.consecutive_struggles >= 2 and current_diff == "intermediate":
            user_session.difficulty = "beginner"

        xp_awarded = 10
        next_action = "hint"

    user_session.total_xp += xp_awarded

    # Record evaluation in database
    eval_record = QuizEvaluationRecord(
        id=f"eval-{uuid.uuid4().hex[:12]}",
        user_id=user_id,
        course_id=payload.course_id,
        lesson_id=payload.lesson_id,
        question=payload.question,
        user_answer=payload.user_answer,
        correct=is_correct,
        feedback=feedback,
        difficulty=user_session.difficulty,
        xp_awarded=xp_awarded
    )
    db.add(eval_record)
    await db.commit()

    return TutorEvaluateResponse(
        correct=is_correct,
        feedback=feedback,
        explanation=explanation,
        difficulty=user_session.difficulty,
        next_action=next_action,
        xp_awarded=xp_awarded
    )

@router.get("/history/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(
    conversation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Fetches stored message history for a conversation."""
    result = await db.execute(
        select(MessageRecord)
        .where(MessageRecord.conversation_id == conversation_id)
        .order_by(MessageRecord.created_at.asc())
    )
    records = result.scalars().all()
    messages = [
        ConversationHistoryMessage(
            id=rec.id,
            sender=rec.sender,
            text=rec.text,
            concept_tags=rec.get_concept_tags(),
            followup_suggestions=rec.get_followup_suggestions(),
            difficulty=rec.difficulty,
            timestamp=rec.created_at.strftime("%I:%M %p")
        )
        for rec in records
    ]
    return ConversationHistoryResponse(
        conversation_id=conversation_id,
        messages=messages
    )
