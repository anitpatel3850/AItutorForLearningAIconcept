import { World, Mission, Boss, Achievement, LeaderboardUser, Mentor } from '../types';

export const MENTORS: Mentor[] = [
  {
    id: 'Professor',
    name: 'Dr. Evelyn Vance',
    role: 'Chief AI Theorist',
    title: 'Socratic & Rigorous',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tagline: 'Precision through first principles.',
    description: 'A former Stanford researcher who guides you with deep mathematical intuition, historical context, and thoughtful counter-questions.',
    style: 'Deep, rigorous, structured, academic clarity',
    accentColor: '#9D4EDD',
  },
  {
    id: 'Coach',
    name: 'Commander Jax',
    role: 'Lead Applied AI Engineer',
    title: 'Energetic & Action-Oriented',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tagline: 'Break concepts, ship models, slay bosses.',
    description: 'A veteran Kaggle Grandmaster who pushes you to code fast, debug intuition, and build model battle instincts with high energy.',
    style: 'High-octane, practical, battle-tested tips, concise',
    accentColor: '#00F0FF',
  },
  {
    id: 'Friend',
    name: 'Aria Chen',
    role: 'Creative AI Explorer',
    title: 'Casual & Relatable',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tagline: 'No jargon, just awesome mental models.',
    description: 'An approachable peer who explains complex neural concepts using everyday metaphors, visual sketches, and zero intimidation.',
    style: 'Friendly, empathetic, analogy-rich, upbeat',
    accentColor: '#00FF9D',
  },
];

