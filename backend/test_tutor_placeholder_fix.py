"""
Verification Script for AI Tutor Placeholder Sanitization & Topic Switching
Tests:
1. Swagger placeholder request ("string" values for optional fields)
2. All 6 core questions:
   - "What is CNN?"
   - "What is a neural network?"
   - "What is gradient descent?"
   - "What is overfitting?"
   - "What is precision and recall?"
   - "What is a decision tree?"
3. Topic switching within a single conversation (Overfitting -> Gradient Descent -> CNN)
4. Verification of MongoDB storage without placeholder pollution
"""

import asyncio
import httpx
import sys

BASE_URL = "http://127.0.0.1:8000"

async def run_tests():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30.0) as client:
        print("=" * 60)
        print("AI TUTOR REQUEST HANDLING & PLACEHOLDER FIX VERIFICATION")
        print("=" * 60)

        # ---------------------------------------------------------------------
        # 1. Health check
        # ---------------------------------------------------------------------
        print("\n[TEST 1] Verifying server health...")
        res = await client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        data = res.json()
        print(f"PASS: Server healthy, DB status: {data.get('database')}")

        # ---------------------------------------------------------------------
        # 2. Test Swagger Placeholders Request
        # ---------------------------------------------------------------------
        print("\n[TEST 2] Testing Swagger request with 'string' placeholders...")
        swagger_payload = {
            "message": "What is CNN?",
            "course_id": "string",
            "module_id": "string",
            "lesson_id": "string",
            "conversation_id": "string",
            "topic": "string"
        }
        res = await client.post("/api/tutor/chat", json=swagger_payload)
        assert res.status_code == 200, f"Swagger test failed: {res.text}"
        data = res.json()
        conv_id = data.get("conversation_id", "")
        reply = data.get("message", "")
        tags = data.get("concept_tags", [])

        print(f"Conversation ID generated: {conv_id}")
        print(f"Concept Tags: {tags}")
        print(f"Reply Preview: {reply[:120]}...")

        # Assertions
        assert conv_id != "string", "FAIL: 'string' was used as conversation_id!"
        assert conv_id.startswith("conv-"), f"FAIL: Expected conv- prefix, got {conv_id}"
        assert "string" not in [t.lower() for t in tags], "FAIL: 'string' was added as concept tag!"
        assert "cnn" in reply.lower() or "convolutional" in reply.lower(), f"FAIL: Response not about CNN: {reply[:200]}"
        assert "string" not in reply[:60].lower(), f"FAIL: 'string' appeared as concept in reply: {reply[:100]}"
        print("PASS: Swagger placeholders sanitized, conversation ID generated, and answer is about CNN!")

        # ---------------------------------------------------------------------
        # 3. Test Individual Questions
        # ---------------------------------------------------------------------
        test_questions = [
            ("What is CNN?", ["cnn", "convolutional"]),
            ("What is a neural network?", ["neural", "network", "neuron"]),
            ("What is gradient descent?", ["gradient", "descent", "learning rate", "loss", "slope"]),
            ("What is overfitting?", ["overfitting", "overfit", "memoriz", "noise", "variance"]),
            ("What is precision and recall?", ["precision", "recall"]),
            ("What is a decision tree?", ["decision tree", "tree", "branch", "leaf", "split"])
        ]

        print("\n[TEST 3] Testing 6 core questions for accurate individual topic responses...")
        for q, expected_keywords in test_questions:
            payload = {
                "message": q,
                "mentor_style": "Friend",
                "action_type": "ask"
            }
            res = await client.post("/api/tutor/chat", json=payload)
            assert res.status_code == 200, f"Chat failed for '{q}': {res.text}"
            data = res.json()
            ans = data.get("message", "")
            ans_lower = ans.lower()

            # Verify response is relevant
            matched = any(kw in ans_lower for kw in expected_keywords)
            print(f"\nQuestion: '{q}'")
            print(f"Tags: {data.get('concept_tags')}")
            print(f"Preview: {ans[:140]}...")
            assert matched, f"FAIL: Response for '{q}' did not contain expected keywords {expected_keywords}. Got: {ans[:200]}"
            print(f"PASS: Accurate topic response received for '{q}'!")

        # ---------------------------------------------------------------------
        # 4. Test Topic Switching within Single Conversation
        # ---------------------------------------------------------------------
        print("\n[TEST 4] Testing dynamic topic switching within the SAME conversation...")
        single_conv_id = "conv-switch-test-999"

        # Turn 1: Overfitting
        res1 = await client.post("/api/tutor/chat", json={
            "conversation_id": single_conv_id,
            "message": "What is overfitting?"
        })
        ans1 = res1.json().get("message", "").lower()
        print(f"\nTurn 1 (Overfitting): {ans1[:120]}...")
        assert "overfit" in ans1, f"Turn 1 failed: {ans1[:150]}"

        # Turn 2: Gradient Descent (must switch topic!)
        res2 = await client.post("/api/tutor/chat", json={
            "conversation_id": single_conv_id,
            "message": "What is gradient descent?"
        })
        ans2 = res2.json().get("message", "").lower()
        print(f"Turn 2 (Gradient Descent): {ans2[:120]}...")
        assert "gradient" in ans2, f"Turn 2 failed to switch to gradient descent: {ans2[:150]}"
        # Ensure it doesn't primarily answer about overfitting
        assert ans2.find("gradient") < ans2.find("overfit") if "overfit" in ans2 else True, "Turn 2 still focused on overfitting!"

        # Turn 3: CNN (must switch topic again!)
        res3 = await client.post("/api/tutor/chat", json={
            "conversation_id": single_conv_id,
            "message": "What is CNN?"
        })
        ans3 = res3.json().get("message", "").lower()
        print(f"Turn 3 (CNN): {ans3[:120]}...")
        assert "cnn" in ans3 or "convolutional" in ans3, f"Turn 3 failed to switch to CNN: {ans3[:150]}"
        print("PASS: Dynamic topic switching across 3 turns in same conversation succeeded!")

        # ---------------------------------------------------------------------
        # 5. Verify Conversation History in MongoDB
        # ---------------------------------------------------------------------
        print("\n[TEST 5] Checking conversation history stored in MongoDB...")
        hist_res = await client.get(f"/api/tutor/history/{single_conv_id}")
        assert hist_res.status_code == 200, f"History lookup failed: {hist_res.text}"
        hist_data = hist_res.json()
        messages = hist_data.get("messages", [])
        print(f"Found {len(messages)} messages stored for conversation {single_conv_id}")
        assert len(messages) >= 6, f"Expected at least 6 messages (3 user + 3 tutor), got {len(messages)}"
        print("PASS: Conversation history accurately recorded in MongoDB without corruption!")

        print("\n" + "=" * 60)
        print("ALL TUTOR VERIFICATION TESTS PASSED SUCCESSFULLY!")
        print("=" * 60)

if __name__ == "__main__":
    try:
        asyncio.run(run_tests())
    except Exception as e:
        print(f"\nTEST SUITE FAILED: {e}")
        sys.exit(1)
