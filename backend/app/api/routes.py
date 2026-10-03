import json
import logging
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongodb import get_db
from app.models.schemas import (
    TutorChatRequest,
    TutorChatResponse,
    TutorEvaluateRequest,
    TutorEvaluateResponse,
    ConversationHistoryResponse,
    ConversationHistoryMessage
)
from app.ai.tutor_agent import tutor_agent_service
from app.data.courses_data import COURSES_CATALOG, get_lesson_data

logger = logging.getLogger("ai_tutor.routes")

router = APIRouter(prefix="/api/tutor", tags=["tutor"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Quest Tutor Agent Service",
        "storage": "MongoDB Atlas",
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

def clean_optional(value: Optional[Any]) -> Optional[str]:
    """Cleans optional request strings, treating placeholders like 'string', 'null', 'none' as None."""
    if value is None:
        return None
    val_str = str(value).strip()
    if not val_str or val_str.lower() in {"string", "null", "none", "undefined"}:
        return None
    return val_str

@router.post("/chat", response_model=TutorChatResponse)
async def tutor_chat(
    payload: TutorChatRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Processes student message using the AI Tutor Agent with adaptive pedagogy and MongoDB conversation memory."""
    try:
        user_id = clean_optional(payload.user_id) or "student_explorer"
        course_id = clean_optional(payload.course_id)
        module_id = clean_optional(payload.module_id)
        lesson_id = clean_optional(payload.lesson_id)
        conversation_id = clean_optional(payload.conversation_id)
        topic = clean_optional(payload.topic)
        student_name = clean_optional(payload.student_name) or "AI Explorer"
        mentor_style = clean_optional(payload.mentor_style) or "Friend"
        action_type = clean_optional(payload.action_type) or "ask"
        current_difficulty = clean_optional(payload.current_difficulty) or "beginner"

        conversation_id = conversation_id or f"conv-{uuid.uuid4().hex[:12]}"

        # 1. Fetch or initialize UserSession in MongoDB
        user_session = await db.user_sessions.find_one({"user_id": user_id})
        if not user_session:
            user_session = {
                "id": f"sess-{user_id}",
                "user_id": user_id,
                "difficulty": current_difficulty,
                "current_course_id": course_id or "machine-learning",
                "current_module_id": module_id or "ml-m1",
                "current_lesson_id": lesson_id or "ml-l5-classification",
                "consecutive_correct": 0,
                "consecutive_struggles": 0,
                "total_xp": 0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.user_sessions.insert_one(user_session)
        else:
            update_session: Dict[str, Any] = {"updated_at": datetime.utcnow()}
            if course_id:
                update_session["current_course_id"] = course_id
                user_session["current_course_id"] = course_id
            if module_id:
                update_session["current_module_id"] = module_id
                user_session["current_module_id"] = module_id
            if lesson_id:
                update_session["current_lesson_id"] = lesson_id
                user_session["current_lesson_id"] = lesson_id
            await db.user_sessions.update_one({"user_id": user_id}, {"$set": update_session})

        # 2. Fetch or create Conversation in MongoDB
        conv = await db.conversations.find_one({"id": conversation_id})
        if not conv:
            conv = {
                "id": conversation_id,
                "user_id": user_id,
                "course_id": course_id or clean_optional(user_session.get("current_course_id")) or "machine-learning",
                "lesson_id": lesson_id or clean_optional(user_session.get("current_lesson_id")) or "ml-l5-classification",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.conversations.insert_one(conv)
        else:
            await db.conversations.update_one(
                {"id": conversation_id},
                {"$set": {"updated_at": datetime.utcnow()}}
            )

        # 3. Retrieve recent conversation history from MongoDB for agent context
        cursor = db.messages.find({"conversation_id": conversation_id}).sort("created_at", -1).limit(6)
        past_records = await cursor.to_list(length=6)
        past_records.reverse()
        history_lines = [f"{m.get('sender', '').upper()}: {m.get('text', '')}" for m in past_records]
        history_summary = "\n".join(history_lines)

        # 4. Save incoming user message in MongoDB
        user_msg_id = f"msg-{uuid.uuid4().hex[:12]}"
        user_record = {
            "id": user_msg_id,
            "conversation_id": conversation_id,
            "sender": "user",
            "text": payload.message,
            "difficulty": user_session.get("difficulty", "beginner"),
            "created_at": datetime.utcnow()
        }
        await db.messages.insert_one(user_record)

        # 5. Execute Agent Turn
        effective_course_id = course_id or clean_optional(user_session.get("current_course_id")) or "machine-learning"
        effective_module_id = module_id or clean_optional(user_session.get("current_module_id")) or "ml-m1"
        effective_lesson_id = lesson_id or clean_optional(user_session.get("current_lesson_id")) or "ml-l5-classification"

        logger.info(f"Received message: {payload.message}")
        logger.info(f"Current course: {effective_course_id}")
        logger.info(f"Current lesson: {effective_lesson_id}")
        logger.info(f"Conversation ID: {conversation_id}")
        logger.info(f"Topic: {topic}")

        agent_result = await tutor_agent_service.execute_tutor_turn(
            user_message=payload.message,
            course_id=effective_course_id,
            module_id=effective_module_id,
            lesson_id=effective_lesson_id,
            mentor_style=mentor_style,
            difficulty=user_session.get("difficulty", "beginner"),
            progress_percent=payload.progress_percent or 0,
            student_name=student_name,
            action_type=action_type,
            history_summary=history_summary,
            topic=topic
        )

        logger.info(f"Agent response generated: {agent_result.get('text', '')[:120]}...")

        # 6. Save Tutor Response Message in MongoDB
        tutor_msg_id = f"msg-{uuid.uuid4().hex[:12]}"
        tutor_record = {
            "id": tutor_msg_id,
            "conversation_id": conversation_id,
            "sender": "tutor",
            "text": agent_result["text"],
            "concept_tags": agent_result.get("concept_tags", []),
            "followup_suggestions": agent_result.get("followup_suggestions", []),
            "difficulty": user_session.get("difficulty", "beginner"),
            "created_at": datetime.utcnow()
        }
        await db.messages.insert_one(tutor_record)

        # 7. Award conversational engagement XP in MongoDB
        earned_xp = agent_result.get("xp", 20)
        await db.user_sessions.update_one(
            {"user_id": user_id},
            {"$inc": {"total_xp": earned_xp}}
        )
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"xp": earned_xp}}
        )

        return TutorChatResponse(
            message=agent_result["text"],
            conversation_id=conversation_id,
            difficulty=user_session.get("difficulty", "beginner"),
            suggested_action=agent_result.get("suggested_action", "continue"),
            xp=earned_xp,
            concept_tags=agent_result.get("concept_tags", []),
            followup_suggestions=agent_result.get("followup_suggestions", [])
        )
    except Exception as e:
        logger.error(f"Error in tutor_chat: {e}", exc_info=True)
        return TutorChatResponse(
            message="AI Tutor is temporarily unavailable. Please try again in a moment.",
            conversation_id=conversation_id,
            difficulty=current_difficulty,
            suggested_action="retry",
            xp=0,
            concept_tags=["System", "Retry"],
            followup_suggestions=["Ask again", "Explain simply", "Test my understanding"]
        )

@router.post("/evaluate", response_model=TutorEvaluateResponse)
async def evaluate_answer(
    payload: TutorEvaluateRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Evaluates student answer, awards XP, adaptively updates difficulty, and persists record in MongoDB."""
    user_id = payload.user_id or "student_explorer"
    lesson_data = get_lesson_data(payload.course_id, payload.lesson_id) or {}

    ans = payload.user_answer.strip().lower()
    q_lower = payload.question.lower()

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
        is_correct = any(term in ans for term in ["classification", "category", "categories", "discrete", "buckets", "classes", "multi-class", "fraud"]) and "regression" not in ans[:15]
        if is_correct:
            feedback = "Spot on! Outstanding analytical insight. You correctly identified the core principle."
            explanation = "Because the target labels are discrete categories rather than a continuous numerical spectrum, the algorithm creates decision boundaries."
        else:
            feedback = "Good effort, but not quite. Remember: numbers with continuous decimals mean regression; distinct category labels mean classification."
            explanation = "Since the choices are distinct categories rather than continuous quantities, this problem is solved using Classification."

    # Fetch UserSession from MongoDB
    user_session = await db.user_sessions.find_one({"user_id": user_id})
    if not user_session:
        user_session = {
            "id": f"sess-{user_id}",
            "user_id": user_id,
            "difficulty": payload.current_difficulty or "beginner",
            "consecutive_correct": 0,
            "consecutive_struggles": 0,
            "total_xp": 0
        }
        await db.user_sessions.insert_one(user_session)

    current_diff = user_session.get("difficulty", "beginner").lower()
    consecutive_correct = user_session.get("consecutive_correct", 0)
    consecutive_struggles = user_session.get("consecutive_struggles", 0)

    if is_correct:
        consecutive_correct += 1
        consecutive_struggles = 0
        if consecutive_correct >= 2 and current_diff == "beginner":
            current_diff = "intermediate"
        elif consecutive_correct >= 3 and current_diff == "intermediate":
            current_diff = "advanced"

        xp_awarded = 30
        next_action = "next_question"
    else:
        consecutive_struggles += 1
        consecutive_correct = 0
        if consecutive_struggles >= 2 and current_diff == "advanced":
            current_diff = "intermediate"
        elif consecutive_struggles >= 2 and current_diff == "intermediate":
            current_diff = "beginner"

        xp_awarded = 10
        next_action = "hint"

    # Update session in MongoDB
    await db.user_sessions.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "difficulty": current_diff,
                "consecutive_correct": consecutive_correct,
                "consecutive_struggles": consecutive_struggles,
                "updated_at": datetime.utcnow()
            },
            "$inc": {"total_xp": xp_awarded}
        },
        upsert=True
    )

    # Award user XP in MongoDB
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"xp": xp_awarded}}
    )

    # Record evaluation document in MongoDB
    eval_doc = {
        "id": f"eval-{uuid.uuid4().hex[:12]}",
        "user_id": user_id,
        "course_id": payload.course_id,
        "lesson_id": payload.lesson_id,
        "question": payload.question,
        "user_answer": payload.user_answer,
        "correct": is_correct,
        "feedback": feedback,
        "difficulty": current_diff,
        "xp_awarded": xp_awarded,
        "created_at": datetime.utcnow()
    }
    await db.quiz_evaluations.insert_one(eval_doc)

    return TutorEvaluateResponse(
        correct=is_correct,
        feedback=feedback,
        explanation=explanation,
        difficulty=current_diff,
        next_action=next_action,
        xp_awarded=xp_awarded
    )

@router.get("/history/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(
    conversation_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Fetches stored message history for a conversation from MongoDB."""
    cursor = db.messages.find({"conversation_id": conversation_id}).sort("created_at", 1)
    records = await cursor.to_list(length=100)

    messages = []
    for rec in records:
        dt = rec.get("created_at")
        time_str = dt.strftime("%I:%M %p") if isinstance(dt, datetime) else "Just now"
        tags = rec.get("concept_tags", [])
        if isinstance(tags, str):
            try:
                tags = json.loads(tags)
            except Exception:
                tags = []
        suggestions = rec.get("followup_suggestions", [])
        if isinstance(suggestions, str):
            try:
                suggestions = json.loads(suggestions)
            except Exception:
                suggestions = []

        messages.append(
            ConversationHistoryMessage(
                id=rec.get("id", f"msg-{uuid.uuid4().hex[:8]}"),
                sender=rec.get("sender", "user"),
                text=rec.get("text", ""),
                concept_tags=tags,
                followup_suggestions=suggestions,
                difficulty=rec.get("difficulty"),
                timestamp=time_str
            )
        )

    return ConversationHistoryResponse(
        conversation_id=conversation_id,
        messages=messages
    )
