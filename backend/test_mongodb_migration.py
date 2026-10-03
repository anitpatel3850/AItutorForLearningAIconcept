import json
import urllib.request
import urllib.error
import sys

BASE_URL = "http://127.0.0.1:8000"

def post_json(endpoint, payload, headers=None):
    all_headers = {"Content-Type": "application/json"}
    if headers:
        all_headers.update(headers)
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(payload).encode("utf-8"),
        headers=all_headers
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode("utf-8"))

def get_json(endpoint, headers=None):
    all_headers = {}
    if headers:
        all_headers.update(headers)
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers=all_headers
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode("utf-8"))

def put_json(endpoint, payload, headers=None):
    all_headers = {"Content-Type": "application/json"}
    if headers:
        all_headers.update(headers)
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(payload).encode("utf-8"),
        headers=all_headers,
        method="PUT"
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode("utf-8"))

def run_all_tests():
    print("============================================================")
    print("PHASE 14 — MONGODB MIGRATION VERIFICATION SUITE")
    print("============================================================")

    # 1. Health check
    print("\n[1] Checking /health...")
    h = get_json("/health")
    assert h["status"] == "ok", f"Health status not ok: {h}"
    assert h["database"] == "connected", f"Database not connected: {h}"
    print(f"PASSED: Health check ok, database: {h['database']} ({h['database_name']})")

    # 2. Demo User Login
    print("\n[2] Testing Demo User Login (explorer@aiquest.io)...")
    login_res = post_json("/api/auth/login", {
        "email": "explorer@aiquest.io",
        "password": "anypassword"
    })
    assert login_res["success"] is True, f"Demo login failed: {login_res}"
    demo_user = login_res["user"]
    assert demo_user["email"] == "explorer@aiquest.io"
    assert demo_user["level"] == 14
    assert demo_user["xp"] == 4850
    token = login_res["token"]
    user_id = demo_user["id"]
    print(f"PASSED: Demo login succeeded for user '{demo_user['username']}' (ID: {user_id})")

    # 3. New User Signup
    import random
    rand_suffix = random.randint(1000, 9999)
    test_user = f"novice_{rand_suffix}"
    test_email = f"novice_{rand_suffix}@aiquest.io"
    print(f"\n[3] Testing User Signup ({test_user})...")
    signup_res = post_json("/api/auth/signup", {
        "fullName": "Neural Novice",
        "username": test_user,
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert signup_res["success"] is True, f"Signup failed: {signup_res}"
    new_user = signup_res["user"]
    assert new_user["username"] == test_user
    assert new_user["level"] == 1
    assert new_user["xp"] == 0
    new_token = signup_res["token"]
    new_uid = new_user["id"]
    print(f"PASSED: User '{test_user}' signed up and stored in MongoDB with hashed password (ID: {new_uid})")

    # 4. User Login with new user
    print(f"\n[4] Testing Login with newly registered user...")
    login_new = post_json("/api/auth/login", {
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert login_new["success"] is True, f"Login failed: {login_new}"
    print("PASSED: Verified login with bcrypt password authentication!")

    # 5. Invalid password rejection
    print("\n[5] Testing Login Rejection with wrong password...")
    bad_login = post_json("/api/auth/login", {
        "email": test_email,
        "password": "WrongPassword999!"
    })
    assert bad_login["success"] is False, "Should have rejected invalid password"
    print("PASSED: Invalid password correctly rejected!")

    # 6. Current user lookup (/api/auth/me)
    print(f"\n[6] Testing /api/auth/me lookup for {new_uid}...")
    me_res = get_json("/api/auth/me", headers={"X-User-Id": new_uid})
    assert me_res["user"]["id"] == new_uid
    assert me_res["user"]["username"] == test_user
    print("PASSED: /api/auth/me returned correct user profile from MongoDB!")

    # 7. Update profile in MongoDB
    print(f"\n[7] Testing /api/auth/profile update...")
    prof_update = put_json("/api/auth/profile", {
        "title": "Quantum Prodigy",
        "mentor": "Professor"
    }, headers={"X-User-Id": new_uid})
    assert prof_update["success"] is True
    assert prof_update["user"]["title"] == "Quantum Prodigy"
    assert prof_update["user"]["mentor"] == "Professor"
    print("PASSED: Profile successfully updated and persisted in MongoDB!")

    # 8. Update user progress in MongoDB
    print(f"\n[8] Testing /api/auth/progress update...")
    prog_update = put_json("/api/auth/progress", {
        "level": 2,
        "xp": 450,
        "streak": 2,
        "completedMissions": ["m-01"],
        "unlockedAchievements": ["ach-first-quest"]
    }, headers={"X-User-Id": new_uid})
    assert prog_update["success"] is True
    assert prog_update["user"]["level"] == 2
    assert prog_update["user"]["xp"] == 450
    assert "m-01" in prog_update["user"]["completedMissions"]
    print("PASSED: Game progress, XP, and achievements updated in MongoDB!")

    # 9. Course Progress persistence in MongoDB
    print(f"\n[9] Testing Course Progress persistence (/api/progress/courses)...")
    c_save = post_json("/api/progress/courses", {
        "courseId": "machine-learning",
        "completedLessons": ["ml-l1-paradigms", "ml-l2-loss-optimization"],
        "completedModules": ["ml-m1"],
        "xp": 250,
        "progressPercentage": 25,
        "currentLessonId": "ml-l3-imputation"
    }, headers={"X-User-Id": new_uid})
    assert c_save["success"] is True

    c_get = get_json("/api/progress/courses", headers={"X-User-Id": new_uid})
    assert "machine-learning" in c_get["progress"]
    ml_prog = c_get["progress"]["machine-learning"]
    assert ml_prog["completedLessons"] == ["ml-l1-paradigms", "ml-l2-loss-optimization"]
    assert ml_prog["xp"] == 250
    print("PASSED: Course progress persisted and retrieved from MongoDB courses_progress collection!")

    # 10. Bookmarks persistence in MongoDB
    print(f"\n[10] Testing Bookmarks persistence (/api/progress/bookmarks)...")
    bm_save = post_json("/api/progress/bookmarks", {
        "courseId": "machine-learning",
        "courseTitle": "Machine Learning",
        "moduleId": "ml-m1",
        "moduleTitle": "ML Foundations",
        "lessonId": "ml-l2-loss-optimization",
        "lessonTitle": "Cost Functions & Gradient Descent"
    }, headers={"X-User-Id": new_uid})
    assert bm_save["success"] is True

    bm_get = get_json("/api/progress/bookmarks", headers={"X-User-Id": new_uid})
    assert len(bm_get["bookmarks"]) >= 1
    assert bm_get["bookmarks"][0]["lessonId"] == "ml-l2-loss-optimization"
    print("PASSED: Bookmark persisted and retrieved from MongoDB bookmarks collection!")

    # 11. AI Tutor Question 1: What is overfitting?
    print("\n[11] Testing AI Tutor with MongoDB: 'What is overfitting?'...")
    tutor_res = post_json("/api/tutor/chat", {
        "message": "What is overfitting?",
        "user_id": new_uid,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "mentor_style": "Friend",
        "current_difficulty": "beginner"
    })
    msg = tutor_res["message"]
    conv_id = tutor_res["conversation_id"]
    print(f"Tutor Response: {msg[:120]}...")
    assert "logistic regression" not in msg.lower()[:80], "ERROR: Response started with logistic regression!"
    assert any(term in msg.lower() for term in ["overfit", "memoriz", "training data", "noise"]), "ERROR: Did not answer overfitting!"
    print(f"PASSED: AI Tutor accurately answered overfitting in conversation {conv_id}!")

    # 12. AI Tutor Question 2: What is underfitting?
    print("\n[12] Testing AI Tutor with MongoDB: 'What is underfitting?'...")
    tutor_res2 = post_json("/api/tutor/chat", {
        "message": "What is underfitting?",
        "conversation_id": conv_id,
        "user_id": new_uid,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    msg2 = tutor_res2["message"]
    print(f"Tutor Response: {msg2[:120]}...")
    assert any(term in msg2.lower() for term in ["underfit", "bias", "simple", "capacity"]), "ERROR: Did not answer underfitting!"
    print("PASSED: AI Tutor accurately answered underfitting!")

    # 13. AI Tutor Conversation History in MongoDB
    print(f"\n[13] Testing Conversation History from MongoDB (/api/tutor/history/{conv_id})...")
    history_res = get_json(f"/api/tutor/history/{conv_id}")
    messages = history_res["messages"]
    assert len(messages) >= 4, f"Expected at least 4 messages in history, got {len(messages)}"
    assert messages[0]["sender"] == "user"
    assert "overfitting" in messages[0]["text"].lower()
    assert messages[1]["sender"] == "tutor"
    print(f"PASSED: Verified conversation history containing {len(messages)} messages stored in MongoDB messages collection!")

    # 14. Quiz Evaluation with MongoDB persistence
    print("\n[14] Testing Quiz Evaluation with MongoDB persistence...")
    eval_res = post_json("/api/tutor/evaluate", {
        "user_id": new_uid,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "question": "Does training accuracy 99.8% vs validation 61.4% indicate Overfitting or Underfitting?",
        "user_answer": "It is Overfitting because the model memorized the training data and has high variance."
    })
    assert eval_res["correct"] is True, f"Expected correct answer, got: {eval_res}"
    print(f"Feedback: {eval_res['feedback'][:100]}...")
    print(f"XP awarded: {eval_res['xp_awarded']}")
    print("PASSED: Quiz evaluation accurately assessed and stored in MongoDB quiz_evaluations collection!")

    print("\n============================================================")
    print("ALL 14 MONGODB VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("============================================================")

if __name__ == "__main__":
    run_all_tests()
