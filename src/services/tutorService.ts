import { MentorType, ChatMessage } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export interface GenerateResponseParams {
  mentor: MentorType;
  userMessage: string;
  history: ChatMessage[];
  actionType?: 'ask' | 'explain_simply' | 'example' | 'hint' | 'quiz' | 'test_understanding';
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  currentDifficulty?: string;
  progressPercent?: number;
  userId?: string;
  studentName?: string;
  conversationId?: string;
  topic?: string;
}

export interface AgentTutorResponse extends ChatMessage {
  difficulty?: string;
  suggestedAction?: string;
  xpAwarded?: number;
  conversationId?: string;
  isRealAgent?: boolean;
  topic?: string;
}

export interface EvaluateAnswerParams {
  userId?: string;
  courseId: string;
  lessonId: string;
  question: string;
  userAnswer: string;
  currentDifficulty?: string;
}

export interface AgentEvaluationResponse {
  correct: boolean;
  feedback: string;
  explanation: string;
  difficulty: string;
  nextAction: string;
  xpAwarded: number;
  isRealAgent?: boolean;
}

const detectLocalTopic = (query: string, explicitTopic?: string): string => {
  if (explicitTopic && explicitTopic.trim()) {
    const trimmed = explicitTopic.trim();
    if (!['string', 'null', 'none', 'undefined'].includes(trimmed.toLowerCase())) {
      return trimmed;
    }
  }
  const lower = query.toLowerCase();
  if (lower.includes('cnn') || lower.includes('convolutional')) return 'Convolutional Neural Networks (CNN)';
  if (lower.includes('neural network') || lower.includes('deep learning')) return 'Neural Networks';
  if (lower.includes('overfit')) return 'Overfitting';
  if (lower.includes('underfit')) return 'Underfitting';
  if (lower.includes('precision') || lower.includes('recall')) return 'Precision and Recall';
  if (lower.includes('tree')) return 'Decision Trees';
  if (lower.includes('gradient')) return 'Gradient Descent';
  if (lower.includes('logistic regression')) return 'Logistic Regression';
  if (lower.includes('classification') || lower.includes('classify')) return 'Classification';
  return 'Machine Learning';
};

