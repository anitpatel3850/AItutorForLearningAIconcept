import os
import json
import logging
import re
from typing import Dict, Any, Optional, List, Tuple
import google.genai as genai
from app.config import settings
from app.ai.tools import get_current_lesson, get_course_syllabus, generate_practice_question, evaluate_answer
from app.data.courses_data import get_lesson_data, get_course_data

logger = logging.getLogger("ai_tutor")
logging.basicConfig(level=logging.INFO)

MENTOR_PERSONAS = {
    "Friend": (
        "You are an encouraging, supportive AI study buddy in AI Quest. "
        "Use friendly analogies, everyday metaphors, and enthusiastic positive reinforcement. "
        "Keep technical jargon grounded in relatable, real-world examples that anyone can easily understand."
    ),
    "Professor": (
        "You are an esteemed Academic Research Director in AI Quest. "
        "Provide formal mathematical formulations, discuss loss objectives, theoretical guarantees, "
        "and empirical trade-offs with rigorous analytical precision."
    ),
    "Coach": (
        "You are an intense, high-energy competitive ML Coach and Raid Commander in AI Quest. "
        "Focus on production engineering, practical heuristics, debugging tactics, winning hackathons, "
        "and preparing the student to defeat the boss monsters in the AI Quest arena."
    )
}

CORE_TOPICS = {
    "overfitting": "Overfitting",
    "overfit": "Overfitting",
    "underfitting": "Underfitting",
    "underfit": "Underfitting",
    "precision and recall": "Precision and Recall",
    "precision": "Precision and Recall",
    "recall": "Precision and Recall",
    "decision tree": "Decision Trees",
    "decision trees": "Decision Trees",
    "gradient descent": "Gradient Descent",
    "classification": "Classification",
    "classify": "Classification",
    "logistic regression": "Logistic Regression",
    "linear regression": "Linear Regression",
    "neural network": "Neural Networks",
    "neural networks": "Neural Networks",
    "deep learning": "Neural Networks",
    "cnn": "Convolutional Neural Networks (CNN)",
    "convolutional neural network": "Convolutional Neural Networks (CNN)",
    "convolutional neural networks": "Convolutional Neural Networks (CNN)",
    "convolutional": "Convolutional Neural Networks (CNN)",
    "rnn": "Recurrent Neural Networks (RNN)",
    "recurrent neural network": "Recurrent Neural Networks (RNN)",
    "recurrent neural networks": "Recurrent Neural Networks (RNN)",
    "support vector machine": "Support Vector Machines",
    "svm": "Support Vector Machines",
    "random forest": "Random Forests",
    "random forests": "Random Forests",
    "k-means": "K-Means Clustering",
    "clustering": "Clustering",
    "bias-variance": "Bias-Variance Tradeoff",
    "bias and variance": "Bias-Variance Tradeoff",
    "regularization": "Regularization",
    "cross-validation": "Cross-Validation",
    "cross validation": "Cross-Validation",
    "backpropagation": "Backpropagation",
    "pca": "Principal Component Analysis",
    "dimensionality reduction": "Principal Component Analysis",
    "transformer": "Transformers",
    "transformers": "Transformers",
    "attention mechanism": "Attention Mechanism",
    "attention": "Attention Mechanism"
}

def detect_active_topic(
    user_message: str,
    history_summary: str = "",
    explicit_topic: Optional[str] = None,
    default_lesson_title: str = "Machine Learning"
) -> str:
    """Accurately extracts or preserves the student's active conceptual topic.
    
    Priority Rules:
    1. A new student question in user_message ALWAYS takes top priority for topic detection,
       allowing seamless switching between topics (e.g. from Overfitting to Gradient Descent to CNN).
    2. Explicit topic is used if valid and when the user message does not specify a different topic
       (e.g. follow-up questions like 'Explain more simply' or 'Give me an example').
    3. Placeholders such as 'string', 'null', 'none' are defensively ignored and never treated as topics.
    4. Recent conversation history is checked in reverse for context on action requests.
    5. Fallback to default lesson title (ensuring it is not a placeholder).
    """
    # 0. Defensive cleanup of explicit_topic (reject placeholders like 'string', 'null', 'none')
    cleaned_explicit: Optional[str] = None
    if explicit_topic and isinstance(explicit_topic, str):
        trimmed = explicit_topic.strip()
        if trimmed and trimmed.lower() not in {"string", "null", "none", "undefined"}:
            cleaned_explicit = trimmed

    lower_msg = user_message.lower().strip()

    # 1. Check if user_message directly asks about or contains a core concept.
    # Match sorted by length descending so multi-word terms match before subterms.
    detected_from_msg: Optional[str] = None
    for kw in sorted(CORE_TOPICS.keys(), key=len, reverse=True):
        if re.search(r'\b' + re.escape(kw) + r'\b', lower_msg):
            detected_from_msg = CORE_TOPICS[kw]
            break

    if not detected_from_msg:
        for kw in sorted(CORE_TOPICS.keys(), key=len, reverse=True):
            if kw in lower_msg:
                detected_from_msg = CORE_TOPICS[kw]
                break

    # If no core topic matched, check for direct question phrasing ("What is X?", "Explain X")
    if not detected_from_msg:
        match = re.search(r'(?:what is|what are|explain|tell me about|how does|what is a|what is an)\s+([a-zA-Z0-9\s\-]+?)(?:\?|$|\.|\!)', lower_msg, re.IGNORECASE)
        if match:
            extracted = match.group(1).strip()
            if extracted.lower().startswith("a "):
                extracted = extracted[2:].strip()
            elif extracted.lower().startswith("an "):
                extracted = extracted[3:].strip()
            if len(extracted) > 1 and extracted.lower() not in ("it", "this", "that", "more", "string", "null", "none"):
                lower_ext = extracted.lower()
                for kw, canonical in CORE_TOPICS.items():
                    if kw in lower_ext or lower_ext in kw:
                        detected_from_msg = canonical
                        break
                if not detected_from_msg:
                    detected_from_msg = extracted.title() if not extracted.isupper() else extracted

    # If the user's message introduces/asks about a topic, that new question wins!
    if detected_from_msg:
        return detected_from_msg

    # 2. If user message didn't specify a new topic, use valid explicit_topic if provided
    if cleaned_explicit:
        lower_ex = cleaned_explicit.lower()
        for kw, canonical in CORE_TOPICS.items():
            if kw in lower_ex:
                return canonical
        return cleaned_explicit

    # 3. If current message is an action button (e.g. "Give Me an Example", "Test My Understanding"),
    # search recent conversation history in reverse to identify the active subject being discussed.
    if history_summary:
        lines = [line.strip() for line in history_summary.split("\n") if line.strip()]
        for line in reversed(lines):
            if line.upper().startswith("USER:"):
                lower_line = line.lower()
                for kw in sorted(CORE_TOPICS.keys(), key=len, reverse=True):
                    canonical = CORE_TOPICS[kw]
                    if re.search(r'\b' + re.escape(kw) + r'\b', lower_line) or kw in lower_line:
                        return canonical

        # If no topic found in user questions, check tutor messages in reverse
        for line in reversed(lines):
            lower_line = line.lower()
            for kw in sorted(CORE_TOPICS.keys(), key=len, reverse=True):
                canonical = CORE_TOPICS[kw]
                if re.search(r'\b' + re.escape(kw) + r'\b', lower_line) or kw in lower_line:
                    return canonical

    # 4. Fallback to default lesson title (ensure it is not 'string')
    if default_lesson_title and default_lesson_title.strip().lower() not in {"string", "null", "none"}:
        return default_lesson_title.strip()

    return "Machine Learning"

