import { TargetRole } from '../types';

export interface RoleConfig {
  role: TargetRole;
  shortLabel: string;
  badgeColor: string;
  description: string;
  sampleBullets: string[];
  sampleDescription: string;
  coreKeywords: string[];
  sampleJdTitle: string;
  sampleJdText: string;
}

export const SAMPLE_FULL_RESUME_TEXT = `ARYAN LAMBA
aryan.lamba@university.edu | +91 98765 43210 | linkedin.com/in/aryanlamba | github.com/aryanlamba | New Delhi, India

PROFESSIONAL SUMMARY
Final-year B.Tech Computer Science student with product management and full-stack software experience. Proven track record of improving user onboarding retention, analyzing customer journey funnels, and delivering open-source climate tech solutions across agile cross-functional pods.

WORK EXPERIENCE
Associate Product Management Intern | Insanger Technologies (Jan 2024 - Jun 2024)
• Worked on user onboarding flow using React and Node.js with Redux store dispatchers, and also organized weekly sprint planning meetings with designers.
• Fixed CSS flexbox bugs on checkout page and improved page load by 15% while also analyzing user survey feedback to propose new search filter.
• Conducted 18 user discovery interviews to identify signup friction, proposing automated verification which elevated completion rate by 22%.
• Collaborated with engineering leads to prioritize product backlog tickets in Jira, reducing bug backlog triage time by 30%.

Open Source Fellow | Open Climate Fix - Google Summer of Code (May 2023 - Aug 2023)
• Developed automated data pipelines fetching solar irradiance forecasts from satellite APIs and built interactive prediction dashboards for research partners.
• Spearheaded pipeline latency optimization in Python, slashing data processing turnaround from 45 minutes to 12 minutes for grid operators.
• Authored comprehensive API documentation and developer quickstart guides, onboarding 40+ international open-source contributors.

PROJECTS
Personal Finance FIRE Planner | Next.js, TypeScript, Tailwind CSS, PostgreSQL (Aug 2023 - Oct 2023)
• Built interactive financial independence retirement calculator used by 3,500+ active users with Monte Carlo simulations and inflation adjustments.
• Implemented automated expense categorization algorithms and visual asset allocation charts using Chart.js, driving 4.8/5 user satisfaction.
• Refactored database indexing and server-side queries, reducing average API response latency from 380ms to 75ms.

Campus Connect Student Community Platform | React, Express, MongoDB (Jan 2023 - Apr 2023)
• Shipped real-time campus discussion forum and club discovery portal with JWT authentication, engaging 1,200+ undergraduate students.
• Formulated user engagement experiments with notification digests, increasing 14-day student retention by 18%.

TECHNICAL & PRODUCT SKILLS
• Product Management: User Journey Mapping, A/B Testing, Conversion Funnel Analysis, PRD Writing, Sprint Prioritization, Customer Empathy, OKRs
• Technical Stack: JavaScript / TypeScript, React, Next.js, Node.js, Python, SQL (PostgreSQL, MySQL), Git, RESTful APIs, Docker
• Tools & Analytics: Figma, Jira, Mixpanel, Tableau, Google Analytics, Postman, Supabase

EDUCATION
Delhi Technological University (DTU) | B.Tech in Computer Science & Engineering (2021 - 2025)
• GPA: 8.85 / 10.0 | Relevant Coursework: Data Structures & Algorithms, Database Systems, Software Engineering, Product Design

HONORS & ACHIEVEMENTS
• Winner (1st / 120 Teams) - Smart India Hackathon (FinTech & Product Innovation Track)
• Selected as Google Summer of Code (GSoC) Fellow among top 2% global applicants`;

