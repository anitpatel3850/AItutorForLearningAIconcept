# AI QUEST — Learn AI by Playing

An educational, gamified platform where students learn Artificial Intelligence concepts through structured course roadmaps, syllabus documentation, interactive coding quests, raid boss battles, and a **Real AI Tutor Agent**.

---

## 1. AI Tutor Architecture

The AI Tutor is built using an asynchronous, decoupled client-server architecture. The browser never accesses the LLM API directly, ensuring API keys and system instructions remain strictly secure on the server.

```
React / TypeScript Frontend (Port 3000)
       │
       │ HTTP POST /api/tutor/chat
       │ HTTP POST /api/tutor/evaluate
       ▼
Vite Dev Server Reverse Proxy
       │
       ▼
FastAPI Backend Server (Port 8000)
       │
       ├── Course & Curriculum Context Engine (In-Memory Catalog)
       ├── MongoDB Atlas Persistent Storage (Motor Async Driver)
       │   ├── users, user_sessions, courses_progress, bookmarks
       │   └── conversations, messages, quiz_evaluations
       ├── Adaptive Difficulty & Pedagogical Persona Engine
       ▼
Google Gemini API / LLM (`gemini-3.5-flash-lite`)
```

---

## 2. Agent Workflow

1. **Context Resolution**: When a student opens the AI Tutor page or asks a question from any lesson, the client passes `course_id`, `module_id`, `lesson_id`, and `mentor_style` (Friend, Professor, or Coach).
2. **Conversation Retrieval**: The backend retrieves past turns for the conversation from SQLite to maintain multi-turn memory.
3. **Agent Assembly**: The `AITutorAgentService` constructs tailored system instructions combining the mentor persona, active learning objectives, student difficulty tier, and available tools.
4. **Agent Execution**: The OpenAI Agents SDK `Runner.run()` invokes the agent with function tools.
5. **Adaptive Evaluation**: When a student submits an answer to a question, `POST /api/tutor/evaluate` assesses correctness, updates consecutive successes/struggles, dynamically recalibrates the difficulty tier, and awards XP.
6. **Graceful Fallback**: If `OPENAI_API_KEY` is omitted or temporarily unreachable, the system automatically falls back to the local contextual pedagogical engine so the student is never blocked.

---

## 3. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tutor/health` | Service health status check |
| `GET` | `/api/tutor/context` | Available courses, modules, and lessons catalog |
| `POST` | `/api/tutor/chat` | Send a student query to the AI Tutor agent |
| `POST` | `/api/tutor/evaluate` | Submit student answer for evaluation, XP, and difficulty adjustment |
| `GET` | `/api/tutor/history/{id}` | Retrieve stored chat messages for a conversation session |

### Sample Chat Request (`POST /api/tutor/chat`)
```json
{
  "message": "What is classification?",
  "course_id": "machine-learning",
  "lesson_id": "ml-l5-classification",
  "mentor_style": "Friend",
  "current_difficulty": "beginner"
}
```

### Sample Chat Response
```json
{
  "message": "Think of classification like sorting mail into different boxes...",
  "conversation_id": "conv-45eb809ef635",
  "difficulty": "beginner",
  "suggested_action": "test_understanding",
  "xp": 20,
  "concept_tags": ["Classification", "Supervised Learning"],
  "followup_suggestions": [
    "I still don't understand",
    "Give Me an Example",
    "Test My Understanding"
  ]
}
```

### Sample Evaluation Request (`POST /api/tutor/evaluate`)
```json
{
  "user_id": "student_explorer",
  "course_id": "machine-learning",
  "lesson_id": "ml-l5-classification",
  "question": "Is this system performing Classification or Regression, and why?",
  "user_answer": "It is Classification because the system outputs distinct discrete categories.",
  "current_difficulty": "beginner"
}
```

---

## 4. Environment Variables

Create a `.env` file in the root or `backend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini
PORT=8000
HOST=0.0.0.0
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./tutor.db
```

> **Security Rule:** Never commit the `.env` file to version control. The frontend Vite bundle does not include `OPENAI_API_KEY`.

---

## 5. Local Setup & Running

### Prerequisites
- Node.js 18+
- Python 3.10+ (tested with Python 3.12)

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
python -m pip install -r requirements.txt
cd ..
```

### 2. Start the Backend Server
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Start the Frontend Server
In a separate terminal:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 6. How the Agent Uses Course Context

The tutor agent leverages syllabus data from `backend/app/data/courses_data.py`:
- **Active Course**: Connects inquiries to the wider curriculum (e.g. *Machine Learning*, *Deep Learning*, *Computer Vision*).
- **Active Module**: Provides topical boundaries (e.g. *Supervised Learning Algorithms*).
- **Lesson Learning Objectives**: The agent anchors explanations directly to the syllabus objective (e.g. deriving decision boundaries and understanding odds ratios).
- **Important Concepts**: Supplies `#Classification`, `#DecisionBoundary`, and `#Sigmoid` tags to reinforce key vocabulary.

---

## 7. Adaptive Difficulty & Pedagogy

The AI Tutor adjusts explanations to the student's mastery tier:

- **Beginner**: Relies on analogies, everyday metaphors, and high-level intuition without overwhelming notation.
- **Intermediate**: Introduces mathematical formalisms, parameter trade-offs (e.g. L1/L2 regularization), and code snippets.
- **Advanced**: Explores optimization dynamics, loss landscape convexity, and edge-case failure modes.

### Difficulty Adjustment Rules:
- **Promotion**: 2 consecutive correct answers elevate difficulty (e.g. `BEGINNER` → `INTERMEDIATE` → `ADVANCED`).
- **Demotion**: 2 consecutive struggles or explicit simplification requests ease difficulty back down to prevent frustration.

---

## 8. Conversation Memory

- Stored in SQLite via SQLAlchemy async engine (`tutor.db`).
- Tracks `conversations` (user ID, course ID, lesson ID, timestamps) and `messages` (sender, text, tags, difficulty).
- Allows the agent to remember context across turns (e.g., student saying *"I still don't understand"* references the previous explanation).

---

## 9. Security Considerations

- **Zero Client-Side Exposure**: `OPENAI_API_KEY` is loaded strictly on the server and is never transmitted in frontend bundles or responses.
- **Input Sanitization**: Request bodies enforce character limits to prevent buffer or token exhaustion attacks.
- **Safe Error Shielding**: System errors and stack traces are suppressed; users receive friendly, actionable messages.