export const generateTutorResponse = async ({
  mentor,
  userMessage,
  history,
  actionType = 'ask',
  courseId = 'machine-learning',
  moduleId = 'ml-m3',
  lessonId = 'ml-l5-classification',
  currentDifficulty = 'beginner',
  progressPercent = 0,
  userId = 'student_explorer',
  studentName = 'AI Explorer',
  conversationId,
  topic
}: GenerateResponseParams): Promise<AgentTutorResponse> => {
  const activeTopic = detectLocalTopic(userMessage, topic);

  // 1. First attempt to call the Real AI Tutor Backend Agent
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const requestPayload = {
      message: userMessage,
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      conversation_id: conversationId,
      user_id: userId,
      student_name: studentName,
      mentor_style: mentor,
      action_type: actionType,
      current_difficulty: currentDifficulty,
      progress_percent: progressPercent,
      topic: activeTopic
    };

    const res = await fetch(`${API_URL}/api/tutor/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify(requestPayload)
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        id: `msg-${Date.now()}`,
        sender: 'tutor',
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followupSuggestions: data.followup_suggestions || [],
        conceptTags: data.concept_tags || [activeTopic],
        difficulty: data.difficulty || currentDifficulty,
        suggestedAction: data.suggested_action || 'continue',
        xpAwarded: data.xp || 20,
        conversationId: data.conversation_id,
        isRealAgent: true,
        topic: activeTopic
      };
    }
  } catch (err) {
    console.warn('Backend AI Tutor agent call failed, using dynamic local pedagogical fallback:', err);
  }

  // 2. Resilient Client-Side Pedagogical Engine (Fallback)
  await new Promise(resolve => setTimeout(resolve, 300));

  const lower = userMessage.toLowerCase();
  let text = '';
  let followupSuggestions: string[] = [];
  let conceptTags: string[] = [activeTopic, 'Machine Learning'];

  if (activeTopic === 'Overfitting') {
    conceptTags = ['Overfitting', 'High Variance', 'Regularization'];
    if (actionType === 'explain_simply' || lower.includes("still don't understand")) {
      text = `Imagine a student preparing for a driver's license test who memorizes the exact cracks and potholes on the practice route. On that exact street, they drive with 100% perfection!\n\nBut the moment they take the exam on a new street, they crash because they only memorized the quirks of the training route instead of learning real driving.\n\nIn AI, that is **Overfitting**: the model memorizes training noise instead of learning general rules!`;
    } else if (actionType === 'example') {
      text = `Here is a famous industry example of **Overfitting**:\n\nA team trained an AI to distinguish wolves from dogs. The model scored 99% during training, but failed on new photos. Why? Every wolf picture had snow in the background! The model didn't learn wolf anatomy—it just learned: *'White snow = Wolf'*. When shown a husky dog in the snow, it misclassified it as a wolf!`;
    } else if (actionType === 'quiz' || actionType === 'test_understanding') {
      text = `🎯 **Concept Check on Overfitting:**\n\n**Scenario:** You train a neural network:\n• Training Accuracy: **99.8%**\n• Validation/Test Accuracy: **61.4%**\n\n**Question:** Is your model **Underfitting** or **Overfitting**, and what technique (such as Dropout or Regularization) would you use to fix it?\n\nType your answer below!`;
    } else if (actionType === 'hint') {
      text = `💡 **Hint on Overfitting:** Check the gap between training and validation accuracy! If training accuracy is near 100% while validation lags far behind, your model has memorized the data. Use L2 regularization, dropout, or collect more data to fix it.`;
    } else {
      text = `**Overfitting** happens when a machine learning model learns the training data *too well*—memorizing random noise and quirks rather than the true underlying patterns.\n\n**Key Characteristics:**\n• Very high accuracy on training data, but poor performance on new, unseen test data (High Variance).\n• The model is overly complex for the amount of data available.\n\n**How to Prevent Overfitting:**\n• **Regularization (L1 / L2):** Penalizes overly large weights.\n• **Dropout:** Randomly deactivates neurons during training to prevent co-adaptation.\n• **Cross-Validation:** Evaluates performance across multiple distinct folds.\n• **Early Stopping:** Halts training when validation loss starts to rise.\n\nWould you like to see a real-world example or test your understanding with a quick challenge?`;
    }
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Hint"];
  } else if (activeTopic === 'Underfitting') {
    conceptTags = ['Underfitting', 'High Bias', 'Model Capacity'];
    text = `**Underfitting** occurs when an AI model is **too simple** to capture the underlying structure of the data.\n\n**Analogy:** Imagine trying to summarize an 800-page mystery novel in four words: *'People were in a house.'* It misses all the plot twists and clues! It fails on the practice data AND on unseen test data (High Bias).\n\n**How to Fix Underfitting:**\n• Increase model capacity (use deeper networks or non-linear models).\n• Engineer richer features.\n• Train for more epochs with relaxed regularization.`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "What is overfitting?", "Explain More Simply"];
  } else if (activeTopic === 'Precision and Recall') {
    conceptTags = ['Precision', 'Recall', 'Evaluation Metrics'];
    text = `**Precision and Recall** are essential metrics for evaluating classification models:\n\n• **Precision:** Out of all positive predictions, how many were actually correct? ($TP / (TP + FP)$). High precision means minimal false alarms.\n• **Recall:** Out of all actual positive cases, how many did the model detect? ($TP / (TP + FN)$). High recall means minimal missed cases.\n\n**Trade-off Example:**\n• Spam filters demand **high precision** (don't hide important job offers in spam).\n• Disease screening demands **high recall** (don't miss a sick patient, even if it triggers a few false alarms).`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "What is an F1-Score?"];
  } else if (activeTopic === 'Decision Trees') {
    conceptTags = ['Decision Trees', 'Supervised Learning', 'Explainability'];
    text = `A **Decision Tree** is a flowchart-like model that makes predictions by asking a sequence of 'if-this-then-that' questions on feature values.\n\n**How it works:**\n• **Root Node:** Top-level question that splits data on the most informative feature (maximizing Information Gain).\n• **Internal Nodes:** Successive decision branches.\n• **Leaf Nodes:** Terminal outcomes that assign the final predicted class or value.\n\n**Pros & Cons:** Highly explainable and intuitive, but prone to overfitting unless pruned with depth limits.`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "What are Random Forests?"];
  } else if (activeTopic === 'Convolutional Neural Networks (CNN)' || activeTopic === 'CNN') {
    conceptTags = ['CNN', 'Convolutional Neural Networks', 'Computer Vision'];
    text = `**Convolutional Neural Networks (CNNs)** are specialized neural network architectures designed specifically for processing spatial data like images!\n\n**How CNNs Work:**\n• **Convolutional Layers:** Slide learnable filters (kernels) across images to detect local visual features (edges, textures, shapes).\n• **Pooling Layers (Max Pooling):** Downsamples feature maps to reduce spatial dimensions, computing costs, and achieve translation invariance.\n• **Dense (Fully Connected) Layers:** Flattens high-level features for the final classification prediction.\n\nThey preserve spatial relationships through **local connectivity** and **parameter sharing**!`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "What is Max Pooling?", "Explain More Simply"];
  } else if (activeTopic === 'Neural Networks') {
    conceptTags = ['Neural Networks', 'Deep Learning', 'Backpropagation'];
    text = `**Neural Networks** are computational models inspired by biological brain neurons, designed to learn complex non-linear patterns!\n\n**Core Architecture:**\n• **Input Layer:** Receives raw features (pixels, text tokens, tabular numbers).\n• **Hidden Layers:** Layers of interconnected artificial neurons computing weighted sums with non-linear activations (like ReLU).\n• **Output Layer:** Delivers the final prediction.\n\nThey learn through **Forward Propagation** and **Backpropagation** with gradient descent to minimize loss!`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "What is Backpropagation?", "Explain More Simply"];
  } else if (activeTopic === 'Gradient Descent') {
    conceptTags = ['Gradient Descent', 'Optimization', 'Learning Rate'];
    text = `**Gradient Descent** is the iterative optimization algorithm used to train machine learning models and neural networks by minimizing error (loss).\n\n**The Mountain Analogy:**\nImagine you are blindfolded on a foggy mountain and want to reach the lowest valley floor. You feel the slope beneath your feet and step in the direction that slopes downhill most steeply.\n\n**Key Factors:**\n• **Loss Function:** The mountain height (error rate).\n• **Learning Rate ($\\alpha$):** The step size. If too large, you overshoot and diverge; if too small, convergence takes forever.`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Practice Question"];
  } else {
    // Classification and default
    conceptTags = ['Classification', 'Supervised Learning', 'Machine Learning'];
    text = `**Classification** is the supervised learning task of assigning data into discrete categories or classes (e.g. Spam vs. Not Spam, or Dog vs. Cat), unlike regression which predicts continuous numbers.\n\n**Real-World Example:**\nCredit card companies evaluate transactions in real time to classify them as **'Approved'** or **'Fraudulent'** based on amount, location, and user history.\n\nWould you like to test your understanding or see another example?`;
    followupSuggestions = ["Give Me an Example", "Test My Understanding", "Explain More Simply", "Give Me a Practice Question"];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'tutor',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    followupSuggestions,
    conceptTags,
    difficulty: currentDifficulty,
    suggestedAction: 'continue',
    xpAwarded: 20,
    isRealAgent: false,
    topic: activeTopic
  };
};

