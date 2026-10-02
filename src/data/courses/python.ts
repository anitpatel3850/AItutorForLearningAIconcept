import { Course } from './types';

export const pythonCourse: Course = {
  id: 'python-for-ai',
  title: 'Python for AI',
  shortDescription: 'Master modern Python programming tailored for machine learning, data engineering, and AI pipelines.',
  description: 'A comprehensive, hands-on path from syntax foundations to vector manipulation with NumPy, dataframe wrangling with Pandas, and data modeling pipelines with Scikit-Learn.',
  iconName: 'Code',
  level: 'Beginner',
  category: 'Core Foundations',
  estimatedHours: 16,
  badge: 'Python Synthesizer',
  accentColor: 'emerald',
  whatYouWillLearn: [
    'Write clean, idiomatic Python code with modern typing and OOP paradigms',
    'Manipulate multidimensional vectors and tensors using NumPy broadcasting',
    'Perform lightning-fast dataset cleaning and ETL transformations with Pandas',
    'Visualize data distributions, correlations, and model metrics with Matplotlib and Seaborn',
    'Prepare training datasets, handle missing values, and encode categorical features for ML',
    'Build and deploy a complete AI prediction script from raw data to model inferences'
  ],
  prerequisites: [
    'Basic computer literacy and curiosity about Artificial Intelligence',
    'No prior programming experience required'
  ],
  skillsYouWillGain: [
    'Python 3.12 syntax & control flow',
    'NumPy ndarray operations & linear algebra',
    'Pandas DataFrames & series transformation',
    'Data visualization & statistical plots',
    'Scikit-Learn preprocessing & training loops'
  ],
  completionRequirements: [
    'Complete all 5 modules and 20 interactive lessons',
    'Pass all lesson mini-quizzes with at least 80% accuracy',
    'Complete the end-of-course AI Project'
  ],
  modules: [
    {
      id: 'py-m1',
      moduleNumber: 1,
      title: 'Python Foundations',
      description: 'Variables, dynamic typing, operators, decision trees, iteration, and functional abstractions.',
      difficulty: 'Beginner',
      estimatedMinutes: 120,
      xpReward: 200,
      lessons: [
        {
          id: 'py-l1-variables',
          title: 'Variables & Data Types',
          description: 'Understand integers, floats, booleans, strings, and dynamic typing in the Python interpreter.',
          estimatedMinutes: 15,
          xpReward: 20,
          learningObjective: 'Declare, cast, and manipulate primitive data types used across machine learning models.',
          explanation: 'In AI programming, data representation is everything. Numbers represent weights and pixel values, while strings represent natural language tokens. Python is dynamically typed, meaning variables acquire their data type automatically at runtime.',
          importantConcepts: [
            'Dynamic Typing: Variables are references to objects in memory rather than statically typed memory slots.',
            'Type Casting: Converting integers to floating-point values for gradient descent accuracy.',
            'Immutability: Strings and numbers cannot be modified in place, ensuring deterministic transformations.'
          ],
          keyPoints: [
            'Integers have arbitrary precision in Python 3.',
            'Floats represent continuous numerical measurements such as probabilities (0.0 to 1.0).',
            'Always use f-strings (f"{var}") for clean data logging and debugging.'
          ],
          codeExample: {
            language: 'python',
            code: `# Representing neuron inputs and weights\nlearning_rate = 0.001          # float\nbatch_size = 64                 # int\nmodel_name = "NeuralCore-v1"    # string\nis_converged = False            # bool\n\nprint(f"[{model_name}] LR: {learning_rate}, Batch: {batch_size}")\nprint(f"Target Type: {type(learning_rate).__name__}")`,
            explanation: 'Variables initialized for training parameters, utilizing f-string formatting for telemetry.',
            output: '[NeuralCore-v1] LR: 0.001, Batch: 64\nTarget Type: float'
          },
          practicalExample: {
            title: 'Normalizing Pixel Values',
            scenario: 'Computer vision inputs range from 0 to 255. Normalize an 8-bit integer pixel to a float between 0.0 and 1.0.',
            solution: 'raw_pixel = 204\nnormalized = raw_pixel / 255.0\n# Result: 0.8'
          },
          quiz: {
            question: 'What is the resulting data type when dividing two integers in Python 3 (e.g. 10 / 2)?',
            options: ['int', 'float', 'double', 'Fraction'],
            correctIndex: 1,
            explanation: 'In Python 3, the true division operator "/" always returns a float, preserving numerical precision.'
          },
          practiceChallenge: {
            prompt: 'Write a small snippet that converts a string representation of an AI accuracy score "0.942" into a percentage rounded to 1 decimal place.',
            starterCode: 'raw_score = "0.942"\n# Your code here',
            solutionHint: 'Use float() casting followed by multiplication and round().',
            solutionCode: 'raw_score = "0.942"\nscore_float = float(raw_score)\npercentage = round(score_float * 100, 1)\nprint(f"{percentage}%")'
          },
          relatedMissionId: 'm-01'
        },
        {
          id: 'py-l2-operators',
          title: 'Operators & Logical Flow',
          description: 'Arithmetic, logical, and comparison operators essential for loss calculations and decision thresholds.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Implement thresholding logic and mathematical operations used in activation functions.',
          explanation: 'Logical comparisons allow neural networks and classification algorithms to make categorical decisions. For instance, if a predicted probability exceeds 0.5, we classify an email as spam; otherwise, ham.',
          importantConcepts: [
            'Comparison Operators (==, !=, >, <, >=, <=) return Boolean flags.',
            'Logical Operators (and, or, not) chain composite neural conditions.',
            'Modulo and Floor Division (%, //) are useful for mini-batch splitting.'
          ],
          keyPoints: [
            'Use "is" for identity checks (e.g. x is None) and "==" for value equality.',
            'Short-circuit evaluation speeds up condition evaluations.'
          ],
          codeExample: {
            language: 'python',
            code: `threshold = 0.5\nprediction_prob = 0.87\n\nif prediction_prob >= threshold:\n    label = "Positive"\nelse:\n    label = "Negative"\n\nprint(f"Classification: {label} (Confidence: {prediction_prob * 100:.1f}%)")`,
            explanation: 'Binary classification decision boundary based on a 0.5 probability threshold.',
            output: 'Classification: Positive (Confidence: 87.0%)'
          },
          practicalExample: {
            title: 'Learning Rate Annealing Condition',
            scenario: 'Decrease learning rate if loss has not improved over 5 consecutive epochs.',
            solution: 'if patience_counter >= 5 and not early_stop_triggered:\n    learning_rate *= 0.5'
          },
          quiz: {
            question: 'Which operator checks whether two variables reference the exact same memory location?',
            options: ['==', 'is', 'equals', '==='],
            correctIndex: 1,
            explanation: 'The "is" keyword tests object identity, while "==" tests equality of values.'
          },
          practiceChallenge: {
            prompt: 'Create a function that returns True if an image height and width are both at least 224 pixels and aspect ratio is 1.0.',
            starterCode: 'def is_square_224(w, h):\n    pass',
            solutionHint: 'Use relational and equality operators.',
            solutionCode: 'def is_square_224(w, h):\n    return w >= 224 and h >= 224 and w == h'
          },
          relatedMissionId: 'm-01'
        },
        {
          id: 'py-l3-loops',
          title: 'Loops & Iteration in Training',
          description: 'For-loops, while-loops, and enumerate patterns that power model training epochs and batch loops.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Write robust iteration loops over datasets and parameter grids with enumerate and zip.',
          explanation: 'Model training involves repeating forward passes, loss calculations, and weight updates over multiple epochs. Python iterators allow clean traversal over millions of training samples.',
          importantConcepts: [
            'Epoch Loops: Outer loop iterating over the full dataset.',
            'Batch Loops: Inner loop processing mini-batches of size N.',
            'Enumerate & Zip: Simultaneous tracking of indices and parallel arrays.'
          ],
          keyPoints: [
            'Use range() for memory-efficient integer generators.',
            'Prefer list comprehensions or vectorization over nested manual for-loops when working with heavy arrays.'
          ],
          codeExample: {
            language: 'python',
            code: `epochs = 3\nlosses = [0.85, 0.42, 0.18]\n\nfor epoch, loss in enumerate(losses, start=1):\n    print(f"Epoch {epoch:02d} | Loss: {loss:.4f} | Converged: {loss < 0.2}")`,
            explanation: 'Simulated model training telemetry loop using enumerate.',
            output: 'Epoch 01 | Loss: 0.8500 | Converged: False\nEpoch 02 | Loss: 0.4200 | Converged: False\nEpoch 03 | Loss: 0.1800 | Converged: True'
          },
          practicalExample: {
            title: 'Early Stopping Trigger',
            scenario: 'Halt training as soon as validation loss begins increasing for 3 steps.',
            solution: 'for epoch in range(100):\n    if should_stop():\n        print("Early stopping invoked.")\n        break'
          },
          quiz: {
            question: 'What is the primary advantage of enumerate(items) over range(len(items))?',
            options: [
              'It runs 10x faster',
              'It provides both index and item directly with cleaner, more pythonic syntax',
              'It converts the list to a numpy array',
              'It enables multi-threading automatically'
            ],
            correctIndex: 1,
            explanation: 'enumerate() cleanly yields (index, item) pairs without manual list subscripting.'
          },
          practiceChallenge: {
            prompt: 'Iterate through a list of loss values and print the minimum loss along with the epoch (1-indexed) it occurred on.',
            starterCode: 'history = [0.9, 0.6, 0.4, 0.35, 0.38]',
            solutionHint: 'Use min() or loop with enumerate tracking lowest value.',
            solutionCode: 'history = [0.9, 0.6, 0.4, 0.35, 0.38]\nbest_loss = float("inf")\nbest_epoch = -1\nfor i, loss in enumerate(history, 1):\n    if loss < best_loss:\n        best_loss = loss\n        best_epoch = i\nprint(f"Best: {best_loss} on epoch {best_epoch}")'
          },
          relatedMissionId: 'm-02'
        },
        {
          id: 'py-l4-functions',
          title: 'Functions & Lambda Expressions',
          description: 'Modular function design, default parameters, *args, **kwargs, and anonymous lambda transformations.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Design modular AI pipeline functions with docstrings, type hints, and parameter unpackers.',
          explanation: 'Clean AI architectures encapsulate feature extractors, loss functions, and inference handlers inside reusable functions. Type hints provide automated documentation and IDE validation.',
          importantConcepts: [
            'Type Annotations: def predict(x: list[float]) -> int:',
            'Default Arguments: Pre-setting hyperparameters like epochs=10.',
            'Lambdas: Quick inline mathematical mappings (e.g. activation formulas).'
          ],
          keyPoints: [
            'Never use mutable default arguments (like def f(x=[])).',
            'Functions should do one task and return deterministic outputs.'
          ],
          codeExample: {
            language: 'python',
            code: `def relu(x: float) -> float:\n    """Rectified Linear Unit activation function."""\n    return max(0.0, x)\n\nsigmoid = lambda z: 1.0 / (1.0 + 2.71828 ** (-z))\n\nprint("ReLU(-4.2):", relu(-4.2))\nprint("ReLU(3.8):", relu(3.8))\nprint("Sigmoid(0):", round(sigmoid(0), 2))`,
            explanation: 'Activation functions implemented as clean Python functions and lambdas.',
            output: 'ReLU(-4.2): 0.0\nReLU(3.8): 3.8\nSigmoid(0): 0.5'
          },
          practicalExample: {
            title: 'Custom Loss Function',
            scenario: 'Calculate Mean Squared Error (MSE) between actual targets and predictions.',
            solution: 'def mean_squared_error(y_true, y_pred):\n    return sum((t - p) ** 2 for t, p in zip(y_true, y_pred)) / len(y_true)'
          },
          quiz: {
            question: 'Why should default parameter values never be mutable objects like empty lists []?',
            options: [
              'Python throws a syntax error',
              'The list is created once at function definition and shared across all future function calls',
              'Mutable defaults disable garbage collection',
              'They convert to tuples automatically'
            ],
            correctIndex: 1,
            explanation: 'Default arguments are evaluated once when the function is defined, causing mutable objects to retain state across calls.'
          },
          practiceChallenge: {
            prompt: 'Write a function compute_accuracy(y_true: list, y_pred: list) -> float that calculates prediction accuracy as a float between 0.0 and 1.0.',
            starterCode: 'def compute_accuracy(y_true, y_pred):\n    pass',
            solutionHint: 'Count matching elements using sum() divided by total length.',
            solutionCode: 'def compute_accuracy(y_true, y_pred):\n    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)\n    return correct / len(y_true)'
          },
          relatedMissionId: 'm-02'
        }
      ]
    },
    {
      id: 'py-m2',
      moduleNumber: 2,
      title: 'Python Data Structures',
      description: 'Lists, Tuples, Sets, Dictionaries, and efficient List/Dict Comprehensions for rapid data reshaping.',
      difficulty: 'Beginner',
      estimatedMinutes: 140,
      xpReward: 200,
      lessons: [
        {
          id: 'py-l5-lists-tuples',
          title: 'Lists, Tuples & Slicing',
          description: 'Sequencing feature arrays, batch slicing with [start:stop:step], and tuple unpacking.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Slice, index, and unpack data sequences with advanced Python slice notation.',
          explanation: 'Lists are mutable ordered sequences used for collecting loss histories and feature vectors. Tuples are immutable, making them ideal for image dimensions and coordinate pairs.',
          importantConcepts: [
            'Slicing Syntax: array[start:stop:step].',
            'Negative Indexing: array[-1] to access the final token.',
            'Tuple Unpacking: height, width, channels = img.shape.'
          ],
          keyPoints: [
            'Tuples consume less memory than lists and are hashable (can be dict keys).',
            'Slicing creates a shallow copy of the sequence.'
          ],
          codeExample: {
            language: 'python',
            code: `dataset = ["sample_01", "sample_02", "sample_03", "sample_04", "sample_05"]\n\ntrain_split = dataset[:3]\ntest_split = dataset[3:]\n\nprint("Training Samples:", train_split)\nprint("Testing Samples:", test_split)\nprint("Reversed:", dataset[::-1])`,
            explanation: 'Splitting training and testing sets with slicing.',
            output: 'Training Samples: [\'sample_01\', \'sample_02\', \'sample_03\']\nTesting Samples: [\'sample_04\', \'sample_05\']\nReversed: [\'sample_05\', \'sample_04\', \'sample_03\', \'sample_02\', \'sample_01\']'
          },
          practicalExample: {
            title: 'K-Fold Partitioning',
            scenario: 'Extract a validation fold of 2 items from index 2 to 4.',
            solution: 'val_fold = data[2:4]'
          },
          quiz: {
            question: 'What does the slice expression array[::2] do?',
            options: [
              'Takes the first two elements',
              'Takes every second element from the beginning to the end',
              'Reverses the array twice',
              'Doubles the size of the array'
            ],
            correctIndex: 1,
            explanation: 'The step parameter of 2 skips alternate items throughout the sequence.'
          },
          practiceChallenge: {
            prompt: 'Given a list of prediction probabilities, return only the top 3 highest values sorted descending.',
            starterCode: 'probs = [0.12, 0.94, 0.45, 0.88, 0.05, 0.72]',
            solutionHint: 'Use sorted() with reverse=True and a slice [:3].',
            solutionCode: 'probs = [0.12, 0.94, 0.45, 0.88, 0.05, 0.72]\ntop3 = sorted(probs, reverse=True)[:3]\nprint(top3)'
          },
          relatedMissionId: 'm-03'
        },
        {
          id: 'py-l6-dicts-sets',
          title: 'Dictionaries, Sets & Vocabulary Maps',
          description: 'Hash-map lookups for vocabulary word-to-index mappings and unique class identification.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Construct token vocabulary tables and fast O(1) membership lookups with sets and dicts.',
          explanation: 'NLP models cannot process raw strings; they require integer indices. Dictionaries map words to IDs (e.g. {"<PAD>": 0, "transformer": 1}), while sets find unique labels across gigabytes of training data in O(1) time.',
          importantConcepts: [
            'Dictionary Key-Value Mapping: Fast lookups via hashing.',
            'Sets: Deduplication and mathematical operations (union, intersection).',
            'dict.get(key, default): Defensive queries without KeyError.'
          ],
          keyPoints: [
            'Dict keys must be immutable (strings, numbers, tuples).',
            'Sets do not preserve duplicates or guaranteed order in older Pythons.'
          ],
          codeExample: {
            language: 'python',
            code: `vocab = {"<PAD>": 0, "hello": 1, "neural": 2, "network": 3}\n\nsentence = ["hello", "neural", "unknown_word"]\nencoded = [vocab.get(word, -1) for word in sentence]\n\nprint("Encoded IDs:", encoded)`,
            explanation: 'Tokenizing words into vector integers using dictionary lookups.',
            output: 'Encoded IDs: [1, 2, -1]'
          },
          practicalExample: {
            title: 'Unique Target Classes',
            scenario: 'Extract the distinct categorical target labels from a dataset list.',
            solution: 'labels = ["cat", "dog", "cat", "bird", "dog"]\nunique_classes = sorted(list(set(labels)))\n# Result: [\'bird\', \'cat\', \'dog\']'
          },
          quiz: {
            question: 'What is the average time complexity of checking membership ("word in vocabulary") in a Python set?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'Sets use underlying hash tables, providing O(1) constant time lookups on average.'
          },
          practiceChallenge: {
            prompt: 'Invert a word-to-id dictionary so that you have an id-to-word decoder dictionary.',
            starterCode: 'word_to_id = {"ai": 1, "quest": 2, "code": 3}',
            solutionHint: 'Use a dictionary comprehension {v: k for k, v in dict.items()}.',
            solutionCode: 'word_to_id = {"ai": 1, "quest": 2, "code": 3}\nid_to_word = {v: k for k, v in word_to_id.items()}\nprint(id_to_word)'
          },
          relatedMissionId: 'm-03'
        },
        {
          id: 'py-l7-comprehensions',
          title: 'List & Dict Comprehensions',
          description: 'Ultra-fast, expressive one-liners for feature preprocessing, text filtering, and matrix flattening.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Transform raw data lists into feature matrices using nested comprehensions and filters.',
          explanation: 'Comprehensions are optimized by Python bytecode for speed, running significantly faster than manual list appending inside an explicit for-loop while yielding clean, readable code.',
          importantConcepts: [
            'Syntax: [expression for item in iterable if condition]',
            'Dict Comprehensions: {k: v for k, v in pairs}',
            'Flattening Nested Matrices: [cell for row in matrix for cell in row]'
          ],
          keyPoints: [
            'Avoid overly complex nested comprehensions that harm readability.',
            'Use generator expressions (expr for x in seq) when processing massive streams.'
          ],
          codeExample: {
            language: 'python',
            code: `raw_tokens = ["  Neural ", "NETWORK", " ", "deep", "LEARNING "]\n\n# Clean, lowercase, and filter empty strings\ncleaned = [t.strip().lower() for t in raw_tokens if t.strip()]\nprint("Cleaned Tokens:", cleaned)`,
            explanation: 'Preprocessing raw natural language tokens with a single list comprehension.',
            output: 'Cleaned Tokens: [\'neural\', \'network\', \'deep\', \'learning\']'
          },
          practicalExample: {
            title: 'Feature Scaling',
            scenario: 'Scale an array of raw sensor readings by dividing each by standard deviation 12.5.',
            solution: 'scaled = [round(val / 12.5, 3) for val in raw_signals]'
          },
          quiz: {
            question: 'Which syntax creates a dictionary mapping each number from 0 to 4 to its square?',
            options: [
              '[x: x**2 for x in range(5)]',
              '{x: x**2 for x in range(5)}',
              'dict(x**2 for x in range(5))',
              '{x**2 for x in range(5)}'
            ],
            correctIndex: 1,
            explanation: 'Curly braces with key: value syntax define a dictionary comprehension.'
          },
          practiceChallenge: {
            prompt: 'Filter a list of numbers to keep only positive numbers and square them.',
            starterCode: 'numbers = [-4, 2, -1, 5, 0, 8]',
            solutionHint: 'Combine expression x**2 with condition if x > 0.',
            solutionCode: 'numbers = [-4, 2, -1, 5, 0, 8]\nresult = [x**2 for x in numbers if x > 0]\nprint(result)'
          },
          relatedMissionId: 'm-03'
        }
      ]
    },
    {
      id: 'py-m3',
      moduleNumber: 3,
      title: 'Python for Data (NumPy & Pandas)',
      description: 'Vectorized computing with NumPy ndarrays, broadcasting, linear algebra, and data wrangling with Pandas.',
      difficulty: 'Intermediate',
      estimatedMinutes: 180,
      xpReward: 250,
      lessons: [
        {
          id: 'py-l8-numpy',
          title: 'NumPy Tensors & Vectorization',
          description: 'Ndarrays, multidimensional shapes, broadcasting, dot products, and vectorized operations.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Perform high-speed tensor algebra without writing slow Python loops.',
          explanation: 'NumPy executes vector calculations in compiled C and Fortran code. Doing element-wise operations on NumPy arrays is often 50x to 100x faster than pure Python lists, serving as the foundation of PyTorch and TensorFlow.',
          importantConcepts: [
            'ndarray: Homogeneous multidimensional numerical grid.',
            'Broadcasting: Arithmetic on arrays of differing shapes automatically.',
            'Vectorization: Applying operations across entire arrays simultaneously.'
          ],
          keyPoints: [
            'All items in a NumPy array must share the same data type (e.g. np.float32).',
            'np.dot() and the @ operator compute matrix multiplications.'
          ],
          codeExample: {
            language: 'python',
            code: `import numpy as np\n\n# 2 inputs, 3 hidden weights\ninputs = np.array([1.5, 2.0])\nweights = np.array([\n    [0.2, 0.8],\n    [0.5, -0.1],\n    [-0.3, 0.4]\n])\nbiases = np.array([0.1, 0.0, -0.1])\n\n# Forward linear layer: y = W * x + b\noutputs = np.dot(weights, inputs) + biases\nprint("Layer Output:", outputs)`,
            explanation: 'Simulating a dense neural layer forward pass using NumPy dot product.',
            output: 'Layer Output: [1.9  0.55 0.4 ]'
          },
          practicalExample: {
            title: 'Batch Normalization',
            scenario: 'Subtract the mean and divide by standard deviation for zero-mean unit-variance data.',
            solution: 'mean = np.mean(X, axis=0)\nstd = np.std(X, axis=0)\nX_norm = (X - mean) / (std + 1e-7)'
          },
          quiz: {
            question: 'What happens when you add a (3, 1) vector to a (3, 4) matrix in NumPy?',
            options: [
              'Throws a ValueError due to shape mismatch',
              'NumPy broadcasts the (3, 1) vector across all 4 columns',
              'The matrix gets flattened to 1D',
              'Only the first column is added'
            ],
            correctIndex: 1,
            explanation: 'NumPy broadcasting matches trailing dimensions and replicates dimensions of size 1.'
          },
          practiceChallenge: {
            prompt: 'Write a snippet that creates a 3x3 identity matrix, scales it by 5, and adds 2 to every element.',
            starterCode: 'import numpy as np\n# Your code here',
            solutionHint: 'Use np.eye(3) * 5 + 2.',
            solutionCode: 'import numpy as np\nmatrix = np.eye(3) * 5 + 2\nprint(matrix)'
          },
          relatedMissionId: 'm-04'
        },
        {
          id: 'py-l9-pandas',
          title: 'Pandas DataFrames & Analysis',
          description: 'Loading CSVs, handling null values, group-by aggregations, and feature engineering.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Inspect, query, filter, and summarize structured tabular datasets for model consumption.',
          explanation: 'Pandas provides DataFrames—two-dimensional labeled tabular data structures with intuitive indexing and built-in missing value handling.',
          importantConcepts: [
            'DataFrame & Series: 2D table and 1D column primitives.',
            'Indexing (.loc & .iloc): Label-based and integer-based slicing.',
            'Missing Data Handling: df.dropna() and df.fillna().'
          ],
          keyPoints: [
            'Always inspect shape, dtypes, and null counts (df.info(), df.describe()).',
            'Avoid iterating over rows with iterrows(); use vectorized column operations.'
          ],
          codeExample: {
            language: 'python',
            code: `import pandas as pd\n\ndata = {\n    "age": [25, 32, None, 45, 29],\n    "income": [50000, 72000, 61000, 110000, 58000],\n    "purchased": [0, 1, 0, 1, 0]\n}\ndf = pd.DataFrame(data)\n\n# Impute missing age with median\ndf["age"] = df["age"].fillna(df["age"].median())\nprint(df.describe().round(1))`,
            explanation: 'Cleaning null values and generating summary statistics on a DataFrame.',
            output: '        age    income  purchased\nmean   31.4   70200.0        0.4\nstd     8.3   23815.9        0.5\nmin    25.0   50000.0        0.0'
          },
          practicalExample: {
            title: 'Grouping by Class',
            scenario: 'Find average revenue per user tier (Free, Pro, Enterprise).',
            solution: 'df.groupby("tier")["revenue"].mean()'
          },
          quiz: {
            question: 'Which Pandas method gives integer-position based indexing rather than label indexing?',
            options: ['.loc', '.iloc', '.at', '.ix'],
            correctIndex: 1,
            explanation: '.iloc uses zero-based integer index locations, whereas .loc queries by index labels.'
          },
          practiceChallenge: {
            prompt: 'Given a DataFrame df with columns "temp" and "humidity", filter for rows where temp > 30 and humidity < 50.',
            starterCode: 'import pandas as pd\n# query here',
            solutionHint: 'Use boolean masking with & operator: df[(df["temp"] > 30) & (df["humidity"] < 50)].',
            solutionCode: 'filtered = df[(df["temp"] > 30) & (df["humidity"] < 50)]'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'py-m4',
      moduleNumber: 4,
      title: 'Python for Machine Learning',
      description: 'Feature scaling, train-test splitting, categorical encoding, and training pipelines with Scikit-Learn.',
      difficulty: 'Intermediate',
      estimatedMinutes: 140,
      xpReward: 250,
      lessons: [
        {
          id: 'py-l10-sklearn-prep',
          title: 'Data Preparation & Preprocessing',
          description: 'StandardScaler, OneHotEncoder, and train_test_split to avoid data leakage.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Transform raw heterogenous data into clean numerical training matrices.',
          explanation: 'Real-world data is messy, contains categorical strings, and operates across widely differing scales. Preprocessing transforms these attributes without leaking test set statistics into the training fold.',
          importantConcepts: [
            'Data Leakage: Fitting scalers on test data invalidates validation accuracy.',
            'Standardization: Rescaling features to zero mean and unit variance.',
            'One-Hot Encoding: Transforming nominal categories into binary indicator vectors.'
          ],
          keyPoints: [
            'Always call fit_transform() on train data, but only transform() on test data.',
            'Split data before any imputation or scaling calculations.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\n\nX = np.array([[10, 200], [20, 400], [30, 600], [40, 800]])\ny = np.array([0, 0, 1, 1])\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)\nscaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)\n\nprint("Scaled Train:\\n", X_train_scaled.round(2))`,
            explanation: 'Standard scaling following train-test separation to preserve isolation.',
            output: 'Scaled Train:\n [[-1. -1.]\n  [ 1.  1.]]'
          },
          practicalExample: {
            title: 'Handling Categorical Labels',
            scenario: 'Convert country codes ["US", "DE", "JP"] into one-hot binary columns.',
            solution: 'from sklearn.preprocessing import OneHotEncoder\nencoder = OneHotEncoder(sparse_output=False)\nencoded = encoder.fit_transform(countries)'
          },
          quiz: {
            question: 'Why should you never call fit() or fit_transform() on the testing dataset?',
            options: [
              'It causes a crash in scikit-learn',
              'It introduces data leakage by using test distribution statistics',
              'Test data cannot be scaled',
              'It slows down inference'
            ],
            correctIndex: 1,
            explanation: 'Calling fit() on test data leaks test distribution info into your model pipeline, causing overly optimistic results.'
          },
          practiceChallenge: {
            prompt: 'Write the code to split features X and labels y into 80% train and 20% test with random_state=42.',
            starterCode: 'from sklearn.model_selection import train_test_split\n# your code',
            solutionHint: 'Use test_size=0.2 and random_state=42.',
            solutionCode: 'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'py-m5',
      moduleNumber: 5,
      title: 'AI Project — Predictive Analytics Engine',
      description: 'End-to-end milestone: build, evaluate, and package a production-grade Python inference script.',
      difficulty: 'Intermediate',
      estimatedMinutes: 160,
      xpReward: 350,
      project: {
        title: 'Neural Classifier Pipeline',
        description: 'Construct a self-contained Python module that loads real-world customer telemetry, trains a classifier, logs evaluation metrics, and performs live sample inferences.',
        xpReward: 350
      },
      bossBattle: {
        bossId: 'boss-ml',
        bossName: 'The Overfitting Titan',
        xpReward: 500
      },
      lessons: [
        {
          id: 'py-l11-capstone',
          title: 'Building the End-to-End Pipeline',
          description: 'Assembling dataset loader, model trainer, metrics calculator, and serialized inference handler.',
          estimatedMinutes: 35,
          xpReward: 25,
          learningObjective: 'Integrate Python OOP, NumPy matrices, and Scikit-Learn into an inference class.',
          explanation: 'Production AI is not just notebooks; it is modular Python code organized into classes with automated testing, error handling, and clean CLI arguments.',
          importantConcepts: [
            'Pipeline Abstraction: Packaging scaling and modeling into a single scikit-learn Pipeline.',
            'Serialization: Saving trained model weights using joblib.',
            'Inference Interface: Exposing a .predict() method with input validation.'
          ],
          keyPoints: [
            'Always validate incoming inference shapes before feeding to the model.',
            'Keep data preprocessing logic versioned alongside model weights.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nimport numpy as np\n\npipeline = Pipeline([\n    ('scaler', StandardScaler()),\n    ('classifier', LogisticRegression())\n])\n\nX_mock = np.array([[1.2, 3.4], [0.8, 1.2], [3.1, 4.5], [2.8, 3.9]])\ny_mock = np.array([0, 0, 1, 1])\n\npipeline.fit(X_mock, y_mock)\nprediction = pipeline.predict([[2.5, 3.8]])\nprint("Inference Result:", "Positive" if prediction[0] == 1 else "Negative")`,
            explanation: 'Production Pipeline executing both scaling and logistic regression in unified steps.',
            output: 'Inference Result: Positive'
          },
          practicalExample: {
            title: 'Model Persistence',
            scenario: 'Save trained model pipeline to disk and reload it for zero-overhead inference.',
            solution: 'import joblib\njoblib.dump(pipeline, "model.pkl")\nloaded = joblib.load("model.pkl")'
          },
          quiz: {
            question: 'What is the main benefit of Scikit-Learn Pipeline objects?',
            options: [
              'They automatically deploy to Kubernetes',
              'They ensure identical transformation steps are applied to both train and test data automatically',
              'They replace NumPy with PyTorch',
              'They eliminate the need for labeled data'
            ],
            correctIndex: 1,
            explanation: 'Pipelines encapsulate feature transformers and estimators, preventing data leakage and ensuring consistency.'
          },
          practiceChallenge: {
            prompt: 'Complete the Python for AI milestone by inspecting your code pipeline and preparing for the Machine Learning world.',
            starterCode: '# Review and verify your Python mastery',
            solutionHint: 'Confirm all concepts learned across variables, lists, NumPy, and pipelines.',
            solutionCode: 'print("Python for AI Core Complete! Ready for Machine Learning.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
