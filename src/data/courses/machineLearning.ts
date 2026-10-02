import { Course } from './types';

export const machineLearningCourse: Course = {
  id: 'machine-learning',
  title: 'Machine Learning',
  shortDescription: 'Master algorithms that learn from experience: regression, classification, clustering, ensemble trees, and regularized optimization.',
  description: 'Step into the mathematical heart of Artificial Intelligence. Unravel supervised and unsupervised learning, combat bias-variance tradeoffs, engineer high-yield features, and conquer the legendary Overfitting Titan.',
  iconName: 'BrainCircuit',
  level: 'Intermediate',
  category: 'Core AI',
  estimatedHours: 24,
  badge: 'Gradient Pioneer',
  accentColor: 'cyan',
  whatYouWillLearn: [
    'Distinguish supervised, unsupervised, and reinforcement learning paradigms',
    'Derive and implement Linear and Logistic Regression with gradient descent',
    'Train Decision Trees, Random Forests, and XGBoost gradient-boosted ensembles',
    'Cluster high-dimensional data with K-Means, DBSCAN, and hierarchical clustering',
    'Evaluate models with Confusion Matrices, ROC-AUC, Precision-Recall, and Cross-Validation',
    'Diagnose and cure overfitting with L1 Lasso, L2 Ridge, and early stopping regularization',
    'Execute end-to-end feature engineering, dimensionality reduction (PCA), and hyperparameter tuning'
  ],
  prerequisites: [
    'Basic Python programming (NumPy and Pandas basics recommended)',
    'High-school algebra and introductory statistics'
  ],
  skillsYouWillGain: [
    'Supervised Classification & Regression',
    'Ensemble Methods (Random Forest, XGBoost)',
    'Dimensionality Reduction & Clustering',
    'Cross-Validation & Hyperparameter Tuning',
    'Bias-Variance Diagnosis & Regularization'
  ],
  completionRequirements: [
    'Complete all 8 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Defeat the Overfitting Titan in the final boss raid arena'
  ],
  modules: [
    {
      id: 'ml-m1',
      moduleNumber: 1,
      title: 'ML Foundations & Core Paradigms',
      description: 'The machine learning spectrum: Supervised vs. Unsupervised vs. Reinforcement Learning, loss landscapes, and inductive bias.',
      difficulty: 'Beginner',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'ml-l1-paradigms',
          title: 'The Three Pillars of Machine Learning',
          description: 'Compare supervised learning (labeled ground truth), unsupervised learning (hidden patterns), and reinforcement learning (reward signals).',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Categorize any real-world AI problem into its correct learning paradigm.',
          explanation: 'Unlike rule-based expert systems where engineers write explicit if-else rules, machine learning algorithms formulate hypotheses by optimizing mathematical parameters over empirical data.',
          importantConcepts: [
            'Supervised Learning: Mapping inputs X to known labels y (regression & classification).',
            'Unsupervised Learning: Discovering inherent cluster or manifold structures without labels.',
            'Reinforcement Learning: Agents learning policy behaviors through environment interactions and reward signals.'
          ],
          keyPoints: [
            'Labeled data is often the most expensive bottleneck in enterprise AI.',
            'Unsupervised learning is commonly used to discover customer segments or detect anomalies.'
          ],
          codeExample: {
            language: 'python',
            code: `# Differentiating training signatures\n# Supervised: expects features X and ground-truth targets y\nsupervised_model.fit(X_train, y_train)\n\n# Unsupervised: expects only features X\nunsupervised_model.fit(X_unlabeled)`,
            explanation: 'Comparing API signatures for supervised vs unsupervised training.',
            output: 'Fitted Supervised and Unsupervised Estimators successfully.'
          },
          practicalExample: {
            title: 'Spam Filtering vs Customer Segmentation',
            scenario: 'Determine which paradigm applies to: (A) Tagging emails as Spam/Ham, (B) Grouping shoppers by purchasing patterns without pre-existing labels.',
            solution: '(A) Supervised Classification with historical spam labels.\n(B) Unsupervised Clustering (e.g. K-Means).'
          },
          quiz: {
            question: 'An autonomous robotic vacuum learning optimal room cleaning routes through trial and reward is an example of which paradigm?',
            options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Transfer Learning'],
            correctIndex: 2,
            explanation: 'Reinforcement Learning involves an agent discovering optimal actions via reward and penalty feedback in an environment.'
          },
          practiceChallenge: {
            prompt: 'Identify the input X and target y for a system that predicts house selling prices based on square footage and neighborhood.',
            starterCode: '# State X and y',
            solutionHint: 'X is feature attributes; y is continuous numerical target.',
            solutionCode: 'X = ["square_footage", "neighborhood_code"]\ny = "sale_price"'
          },
          relatedMissionId: 'm-04'
        },
        {
          id: 'ml-l2-loss-optimization',
          title: 'Cost Functions & Gradient Descent',
          description: 'Explore convex loss curves, learning rates, epochs, and iterative gradient descent optimization.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Calculate weight updates using the gradient of loss with respect to parameters.',
          explanation: 'Every machine learning model seeks to minimize a cost function. Gradient descent calculates the slope (derivative) of the loss surface and takes small steps in the direction of steepest descent.',
          importantConcepts: [
            'Cost Function: Mathematical metric measuring prediction error (e.g. MSE, Cross-Entropy).',
            'Learning Rate (Alpha): Step size scaling parameter for weight updates.',
            'Local vs Global Minima: Navigating multi-dimensional convex and non-convex surfaces.'
          ],
          keyPoints: [
            'A learning rate that is too high causes divergence or oscillation.',
            'A learning rate that is too low results in excessively slow convergence or getting trapped in saddle points.'
          ],
          codeExample: {
            language: 'python',
            code: `w = 10.0          # initial weight\nlr = 0.1          # learning rate\n# Loss = w^2 -> Derivative dL/dw = 2w\n\nfor step in range(5):\n    grad = 2 * w\n    w = w - lr * grad\n    loss = w ** 2\n    print(f"Step {step+1}: w = {w:.3f}, Loss = {loss:.4f}")`,
            explanation: '1D gradient descent optimization converging to the minimum at w = 0.',
            output: 'Step 1: w = 8.000, Loss = 64.0000\nStep 2: w = 6.400, Loss = 40.9600\nStep 3: w = 5.120, Loss = 26.2144\nStep 4: w = 4.096, Loss = 16.7772\nStep 5: w = 3.277, Loss = 10.7374'
          },
          practicalExample: {
            title: 'Learning Rate Tuning',
            scenario: 'Your training loss suddenly explodes to NaN or infinity after 10 epochs. What parameter should you adjust first?',
            solution: 'Immediately reduce the learning rate by a factor of 10 (e.g. from 0.1 to 0.01).'
          },
          quiz: {
            question: 'What is the update rule for weight W with gradient G and learning rate Alpha?',
            options: ['W = W + Alpha * G', 'W = W - Alpha * G', 'W = W / (Alpha * G)', 'W = Alpha * (W - G)'],
            correctIndex: 1,
            explanation: 'We step in the opposite direction of the gradient to minimize the cost: W_new = W - Alpha * G.'
          },
          practiceChallenge: {
            prompt: 'Given current weight w = 4, learning rate = 0.05, and gradient dL/dw = 12, calculate the updated weight.',
            starterCode: 'w = 4\nlr = 0.05\ngrad = 12\n# w_new = ?',
            solutionHint: 'Subtract (lr * grad) from w.',
            solutionCode: 'w_new = 4 - (0.05 * 12)\n# w_new = 3.4'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m2',
      moduleNumber: 2,
      title: 'Data Preparation & Cleaning',
      description: 'Imputation strategies, handling outliers, skewness transformations, and categorical encoding.',
      difficulty: 'Beginner',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'ml-l3-imputation',
          title: 'Missing Values & Outlier Detection',
          description: 'Mean, median, mode, and KNN imputation alongside IQR and Z-score outlier filtering.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Clean incomplete tabular datasets without introducing statistical distortion.',
          explanation: 'Real datasets have missing records and sensor corruptions. Blindly dropping rows reduces statistical power, while poor imputation skews the feature distribution.',
          importantConcepts: [
            'MCAR vs MAR: Missing Completely at Random vs Missing at Random.',
            'Median Imputation: Robust against skewed distributions with extreme outliers.',
            'Interquartile Range (IQR): Detecting anomalies beyond Q1 - 1.5*IQR or Q3 + 1.5*IQR.'
          ],
          keyPoints: [
            'Use median for skewed data like income or housing prices.',
            'Never impute test data using test set parameters; always use the training statistics.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.impute import SimpleImputer\nimport numpy as np\n\nX_raw = np.array([[12.0, np.nan], [np.nan, 300.0], [15.0, 310.0], [14.0, 290.0]])\n\nimputer = SimpleImputer(strategy='median')\nX_clean = imputer.fit_transform(X_raw)\nprint("Cleaned Matrix:\\n", X_clean)`,
            explanation: 'Using SimpleImputer with median strategy to replace NaN entries.',
            output: 'Cleaned Matrix:\n [[ 12.  300.]\n [ 14.  300.]\n [ 15.  310.]\n [ 14.  290.]]'
          },
          practicalExample: {
            title: 'Z-score Outlier Threshold',
            scenario: 'Flag observations that lie more than 3 standard deviations away from the mean.',
            solution: 'z_scores = (df["val"] - df["val"].mean()) / df["val"].std()\noutliers = df[abs(z_scores) > 3.0]'
          },
          quiz: {
            question: 'Why is median imputation generally favored over mean imputation for heavily skewed financial features?',
            options: [
              'Mean is computationally impossible in Python',
              'Median is resistant to being pulled by extreme outliers',
              'Median produces integer values only',
              'Median scales the variance to 1.0'
            ],
            correctIndex: 1,
            explanation: 'The median is a non-parametric statistic unaffected by extreme outliers in the tails of the distribution.'
          },
          practiceChallenge: {
            prompt: 'Write an imputer call using scikit-learn SimpleImputer with strategy="most_frequent" for categorical columns.',
            starterCode: 'from sklearn.impute import SimpleImputer\n# your code',
            solutionHint: 'Pass strategy="most_frequent" to SimpleImputer.',
            solutionCode: 'imputer = SimpleImputer(strategy="most_frequent")\nX_imputed = imputer.fit_transform(X)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m3',
      moduleNumber: 3,
      title: 'Supervised Learning: Regression & Classification',
      description: 'Linear Regression, Logistic Regression, Decision Trees, K-Nearest Neighbors, and Support Vector Machines.',
      difficulty: 'Intermediate',
      estimatedMinutes: 150,
      xpReward: 250,
      lessons: [
        {
          id: 'ml-l4-regression',
          title: 'Linear & Polynomial Regression',
          description: 'Ordinary least squares, residual sum of squares, and modeling non-linear curves with polynomial basis expansion.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Fit regression lines and interpret model coefficients and R-squared metrics.',
          explanation: 'Linear regression estimates the linear relationship between continuous dependent target y and independent features X by minimizing Residual Sum of Squares (RSS).',
          importantConcepts: [
            'Hypothesis: y_hat = w0 + w1*x1 + w2*x2 + ...',
            'R-Squared Score: Proportion of variance explained by model (1.0 = perfect fit).',
            'Polynomial Features: Transforming X into [X, X^2, X^3] to fit curves.'
          ],
          keyPoints: [
            'Coefficients indicate the expected change in target per unit change in feature, assuming other features stay constant.',
            'High-degree polynomials quickly lead to severe overfitting.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX = np.array([[1], [2], [3], [4], [5]])\ny = np.array([2.1, 4.2, 5.9, 8.1, 9.9])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\n\nprint(f"Slope (Weight): {model.coef_[0]:.2f}")\nprint(f"Intercept (Bias): {model.intercept_:.2f}")\nprint(f"Prediction for x=6: {model.predict([[6]])[0]:.2f}")`,
            explanation: 'Fitting a simple linear model and calculating future predictions.',
            output: 'Slope (Weight): 1.96\nIntercept (Bias): 0.14\nPrediction for x=6: 11.90'
          },
          practicalExample: {
            title: 'House Price Estimation',
            scenario: 'Predict property price given area in sqft and bedrooms.',
            solution: 'model.fit(df[["sqft", "bedrooms"]], df["price"])'
          },
          quiz: {
            question: 'What does an R-squared value of 0.85 signify?',
            options: [
              '85% of predictions were completely wrong',
              '85% of the variance in the target variable is explained by the input features',
              'The model accuracy is 85% on binary classification',
              'The learning rate converged 85% of the way'
            ],
            correctIndex: 1,
            explanation: 'R-squared (coefficient of determination) quantifies the percentage of target variance captured by the regression model.'
          },
          practiceChallenge: {
            prompt: 'Fit a LinearRegression model on training data and print its R-squared score using the .score() method.',
            starterCode: 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\n# fit and score',
            solutionHint: 'Call model.fit(X_train, y_train) and then model.score(X_test, y_test).',
            solutionCode: 'model.fit(X_train, y_train)\nr2 = model.score(X_test, y_test)\nprint(f"R2: {r2:.4f}")'
          },
          relatedMissionId: 'm-04'
        },
        {
          id: 'ml-l5-classification',
          title: 'Logistic Regression & Decision Trees',
          description: 'Sigmoid activation, binary log-loss, decision boundaries, Gini impurity, and tree splitting.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Construct decision trees and logistic regressors for binary and multi-class classification.',
          explanation: 'Logistic Regression uses the sigmoid function to squash real-valued outputs into a probability between 0 and 1. Decision Trees recursively split feature spaces to maximize information gain.',
          importantConcepts: [
            'Sigmoid Function: 1 / (1 + e^-z) mapping unbounded scores to probabilities.',
            'Gini Impurity: Measurement of class label mixture in a node (0.0 = pure).',
            'Tree Depth: Maximum number of split levels controlling model complexity.'
          ],
          keyPoints: [
            'Unconstrained decision trees will memorize training data and overfit (depth must be pruned).',
            'Logistic regression provides well-calibrated class probabilities.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.tree import DecisionTreeClassifier\nimport numpy as np\n\nX = [[25, 50000], [45, 120000], [35, 80000], [22, 25000]]\ny = [0, 1, 1, 0] # 0 = No purchase, 1 = Purchase\n\nclf = DecisionTreeClassifier(max_depth=2, random_state=42)\nclf.fit(X, y)\n\nprint("Prediction for [30, 90000]:", clf.predict([[30, 90000]])[0])`,
            explanation: 'Training a shallow Decision Tree with max_depth=2 to prevent overfitting.',
            output: 'Prediction for [30, 90000]: 1'
          },
          practicalExample: {
            title: 'Credit Risk Decision Boundary',
            scenario: 'Classify loan applicants as Low vs High default risk.',
            solution: 'probs = model.predict_proba(applicant_features)[:, 1]\nis_approved = probs < 0.25'
          },
          quiz: {
            question: 'What is the Gini impurity of a decision tree node containing 50 positive samples and 0 negative samples?',
            options: ['0.5', '1.0', '0.0', '0.25'],
            correctIndex: 2,
            explanation: 'A completely homogeneous (pure) node has a Gini impurity of 0.0.'
          },
          practiceChallenge: {
            prompt: 'Instantiate a DecisionTreeClassifier with max_depth=3 and min_samples_leaf=5.',
            starterCode: 'from sklearn.tree import DecisionTreeClassifier\n# instantiate clf',
            solutionHint: 'Pass max_depth=3 and min_samples_leaf=5 as keyword arguments.',
            solutionCode: 'clf = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m4',
      moduleNumber: 4,
      title: 'Unsupervised Learning & Clustering',
      description: 'K-Means clustering, the Elbow Method, Silhouette scores, DBSCAN density clustering, and PCA.',
      difficulty: 'Intermediate',
      estimatedMinutes: 120,
      xpReward: 200,
      lessons: [
        {
          id: 'ml-l6-kmeans',
          title: 'K-Means Clustering & The Elbow Method',
          description: 'Centroid initialization, Expectation-Maximization iteration, inertia metrics, and K selection.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Cluster unlabelled records and determine optimal cluster count K.',
          explanation: 'K-Means alternates between assigning points to the nearest centroid and recomputing centroids as the mean of assigned points until convergence.',
          importantConcepts: [
            'Inertia: Sum of squared distances from samples to their closest cluster center.',
            'Elbow Method: Plotting inertia vs K to find the point of diminishing returns.',
            'K-Means++: Smart centroid initialization to prevent sub-optimal local minima.'
          ],
          keyPoints: [
            'Features must be scaled before K-Means, or large-scale features will dominate Euclidean distance.',
            'K-Means assumes spherical, equally-sized clusters.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.cluster import KMeans\nimport numpy as np\n\nX = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]])\nkmeans = KMeans(n_clusters=2, init='k-means++', random_state=42)\nkmeans.fit(X)\n\nprint("Cluster Centers:\\n", kmeans.cluster_centers_)\nprint("Labels:", kmeans.labels_)`,
            explanation: 'Partitioning 6 2D points into 2 distinct clusters using K-Means++.',
            output: 'Cluster Centers:\n [[ 1.  2.]\n [10.  2.]]\nLabels: [0 0 0 1 1 1]'
          },
          practicalExample: {
            title: 'Customer Segmentation',
            scenario: 'Segment retail customers into VIP, Bargain Hunter, and Occasional groups.',
            solution: 'segments = kmeans.predict(customer_rfm_features)'
          },
          quiz: {
            question: 'Why is feature scaling essential before executing K-Means clustering?',
            options: [
              'K-Means fails to converge on integers',
              'Euclidean distance is sensitive to differing numerical feature scales',
              'Scaling removes negative numbers',
              'It converts the data into a normal distribution'
            ],
            correctIndex: 1,
            explanation: 'Because distance is computed in multi-dimensional space, an unscaled feature like salary ($100,000) would completely overwhelm age (30).'
          },
          practiceChallenge: {
            prompt: 'Compute the silhouette score for a K-Means model with 3 clusters.',
            starterCode: 'from sklearn.metrics import silhouette_score\n# score = ?',
            solutionHint: 'Call silhouette_score(X, kmeans.labels_).',
            solutionCode: 'from sklearn.metrics import silhouette_score\nscore = silhouette_score(X, kmeans.labels_)\nprint(f"Silhouette: {score:.3f}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m5',
      moduleNumber: 5,
      title: 'Model Evaluation & Validation',
      description: 'Confusion matrix, precision, recall, F1-score, ROC-AUC, and K-Fold cross-validation.',
      difficulty: 'Intermediate',
      estimatedMinutes: 120,
      xpReward: 200,
      lessons: [
        {
          id: 'ml-l7-metrics',
          title: 'Classification Metrics Beyond Accuracy',
          description: 'Why accuracy fails on imbalanced data: False Positives, False Negatives, Precision vs Recall.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Select the optimal metric for cancer screening, fraud detection, and spam classification.',
          explanation: 'In a dataset where 99.9% of transactions are legitimate, a dummy model that always predicts "Not Fraud" achieves 99.9% accuracy but catches zero fraud! Precision and Recall expose the real model performance.',
          importantConcepts: [
            'Precision: Of all predicted positives, how many were truly positive? (TP / [TP + FP])',
            'Recall (Sensitivity): Of all actual positives, how many did we catch? (TP / [TP + FN])',
            'F1-Score: Harmonic mean of precision and recall (2 * P * R / [P + R]).'
          ],
          keyPoints: [
            'Prioritize Recall when false negatives are catastrophic (e.g. tumor detection).',
            'Prioritize Precision when false positives are disruptive (e.g. automated spam blocking).'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.metrics import classification_report, confusion_matrix\n\ny_true = [0, 0, 0, 1, 1, 1, 1, 0, 1, 0]\ny_pred = [0, 0, 1, 1, 1, 1, 0, 0, 1, 0]\n\nprint("Confusion Matrix:\\n", confusion_matrix(y_true, y_pred))\nprint("\\nMetrics:\\n", classification_report(y_true, y_pred, target_names=["Ham", "Spam"]))`,
            explanation: 'Detailed classification breakdown demonstrating Precision, Recall, and F1.',
            output: 'Confusion Matrix:\n [[4 1]\n [1 4]]\n\nMetrics:\n               precision    recall  f1-score   support\n         Ham       0.80      0.80      0.80         5\n        Spam       0.80      0.80      0.80         5'
          },
          practicalExample: {
            title: 'Medical Diagnostics Metric',
            scenario: 'Should a medical clinic prioritize Precision or Recall for early malignancy alerts?',
            solution: 'Recall. Missing an actual malignancy (False Negative) has devastating consequences compared to ordering a confirmation test (False Positive).'
          },
          quiz: {
            question: 'What is the formula for Precision in a binary classification test?',
            options: [
              'TP / (TP + FN)',
              'TP / (TP + FP)',
              '(TP + TN) / Total',
              'TN / (TN + FP)'
            ],
            correctIndex: 1,
            explanation: 'Precision measures true positives divided by all instances the model predicted positive (TP + FP).'
          },
          practiceChallenge: {
            prompt: 'Compute the 5-fold cross-validation accuracy scores for an estimator clf on dataset X, y.',
            starterCode: 'from sklearn.model_selection import cross_val_score\n# scores = ?',
            solutionHint: 'cross_val_score(clf, X, y, cv=5)',
            solutionCode: 'from sklearn.model_selection import cross_val_score\nscores = cross_val_score(clf, X, y, cv=5)\nprint(f"Mean CV: {scores.mean():.3f}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m6',
      moduleNumber: 6,
      title: 'Feature Engineering & Regularization',
      description: 'L1 Lasso, L2 Ridge, ElasticNet, polynomial interactions, and Principal Component Analysis (PCA).',
      difficulty: 'Advanced',
      estimatedMinutes: 140,
      xpReward: 250,
      lessons: [
        {
          id: 'ml-l8-regularization',
          title: 'Combating Overfitting: Ridge & Lasso',
          description: 'Shrinkage penalties, sparsity with L1, weight dampening with L2, and the bias-variance tradeoff.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Apply L1 and L2 penalties to prevent weights from exploding on noisy features.',
          explanation: 'Overfitting occurs when a model fits noise rather than signal. Regularization adds a penalty term proportional to weight magnitude into the loss function, forcing the model to favor simpler hypotheses.',
          importantConcepts: [
            'L2 Ridge Penalty: Adds sum of squared weights (alpha * sum(w^2)), shrinking weights smoothly.',
            'L1 Lasso Penalty: Adds sum of absolute weights (alpha * sum(|w|)), driving irrelevant weights to exactly zero.',
            'Bias-Variance Tradeoff: Increasing regularization increases bias while substantially reducing variance.'
          ],
          keyPoints: [
            'Lasso acts as an automatic feature selector by zeroing coefficients.',
            'Tune alpha via RidgeCV or LassoCV with cross-validation.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.linear_model import Lasso\nimport numpy as np\n\nX_noisy = np.array([[1, 2, 99], [2, 4, 101], [3, 6, 98], [4, 8, 102]])\ny = np.array([3, 6, 9, 12]) # true relation: y = 1*x1 + 1*x2\n\nlasso = Lasso(alpha=0.5)\nlasso.fit(X_noisy, y)\nprint("Lasso Coefficients:", lasso.coef_.round(2))`,
            explanation: 'Lasso zeroing the third noisy irrelevant feature automatically.',
            output: 'Lasso Coefficients: [1.21 0.39 -0.  ]'
          },
          practicalExample: {
            title: 'Collinear Financial Predictors',
            scenario: 'You have 500 economic indicators that are highly correlated. Prevent numerical instability.',
            solution: 'Apply Ridge regression (L2 regularization) to stabilize correlated coefficients.'
          },
          quiz: {
            question: 'Which regularization technique has the unique property of driving irrelevant weights exactly to zero?',
            options: ['L2 Ridge', 'L1 Lasso', 'Dropout', 'Batch Normalization'],
            correctIndex: 1,
            explanation: 'Due to the diamond geometry of the L1 penalty norm, optimal solutions frequently hit coordinate axes, setting weights to zero.'
          },
          practiceChallenge: {
            prompt: 'Write a pipeline using PCA to reduce a 100-dimensional dataset to 10 principal components.',
            starterCode: 'from sklearn.decomposition import PCA\n# pca = ?',
            solutionHint: 'Use PCA(n_components=10).fit_transform(X).',
            solutionCode: 'from sklearn.decomposition import PCA\npca = PCA(n_components=10)\nX_reduced = pca.fit_transform(X)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m7',
      moduleNumber: 7,
      title: 'ML Project — Churn Prediction System',
      description: 'Build, evaluate, and tune an enterprise customer churn prediction pipeline with Random Forest & XGBoost.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Customer Churn Early Warning System',
        description: 'Clean an authentic customer dataset, engineer behavioral frequency features, train an ensemble classifier, and evaluate ROC-AUC.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'ml-l9-capstone-project',
          title: 'Ensemble Modeling & Hyperparameter Grid Search',
          description: 'Bagging, boosting, GridSearchCV, and model calibration for production deployment.',
          estimatedMinutes: 35,
          xpReward: 25,
          learningObjective: 'Implement a cross-validated Random Forest with hyperparameter search.',
          explanation: 'Ensemble methods combine predictions from dozens of diverse weak learners to achieve a robust, high-performing meta-model with low variance.',
          importantConcepts: [
            'Random Forest: Bagging of decorrelated decision trees using random feature subsets.',
            'GridSearchCV: Exhaustive automated search over hyperparameter combinations.',
            'Feature Importances: Extracting Gini importance to understand key model drivers.'
          ],
          keyPoints: [
            'Random Forests rarely overfit severely compared to individual deep trees.',
            'Always inspect feature importances to ensure models are not exploiting data artifacts.'
          ],
          codeExample: {
            language: 'python',
            code: `from sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\nX_train = np.random.randn(100, 4)\ny_train = np.random.randint(0, 2, 100)\n\nrf = RandomForestClassifier(n_estimators=50, max_depth=4, random_state=42)\nrf.fit(X_train, y_train)\nprint("Feature Importances:", rf.feature_importances_.round(3))`,
            explanation: 'Training an ensemble of 50 trees and extracting feature importances.',
            output: 'Feature Importances: [0.245 0.312 0.198 0.245]'
          },
          practicalExample: {
            title: 'Hyperparameter Tuning with GridSearch',
            scenario: 'Find the best combination of max_depth and n_estimators.',
            solution: 'from sklearn.model_selection import GridSearchCV\ngrid = GridSearchCV(rf, {"max_depth": [3, 5], "n_estimators": [50, 100]}, cv=3)\ngrid.fit(X, y)'
          },
          quiz: {
            question: 'What mechanism allows Random Forests to decorrelate individual decision trees?',
            options: [
              'Training on different hardware nodes',
              'Subsampling both data rows (bootstrap) and feature columns at each split',
              'Using different learning rates for each tree',
              'Adding random noise to target labels'
            ],
            correctIndex: 1,
            explanation: 'Random Forests use bootstrap aggregation (bagging) and randomly select a subset of features at each node split.'
          },
          practiceChallenge: {
            prompt: 'Complete the project milestone and prepare to enter the Boss Arena.',
            starterCode: '# Review and verify your Machine Learning mastery',
            solutionHint: 'Verify all modules from linear models through regularization and ensembles.',
            solutionCode: 'print("Machine Learning Foundations Solidified! Advancing to Boss Raid.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ml-m8',
      moduleNumber: 8,
      title: 'Final Boss Arena — The Overfitting Titan',
      description: 'Face the Colossus in the ML Citadel: diagnose overfitted curves, apply regularizers, and liberate the neural realm.',
      difficulty: 'Advanced',
      estimatedMinutes: 60,
      xpReward: 500,
      bossBattle: {
        bossId: 'boss-ml',
        bossName: 'The Overfitting Titan',
        xpReward: 500
      },
      lessons: [
        {
          id: 'ml-l10-boss-prep',
          title: 'Boss Raid Briefing: The Overfitting Titan',
          description: 'Tactical preparation for the Overfitting Titan encounter: battle strategies and concept review.',
          estimatedMinutes: 20,
          xpReward: 30,
          learningObjective: 'Review all core defensive counters against the Titan: regularization, pruning, and validation split.',
          explanation: 'The Titan feeds on 100% training accuracy and zero generalization capability. Only explorers armed with L1/L2 penalties, K-Fold cross validation, and tree pruning can pierce its mathematical armor.',
          importantConcepts: [
            'Titan Vulnerability 1: L2 Ridge Shrinkage dampens its explosive weights.',
            'Titan Vulnerability 2: Tree Pruning breaks its memorization branches.',
            'Titan Vulnerability 3: K-Fold Cross-Validation reveals its hidden validation error.'
          ],
          keyPoints: [
            'Inspect training vs validation loss curves to detect widening gaps.',
            'A 100% training score paired with a 45% test score is the hallmark of the Overfitter.'
          ],
          codeExample: {
            language: 'python',
            code: `# The Titan's Weakness: Regularization Parameter\noverfitted_model = DecisionTreeClassifier(max_depth=None) # TITAN MODE\ncured_model = DecisionTreeClassifier(max_depth=4, min_samples_leaf=10) # EXPLORER DEFENSE\nprint("Defense configured. Enter the Boss Arena!")`,
            explanation: 'Restraining model complexity to disarm the Titan.',
            output: 'Defense configured. Enter the Boss Arena!'
          },
          practicalExample: {
            title: 'Boss Arena Quick Launch',
            scenario: 'Engage the Overfitting Titan directly in the combat raid arena.',
            solution: 'Navigate to /boss/boss-ml to launch the interactive live encounter.'
          },
          quiz: {
            question: 'What is the definitive symptom of a model under the curse of the Overfitting Titan?',
            options: [
              'Training error is very high and test error is very high',
              'Training error is near zero while test error is dramatically high',
              'The learning rate is zero',
              'The model runs out of memory during initialization'
            ],
            correctIndex: 1,
            explanation: 'High variance / overfitting is characterized by near-zero training error but terrible generalization on unseen test data.'
          },
          practiceChallenge: {
            prompt: 'Declare your readiness to face the Overfitting Titan!',
            starterCode: '# Enter Arena',
            solutionHint: 'Prepare for raid questions covering learning rates, loss functions, and regularization.',
            solutionCode: 'print("READY FOR BATTLE: Overfitting Titan Arena Unlocked.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
