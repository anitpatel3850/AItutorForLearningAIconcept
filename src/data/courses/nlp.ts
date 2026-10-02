import { Course } from './types';

export const nlpCourse: Course = {
  id: 'nlp',
  title: 'Natural Language Processing',
  shortDescription: 'Master the science of computational linguistics: tokenization, semantic embeddings (Word2Vec), sequence models, and BERT/RoBERTa transformers.',
  description: 'Bridge the chasm between human semantics and machine understanding. Journey from regular expression parsers and TF-IDF matrices to continuous vector spaces (Word2Vec, GloVe), bidirectional transformers (BERT), and sentiment classification engines.',
  iconName: 'MessageSquare',
  level: 'Intermediate',
  category: 'Specialized AI',
  estimatedHours: 24,
  badge: 'Linguistic Sage',
  accentColor: 'amber',
  whatYouWillLearn: [
    'Clean, normalize, stem, lemmatize, and tokenize natural language text',
    'Calculate TF-IDF (Term Frequency-Inverse Document Frequency) sparse vectors',
    'Train continuous semantic word embeddings with Word2Vec (Skip-Gram & CBOW)',
    'Construct bidirectional LSTM sequence taggers for Named Entity Recognition (NER)',
    'Fine-tune BERT and RoBERTa for text classification, question answering, and sentiment analysis',
    'Evaluate NLP models using BLEU, ROUGE, and Perplexity metrics',
    'Build an enterprise text search and semantic document similarity engine'
  ],
  prerequisites: [
    'Python programming & basic string operations',
    'Understanding of neural networks and gradient descent'
  ],
  skillsYouWillGain: [
    'NLTK, spaCy & Hugging Face Transformers',
    'BPE & WordPiece Tokenization',
    'Word2Vec & Dense Vector Semantics',
    'BERT Fine-Tuning & Masked Language Modeling',
    'Information Retrieval & Cosine Similarity'
  ],
  completionRequirements: [
    'Complete all 7 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Build and evaluate the NLP capstone classifier'
  ],
  modules: [
    {
      id: 'nlp-m1',
      moduleNumber: 1,
      title: 'NLP Foundations & Text Preprocessing',
      description: 'Unicode handling, regex pattern matching, tokenization, stop-word removal, stemming, and lemmatization.',
      difficulty: 'Beginner',
      estimatedMinutes: 80,
      xpReward: 200,
      lessons: [
        {
          id: 'nlp-l1-tokenization',
          title: 'Text Normalization & Tokenization',
          description: 'Splitting raw character streams into meaningful tokens: word, subword (BPE), and character level.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Compare whitespace, rule-based, and subword (Byte-Pair Encoding) tokenizers.',
          explanation: 'Computers cannot read text as letters; they require numerical tokens. While splitting on whitespace is naive (failing on "can\'t", punctuation, and out-of-vocabulary words), modern LLMs use Byte-Pair Encoding (BPE) to represent any word via subword pieces.',
          importantConcepts: [
            'Tokenization: Converting raw text into sequence of discrete integer token IDs.',
            'Stemming vs Lemmatization: Stemming heuristically chops prefixes/suffixes (e.g. "studying" -> "studi"); Lemmatization maps words to dictionary roots (e.g. "better" -> "good").',
            'Subword Tokenization (BPE/WordPiece): Deconstructing rare words into frequent subword units, avoiding unknown tokens.'
          ],
          keyPoints: [
            'Always normalize case (lowercasing) unless casing carries key semantic meaning (like NER acronyms).',
            'Modern transformer tokenizers (WordPiece, BPE) never produce unknown token errors on standard UTF-8.'
          ],
          codeExample: {
            language: 'python',
            code: `raw_text = "AI Quest explorers don't fear complex transformers!"\n# Simple tokenization demo\ntokens = raw_text.lower().replace("!", "").split()\nprint("Extracted Tokens:", tokens)`,
            explanation: 'Basic lowercased word tokenization in Python.',
            output: "Extracted Tokens: ['ai', 'quest', 'explorers', \"don't\", 'fear', 'complex', 'transformers']"
          },
          practicalExample: {
            title: 'Subword Decomposition',
            scenario: 'How does a subword tokenizer handle the out-of-vocabulary word "neuroplasticity"?',
            solution: 'It segments the word into familiar pieces: ["neuro", "##plastic", "##ity"].'
          },
          quiz: {
            question: 'What is the primary advantage of subword tokenization (BPE) over strict word-level tokenization?',
            options: [
              'It makes files smaller on disk',
              'It solves the Out-Of-Vocabulary (OOV) problem while keeping vocabulary size manageable',
              'It eliminates the need for neural networks',
              'It automatically translates languages'
            ],
            correctIndex: 1,
            explanation: 'Subwords allow unknown or rare words to be decomposed into recognized morphemes and sub-tokens.'
          },
          practiceChallenge: {
            prompt: 'Write a list comprehension that strips leading/trailing whitespace and filters out words with length < 2.',
            starterCode: 'words = [" a ", " neural ", " ", "net", "I"]\n# cleaned = ?',
            solutionHint: 'Use w.strip() and len(w) >= 2 condition.',
            solutionCode: 'words = [" a ", " neural ", " ", "net", "I"]\ncleaned = [w.strip() for w in words if len(w.strip()) >= 2]\nprint(cleaned)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'nlp-m2',
      moduleNumber: 2,
      title: 'Statistical Text Representation (BoW & TF-IDF)',
      description: 'Bag of Words, term frequency, inverse document frequency, n-grams, and sparse document vectors.',
      difficulty: 'Beginner',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'nlp-l2-tfidf',
          title: 'Bag of Words & TF-IDF Weighting',
          description: 'Quantifying document keyword importance while downweighting universally frequent words like "the" and "is".',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Compute TF-IDF vectors and calculate Cosine Similarity between document queries.',
          explanation: 'Raw word counts favor lengthy documents and common words. TF-IDF balances Term Frequency (how often a word appears in a specific doc) with Inverse Document Frequency (penalizing words that appear across all documents).',
          importantConcepts: [
            'Term Frequency (TF): Count(t, d) / Total Words in d.',
            'Inverse Document Frequency (IDF): log(Total Docs / Docs Containing t).',
            'Cosine Similarity: Dot product of normalized vectors measuring angular distance in semantic space.'
          ],
          keyPoints: [
            'TF-IDF produces sparse vectors where most dimensions are zero.',
            'N-grams (bi-grams, tri-grams) preserve local word ordering like "not good" vs "good".'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.feature_extraction.text import TfidfVectorizer\n\ncorpus = [\n    "Artificial Intelligence revolutionizes software",\n    "Deep neural networks power modern Artificial Intelligence",\n    "Cooking recipes and culinary arts"\n]\n\nvectorizer = TfidfVectorizer()\ntfidf_matrix = vectorizer.fit_transform(corpus)\nprint("Feature Names:", vectorizer.get_feature_names_out()[:4])\nprint("TF-IDF Shape:", tfidf_matrix.shape)`,
            explanation: 'Fitting TF-IDF sparse document vectorizer on a 3-document corpus.',
            output: "Feature Names: ['and' 'artificial' 'arts' 'cooking']\nTF-IDF Shape: (3, 11)"
          },
          practicalExample: {
            title: 'Search Engine Retrieval',
            scenario: 'Find the most relevant document for query "neural network".',
            solution: 'Compute cosine similarity between tfidf(query) and tfidf(documents); return highest score.'
          },
          quiz: {
            question: 'If a word appears in literally every single document in a corpus of 1,000,000 articles, what will its IDF value be approximately?',
            options: ['1,000,000', '0.0', '1.0', 'Infinity'],
            correctIndex: 1,
            explanation: 'IDF is log(N / DF). Since N = DF, log(1) = 0.0. The word receives zero discriminative weight.'
          },
          practiceChallenge: {
            prompt: 'Given two identical unit vectors, what is their Cosine Similarity?',
            starterCode: '# similarity = ?',
            solutionHint: 'Cosine of 0 degrees angle is 1.0.',
            solutionCode: 'similarity = 1.0\nprint(f"Similarity: {similarity}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'nlp-m3',
      moduleNumber: 3,
      title: 'Dense Word Embeddings (Word2Vec & GloVe)',
      description: 'Distributed representations, Skip-Gram, Continuous Bag of Words (CBOW), and vector arithmetic (King - Man + Woman = Queen).',
      difficulty: 'Intermediate',
      estimatedMinutes: 100,
      xpReward: 200,
      lessons: [
        {
          id: 'nlp-l3-word2vec',
          title: 'Distributed Vector Semantics & Word2Vec',
          description: 'Mapping words into continuous 300-dimensional vector spaces where similar concepts cluster together.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Explain the distributional hypothesis and perform semantic vector arithmetic.',
          explanation: '"You shall know a word by the company it keeps" (J.R. Firth). Word2Vec trains a shallow 2-layer neural network to predict surrounding context words from a center word (Skip-Gram) or vice versa (CBOW).',
          importantConcepts: [
            'Dense vs Sparse: Embeddings compress vocabulary into 100-300 dense floating-point dimensions.',
            'Vector Arithmetic: Semantic analogies encoded geometrically: vec("King") - vec("Man") + vec("Woman") ≈ vec("Queen").',
            'Negative Sampling: Efficient training trick turning multi-class prediction into binary logistic regression.'
          ],
          keyPoints: [
            'Word2Vec produces static embeddings (the word "apple" has the exact same vector whether discussing fruit or computers).',
            'Cosine distance in embedding space accurately reflects human semantic similarity judgments.'
          ],
          codeExample: {
            language: 'python',
            code: `# Conceptual Word2Vec Vector Arithmetic in NumPy\nimport numpy as np\n\n# Mock 4-dimensional embeddings\nking = np.array([0.9, 0.2, 0.8, 0.1])\nman = np.array([0.8, 0.2, 0.1, 0.1])\nwoman = np.array([0.1, 0.9, 0.1, 0.1])\n\n# Analogy: King - Man + Woman\nqueen_approx = king - man + woman\nprint("Computed Queen Vector Approx:", queen_approx.round(2))`,
            explanation: 'Semantic vector arithmetic producing relational gender vectors.',
            output: 'Computed Queen Vector Approx: [0.2 0.9 0.8 0.1]'
          },
          practicalExample: {
            title: 'Synonym Suggestion',
            scenario: 'Find nearest semantic neighbors for "optimizing".',
            solution: 'Query embedding matrix for top K highest cosine similarity vector dots.'
          },
          quiz: {
            question: 'What is the primary limitation of static embeddings like Word2Vec and GloVe?',
            options: [
              'They cannot run on CPUs',
              'They cannot handle polysemy (words with multiple meanings depending on context, like "bank")',
              'They produce imaginary numbers',
              'They require labeled training targets'
            ],
            correctIndex: 1,
            explanation: 'Static embeddings assign a single fixed vector per vocabulary word, unable to adapt to differing sentence contexts.'
          },
          practiceChallenge: {
            prompt: 'Calculate the Euclidean norm (length) of a unit vector [0.6, 0.8].',
            starterCode: 'v = [0.6, 0.8]\n# norm = ?',
            solutionHint: 'sqrt(0.6^2 + 0.8^2) = sqrt(0.36 + 0.64) = 1.0',
            solutionCode: 'norm = (0.6**2 + 0.8**2)**0.5\nprint(f"Norm: {norm}") # 1.0'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'nlp-m4',
      moduleNumber: 4,
      title: 'Contextual Embeddings & Transformers (BERT)',
      description: 'Bidirectional Encoder Representations from Transformers (BERT), Masked Language Modeling (MLM), and Next Sentence Prediction.',
      difficulty: 'Advanced',
      estimatedMinutes: 140,
      xpReward: 250,
      lessons: [
        {
          id: 'nlp-l4-bert',
          title: 'BERT & Bidirectional Contextual Representations',
          description: 'Understanding how transformer self-attention creates dynamic word embeddings tailored to surrounding sentence context.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Fine-tune a pretrained BERT encoder for sentiment and spam classification.',
          explanation: 'BERT pretrains a transformer encoder on two tasks: Masked LM (guessing hidden words: "The [MASK] sat on the mat") and Next Sentence Prediction. Unlike prior left-to-right models, BERT reads left and right simultaneously.',
          importantConcepts: [
            '[CLS] Token: Special prepended token whose final hidden state serves as the aggregate sequence classification vector.',
            '[SEP] Token: Separates pairs of input sentences.',
            'Masked Language Model (MLM): Randomly masking 15% of tokens to force deep bidirectional representation learning.'
          ],
          keyPoints: [
            'BERT is an Encoder-only model (ideal for understanding/classification, not generation).',
            'RoBERTa improves BERT by removing Next Sentence Prediction and training on 10x more data with dynamic masking.'
          ],
          codeExample: {
            language: 'python',
            code: `# Hugging Face Transformers Pipeline Execution:\n# from transformers import pipeline\n# classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")\n# result = classifier("AI Quest makes machine learning engaging and fun!")\nprint("[{'label': 'POSITIVE', 'score': 0.9998}]")`,
            explanation: 'Running inference with a fine-tuned DistilBERT sentiment model.',
            output: "[{'label': 'POSITIVE', 'score': 0.9998}]"
          },
          practicalExample: {
            title: 'Customer Review Sentiment Tagger',
            scenario: 'Classify incoming app store reviews into 1-star to 5-star categories automatically.',
            solution: 'Fine-tune bert-base-uncased with a 5-unit Softmax classification head.'
          },
          quiz: {
            question: 'In BERT models, what is the role of the special first token [CLS]?',
            options: [
              'It clears the GPU memory cache',
              'Its final hidden representation is pooled to represent the classification embedding for the entire sequence',
              'It specifies the language code',
              'It indicates the end of the text file'
            ],
            correctIndex: 1,
            explanation: 'The [CLS] token embedding pools contextual attention across all tokens, serving as the input to downstream classifier heads.'
          },
          practiceChallenge: {
            prompt: 'In a masked language model, if 15% of tokens are masked in a 200-word paragraph, approximately how many tokens are masked?',
            starterCode: 'total = 200\n# masked_count = ?',
            solutionHint: '200 * 0.15',
            solutionCode: 'masked_count = int(200 * 0.15)\nprint(f"Masked: {masked_count}") # 30'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'nlp-m5',
      moduleNumber: 5,
      title: 'NLP Sequence Tagging: Named Entity Recognition (NER)',
      description: 'Token classification, BIO tagging schemes (Begin, Inside, Outside), and extracting entities (Names, Orgs, Locations).',
      difficulty: 'Intermediate',
      estimatedMinutes: 110,
      xpReward: 200,
      lessons: [
        {
          id: 'nlp-l5-ner',
          title: 'Named Entity Recognition & BIO Tagging',
          description: 'Labeling individual tokens with semantic entity categories like B-PER, I-PER, B-ORG, O.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Extract organizations, names, locations, and dates from unstructured corporate documents.',
          explanation: 'Information extraction turns free text into structured database entries. Named Entity Recognition assigns an entity tag to each token using BIO annotation scheme.',
          importantConcepts: [
            'B-Tag: Beginning of a multi-token entity (e.g. B-ORG for "Google").',
            'I-Tag: Continuation inside an entity (e.g. I-ORG for "DeepMind").',
            'O-Tag: Outside of any named entity.'
          ],
          keyPoints: [
            'BIO schemes prevent adjacent separate entities from merging.',
            'spaCy provides highly optimized industrial NER models running in under 2ms per document.'
          ],
          codeExample: {
            language: 'python',
            code: `# Text: "Alex visited DeepMind in London"\n# Tokens: ["Alex", "visited", "DeepMind", "in", "London"]\n# Tags:   ["B-PER", "O",       "B-ORG",    "O",  "B-LOC"]\nprint("Entity Extraction verified: Alex (PER), DeepMind (ORG), London (LOC)")`,
            explanation: 'Token-by-token BIO sequence tagging illustration.',
            output: 'Entity Extraction verified: Alex (PER), DeepMind (ORG), London (LOC)'
          },
          practicalExample: {
            title: 'Medical Prescription Parsing',
            scenario: 'Extract medication name, dosage, and frequency from clinical notes.',
            solution: 'Train custom NER model with tags B-DRUG, B-DOSAGE, B-FREQ.'
          },
          quiz: {
            question: 'In BIO tagging, why do we need both B-PER and I-PER tags?',
            options: [
              'To support both uppercase and lowercase names',
              'To distinguish between two consecutive distinct names and a single multi-word name',
              'To speed up GPU training',
              'To handle international languages'
            ],
            correctIndex: 1,
            explanation: 'If two people "John Mary" are listed side by side, B-PER B-PER indicates two people, whereas B-PER I-PER indicates one person named John Mary.'
          },
          practiceChallenge: {
            prompt: 'Label the phrase "New York City" under BIO tagging for entity type LOC.',
            starterCode: '# Tokens: ["New", "York", "City"]',
            solutionHint: 'First word is B-LOC; following words are I-LOC.',
            solutionCode: 'tags = ["B-LOC", "I-LOC", "I-LOC"]\nprint(tags)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'nlp-m6',
      moduleNumber: 6,
      title: 'Text Generation & Decoder Models (GPT)',
      description: 'Autoregressive language modeling, Causal masking, Temperature sampling, Top-K, Top-P (Nucleus), and Hallucinations.',
      difficulty: 'Advanced',
      estimatedMinutes: 130,
      xpReward: 250,
      lessons: [
        {
          id: 'nlp-l6-generation',
          title: 'Autoregressive Decoding & Sampling Strategies',
          description: 'Controlling creativity vs determinism: Greedy search, Beam search, Temperature, Top-K, and Nucleus sampling.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Configure decoding hyperparameters to balance factual coherence and stylistic diversity.',
          explanation: 'Decoder LLMs generate text token by token. At each step, the model computes probabilities over the vocabulary. Decoding strategies determine how we sample the next token from this probability distribution.',
          importantConcepts: [
            'Greedy Decoding: Always picking highest probability token (argmax), frequently leading to repetitive loops.',
            'Temperature: Dividing logits by T before Softmax (T < 1.0 sharpens distribution towards deterministic; T > 1.0 flattens for creativity).',
            'Top-P (Nucleus) Sampling: Restricting selection to the smallest cumulative probability set exceeding P (e.g. 0.90).'
          ],
          keyPoints: [
            'Use low temperature (0.0 to 0.2) for code generation and factual extraction.',
            'Use moderate temperature (0.7 to 0.8) and Top-P (0.9) for creative writing and brainstorming.'
          ],
          codeExample: {
            language: 'python',
            code: `import numpy as np\n\ndef sample_with_temperature(logits, temperature=0.7):\n    scaled_logits = logits / temperature\n    exp_logits = np.exp(scaled_logits - np.max(scaled_logits))\n    probs = exp_logits / np.sum(exp_logits)\n    return probs\n\nraw_logits = np.array([3.0, 2.0, 0.5])\nprint("Sharp (T=0.2):", sample_with_temperature(raw_logits, 0.2).round(3))\nprint("Soft  (T=1.5):", sample_with_temperature(raw_logits, 1.5).round(3))`,
            explanation: 'Temperature scaling effect on token probability distributions.',
            output: 'Sharp (T=0.2): [0.993 0.007 0.   ]\nSoft  (T=1.5): [0.551 0.283 0.166]'
          },
          practicalExample: {
            title: 'Repetitive Loop Mitigation',
            scenario: 'An LLM gets stuck repeating "very very very very very". How to fix?',
            solution: 'Apply frequency and presence penalties, or enable Top-P nucleus sampling with temperature 0.7.'
          },
          quiz: {
            question: 'What happens to the next-token probability distribution as Temperature approaches 0.0?',
            options: [
              'All words become equally likely (uniform distribution)',
              'It collapses completely into greedy argmax selection (probability of top token approaches 1.0)',
              'Tokens are selected in reverse alphabetical order',
              'The model refuses to generate any tokens'
            ],
            correctIndex: 1,
            explanation: 'Dividing by numbers approaching zero exaggerates the difference between the highest logit and all others.'
          },
          practiceChallenge: {
            prompt: 'In Top-K sampling with K = 50, how many candidate tokens are considered at each generation step?',
            starterCode: 'k = 50\n# candidates = ?',
            solutionHint: 'Exactly the top K highest probability tokens.',
            solutionCode: 'candidates = 50\nprint(f"Top {candidates} tokens considered.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'nlp-m7',
      moduleNumber: 7,
      title: 'NLP Capstone Project — Semantic Search Engine',
      description: 'Construct a dense vector retrieval and semantic question-answering pipeline using sentence transformers.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Neural Semantic Search Engine',
        description: 'Index a large corpus of technical documentation with sentence embeddings and build a sub-50ms semantic search interface.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'nlp-l7-capstone',
          title: 'Dense Retrieval & Vector Databases',
          description: 'Embedding documents with MiniLM, cosine similarity indexing, and building semantic search APIs.',
          estimatedMinutes: 30,
          xpReward: 25,
          learningObjective: 'Implement dense vector retrieval to find relevant documents without exact keyword matches.',
          explanation: 'Keyword search fails when users search for synonyms (e.g. searching "automobile malfunction" fails to match a document titled "Car Engine Breakdown"). Dense vector search maps queries and documents into a shared semantic latent space.',
          importantConcepts: [
            'Bi-Encoder Architecture: Encoding query and document independently into dense vector space.',
            'Vector Index: Fast Approximate Nearest Neighbor (ANN) index like HNSW.',
            'Re-Ranking: Cross-Encoder passing query and top 10 candidates simultaneously for high-precision ordering.'
          ],
          keyPoints: [
            'Always normalize embeddings to unit length (L2 norm = 1.0) so dot product equals cosine similarity.',
            'Combine keyword search (BM25) and dense embeddings (Hybrid Search) for the highest retrieval accuracy.'
          ],
          codeExample: {
            language: 'python',
            code: `# Semantic Search Querying Pattern:\n# query_embedding = embed_model.encode("How to train neural networks?")\n# similarities = np.dot(doc_embeddings, query_embedding)\n# top_result_idx = np.argmax(similarities)\nprint("Semantic match found: Document #42 (Score: 0.892)")`,
            explanation: 'Dense vector retrieval utilizing dot products on normalized embeddings.',
            output: 'Semantic match found: Document #42 (Score: 0.892)'
          },
          practicalExample: {
            title: 'Customer FAQ Semantic Matcher',
            scenario: 'Match varied customer inquiries to canonical policy answers regardless of wording.',
            solution: 'Pre-compute canonical FAQ vectors; match live queries via cosine similarity threshold > 0.82.'
          },
          quiz: {
            question: 'Why does dense vector search succeed where classical keyword search fails?',
            options: [
              'It uses fewer CPU cycles',
              'It matches the underlying semantic meaning and intent rather than requiring exact lexical string matches',
              'It stores text as compressed ZIP archives',
              'It ignores all adjectives'
            ],
            correctIndex: 1,
            explanation: 'Dense embeddings map synonyms, paraphrases, and related concepts into nearby spatial coordinates.'
          },
          practiceChallenge: {
            prompt: 'Complete your NLP journey and prepare for Generative AI & Large Language Models!',
            starterCode: '# Review complete NLP curriculum',
            solutionHint: 'Confirm mastery from tokenization and TF-IDF through Word2Vec, BERT, and dense retrieval.',
            solutionCode: 'print("Natural Language Processing Mastered! Ready for Generative AI.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
