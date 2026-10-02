from typing import Dict, Any, Optional

COURSES_CATALOG: Dict[str, Dict[str, Any]] = {
    "machine-learning": {
        "id": "machine-learning",
        "title": "Machine Learning",
        "category": "Predictive Modeling & Statistical Learning",
        "level": "Intermediate",
        "modules": {
            "ml-m1": {
                "id": "ml-m1",
                "title": "ML Foundations & Core Paradigms",
                "module_number": 1,
                "lessons": {
                    "ml-l1-paradigms": {
                        "id": "ml-l1-paradigms",
                        "title": "Learning Paradigms: Supervised, Unsupervised & RL",
                        "learning_objective": "Differentiate supervised, unsupervised, and reinforcement learning paradigms and map real-world problems to the appropriate paradigm.",
                        "explanation": "Machine learning transforms data into predictive mathematical functions without hand-coded heuristics. Supervised learning operates on input-target pairs (X, y). Unsupervised learning uncovers latent structures without targets. Reinforcement learning trains agents to maximize scalar cumulative reward in dynamic Markov Decision Process environments.",
                        "important_concepts": ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Target Labels", "Empirical Risk"],
                        "key_points": [
                            "Supervised requires ground truth labels for every sample.",
                            "Unsupervised discovers clusters and manifold projections.",
                            "Reinforcement learning optimizes through trial, error, and delayed rewards."
                        ],
                        "sample_quiz": {
                            "question": "Which learning paradigm is appropriate for customer segmentation when historical purchase groupings are unknown?",
                            "options": ["Supervised Classification", "Unsupervised Clustering", "Reinforcement Learning", "Linear Regression"],
                            "correct_index": 1,
                            "explanation": "Unsupervised clustering (e.g. K-Means or DBSCAN) groups unlabeled customer attributes based on feature distance."
                        }
                    },
                    "ml-l2-loss-optimization": {
                        "id": "ml-l2-loss-optimization",
                        "title": "Cost Functions & Gradient Descent",
                        "learning_objective": "Derive MSE and Cross-Entropy loss functions and implement first-order gradient descent optimization.",
                        "explanation": "A cost function quantifies the discrepancy between model predictions and true targets. Gradient descent calculates the vector of partial derivatives with respect to model parameters and steps in the opposite direction scaled by the learning rate alpha.",
                        "important_concepts": ["Loss Landscapes", "Convexity", "Learning Rate", "Vanishing Gradients", "Stochastic Gradient Descent"],
                        "key_points": [
                            "Gradient points toward steepest ascent; subtract gradient for descent.",
                            "Excessive learning rate causes divergence; minuscule rate stalls convergence."
                        ],
                        "sample_quiz": {
                            "question": "What happens if the gradient descent learning rate is set drastically too high?",
                            "options": ["The model gets trapped in local minima", "The loss diverges and weights explode", "Training completes instantly", "Overfitting occurs automatically"],
                            "correct_index": 1,
                            "explanation": "An oversized learning rate overshoots the minimum and causes loss divergence and gradient explosion."
                        }
                    }
                }
            },
            "ml-m3": {
                "id": "ml-m3",
                "title": "Supervised Learning Algorithms",
                "module_number": 3,
                "lessons": {
                    "ml-l4-regression": {
                        "id": "ml-l4-regression",
                        "title": "Linear & Polynomial Regression",
                        "learning_objective": "Formulate Ordinary Least Squares regression and apply polynomial feature expansions with regularizers.",
                        "explanation": "Linear regression models continuous targets as linear combinations of input features with learnable bias. Ridge (L2) and Lasso (L1) regularization constrain parameter norms to prevent collinearity and overfitting.",
                        "important_concepts": ["Ordinary Least Squares", "L1 Lasso Sparsity", "L2 Ridge Shrinkage", "R-squared Metric"],
                        "key_points": [
                            "L1 regularization drives irrelevant weights strictly to zero.",
                            "L2 shrinks weights proportionally, handling multicollinearity."
                        ],
                        "sample_quiz": {
                            "question": "Which regularization technique performs automated feature selection by zeroing out coefficients?",
                            "options": ["Ridge (L2)", "Lasso (L1)", "Dropout", "Early Stopping"],
                            "correct_index": 1,
                            "explanation": "Lasso uses an L1 penalty whose diamond-shaped geometry encourages sparse solutions where non-essential coefficients become exactly zero."
                        }
                    },
                    "ml-l5-classification": {
                        "id": "ml-l5-classification",
                        "title": "Logistic Regression & Classification Boundaries",
                        "learning_objective": "Understand binary and multiclass classification, sigmoid mapping, decision boundaries, and odds ratios.",
                        "explanation": "Classification predicts discrete categories or class probabilities. Logistic regression applies the non-linear Sigmoid function to squish linear outputs into the [0, 1] range, modeling the posterior probability P(Y=1|X).",
                        "important_concepts": ["Sigmoid Activation", "Log-Odds / Logit", "Binary Cross-Entropy", "Decision Threshold", "Confusion Matrix"],
                        "key_points": [
                            "Classification outputs discrete category predictions or class probabilities.",
                            "Decision boundary separates class regions (typically threshold at 0.5).",
                            "Accuracy can be deceptive with imbalanced classes; evaluate Precision, Recall, and F1-score."
                        ],
                        "sample_quiz": {
                            "question": "Why is the Sigmoid activation function preferred over a simple linear function for binary classification probabilities?",
                            "options": ["It guarantees outputs strictly between 0 and 1", "It runs 10x faster on GPUs", "It eliminates the need for training labels", "It only accepts integer inputs"],
                            "correct_index": 0,
                            "explanation": "Sigmoid bounds output smoothly between 0 and 1, allowing interpretation as valid probabilities."
                        }
                    },
                    "ml-l6-decision-trees": {
                        "id": "ml-l6-decision-trees",
                        "title": "Decision Trees & Random Forests",
                        "learning_objective": "Construct decision trees using Gini impurity and information gain, then assemble bagging ensembles.",
                        "explanation": "Decision trees recursively partition feature space into axis-aligned hyperplanes by maximizing information gain or minimizing Gini impurity. Random Forests aggregate hundreds of decorrelated bootstrapped trees to slash variance.",
                        "important_concepts": ["Gini Impurity", "Information Gain", "Entropy", "Bagging", "Ensemble Variance Reduction"],
                        "key_points": [
                            "Individual deep trees suffer high variance and overfit easily.",
                            "Random Forests reduce variance through bootstrapping and random feature subsets."
                        ],
                        "sample_quiz": {
                            "question": "How does a Random Forest prevent trees from making identical split decisions?",
                            "options": ["By training on negative loss values", "By randomly subsampling both data rows and candidate feature columns", "By pruning every leaf node", "By inverting the target labels"],
                            "correct_index": 1,
                            "explanation": "Random Forests use bagging (bootstrap samples) along with random feature subset selection at each split node to decorrelate individual trees."
                        }
                    }
                }
            }
        }
    },
    "python-for-ai": {
        "id": "python-for-ai",
        "title": "Python for AI",
        "category": "Foundational AI Programming & Scientific Computing",
        "level": "Beginner",
        "modules": {
            "py-m1": {
                "id": "py-m1",
                "title": "Python Foundations for AI",
                "module_number": 1,
                "lessons": {
                    "py-l1-variables": {
                        "id": "py-l1-variables",
                        "title": "Variables, Dynamic Typing & Memory References",
                        "learning_objective": "Understand Python memory allocation, variable references, and primitive numeric types used in ML pipelines.",
                        "explanation": "In Python, variables are names referencing heap-allocated objects rather than static memory containers. Integers, floats, and booleans form the bedrock of numerical tensors.",
                        "important_concepts": ["Dynamic Typing", "Object Reference", "Float Precision", "Immutability"],
                        "key_points": ["Variables store references to objects in heap memory.", "Floats carry 64-bit IEEE 754 double precision."],
                        "sample_quiz": {
                            "question": "In Python, what does the expression 'a = b' do when b is a list?",
                            "options": ["Creates an independent deep copy", "Points variable 'a' to the exact same memory reference as 'b'", "Converts the list to a tuple", "Freezes the list in memory"],
                            "correct_index": 1,
                            "explanation": "Assignment binds 'a' to the existing object reference of 'b'. Mutating 'a' will also mutate 'b' unless copied explicitly."
                        }
                    }
                }
            }
        }
    },
    "deep-learning": {
        "id": "deep-learning",
        "title": "Deep Learning",
        "category": "Neural Architectures & High-Dimensional Representations",
        "level": "Advanced",
        "modules": {
            "dl-m1": {
                "id": "dl-m1",
                "title": "Neural Network Foundations",
                "module_number": 1,
                "lessons": {
                    "dl-l1-perceptrons": {
                        "id": "dl-l1-perceptrons",
                        "title": "Artificial Neurons & Activation Dynamics",
                        "learning_objective": "Implement forward inference for a multi-layer perceptron using affine linear transforms and non-linear activations.",
                        "explanation": "A deep neural network chains composite functions: f(x) = sigma(W2 * sigma(W1 * x + b1) + b2). Non-linear activations like ReLU prevent depth collapse into a single linear map.",
                        "important_concepts": ["ReLU", "Forward Propagation", "Universal Approximation", "Weight Tensors"],
                        "key_points": ["Without non-linear activations, a 100-layer network collapses into a single matrix multiplication."],
                        "sample_quiz": {
                            "question": "Why is non-linearity critical in multi-layer neural networks?",
                            "options": ["To speed up floating point operations", "To enable modeling of complex non-linear decision boundaries without collapsing to a single linear layer", "To prevent all weights from becoming negative", "To avoid calculating biases"],
                            "correct_index": 1,
                            "explanation": "Linear combinations of linear functions remain linear. Non-linear activations allow networks to approximate arbitrary non-linear topologies."
                        }
                    }
                }
            }
        }
    }
}

def get_course_data(course_id: str) -> Optional[Dict[str, Any]]:
    return COURSES_CATALOG.get(course_id)

def get_lesson_data(course_id: str, lesson_id: str) -> Optional[Dict[str, Any]]:
    course = COURSES_CATALOG.get(course_id)
    if not course:
        return None
    for mod in course.get("modules", {}).values():
        if lesson_id in mod.get("lessons", {}):
            lesson = mod["lessons"][lesson_id].copy()
            lesson["module_title"] = mod["title"]
            lesson["module_number"] = mod["module_number"]
            lesson["course_title"] = course["title"]
            return lesson
    return None