export const MISSIONS: Record<string, Mission> = {
  'm-01': {
    id: 'm-01',
    worldId: 'world-1',
    questId: 'quest-fund-1',
    number: 'MISSION 01',
    title: 'The AI Landscape',
    topic: 'Narrow AI vs AGI',
    difficulty: 'EASY',
    xpReward: 50,
    objective: 'Distinguish between Narrow Artificial Intelligence (ANI) and Artificial General Intelligence (AGI).',
    explanation: {
      overview: 'Current artificial intelligence is "Narrow AI" (ANI) — designed to excel at a single specific task, like recognizing tumors, playing chess, or generating code.',
      keyTakeaway: 'No system today possesses Artificial General Intelligence (AGI), which would demonstrate human-level cognition across any novel domain.',
      analogy: 'A calculator does arithmetic faster than any human, but it cannot write a poem. Current AI models are like superhuman calculators for patterns.',
      steps: [
        { label: 'Narrow AI (ANI)', desc: 'Optimized for specialized objectives with defined bounds.' },
        { label: 'General AI (AGI)', desc: 'Autonomous cross-domain reasoning and abstract learning.' },
        { label: 'Super AI (ASI)', desc: 'Theoretical intelligence surpassing all human intellect combined.' }
      ]
    },
    challenge: {
      prompt: 'An AI system that can play Chess better than any grandmaster, but cannot recognize a picture of a cat, is an example of what?',
      options: [
        { id: 'A', label: 'A', text: 'Artificial General Intelligence (AGI)' },
        { id: 'B', label: 'B', text: 'Artificial Narrow Intelligence (ANI)' },
        { id: 'C', label: 'C', text: 'Artificial Superintelligence (ASI)' },
        { id: 'D', label: 'D', text: 'Conscious Machine System' }
      ],
      correctOptionId: 'B',
      hint: 'Notice that it excels in one specialized isolated game domain, but lacks generalized understanding.',
      detailedSolution: 'Correct! This is Artificial Narrow Intelligence (ANI). Virtually all commercial AI today, including AlphaZero and Large Language Models, are forms of ANI tailored for specific mathematical objective functions.'
    }
  },
  'm-02': {
    id: 'm-02',
    worldId: 'world-1',
    questId: 'quest-fund-1',
    number: 'MISSION 02',
    title: 'Features and Labels',
    topic: 'Data Foundations',
    difficulty: 'EASY',
    xpReward: 50,
    objective: 'Identify input features versus ground-truth target labels in tabular datasets.',
    explanation: {
      overview: 'In machine learning datasets, "Features" (X) are the measurable input properties, while "Labels" (Y) are the ground-truth target values we want to predict.',
      keyTakeaway: 'Models learn a mathematical mapping function: f(Features) ≈ Label.',
      analogy: 'Features are like ingredients in a recipe, and the Label is the resulting dish quality rating.',
      steps: [
        { label: 'Feature Matrix (X)', desc: 'Independent variables: size, bedrooms, location.' },
        { label: 'Target Vector (y)', desc: 'Dependent target variable: home selling price.' }
      ]
    },
    challenge: {
      prompt: 'You are training a model to predict house sale prices using square footage, location zip code, and number of bathrooms. What is the target "label"?',
      options: [
        { id: 'A', label: 'A', text: 'Square footage' },
        { id: 'B', label: 'B', text: 'Number of bathrooms' },
        { id: 'C', label: 'C', text: 'House sale price' },
        { id: 'D', label: 'D', text: 'Zip code' }
      ],
      correctOptionId: 'C',
      hint: 'The label is the variable you are attempting to forecast or predict, not the input data points.',
      detailedSolution: 'Spot on! House sale price is the target (y label). Square footage, zip code, and bathrooms are the input features (X).'
    }
  },
  'm-03': {
    id: 'm-03',
    worldId: 'world-1',
    questId: 'quest-fund-1',
    number: 'MISSION 03',
    title: 'Bias in the Machine',
    topic: 'Algorithmic Fairness',
    difficulty: 'MEDIUM',
    xpReward: 100,
    objective: 'Understand how historical bias in training data propagates into predictive models.',
    explanation: {
      overview: 'Machine learning algorithms do not possess moral judgment; they mirror patterns found in the dataset they are fed.',
      keyTakeaway: 'Garbage in, garbage out. If training data reflects systemic prejudices, the model will codify and amplify those biases.',
      analogy: 'If you train a camera only on daylight photos, it will fail to recognize faces at dusk.',
    },
    challenge: {
      prompt: 'If a resume-screening AI algorithm penalizes resumes containing the word "women\'s" (e.g. "women\'s rugby team"), what is the most likely root cause?',
      options: [
        { id: 'A', label: 'A', text: 'The GPU hardware ran out of VRAM memory' },
        { id: 'B', label: 'B', text: 'Historical hiring data was male-dominated, training the model to treat male resumes as superior' },
        { id: 'C', label: 'C', text: 'The model reached 100% loss during training' },
        { id: 'D', label: 'D', text: 'The tokenizer dropped punctuation marks' }
      ],
      correctOptionId: 'B',
      hint: 'Look at the training data distribution from past years. Models replicate human patterns from historical archives.',
      detailedSolution: 'Accurate! Historical data bias is the culprit. When historical hires were predominantly male, the statistical correlation falsely associates gender-specific terms with qualification.'
    }
  },
  'm-04': {
    id: 'm-04',
    worldId: 'world-2',
    questId: 'quest-ml-1',
    number: 'MISSION 04',
    title: 'Teach the Machine',
    topic: 'Supervised Learning',
    difficulty: 'MEDIUM',
    xpReward: 100,
    objective: 'Understand how supervised learning uses labeled data to make predictions.',
    explanation: {
      overview: 'Supervised learning is the paradigm of training a model on input-output pairs. The algorithm adjusts its internal weights so that its guesses match the true labels provided by humans.',
      keyTakeaway: 'Supervised learning requires ground truth labels (Target Y) for every training sample (Input X).',
      analogy: 'Imagine teaching a student using flashcards where the question is on the front and the verified answer is on the back.',
      steps: [
        { label: '1. Input Data', desc: 'Photos of cats and dogs with known labels attached.' },
        { label: '2. Forward Pass', desc: 'Model predicts a probability: e.g. "72% Cat".' },
        { label: '3. Loss & Backprop', desc: 'Calculate error against true label and update weights.' }
      ]
    },
    challenge: {
      prompt: 'You have labeled examples of cats and dogs. What type of machine learning problem is this?',
      options: [
        { id: 'A', label: 'A', text: 'Unsupervised Learning' },
        { id: 'B', label: 'B', text: 'Supervised Learning' },
        { id: 'C', label: 'C', text: 'Reinforcement Learning' },
        { id: 'D', label: 'D', text: 'Generative Learning' }
      ],
      correctOptionId: 'B',
      hint: 'You are providing both the input photos and the verified target answers (the "labels") to guide the model.',
      detailedSolution: 'MISSION COMPLETE! Because the training dataset contains verified labels (Cat vs Dog), this is a classic Supervised Learning classification problem.'
    }
  },
  'm-05': {
    id: 'm-05',
    worldId: 'world-2',
    questId: 'quest-ml-1',
    number: 'MISSION 05',
    title: 'The Cluster Mystery',
    topic: 'Unsupervised Learning',
    difficulty: 'MEDIUM',
    xpReward: 100,
    objective: 'Understand how clustering and unsupervised algorithms discover hidden patterns without target labels.',
    explanation: {
      overview: 'Unsupervised learning discovers innate geometric structures, clusters, and latent representations within unlabeled data.',
      keyTakeaway: 'No labels are provided. Algorithms like K-Means and PCA group points based on mathematical distance metrics.',
      analogy: 'Handing someone a box of unsorted buttons and asking them to separate them by color and size without telling them what buttons are.'
    },
    challenge: {
      prompt: 'A retail website wants to segment 1,000,000 customers into purchasing clusters without any pre-existing tags or labels. Which paradigm fits best?',
      options: [
        { id: 'A', label: 'A', text: 'Supervised Linear Regression' },
        { id: 'B', label: 'B', text: 'Unsupervised Clustering (e.g. K-Means)' },
        { id: 'C', label: 'C', text: 'Reinforcement Q-Learning' },
        { id: 'D', label: 'D', text: 'Markov Decision Process' }
      ],
      correctOptionId: 'B',
      hint: 'There are no pre-labeled customer groups; the algorithm must discover the natural groups on its own.',
      detailedSolution: 'Exactly right! Unsupervised clustering groups similar vectors based on similarity metrics like Euclidean distance without needing pre-existing target labels.'
    }
  },
  'm-06': {
    id: 'm-06',
    worldId: 'world-2',
    questId: 'quest-ml-1',
    number: 'MISSION 06',
    title: 'The Overfitting Trap',
    topic: 'Generalization & Regularization',
    difficulty: 'HARD',
    xpReward: 200,
    objective: 'Diagnose overfitting when a model achieves near-zero training error but fails on unseen validation data.',
    explanation: {
      overview: 'Overfitting occurs when a model memorizes random noise and idiosyncrasies in the training set instead of learning the underlying general rule.',
      keyTakeaway: 'High variance = low training error, but high validation error. Regularization (L1/L2, dropout) curbs overfitting.',
      analogy: 'A student memorizing exact question numbers and answers from a practice test rather than learning the actual math principles.'
    },
    challenge: {
      prompt: 'Your model achieves 99.8% accuracy on the training set, but only 58.2% on the validation set. What is happening?',
      options: [
        { id: 'A', label: 'A', text: 'The model is underfitting due to low model capacity' },
        { id: 'B', label: 'B', text: 'The model has overfit and memorized the training noise' },
        { id: 'C', label: 'C', text: 'The learning rate is too small' },
        { id: 'D', label: 'D', text: 'The dataset has too many training epochs' }
      ],
      correctOptionId: 'B',
      hint: 'Notice the huge disparity between training performance (almost perfect) and validation performance (mediocre).',
      detailedSolution: 'Brilliant deduction! The model has overfit. It memorized specific artifacts of the training samples rather than discovering generalizable features.'
    }
  },
  'm-07': {
    id: 'm-07',
    worldId: 'world-3',
    questId: 'quest-dl-1',
    number: 'MISSION 07',
    title: 'The Artificial Neuron',
    topic: 'Perceptrons & Activations',
    difficulty: 'MEDIUM',
    xpReward: 100,
    objective: 'Trace the forward pass through an artificial neuron with weights, bias, and non-linear activation.',
    explanation: {
      overview: 'An artificial neuron computes the dot product of inputs and weights: z = Σ(w_i * x_i) + b, and then passes z through a non-linear activation function σ(z).',
      keyTakeaway: 'Without non-linear activations (like ReLU or GELU), stacking 100 neural layers collapses into a single trivial linear transformation.',
      analogy: 'A judge weighing different pieces of evidence with specific importance factors, reaching a score, and making a guilty/innocent decision.'
    },
    challenge: {
      prompt: 'Why are non-linear activation functions (like ReLU, Sigmoid) critical in multi-layer neural networks?',
      options: [
        { id: 'A', label: 'A', text: 'They reduce the memory size of matrix weights to 8-bit' },
        { id: 'B', label: 'B', text: 'They allow the network to approximate complex non-linear boundary functions' },
        { id: 'C', label: 'C', text: 'They eliminate the need for backpropagation' },
        { id: 'D', label: 'D', text: 'They prevent numbers from ever becoming negative' }
      ],
      correctOptionId: 'B',
      hint: 'Consider what happens when you compose multiple linear equations: f(g(x)) = a*(b*x) = (a*b)*x, which remains strictly linear.',
      detailedSolution: 'Correct! Non-linear activations grant universal approximation capability, enabling networks to learn curves, decision boundaries, and intricate manifold spaces.'
    }
  },
  'm-08': {
    id: 'm-08',
    worldId: 'world-3',
    questId: 'quest-dl-1',
    number: 'MISSION 08',
    title: 'The Descent Downhill',
    topic: 'Gradient Descent Optimization',
    difficulty: 'HARD',
    xpReward: 200,
    objective: 'Understand how partial derivatives calculate the direction of steepest descent to minimize the loss landscape.',
    explanation: {
      overview: 'Gradient descent computes the gradient ∇L with respect to weights W, and adjusts parameters in the opposite direction: W_new = W - η * ∇L, where η is the learning rate.',
      keyTakeaway: 'Too large a learning rate diverges or oscillates wildly; too small crawls at a snail pace.',
      analogy: 'A hiker blinded by thick fog feeling the slope of the hill beneath their feet and taking steps strictly in the downward direction to reach the valley floor.'
    },
    challenge: {
      prompt: 'If your loss oscillates wildly and increases to infinity (NaN) during training, what hyperparameter should you check first?',
      options: [
        { id: 'A', label: 'A', text: 'Decrease the Learning Rate (it is likely too large)' },
        { id: 'B', label: 'B', text: 'Increase the batch size by 10,000x' },
        { id: 'C', label: 'C', text: 'Disable all validation splits' },
        { id: 'D', label: 'D', text: 'Convert all weights to integer format' }
      ],
      correctOptionId: 'A',
      hint: 'Taking gigantic steps on a parabolic curve can cause you to overshoot the minimum and shoot up the sides.',
      detailedSolution: 'Spot on! An excessively large learning rate causes the optimizer to overshoot the valley floor and explode up the gradients to infinity.'
    }
  },
  'm-09': {
    id: 'm-09',
    worldId: 'world-4',
    questId: 'quest-cv-1',
    number: 'MISSION 09',
    title: 'Sliding Filters',
    topic: 'Convolutional Kernels',
    difficulty: 'MEDIUM',
    xpReward: 100,
    objective: 'Understand how convolution kernels slide across an image to extract edge and texture feature maps.',
    explanation: {
      overview: 'A 2D convolution kernel (e.g. 3x3 matrix) slides across pixels computing dot products, detecting local visual primitives like vertical edges, diagonal gradients, or color blooms.',
      keyTakeaway: 'Convolutional layers provide translation invariance: a cat detected in the top-left triggers the same feature map as one in the bottom-right.',
      analogy: 'Looking through a small magnifying lens across a mosaic piece by piece to identify lines and borders.'
    },
    challenge: {
      prompt: 'What spatial property makes Convolutional Neural Networks (CNNs) far more effective for images than simple dense layers?',
      options: [
        { id: 'A', label: 'A', text: 'They flatten pixels into a random 1D vector' },
        { id: 'B', label: 'B', text: 'Spatial locality and parameter sharing across translated positions' },
        { id: 'C', label: 'C', text: 'They do not require GPU hardware acceleration' },
        { id: 'D', label: 'D', text: 'They only work on black-and-white photos' }
      ],
      correctOptionId: 'B',
      hint: 'Adjacent pixels are strongly correlated, and an edge filter should work regardless of where the edge appears.',
      detailedSolution: 'Bravo! CNNs exploit spatial locality (nearby pixels relate) and parameter sharing (the same 3x3 filter scans every part of the image).'
    }
  },
  'm-10': {
    id: 'm-10',
    worldId: 'world-5',
    questId: 'quest-nlp-1',
    number: 'MISSION 10',
    title: 'Vectors of Meaning',
    topic: 'Word Embeddings',
    difficulty: 'MEDIUM',
    xpReward: 100,
    objective: 'Understand how words are mapped into high-dimensional geometric embedding vectors where semantic similarity equals geometric proximity.',
    explanation: {
      overview: 'Word embeddings (like Word2Vec, GloVe, or BERT embeddings) map discrete tokens into continuous vector spaces (e.g., 768 dimensions).',
      keyTakeaway: 'King - Man + Woman ≈ Queen: semantic relationships manifest as linear spatial vector offsets.',
      analogy: 'Mapping cities onto a global GPS coordinate grid, where Paris and Rome are closer together than Paris and Tokyo.'
    },
    challenge: {
      prompt: 'In a modern embedding space, what mathematical operation is commonly used to measure the semantic similarity between two word vectors?',
      options: [
        { id: 'A', label: 'A', text: 'Cosine Similarity (dot product normalized by magnitudes)' },
        { id: 'B', label: 'B', text: 'Bitwise XOR operation' },
        { id: 'C', label: 'C', text: 'String length comparison' },
        { id: 'D', label: 'D', text: 'Modulo arithmetic' }
      ],
      correctOptionId: 'A',
      hint: 'This metric computes the cosine of the angle between two multi-dimensional vectors.',
      detailedSolution: 'Bullseye! Cosine similarity calculates the cosine of the angle between vectors. When vectors point in identical directions, similarity is 1.0.'
    }
  },
  'm-11': {
    id: 'm-11',
    worldId: 'world-6',
    questId: 'quest-genai-1',
    number: 'MISSION 11',
    title: 'Attention is All You Need',
    topic: 'Self-Attention Mechanism',
    difficulty: 'HARD',
    xpReward: 200,
    objective: 'Understand how self-attention calculates Query, Key, and Value matrices to capture contextual relationships across entire sequences.',
    explanation: {
      overview: 'Self-attention allows every token in an input sentence to look at ("attend to") every other token simultaneously, weighted by a dynamic relevance score: Softmax((Q * K^T) / sqrt(d_k)) * V.',
      keyTakeaway: 'Unlike recurrent RNNs that process tokens sequentially, Transformers process entire sequences in parallel on GPUs.',
      analogy: 'A search engine query: Query is what you type, Keys are page titles/tags, Values are page contents returned based on match strength.'
    },
    challenge: {
      prompt: 'In the sentence "The animal didn\'t cross the street because it was too tired", what does Self-Attention help the model determine "it" refers to?',
      options: [
        { id: 'A', label: 'A', text: 'The street' },
        { id: 'B', label: 'B', text: 'The animal' },
        { id: 'C', label: 'C', text: 'The tiredness' },
        { id: 'D', label: 'D', text: 'Cross' }
      ],
      correctOptionId: 'B',
      hint: 'Attention weights between "it" and "animal" light up heavily because "tired" relates to biological creatures rather than paved streets.',
      detailedSolution: 'Phenomenal! Self-attention computes dynamic weights that link "it" to "the animal" based on contextual semantics, solving core coreference resolution.'
    }
  }
};