export const ROLE_CONFIGS: Record<TargetRole, RoleConfig> = {
  'Associate Product Manager (APM)': {
    role: 'Associate Product Manager (APM)',
    shortLabel: 'APM',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Focuses on user friction, conversion funnels, retention, customer research, and feature delivery while purging low-level code syntax.',
    sampleDescription: 'Includes mixed points (coding + scrum), dev jargon (flexbox, Redux), unquantified outcomes, and passive phrasing.',
    sampleBullets: [
      'Worked on user onboarding flow using React and Node.js with Redux store dispatchers, and also organized weekly sprint planning meetings with designers.',
      'Fixed CSS flexbox bugs on checkout page and improved page load by 15% while also analyzing user survey feedback to propose new search filter.',
      'Helped team build recommendation algorithm in Python and presented product roadmap to college club members.',
      'Created landing page which got lots of views and signups from students.'
    ],
    sampleJdTitle: 'Google / Stripe APM Job Description',
    sampleJdText: `Job Title: Associate Product Manager (APM) - Growth & Core Experience
Location: San Francisco, CA / Remote

About The Role:
We are seeking a high-potential Associate Product Manager to spearhead consumer activation and user retention across our core web and mobile platforms.

Key Responsibilities:
• Formulate product hypotheses, define OKRs, and prioritize sprint backlogs across engineering, design, and data science pods.
• Lead end-to-end user onboarding experiments, A/B testing variations to eliminate drop-off in the signup and checkout funnels.
• Conduct qualitative customer discovery interviews, synthesis of customer journeys, and user empathy sessions.
• Partner with analytics to monitor conversion funnels, cohort retention curves, churn rate, and CAC/LTV payback efficiency.
• Own go-to-market (GTM) launches, write clear PRDs (Product Requirement Documents), and manage stakeholder alignment across executive leadership.

Qualifications & Skills:
• 0-2 years product management, founder, or technical internship experience.
• Fluency in data-driven decision making, cohort analysis, and experimentation frameworks.
• Exceptional cross-functional leadership, empathy for customer pain points, and product delivery excellence.`,
    coreKeywords: [
      'User Retention',
      'A/B Testing',
      'Conversion Funnel',
      'Customer Journey',
      'Go-To-Market (GTM)',
      'Product Delivery',
      'KPI Tracking',
      'Sprint Prioritization',
      'User Empathy',
      'Feature Roadmap',
      'Stakeholder Alignment',
      'Cohort Analysis',
      'PRD Writing'
    ]
  },
  'Software Engineer (SDE)': {
    role: 'Software Engineer (SDE)',
    shortLabel: 'SDE',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Focuses on system scalability, latency optimization, microservices, code quality, throughput, and automated testing.',
    sampleDescription: 'Includes mixed points (backend microservices + Jira updating), vague metrics, and passive maintenance tasks.',
    sampleBullets: [
      'Built authentication microservice using Spring Boot and Hibernate with JWT tokens, and also updated the Jira sprint backlog during daily scrum.',
      'Wrote MongoDB database aggregation queries and reduced query time while also writing 20 pages of setup documentation.',
      'Helped develop real-time chat application using WebSockets which handled lots of users without crashing.',
      'Refactored legacy spaghetti code in repository and set up Docker containers for deployment.'
    ],
    sampleJdTitle: 'Meta / Uber SDE Job Description',
    sampleJdText: `Job Title: Software Development Engineer (SDE I) - Platform Infrastructure
Location: Seattle, WA / New York, NY

About The Role:
We are looking for an ambitious Software Engineer to build resilient distributed backend services, high-throughput APIs, and mission-critical cloud infrastructure.

Key Responsibilities:
• Architect, implement, and maintain scalable microservices utilizing Java, Go, Python, or TypeScript.
• Optimize system latency and memory throughput for distributed caching layers (Redis, Memcached) and relational databases (PostgreSQL).
• Design and consume resilient RESTful and gRPC APIs supporting millions of daily active requests with 99.99% uptime SLA.
• Implement robust CI/CD pipelines, automated unit testing, end-to-end integration tests, and containerization via Docker and Kubernetes.
• Participate in architectural code reviews, fault tolerance post-mortems, and horizontal scaling strategies.

Qualifications & Skills:
• Strong grasp of Data Structures, Algorithms, Concurrency, and Object-Oriented Design.
• Hands-on proficiency with database indexing, distributed systems, and message queues (Kafka/RabbitMQ).
• Passion for clean, test-driven code and performance profiling.`,
    coreKeywords: [
      'System Scalability',
      'CI/CD Pipeline',
      'Latency Optimization',
      'RESTful APIs',
      'Unit Testing',
      'Throughput',
      'Microservices',
      'Concurrency',
      'Database Indexing',
      'Cloud Architecture',
      'Fault Tolerance',
      'Docker / Kubernetes'
    ]
  },
  'Data Analyst': {
    role: 'Data Analyst',
    shortLabel: 'Data Analyst',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Focuses on SQL efficiency, statistical rigour, dashboard automation, actionable insights, and business decision outcomes.',
    sampleDescription: 'Includes mixed points (complex SQL queries + slide design), unquantified data cleanup, and non-actionable charts.',
    sampleBullets: [
      'Wrote complex SQL queries with multiple nested joins and window functions, and also created PowerPoint slides for executive review.',
      'Cleaned messy customer survey dataset with 50,000 rows in Excel, and also scheduled team weekly coffee chats.',
      'Analyzed app churn rate using Python pandas and suggested marketing strategy changes to the sales team.',
      'Built interactive Tableau dashboard that tracked core business metrics and everyone loved it.'
    ],
    sampleJdTitle: 'Netflix / Spotify Data Analyst Job Description',
    sampleJdText: `Job Title: Product Data Analyst - User Analytics & Insights
Location: San Francisco, CA / Los Angeles, CA

About The Role:
Join our growth analytics team to uncover actionable user behavior insights, optimize product engagement, and power data-driven strategic initiatives.

Key Responsibilities:
• Write production-grade, highly optimized SQL queries across multi-terabyte data warehouses (BigQuery / Snowflake).
• Develop, automate, and maintain self-serve BI dashboards in Tableau and Looker to track core engagement KPIs and monetization metrics.
• Formulate statistical hypothesis tests, calculate p-values and confidence intervals for A/B product experiment rollouts.
• Perform customer cohort analysis and segmentation to identify root causes of subscriber churn and activation bottlenecks.
• Partner with product and engineering leaders to translate quantitative findings into strategic roadmap decisions.

Qualifications & Skills:
• Advanced SQL (nested CTEs, window functions, query plan optimization) and Python/R for data wrangling.
• Strong foundation in descriptive and inferential statistics, regression analysis, and experimental design.
• Demonstrated ability to synthesize messy datasets into crisp executive narratives.`,
    coreKeywords: [
      'SQL Optimization',
      'Statistical Analysis',
      'Cohort Analysis',
      'Data Modeling',
      'Dashboard Automation',
      'Business Intelligence',
      'Data Cleansing',
      'ETL Pipelines',
      'Hypothesis Testing',
      'Actionable Insights',
      'Looker / Tableau',
      'A/B Experimentation'
    ]
  },
  'AI / ML Engineer': {
    role: 'AI / ML Engineer',
    shortLabel: 'AI/ML',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Focuses on deep learning architectures, inference latency, GPU throughput, model fine-tuning (LoRA), RAG pipelines, and evaluation benchmarks.',
    sampleDescription: 'Includes mixed points (training vision model + Jira tracking), unmeasured accuracy gains, and unquantified inference latencies.',
    sampleBullets: [
      'Built deep learning computer vision model using PyTorch and OpenCV for defect detection, and also updated daily Jira tickets for sprint tracker.',
      'Trained neural network in TensorFlow on 100k images and improved accuracy by 4% while also rewriting data preprocessing bash scripts.',
      'Deployed transformer LLM pipeline using HuggingFace and FastAPI which handled incoming inference requests.',
      'Tuned hyperparameters using Optuna and built simple Streamlit demo app for team presentation.'
    ],
    sampleJdTitle: 'OpenAI / Anthropic AI Engineer Job Description',
    sampleJdText: `Job Title: Machine Learning Engineer - Foundation Models & Inference
Location: San Francisco, CA / New York, NY

About The Role:
We are looking for an applied AI/ML Engineer to train, evaluate, and deploy high-performance generative models and scalable deep learning inference systems.

Key Responsibilities:
• Fine-tune foundation models (LoRA, QLoRA, full parameter) using PyTorch, Hugging Face, and DeepSpeed across multi-GPU clusters.
• Architect low-latency inference pipelines utilizing vLLM, TensorRT-LLM, and model quantization (AWQ, GPTQ, FP8) to minimize time-to-first-token.
• Design production RAG (Retrieval-Augmented Generation) architectures with vector databases (Pinecone, Milvus), hybrid re-ranking, and semantic chunking.
• Build automated evaluation harnesses tracking perplexity, BLEU/ROUGE, and hallucination rates against standardized LLM benchmarks.
• Collaborate with backend engineers to integrate asynchronous streaming endpoints with 99.9% uptime.

Qualifications & Skills:
• Strong coding skills in Python, PyTorch, CUDA profiling, and asynchronous APIs (FastAPI).
• Practical experience with transformer architectures, embeddings, vector search, and token budget optimization.
• Knowledge of distributed training (FSDP, Megatron-LM) and MLOps tooling (Weights & Biases, MLflow).`,
    coreKeywords: [
      'PyTorch / TensorFlow',
      'Model Fine-Tuning (LoRA)',
      'Inference Latency Optimization',
      'RAG Pipelines',
      'Vector Databases',
      'Model Quantization',
      'GPU Profiling / vLLM',
      'Evaluation Benchmarks',
      'Transformer Architecture',
      'MLOps CI/CD',
      'Distributed Training',
      'Prompt Engineering'
    ]
  },
  'Other': {
    role: 'Other',
    shortLabel: 'Custom',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    description: 'Manually specify your target role. Gemini dynamically tailors ATS rubrics, industry keywords, and bullet impact for your exact career track.',
    sampleDescription: 'Sample general professional bullets with mixed responsibilities and unquantified impact.',
    sampleBullets: [
      'Led core project execution for team and also organized client feedback interviews across multiple departments.',
      'Analyzed customer operational bottlenecks and helped improve workflow turnaround time.',
      'Designed and delivered comprehensive strategy presentation to executive leadership.',
      'Created cross-functional tracking system which saved team hours each week.'
    ],
    sampleJdTitle: 'Custom Target Role Job Description',
    sampleJdText: `Paste your target company's job description here to have the ATS engine extract role-specific keywords, compute JD Match %, and rewrite your resume bullets to match this exact posting.`,
    coreKeywords: [
      'Cross-functional Leadership',
      'Operational Efficiency',
      'Stakeholder Alignment',
      'Process Optimization',
      'Strategic Planning',
      'Data-Driven Decision Making',
      'Project Delivery',
      'KPI Performance'
    ]
  }
};
