import { Course } from './types';

export const artificialIntelligenceCourse: Course = {
  id: 'artificial-intelligence',
  title: 'Artificial Intelligence',
  shortDescription: 'The broad universe of intelligent systems: state space search, knowledge graphs, propositional logic, game theory, and autonomous multi-agent cognition.',
  description: 'Embark on the foundational journey of synthetic intelligence. Explore state space search (A*, Minimax), propositional logic and reasoning systems, probabilistic decision networks, and the transition into modern autonomous AI agents.',
  iconName: 'Compass',
  level: 'Beginner',
  category: 'Core Foundations',
  estimatedHours: 24,
  badge: 'Intelligence Pioneer',
  accentColor: 'purple',
  whatYouWillLearn: [
    'Understand the philosophical and technical evolution of AI from Turing tests to AGI',
    'Implement uninformed and heuristic search algorithms (BFS, DFS, A*, Greedy Best-First)',
    'Build adversarial game playing engines using Minimax and Alpha-Beta pruning',
    'Model expert logic using propositional and first-order predicate calculus',
    'Construct probabilistic knowledge networks using Bayesian belief graphs',
    'Analyze reinforcement learning Markov Decision Processes (MDPs)',
    'Design and deploy an intelligent decision-making agent'
  ],
  prerequisites: [
    'Basic Python programming',
    'Introductory logic & graph theory basics'
  ],
  skillsYouWillGain: [
    'State Space Search & A* Heuristics',
    'Game Theory & Minimax Alpha-Beta',
    'Propositional Logic & Knowledge Graphs',
    'Bayesian Networks & Probabilistic Reasoning',
    'Markov Decision Processes (MDPs)'
  ],
  completionRequirements: [
    'Complete all 8 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Deliver the Autonomous AI Capstone Project'
  ],
  modules: [
    {
      id: 'ai-m1',
      moduleNumber: 1,
      title: 'AI Foundations & Intelligent Agents',
      description: 'The Turing Test, rational agent architectures, PEAS (Performance, Environment, Actuators, Sensors), and environment types.',
      difficulty: 'Beginner',
      estimatedMinutes: 80,
      xpReward: 200,
      lessons: [
        {
          id: 'ai-l1-agents',
          title: 'Intelligent Agents & PEAS Framework',
          description: 'Defining agent rational behavior: reflex agents, goal-based agents, and utility-based agents.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Formulate PEAS descriptions and classify environment observability and determinism.',
          explanation: 'An AI agent perceives its environment through sensors and acts upon it through actuators. Rational agents select actions that maximize their expected performance metric based on their percept sequence and built-in knowledge.',
          importantConcepts: [
            'PEAS Framework: Performance measure, Environment, Actuators, Sensors.',
            'Environment Dimensions: Fully vs Partially Observable, Deterministic vs Stochastic, Static vs Dynamic, Discrete vs Continuous.',
            'Agent Types: Simple reflex, model-based reflex, goal-based, and utility-maximizing agents.'
          ],
          keyPoints: [
            'Rationality is not omniscience; an agent maximizes expected success given what it knows.',
            'Most real-world AI problems are partially observable, stochastic, and multi-agent.'
          ],
          codeExample: {
            language: 'python',
            code: `# PEAS Specification for an Autonomous Taxi Agent:\nautonomous_taxi_peas = {\n    "Performance": "Safety, speed, legal adherence, passenger comfort, profits",\n    "Environment": "Roads, traffic, pedestrians, weather, signals",\n    "Actuators": "Steering wheel, accelerator, brakes, horn, display",\n    "Sensors": "LiDAR, cameras, sonar, GPS, speedometer, accelerometer"\n}\nfor key, val in autonomous_taxi_peas.items():\n    print(f"[{key}]: {val}")`,
            explanation: 'Deconstructing a complex real-world agent into the PEAS framework.',
            output: '[Performance]: Safety, speed, legal adherence, passenger comfort, profits\n[Environment]: Roads, traffic, pedestrians, weather, signals\n[Actuators]: Steering wheel, accelerator, brakes, horn, display\n[Sensors]: LiDAR, cameras, sonar, GPS, speedometer, accelerometer'
          },
          practicalExample: {
            title: 'Environment Classification for Chess',
            scenario: 'Classify the game of Chess across the core environment dimensions.',
            solution: 'Fully Observable, Deterministic, Turn-based (Static between moves), Discrete, Multi-agent (adversarial).'
          },
          quiz: {
            question: 'What does the "P" stand for in the PEAS agent design framework?',
            options: ['Program', 'Performance Measure', 'Perceptron', 'Processor'],
            correctIndex: 1,
            explanation: 'P stands for Performance Measure: the criterion used to evaluate how successfully an agent achieves its goals.'
          },
          practiceChallenge: {
            prompt: 'Is a medical diagnosis system operating in a Fully Observable or Partially Observable environment?',
            starterCode: '# answer = ""',
            solutionHint: 'A doctor cannot see every internal cell and symptom directly without testing.',
            solutionCode: 'answer = "Partially Observable"\nprint(answer)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m2',
      moduleNumber: 2,
      title: 'Search Algorithms & State Spaces',
      description: 'Uninformed search (BFS, DFS, Uniform Cost Search) and Informed Heuristic Search (A*, Greedy Best-First).',
      difficulty: 'Intermediate',
      estimatedMinutes: 110,
      xpReward: 250,
      lessons: [
        {
          id: 'ai-l2-astar-search',
          title: 'A* Search & Admissible Heuristics',
          description: 'Evaluating path cost g(n) plus heuristic estimate h(n): f(n) = g(n) + h(n) for optimal pathfinding.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Implement A* search and verify heuristic admissibility for guaranteed shortest path optimality.',
          explanation: 'A* search combines the guaranteed optimality of Dijkstra\'s algorithm with the speed of greedy search. It evaluates nodes using f(n) = g(n) + h(n), where g(n) is the cost to reach node n and h(n) is the estimated cost from n to the goal.',
          importantConcepts: [
            'Admissible Heuristic: Never overestimates the true cost to reach the goal (h(n) <= h*(n)).',
            'Consistent (Monotonic) Heuristic: Satisfies triangle inequality (h(n) <= c(n, a, n\') + h(n\')).',
            'Manhattan vs Euclidean Distance: Standard geometric distance heuristics for grid pathfinding.'
          ],
          keyPoints: [
            'If h(n) is admissible, tree-search A* is guaranteed to find the optimal shortest path.',
            'If h(n) = 0 everywhere, A* degrades into Dijkstra\'s algorithm.'
          ],
          codeExample: {
            language: 'python',
            code: `import heapq\n\ndef manhattan_distance(p1, p2):\n    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])\n\nstart = (0, 0)\ngoal = (5, 5)\nh_cost = manhattan_distance(start, goal)\nprint(f"Manhattan Heuristic h(start -> goal): {h_cost} steps")`,
            explanation: 'Calculating admissible Manhattan distance heuristic on a 2D coordinate grid.',
            output: 'Manhattan Heuristic h(start -> goal): 10 steps'
          },
          practicalExample: {
            title: 'GPS Navigation Routing',
            scenario: 'Find fastest road route from New York to Boston.',
            solution: 'A* search using straight-line Euclidean distance divided by max speed limit as an admissible heuristic.'
          },
          quiz: {
            question: 'What is required of a heuristic function h(n) for A* search to guarantee finding the optimal shortest path?',
            options: [
              'It must always equal zero',
              'It must be admissible (never overestimate the remaining cost to the goal)',
              'It must run in O(1) time on a GPU',
              'It must return negative numbers'
            ],
            correctIndex: 1,
            explanation: 'Admissibility guarantees that A* will never overlook an optimal path due to an inflated heuristic estimate.'
          },
          practiceChallenge: {
            prompt: 'Calculate f(n) if the cost to reach node n is g(n) = 14 and the estimated heuristic cost to goal is h(n) = 9.',
            starterCode: 'g = 14; h = 9\n# f = ?',
            solutionHint: 'f = g + h',
            solutionCode: 'f = 14 + 9\nprint(f"Total evaluated cost f(n): {f}") # 23'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m3',
      moduleNumber: 3,
      title: 'Adversarial Search & Game Playing',
      description: 'Minimax algorithm, zero-sum games, Alpha-Beta pruning, evaluation functions, and Monte Carlo Tree Search (MCTS).',
      difficulty: 'Intermediate',
      estimatedMinutes: 110,
      xpReward: 250,
      lessons: [
        {
          id: 'ai-l3-minimax',
          title: 'Minimax & Alpha-Beta Pruning',
          description: 'Maximizing player vs minimizing adversary: pruning subtrees that cannot influence the final decision.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Implement Minimax with Alpha-Beta pruning to build game-playing AI engines.',
          explanation: 'In zero-sum games like Chess and Tic-Tac-Toe, your gain is your opponent\'s loss. The Minimax algorithm recursively maximizes your score while assuming the opponent makes the optimal counter-move to minimize your score.',
          importantConcepts: [
            'Minimax Value: Best achievable payoff against an optimal adversary.',
            'Alpha-Beta Pruning: Maintains alpha (best already guaranteed max) and beta (best already guaranteed min), pruning branches where alpha >= beta.',
            'Horizon Effect: Static evaluation functions needed when game depth exceeds compute limits.'
          ],
          keyPoints: [
            'Alpha-Beta pruning yields the exact same numerical result as Minimax while searching up to 2x deeper.',
            'Move ordering is critical: searching strong moves first maximizes pruning efficiency.'
          ],
          codeExample: {
            language: 'python',
            code: `def minimax(depth, is_maximizing, alpha, beta):\n    # Base case or terminal state evaluation\n    if depth == 0:\n        return 10 # heuristic leaf score\n    if is_maximizing:\n        max_eval = -float('inf')\n        # evaluate children, update alpha, prune if beta <= alpha\n        return 10\n    else:\n        min_eval = float('inf')\n        return 10\nprint("Alpha-Beta pruning ready. Prunes subtrees when beta <= alpha.")`,
            explanation: 'Alpha-Beta pruning branch evaluation structure.',
            output: 'Alpha-Beta pruning ready. Prunes subtrees when beta <= alpha.'
          },
          practicalExample: {
            title: 'Tic-Tac-Toe Unbeatable AI',
            scenario: 'Create an engine that never loses a game of Tic-Tac-Toe.',
            solution: 'Full depth-9 Minimax search evaluates all 255,168 terminal states in milliseconds.'
          },
          quiz: {
            question: 'In the best-case move ordering, what is the effective branching factor of Alpha-Beta pruning compared to branching factor b of standard Minimax?',
            options: ['b (no change)', 'sqrt(b)', 'b / 10', 'log(b)'],
            correctIndex: 1,
            explanation: 'With optimal move ordering, Alpha-Beta searches O(b^(d/2)) nodes instead of O(b^d), effectively halving the search depth exponent.'
          },
          practiceChallenge: {
            prompt: 'In Alpha-Beta pruning, what condition triggers an immediate cutoff and branch termination?',
            starterCode: '# cutoff_condition = ""',
            solutionHint: 'beta <= alpha',
            solutionCode: 'cutoff_condition = "beta <= alpha"\nprint(cutoff_condition)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m4',
      moduleNumber: 4,
      title: 'Knowledge Representation & Logic',
      description: 'Propositional logic, truth tables, inference rules (Modus Ponens, Resolution), and First-Order Predicate Logic.',
      difficulty: 'Intermediate',
      estimatedMinutes: 100,
      xpReward: 200,
      lessons: [
        {
          id: 'ai-l4-first-order-logic',
          title: 'Propositional & First-Order Predicate Logic',
          description: 'Quantifiers (Universal ∀, Existential ∃), predicates, unification, and knowledge base resolution.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Represent relational knowledge and execute resolution-refutation proof algorithms.',
          explanation: 'Before statistical deep learning, classical AI was built on symbolic logic. Knowledge is stored as formal sentences in a Knowledge Base (KB), and inference engines derive new undeniable truths via formal deduction rules.',
          importantConcepts: [
            'Conjunctive Normal Form (CNF): Conjunction of disjunctions (clauses) required for resolution.',
            'Resolution Rule: Resolving (A or B) and (not B or C) yields (A or C).',
            'Modus Ponens: If P implies Q, and P is True, then Q must be True.'
          ],
          keyPoints: [
            'First-Order Logic adds predicates, functions, objects, and quantifiers (∀x, ∃y).',
            'Resolution refutation proves a statement by negating it and deriving a contradiction (empty clause).'
          ],
          codeExample: {
            language: 'python',
            code: `# Propositional Logic Entailment Verification in Python\ndef modus_ponens(p, p_implies_q):\n    if p and p_implies_q:\n        return True # Q is undeniably proved\n    return False\n\nprint("Entailment Verified: Socrates is mortal via deductive resolution.")`,
            explanation: 'Symbolic deduction through forward chaining inference.',
            output: 'Entailment Verified: Socrates is mortal via deductive resolution.'
          },
          practicalExample: {
            title: 'Medical Regulatory Compliance Rule Engine',
            scenario: 'Verify whether a patient qualifies for clinical trial eligibility based on strict formal rules.',
            solution: 'First-order logic inference engine executing forward chaining over patient EHR predicates.'
          },
          quiz: {
            question: 'What does the Resolution inference rule produce when resolving clause (A or B) with clause (not A or C)?',
            options: ['(B and C)', '(B or C)', '(A or not A)', 'Empty Clause'],
            correctIndex: 1,
            explanation: 'The complimentary literals A and not A cancel out, producing the resolvent clause (B or C).'
          },
          practiceChallenge: {
            prompt: 'Translate the statement "All humans are mortal" into First-Order Logic notation.',
            starterCode: '# fol = ""',
            solutionHint: '∀x (Human(x) -> Mortal(x))',
            solutionCode: 'fol = "∀x (Human(x) -> Mortal(x))"\nprint(fol)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m5',
      moduleNumber: 5,
      title: 'Probabilistic Reasoning & Bayesian Networks',
      description: 'Uncertainty in AI, Bayes Rule, conditional independence, Directed Acyclic Graphs (DAGs), and Markov Blankets.',
      difficulty: 'Intermediate',
      estimatedMinutes: 100,
      xpReward: 200,
      lessons: [
        {
          id: 'ai-l5-bayes-nets',
          title: 'Bayesian Belief Networks & Inference',
          description: 'Conditional Probability Tables (CPTs), joint probability factorizations, and diagnostic vs causal reasoning.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Calculate posterior probabilities given observed evidence using Bayes Rule.',
          explanation: 'Real-world knowledge is rarely absolute; it is probabilistic. Bayesian Networks represent joint probability distributions compactly using directed acyclic graphs where edges signify conditional dependencies.',
          importantConcepts: [
            'Bayes Theorem: P(Cause | Effect) = P(Effect | Cause) * P(Cause) / P(Effect).',
            'Conditional Independence: Nodes are conditionally independent of non-descendants given their parents.',
            'Markov Blanket: Node\'s parents, children, and children\'s other parents shield it from the rest of the network.'
          ],
          keyPoints: [
            'Bayesian Networks drastically reduce parameter counts compared to naive full joint probability tables.',
            'Exact inference is NP-hard; large networks use Markov Chain Monte Carlo (MCMC) sampling.'
          ],
          codeExample: {
            language: 'python',
            code: `# Bayes Theorem: P(Disease | Positive Test)\np_disease = 0.01          # 1% base rate (prior)\np_pos_given_disease = 0.95 # 95% sensitivity\np_pos_given_healthy = 0.05 # 5% false positive\n\np_pos = (p_pos_given_disease * p_disease) + (p_pos_given_healthy * (1 - p_disease))\np_disease_given_pos = (p_pos_given_disease * p_disease) / p_pos\n\nprint(f"Posterior Probability of Disease given Positive Test: {p_disease_given_pos * 100:.1f}%")`,
            explanation: 'Demonstrating the base rate fallacy via Bayesian inference.',
            output: 'Posterior Probability of Disease given Positive Test: 16.1%'
          },
          practicalExample: {
            title: 'Spam Classification Naive Bayes',
            scenario: 'Calculate probability an email is spam given it contains the word "Lottery".',
            solution: 'P(Spam | Lottery) = P(Lottery | Spam) * P(Spam) / P(Lottery).'
          },
          quiz: {
            question: 'Why is the Naive Bayes algorithm called "naive"?',
            options: [
              'It was invented by early amateur researchers',
              'It makes the strong (often unrealistic) assumption that all features are conditionally independent given the class label',
              'It can only handle binary 0 and 1 inputs',
              'It does not use division'
            ],
            correctIndex: 1,
            explanation: 'The conditional independence assumption is naive because words or features frequently co-occur in the real world.'
          },
          practiceChallenge: {
            prompt: 'In a Bayesian Network with 5 binary variables where each node has at most 2 parents, approximately how many CPT parameters are needed?',
            starterCode: '# params = ?',
            solutionHint: 'Each node with 2 parents has 2^2 = 4 parameters. 5 * 4 = 20.',
            solutionCode: 'params = 5 * (2**2)\nprint(f"Total CPT parameters: {params}") # 20 parameters vs 31 for full joint table'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m6',
      moduleNumber: 6,
      title: 'Planning & Decision Making (MDPs)',
      description: 'Markov Decision Processes, state transitions, discount factor gamma, Bellman Equation, and Value Iteration.',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'ai-l6-bellman',
          title: 'The Bellman Equation & Value Iteration',
          description: 'Solving optimal policies in stochastic environments: V*(s) = max_a sum(T(s, a, s\') * [R + gamma * V*(s\')]).',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Compute optimal policy utility values using iterative Bellman updates.',
          explanation: 'Planning in stochastic environments requires balancing immediate rewards with future utility. The Bellman equation expresses the value of a state as the immediate expected reward plus the discounted expected value of the next state.',
          importantConcepts: [
            'Markov Property: The future state depends solely on the current state and action, not the past history.',
            'Discount Factor (Gamma): Values future rewards between 0 (myopic/short-term) and 1 (far-sighted).',
            'Value Iteration: Repeatedly updating state utilities until convergence to optimal policy pi*.'
          ],
          keyPoints: [
            'Dynamic programming solves known MDPs efficiently; Q-learning solves unknown MDPs via exploration.',
            'A policy pi(s) directly maps every state to its optimal recommended action.'
          ],
          codeExample: {
            language: 'python',
            code: `# Bellman Value Iteration Step\n# V[s] = max_a ( sum( P(s'|s,a) * (R(s,a,s') + gamma * V[s']) ) )\ngamma = 0.9\nimmediate_reward = 1.0\nexpected_future_val = 10.0\ntotal_utility = immediate_reward + gamma * expected_future_val\nprint(f"Computed State Utility: {total_utility:.2f}")`,
            explanation: 'Single-step Bellman utility calculation with discount factor 0.9.',
            output: 'Computed State Utility: 10.00'
          },
          practicalExample: {
            title: 'Gridworld Robot Navigation',
            scenario: 'Navigate a rover across a cliff edge with a 20% wind slip probability.',
            solution: 'Solve MDP via Value Iteration with negative penalty for falling off cliffs.'
          },
          quiz: {
            question: 'What does the discount factor gamma (typically 0.9 - 0.99) achieve in an infinite-horizon MDP?',
            options: [
              'It shuts down the computer after 100 steps',
              'It guarantees the infinite sum of rewards converges to a finite mathematical value and models preference for sooner rewards',
              'It sets all negative rewards to zero',
              'It speeds up Python loops'
            ],
            correctIndex: 1,
            explanation: 'Discounting bounds the infinite series sum: sum(gamma^t * R) <= R_max / (1 - gamma).'
          },
          practiceChallenge: {
            prompt: 'Calculate the present discounted value of receiving 100 reward points 2 steps in the future with gamma = 0.9.',
            starterCode: 'gamma = 0.9; reward = 100\n# discounted_val = ?',
            solutionHint: 'reward * (gamma ** 2)',
            solutionCode: 'discounted_val = 100 * (0.9 ** 2)\nprint(f"Present Value: {discounted_val:.1f}") # 81.0'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m7',
      moduleNumber: 7,
      title: 'Modern AI & Multi-Agent Systems',
      description: 'Game theory, Nash Equilibrium, prisoner\'s dilemma, auction mechanisms, and swarm intelligence.',
      difficulty: 'Advanced',
      estimatedMinutes: 110,
      xpReward: 250,
      lessons: [
        {
          id: 'ai-l7-game-theory',
          title: 'Game Theory & Nash Equilibrium',
          description: 'Strategic interactions between multiple rational agents: dominant strategies and payoff matrices.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Analyze payoff matrices and identify pure and mixed strategy Nash Equilibria.',
          explanation: 'In multi-agent environments, an agent\'s payoff depends not only on its own actions but on the simultaneous actions of other autonomous agents. A Nash Equilibrium is a state where no agent can benefit by unilaterally changing its strategy.',
          importantConcepts: [
            'Nash Equilibrium: Stable state where no player has an incentive to deviate unilaterally.',
            'Prisoner\'s Dilemma: Demonstrates how individual rational choices can lead to a mutually sub-optimal outcome.',
            'Zero-Sum vs Non-Zero-Sum: Competing for fixed pie vs cooperative win-win scenarios.'
          ],
          keyPoints: [
            'In competitive auctions, dominant strategy design (e.g. Vickrey second-price auctions) incentivizes truthful bidding.',
            'Multi-agent LLM systems exhibit emergent cooperative behaviors when given complementary roles.'
          ],
          codeExample: {
            language: 'python',
            code: `# Prisoner's Dilemma Payoff Matrix:\n# (Player A, Player B)\npayoffs = {\n    ("Cooperate", "Cooperate"): (-1, -1),\n    ("Cooperate", "Defect"):    (-3,  0),\n    ("Defect",    "Cooperate"): ( 0, -3),\n    ("Defect",    "Defect"):    (-2, -2)\n}\nprint("Nash Equilibrium Strategy: Both players Defect (-2, -2).")`,
            explanation: 'The classic Prisoner\'s Dilemma payoff matrix and equilibrium state.',
            output: 'Nash Equilibrium Strategy: Both players Defect (-2, -2).'
          },
          practicalExample: {
            title: 'Algorithmic Ad Bidding',
            scenario: 'Determine optimal bid in a Vickrey second-price online advertising auction.',
            solution: 'Bid your exact true valuation; truth-telling is a dominant strategy in second-price auctions.'
          },
          quiz: {
            question: 'In game theory, what defines a Nash Equilibrium?',
            options: [
              'Both players receive the maximum possible points in the game',
              'No player has an incentive to change their strategy given the other players\' chosen strategies',
              'The game ends in a tie',
              'One player bankrupts the other'
            ],
            correctIndex: 1,
            explanation: 'At a Nash Equilibrium, every player\'s current action is an optimal response to the other players\' current actions.'
          },
          practiceChallenge: {
            prompt: 'In a second-price sealed bid auction, if Bidder A bids $12, Bidder B bids $18, and Bidder C bids $15, who wins and what price do they pay?',
            starterCode: '# winner = ""; price_paid = ?',
            solutionHint: 'Highest bidder wins, but pays the second-highest bid.',
            solutionCode: 'winner = "Bidder B"\nprice_paid = 15.00\nprint(f"Winner: {winner}, Pays: ${price_paid}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ai-m8',
      moduleNumber: 8,
      title: 'Artificial Intelligence Capstone Project',
      description: 'Architect and deploy an autonomous decision engine combining A* search, state tracking, and utility maximization.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Autonomous Synthetic Agent Engine',
        description: 'Construct a complete simulation environment where an autonomous agent navigates obstacles, balances resources, negotiates with other agents, and maximizes utility.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'ai-l8-capstone',
          title: 'Assembling the Autonomous Intelligence Engine',
          description: 'Integrating PEAS perception, state space planning, heuristic optimization, and decision logic.',
          estimatedMinutes: 30,
          xpReward: 25,
          learningObjective: 'Synthesize symbolic logic, search heuristics, and decision networks into a complete autonomous system.',
          explanation: 'The Artificial Intelligence capstone harmonizes classical search, logical reasoning, and modern machine learning into a unified intelligent agent capable of operating under partial observability and uncertainty.',
          importantConcepts: [
            'Deliberative vs Reactive Architecture: Combining fast reflex loops with deep lookahead search.',
            'Hybrid AI: Blending symbolic reasoning (logic rules) with connectionist AI (neural networks).',
            'Safe AI Alignment: Embedding non-negotiable safety constraints into agent utility functions.'
          ],
          keyPoints: [
            'Modular agent architectures separate perception, belief state, goal planning, and execution.',
            'Always provide fallback fail-safe reflex behaviors when planning exceeds computational latency budgets.'
          ],
          codeExample: {
            language: 'python',
            code: `# Synthetic Autonomous Agent Architecture:\nclass SyntheticAgent:\n    def __init__(self):\n        self.beliefs = {}\n        self.goals = ["Explore", "Survive", "Optimize"]\n    \n    def step(self, percepts):\n        self.update_beliefs(percepts)\n        action = self.plan_next_action()\n        return action\nprint("Synthetic Autonomous Agent Architecture Initialized.")`,
            explanation: 'High-level architecture of a rational deliberative agent.',
            output: 'Synthetic Autonomous Agent Architecture Initialized.'
          },
          practicalExample: {
            title: 'Mars Rover Autonomy',
            scenario: 'Enable a planetary rover to navigate unknown terrain during communication blackouts.',
            solution: 'Autonomous hybrid agent combining stereo vision obstacle detection with A* path planning.'
          },
          quiz: {
            question: 'What is the primary strength of Neuro-Symbolic (Hybrid) AI architectures?',
            options: [
              'They don\'t require electricity',
              'They combine the perceptual learning power of deep neural nets with the explainable, verifiable reasoning of symbolic logic',
              'They eliminate the need for training data',
              'They make code compile instantly'
            ],
            correctIndex: 1,
            explanation: 'Neuro-symbolic AI bridges the gap between deep perceptual pattern recognition and rigorous formal logic.'
          },
          practiceChallenge: {
            prompt: 'Complete your journey across the Artificial Intelligence curriculum!',
            starterCode: '# Verify complete AI mastery',
            solutionHint: 'Confirm understanding from rational agents and A* to game theory and MDPs.',
            solutionCode: 'print("Artificial Intelligence Mastered! The cognitive realm is yours.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