export const WORLDS: World[] = [
  {
    id: 'world-1',
    worldNumber: 1,
    name: 'AI FUNDAMENTALS',
    subtitle: 'The Genesis Core',
    description: 'Master the foundational architecture of artificial intelligence, algorithms, ethics, and basic data vectors.',
    icon: 'Sparkles',
    accentColor: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    requiredLevel: 1,
    totalXp: 450,
    bossId: 'boss-fund',
    quests: [
      {
        id: 'quest-fund-1',
        worldId: 'world-1',
        title: 'Awakening the Machine',
        description: 'Discover how computers perceive data and differentiate between narrow intelligence and generalized reasoning.',
        xpReward: 250,
        requiredLevel: 1,
        missionIds: ['m-01', 'm-02', 'm-03'],
        icon: 'Cpu',
        progressPercent: 100
      }
    ]
  },
  {
    id: 'world-2',
    worldNumber: 2,
    name: 'MACHINE LEARNING',
    subtitle: 'The Predictive Realm',
    description: 'Harness supervised and unsupervised algorithms to find structure in raw noise and predict future events.',
    icon: 'BrainCircuit',
    accentColor: '#9D4EDD',
    glowColor: 'rgba(157, 78, 221, 0.4)',
    requiredLevel: 4,
    totalXp: 850,
    bossId: 'boss-ml',
    quests: [
      {
        id: 'quest-ml-1',
        worldId: 'world-2',
        title: 'Master Machine Learning',
        description: 'Build predictive regression, classification boundaries, and guard models against overfitting.',
        xpReward: 400,
        requiredLevel: 4,
        missionIds: ['m-04', 'm-05', 'm-06'],
        bossId: 'boss-ml',
        icon: 'Target',
        progressPercent: 65 // Matches dashboard spec!
      }
    ]
  },
  {
    id: 'world-3',
    worldNumber: 3,
    name: 'DEEP LEARNING',
    subtitle: 'The Synaptic Abyss',
    description: 'Descend into multi-layer neural networks, backpropagation calculus, and loss optimization landscapes.',
    icon: 'Network',
    accentColor: '#FF007A',
    glowColor: 'rgba(255, 0, 122, 0.4)',
    requiredLevel: 8,
    totalXp: 1200,
    bossId: 'boss-dl',
    quests: [
      {
        id: 'quest-dl-1',
        worldId: 'world-3',
        title: 'Deep Synaptic Layers',
        description: 'Stack hidden perceptron layers, backpropagate gradients, and steer weights toward optimal convergence.',
        xpReward: 500,
        requiredLevel: 8,
        missionIds: ['m-07', 'm-08'],
        bossId: 'boss-dl',
        icon: 'Layers',
        progressPercent: 20
      }
    ]
  },
  {
    id: 'world-4',
    worldNumber: 4,
    name: 'COMPUTER VISION',
    subtitle: 'The Visual Cortex',
    description: 'Decode images from raw RGB tensor matrices to spatial convolutions and real-time object segmentation.',
    icon: 'Eye',
    accentColor: '#00FF9D',
    glowColor: 'rgba(0, 255, 157, 0.4)',
    requiredLevel: 12,
    totalXp: 1400,
    bossId: 'boss-cv',
    quests: [
      {
        id: 'quest-cv-1',
        worldId: 'world-4',
        title: 'Visual Matrix Processing',
        description: 'Extract edge gradients, pooling features, and construct convolutional classification pipelines.',
        xpReward: 600,
        requiredLevel: 12,
        missionIds: ['m-09'],
        icon: 'Camera',
        progressPercent: 0
      }
    ]
  },
  {
    id: 'world-5',
    worldNumber: 5,
    name: 'NLP',
    subtitle: 'The Semantic Lattice',
    description: 'Transform human language into high-dimensional geometric embedding vectors and sequence models.',
    icon: 'MessageSquareCode',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    requiredLevel: 15,
    totalXp: 1600,
    bossId: 'boss-nlp',
    quests: [
      {
        id: 'quest-nlp-1',
        worldId: 'world-5',
        title: 'Token Space & Vectors',
        description: 'Encode words into continuous semantic coordinates and decode probabilistic grammar syntax.',
        xpReward: 700,
        requiredLevel: 15,
        missionIds: ['m-10'],
        icon: 'Binary',
        progressPercent: 0
      }
    ]
  },
  {
    id: 'world-6',
    worldNumber: 6,
    name: 'GENERATIVE AI',
    subtitle: 'The Creative Singularity',
    description: 'Synthesize images, code, and reasoning tokens using multi-billion parameter foundation architectures.',
    icon: 'Flame',
    accentColor: '#FFB800',
    glowColor: 'rgba(255, 184, 0, 0.4)',
    requiredLevel: 18,
    totalXp: 2000,
    bossId: 'boss-genai',
    quests: [
      {
        id: 'quest-genai-1',
        worldId: 'world-6',
        title: 'Architects of the Singularity',
        description: 'Master multi-head self-attention, KV caching, RLHF reward modeling, and prompt orchestration.',
        xpReward: 1000,
        requiredLevel: 18,
        missionIds: ['m-11'],
        bossId: 'boss-genai',
        icon: 'Wand2',
        progressPercent: 0
      }
    ]
  }
];

