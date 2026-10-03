# MongoDB Atlas Migration & Deployment Guide — AI Quest

This document provides complete instructions for setting up **MongoDB Atlas**, configuring local and cloud environments, testing connectivity, and deploying the AI Quest backend to **Render**.

---

## 1. How to Create a MongoDB Atlas Database

1. Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create** or **Build a Database**.
3. Choose the **Free M0 Shared Cluster** tier (ideal for development and testing).
4. Select your preferred Cloud Provider (AWS, Google Cloud, or Azure) and Region close to your users or Render deployment region (e.g. `us-east-1` or `frankfurt`).
5. Set your **Cluster Name** (default: `Cluster0`) and click **Create Deployment**.

---

## 2. How to Create a MongoDB Database User

1. In the MongoDB Atlas dashboard, navigate to **Security** → **Database Access**.
2. Click **Add New Database User**.
3. Select **Password** Authentication Method.
4. Enter a **Username** (e.g., `aiquest_admin`).
5. Enter or auto-generate a secure **Password** (save this securely).
6. Under **Database User Privileges**, select **Read and write to any database** (or assign custom role for `ai_quest`).
7. Click **Add User**.

---

## 3. How to Configure Network Access & Obtain the SRV URI

### Network Access
1. Navigate to **Security** → **Network Access**.
2. Click **Add IP Address**.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so that both your local development machine and Render cloud instances can connect.
4. Click **Confirm**.

### Obtain the MongoDB SRV Connection String
1. Under **Deployment** → **Database**, click the **Connect** button next to your cluster.
2. Select **Drivers** (Python).
3. Copy the SRV connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Replace `<username>` and `<password>` with your database user credentials.

---

## 4. Where to Put MONGODB_URI Locally

Create or update [`backend/.env`](file:///c:/Users/anitp/OneDrive/Desktop/AI_Quest/backend/.env):

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://aiquest_admin:<your_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=ai_quest

# AI Tutor Configuration
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-3.5-flash-lite

# Local Server Settings
PORT=8000
HOST=0.0.0.0
DEBUG=True
SECRET_KEY=local-dev-secret-key
```

> **Note**: For local offline development without internet, you can also use `MONGODB_URI=mongodb://127.0.0.1:27017`.

---

## 5. How to Run the Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --port 8000 --reload
   ```
4. Access the interactive documentation at:
   - Swagger UI: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

---

## 6. How to Test MongoDB Connectivity

Run the automated test suite from the `backend/` directory:

```bash
python test_mongodb_migration.py
```

This automated suite tests:
- MongoDB connection and collection indexing
- User signup with bcrypt password hashing
- User login and invalid credential rejection
- User profile updates in MongoDB
- Game progress, XP, streak, and achievements persistence
- Course progress and bookmarks persistence
- AI Tutor queries and multi-turn conversation memory stored in MongoDB
- Quiz evaluation and adaptive difficulty adjustment

---

## 7. How to Test the AI Tutor

Run the comprehensive AI Tutor test suite:

```bash
python test_all_tutor_cases.py
```

This tests 6 unique topics ("What is overfitting?", "What is underfitting?", "What is precision and recall?", "Explain decision trees", "Give me a simple example of classification", "What is gradient descent?"), verifies each receives a distinct topic-specific answer, tests dynamic action buttons ("Give Me an Example", "Test My Understanding", "Explain More Simply"), and verifies conversation topic switching.

---

## 8. Render Deployment Configuration

When deploying the backend service on [Render](https://render.com):

### Build & Start Commands
- **Environment**: Python 3
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Render Environment Variables
Add these in the Render Dashboard under **Environment**:

| Variable Name | Example Value / Description | Required |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` | Yes |
| `MONGODB_DATABASE` | `ai_quest` | Yes |
| `GEMINI_API_KEY` | `AIzaSy...` (or `OPENAI_API_KEY`) | Yes |
| `AI_MODEL` | `gemini-3.5-flash-lite` | Yes |
| `SECRET_KEY` | `your-secure-random-secret-key` | Yes |
| `DEBUG` | `False` | No (default: True) |
| `PORT` | Set automatically by Render | Auto |

---

## 9. MongoDB Collections Overview

| Collection Name | Purpose | Primary Indexes |
|---|---|---|
| `users` | User accounts, profiles, level, XP, streak, achievements | `username` (unique), `email` (unique sparse), `id` (unique) |
| `user_sessions` | Adaptive difficulty, active learning state | `user_id` (unique), `id` (unique) |
| `courses_progress`| Completed lessons, completed modules, course XP | `(user_id, course_id)` (compound unique) |
| `bookmarks` | Saved course lessons | `(user_id, lesson_id)` (compound unique), `user_id` |
| `conversations` | AI Tutor sessions | `id` (unique), `user_id`, `updated_at` |
| `messages` | Chat history turns, concept tags, suggestions | `id` (unique), `(conversation_id, created_at)` |
| `quiz_evaluations` | Practice quiz submissions, correctness, feedback | `id` (unique), `user_id`, `created_at` |
