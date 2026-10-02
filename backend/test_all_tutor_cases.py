import json
import sys
import urllib.request

if hasattr(sys.stdout, "reconfigure"):
    getattr(sys.stdout, "reconfigure")(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    getattr(sys.stderr, "reconfigure")(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def post_json(endpoint, payload):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode("utf-8"))

def test_questions():
    print("=" * 60)
    print("TESTING 6 REQUIRED TUTOR QUESTIONS (Requirement 9)")
    print("=" * 60)

    test_cases = [
        ("What is overfitting?", "Overfitting", ["overfit", "memoriz", "training data", "variance"]),
        ("What is underfitting?", "Underfitting", ["underfit", "bias", "too simple", "capacity"]),
        ("What is precision and recall?", "Precision and Recall", ["precision", "recall", "true positive"]),
        ("Explain decision trees.", "Decision Trees", ["decision tree", "split", "node", "leaf"]),
        ("Give me a simple example of classification.", "Classification", ["classification", "discrete", "categor", "spam"]),
        ("What is gradient descent?", "Gradient Descent", ["gradient", "descent", "learning rate", "loss", "mountain"])
    ]

    responses = []

    for q, expected_topic, expected_keywords in test_cases:
        print(f"\n--- Testing Question: '{q}' ---")
        payload = {
            "message": q,
            "course_id": "machine-learning",
            "lesson_id": "ml-l5-classification",
            "mentor_style": "Friend",
            "current_difficulty": "beginner"
        }
        res = post_json("/api/tutor/chat", payload)
        msg = res["message"]
        tags = res.get("concept_tags", [])
        
        print(f"Tags: {tags}")
        print(f"Snippet: {msg[:160]}...")

        # Assertions
        assert "Great question about **Logistic Regression" not in msg, \
            f"ERROR: Received stale Logistic Regression answer for '{q}'!"
        
        lower_msg = msg.lower()
        matched = [kw for kw in expected_keywords if kw in lower_msg]
        assert len(matched) > 0, f"ERROR: None of expected keywords {expected_keywords} found in response for '{q}'"
        
        # Verify answer is relevant to topic
        if expected_topic == "Overfitting":
            assert "logistic regression" not in lower_msg[:120], "ERROR: Overfitting response started with logistic regression!"
            assert "overfit" in lower_msg, "ERROR: Overfitting response missing 'overfit'!"

        responses.append(msg)
        print(f"PASSED: '{q}' correctly addressed topic '{expected_topic}'!")

    # Verify answers are NOT identical
    print("\n--- Verifying answers are all unique ---")
    for i in range(len(responses)):
        for j in range(i + 1, len(responses)):
            assert responses[i] != responses[j], f"ERROR: Response {i} and {j} are identical!"
    print("PASSED: All 6 answers are completely unique and distinct!")

def test_action_buttons():
    print("\n" + "=" * 60)
    print("TESTING DYNAMIC ACTION BUTTONS (Requirement 10)")
    print("=" * 60)

    # 1. Ask about Overfitting first
    print("\n1. Asking: 'What is overfitting?'")
    r1 = post_json("/api/tutor/chat", {
        "message": "What is overfitting?",
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "mentor_style": "Friend",
        "current_difficulty": "beginner"
    })
    conv_id = r1["conversation_id"]

    # 2. Click 'Give Me an Example' on Overfitting
    print("\n2. Action: 'Give Me an Example' on active topic Overfitting")
    r2 = post_json("/api/tutor/chat", {
        "message": "Give Me an Example",
        "action_type": "example",
        "topic": "Overfitting",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    msg2 = r2["message"]
    print(f"Example Response: {msg2[:160]}...")
    assert "wolf" in msg2.lower() or "overfit" in msg2.lower(), "ERROR: Did not return an overfitting example!"
    assert "logistic regression" not in msg2.lower()[:80], "ERROR: Returned logistic regression for overfitting example!"
    print("PASSED: Generated dynamic Overfitting example!")

    # 3. Click 'Test My Understanding' on Overfitting
    print("\n3. Action: 'Test My Understanding' on active topic Overfitting")
    r3 = post_json("/api/tutor/chat", {
        "message": "Test My Understanding",
        "action_type": "test_understanding",
        "topic": "Overfitting",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    msg3 = r3["message"]
    print(f"Quiz Question: {msg3[:160]}...")
    assert "overfit" in msg3.lower() or "99.8%" in msg3, "ERROR: Quiz did not test overfitting!"
    print("PASSED: Generated dynamic Overfitting test question!")

    # 4. Click 'Explain More Simply' on Overfitting
    print("\n4. Action: 'Explain More Simply' on active topic Overfitting")
    r4 = post_json("/api/tutor/chat", {
        "message": "Explain More Simply",
        "action_type": "explain_simply",
        "topic": "Overfitting",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    msg4 = r4["message"]
    print(f"Simplified Analogy: {msg4[:160]}...")
    assert "driver" in msg4.lower() or "overfit" in msg4.lower(), "ERROR: Did not simplify overfitting!"
    print("PASSED: Generated dynamic Overfitting simplified analogy!")

def test_conversation_memory():
    print("\n" + "=" * 60)
    print("TESTING CONVERSATION MEMORY FLOW (Requirement 6)")
    print("=" * 60)

    # message 1: "What is overfitting?"
    r1 = post_json("/api/tutor/chat", {
        "message": "What is overfitting?",
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    conv_id = r1["conversation_id"]
    print(f"Step 1: Overfitting question -> Topic in resp: {'overfit' in r1['message'].lower()}")

    # message 2: "Give me an example." (should use conversation memory to answer overfitting example)
    r2 = post_json("/api/tutor/chat", {
        "message": "Give me an example.",
        "action_type": "example",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    print(f"Step 2: Followup 'Give me an example' -> Overfit example: {'overfit' in r2['message'].lower() or 'wolf' in r2['message'].lower()}")
    assert "overfit" in r2["message"].lower() or "wolf" in r2["message"].lower()

    # message 3: "What is precision?" (must switch topic to precision!)
    r3 = post_json("/api/tutor/chat", {
        "message": "What is precision?",
        "conversation_id": conv_id,
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification"
    })
    print(f"Step 3: New question 'What is precision?' -> Precision in resp: {'precision' in r3['message'].lower()}")
    assert "precision" in r3["message"].lower()
    assert "overfit" not in r3["message"].lower()[:80]
    print("PASSED: Conversation memory correctly handles topic switching!")

def test_evaluation():
    print("\n" + "=" * 60)
    print("TESTING DYNAMIC QUIZ EVALUATIONS (Requirement 9 & 10)")
    print("=" * 60)

    # Overfitting evaluation
    eval_payload = {
        "user_id": "student_explorer",
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "question": "Scenario: You train a deep neural network on 10,000 images. Training accuracy: 99.8%, validation accuracy: 61.4%. Is your model underfitting or overfitting, and how do you fix it?",
        "user_answer": "The model is overfitting because training accuracy is much higher than test accuracy. We should use regularization or dropout.",
        "current_difficulty": "beginner"
    }
    r = post_json("/api/tutor/evaluate", eval_payload)
    print("Overfitting Eval Correct:", r["correct"])
    print("Overfitting Eval Feedback:", r["feedback"])
    assert r["correct"] is True
    assert "overfitting" in r["feedback"].lower() or "overfit" in r["feedback"].lower()
    print("PASSED: Overfitting answer evaluated correctly!")

    # Precision/Recall evaluation
    eval_payload2 = {
        "user_id": "student_explorer",
        "course_id": "machine-learning",
        "lesson_id": "ml-l5-classification",
        "question": "In a medical diagnostic context, which evaluation metric must the engineering team maximize: Precision or Recall, and why?",
        "user_answer": "Maximize recall because missing a positive disease case could be fatal.",
        "current_difficulty": "intermediate"
    }
    r2 = post_json("/api/tutor/evaluate", eval_payload2)
    print("Recall Eval Correct:", r2["correct"])
    print("Recall Eval Feedback:", r2["feedback"])
    assert r2["correct"] is True
    assert "recall" in r2["feedback"].lower()
    print("PASSED: Precision/Recall answer evaluated correctly!")

if __name__ == "__main__":
    test_questions()
    test_action_buttons()
    test_conversation_memory()
    test_evaluation()
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! ROOT CAUSE FULLY RESOLVED!")
    print("=" * 60)