def build_system_instructions(
    mentor_style: str,
    user_message: str,
    course_title: str,
    module_title: str,
    lesson_title: str,
    learning_objective: str,
    difficulty: str,
    progress_percent: int,
    student_name: str,
    recent_performance: str = "Active explorer with good engagement"
) -> str:
    persona = MENTOR_PERSONAS.get(mentor_style, MENTOR_PERSONAS["Friend"])
    
    return f"""SYSTEM/AGENT INSTRUCTIONS:

You are the AI Quest Tutor.
{persona}

Teach the student according to their current learning context.

IMPORTANT:
Answer the student's CURRENT message directly in your opening sentence.
Never start by mentioning or framing your answer around the lesson title or course title unless the student explicitly asked about it. (For example, if the student asks "What is overfitting?", explain what overfitting is directly, do not start with "In the context of Logistic Regression...").
Never answer a previous example question.
Never reuse a previous response unless it is relevant to the current conversation.
Do not assume the user is asking about the previous topic.

CURRENT STUDENT MESSAGE:
{user_message}

COURSE:
{course_title}

MODULE:
{module_title}

CURRENT LESSON CONTEXT (for background reference only, do not force into answer):
{lesson_title}

STUDENT LEVEL:
{difficulty.upper()} (Beginner | Intermediate | Advanced)

RECENT PERFORMANCE:
{recent_performance}

Use the current student message as the primary question to answer.

PEDAGOGICAL GUIDELINES:
1. Explain the student's requested concept directly in the very first sentence clearly, intuitively, and accurately without introductory filler.
2. Adapt strictly to the student's difficulty level ({difficulty.upper()}):
   - BEGINNER: Use relatable everyday analogies, clear step-by-step breakdowns, intuitive examples, and minimal complex notation.
   - INTERMEDIATE: Balance intuition with Python code patterns, parameter trade-offs, and metric analysis.
   - ADVANCED: Dive into optimization calculus, architectural trade-offs, loss formulations, and mathematical rigor.
3. Conclude with 1 targeted check-for-understanding question related to what you just explained.
4. Conclude your response with 2 to 4 suggested follow-up prompts on new lines formatted as:
[SUGGESTION: Next topic or question]
[TAG: Concept Name]
"""