export const BOSSES: Record<string, Boss> = {
  'boss-ml': {
    id: 'boss-ml',
    worldId: 'world-2',
    name: 'OVERFITTING TITAN',
    title: 'MACHINE LEARNING BOSS',
    description: 'A colossal monolith that has memorized the entire training distribution. It deflects simplistic models by projecting hyper-complex polynomial boundaries.',
    maxHp: 100,
    xpReward: 500,
    difficulty: 'RAID TIER // HARD',
    avatarVariant: 'overfitter',
    rewardBadge: 'ML Apprentice',
    questions: [
      {
        id: 'bq-1',
        question: 'Which algorithm is commonly used for binary classification?',
        options: ['Logistic Regression', 'K-Means', 'PCA', 'Apriori'],
        correctIndex: 0,
        hint: 'This algorithm passes a linear equation through a sigmoid function to output probabilities between 0 and 1.',
        explanation: 'Logistic Regression uses the logistic sigmoid curve σ(z) = 1 / (1 + e^-z) to model binary outcome probabilities.',
        damage: 20
      },
      {
        id: 'bq-2',
        question: 'To penalize large weights and induce feature sparsity (driving some weights to exactly zero), which regularization technique is used?',
        options: ['L2 Ridge Regularization', 'L1 Lasso Regularization', 'Batch Normalization', 'Gradient Clipping'],
        correctIndex: 1,
        hint: 'This penalty adds the sum of the absolute values of the weights (||w||_1) to the loss function.',
        explanation: 'L1 Lasso regularization adds λ * Σ|w_i| to the loss, mathematically driving irrelevant feature coefficients to absolute zero.',
        damage: 20
      },
      {
        id: 'bq-3',
        question: 'When evaluating a model on an imbalanced dataset (e.g. 99% fraud-free, 1% fraudulent), which metric is LEAST reliable?',
        options: ['Accuracy', 'ROC-AUC', 'F1-Score', 'Precision-Recall AUC'],
        correctIndex: 0,
        hint: 'A dummy model predicting "No Fraud" on everything achieves 99% on this metric while detecting zero fraud.',
        explanation: 'Standard accuracy is deceptive on imbalanced datasets. Precision, Recall, and PR-AUC are far more informative.',
        damage: 20
      },
      {
        id: 'bq-4',
        question: 'What is the primary purpose of K-Fold Cross Validation?',
        options: [
          'To generate artificial training images',
          'To assess how well model results generalize to an independent dataset and mitigate sampling variance',
          'To convert float numbers into 16-bit integers',
          'To speed up CPU clock speed during inference'
        ],
        correctIndex: 1,
        hint: 'It splits the dataset into K subsets and trains K separate models to obtain a reliable mean performance estimate.',
        explanation: 'K-Fold cross validation partitions data into K folds, ensuring every sample serves in both training and test subsets.',
        damage: 20
      },
      {
        id: 'bq-5',
        question: 'In the Bias-Variance tradeoff, what symptom characterizes a model with HIGH BIAS?',
        options: [
          'Underfitting (failing to capture the underlying pattern on both training and test data)',
          'Overfitting (memorizing training data with high test variance)',
          'Zero training loss',
          'Excessive sensitivity to tiny noise fluctuations'
        ],
        correctIndex: 0,
        hint: 'High bias means the model makes overly simplistic assumptions about reality.',
        explanation: 'High bias causes underfitting — the model architecture is too simple (e.g. fitting a straight line to quadratic data) to learn the underlying trend.',
        damage: 20
      }
    ]
  },
  'boss-dl': {
    id: 'boss-dl',
    worldId: 'world-3',
    name: 'GRADIENT SERPENT',
    title: 'DEEP LEARNING BOSS',
    description: 'An ancient neural entity slithering through the loss manifold, suffocating optimizers in vanishing gradients and saddle points.',
    maxHp: 100,
    xpReward: 650,
    difficulty: 'LEGENDARY TIER',
    avatarVariant: 'neural_colossus',
    rewardBadge: 'Neural Slayer',
    questions: [
      {
        id: 'dl-bq-1',
        question: 'What mechanism was introduced in ResNet architectures to overcome the vanishing gradient problem in very deep networks?',
        options: ['Skip / Residual Connections', 'Max Pooling', 'Sigmoid Activations', 'Single-layer perceptrons'],
        correctIndex: 0,
        hint: 'These allow gradient identity highways: f(x) + x.',
        explanation: 'Residual skip connections pass identity gradients back through layers unimpeded, enabling networks with hundreds of layers to converge.',
        damage: 25
      },
      {
        id: 'dl-bq-2',
        question: 'Why does the ReLU activation function help prevent vanishing gradients during backpropagation?',
        options: [
          'Its derivative is 1 for all positive inputs, preventing gradient shrinkage across layers',
          'It maps all numbers between -1 and +1',
          'It is twice as smooth as Gaussian curves',
          'It doubles the weights automatically'
        ],
        correctIndex: 0,
        hint: 'Look at the derivative of max(0, x) when x > 0.',
        explanation: 'For x > 0, d/dx(ReLU) = 1.0. This constant derivative doesn’t decay exponentially like Sigmoid or Tanh derivatives do.',
        damage: 25
      },
      {
        id: 'dl-bq-3',
        question: 'Which optimizer adaptively calculates individual learning rates for different parameters using first and second gradient moments?',
        options: ['Adam (Adaptive Moment Estimation)', 'Plain Stochastic Gradient Descent (SGD)', 'Simulated Annealing', 'Random Search'],
        correctIndex: 0,
        hint: 'Combines the benefits of RMSprop and AdaGrad.',
        explanation: 'Adam stores exponential moving averages of both past gradients (momentum) and past squared gradients (uncentered variance).',
        damage: 25
      },
      {
        id: 'dl-bq-4',
        question: 'What does Dropout do during training phase in neural networks?',
        options: [
          'Randomly zeroes out a percentage of neuron activations to prevent co-adaptation',
          'Deletes slow GPUs from the compute cluster',
          'Stops training whenever loss goes negative',
          'Removes all negative weight values'
        ],
        correctIndex: 0,
        hint: 'It forces the network to learn redundant robust features so it does not rely too heavily on any single neuron.',
        explanation: 'Dropout randomly deactivates neurons with probability p during forward passes, acting as an implicit ensemble of subnetworks.',
        damage: 25
      }
    ]
  },
  'boss-genai': {
    id: 'boss-genai',
    worldId: 'world-6',
    name: 'SINGULARITY PRIME',
    title: 'GENERATIVE AI BOSS',
    description: 'The supreme synthetic mind embodying trillions of parameters. It predicts your thoughts before you type them.',
    maxHp: 100,
    xpReward: 1000,
    difficulty: 'MYTHIC RAID TIER',
    avatarVariant: 'singularity',
    rewardBadge: 'Singularity Overlord',
    questions: [
      {
        id: 'gen-1',
        question: 'What is the time complexity of naive standard Self-Attention with respect to sequence length N?',
        options: ['O(N^2) Quadratic', 'O(N) Linear', 'O(log N) Logarithmic', 'O(1) Constant'],
        correctIndex: 0,
        hint: 'Every token computes a dot product with every other token in the sequence.',
        explanation: 'Standard attention computes an N x N matrix of affinity scores, scaling quadratically with sequence length.',
        damage: 34
      },
      {
        id: 'gen-2',
        question: 'In RLHF (Reinforcement Learning from Human Feedback), what is trained immediately before PPO policy optimization?',
        options: ['A Reward Model based on human preference rankings', 'The Tokenizer Vocabulary', 'The Flash Memory Driver', 'The Matrix Multiplier ASIC'],
        correctIndex: 0,
        hint: 'This model outputs a scalar score representing how helpful or harmless an AI response was judged by human evaluators.',
        explanation: 'A Reward Model is trained on human preference pairs (chosen vs rejected) to assign scalar rewards that guide reinforcement policy updates.',
        damage: 33
      },
      {
        id: 'gen-3',
        question: 'In modern LLM inference, what does the KV Cache avoid recalculating at each autoregressive generation step?',
        options: [
          'Key and Value vectors of past prompt tokens',
          'The entire weights file on the hard drive',
          'The Python interpreter bytecode',
          'The screen display resolution'
        ],
        correctIndex: 0,
        hint: 'Previously computed keys and values for past tokens are cached in VRAM so we only compute attention for the newest token.',
        explanation: 'KV Caching preserves Key and Value matrices in GPU VRAM across generation steps, drastically accelerating token throughput.',
        damage: 33
      }
    ]
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-quest',
    title: 'FIRST QUEST',
    description: 'Complete your first AI learning mission successfully.',
    icon: 'Flag',
    xpReward: 100,
    category: 'quest',
    isUnlocked: true,
    unlockedAt: '2 days ago',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'ach-ai-explorer',
    title: 'AI EXPLORER',
    description: 'Unlock and explore at least 3 distinct AI World realms.',
    icon: 'Compass',
    xpReward: 200,
    category: 'quest',
    isUnlocked: true,
    unlockedAt: '1 day ago',
    progress: 3,
    maxProgress: 3
  },
  {
    id: 'ach-streak-7',
    title: '7 DAY STREAK',
    description: 'Maintain a consistent learning streak for 7 consecutive days.',
    icon: 'Flame',
    xpReward: 250,
    category: 'streak',
    isUnlocked: true,
    unlockedAt: 'Yesterday',
    progress: 12,
    maxProgress: 7
  },
  {
    id: 'ach-ml-apprentice',
    title: 'ML APPRENTICE',
    description: 'Conquer the Machine Learning realm and defeat the Overfitting Titan.',
    icon: 'Swords',
    xpReward: 500,
    category: 'combat',
    isUnlocked: false,
    progress: 4,
    maxProgress: 5
  },
  {
    id: 'ach-neural-slayer',
    title: 'NEURAL NETWORK SLAYER',
    description: 'Master backpropagation and eliminate the Gradient Serpent.',
    icon: 'Zap',
    xpReward: 650,
    category: 'combat',
    isUnlocked: false,
    progress: 1,
    maxProgress: 4
  },
  {
    id: 'ach-python-warrior',
    title: 'PYTHON WARRIOR',
    description: 'Complete 10 hands-on algorithmic and data challenge missions.',
    icon: 'Terminal',
    xpReward: 300,
    category: 'mastery',
    isUnlocked: true,
    unlockedAt: '3 days ago',
    progress: 10,
    maxProgress: 10
  },
  {
    id: 'ach-concept-master',
    title: 'CONCEPT MASTER',
    description: 'Score 90%+ evaluation on the Feynman "Teach It Back" challenge.',
    icon: 'BookOpen',
    xpReward: 350,
    category: 'mastery',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-boss-defeated',
    title: 'BOSS DEFEATED',
    description: 'Claim victory in any AI Boss Battle arena with zero hints used.',
    icon: 'Trophy',
    xpReward: 400,
    category: 'combat',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  }
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'u-1',
    name: 'Kaelen_AI',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    level: 24,
    xp: 9840,
    badges: 18,
    streak: 42,
    title: 'Singularity Architect',
    tier: 'Grandmaster'
  },
  {
    rank: 2,
    id: 'u-2',
    name: 'NeuralNova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    level: 21,
    xp: 8420,
    badges: 15,
    streak: 28,
    title: 'Tensor Knight',
    tier: 'Grandmaster'
  },
  {
    rank: 3,
    id: 'u-3',
    name: 'CipherMind',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    level: 19,
    xp: 7650,
    badges: 14,
    streak: 35,
    title: 'Loss Optimizer',
    tier: 'Diamond'
  },
  {
    rank: 4,
    id: 'u-4',
    name: 'MatrixWalker',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80',
    level: 17,
    xp: 6890,
    badges: 12,
    streak: 19,
    title: 'Backprop Master',
    tier: 'Diamond'
  },
  {
    rank: 5,
    id: 'current-user',
    name: 'AI Explorer',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    level: 14,
    xp: 4850,
    badges: 10,
    streak: 12,
    title: 'Deep Wanderer',
    tier: 'Platinum',
    isCurrentUser: true
  },
  {
    rank: 6,
    id: 'u-6',
    name: 'VectorValkyrie',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    level: 13,
    xp: 4420,
    badges: 9,
    streak: 15,
    title: 'Prompt Alchemist',
    tier: 'Platinum'
  },
  {
    rank: 7,
    id: 'u-7',
    name: 'GradientGhost',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    level: 12,
    xp: 3950,
    badges: 8,
    streak: 11,
    title: 'Feature Scout',
    tier: 'Gold'
  },
  {
    rank: 8,
    id: 'u-8',
    name: 'ZeroShot_Sam',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    level: 11,
    xp: 3510,
    badges: 7,
    streak: 9,
    title: 'Data Apprentice',
    tier: 'Gold'
  }
];