export const evaluateStudentAnswer = async ({
  userId = 'student_explorer',
  courseId,
  lessonId,
  question,
  userAnswer,
  currentDifficulty = 'intermediate'
}: EvaluateAnswerParams): Promise<AgentEvaluationResponse> => {
  // 1. Try real backend evaluation endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${API_URL}/api/tutor/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        question: question,
        user_answer: userAnswer,
        current_difficulty: currentDifficulty
      })
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        correct: data.correct,
        feedback: data.feedback,
        explanation: data.explanation,
        difficulty: data.difficulty,
        nextAction: data.next_action,
        xpAwarded: data.xp_awarded,
        isRealAgent: true
      };
    }
  } catch (e) {
    console.warn('Backend evaluation failed, using dynamic local evaluator:', e);
  }

  // 2. Fallback local evaluation
  const lowerAns = userAnswer.toLowerCase();
  const lowerQ = question.toLowerCase();

  let isCorrect = false;
  let feedback = '';
  let explanation = '';

  if (lowerQ.includes('overfit')) {
    isCorrect = lowerAns.includes('overfit') || lowerAns.includes('variance') || lowerAns.includes('regularization') || lowerAns.includes('dropout');
    feedback = isCorrect
      ? "Spot on! Outstanding analytical insight on Overfitting. Training accuracy far exceeding test accuracy indicates High Variance."
      : "Remember: 99.8% training accuracy vs 61.4% test accuracy means the model memorized the training data rather than generalizing (Overfitting).";
    explanation = "Overfitting is fixed by adding regularization (L1/L2), dropout, or collecting more training data.";
  } else if (lowerQ.includes('precision') || lowerQ.includes('recall')) {
    isCorrect = lowerAns.includes('recall') || lowerAns.includes('false negative') || lowerAns.includes('miss');
    feedback = isCorrect
      ? "Precisely right! In medical diagnosis, maximizing Recall is paramount to avoid missing any positive disease cases."
      : "In medical screening, missing a sick patient (False Negative) is far more dangerous than a false alarm. Therefore, Recall must be prioritized.";
    explanation = "Recall measures the proportion of actual true cases detected.";
  } else {
    isCorrect = (lowerAns.includes('classification') || lowerAns.includes('category') || lowerAns.includes('discrete')) && !lowerAns.includes('regression');
    feedback = isCorrect
      ? "Spot on! You correctly identified that predicting distinct categories is Classification!"
      : "Good effort, but not quite. Remember: numbers with continuous decimals mean regression; distinct category labels mean classification.";
    explanation = "Because the target labels are discrete categories, the algorithm creates decision boundaries.";
  }

  return {
    correct: isCorrect,
    feedback,
    explanation,
    difficulty: isCorrect ? (currentDifficulty === 'beginner' ? 'intermediate' : 'advanced') : currentDifficulty,
    nextAction: isCorrect ? 'next_question' : 'hint',
    xpAwarded: isCorrect ? 30 : 10,
    isRealAgent: false
  };
};
