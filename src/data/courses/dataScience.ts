import { Course } from './types';

export const dataScienceCourse: Course = {
  id: 'data-science',
  title: 'Data Science',
  shortDescription: 'The complete data lifecycle: collection, ETL wrangling, statistical hypothesis testing, interactive visualization, and predictive modeling.',
  description: 'Transform raw, chaotic data streams into decisive empirical intelligence. Master hypothesis testing, exploratory data analysis (EDA), multi-variable statistical distributions, feature engineering, and high-impact dashboards.',
  iconName: 'BarChart2',
  level: 'Beginner',
  category: 'Analytics & Insight',
  estimatedHours: 24,
  badge: 'Data Alchemist',
  accentColor: 'emerald',
  whatYouWillLearn: [
    'Execute the full CRISP-DM data science lifecycle from problem framing to deployment',
    'Extract data from REST APIs, SQL databases, and web scrapers with BeautifulSoup',
    'Clean dirty, inconsistent data with robust outlier and imputation pipelines',
    'Perform Exploratory Data Analysis (EDA) uncovering hidden correlations and trends',
    'Conduct parametric and non-parametric statistical hypothesis tests (t-test, ANOVA, Chi-square)',
    'Create publication-ready visual storytelling with Matplotlib, Seaborn, and Plotly',
    'Build and evaluate predictive machine learning benchmarks for business decisions'
  ],
  prerequisites: [
    'Basic Python literacy (variables, loops, and lists)',
    'High school mathematics & arithmetic'
  ],
  skillsYouWillGain: [
    'SQL & Data Wrangling (Pandas)',
    'Statistical Hypothesis Testing (p-values, z-scores)',
    'Exploratory Data Analysis (EDA)',
    'Data Storytelling & Visualizations',
    'Predictive Modeling & A/B Testing'
  ],
  completionRequirements: [
    'Complete all 8 modules and interactive lessons',
    'Pass all mini-quizzes',
    'Deliver the end-to-end Data Science Capstone Project'
  ],
  modules: [
    {
      id: 'ds-m1',
      moduleNumber: 1,
      title: 'Data Science Foundations & Lifecycle',
      description: 'The CRISP-DM methodology, framing business problems, data ethics, and reproducible research.',
      difficulty: 'Beginner',
      estimatedMinutes: 80,
      xpReward: 200,
      lessons: [
        {
          id: 'ds-l1-lifecycle',
          title: 'The CRISP-DM Lifecycle & Problem Framing',
          description: 'Business understanding, data exploration, modeling, evaluation, and deployment loops.',
          estimatedMinutes: 20,
          xpReward: 20,
          learningObjective: 'Structure real-world business challenges into measurable data science problems.',
          explanation: 'Data science is not just writing code; it is a structured scientific discipline. The CRISP-DM (Cross-Industry Standard Process for Data Mining) model establishes 6 iterative phases that ensure models deliver tangible ROI rather than remaining academic toys.',
          importantConcepts: [
            'CRISP-DM Phases: Business Understanding -> Data Understanding -> Data Prep -> Modeling -> Evaluation -> Deployment.',
            'Target Metric Alignment: Translating "increase profits" into "minimize false negative churn predictions".',
            'Reproducibility: Versioning code, environment dependencies, and random seeds.'
          ],
          keyPoints: [
            'Spend at least 30% of your time on problem definition before touching data.',
            'Correlation does not imply causation; beware of confounding variables.'
          ],
          codeExample: {
            language: 'python',
            code: `project_charter = {\n    "business_goal": "Reduce customer churn by 15%",\n    "target_metric": "ROC-AUC > 0.85 on test holdout",\n    "decision_threshold": 0.35,\n    "baseline_accuracy": 0.72\n}\nprint("Data Science Project Charter Formatted.")`,
            explanation: 'Structuring an empirical problem charter.',
            output: 'Data Science Project Charter Formatted.'
          },
          practicalExample: {
            title: 'Metric Selection',
            scenario: 'Should an e-commerce business prioritize click-through rate (CTR) or average order value (AOV)?',
            solution: 'Align on Revenue Per Visitor (RPV) which combines both CTR and AOV into a single metric.'
          },
          quiz: {
            question: 'In the CRISP-DM process, what should happen if model evaluation reveals the solution fails business criteria?',
            options: [
              'Deploy it anyway to meet deadline',
              'Iterate back to Business Understanding or Data Preparation to reframe features and requirements',
              'Delete the database',
              'Add more GPUs'
            ],
            correctIndex: 1,
            explanation: 'CRISP-DM is an iterative cycle; failure at evaluation informs adjustments in earlier stages.'
          },
          practiceChallenge: {
            prompt: 'Name the 6 phases of the CRISP-DM cycle in chronological order.',
            starterCode: '# phases = []',
            solutionHint: 'Business, Data Understanding, Data Prep, Modeling, Evaluation, Deployment.',
            solutionCode: 'phases = ["Business", "Data Understanding", "Data Prep", "Modeling", "Evaluation", "Deployment"]\nprint(" -> ".join(phases))'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m2',
      moduleNumber: 2,
      title: 'Data Collection & SQL Wrangling',
      description: 'Querying relational databases with SQL (SELECT, JOIN, GROUP BY), REST API integration, and web scraping.',
      difficulty: 'Beginner',
      estimatedMinutes: 100,
      xpReward: 200,
      lessons: [
        {
          id: 'ds-l2-sql-queries',
          title: 'SQL for Data Analysts & Aggregations',
          description: 'Writing performant SQL joins, window functions (ROW_NUMBER, LAG), and group-by summaries.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Extract and aggregate multi-table records using relational SQL joins and window functions.',
          explanation: 'Over 80% of enterprise data lives in SQL relational warehouses (Snowflake, BigQuery, PostgreSQL). Knowing how to filter, aggregate, and join records directly at the database layer saves massive memory and network bandwidth.',
          importantConcepts: [
            'JOIN Types: INNER, LEFT, RIGHT, and FULL OUTER joins.',
            'Aggregations: GROUP BY with COUNT, SUM, AVG, and HAVING clauses.',
            'Window Functions: Computing running totals and ranks without collapsing rows.'
          ],
          keyPoints: [
            'Filter with WHERE before grouping, and filter aggregated groups with HAVING.',
            'Indexing primary and foreign keys speeds up join performance by 100x.'
          ],
          codeExample: {
            language: 'sql',
            code: `SELECT \n    u.tier,\n    COUNT(o.id) AS total_orders,\n    ROUND(AVG(o.amount), 2) AS avg_order_val\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.created_at >= '2026-01-01'\nGROUP BY u.tier\nHAVING COUNT(o.id) > 10\nORDER BY avg_order_val DESC;`,
            explanation: 'Production SQL aggregation joining users and orders with date filtering.',
            output: 'tier | total_orders | avg_order_val\nPro  | 1420         | 189.50\nFree | 480          | 24.99'
          },
          practicalExample: {
            title: 'Churned Users Query',
            scenario: 'Find all users whose last login was over 90 days ago.',
            solution: 'SELECT id, email FROM users WHERE last_login < CURRENT_DATE - INTERVAL \'90 days\''
          },
          quiz: {
            question: 'What is the main difference between the WHERE clause and the HAVING clause in SQL?',
            options: [
              'WHERE applies to columns with text; HAVING applies to numbers',
              'WHERE filters rows before aggregation; HAVING filters groups after aggregation',
              'WHERE is only used with SQLite',
              'HAVING cannot use comparison operators'
            ],
            correctIndex: 1,
            explanation: 'WHERE filters individual records prior to the GROUP BY; HAVING filters the resulting aggregated groups.'
          },
          practiceChallenge: {
            prompt: 'Write an SQL query snippet to find the number of unique customers in the orders table.',
            starterCode: 'SELECT -- your code here -- FROM orders;',
            solutionHint: 'Use COUNT(DISTINCT customer_id).',
            solutionCode: 'SELECT COUNT(DISTINCT customer_id) FROM orders;'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m3',
      moduleNumber: 3,
      title: 'Data Cleaning & Transformation',
      description: 'Imputing missing values, deduplication, date-time parsing, string normalization, and type coercion.',
      difficulty: 'Intermediate',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'ds-l3-cleaning',
          title: 'Wrangling Messy Data in Pandas',
          description: 'Detecting corrupted entries, parsing timezone-aware timestamps, and regex text cleanup.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Build automated data cleaning scripts that transform raw dirty CSVs into clean dataframes.',
          explanation: 'Real datasets contain inconsistent dates ("2026/01/02" vs "Jan 2, 2026"), trailing currency symbols ("$12,450.00"), and missing coordinates. Systematic cleaning ensures mathematical modeling does not fail on dirty strings.',
          importantConcepts: [
            'Type Coercion: pd.to_numeric(errors="coerce") turning invalid strings to NaN.',
            'Datetime Parsing: pd.to_datetime() extracting day_of_week, month, and hour features.',
            'Deduplication: df.drop_duplicates(subset=["id"], keep="last").'
          ],
          keyPoints: [
            'Always inspect df.dtypes before attempting mathematical calculations.',
            'Never hardcode row index numbers; use robust column filters.'
          ],
          codeExample: {
            language: 'python',
            code: `import pandas as pd\n\nraw_data = {"price": ["$12.50", " $18.00 ", "N/A", "$9.99"]}\ndf = pd.DataFrame(raw_data)\n\n# Clean currency strings to floats\ndf["clean_price"] = (\n    df["price"]\n    .str.replace("$", "", regex=False)\n    .str.strip()\n)\ndf["clean_price"] = pd.to_numeric(df["clean_price"], errors="coerce")\nprint(df)`,
            explanation: 'Cleaning currency text into floating-point numbers.',
            output: '     price  clean_price\n0   $12.50        12.50\n1  $18.00         18.00\n2      N/A          NaN\n3    $9.99         9.99'
          },
          practicalExample: {
            title: 'Timezone Normalization',
            scenario: 'Convert international timestamps from UTC to US/Eastern local time.',
            solution: 'df["time"] = pd.to_datetime(df["time"]).dt.tz_convert("US/Eastern")'
          },
          quiz: {
            question: 'What does the parameter errors="coerce" do in pd.to_numeric()?',
            options: [
              'Throws an immediate exception on invalid values',
              'Converts unparseable strings into NaN (null) values gracefully',
              'Rounds numbers to the nearest integer',
              'Deletes the entire column'
            ],
            correctIndex: 1,
            explanation: 'Coerce replaces any string that cannot be parsed as a valid number with NaN.'
          },
          practiceChallenge: {
            prompt: 'Extract the day of the week name (e.g. "Monday") from a datetime column "timestamp" in Pandas.',
            starterCode: 'df["day_name"] = -- your code --',
            solutionHint: 'Use df["timestamp"].dt.day_name().',
            solutionCode: 'df["day_name"] = df["timestamp"].dt.day_name()'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m4',
      moduleNumber: 4,
      title: 'Exploratory Data Analysis (EDA)',
      description: 'Summary statistics, univariate distributions, bivariate relationships, correlation heatmaps, and pairplots.',
      difficulty: 'Intermediate',
      estimatedMinutes: 100,
      xpReward: 200,
      lessons: [
        {
          id: 'ds-l4-eda-insights',
          title: 'Uncovering Patterns with EDA',
          description: 'Pearson vs Spearman correlation, skewness metrics, boxplots for dispersion, and identifying multi-collinearity.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Formulate and test empirical hypotheses using exploratory data visualizers.',
          explanation: 'Exploratory Data Analysis (EDA) is the detective work of data science. By computing descriptive statistics and plotting distributions, we uncover hidden clusters, skewed tails, and data collection flaws before modeling.',
          importantConcepts: [
            'Pearson Correlation: Measures linear relationship (-1.0 to +1.0).',
            'Spearman Correlation: Measures monotonic relationships (handles non-linear rank orderings).',
            'Anscombe\'s Quartet: Proves why numerical summaries alone are insufficient without visual inspection.'
          ],
          keyPoints: [
            'High correlation between two input features indicates multi-collinearity.',
            'Inspect boxplots to check for skewness and long tail distributions.'
          ],
          codeExample: {
            language: 'python',
            code: `import pandas as pd\n\ndf = pd.DataFrame({\n    "experience": [1, 3, 5, 8, 12],\n    "salary": [45000, 60000, 85000, 110000, 150000],\n    "age": [23, 26, 29, 34, 41]\n})\ncorr_matrix = df.corr().round(2)\nprint("Correlation Matrix:\\n", corr_matrix)`,
            explanation: 'Generating Pearson correlation matrix across numerical features.',
            output: 'Correlation Matrix:\n             experience  salary   age\nexperience        1.00    0.99  0.99\nsalary            0.99    1.00  1.00\nage               0.99    1.00  1.00'
          },
          practicalExample: {
            title: 'Detecting Multi-Collinearity',
            scenario: 'Both "sqft_living" and "sqft_above" have a correlation of 0.98 in a housing model.',
            solution: 'Drop one or combine them to prevent variance inflation in linear regression coefficients.'
          },
          quiz: {
            question: 'What classic statistical demonstration proves that four completely different datasets can share identical mean, variance, and correlation?',
            options: ['Central Limit Theorem', "Anscombe's Quartet", 'Simpson\'s Paradox', 'Bayes Theorem'],
            correctIndex: 1,
            explanation: "Anscombe's Quartet demonstrates the critical necessity of visualizing data rather than relying solely on summary statistics."
          },
          practiceChallenge: {
            prompt: 'In Pandas, which method returns the 25th, 50th (median), and 75th percentiles of numerical columns?',
            starterCode: '# method_name = ?',
            solutionHint: 'df.describe()',
            solutionCode: 'method_name = "df.describe()"\nprint(method_name)'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m5',
      moduleNumber: 5,
      title: 'Applied Statistics & Hypothesis Testing',
      description: 'Probability distributions (Normal, Poisson, Binomial), Central Limit Theorem, p-values, t-tests, and A/B test design.',
      difficulty: 'Intermediate',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'ds-l5-ab-testing',
          title: 'A/B Testing & Statistical Significance',
          description: 'Null hypothesis, Type I & Type II errors, sample size calculation, p-values, and two-sample t-tests.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Design, execute, and interpret an online A/B experiment with statistically valid significance testing.',
          explanation: 'A/B testing is the gold standard for causal decision-making in tech. We formulate a Null Hypothesis (H0: no difference), choose significance level alpha (typically 0.05), and calculate whether observed differences are due to random noise or true treatment impact.',
          importantConcepts: [
            'Null Hypothesis (H0): Baseline assumption that variant B has no true effect compared to control A.',
            'p-value: Probability of observing the data (or more extreme) assuming the null hypothesis is true (p < 0.05 rejects H0).',
            'Type I Error (Alpha / False Positive): Rejecting null when it was true; Type II Error (Beta / False Negative): Failing to detect real effect.'
          ],
          keyPoints: [
            'Never stop an A/B test early just because it temporarily reaches p < 0.05 (peeking problem).',
            'Determine required sample size upfront via power analysis before launching experiments.'
          ],
          codeExample: {
            language: 'python',
            code: `from scipy import stats\nimport numpy as np\n\n# Control vs Variant Conversion Values (1 = Conversion, 0 = Drop)\ncontrol = np.array([1, 0, 0, 1, 0, 1, 0, 0, 1, 0] * 50)\nvariant = np.array([1, 1, 0, 1, 0, 1, 1, 0, 1, 0] * 50)\n\nt_stat, p_val = stats.ttest_ind(control, variant)\nprint(f"t-statistic: {t_stat:.3f}, p-value: {p_val:.4f}")\nprint("Statistically Significant (p < 0.05):", p_val < 0.05)`,
            explanation: 'Running a two-sample independent t-test on simulated conversion data.',
            output: 't-statistic: -2.314, p-value: 0.0208\nStatistically Significant (p < 0.05): True'
          },
          practicalExample: {
            title: 'Checkout Button Redesign',
            scenario: 'Did a new green checkout button improve conversions from 2.0% to 2.4% with statistical validity?',
            solution: 'Compute two-proportion z-test; if p < 0.05 and sample size exceeded power requirements, roll out variant.'
          },
          quiz: {
            question: 'What does a p-value of 0.03 mean in an A/B test evaluated at alpha = 0.05?',
            options: [
              'There is a 3% chance the experiment was hacked',
              'Assuming the null hypothesis is true, there is only a 3% probability of observing this result by chance, so we reject H0',
              'The variant is 3% better than control',
              'The model accuracy is 97%'
            ],
            correctIndex: 1,
            explanation: 'Since p (0.03) is less than alpha (0.05), the observed difference is statistically significant under the null hypothesis.'
          },
          practiceChallenge: {
            prompt: 'State the standard alpha threshold commonly used in industry for rejecting the null hypothesis.',
            starterCode: 'alpha = ?',
            solutionHint: '5 percent expressed as decimal.',
            solutionCode: 'alpha = 0.05\nprint(f"Significance Level: {alpha}")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m6',
      moduleNumber: 6,
      title: 'Data Visualization & Storytelling',
      description: 'Principles of visual perception (Edward Tufte), Matplotlib, Seaborn, interactive Plotly charts, and executive dashboards.',
      difficulty: 'Intermediate',
      estimatedMinutes: 90,
      xpReward: 200,
      lessons: [
        {
          id: 'ds-l6-visualization',
          title: 'Interactive Visual Storytelling',
          description: 'Choosing the right chart (scatter, bar, line, violin, treemap) and designing for cognitive clarity.',
          estimatedMinutes: 25,
          xpReward: 20,
          learningObjective: 'Build clean, high-impact interactive visualizations that effectively communicate data insights.',
          explanation: 'The best analysis is useless if stakeholders cannot understand it. Effective data visualization maximizes the data-ink ratio, utilizes color purposefully (diverging vs sequential palettes), and eliminates chartjunk.',
          importantConcepts: [
            'Data-to-Ink Ratio: Eliminating superfluous borders, 3D effects, and redundant gridlines.',
            'Color Accessibility: Using colorblind-friendly palettes (viridis, cividis) with high contrast.',
            'Interactive Tooltips: Providing deep drill-down details on hover without cluttering the primary canvas.'
          ],
          keyPoints: [
            'Use line charts for continuous time series; use bar charts for discrete categorical comparisons.',
            'Always label axes with clear units (e.g. "Revenue (USD in Millions)").'
          ],
          codeExample: {
            language: 'python',
            code: `# Matplotlib Clean Styling Template\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(6, 3))\nax.spines['top'].set_visible(False)\nax.spines['right'].set_visible(False)\nax.set_title("Customer Growth (2026)", fontsize=12, fontweight='bold')\nax.set_ylabel("Active Users (k)")\nprint("Clean minimal chart canvas configured.")`,
            explanation: 'Minimalist chart configuration maximizing the data-ink ratio.',
            output: 'Clean minimal chart canvas configured.'
          },
          practicalExample: {
            title: 'Executive KPI Visualizer',
            scenario: 'Present quarterly churn rate reduction to C-suite executives.',
            solution: 'Clean line chart showing actual vs target with shaded confidence intervals and key milestone callout markers.'
          },
          quiz: {
            question: 'Which chart type is best suited for displaying the distribution and potential outliers of a continuous numerical variable across multiple categories?',
            options: ['Pie Chart', 'Box Plot / Violin Plot', 'Donut Chart', 'Radar Chart'],
            correctIndex: 1,
            explanation: 'Box and violin plots show median, interquartile range (IQR), whiskers, and individual outlier points side by side.'
          },
          practiceChallenge: {
            prompt: 'Why should 3D pie charts be avoided in professional data science presentations?',
            starterCode: '# reason = ""',
            solutionHint: 'Perspective distortion makes slices in front look artificially larger than slices in back.',
            solutionCode: 'reason = "Perspective distortion skews visual area perception and misleads viewers."'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m7',
      moduleNumber: 7,
      title: 'Machine Learning for Data Scientists',
      description: 'Translating business goals into ML models: feature selection, training pipelines, business cost matrices, and SHAP explainability.',
      difficulty: 'Advanced',
      estimatedMinutes: 120,
      xpReward: 250,
      lessons: [
        {
          id: 'ds-l7-shap-explainability',
          title: 'Model Explainability with SHAP Values',
          description: 'Shapley values from cooperative game theory: explaining why a model made a specific individual prediction.',
          estimatedMinutes: 30,
          xpReward: 20,
          learningObjective: 'Calculate and visualize SHAP force plots to explain black-box model decisions to stakeholders.',
          explanation: 'Regulated industries (finance, healthcare, insurance) legally require algorithmic explainability. SHAP (SHapley Additive exPlanations) fairly attributes the difference between the base value and actual prediction across each input feature.',
          importantConcepts: [
            'Global Explainability: Which features drive overall model predictions across the entire population?',
            'Local Explainability: Why did the model deny a loan to applicant #4821 specifically?',
            'Shapley Efficiency: The sum of all feature attributions equals the total prediction offset.'
          ],
          keyPoints: [
            'TreeSHAP computes exact Shapley values for tree ensembles in polynomial time.',
            'SHAP summary plots show both feature importance and the directional impact (positive/negative).'
          ],
          codeExample: {
            language: 'python',
            code: `# SHAP Explainability Conceptual Output:\n# Base Prediction: 20% Churn Probability\n# + Feature 'Late Payments > 3': +25%\n# - Feature 'Long Tenured Customer (5 yrs)': -12%\n# Final Prediction: 33% Churn Probability\nprint("SHAP Local Attribution: Identified Late Payments as primary churn risk factor.")`,
            explanation: 'Additive feature attribution for individual model predictions.',
            output: 'SHAP Local Attribution: Identified Late Payments as primary churn risk factor.'
          },
          practicalExample: {
            title: 'Adverse Action Notice in Banking',
            scenario: 'Generate legally mandated reasons for a rejected credit application.',
            solution: 'Extract the top 3 features with highest negative SHAP values for that applicant.'
          },
          quiz: {
            question: 'What mathematical foundation guarantees fair feature attribution in SHAP values?',
            options: [
              'Euclidean geometry',
              'Cooperative Game Theory (Lloyd Shapley)',
              'K-Means clustering',
              'Boolean algebra'
            ],
            correctIndex: 1,
            explanation: 'SHAP adapts Nobel-prize winning cooperative game theory Shapley values to machine learning features.'
          },
          practiceChallenge: {
            prompt: 'If baseline churn is 0.15, feature A adds +0.08, and feature B subtracts -0.03, what is the final SHAP predicted probability?',
            starterCode: '# final_prob = ?',
            solutionHint: '0.15 + 0.08 - 0.03',
            solutionCode: 'final_prob = 0.15 + 0.08 - 0.03\nprint(f"Prediction: {final_prob:.2f}") # 0.20'
          },
          relatedMissionId: 'm-04'
        }
      ]
    },
    {
      id: 'ds-m8',
      moduleNumber: 8,
      title: 'Data Science Capstone Project',
      description: 'End-to-end data product: extract, clean, analyze, test statistical hypotheses, train predictive models, and deliver an interactive dashboard.',
      difficulty: 'Advanced',
      estimatedMinutes: 180,
      xpReward: 350,
      project: {
        title: 'Enterprise Customer Retention & Revenue Forecast Engine',
        description: 'Take a multi-million row transactional dataset from raw messy state to an executive interactive dashboard with predictive churn scoring.',
        xpReward: 350
      },
      lessons: [
        {
          id: 'ds-l8-capstone',
          title: 'Building the Data Science Product',
          description: 'Integrating SQL ETL, statistical testing, model tracking, and executive storytelling into a complete data deliverable.',
          estimatedMinutes: 30,
          xpReward: 25,
          learningObjective: 'Deliver a production-ready data science project report and interactive dashboard.',
          explanation: 'The capstone brings together every skill: acquiring data from SQL, wrangling nulls in Pandas, running rigorous A/B significance tests, training a cross-validated model, and communicating insights clearly.',
          importantConcepts: [
            'End-to-End Pipeline: Automating data extraction, feature generation, and scoring.',
            'Executive Summary: Highlighting financial impact and actionable recommendations.',
            'Monitoring & Drift: Tracking data distribution changes in production over time.'
          ],
          keyPoints: [
            'Lead with recommendations and business impact, not code syntax.',
            'Include confidence intervals on all projected revenue metrics.'
          ],
          codeExample: {
            language: 'python',
            code: `# Capstone Deliverable Checklist:\nchecklist = [\n    "1. SQL Data Extraction verified",\n    "2. Data Cleaning & Outlier Removal complete",\n    "3. Hypothesis Test passed (p < 0.01)",\n    "4. Predictive Model ROC-AUC: 0.89",\n    "5. Executive Dashboard ready for presentation"\n]\nfor item in checklist:\n    print(f"[OK] {item}")`,
            explanation: 'Comprehensive Data Science production readiness checklist.',
            output: '[OK] 1. SQL Data Extraction verified\n[OK] 2. Data Cleaning & Outlier Removal complete\n[OK] 3. Hypothesis Test passed (p < 0.01)\n[OK] 4. Predictive Model ROC-AUC: 0.89\n[OK] 5. Executive Dashboard ready for presentation'
          },
          practicalExample: {
            title: 'Project Portfolio Presentation',
            scenario: 'Present your completed Data Science project to senior stakeholders or interviewers.',
            solution: 'Walk through: Problem -> Hypotheses -> Data Discoveries -> Model Results -> Quantified Business Value.'
          },
          quiz: {
            question: 'What is the most critical element to communicate to executive stakeholders at the conclusion of a data science project?',
            options: [
              'The specific random seed used in Python',
              'Actionable business recommendations and quantified expected impact',
              'The CPU temperature during training',
              'The number of lines of code written'
            ],
            correctIndex: 1,
            explanation: 'Executive stakeholders care primarily about business decisions and measurable bottom-line value.'
          },
          practiceChallenge: {
            prompt: 'Complete your Data Science curriculum and celebrate your empirical mastery!',
            starterCode: '# Data Science certification ready',
            solutionHint: 'Confirm end-to-end understanding across SQL, statistics, EDA, and modeling.',
            solutionCode: 'print("Data Science Milestone Complete! Master of Empirical Intelligence.")'
          },
          relatedMissionId: 'm-04'
        }
      ]
    }
  ]
};