export const KNOWLEDGE_TOPICS = [
  {
    id: 'grad-descent',
    title: 'Gradient Descent',
    prompt: 'Explain gradient descent as if you were teaching another student.',
    sampleGoodTerms: ['gradient', 'derivative', 'learning rate', 'step', 'loss function', 'minimum', 'slope', 'weights', 'direction'],
    contextHint: 'Explain what direction the optimizer takes, why the learning rate matters, and what happens if steps are too large or too small.'
  },
  {
    id: 'supervised-learning',
    title: 'Supervised Learning',
    prompt: 'Explain supervised learning to someone who has never coded before.',
    sampleGoodTerms: ['labels', 'features', 'training data', 'ground truth', 'predictions', 'examples', 'error', 'correction'],
    contextHint: 'Use the analogy of teacher flashcards, explaining input features, target labels, and how error correction works.'
  },
  {
    id: 'overfitting',
    title: 'Overfitting vs Generalization',
    prompt: 'How would you explain overfitting and why test datasets are necessary?',
    sampleGoodTerms: ['memorization', 'validation', 'noise', 'generalize', 'test set', 'unseen data', 'regularization', 'variance'],
    contextHint: 'Contrast memorizing specific exam questions with learning actual principles, and mention train vs test splits.'
  },
  {
    id: 'attention-mechanism',
    title: 'Self-Attention in Transformers',
    prompt: 'Explain what Self-Attention does in modern LLMs like GPT or Claude.',
    sampleGoodTerms: ['tokens', 'context', 'query', 'key', 'value', 'weights', 'relevance', 'relationships', 'parallel'],
    contextHint: 'Explain how words look at other words in the same sentence to resolve ambiguity like what "it" refers to.'
  }
];
