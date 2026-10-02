import json
import urllib.request

def test_tutor_flow():
    base_url = "http://127.0.0.1:8000"

    print("=== TEST 1: Health Check ===")
    with urllib.request.urlopen(f"{base_url}/api/tutor/health") as res:
        health = json.loads(res.read())
        print("Health status:", health["status"])
        assert res.status == 200

    print("\n=== TEST 2: Student asks: 'What is classification?' ===")
    chat_payload = {
        "message": "What is classification?",
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "mentor_style": "Friend",
        "current_difficulty": "beginner"
    }
    req = urllib.request.Request(
        f"{base_url}/api/tutor/chat",
        data=json.dumps(chat_payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        data1 = json.loads(res.read())
        conv_id = data1["conversation_id"]
        print("Response 1:", data1["message"][:150] + "...")
        print("Conversation ID:", conv_id)
        print("Difficulty:", data1["difficulty"])

    print("\n=== TEST 3: Student asks: 'I still don't understand.' ===")
    chat_payload2 = {
        "message": "I still don't understand.",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "mentor_style": "Friend",
        "current_difficulty": "beginner"
    }
    req2 = urllib.request.Request(
        f"{base_url}/api/tutor/chat",
        data=json.dumps(chat_payload2).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req2) as res:
        data2 = json.loads(res.read())
        print("Response 2 (Simplified with Analogy):\n", data2["message"])
        print("Follow-up options:", data2["followup_suggestions"])

    print("\n=== TEST 4: Student chooses 'Test My Understanding' ===")
    chat_payload3 = {
        "message": "Test My Understanding",
        "action_type": "test_understanding",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "mentor_style": "Friend",
        "current_difficulty": "beginner"
    }
    req3 = urllib.request.Request(
        f"{base_url}/api/tutor/chat",
        data=json.dumps(chat_payload3).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req3) as res:
        data3 = json.loads(res.read())
        print("Response 3 (Concept Check Question):\n", data3["message"])

    print("\n=== TEST 5: Student submits Answer for Evaluation ===")
    eval_payload = {
        "user_id": "student_explorer",
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "question": "Is this system performing Classification or Regression, and why?",
        "user_answer": "It is Classification because the system is outputting distinct discrete categories (Approved vs Fraud) rather than a continuous number.",
        "current_difficulty": "beginner"
    }
    req4 = urllib.request.Request(
        f"{base_url}/api/tutor/evaluate",
        data=json.dumps(eval_payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req4) as res:
        eval_res = json.loads(res.read())
        print("Correct:", eval_res["correct"])
        print("Feedback:", eval_res["feedback"])
        print("Explanation:", eval_res["explanation"])
        print("New Difficulty:", eval_res["difficulty"])
        print("XP Awarded:", eval_res["xp_awarded"])

    print("\n=== ALL BACKEND TUTOR TESTS PASSED! ===")

if __name__ == "__main__":
    test_tutor_flow()
