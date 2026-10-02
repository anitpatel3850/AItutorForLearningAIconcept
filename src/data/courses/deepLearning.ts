import { Course } from './types';

export const deepLearningCourse: Course = {
  id: 'deep-learning',
  title: 'Deep Learning',
  shortDescription: 'Construct multilayer neural networks from scratch, conquer backpropagation, convolutional vision networks, and modern transformers.',
  description: 'Dive deep beneath the surface of classical machine learning. Master the mechanics of artificial neurons, tensor chain-rule derivatives, gradient clipping, convolutional feature extractors, and self-attention transformers.',
  iconName: 'Cpu',
  level: 'Advanced',
  category: 'Advanced AI',
  estimatedHours: 28,
  badge: 'Synaptic Architect',
  accentColor: 'purple',
  whatYouWillLearn: [
    'Derive matrix backpropagation and automatic differentiation mechanics',
    'Tune advanced optimizers: SGD with Momentum, RMSprop, and AdamW',
    'Prevent vanishing/exploding gradients with Batch Normalization, LayerNorm, and Dropout',
    'Build Convolutional Neural Networks (CNNs) with 2D convolutions, pooling, and residual blocks',
    'Implement Recurrent Neural Networks (LSTMs, GRUs) for sequential time-series modeling',
    'Architect Multi-Head Self-Attention layers and Transformer encoder-decoder blocks',
    'Train and fine-tune deep vision and language models on GPU accelerators'
  ],
  prerequisites: [
    'Machine Learning fundamentals (gradient descent, loss functions)',
    'Matrix operations & basic partial derivatives'
  ],
  skillsYouWillGain: [
    'PyTorch & Deep Learning Frameworks',
    'Backpropagation & Computational Graphs',
    'CNNs & ResNet Architectures',
    'Self-Attention & Transformers',
    'GPU Acceleration & Distributed Training'
  ],
  completionRequirements: [
    'Complete all 8 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Defeat the Neural Colossus in the final raid boss encounter'
  ],
  modules: [
    {
      id: 'dl-m1',
      moduleNumber: 1,
      title: 'Neural Network Foundations',
      description: 'The artificial perceptron, activation functions (ReLU, GELU, Sigmoid, Softmax), and universal approximation theorem.',
      difficulty: 'Intermediate',
      estimatedMinutes: 100,
      xpReward: 200,
      lessons: [
        {
          id: 'dl-l1-perceptron',
          title: 'Artificial Neurons & Activation Dynamics',
          description: 'Linear combinations followed by non-linear activations: why non-linearity is essential for deep networks.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Implement a forward perceptron and justify why non-linear activations prevent deep networks from collapsing into a single linear matrix.',
          explanation: 'Without non-linear activations, stacking 100 neural layers is mathematically equivalent to a single linear layer because W2 * (W1 * x) = (W2 * W1) * x = W_combined * x. Activations allow networks to learn arbitrary complex decision manifolds.',
          importantConcepts: [
            'Perceptron: y = activation(w . x + b).',
            'Vanishing Gradient: Sigmoid saturates at 0 and 1, dampening gradients during backprop.',
            'ReLU & Leaky ReLU: Simple max(0, x) prevents saturation in positive domain.'
          ],
          keyPoints: [
            'ReLU is the default hidden layer activation in modern vision and feedforward networks.',
            'Softmax normalizes unnormalized logits into a valid probability distribution summing to 1.0.'
          ],
          codeExample: {
            language: 'python',
            code: `import numpy as np\n\ndef relu(z):\n    return np.maximum(0, z)\n\ndef softmax(logits):\n    exp_shifted = np.exp(logits - np.max(logits)) # numerical stability\n    return exp_shifted / np.sum(exp_shifted)\n\nlogits = np.array([2.0, 1.0, 0.1])\nprobs = softmax(logits)\nprint("Softmax Probabilities:", probs.round(3))\nprint("Sum to 1.0:", np.isclose(np.sum(probs), 1.0))`,
            explanation: 'Numerically stable Softmax activation calculation.',
            output: 'Softmax Probabilities: [0.659 0.242 0.098]\nSum to 1.0: True'
          },
          practicalExample: {
            title: 'Multi-Class Output Layer',
            scenario: 'You have a 10-class image classifier. What activation and loss function should you use on the final output?',
            solution: 'Softmax activation combined with Categorical Cross-Entropy loss.'
          },
          quiz: {
            question: 'What happens mathematically if all hidden layers in a 50-layer neural network use strictly linear activations f(x) = x?',
            options: [
              'The network overfits exponentially',
              'The network collapses mathematically into an ordinary single linear transformation',
              'Gradients explode to infinity on the second epoch',
              'The network becomes a decision tree'
            ],
            correctIndex: 1,
            explanation: 'The composition of linear functions is always strictly linear. Non-linear activations are required to bend decision boundaries.'
          },
          practiceChallenge: {
            prompt: 'Implement a Leaky ReLU activation function where negative values are scaled by alpha = 0.01.',
            starterCode: 'def leaky_relu(x, alpha=0.01):\n    pass',
            solutionHint: 'Use np.where(x > 0, x, alpha * x).',
            solutionCode: 'import numpy as np\ndef leaky_relu(x, alpha=0.01):\n    return np.where(x > 0, x, alpha * x)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m2',
      moduleNumber: 2,
      title: 'Forward & Backpropagation Mechanics',
      description: 'Chain rule of calculus, computational graphs, matrix Jacobians, and automatic differentiation.',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'dl-l2-backprop',
          title: 'The Matrix Chain Rule & Gradient Flow',
          description: 'Tracing loss gradients backwards through layers: dL/dW = dL/dY * dY/dW.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Derive and compute analytical gradients for a 2-layer neural network from scratch.',
          explanation: 'Backpropagation is the reverse-mode automatic differentiation algorithm that efficiently computes partial derivatives of the scalar loss with respect to every weight parameter in O(N) time.',
          importantConcepts: [
            'Forward Pass: Caching activations and pre-activations (z = Wx + b).',
            'Backward Pass: Passing upstream error gradients back to compute parameter derivatives.',
            'Gradient Accumulation: Aggregating gradients across mini-batch samples.'
          ],
          keyPoints: [
            'Activations from the forward pass must be held in VRAM for the backward pass.',
            'Matrix dimension alignment (transposition) ensures gradients have the exact same shape as their corresponding weights.'
          ],
          codeExample: {
            language: 'python',
            code: `# Mini-batch backprop derivative:\n# dL/dW = X.T @ dL/dZ / batch_size\n# dL/db = np.sum(dL/dZ, axis=0, keepdims=True) / batch_size\n# dL/dX = dL/dZ @ W.T`,
            explanation: 'Fundamental matrix calculus formulas used in PyTorch autograd.',
            output: 'Matrix derivative identities verified.'
          },
          practicalExample: {
            title: 'Gradient Checking',
            scenario: 'Verify custom manual backpropagation against numerical approximations.',
            solution: 'grad_approx = (loss(w + eps) - loss(w - eps)) / (2 * eps)'
          },
          quiz: {
            question: 'What is the primary computational reason why forward activations are kept in memory during training?',
            options: [
              'To show them to the user',
              'They are directly required by the chain rule to compute weight gradients in the backward pass',
              'To compute test set accuracy',
              'To prevent CUDA kernel timeouts'
            ],
            correctIndex: 1,
            explanation: 'The derivative dL/dW involves the incoming activation x from the forward pass: dL/dW = dL/dz * x.'
          },
          practiceChallenge: {
            prompt: 'Verify that the gradient shape of weight tensor W with shape (64, 128) is also (64, 128).',
            starterCode: 'W_shape = (64, 128)\n# grad_shape = ?',
            solutionHint: 'Gradient shapes always match parameter tensor shapes.',
            solutionCode: 'grad_shape = W_shape\nassert grad_shape == (64, 128)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m3',
      moduleNumber: 3,
      title: 'Deep Optimization & Regularization',
      description: 'Stochastic Gradient Descent (SGD), Momentum, RMSprop, AdamW, Dropout, Batch Normalization, and LayerNorm.',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'dl-l3-adam-norm',
          title: 'Adaptive Optimizers & Normalization Layers',
          description: 'First and second moment estimation in AdamW, alongside internal covariate shift mitigation with LayerNorm.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Configure AdamW optimizer with cosine learning rate decay and LayerNorm.',
          explanation: 'Standard SGD suffers in ravines where surface curves much more steeply in one dimension. Adam combines Momentum (moving average of gradients) and RMSprop (moving average of squared gradients) with decoupled weight decay (AdamW).',
          importantConcepts: [
            'AdamW: Correct weight decay decoupled from adaptive gradient scaling.',
            'Batch Normalization: Normalizes across batch dimension (common in CNNs).',
            'Layer Normalization: Normalizes across feature channels independently for each sample (standard in Transformers).'
          ],
          keyPoints: [
            'Always use AdamW instead of classic Adam when applying L2 weight decay.',
            'Dropout behaves differently during training (stochastically zeroes nodes) vs evaluation (scales activations).'
          ],
          codeExample: {
            language: 'python',
            code: `# AdamW update components:\n# m_t = beta1 * m_{t-1} + (1 - beta1) * g_t      (momentum)\n# v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2    (RMS scale)\n# w_t = w_{t-1} - lr * (m_hat / (sqrt(v_hat) + eps)) - lr * wd * w_{t-1}`,
            explanation: 'AdamW decoupled weight decay update rule.',
            output: 'AdamW state optimizer logic verified.'
          },
          practicalExample: {
            title: 'Transformer Normalization Choice',
            scenario: 'Why do Transformers utilize LayerNorm instead of BatchNorm?',
            solution: 'NLP batches have variable sequence lengths; BatchNorm across variable lengths and small batch sizes creates extreme instability.'
          },
          quiz: {
            question: 'What is the role of Dropout during neural network training?',
            options: [
              'Dropping out poor training examples permanently',
              'Randomly zeroing out a percentage of activations to prevent co-adaptation of features',
              'Dropping the learning rate',
              'Pruning dead weights from disk'
            ],
            correctIndex: 1,
            explanation: 'Dropout forces the network to learn redundant, robust representations by randomly disabling units with probability p.'
          },
          practiceChallenge: {
            prompt: 'Calculate the scaling factor applied to active neurons during training when dropout rate is p = 0.2 (inverted dropout).',
            starterCode: 'p = 0.2\n# scale = ?',
            solutionHint: 'Scale is 1.0 / (1.0 - p).',
            solutionCode: 'p = 0.2\nscale = 1.0 / (1.0 - p)\nprint(f"Scale: {scale}") # 1.25'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m4',
      moduleNumber: 4,
      title: 'Convolutional Neural Networks (CNNs)',
      description: '2D spatial convolutions, receptive fields, padding, stride, pooling, and Residual Networks (ResNet).',
      difficulty: 'Advanced',
      estimatedMinutes: 140,
      xpReward: 250,
      lessons: [
        {
          id: 'dl-l4-cnn-resnet',
          title: 'Spatial Convolutions & Skip Connections',
          description: 'Kernel sliding, feature map downsampling, and vanishing gradient mitigation via identity shortcuts.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Calculate output feature map dimensions and implement a residual block.',
          explanation: 'CNNs leverage parameter sharing and translation invariance to process grid-like pixel tensors. ResNet introduced skip connections: F(x) + x, enabling networks with 100+ layers to train smoothly.',
          importantConcepts: [
            'Convolution Output Formula: Floor((W - K + 2P)/S) + 1.',
            'Skip Connections: Adding the identity input x directly to the output of convolutional sub-layers.',
            'Global Average Pooling: Collapsing spatial dimensions into a feature vector before classification.'
          ],
          keyPoints: [
            'Smaller 3x3 kernels stacked provide the same receptive field as 5x5 or 7x7 with far fewer parameters.',
            'Residual connections ensure that backpropagating gradients can flow directly to early layers without attenuation.'
          ],
          codeExample: {
            language: 'python',
            code: `def calc_conv_out(w, k, p, s):\n    return (w - k + 2 * p) // s + 1\n\n# 224x224 image, 7x7 kernel, padding=3, stride=2\nout_dim = calc_conv_out(224, 7, 3, 2)\nprint("Conv1 Output Spatial Size:", f"{out_dim}x{out_dim}")`,
            explanation: 'Calculating feature map spatial reduction through a stride-2 convolution.',
            output: 'Conv1 Output Spatial Size: 112x112'
          },
          practicalExample: {
            title: 'Residual Block Forward Pass',
            scenario: 'Compute the forward output of a residual block with input x and conv layers F(x).',
            solution: 'out = F(x) + x\nactivated = relu(out)'
          },
          quiz: {
            question: 'What primary problem do skip (residual) connections solve in very deep neural networks?',
            options: [
              'Slow disk I/O',
              'Vanishing gradients that prevent early layers from receiving learning signal',
              'Excessive GPU VRAM consumption',
              'Dataset imbalance'
            ],
            correctIndex: 1,
            explanation: 'Skip connections allow gradients to flow backwards directly through the identity addition path: d(F(x)+x)/dx = dF/dx + 1.'
          },
          practiceChallenge: {
            prompt: 'Calculate the output width of an image with width=32, kernel=3, padding=1, and stride=1.',
            starterCode: 'w = 32; k = 3; p = 1; s = 1\n# out_w = ?',
            solutionHint: 'Formula: (w - k + 2*p) // s + 1',
            solutionCode: 'out_w = (32 - 3 + 2*1) // 1 + 1\nprint(out_w) # 32 (Same padding)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m5',
      moduleNumber: 5,
      title: 'Sequence Models: RNNs & LSTMs',
      description: 'Hidden state recurrence, Backpropagation Through Time (BPTT), vanishing gradients, and LSTM gating mechanisms.',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 200,
      lessons: [
        {
          id: 'dl-l5-lstm',
          title: 'Long Short-Term Memory (LSTM) Networks',
          description: 'Forget gate, input gate, cell state memory highway, and output gate mechanics.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Explain how cell state conveyors in LSTMs capture long-range temporal dependencies.',
          explanation: 'Standard vanilla RNNs fail over sequences longer than 10-20 steps due to vanishing gradients during BPTT. LSTMs introduce a linear cell state highway regulated by multiplicative forget, input, and output gates.',
          importantConcepts: [
            'Forget Gate: Decides what percentage of previous cell memory to erase (f_t = sigmoid(...)).',
            'Input Gate: Determines what new candidate memory to write to the cell state.',
            'Cell State (C_t): Additive linear conveyor preserving gradients across hundreds of time steps.'
          ],
          keyPoints: [
            'LSTMs are sequential and cannot be easily parallelized across sequence length during training.',
            'Gated Recurrent Units (GRUs) simplify LSTMs by merging cell state and hidden state.'
          ],
          codeExample: {
            language: 'python',
            code: `# LSTM Cell State Update Equation:\n# C_t = f_t * C_{t-1} + i_t * C_tilde_t\n# h_t = o_t * tanh(C_t)\nprint("LSTM gating allows constant gradient flow through C_t.")`,
            explanation: 'The mathematical equation governing LSTM memory preservation.',
            output: 'LSTM gating allows constant gradient flow through C_t.'
          },
          practicalExample: {
            title: 'Stock Volatility Forecasting',
            scenario: 'Predict tomorrow\'s market volatility using the past 60 trading days.',
            solution: 'Model with LSTM(64, return_sequences=False) fed with shape (batch, 60, features).'
          },
          quiz: {
            question: 'Which gate in an LSTM cell controls how much of the prior cell state information is discarded?',
            options: ['Input Gate', 'Output Gate', 'Forget Gate', 'Reset Gate'],
            correctIndex: 2,
            explanation: 'The forget gate outputs values between 0 and 1 via sigmoid to multiply the prior cell state C_{t-1}.'
          },
          practiceChallenge: {
            prompt: 'State the output dimension of an LSTM layer with 128 hidden units processing a sequence of length 50 with batch size 32 when return_sequences=False.',
            starterCode: '# Shape = (batch_size, hidden_dim)',
            solutionHint: 'Only the final time step hidden state is returned.',
            solutionCode: 'output_shape = (32, 128)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m6',
      moduleNumber: 6,
      title: 'Transformers & Self-Attention',
      description: 'The Attention mechanism, Scaled Dot-Product Attention, Queries, Keys, Values, Multi-Head Attention, and Positional Encodings.',
      difficulty: 'Advanced',
      estimatedMinutes: 160,
      xpReward: 300,
      lessons: [
        {
          id: 'dl-l6-attention',
          title: 'Scaled Dot-Product & Multi-Head Self-Attention',
          description: 'Attention(Q, K, V) = Softmax(Q * K.T / sqrt(d_k)) * V and parallel head projections.',
          estimatedMinutes: 35,
          xpReward: 25,
          learningObjective: 'Implement Scaled Dot-Product Attention in Python and explain positional embeddings.',
          explanation: 'Attention replaces recurrence by allowing every token in a sequence to attend directly to every other token simultaneously in O(1) sequential steps, unlocking massive GPU training parallelism.',
          importantConcepts: [
            'Queries, Keys, Values: Information retrieval analogy (Search query, database keys, retrieved content).',
            'Scale Factor 1/sqrt(d_k): Prevents dot products from growing excessively large, avoiding vanishing Softmax gradients.',
            'Positional Encoding: Injecting order awareness into the permutation-equivariant attention matrix.'
          ],
          keyPoints: [
            'Multi-Head Attention enables the model to simultaneously attend to syntax, semantics, and coreference.',
            'Self-attention computational complexity is O(N^2) with respect to sequence length N.'
          ],
          codeExample: {
            language: 'python',
            code: `import numpy as np\n\ndef scaled_dot_product_attention(Q, K, V):\n    d_k = Q.shape[-1]\n    scores = np.matmul(Q, K.T) / np.sqrt(d_k)\n    attention_weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)\n    return np.matmul(attention_weights, V), attention_weights\n\n# 3 tokens, embedding dim 4\nQ = np.random.randn(3, 4)\nK = np.random.randn(3, 4)\nV = np.random.randn(3, 4)\nout, weights = scaled_dot_product_attention(Q, K, V)\nprint("Attention Output Shape:", out.shape)\nprint("Attention Weights Row Sum:", np.sum(weights, axis=-1).round(2))`,
            explanation: 'Core Scaled Dot-Product Attention implemented in pure NumPy.',
            output: 'Attention Output Shape: (3, 4)\nAttention Weights Row Sum: [1. 1. 1.]'
          },
          practicalExample: {
            title: 'Causal Masking in Decoder Models',
            scenario: 'In autoregressive generation (GPT), prevent tokens from looking into the future.',
            solution: 'Apply an upper-triangular mask of negative infinity (-inf) before the Softmax.'
          },
          quiz: {
            question: 'Why are attention scores divided by the square root of key dimension d_k before Softmax?',
            options: [
              'To reduce memory footprint by half',
              'To prevent dot products from becoming large in magnitude, which pushes Softmax into extremely small gradient regions',
              'To convert embeddings into standard normal distributions',
              'To enforce causal token masking'
            ],
            correctIndex: 1,
            explanation: 'Large dot products push the softmax function into regions with tiny gradients, stalling backpropagation.'
          },
          practiceChallenge: {
            prompt: 'Given key dimension d_k = 64, calculate the scaling factor 1 / sqrt(d_k).',
            starterCode: 'd_k = 64\n# scale = ?',
            solutionHint: 'sqrt(64) is 8.',
            solutionCode: 'scale = 1.0 / (64 ** 0.5)\nprint(f"Scale: {scale}") # 0.125'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m7',
      moduleNumber: 7,
      title: 'Deep Learning Capstone Project',
      description: 'Train a deep PyTorch neural network for real-world multimodal classification and export to ONNX runtime.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Deep Vision Transformer Classifier',
        description: 'Implement a patch-based mini Vision Transformer or CNN in PyTorch, train with Cosine Annealing, and evaluate on benchmark tests.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'dl-l7-project-eval',
          title: 'Training Pipeline, Mixed Precision & ONNX Export',
          description: 'FP16 mixed precision training, gradient accumulation, model checkpointing, and inference serialization.',
          estimatedMinutes: 30,
          xpReward: 25,
          learningObjective: 'Serialize a deep learning model for cross-platform edge and web inference.',
          explanation: 'Production deep learning demands modern operational pipelines: automated mixed precision (AMP) to double training speed, gradient clipping to prevent explosion, and ONNX export for low-latency serving.',
          importantConcepts: [
            'Mixed Precision (FP16/BF16): Faster matrix cores on modern GPUs with reduced VRAM footprint.',
            'Gradient Clipping: Clamping gradient norm to a maximum threshold (e.g. max_norm=1.0).',
            'ONNX Serialization: Open Neural Network Exchange format for universal runtime deployment.'
          ],
          keyPoints: [
            'Always enable model.eval() and torch.no_grad() during inference to save VRAM and disable dropout.',
            'Clip gradients before optimizer.step().'
          ],
          codeExample: {
            language: 'python',
            code: `# Standard PyTorch Training Step Pattern:\n# optimizer.zero_grad()\n# with torch.autocast(device_type="cuda"):\n#     loss = criterion(model(inputs), targets)\n# scaler.scale(loss).backward()\n# scaler.unscale_(optimizer)\n# torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)\n# scaler.step(optimizer)\n# scaler.update()\nprint("Deep Learning Training Loop Standardized.")`,
            explanation: 'Modern industrial-strength PyTorch training iteration step.',
            output: 'Deep Learning Training Loop Standardized.'
          },
          practicalExample: {
            title: 'Memory Out-Of-Memory (OOM) Mitigation',
            scenario: 'Your GPU runs out of VRAM when batch size is 64. You need an effective batch size of 64.',
            solution: 'Set physical batch size to 16 and accumulate gradients across 4 steps before calling optimizer.step().'
          },
          quiz: {
            question: 'What is the purpose of torch.no_grad() during model inference?',
            options: [
              'It turns the model into an unsupervised clusterer',
              'It disables the computational graph creation, drastically saving memory and execution time',
              'It quantizes all weights to 8-bit integers',
              'It converts the model to JavaScript'
            ],
            correctIndex: 1,
            explanation: 'Disabling gradient tracking prevents allocating memory for activation history during evaluation.'
          },
          practiceChallenge: {
            prompt: 'Confirm your readiness to enter the Deep Learning Boss Arena.',
            starterCode: '# Verify complete deep learning stack',
            solutionHint: 'Verify understanding of backpropagation, activations, CNNs, and attention.',
            solutionCode: 'print("Deep Learning Mastery Complete. Approaching Neural Colossus Arena.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'dl-m8',
      moduleNumber: 8,
      title: 'Final Boss Raid — The Neural Colossus',
      description: 'Face the multi-layer behemoth: navigate deep residual skip connections, optimize gradients, and claim the Master of Synapses title.',
      difficulty: 'Advanced',
      estimatedMinutes: 60,
      xpReward: 500,
      bossBattle: {
        bossId: 'boss-neural-colossus',
        bossName: 'The Neural Colossus',
        xpReward: 500
      },
      lessons: [
        {
          id: 'dl-l8-colossus-briefing',
          title: 'Boss Raid Strategy: The Neural Colossus',
          description: 'Tactical briefing for the Neural Colossus encounter: counter-measures for vanishing gradients and attention collapse.',
          estimatedMinutes: 20,
          xpReward: 30,
          learningObjective: 'Formulate defense strategies against vanishing gradients, covariate shift, and exploding norms.',
          explanation: 'The Neural Colossus casts massive 100-layer depth debuffs and creates chaotic loss landscapes. Your weapons: residual skip connections, LayerNorm, and scaled attention queries.',
          importantConcepts: [
            'Colossus Vulnerability 1: Residual Skip Connections bypass its depth dissipation shield.',
            'Colossus Vulnerability 2: Gradient Clipping neutralizes its Exploding Gradient attack.',
            'Colossus Vulnerability 3: Scaled Dot-Product Attention targets its multi-head focal points.'
          ],
          keyPoints: [
            'Monitor gradient norms to ensure stable parameter updates.',
            'Proper initialization (He / Kaiming init) keeps variance constant across layers.'
          ],
          codeExample: {
            language: 'python',
            code: `# The Colossus Armor Counter: Kaiming He Initialization\n# std = sqrt(2 / fan_in) preserves activation variance across ReLU layers\nprint("Kaiming He Initializer engaged. Armor piercing ready.")`,
            explanation: 'He initialization counter-measure for deep ReLU networks.',
            output: 'Kaiming He Initializer engaged. Armor piercing ready.'
          },
          practicalExample: {
            title: 'Boss Raid Arena',
            scenario: 'Engage the Neural Colossus in combat.',
            solution: 'Navigate to the Boss Arena to test your deep learning mastery under pressure.'
          },
          quiz: {
            question: 'Which initialization method is mathematically optimized for layers using ReLU activation functions?',
            options: ['Xavier / Glorot Initialization', 'Kaiming / He Initialization', 'Zeros Initialization', 'Constant Ones'],
            correctIndex: 1,
            explanation: 'He initialization accounts for half the neurons being zeroed by ReLU by scaling variance with 2 / fan_in.'
          },
          practiceChallenge: {
            prompt: 'Complete the briefing and unlock the Deep Learning Master Badge.',
            starterCode: '# Unlock Raid',
            solutionHint: 'Confirm readiness to defeat the Colossus.',
            solutionCode: 'print("BOSS RAID UNLOCKED: The Neural Colossus awaits.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
