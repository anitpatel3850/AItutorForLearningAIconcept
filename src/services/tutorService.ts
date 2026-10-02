import { MentorType, ChatMessage } from '../types';

interface GenerateResponseParams {
  mentor: MentorType;
  userMessage: string;
  history: ChatMessage[];
  actionType?: 'ask' | 'explain_simply' | 'example' | 'hint' | 'quiz';
}

export const generateTutorResponse = async ({
  mentor,
  userMessage,
  actionType = 'ask'
}: GenerateResponseParams): Promise<ChatMessage> => {
  // Simulate realistic network & inference delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const lower = userMessage.toLowerCase();
  let text = '';
  let followupSuggestions: string[] = [];
  let conceptTags: string[] = [];

  // Check for specific concepts
  if (lower.includes('supervised learning') || lower.includes('supervised')) {
    conceptTags = ['Supervised Learning', 'Labeled Data', 'Classification'];
    if (mentor === 'Friend') {
      text = `Imagine teaching a child using flashcards with pictures of fruits on the front and the name written on the back. Every time they guess, you confirm if they're right or correct them until they recognize apples and oranges on their own.\n\nThat's exactly what supervised learning is: feeding a model labeled examples so it learns to predict the answer on new, unseen examples!\n\nCan you give me an everyday example of supervised learning you might use in an app?`;
      followupSuggestions = ['Spam email detection', 'House price estimation', 'Face unlock on phones', 'How is it different from unsupervised?'];
    } else if (mentor === 'Professor') {
      text = `In formal terms, Supervised Learning is the problem of learning a mapping function $f: \\mathcal{X} \\rightarrow \\mathcal{Y}$ from an empirical training dataset $\\mathcal{D} = \\{(x_1, y_1), \\dots, (x_N, y_N)\\}$. The objective is minimizing the expected empirical risk across a designated loss function $\\mathcal{L}(f(x), y)$.\n\nThink of it as guided optimization: every sample possesses ground-truth feedback ($y$).\n\nTo test your intuition: if your target labels $y$ are continuous numbers rather than discrete classes, what specific category of supervised learning are you performing?`;
      followupSuggestions = ['Regression vs Classification', 'Tell me about Cross-Entropy Loss', 'Give me an applied example'];
    } else {
      // Coach
      text = `Boom! Supervised learning is bread-and-butter competitive ML. You give the algorithm the inputs (Features) AND the answer key (Labels). It runs a forward prediction, compares its error against ground truth, and calibrates its weights via gradient descent.\n\nIf you want to win an ML hackathon or crush the Overfitting Titan, you need airtight mastery of this.\n\nQuick challenge: can you tell me what happens when your supervised model has 100% training accuracy but flops in production?`;
      followupSuggestions = ['Overfitting!', 'Data leakage', 'Underfitting', 'Tell me how to fix it'];
    }
  } else if (lower.includes('unsupervised') || lower.includes('cluster')) {
    conceptTags = ['Unsupervised Learning', 'Clustering', 'PCA'];
    text = mentor === 'Professor' 
      ? `Unsupervised learning estimates density or latent manifold geometry without target annotations $y$. Common tasks include K-Means clustering, Gaussian Mixture Models, and Principal Component Analysis.\n\nConsider this: how can an algorithm measure "similarity" between points without knowing what categories exist?`
      : `Unsupervised learning is like sorting a giant closet in the dark without labels. The algorithm organizes items by shape, texture, and size based purely on mathematical distance.\n\nWould you like to see how K-Means calculates cluster centroids?`;
    followupSuggestions = ['How does K-Means work?', 'What is PCA?', 'Give an example of customer clustering'];
  } else if (lower.includes('gradient descent') || lower.includes('gradient') || lower.includes('optimizer')) {
    conceptTags = ['Gradient Descent', 'Optimization', 'Loss Landscape'];
    text = `Gradient descent is the engine that drives neural network learning. Picture yourself standing on a foggy mountain peak trying to reach the lowest valley. Since you can't see the destination, you feel the slope under your feet and take steps in the direction of steepest descent.\n\nIn mathematics, the negative gradient $-\\nabla L$ points straight downhill towards lower loss.\n\nWhat do you think happens if your step size (the Learning Rate) is set 100x too high?`;
    followupSuggestions = ['It diverges / explodes', 'It gets stuck in a local minimum', 'Explain Adam optimizer'];
  } else if (lower.includes('neural network') || lower.includes('deep learning')) {
    conceptTags = ['Deep Learning', 'Perceptron', 'Backpropagation'];
    text = `A neural network is an interconnected graph of artificial neurons organized in layers. Each neuron takes inputs, multiplies them by learnable weights, adds a bias, and passes the sum through a non-linear activation function (like ReLU).\n\nBy stacking multiple layers, the network can approximate virtually any mathematical curve or boundary.\n\nWould you like me to walk you through a single artificial neuron's forward pass?`;
    followupSuggestions = ['Show me a neuron forward pass', 'Why do we need non-linear activations?', 'Explain backpropagation'];
  } else if (actionType === 'explain_simply') {
    text = `Here is the simplest mental model: AI is just pattern recognition at scale. Instead of a human writing 10,000 "if/else" rules, we write an algorithm that looks at 100,000 examples and figures out the rules automatically!\n\nDoes that click, or would you like an analogy for a specific AI topic?`;
    followupSuggestions = ['Give me an analogy', 'Explain Transformers simply', 'Quiz me on this'];
  } else if (actionType === 'example') {
    text = `Here is a real-world example: Consider Spotify's recommendation engine. It uses matrix factorization and vector embeddings to represent every song and listener as points in a 100-dimensional space. If you like Song A and Song B, Spotify recommends Song C because it sits right beside them geometrically in vector space!\n\nPretty neat, right? What other real-world application are you curious about?`;
    followupSuggestions = ['Self-driving cars vision', 'ChatGPT token generation', 'Fraud detection'];
  } else if (actionType === 'quiz') {
    text = `Time for a rapid-fire check! ⚡\n\nQuestion: You are training a medical diagnosis model to detect rare tumors (only 0.5% of scans have a tumor). Why is measuring raw Accuracy a dangerous trap?`;
    followupSuggestions = ['A model predicting "No Tumor" gets 99.5% accuracy', 'Accuracy requires GPU memory', 'Precision and Recall are better'];
  } else if (actionType === 'hint') {
    text = `💡 Tactical Hint: Whenever you're tackling ML problems, always check three things first:\n1. Do you have labels? (Supervised vs Unsupervised)\n2. Are you predicting numbers or categories? (Regression vs Classification)\n3. Is your train score drastically higher than your test score? (Overfitting check)`;
    followupSuggestions = ['Give me another tip', 'How to prevent overfitting?', 'Ask AI Tutor another question'];
  } else {
    // Dynamic fallback matching mentor persona
    if (mentor === 'Professor') {
      text = `That is an insightful inquiry regarding "${userMessage}". In machine learning theory, we often decompose this by analyzing the loss objective, the underlying data distribution, and the generalization bounds.\n\nTo explore this deeply: what assumptions do you think your model makes about the data in this scenario?`;
      followupSuggestions = ['Explain the core assumptions', 'Show me a practical example', 'Quiz me on this concept'];
    } else if (mentor === 'Coach') {
      text = `Great question on "${userMessage}"! Here's how to think about it in production: don't overcomplicate it early. Start with a simple baseline model, measure your validation metrics, and iterate.\n\nReady to put this concept to the test in a mission or boss battle?`;
      followupSuggestions = ['Let\'s do a battle question', 'Give me a code tip', 'Explain how to debug this'];
    } else {
      text = `I love that question about "${userMessage}"! It sounds way more complicated than it actually is. Think of it like this: every AI model is basically trying to solve a puzzle by testing small guesses and getting slightly better with each attempt.\n\nWhat part of this feels most confusing right now?`;
      followupSuggestions = ['Break it down into 3 steps', 'Give me an everyday analogy', 'Explain like I\'m five'];
    }
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'tutor',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    followupSuggestions,
    conceptTags
  };
};
