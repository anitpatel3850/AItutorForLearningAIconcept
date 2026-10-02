import { Course } from './types';

export const algorithmsCourse: Course = {
  id: 'ai-algorithms',
  title: 'AI Algorithms and Problem Solving',
  shortDescription: 'Algorithmic rigor for intelligent systems: Big-O analysis, graph traversals, dynamic programming, divide-and-conquer, genetic algorithms, and simulated annealing.',
  description: 'Sharpen your computational problem-solving instincts. Master the foundational algorithms and mathematical optimizations that power route planning, network flows, combinatorial scheduling, and deep neural backends.',
  iconName: 'GitBranch',
  level: 'Intermediate',
  category: 'Computational Science',
  estimatedHours: 26,
  badge: 'Algorithmic Master',
  accentColor: 'cyan',
  whatYouWillLearn: [
    'Analyze algorithmic complexity with Big-O, Big-Omega, and Big-Theta asymptotic bounds',
    'Implement high-speed searching and sorting algorithms (Binary Search, QuickSort, MergeSort)',
    'Traverse complex network topologies with Dijkstra, Bellman-Ford, and Floyd-Warshall',
    'Solve combinatorial optimization problems using Dynamic Programming and Memoization',
    'Implement metaheuristic search: Genetic Algorithms, Simulated Annealing, and Hill Climbing',
    'Conquer NP-hard AI scheduling and traveling salesperson (TSP) challenges',
    'Benchmark code execution memory and compute bottlenecks with algorithmic profiling'
  ],
  prerequisites: [
    'Comfortable with Python control flow, recursion, and data structures (lists, dicts)',
    'Basic algebra and discrete math awareness'
  ],
  skillsYouWillGain: [
    'Asymptotic Time & Space Complexity (Big-O)',
    'Graph Algorithms & Shortest Path',
    'Dynamic Programming & State Transitions',
    'Metaheuristic Global Optimization',
    'Algorithmic Problem Solving'
  ],
  completionRequirements: [
    'Complete all 8 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Solve the capstone Algorithmic Tournament Challenge'
  ],
  modules: [
    {
      id: 'algo-m1',
      moduleNumber: 1,
      title: 'Algorithm Foundations & Asymptotics',
      description: 'Big-O notation, time and space complexity, recursion trees, and master theorem analysis.',
      difficulty: 'Beginner',
      estimatedMinutes: 80,
      xpReward: 200,
      lessons: [
        {
          id: 'algo-l1-big-o',
          title: 'Big-O Complexity & Growth Rates',
          description: 'Classifying algorithm scalability: O(1), O(log N), O(N), O(N log N), O(N^2), and O(2^N).',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Calculate the asymptotic time and auxiliary space complexity of functions.',
          explanation: 'Algorithms operate over input sizes ranging from 10 to 10 billion elements. Big-O notation characterizes the upper bound of an algorithm\'s resource growth rate as input size N grows towards infinity, ignoring constant hardware coefficients.',
          importantConcepts: [
            'Asymptotic Analysis: Evaluating performance independently of hardware variations.',
            'Dominant Term: In O(N^2 + 5N + 100), the N^2 term dominates as N becomes large.',
            'Worst-Case vs Average-Case: QuickSort is O(N log N) on average, but O(N^2) in worst-case.'
          ],
          keyPoints: [
            'O(log N) algorithms (like binary search) double their execution capacity with every constant step.',
            'Avoid nested loops over large datasets to prevent catastrophic O(N^2) bottlenecks.'
          ],
          codeExample: {
            language: 'python',
            code: `# Complexity comparison for N = 10,000 items\nimport math\n\nn = 10000\nprint(f"O(1) Constant:      1 op")\nprint(f"O(log N) Binary:    {math.log2(n):.0f} ops")\nprint(f"O(N) Linear:        {n:,} ops")\nprint(f"O(N log N) Sort:    {int(n * math.log2(n)):,} ops")\nprint(f"O(N^2) Quadratic:   {n**2:,} ops (Avoid!)")`,
            explanation: 'Demonstrating the explosive divergence of algorithmic operations at scale.',
            output: 'O(1) Constant:      1 op\nO(log N) Binary:    13 ops\nO(N) Linear:        10,000 ops\nO(N log N) Sort:    132,877 ops\nO(N^2) Quadratic:   100,000,000 ops (Avoid!)'
          },
          practicalExample: {
            title: 'Optimizing Lookup Time',
            scenario: 'Replace an O(N) list search across 1,000,000 user IDs with an O(1) hash set.',
            solution: 'Convert list to set: user_id in user_set executes in ~50 nanoseconds.'
          },
          quiz: {
            question: 'What is the time complexity of searching for an item in a balanced Binary Search Tree containing N elements?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Each comparison eliminates half of the remaining nodes, yielding logarithmic O(log N) search.'
          },
          practiceChallenge: {
            prompt: 'What is the Big-O time complexity of two nested loops that each iterate from 0 to N?',
            starterCode: '# complexity = ""',
            solutionHint: 'N multiplied by N.',
            solutionCode: 'complexity = "O(N^2)"\nprint(complexity)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m2',
      moduleNumber: 2,
      title: 'Searching & Binary Partitioning',
      description: 'Binary Search, Ternary Search, exponential search, and searching rotated sorted arrays.',
      difficulty: 'Beginner',
      estimatedMinutes: 80,
      xpReward: 200,
      lessons: [
        {
          id: 'algo-l2-binary-search',
          title: 'Binary Search & Monotonic Predicates',
          description: 'The divide-and-conquer paradigm: finding boundaries in O(log N) steps.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Implement overflow-safe binary search and apply it to monotonic decision functions.',
          explanation: 'Binary search is not just for finding numbers in sorted arrays; it is a general technique to find the exact threshold where any monotonic condition flips from False to True in O(log N) time.',
          importantConcepts: [
            'Overflow-Safe Midpoint: mid = low + (high - low) // 2.',
            'Left vs Right Bias: Finding the first occurrence vs last occurrence of duplicate keys.',
            'Binary Search on Answers: Optimizing capacity, allocation limits, or hyperparameter thresholds.'
          ],
          keyPoints: [
            'Binary search requires that the underlying search space or predicate function is monotonic (sorted).',
            'Always verify boundary updates: low = mid + 1 and high = mid - 1 to prevent infinite loops.'
          ],
          codeExample: {
            language: 'python',
            code: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nnumbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nidx = binary_search(numbers, 23)\nprint(f"Target 23 found at index: {idx}")`,
            explanation: 'Clean, overflow-safe binary search implementation.',
            output: 'Target 23 found at index: 5'
          },
          practicalExample: {
            title: 'Hyperparameter Threshold Tuning',
            scenario: 'Find the lowest model confidence threshold that still achieves 95% precision.',
            solution: 'Binary search across the continuous threshold interval [0.0, 1.0].'
          },
          quiz: {
            question: 'How many comparisons at most does binary search take to find an element in a sorted list of 1,024 items?',
            options: ['10 comparisons', '512 comparisons', '1,024 comparisons', '1 comparison'],
            correctIndex: 0,
            explanation: 'log2(1024) = 10. In the worst case, binary search requires only 10 comparisons.'
          },
          practiceChallenge: {
            prompt: 'In binary search over 1,000,000 sorted items, what is the maximum number of comparisons?',
            starterCode: '# max_steps = ?',
            solutionHint: '2^20 is approximately 1,048,576.',
            solutionCode: 'max_steps = 20\nprint(f"Max comparisons: {max_steps}") # 20'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m3',
      moduleNumber: 3,
      title: 'Sorting & Divide-and-Conquer',
      description: 'MergeSort, QuickSort, HeapSort, stability in sorting, and counting sort for linear time bounds.',
      difficulty: 'Intermediate',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'algo-l3-quicksort-mergesort',
          title: 'QuickSort, MergeSort & Sorting Guarantees',
          description: 'Divide-and-conquer recursion: stable O(N log N) MergeSort vs in-place cache-friendly QuickSort.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Compare in-place partitioning with divide-and-conquer merge operations.',
          explanation: 'Sorting is the foundational primitive of computer science. MergeSort guarantees O(N log N) worst-case time by recursively splitting arrays in half and merging sorted halves. QuickSort partitions arrays around a pivot element in place.',
          importantConcepts: [
            'Divide and Conquer: Divide into subproblems, conquer recursively, combine results.',
            'Sorting Stability: Preserving the relative order of duplicate keys (crucial in multi-column database sorting).',
            'In-Place Sorting: O(1) auxiliary space (QuickSort/HeapSort) vs O(N) space (MergeSort).'
          ],
          keyPoints: [
            'Python\'s built-in sorted() uses Timsort—an adaptive hybrid of MergeSort and InsertionSort.',
            'Randomizing the pivot in QuickSort prevents O(N^2) adversarial attacks on already-sorted arrays.'
          ],
          codeExample: {
            language: 'python',
            code: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nunsorted = [38, 27, 43, 3, 9, 82, 10]\nprint("Sorted Array:", quicksort(unsorted))`,
            explanation: 'Recursive QuickSort partition implementation.',
            output: 'Sorted Array: [3, 9, 10, 27, 38, 43, 82]'
          },
          practicalExample: {
            title: 'Top-K Elements via QuickSelect',
            scenario: 'Find the 100 highest scoring search results from 10,000,000 candidates without sorting the entire array.',
            solution: 'Use QuickSelect to partition the array in O(N) average time.'
          },
          quiz: {
            question: 'What is the primary trade-off when choosing MergeSort over QuickSort?',
            options: [
              'MergeSort is always slower on all hardware',
              'MergeSort guarantees O(N log N) worst-case time and is stable, but requires O(N) additional auxiliary memory',
              'MergeSort can only handle floating-point numbers',
              'QuickSort is guaranteed to be stable'
            ],
            correctIndex: 1,
            explanation: 'MergeSort allocates auxiliary arrays to merge halves, whereas QuickSort partitions in place with O(log N) stack space.'
          },
          practiceChallenge: {
            prompt: 'What is the minimum theoretical comparison-based sorting time complexity lower bound?',
            starterCode: '# lower_bound = ""',
            solutionHint: 'Omega(N log N)',
            solutionCode: 'lower_bound = "O(N log N)"\nprint(lower_bound)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m4',
      moduleNumber: 4,
      title: 'Graph Algorithms & Shortest Paths',
      description: 'Adjacency lists, BFS/DFS, Dijkstra\'s algorithm, Bellman-Ford (negative cycles), and Topological Sort.',
      difficulty: 'Intermediate',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'algo-l4-dijkstra',
          title: 'Dijkstra\'s Shortest Path & Priority Queues',
          description: 'Finding minimal-cost paths in weighted non-negative graphs using min-heaps in O((V + E) log V).',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Implement Dijkstra\'s algorithm using Python heapq priority queues.',
          explanation: 'From network packet routing to GPS systems and game AI, graphs model relational networks. Dijkstra\'s algorithm greedily explores the closest unvisited node, relaxing neighbor distances until all reachable vertices are minimized.',
          importantConcepts: [
            'Adjacency List: Memory-efficient graph representation O(V + E).',
            'Edge Relaxation: if dist[u] + weight < dist[v]: dist[v] = dist[u] + weight.',
            'Priority Queue (Min-Heap): Extracts the minimum distance vertex in O(log V) time.'
          ],
          keyPoints: [
            'Dijkstra fails on graphs with negative edge weights; use Bellman-Ford instead.',
            'Track a "predecessors" dictionary to reconstruct the actual shortest path.'
          ],
          codeExample: {
            language: 'python',
            code: `import heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    \n    while pq:\n        cur_dist, u = heapq.heappop(pq)\n        if cur_dist > distances[u]:\n            continue\n        for v, weight in graph[u]:\n            if cur_dist + weight < distances[v]:\n                distances[v] = cur_dist + weight\n                heapq.heappush(pq, (distances[v], v))\n    return distances\n\n# Graph: A -> B (4), A -> C (2), C -> B (1)\ngraph = {'A': [('B', 4), ('C', 2)], 'B': [], 'C': [('B', 1)]}\nprint("Shortest Paths from A:", dijkstra(graph, 'A'))`,
            explanation: 'Dijkstra algorithm utilizing min-heap priority queue.',
            output: "Shortest Paths from A: {'A': 0, 'B': 3, 'C': 2}"
          },
          practicalExample: {
            title: 'Package Delivery Routing',
            scenario: 'Compute the lowest-cost delivery route between regional fulfillment centers.',
            solution: 'Dijkstra shortest path with toll/fuel costs as edge weights.'
          },
          quiz: {
            question: 'Why does standard Dijkstra\'s algorithm produce incorrect results on graphs containing negative edge weights?',
            options: [
              'Heaps cannot store negative numbers',
              'It assumes that visiting a node permanently finalizes its minimal shortest distance',
              'Python raises a ValueError',
              'Negative edges create infinite loops in BFS'
            ],
            correctIndex: 1,
            explanation: 'Dijkstra greedily marks nodes as finalized; a negative edge discovered later could retroactively reduce an already finalized path.'
          },
          practiceChallenge: {
            prompt: 'In a graph with V vertices and E edges, what is the time complexity of Dijkstra implemented with a binary min-heap?',
            starterCode: '# complexity = ""',
            solutionHint: 'O((V + E) log V)',
            solutionCode: 'complexity = "O((V + E) log V)"\nprint(complexity)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m5',
      moduleNumber: 5,
      title: 'Dynamic Programming & Memoization',
      description: 'Optimal substructure, overlapping subproblems, top-down memoization, bottom-up tabulation, and the 0/1 Knapsack.',
      difficulty: 'Advanced',
      estimatedMinutes: 130,
      xpReward: 250,
      lessons: [
        {
          id: 'algo-l5-knapsack',
          title: 'The 0/1 Knapsack & Optimal Substructure',
          description: 'Solving combinatorial decision problems in pseudo-polynomial time via dynamic programming matrices.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Formulate state transition recurrences and implement 2D/1D DP solutions.',
          explanation: 'Dynamic Programming solves problems with overlapping subproblems by computing solutions to subproblems once and storing them in a table. It turns exponential O(2^N) brute-force trees into polynomial O(N * W) table lookups.',
          importantConcepts: [
            'Overlapping Subproblems: The same sub-calculations recur repeatedly in the recursive call tree.',
            'Optimal Substructure: The optimal solution to the problem incorporates optimal solutions to subproblems.',
            'State Transition Recurrence: DP[i][w] = max(DP[i-1][w], val[i] + DP[i-1][w - wt[i]]).'
          ],
          keyPoints: [
            'Top-down with @functools.lru_cache is often faster to prototype.',
            'Bottom-up tabulation avoids recursion limit stack overflows and can be space-optimized to 1D.'
          ],
          codeExample: {
            language: 'python',
            code: `def knapsack(weights, values, capacity):\n    n = len(values)\n    dp = [0] * (capacity + 1)\n    for i in range(n):\n        for w in range(capacity, weights[i] - 1, -1):\n            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])\n    return dp[capacity]\n\nwts = [2, 3, 4, 5]\nvals = [3, 4, 5, 8]\ncap = 8\nprint(f"Max Knapsack Value for Capacity {cap}:", knapsack(wts, vals, cap))`,
            explanation: 'Space-optimized 1D Dynamic Programming solution to the 0/1 Knapsack.',
            output: 'Max Knapsack Value for Capacity 8: 12'
          },
          practicalExample: {
            title: 'GPU Memory Layer Offloading',
            scenario: 'Select the optimal subset of neural layers to keep in GPU VRAM to maximize speed without exceeding capacity.',
            solution: 'Model as a 0/1 Knapsack where VRAM is capacity and latency speedup is value.'
          },
          quiz: {
            question: 'What are the two mandatory properties a problem must possess to be solvable via Dynamic Programming?',
            options: [
              'Binary trees and prime numbers',
              'Optimal substructure and overlapping subproblems',
              'Negative weights and acyclic edges',
              'GPU acceleration and multi-threading'
            ],
            correctIndex: 1,
            explanation: 'Optimal substructure guarantees global optimality from subproblem solutions, and overlapping subproblems makes caching profitable.'
          },
          practiceChallenge: {
            prompt: 'In dynamic programming, what is the term for the top-down caching approach that stores function results in memory?',
            starterCode: '# term = ""',
            solutionHint: 'Memoization (with no "r").',
            solutionCode: 'term = "Memoization"\nprint(term)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m6',
      moduleNumber: 6,
      title: 'Metaheuristic Optimization & Local Search',
      description: 'Hill Climbing, Local Optima traps, Simulated Annealing (Boltzmann probability), and Genetic Evolutionary Algorithms.',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'algo-l6-annealing',
          title: 'Simulated Annealing & Genetic Algorithms',
          description: 'Escaping local optima traps: temperature schedules and Darwinian crossover/mutation operators.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Implement Simulated Annealing with cooling schedules to escape local minima in complex search spaces.',
          explanation: 'When mathematical gradients do not exist (discrete scheduling, traveling salesperson, chip floorplanning), gradient descent cannot be used. Simulated Annealing models metallurgical annealing: early in the search, it accepts worse moves with high probability to escape local optima, gradually cooling into the global optimum.',
          importantConcepts: [
            'Local Minima Trap: Greedy algorithms stall as soon as all neighbors are worse.',
            'Metropolis Acceptance Criterion: P(Accept worse move) = exp(-delta_E / Temperature).',
            'Genetic Algorithms: Population encoding, fitness evaluation, roulette selection, crossover, and mutation.'
          ],
          keyPoints: [
            'Simulated Annealing guarantees asymptotic convergence to global optimum given a sufficiently slow logarithmic cooling schedule.',
            'Genetic algorithms excel at multi-objective Pareto optimization.'
          ],
          codeExample: {
            language: 'python',
            code: `import math, random\n\ndef metropolis_acceptance(current_cost, next_cost, temperature):\n    if next_cost < current_cost:\n        return True # Always accept improvement\n    delta_e = next_cost - current_cost\n    probability = math.exp(-delta_e / temperature)\n    return random.random() < probability\n\nprint("Metropolis Probability (delta=5, T=10):", round(math.exp(-5/10), 3))\nprint("Metropolis Probability (delta=5, T=1): ", round(math.exp(-5/1), 3))`,
            explanation: 'Metropolis acceptance probability diminishing as temperature cools down.',
            output: 'Metropolis Probability (delta=5, T=10): 0.607\nMetropolis Probability (delta=5, T=1):  0.007'
          },
          practicalExample: {
            title: 'AI Quest Raid Boss Move Generator',
            scenario: 'Generate challenging yet winnable tactical counter-attacks across 100 possible game mechanics.',
            solution: 'Simulated annealing optimizing for maximum engagement score and balanced difficulty.'
          },
          quiz: {
            question: 'What happens to the probability of accepting an inferior move in Simulated Annealing as the Temperature parameter cools toward zero?',
            options: [
              'It approaches 1.0 (always accepts)',
              'It approaches 0.0 (degrades into pure greedy hill climbing)',
              'It becomes negative',
              'It resets to a random value'
            ],
            correctIndex: 1,
            explanation: 'As T approaches zero, exp(-delta / T) approaches zero, so only strictly improving moves are accepted.'
          },
          practiceChallenge: {
            prompt: 'In a genetic algorithm, what operator introduces new diversity into the gene pool to prevent premature convergence?',
            starterCode: '# operator_name = ""',
            solutionHint: 'Mutation.',
            solutionCode: 'operator_name = "Mutation"\nprint(operator_name)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m7',
      moduleNumber: 7,
      title: 'Advanced AI Search: MCTS & Constraint Satisfaction',
      description: 'Monte Carlo Tree Search (Selection, Expansion, Simulation, Backprop in AlphaGo) and Constraint Satisfaction (CSP / Backtracking).',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'algo-l7-mcts-csp',
          title: 'Monte Carlo Tree Search (MCTS) & CSPs',
          description: 'Upper Confidence Bounds for Trees (UCT), random rollouts, and Forward Checking in backtracking search.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Explain the 4 phases of MCTS that powered AlphaGo to defeat world champions.',
          explanation: 'In games with vast branching factors like Go (b ≈ 250), Minimax search fails due to combinatorial explosion. MCTS balances exploration and exploitation using the Upper Confidence Bound (UCT), simulating game outcomes via random rollouts.',
          importantConcepts: [
            'MCTS 4 Phases: (1) Selection via UCT, (2) Expansion of leaf, (3) Rollout simulation, (4) Backpropagation of win/loss score.',
            'UCT Formula: Win_Rate + C * sqrt(ln(Parent_Visits) / Node_Visits).',
            'Constraint Satisfaction Problem (CSP): Variables, domains, and constraints solved via backtracking with MRV (Minimum Remaining Values).'
          ],
          keyPoints: [
            'MCTS requires no handcrafted static evaluation function; it evaluates nodes through self-play simulation statistics.',
            'MRV heuristic ("most constrained variable first") reduces backtracking search trees by orders of magnitude.'
          ],
          codeExample: {
            language: 'python',
            code: `# The 4 Phases of Monte Carlo Tree Search (AlphaGo):\nphases = [\n    "1. Selection: Traverse tree using UCT formula to find most urgent node",\n    "2. Expansion: Add one or more child nodes to the search tree",\n    "3. Simulation: Play out the game to the end with fast policy rollout",\n    "4. Backprop: Update visit counts and win rates along path to root"\n]\nfor p in phases:\n    print(f"[MCTS] {p}")`,
            explanation: 'The core four-step loop of Monte Carlo Tree Search.',
            output: '[MCTS] 1. Selection: Traverse tree using UCT formula to find most urgent node\n[MCTS] 2. Expansion: Add one or more child nodes to the search tree\n[MCTS] 3. Simulation: Play out the game to the end with fast policy rollout\n[MCTS] 4. Backprop: Update visit counts and win rates along path to root'
          },
          practicalExample: {
            title: 'Automated Timetable Scheduling',
            scenario: 'Assign 500 university courses into 50 classrooms without professor or student conflicts.',
            solution: 'Model as a Constraint Satisfaction Problem (CSP) solved via AC-3 arc consistency and backtracking.'
          },
          quiz: {
            question: 'What does the parameter C represent in the Upper Confidence Bound for Trees (UCT) formula?',
            options: [
              'The clock speed of the processor',
              'The exploration constant balancing exploiting known winning moves vs exploring under-visited moves',
              'The count of legal chess moves',
              'The temperature of the neural net'
            ],
            correctIndex: 1,
            explanation: 'C balances the exploitation term (win rate) with the exploration bonus (sqrt(ln N / n)).'
          },
          practiceChallenge: {
            prompt: 'In a CSP solver, what heuristic selects the variable with the fewest legal values remaining in its domain?',
            starterCode: '# heuristic_acronym = ""',
            solutionHint: 'Minimum Remaining Values (MRV).',
            solutionCode: 'heuristic_acronym = "MRV"\nprint(f"Heuristic: {heuristic_acronym}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'algo-m8',
      moduleNumber: 8,
      title: 'Algorithmic Problem Solving Capstone',
      description: 'The Ultimate Tournament: conquer complex competitive programming and AI algorithmic challenges.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Algorithmic Optimization Engine',
        description: 'Implement a comprehensive algorithmic suite that parses spatial graphs, executes A* with admissible heuristics, models combinatorial constraints, and runs MCTS game simulations.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'algo-l8-capstone',
          title: 'Algorithmic Architecture & Verification',
          description: 'Synthesizing complexity analysis, graph paths, dynamic programming, and metaheuristic search into an elite problem-solving toolkit.',
          estimatedMinutes: 30,
          xpReward: 25,
          learningObjective: 'Select and implement the mathematically optimal algorithm for any arbitrary computational challenge.',
          explanation: 'True algorithmic mastery means recognizing the deep structural patterns of problems: identifying when a task reduces to shortest path, when overlapping subproblems demand dynamic programming, and when combinatorial intractability requires metaheuristic search.',
          importantConcepts: [
            'Problem Pattern Recognition: Mapping descriptions to graphs, DP, trees, or greedy strategies.',
            'Algorithmic Tradeoffs: Time vs Space vs Implementation Complexity vs Optimality.',
            'Defensive Implementation: Handling edge cases (empty inputs, singletons, cycles, disconnected components).'
          ],
          keyPoints: [
            'Always test edge cases: N = 0, N = 1, negative numbers, all elements equal, sorted inputs.',
            'Profile memory and execution bottlenecks using timeit and cProfile.'
          ],
          codeExample: {
            language: 'python',
            code: `# The Elite Algorithmic Playbook:\nplaybook = {\n    "Shortest Path (Non-negative)": "Dijkstra O((V+E) log V)",\n    "Shortest Path (With Heuristic)": "A* Search O(b^d)",\n    "Combinatorial Subsets": "Dynamic Programming O(NW)",\n    "Unknown Intractable Space": "Simulated Annealing / MCTS",\n    "Fast Exact Membership": "Hash Table O(1)"\n}\nfor problem, algorithm in playbook.items():\n    print(f"{problem:<32} -> {algorithm}")`,
            explanation: 'The algorithmic decision matrix for software and AI engineering.',
            output: 'Shortest Path (Non-negative)     -> Dijkstra O((V+E) log V)\nShortest Path (With Heuristic)   -> A* Search O(b^d)\nCombinatorial Subsets            -> Dynamic Programming O(NW)\nUnknown Intractable Space        -> Simulated Annealing / MCTS\nFast Exact Membership            -> Hash Table O(1)'
          },
          practicalExample: {
            title: 'Technical Interview & Competitive Programming',
            scenario: 'Approach an unseen problem: "Given an array of intervals, merge overlapping intervals in O(N log N)."',
            solution: 'Sort intervals by start time O(N log N); iterate through linearly merging intervals in O(N).'
          },
          quiz: {
            question: 'Which algorithmic paradigm should be selected when you need an optimal path across a graph where an admissible distance estimate to the goal is available?',
            options: ['Breadth-First Search', 'A* Search', 'QuickSort', 'K-Means'],
            correctIndex: 1,
            explanation: 'A* search is mathematically proven to be optimally efficient among all informed heuristic search algorithms using admissible heuristics.'
          },
          practiceChallenge: {
            prompt: 'Declare your complete mastery of AI Algorithms and Problem Solving!',
            starterCode: '# Final Algorithm Certification',
            solutionHint: 'Confirm mastery across Big-O, searches, sorts, graphs, DP, and metaheuristics.',
            solutionCode: 'print("AI Algorithms and Problem Solving Mastered! The pinnacle of computation.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