class AITutorAgentService:
    def __init__(self):
        self.model = settings.AI_MODEL
        self.tools = [get_current_lesson, get_course_syllabus, generate_practice_question, evaluate_answer]
        self.client = None
        if settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize Google GenAI Client: {e}")

    async def execute_tutor_turn(
        self,
        user_message: str,
        course_id: Optional[str] = "machine-learning",
        module_id: Optional[str] = None,
        lesson_id: Optional[str] = "ml-l5-classification",
        mentor_style: str = "Friend",
        difficulty: str = "beginner",
        progress_percent: int = 0,
        student_name: str = "AI Explorer",
        action_type: str = "ask",
        history_summary: str = "",
        topic: Optional[str] = None
    ) -> Dict[str, Any]:
        """Runs the AI Tutor Agent with adaptive pedagogy, dynamic topic resolution, and verified logging."""
        
        # Resolve course and lesson metadata for framing
        course_data = get_course_data(course_id or "machine-learning") or {}
        lesson_data = get_lesson_data(course_id or "machine-learning", lesson_id or "ml-l5-classification") or {}
        
        course_title = course_data.get("title", "Machine Learning")
        module_title = lesson_data.get("module_title", "Foundations")
        lesson_title = lesson_data.get("title", "Core AI Concepts")
        learning_objective = lesson_data.get("learning_objective", "Master fundamental concepts")

        # Defensive cleanup of topic parameter: treat placeholders like 'string' as None
        safe_topic = None
        if topic and isinstance(topic, str):
            trimmed_topic = topic.strip()
            if trimmed_topic and trimmed_topic.lower() not in {"string", "null", "none", "undefined"}:
                safe_topic = trimmed_topic

        # Detect the active topic from user query, history, or explicit topic parameter
        active_topic = detect_active_topic(
            user_message=user_message,
            history_summary=history_summary,
            explicit_topic=safe_topic,
            default_lesson_title=lesson_title
        )

        # Handle special pedagogical action requests
        action_prompt = user_message
        if action_type == "explain_simply":
            action_prompt = f"Please explain {active_topic} in the simplest intuitive terms with an everyday analogy for a beginner."
        elif action_type == "example":
            action_prompt = f"Give me a concrete, real-world industry application example of {active_topic} in action."
        elif action_type == "hint":
            action_prompt = f"Give me a tactical hint on {active_topic} to help me solve challenges without spoiling the direct answer."
        elif action_type in ("quiz", "test_understanding"):
            action_prompt = f"Test my understanding of {active_topic} by posing a realistic practice challenge question."
        elif not action_prompt.strip():
            action_prompt = f"Tell me about {active_topic}."

        # Structured backend logging (Requirement 11)
        logger.info(f"Received message: {user_message}")
        logger.info(f"Current course: {course_title}")
        logger.info(f"Current lesson: {lesson_title}")
        logger.info(f"Active topic: {active_topic}")
        logger.info(f"Action type: {action_type}")

        instructions = build_system_instructions(
            mentor_style=mentor_style,
            user_message=action_prompt,
            course_title=course_title,
            module_title=module_title,
            lesson_title=lesson_title,
            learning_objective=learning_objective,
            difficulty=difficulty,
            progress_percent=progress_percent,
            student_name=student_name
        )

        full_prompt = f"CURRENT STUDENT MESSAGE:\n{action_prompt}"
        if history_summary:
            full_prompt = f"Recent conversation context:\n{history_summary}\n\nCURRENT STUDENT MESSAGE (Answer this specifically):\n{action_prompt}"

        # Initialize client if not already initialized
        if self.client is None and settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize Google GenAI Client: {e}")

        # Check if Gemini API key and client are configured
        if self.client:
            try:
                interaction = self.client.interactions.create(
                    model=self.model,
                    input=full_prompt,
                    system_instruction=instructions
                )
                raw_text = interaction.output_text or ""
                if raw_text.strip():
                    clean_text, suggestions, tags = self._extract_metadata(raw_text, active_topic, lesson_data)
                    logger.info(f"Gemini agent response generated: {clean_text[:120]}...")
                    return {
                        "text": clean_text,
                        "difficulty": difficulty,
                        "suggested_action": self._determine_suggested_action(action_type),
                        "xp": 20,
                        "concept_tags": tags,
                        "followup_suggestions": suggestions,
                        "topic": active_topic
                    }
            except Exception as e:
                logger.warning(f"Gemini API execution failed ({e}), falling back to adaptive pedagogy engine")

        # Fallback adaptive pedagogical engine (100% reliable, zero failure rate, topic-driven)
        fallback_res = self._generate_contextual_fallback(
            mentor_style=mentor_style,
            active_topic=active_topic,
            course_title=course_title,
            lesson_title=lesson_title,
            lesson_data=lesson_data,
            difficulty=difficulty,
            user_message=action_prompt,
            action_type=action_type
        )
        logger.info(f"Agent response generated: {fallback_res['text'][:120]}...")
        return fallback_res

    def _determine_suggested_action(self, action_type: str) -> str:
        if action_type in ("quiz", "test_understanding"):
            return "answer_quiz"
        elif action_type == "hint":
            return "try_challenge"
        elif action_type == "explain_simply":
            return "test_understanding"
        return "continue"

    def _extract_metadata(self, raw_text: str, active_topic: str, lesson_data: Dict[str, Any]) -> Tuple[str, List[str], List[str]]:
        lines = raw_text.split("\n")
        clean_lines = []
        suggestions = []
        tags = [active_topic]
        for c in lesson_data.get("important_concepts", []):
            if c not in tags:
                tags.append(c)

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("[SUGGESTION:"):
                s = stripped[12:].rstrip("]").strip()
                if s:
                    suggestions.append(s)
            elif stripped.startswith("[TAG:"):
                t = stripped[5:].rstrip("]").strip()
                if t and t not in tags:
                    tags.append(t)
            else:
                clean_lines.append(line)

        clean_text = "\n".join(clean_lines).strip()
        if not suggestions:
            suggestions = [
                f"Give me a real-world example of {active_topic}",
                f"Test my understanding of {active_topic}",
                f"Explain {active_topic} more simply",
                f"Give me a practice challenge on {active_topic}"
            ]

        return clean_text, suggestions[:4], tags[:4]

    def _generate_contextual_fallback(
        self,
        mentor_style: str,
        active_topic: str,
        course_title: str,
        lesson_title: str,
        lesson_data: Dict[str, Any],
        difficulty: str,
        user_message: str,
        action_type: str
    ) -> Dict[str, Any]:
        """Provides dynamic, topic-specific tutoring matching the user's exact current query."""
        
        lower_query = user_message.lower()
        topic_lower = active_topic.lower()

        # =========================================================================
        # 1. ACTION: EXPLAIN MORE SIMPLY (Analogy Mode)
        # =========================================================================
        if action_type == "explain_simply" or "explain more simply" in lower_query or "still don't understand" in lower_query:
            if "overfit" in topic_lower:
                text = (
                    "Let's make **Overfitting** super intuitive with an everyday analogy:\n\n"
                    "Imagine a student preparing for a driver's license test who memorizes the exact potholes, cracks, and stop signs "
                    "on the specific training course. On that exact practice route, they drive with 100% perfection!\n\n"
                    "But the moment they take the real exam in a new neighborhood, they crash because they never learned how to actually "
                    "drive—they only memorized the quirks of the practice street.\n\n"
                    "In AI, that is **Overfitting**: the model memorizes the training dataset's quirks and noise instead of learning general rules.\n\n"
                    "Ready to see how we prevent this?"
                )
                tags = ["Overfitting", "Generalization", "High Variance"]
                followups = ["Give Me an Example", "Test My Understanding", "What is underfitting?", "Give Me a Hint"]
            elif "underfit" in topic_lower:
                text = (
                    "Let's break down **Underfitting** simply:\n\n"
                    "Imagine asking someone to summarize an 800-page mystery novel, and all they write is: *'People were in a house.'*\n\n"
                    "It's far too simplistic! It misses all the clues, character motivations, and plot twists. It fails on the practice test "
                    "AND it fails on the real test.\n\n"
                    "In AI, **Underfitting** means your model is too basic (like a straight line trying to fit a complex curve). It hasn't learned enough patterns.\n\n"
                    "Would you like to test your understanding on how to fix underfitting?"
                )
                tags = ["Underfitting", "High Bias", "Model Capacity"]
                followups = ["Give Me an Example", "Test My Understanding", "What is overfitting?", "Explain More Simply"]
            elif "precision" in topic_lower or "recall" in topic_lower:
                text = (
                    "Here is the simplest way to remember **Precision vs. Recall**:\n\n"
                    "Imagine a gold miner panning in a river:\n"
                    "• **Precision:** If the miner yells *'I found gold!'*, how often is that rock actually pure gold (and not fool's gold)? "
                    "High precision means almost no false alarms.\n"
                    "• **Recall:** Out of all the real gold flakes scattered across the entire riverbed, what percentage did the miner successfully scoop up? "
                    "High recall means almost no gold was missed.\n\n"
                    "Does that clear up the distinction?"
                )
                tags = ["Precision", "Recall", "Evaluation Metrics"]
                followups = ["Give Me an Example", "Test My Understanding", "What is an F1-Score?", "Give Me a Practice Question"]
            elif "tree" in topic_lower:
                text = (
                    "Think of a **Decision Tree** like playing the game of **20 Questions**:\n\n"
                    "At each step, you ask a simple Yes/No question:\n"
                    "1. *Is it an animal?* (Yes)\n"
                    "2. *Can it fly?* (No)\n"
                    "3. *Does it bark?* (Yes) → **Prediction: Dog!**\n\n"
                    "A decision tree in AI does the exact same thing: it slices your data with a sequence of 'if-this-then-that' questions until it arrives at a final answer."
                )
                tags = ["Decision Trees", "Flowchart", "Information Gain"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain Decision Tree Overfitting", "Give Me a Practice Question"]
            elif "gradient" in topic_lower:
                text = (
                    "Imagine being blindfolded on a foggy mountain and wanting to reach the lowest valley floor at the bottom:\n\n"
                    "You cannot see where you are going, but you can feel the slope beneath your boots. So you take a step in whichever "
                    "direction slopes downward most steeply.\n\n"
                    "Step by step, you descend until the ground becomes flat. That is **Gradient Descent**!\n\n"
                    "• The mountain is your **Loss (error)**.\n"
                    "• The size of your steps is your **Learning Rate**."
                )
                tags = ["Gradient Descent", "Optimization", "Learning Rate"]
                followups = ["Give Me an Example", "Test My Understanding", "What if the learning rate is too large?", "Give Me a Hint"]
            else:
                text = (
                    f"Let's break down **{active_topic}** into its most intuitive essence:\n\n"
                    f"At its core, {active_topic} is about teaching a computer system to identify underlying patterns rather than blindly guessing.\n\n"
                    f"Imagine training an apprentice: instead of giving them thousands of rigid manual rules, you show them examples and guide them to discover the principle on their own.\n\n"
                    f"Would you like a concrete real-world example of how this works in production?"
                )
                tags = [active_topic, "AI Concepts", "Intuitive Learning"]
                followups = ["Give Me an Example", "Test My Understanding", "Give Me a Practice Question", "Give Me a Hint"]

            return {
                "text": text,
                "difficulty": difficulty,
                "suggested_action": "test_understanding",
                "xp": 20,
                "concept_tags": tags,
                "followup_suggestions": followups,
                "topic": active_topic
            }

        # =========================================================================
        # 2. ACTION: GIVE ME AN EXAMPLE
        # =========================================================================
        elif action_type == "example" or "give me an example" in lower_query:
            if "overfit" in topic_lower:
                text = (
                    "Here is a famous real-world industry example of **Overfitting**:\n\n"
                    "A computer vision team trained an AI model to detect wolves vs. husky dogs in photos. "
                    "The model scored a staggering 99.5% accuracy during training!\n\n"
                    "**The Catastrophe:** In the real world, it failed completely. Why? In every training photo of a wolf, there was snow in the background. "
                    "The model didn't learn what a wolf looks like—it simply memorized: *'If image has white snow background, predict Wolf.'*\n\n"
                    "When shown a husky playing in the snow, it confidently misclassified it as a wolf! That is textbook overfitting on spurious noise.\n\n"
                    "How would you fix this dataset to stop the model from cheating?"
                )
                tags = ["Overfitting", "Spurious Correlation", "Data Augmentation"]
                followups = ["Test My Understanding", "Explain More Simply", "Give Me a Hint", "How do we prevent overfitting?"]
            elif "underfit" in topic_lower:
                text = (
                    "Here is a clear example of **Underfitting**:\n\n"
                    "Suppose you are predicting real estate prices across a bustling metropolis. Housing prices usually spike exponentially "
                    "near city centers and subway lines.\n\n"
                    "If you use a simple 1-variable straight line ($y = mx + b$) based only on square footage, the model will severely underestimate luxury downtown apartments "
                    "and overestimate suburban warehouses.\n\n"
                    "Because the model is too rigid to bend to the true curvature of the market, its training error and test error are both terribly high (High Bias).\n\n"
                    "To fix it, you need polynomial features, neighborhood location data, and a more capable model!"
                )
                tags = ["Underfitting", "High Bias", "Model Capacity"]
                followups = ["Test My Understanding", "What is overfitting?", "Explain More Simply", "Give Me a Hint"]
            elif "precision" in topic_lower or "recall" in topic_lower:
                text = (
                    "Here are two contrasting industry examples showing when you want **High Precision** vs. **High Recall**:\n\n"
                    "1. **Spam Filtering (Needs High Precision):**\n"
                    "   If an email is flagged as Spam, it gets hidden from the user. You want high precision because sending an urgent job offer "
                    "   to the spam folder (False Positive) is disastrous. It's better to let a few spam emails slip into the inbox.\n\n"
                    "2. **Airport Security / Disease Detection (Needs High Recall):**\n"
                    "   If an airport scanner checks for weapons, or a hospital checks for malignant tumors, you CANNOT miss a single true positive (False Negative). "
                    "   Even if it causes false alarms (lower precision), safety demands maximum recall!\n\n"
                    "Which metric would you prioritize for a bank's fraud detection alert system?"
                )
                tags = ["Precision", "Recall", "Trade-Off Analysis"]
                followups = ["Test My Understanding", "Explain More Simply", "What is an F1-Score?", "Give Me a Practice Question"]
            elif "tree" in topic_lower:
                text = (
                    "Here is an industry application of **Decision Trees**:\n\n"
                    "**Automated Loan Underwriting:**\n"
                    "A bank uses a decision tree to instantly screen mortgage applicants:\n"
                    "• Node 1: *Is Credit Score ≥ 680?* → Yes / No\n"
                    "• Node 2 (If Yes): *Is Debt-to-Income Ratio ≤ 36%?* → Yes / No\n"
                    "• Node 3 (If Yes): *Has Continuous Employment ≥ 2 Years?* → Approved!\n\n"
                    "Banks love decision trees because regulations require **explainability**: you can show the exact branching logic that led to an approval or denial!"
                )
                tags = ["Decision Trees", "Explainable AI", "Feature Splits"]
                followups = ["Test My Understanding", "Explain More Simply", "What are Random Forests?", "Give Me a Practice Question"]
            elif "gradient" in topic_lower:
                text = (
                    "Here is how **Gradient Descent** operates under the hood:\n\n"
                    "Imagine training an autonomous vehicle to steer. The model outputs a steering wheel angle $\\theta$.\n"
                    "• Every millisecond, the camera compares the car's heading to the center of the lane and computes the **Loss (steering error)**.\n"
                    "• Gradient descent computes the partial derivative $\\frac{\\partial \\text{Loss}}{\\partial W}$ for millions of neural network weights.\n"
                    "• It nudges every weight slightly opposite the gradient so the vehicle smoothly adjusts back toward the lane center.\n\n"
                    "If the learning rate is too big, the car jerks violently back and forth; if too small, it turns too late!"
                )
                tags = ["Gradient Descent", "Autonomous Driving", "Weight Updates"]
                followups = ["Test My Understanding", "Explain More Simply", "Give Me a Hint", "What is Stochastic Gradient Descent?"]
            elif "classification" in topic_lower:
                text = (
                    "Here is a classic real-world example of **Classification**:\n\n"
                    "**Credit Card Fraud Detection:**\n"
                    "Every time a card is swiped at a terminal, an AI model receives features:\n"
                    "• Transaction Amount ($4,200)\n"
                    "• Geolocation (Foreign Country)\n"
                    "• Time of day (3:15 AM)\n"
                    "• Distance from cardholder's home\n\n"
                    "The model outputs a discrete class: **'Approved'** or **'Flagged for Fraud'** (Binary Classification).\n\n"
                    "Because it categorizes inputs into discrete classes rather than predicting a continuous number, it is classification!"
                )
                tags = ["Classification", "Fraud Detection", "Supervised Learning"]
                followups = ["Test My Understanding", "Explain More Simply", "What is Logistic Regression?", "Give Me a Practice Question"]
            else:
                text = (
                    f"Here is a concrete real-world example of **{active_topic}**:\n\n"
                    f"In modern tech infrastructure, {active_topic} is leveraged to automate decision-making across massive datasets.\n\n"
                    f"For instance, streaming services and recommendation engines deploy this concept to process user engagement telemetry, "
                    f"predicting user preferences and serving personalized experiences in real time.\n\n"
                    f"Would you like to test your understanding of how {active_topic} operates in production?"
                )
                tags = [active_topic, "Real-World ML", "Production AI"]
                followups = ["Test My Understanding", "Explain More Simply", "Give Me a Practice Question", "Give Me a Hint"]

            return {
                "text": text,
                "difficulty": difficulty,
                "suggested_action": "test_understanding",
                "xp": 20,
                "concept_tags": tags,
                "followup_suggestions": followups,
                "topic": active_topic
            }

        # =========================================================================
        # 3. ACTION: TEST MY UNDERSTANDING / QUIZ
        # =========================================================================
        elif action_type in ("quiz", "test_understanding") or "test my understanding" in lower_query or "practice question" in lower_query:
            if "overfit" in topic_lower:
                text = (
                    "🎯 **Concept Check on Overfitting:**\n\n"
                    "**Scenario:** You train a deep neural network on 10,000 images.\n"
                    "• Training Accuracy: **99.8%** (Loss: 0.02)\n"
                    "• Validation/Test Accuracy: **61.4%** (Loss: 1.85)\n\n"
                    "**Question:** Is your model **Underfitting** or **Overfitting**, and what are two concrete techniques you would use to fix this gap?\n\n"
                    "Type your answer below, and I will evaluate your reasoning!"
                )
                tags = ["Overfitting", "Concept Check", "Generalization"]
                followups = [
                    "It is Overfitting; use Regularization or Dropout",
                    "It is Underfitting; train for more epochs",
                    "Give Me a Hint"
                ]
            elif "underfit" in topic_lower:
                text = (
                    "🎯 **Concept Check on Underfitting:**\n\n"
                    "**Scenario:** You are training a linear model to predict complex stock market oscillations.\n"
                    "• Training Accuracy: **48.2%**\n"
                    "• Validation/Test Accuracy: **47.9%**\n\n"
                    "**Question:** Is this model suffering from **High Variance (Overfitting)** or **High Bias (Underfitting)**, and how would you resolve it?\n\n"
                    "Submit your answer below!"
                )
                tags = ["Underfitting", "High Bias", "Model Evaluation"]
                followups = [
                    "It is High Bias (Underfitting); increase model capacity or add polynomial features",
                    "It is High Variance (Overfitting); add dropout",
                    "Give Me a Hint"
                ]
            elif "precision" in topic_lower or "recall" in topic_lower:
                text = (
                    "🎯 **Concept Check on Precision & Recall:**\n\n"
                    "**Scenario:** A hospital deploys an AI diagnostic system to detect an aggressive, treatable disease from MRI scans.\n"
                    "If a patient has the disease and the AI misses it (False Negative), the patient could face fatal consequences.\n\n"
                    "**Question:** In this medical diagnostic context, which evaluation metric must the engineering team maximize: **Precision** or **Recall**, and why?\n\n"
                    "Type your answer below!"
                )
                tags = ["Precision", "Recall", "Evaluation Metrics"]
                followups = [
                    "Maximize Recall because missing a sick patient (False Negative) is unacceptable",
                    "Maximize Precision to avoid false alarms",
                    "Give Me a Hint"
                ]
            elif "tree" in topic_lower:
                text = (
                    "🎯 **Concept Check on Decision Trees:**\n\n"
                    "**Scenario:** You train an unconstrained Decision Tree with no depth limit on a dataset with 50 features. "
                    "The tree grows until every single training sample occupies its own leaf node.\n\n"
                    "**Question:** What will happen to the model's test performance on new data, and what hyperparameter would you tune to fix this?\n\n"
                    "Type your answer below!"
                )
                tags = ["Decision Trees", "Tree Pruning", "Max Depth"]
                followups = [
                    "It will severely overfit; tune max_depth or min_samples_split",
                    "It will underfit; add more depth",
                    "Give Me a Hint"
                ]
            elif "gradient" in topic_lower:
                text = (
                    "🎯 **Concept Check on Gradient Descent:**\n\n"
                    "**Scenario:** You kick off model training. After 10 epochs, you observe that the training Loss is not decreasing; "
                    "instead, it jumps from 2.1 to 14.5 to 890.2 and finally outputs `NaN`.\n\n"
                    "**Question:** What is causing this loss explosion, and how should you adjust the **Learning Rate** ($\alpha$)?\n\n"
                    "Submit your answer below!"
                )
                tags = ["Gradient Descent", "Learning Rate", "Optimization"]
                followups = [
                    "The learning rate is too large and diverging; decrease alpha",
                    "The learning rate is too small; increase alpha",
                    "Give Me a Hint"
                ]
            elif "classification" in topic_lower:
                text = (
                    "🎯 **Concept Check on Classification:**\n\n"
                    "**Scenario:** An autonomous delivery drone monitors camera feeds to detect whether obstacles in front of it are "
                    "**'Clear Air'**, **'Tree Branch'**, or **'Power Line'**.\n\n"
                    "**Question:** Is this system solving a **Classification** problem or a **Regression** problem, and is it binary or multi-class?\n\n"
                    "Type your answer below for evaluation!"
                )
                tags = ["Classification", "Multi-Class", "Supervised Learning"]
                followups = [
                    "It is Multi-Class Classification because there are 3 discrete obstacle categories",
                    "It is Regression because drone altitude is continuous",
                    "Give Me a Hint"
                ]
            else:
                text = (
                    f"🎯 **Concept Check on {active_topic}:**\n\n"
                    f"**Scenario:** You are designing an AI system that utilizes **{active_topic}** in production.\n\n"
                    f"**Question:** Explain in your own words the primary objective of {active_topic}, and describe one key trade-off or failure mode practitioners must watch out for.\n\n"
                    f"Type your answer below and I will assess your reasoning!"
                )
                tags = [active_topic, "Concept Check", "Knowledge Assessment"]
                followups = [
                    f"Explain the primary trade-off of {active_topic}",
                    "Give Me a Hint",
                    "Give Me an Example"
                ]

            return {
                "text": text,
                "difficulty": difficulty,
                "suggested_action": "answer_quiz",
                "xp": 20,
                "concept_tags": tags,
                "followup_suggestions": followups,
                "topic": active_topic
            }

        # =========================================================================
        # 4. ACTION: HINT
        # =========================================================================
        elif action_type == "hint" or "hint" in lower_query:
            if "overfit" in topic_lower:
                text = (
                    "💡 **Tutor Hint on Overfitting:**\n\n"
                    "Look at the gap between your **Training Score** and your **Validation Score**:\n"
                    "• If Training Score is near 100% while Validation Score lags far behind, your model has memorized the data (Overfitting).\n"
                    "• To tame it, apply constraints: add **L2 Regularization (Weight Decay)**, drop connections with **Dropout**, prune tree depth, or collect more diverse training data."
                )
                tags = ["Overfitting", "Hint", "Regularization"]
                followups = ["Test My Understanding", "Give Me an Example", "Explain More Simply"]
            elif "underfit" in topic_lower:
                text = (
                    "💡 **Tutor Hint on Underfitting:**\n\n"
                    "If your model can't even get good accuracy on the data it was trained on, it is Underfitting!\n"
                    "• Hint: Don't restrict the model yet—give it more power. Use a deeper architecture, add non-linear features, train for more epochs, or reduce regularization."
                )
                tags = ["Underfitting", "Hint", "Model Capacity"]
                followups = ["Test My Understanding", "Give Me an Example", "Explain More Simply"]
            elif "precision" in topic_lower or "recall" in topic_lower:
                text = (
                    "💡 **Tutor Hint on Precision vs. Recall:**\n\n"
                    "Ask yourself: **Which mistake is more costly?**\n"
                    "• **False Positive (False Alarm):** You predicted Yes, but it was No. (Hurts Precision).\n"
                    "• **False Negative (Missed Detection):** You predicted No, but it was Yes! (Hurts Recall).\n"
                    "In medicine, missed detection is deadly → prioritize **Recall**!"
                )
                tags = ["Precision", "Recall", "Confusion Matrix"]
                followups = ["Test My Understanding", "Give Me an Example", "What is an F1-Score?"]
            elif "tree" in topic_lower:
                text = (
                    "💡 **Tutor Hint on Decision Trees:**\n\n"
                    "Remember that each node split chooses the feature that maximizes **Information Gain** (or minimizes Gini Impurity).\n"
                    "Without a `max_depth` limit, the tree will keep splitting until every single outlier has its own leaf, causing extreme overfitting."
                )
                tags = ["Decision Trees", "Hint", "Gini Impurity"]
                followups = ["Test My Understanding", "Give Me an Example", "What are Random Forests?"]
            elif "gradient" in topic_lower:
                text = (
                    "💡 **Tutor Hint on Gradient Descent:**\n\n"
                    "The gradient $\\nabla L(w)$ tells you which direction points uphill (increasing loss). "
                    "Because we want to minimize error, we step in the **opposite (negative)** direction multiplied by the step size $\\alpha$ (learning rate)."
                )
                tags = ["Gradient Descent", "Hint", "Optimization"]
                followups = ["Test My Understanding", "Give Me an Example", "Explain More Simply"]
            elif "classification" in topic_lower:
                text = (
                    "💡 **Tutor Hint on Classification:**\n\n"
                    "Ask yourself: **Is the output a distinct bucket or an open-ended decimal number?**\n"
                    "• If you can list the possible categories on a checklist (e.g. Yes/No, Red/Blue, Dog/Cat/Bird), it is **Classification**.\n"
                    "• If the answer can be any decimal measurement with infinite gradations (e.g. $425,320.50 or 72.4 mph), it is **Regression**."
                )
                tags = ["Classification", "Hint", "Problem Framing"]
                followups = ["Test My Understanding", "Give Me an Example", "What is Logistic Regression?"]
            else:
                text = (
                    f"💡 **Tutor Hint on {active_topic}:**\n\n"
                    f"Focus on the underlying loss metric and data representation. "
                    f"Whenever evaluating {active_topic}, always verify whether your validation data mirrors real-world production conditions."
                )
                tags = [active_topic, "Hint", "Best Practices"]
                followups = ["Test My Understanding", "Give Me an Example", "Explain More Simply"]

            return {
                "text": text,
                "difficulty": difficulty,
                "suggested_action": "test_understanding",
                "xp": 20,
                "concept_tags": tags,
                "followup_suggestions": followups,
                "topic": active_topic
            }

        # =========================================================================
        # 5. CORE DIRECT QUESTION RESPONSES (Persona & Difficulty Adapted)
        # =========================================================================

        # Question 1: What is overfitting?
        if "overfit" in topic_lower:
            if mentor_style == "Professor":
                text = (
                    "In statistical learning theory, **Overfitting** occurs when a parametric or non-parametric estimator $\\hat{f}(x)$ "
                    "memorizes the stochastic noise $\\epsilon$ of the empirical training distribution $\\mathcal{D}_{train}$ rather than the true underlying mapping function $f(x)$.\n\n"
                    "**Formal Diagnosis:**\n"
                    "• Empirical Risk (Training Loss) approaches zero: $\\hat{\\mathcal{R}}_{emp}(f) \\to 0$.\n"
                    "• True Risk (Generalization Error on $\\mathcal{D}_{test}$) diverges: $\\mathcal{R}(f) \\gg \\hat{\\mathcal{R}}_{emp}(f)$ (High Variance / VC-dimension overload).\n\n"
                    "**Remediation:**\n"
                    "1. Impose structural constraints: Tikhonov $L_2$ Ridge regularization $\\lambda ||w||_2^2$ or Sparsity $L_1$ Lasso $\\lambda ||w||_1$.\n"
                    "2. Stochastic dropout masks during backpropagation to prevent co-adaptation of activations.\n"
                    "3. Rigorous $K$-Fold cross-validation and early stopping based on validation loss inflections.\n\n"
                    "To verify: what mathematical property describes the relationship between model variance and data sample size?"
                )
                tags = ["Overfitting", "High Variance", "Regularization", "Generalization"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "What is underfitting?"]
            elif mentor_style == "Coach":
                text = (
                    "**Overfitting** is the number one rookie trap in competitive machine learning!\n\n"
                    "Here's what happens on the battlefield: your model trains until it hits a 99.9% win rate on your practice arena. "
                    "You think you're unstoppable—until you deploy against live boss monsters on unseen test data, and your model gets completely wiped out (62% accuracy)!\n\n"
                    "Why? Your model didn't learn the fight mechanics; it just memorized the training quirks and noise.\n\n"
                    "**How we battle Overfitting:**\n"
                    "• **Regularization ($L_1 / L_2$):** Penalize bloated weights.\n"
                    "• **Dropout:** Randomly turn off neurons so the network can't rely on crutches.\n"
                    "• **More Data:** Augment your dataset so the AI sees diverse scenarios.\n"
                    "• **Early Stopping:** Cut training the second your validation loss ticks upward!\n\n"
                    "Ready to test your instincts with a tactical scenario?"
                )
                tags = ["Overfitting", "ML Battle Tactics", "Regularization", "Validation Loss"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "What is underfitting?"]
            else:
                # Friend
                text = (
                    "**Overfitting** happens when an AI model learns the training data *too well*—to the point where it memorizes random noise, "
                    "outliers, and quirks instead of learning the actual general rule!\n\n"
                    "Think of a student preparing for a math test who memorizes the exact answers (and typos!) on the practice worksheet without "
                    "understanding the formulas. When the teacher hands out the real test with different numbers, the student gets completely stuck!\n\n"
                    "**Why it happens:**\n"
                    "• The model is too complex for the amount of data (too many parameters or layers).\n"
                    "• The model was trained for too many epochs without a validation check.\n"
                    "• The training dataset is too small or lacks variety.\n\n"
                    "**How we fix it:**\n"
                    "• **Cross-Validation:** Test on slices of data the model hasn't seen.\n"
                    "• **Regularization (L1/L2) & Dropout:** Add gentle penalties so the model doesn't over-rely on any single feature.\n"
                    "• **Collect More Data:** Give the model more examples so it sees the bigger picture.\n\n"
                    "Does that make sense, or would you like to see a real-world example?"
                )
                tags = ["Overfitting", "Machine Learning", "Generalization", "Model Tuning"]
                followups = ["Give Me an Example", "Test My Understanding", "What is underfitting?", "Explain More Simply"]

        # Question 2: What is underfitting?
        elif "underfit" in topic_lower:
            if mentor_style == "Professor":
                text = (
                    "**Underfitting** represents the asymptotic regime of **High Bias**, wherein the hypothesis class $\\mathcal{H}$ lacks "
                    "sufficient capacity or degrees of freedom to approximate the target mapping function $f(x)$.\n\n"
                    "**Characteristics:**\n"
                    "• Both Empirical Training Risk $\\hat{\\mathcal{R}}_{emp}$ and Generalization Risk $\\mathcal{R}$ remain unacceptably high.\n"
                    "• The model fails to capture dominant non-linearities and covariance structures in the feature space.\n\n"
                    "**Remediation:**\n"
                    "1. Expand model capacity (e.g. increase depth, layer width, or polynomial degree).\n"
                    "2. Engineer higher-order interaction features.\n"
                    "3. Relax over-aggressive regularization penalties (decrease $\\lambda$)."
                )
                tags = ["Underfitting", "High Bias", "Model Capacity"]
                followups = ["Give Me an Example", "Test My Understanding", "What is overfitting?", "Explain More Simply"]
            elif mentor_style == "Coach":
                text = (
                    "**Underfitting** means your model brought a wooden stick to a boss raid!\n\n"
                    "It's when your algorithm is way too basic to understand the challenge. If you try to predict complex stock market trends with a single straight line, "
                    "your training score will be terrible (45%), and your test score will be just as bad.\n\n"
                    "**The Fix:** Give your model some real firepower! Increase capacity, add non-linear layers, engineer better features, and train longer."
                )
                tags = ["Underfitting", "Model Power", "Bias-Variance"]
                followups = ["Give Me an Example", "Test My Understanding", "What is overfitting?", "Explain More Simply"]
            else:
                # Friend
                text = (
                    "**Underfitting** is the opposite of overfitting: it happens when your model is **too simple** to capture the underlying patterns in the data.\n\n"
                    "Imagine trying to summarize an entire 800-page mystery novel in just four words: *'People were in a house.'*\n"
                    "It's so bare-bones that it misses all the clues, character arcs, and revelations. It performs poorly on the training data AND on unseen test data (High Bias).\n\n"
                    "**Why it happens:**\n"
                    "• The model is too basic (like drawing a straight line through a curved scatterplot).\n"
                    "• Training stopped too early.\n"
                    "• You didn't give the model enough relevant features.\n\n"
                    "**How we fix it:**\n"
                    "• Use a more capable model (e.g. decision trees or neural networks instead of a simple linear model).\n"
                    "• Engineer richer input features.\n"
                    "• Train for more iterations and reduce regularization penalties."
                )
                tags = ["Underfitting", "High Bias", "Model Capacity", "Machine Learning"]
                followups = ["Give Me an Example", "Test My Understanding", "What is overfitting?", "Explain More Simply"]

        # Question 3: What is precision and recall?
        elif "precision" in topic_lower or "recall" in topic_lower:
            if mentor_style == "Professor":
                text = (
                    "In classification performance evaluation, **Precision** and **Recall** partition the confusion matrix into dual diagnostic metrics:\n\n"
                    "$$\\text{Precision} = \\frac{TP}{TP + FP} = P(Y=1 | \\hat{Y}=1)$$\n"
                    "$$\\text{Recall (Sensitivity)} = \\frac{TP}{TP + FN} = P(\\hat{Y}=1 | Y=1)$$\n\n"
                    "**The Inherent Trade-Off:**\n"
                    "Varying the decision threshold $\\tau \\in [0, 1]$ shifts the operating point along the Precision-Recall curve. "
                    "Raising $\\tau$ decreases false positives (improving precision) at the expense of higher false negatives (degrading recall).\n\n"
                    "The harmonic mean resolves this trade-off via the $F_1$-Score: $F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$."
                )
                tags = ["Precision", "Recall", "Confusion Matrix", "F1-Score"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Practice Question"]
            elif mentor_style == "Coach":
                text = (
                    "**Precision and Recall** are the twin gauges on your ML dashboard!\n\n"
                    "• **Precision = Quality of Hits:** When your model flags a target, how often is it a true bullseye instead of a false alarm? ($TP / (TP + FP)$)\n"
                    "• **Recall = Coverage:** Out of all enemy targets that exist on the radar, what percentage did your model lock onto? ($TP / (TP + FN)$)\n\n"
                    "In spam filters, you want Precision (don't throw out legitimate emails). In missile defense or cancer screening, you demand Recall (never miss a true threat)!\n\n"
                    "Which metric would you optimize for credit card fraud detection?"
                )
                tags = ["Precision", "Recall", "Trade-Offs", "Production Metrics"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Hint"]
            else:
                # Friend
                text = (
                    "**Precision** and **Recall** are two of the most important ways to measure how smart a classification model really is!\n\n"
                    "• **Precision asks:** *'Out of all the times the model predicted YES, how many were actually right?'*\n"
                    "  $\\text{Precision} = \\frac{\\text{True Positives}}{\\text{True Positives} + \\text{False Alarms}}$\n\n"
                    "• **Recall asks:** *'Out of all the actual real cases out there, how many did the model catch?'*\n"
                    "  $\\text{Recall} = \\frac{\\text{True Positives}}{\\text{True Positives} + \\text{Missed Cases}}$\n\n"
                    "**A Fun Comparison:**\n"
                    "• If you're filtering spam, you want **high precision** (you don't want a job offer or love letter going to spam by accident!).\n"
                    "• If you're screening for a contagious illness, you want **high recall** (you cannot afford to let an infected person slip through undetected).\n\n"
                    "Would you like to try a quick challenge to test your intuition?"
                )
                tags = ["Precision and Recall", "Evaluation Metrics", "Confusion Matrix", "Classification"]
                followups = ["Give Me an Example", "Test My Understanding", "What is an F1-Score?", "Explain More Simply"]

        # Question 4: Explain decision trees.
        elif "tree" in topic_lower:
            if mentor_style == "Professor":
                text = (
                    "A **Decision Tree** is a non-parametric hierarchical partitioner of the input feature space $\\mathcal{X} \\subset \\mathbb{R}^d$ "
                    "into axis-aligned hyper-rectangles $R_m$.\n\n"
                    "**Splitting Criterion:**\n"
                    "At each internal node, the algorithm greedily searches for a feature $j$ and split threshold $s$ that maximizes impurity reduction:\n"
                    "• **Classification:** Minimizes Gini Impurity $G = 1 - \\sum_{k=1}^K p_{mk}^2$ or Shannon Cross-Entropy $H = -\\sum_{k=1}^K p_{mk} \\log_2 p_{mk}$.\n"
                    "• **Regression:** Minimizes Mean Squared Error $\\sum_{i \\in R_1} (y_i - \\bar{y}_1)^2 + \\sum_{i \\in R_2} (y_i - \\bar{y}_2)^2$.\n\n"
                    "**Limitations:** Greedy recursive binary splitting is NP-complete and highly sensitive to training data perturbations (high variance), "
                    "which motivates ensemble architectures such as Random Forests and Gradient Boosted Trees (XGBoost)."
                )
                tags = ["Decision Trees", "Gini Impurity", "Information Gain", "Recursive Splitting"]
                followups = ["Give Me an Example", "Test My Understanding", "What are Random Forests?", "Explain More Simply"]
            elif mentor_style == "Coach":
                text = (
                    "**Decision Trees** are the master tactical playbooks of machine learning!\n\n"
                    "Instead of obscure mathematical black boxes, a decision tree asks clear, strategic Yes/No questions:\n"
                    "• *Is the customer's account older than 30 days?* → If No: High Risk.\n"
                    "• *Is the transaction amount > $1,000?* → If Yes: Flag for Verification.\n\n"
                    "**Why they rule:** Instant transparency. You can explain the exact branch to your company CEO or auditors.\n"
                    "**The Catch:** Left unpruned, they grow like weeds and overfit on everything! Keep your max depth tight."
                )
                tags = ["Decision Trees", "Tactical Playbook", "Pruning", "Explainability"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Practice Question"]
            else:
                # Friend
                text = (
                    "A **Decision Tree** is a flowchart-like model that makes decisions by asking a series of simple 'if-this-then-that' questions!\n\n"
                    "Think of playing the game **20 Questions**:\n"
                    "• *Question 1:* Is it living? (Yes)\n"
                    "• *Question 2:* Does it have fur? (Yes)\n"
                    "• *Question 3:* Does it bark? (Yes) → **Prediction: Dog!**\n\n"
                    "**How it works in AI:**\n"
                    "1. **Root Node:** The top question that looks at the most informative feature.\n"
                    "2. **Branches & Internal Nodes:** The split paths based on values (e.g. Age > 25, Income > $50,000).\n"
                    "3. **Leaf Nodes:** The end points that deliver the final class label or number.\n\n"
                    "They are super popular because they are completely transparent—you can visually see exactly why the computer made its prediction!"
                )
                tags = ["Decision Trees", "Supervised Learning", "Flowcharts", "Intuitive AI"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "What are Random Forests?"]

        # Question 5: Give me a simple example of classification.
        elif "classification" in topic_lower or "classify" in topic_lower:
            text = (
                "**Classification** is the task of predicting a **discrete category or label** for an item based on its features, "
                "unlike regression which predicts a continuous decimal number!\n\n"
                "**Everyday Examples of Classification:**\n"
                "1. **Email Filtering:** Categorizing incoming messages as either **'Inbox'** or **'Spam'** (Binary Classification).\n"
                "2. **Photo Tagging:** Identifying whether an animal in a picture is a **'Cat'**, **'Dog'**, or **'Bird'** (Multi-Class Classification).\n"
                "3. **Medical Diagnostics:** Screening an X-ray as **'Healthy'** vs. **'Showing Pneumonia'**.\n"
                "4. **Credit Card Security:** Labeling a swipe as **'Authorized'** or **'Fraudulent'**.\n\n"
                "**Intuitive Analogy:** Think of sorting your laundry into separate baskets: whites, darks, and colors. "
                "You inspect the fabric's features and sort it into the right bucket!\n\n"
                "Does that help you see where classification fits into machine learning?"
            )
            tags = ["Classification", "Supervised Learning", "Binary vs Multi-Class", "Machine Learning"]
            followups = [
                "Give Me an Example",
                "Test My Understanding",
                "What's the difference between classification and regression?",
                "What is Logistic Regression?"
            ]

        # Question 6: What is gradient descent?
        elif "gradient" in topic_lower:
            if mentor_style == "Professor":
                text = (
                    "**Gradient Descent** is a first-order iterative optimization algorithm for finding a local minimum of a differentiable objective function $\\mathcal{L}(\\theta)$:\n\n"
                    "$$\\theta_{t+1} = \\theta_t - \\alpha \\nabla_{\\theta} \\mathcal{L}(\\theta_t)$$\n\n"
                    "Where:\n"
                    "• $\\theta \\in \\mathbb{R}^d$ denotes the vector of trainable parameters (weights and biases).\n"
                    "• $\\nabla_{\\theta} \\mathcal{L}(\\theta)$ represents the gradient vector pointing in the direction of steepest loss ascent.\n"
                    "• $\\alpha > 0$ denotes the step size or **learning rate**.\n\n"
                    "**Convergence Dynamics:**\n"
                    "Under Lipschitz continuous gradients $\\|\\nabla \\mathcal{L}(u) - \\nabla \\mathcal{L}(v)\\| \\le L \\|u - v\\|$, "
                    "choosing $\\alpha < \\frac{2}{L}$ guarantees monotonic convergence toward a stationary point $\\nabla \\mathcal{L}(\\theta) = 0$."
                )
                tags = ["Gradient Descent", "Optimization", "Calculus", "Loss Functions"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "What is Stochastic Gradient Descent?"]
            elif mentor_style == "Coach":
                text = (
                    "**Gradient Descent** is the training engine powering every modern neural network and ML model!\n\n"
                    "Every time your model makes a prediction, it makes errors. The Loss function tells you how bad that error is. "
                    "Gradient descent calculates the slope of that error and updates every weight in the network to drive that error down to zero!\n\n"
                    "**The Critical Dial: Learning Rate ($\\alpha$)**\n"
                    "• **Too high:** Your weights overshoot the valley and explode into `NaN` chaos!\n"
                    "• **Too low:** It crawls like a snail and takes 3 weeks to finish training.\n"
                    "• **Just right:** Smooth convergence to victory!"
                )
                tags = ["Gradient Descent", "Learning Rate", "Optimization", "Model Training"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Hint"]
            else:
                # Friend
                text = (
                    "**Gradient Descent** is the primary algorithm machines use to learn and improve from their mistakes!\n\n"
                    "**The Mountain Analogy:**\n"
                    "Imagine you are blindfolded on a foggy mountain and want to reach the lowest valley floor at the bottom:\n"
                    "• You can't see the whole mountain, but you can feel the slope under your feet.\n"
                    "• You take a step in whichever direction slopes downhill most steeply.\n"
                    "• You keep taking steps downhill until the ground completely levels out.\n\n"
                    "**In Machine Learning:**\n"
                    "• The mountain is your **Loss (error rate)**.\n"
                    "• The bottom of the valley is where the error is minimal and accuracy is highest.\n"
                    "• The size of your steps is called the **Learning Rate**.\n\n"
                    "If your steps are too big, you might leap right over the valley! If your steps are too small, it takes forever to reach the bottom."
                )
                tags = ["Gradient Descent", "Optimization", "Learning Rate", "Neural Networks"]
                followups = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Practice Question"]

        # Other specific AI topics
        elif "logistic regression" in topic_lower:
            text = (
                "**Logistic Regression** is a foundational classification algorithm that predicts the probability of a binary outcome (0 or 1)!\n\n"
                "Unlike linear regression which outputs any continuous number from $-\\infty$ to $+\\infty$, logistic regression passes that linear combination "
                "through the S-shaped **Sigmoid activation function**:\n\n"
                "$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$\n\n"
                "This squashes any output into a valid probability between **0.0 and 1.0** (e.g. 0.85 = 85% probability of Spam). "
                "By default, if probability $\\ge 0.5$, it predicts Class 1; otherwise, Class 0!"
            )
            tags = ["Logistic Regression", "Sigmoid Function", "Binary Classification", "Machine Learning"]
            followups = ["Give Me an Example", "Test My Understanding", "What's the difference between linear and logistic regression?", "Explain More Simply"]

        elif "cnn" in topic_lower or "convolutional" in topic_lower:
            text = (
                "**Convolutional Neural Networks (CNNs)** are specialized deep learning architectures designed for processing grid-structured data such as images!\n\n"
                "**The Core Architecture:**\n"
                "• **Convolutional Layers:** Slide learnable filters (kernels) across images to extract local spatial features (edges, textures, shapes).\n"
                "• **Activation Function (ReLU):** Introduces non-linearity to capture intricate visual hierarchies.\n"
                "• **Pooling Layers (Max Pooling):** Downsamples feature maps to reduce spatial dimensions, computing costs, and achieve translation invariance.\n"
                "• **Fully Connected (Dense) Layers:** Combines high-level extracted representations to make final predictions (e.g., Cat vs. Dog).\n\n"
                "Unlike standard multi-layer perceptrons that flatten images and lose 2D geometry, CNNs preserve spatial relationships through **parameter sharing** and **local receptive fields**."
            )
            tags = ["CNN", "Convolutional Neural Networks", "Computer Vision", "Deep Learning"]
            followups = ["Give Me an Example", "Test My Understanding", "What is Max Pooling?", "Explain More Simply"]

        elif "neural network" in topic_lower or "deep learning" in topic_lower:
            text = (
                "**Neural Networks** are computational models inspired by biological brain neurons, designed to learn complex non-linear patterns!\n\n"
                "**The Core Architecture:**\n"
                "• **Input Layer:** Receives raw features (pixels, text tokens, tabular numbers).\n"
                "• **Hidden Layers:** Layers of interconnected artificial neurons that compute weighted sums and apply non-linear activations (like ReLU).\n"
                "• **Output Layer:** Delivers the final prediction (class label or numerical value).\n\n"
                "They learn through a 2-step loop: **Forward Propagation** (making a prediction) and **Backpropagation** (using gradient descent to adjust weights and minimize error)."
            )
            tags = ["Neural Networks", "Deep Learning", "Backpropagation", "Activations"]
            followups = ["Give Me an Example", "Test My Understanding", "What is Backpropagation?", "Explain More Simply"]

        # Default fallback for any other general or curriculum inquiry
        else:
            text = (
                f"**{active_topic}** is a core concept in modern artificial intelligence and machine learning.\n\n"
                f"When studying {active_topic}, the central objective is understanding how models extract meaningful patterns from training data "
                f"and generalize effectively to unseen real-world scenarios.\n\n"
                f"Key principles to master:\n"
                f"• **Objective Formulation:** Clearly define what loss function or evaluation metric measures success.\n"
                f"• **Generalization Testing:** Always validate your model on independent test data to avoid overfitting.\n"
                f"• **Hyperparameter Calibration:** Tune learning rates, complexity, and regularization for optimal stability.\n\n"
                f"What specific question or practical aspect of **{active_topic}** would you like to explore next?"
            )
            tags = [active_topic, "Artificial Intelligence", "Machine Learning"]
            followups = [
                f"Give me a real-world example of {active_topic}",
                f"Test my understanding of {active_topic}",
                f"Explain {active_topic} more simply",
                f"Give me a hint on {active_topic}"
            ]

        return {
            "text": text,
            "difficulty": difficulty,
            "suggested_action": "test_understanding" if action_type == "explain_simply" else "continue",
            "xp": 20,
            "concept_tags": tags[:4],
            "followup_suggestions": followups[:4],
            "topic": active_topic
        }

tutor_agent_service = AITutorAgentService()
