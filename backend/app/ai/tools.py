import json
from typing import Optional
from agents import function_tool
from app.data.courses_data import get_course_data, get_lesson_data, COURSES_CATALOG

@function_tool
def get_current_lesson(course_id: str, lesson_id: str) -> str:
    """Retrieve full details of the student's current lesson including learning objectives, explanation, and key points."""
    lesson = get_lesson_data(course_id, lesson_id)
    if not lesson:
        return f"Lesson {lesson_id} in course {course_id} could not be located in syllabus."
    return json.dumps({
        "course_title": lesson.get("course_title"),
        "module_title": lesson.get("module_title"),
        "lesson_title": lesson.get("title"),
        "learning_objective": lesson.get("learning_objective"),
        "explanation_summary": lesson.get("explanation"),
        "important_concepts": lesson.get("important_concepts"),
        "key_points": lesson.get("key_points")
    })

@function_tool
def get_course_syllabus(course_id: str) -> str:
    """Retrieve the roadmap and module breakdown for a given course."""
    course = get_course_data(course_id)
    if not course:
        return f"Course '{course_id}' was not found in catalog."
    
    modules_summary = []
    for mod_id, mod in course.get("modules", {}).items():
        lessons = [l.get("title") for l in mod.get("lessons", {}).values()]
        modules_summary.append({
            "module_number": mod.get("module_number"),
            "module_title": mod.get("title"),
            "lessons": lessons
        })
    return json.dumps({
        "course": course.get("title"),
        "category": course.get("category"),
        "level": course.get("level"),
        "modules": modules_summary
    })

@function_tool
def generate_practice_question(course_id: str, lesson_id: str, difficulty: str) -> str:
    """Generate or retrieve an adaptive practice question for the given lesson and difficulty tier."""
    lesson = get_lesson_data(course_id, lesson_id)
    if lesson and "sample_quiz" in lesson:
        quiz = lesson["sample_quiz"]
        return json.dumps({
            "difficulty": difficulty,
            "question": quiz.get("question"),
            "options": quiz.get("options"),
            "hint": f"Focus on {', '.join(lesson.get('important_concepts', []))}"
        })
    
    # Generic question generator based on lesson
    topic = lesson.get("title") if lesson else "AI Core Concepts"
    if difficulty.lower() == "beginner":
        return json.dumps({
            "difficulty": "beginner",
            "question": f"In your own words, what is the primary goal of {topic}, and how would you explain it to a friend?",
            "hint": "Think of an everyday analogy or practical application."
        })
    elif difficulty.lower() == "intermediate":
        return json.dumps({
            "difficulty": "intermediate",
            "question": f"When applying {topic}, what trade-offs or common pitfalls (such as overfitting or computational cost) must an ML engineer balance?",
            "hint": "Consider bias-variance trade-off or parameter regularization."
        })
    else:
        return json.dumps({
            "difficulty": "advanced",
            "question": f"Analyze the mathematical formulation or optimization dynamics of {topic}. How does gradient behavior dictate parameter convergence?",
            "hint": "Examine loss function convexity and step-size dynamics."
        })

@function_tool
def evaluate_answer(question: str, user_answer: str, concept: str) -> str:
    """Evaluate a student's answer to a conceptual or algorithmic question."""
    answer_len = len(user_answer.strip().split())
    has_substance = answer_len >= 4
    
    is_correct = has_substance and not any(neg in user_answer.lower() for neg in ["don't know", "no idea", "not sure", "idk"])
    
    return json.dumps({
        "question": question,
        "concept": concept,
        "is_sound": is_correct,
        "length_words": answer_len,
        "recommendation": "Encourage student with positive reinforcement and offer follow-up depth." if is_correct else "Provide a gentle hint and guide the student towards intuition."
    })
