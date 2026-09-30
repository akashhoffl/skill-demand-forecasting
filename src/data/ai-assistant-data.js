// AI Assistant Intelligence Engine & Data Models
// Connects cross-domain platform intelligence: Skills, Market, Jobs, Learning, Community, Career

export const AI_STORAGE_KEY = 'talentscope-ai-session-v1';
export const AI_SAVED_KEY = 'talentscope-ai-saved-insights-v1';

export const defaultAiContext = {
  location: 'Bangalore',
  role: 'AI Engineer',
  skill: 'Python',
  timeframe: '6 Months',
  userProfile: 'Arun Sharma',
  learningGoal: 'Improve Python & ML Systems'
};

// Preset Intelligence Knowledge Base & Structured Scenario Responses
export const intelligenceScenarios = [
  {
    id: 'skills_growing_fastest',
    triggers: ['skills are growing fastest', 'fastest growing skills', 'top emerging skills', 'high growth skills', 'what skills are in demand'],
    domain: 'SKILL + MARKET INTELLIGENCE',
    domainIcon: 'sparkles',
    badgeClass: 'badge-skill-market',
    finding: 'Generative AI (+34.2%) and CUDA Acceleration (+28.6%) are currently demonstrating the highest compound market velocity across global tech requisitions, closely followed by Python (+18.4%) as the foundational execution language.',
    why: 'Enterprise deployment of high-throughput LLM pipelines and custom edge inference models has created acute demand for developers who combine high-level scripting with low-level kernel performance optimization.',
    personalImpact: 'With your established proficiency in Python (Health 88/100) and Machine Learning (Health 86/100), you are uniquely positioned to bridge application logic with GPU-accelerated computing.',
    visualType: 'metrics_bar',
    visualData: {
      title: 'Skill Market Velocity & Demand Index (Last 6 Months)',
      items: [
        { label: 'Generative AI', growth: '+34.2%', score: 94, category: 'AI & Data', color: '#B22DEF' },
        { label: 'CUDA Systems', growth: '+28.6%', score: 91, category: 'AI Hardware', color: '#8B3DFF' },
        { label: 'Machine Learning', growth: '+22.4%', score: 88, category: 'Core AI', color: '#19B77A' },
        { label: 'Python (Foundational)', growth: '+18.4%', score: 92, category: 'Programming', color: '#42075D' },
        { label: 'Cloud Computing (AWS/GCP)', growth: '+14.2%', score: 85, category: 'Infrastructure', color: '#06B6D4' }
      ]
    },
    evidence: [
      { type: 'Job Signal', title: '42,180 Live Requisitions', text: '42,180 active role postings explicitly cite Python + AI infrastructure competence across Bangalore and global hubs.', date: '30 Days Window', isDemo: true },
      { type: 'Market Report', title: 'Q3 Enterprise AI Index', text: 'Enterprise capital expenditure on custom model fine-tuning and inference infrastructure grew 41% year-over-year.', date: 'Q3 Benchmark', isDemo: true },
      { type: 'Technology Signal', title: 'Accelerated Hardware Adoption', text: '86% of senior ML job descriptions now require familiarity with CUDA compilation or Triton kernel optimization.', date: 'Verified Survey', isDemo: true }
    ],
    recommendation: 'Target CUDA Systems and Model Quantization next to complement your Python foundation for high-value AI Architect roles.',
    actions: [
      { id: 'explore_cuda', label: 'Explore CUDA Skill', route: '/individual/skills', skill: 'CUDA', icon: 'layers-3', primary: true },
      { id: 'view_market_ai', label: 'View Market Insights', route: '/individual/market-insights', icon: 'chart-no-axes-combined' },
      { id: 'build_roadmap_cuda', label: 'Build Roadmap', route: '/individual/learning', action: 'build_roadmap', goal: 'Learn Skill', skill: 'CUDA', icon: 'git-fork' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'Why is CUDA growing so quickly?',
      'Which companies are hiring AI Engineers?',
      'Am I ready for AI Engineer roles?',
      'Where can I practice Python and CUDA?'
    ]
  },
  {
    id: 'python_changing',
    triggers: ['how is python changing', 'python still in demand', 'why is python in demand', 'python trend', 'python relevance', 'python market'],
    domain: 'SKILL INTELLIGENCE',
    domainIcon: 'layers-3',
    badgeClass: 'badge-skill',
    finding: 'Python remains the de-facto standard language for modern intelligent systems, maintaining a 94/100 Relevance Score and +18.4% demand velocity.',
    why: 'Demand is strongly underpinned by the convergence of AI microservices (FastAPI, PyTorch), agentic orchestration workflows (LangGraph, CrewAI), and data engineering pipelines (DuckDB, Polars).',
    personalImpact: 'Your Python capability gives you immediate leverage. However, shifting from script automation to asynchronous distributed systems and GPU-bound orchestration is necessary to capture top-percentile compensation.',
    visualType: 'skill_health_radar',
    visualData: {
      skillName: 'Python',
      momentum: '+18.4%',
      healthScore: 88,
      relevanceScore: 94,
      halfLifeYears: 5.4,
      decayRisk: 'Very Low Risk',
      historyTrend: [50, 58, 64, 72, 78, 85, 92],
      factors: [
        { label: 'Market Velocity', score: 92, status: 'Accelerating' },
        { label: 'Role Alignment', score: 95, status: 'Critical Core' },
        { label: 'Practice Recency', score: 88, status: 'Active (3d ago)' },
        { label: 'Code Ecosystem', score: 96, status: 'Expanding' }
      ]
    },
    evidence: [
      { type: 'Hiring Requisition', title: '14,200 Backend & AI Roles', text: 'Over 14,200 enterprise engineering vacancies in target geographies list Python as a mandatory primary skill.', date: 'Live Market Index', isDemo: true },
      { type: 'Ecosystem Velocity', title: 'PyPI Package Downloads', text: 'Asynchronous frameworks (FastAPI, asyncio) download volume grew 48% over synchronous frameworks in 2026.', date: 'Annual Index', isDemo: true }
    ],
    recommendation: 'Strengthen asynchronous Python architecture and production model serving to prepare for AI System Architect roles.',
    actions: [
      { id: 'explore_python', label: 'Explore Skill Profile', route: '/individual/skills', skill: 'Python', icon: 'layers-3', primary: true },
      { id: 'continue_python_learning', label: 'Continue Learning', route: '/individual/learning', icon: 'book-open' },
      { id: 'python_community', label: 'Join Python Community', route: '/individual/community', community: 'python', icon: 'users-round' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'What should I learn after Python?',
      'Python or Java for backend development?',
      'Which Python skills are most valuable for AI roles?',
      'Where can I practice advanced Python challenges?'
    ]
  },
  {
    id: 'nvidia_relevance',
    triggers: ['why is nvidia relevant', 'nvidia relevant to ai', 'nvidia hiring', 'what is happening at nvidia', 'nvidia market'],
    domain: 'MARKET INTELLIGENCE',
    domainIcon: 'landmark',
    badgeClass: 'badge-market',
    finding: 'NVIDIA commands 82% of commercial accelerated compute hardware and has expanded engineering hiring by +24% across its Indian R&D centers in Bangalore and Pune.',
    why: 'NVIDIA is expanding beyond pure silicon into complete full-stack inference stacks: CUDA-X libraries, TensorRT-LLM, and enterprise microservices, driving demand for compiler engineers and ML system builders.',
    personalImpact: 'Your target role of Senior AI System Architect aligns directly with NVIDIA partner ecosystems and enterprise AI platform teams deploying Blackwell and Hopper clusters.',
    visualType: 'company_breakdown',
    visualData: {
      companyName: 'NVIDIA',
      openings: 1320,
      growth: '+28.6% YoY',
      topHubs: ['Bangalore (640)', 'Pune (380)', 'Remote (300)'],
      primaryTech: ['CUDA', 'C++', 'PyTorch', 'TensorRT', 'Python', 'Distributed Systems'],
      keyRoles: [
        { title: 'AI Infrastructure Engineer', openings: 420, comp: '₹38L - ₹65L' },
        { title: 'Compiler & Kernel Optimization Engineer', openings: 310, comp: '₹42L - ₹75L' },
        { title: 'Deep Learning System Architect', openings: 260, comp: '₹50L - ₹85L' }
      ]
    },
    evidence: [
      { type: 'Corporate Disclosure', title: 'Global R&D Expansion', text: 'NVIDIA leadership announced a 30% expansion in Indian software engineering teams focused on autonomous workflows and NIM microservices.', date: 'Q2 Official Release', isDemo: true },
      { type: 'Industry Benchmark', title: 'Enterprise Compute Share', text: 'Over 88% of production LLM training and 74% of enterprise inference operations execute on NVIDIA hardware stacks.', date: 'Tech Horizon 2026', isDemo: true }
    ],
    recommendation: 'Master CUDA fundamentals and GPU memory hierarchy optimization to qualify for tier-1 AI infrastructure opportunities.',
    actions: [
      { id: 'view_nvidia_market', label: 'View Market Intelligence', route: '/individual/market-insights', company: 'NVIDIA', icon: 'chart-no-axes-combined', primary: true },
      { id: 'view_nvidia_jobs', label: 'View NVIDIA Jobs', route: '/individual/career', company: 'NVIDIA', icon: 'briefcase-business' },
      { id: 'explore_cuda_skill', label: 'Explore CUDA Skill', route: '/individual/skills', skill: 'CUDA', icon: 'layers-3' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'Which other companies are hiring AI Engineers?',
      'Why should I learn CUDA?',
      'What should I learn for NVIDIA roles?',
      'Find an AI challenge related to GPU optimization'
    ]
  },
  {
    id: 'companies_hiring_ai',
    triggers: ['companies are hiring ai engineers', 'who is hiring ai engineers', 'ai engineer jobs', 'hiring ai engineers', 'which companies are hiring'],
    domain: 'JOB INTELLIGENCE',
    domainIcon: 'briefcase-business',
    badgeClass: 'badge-job',
    finding: '840 technology employers currently have 12,480 active openings for AI Engineers in India and remote hubs, with demand expanding +18.4% month-over-month.',
    why: 'Organizations are transitioning from generic API wrappers to proprietary agentic architectures, demanding in-house engineering for fine-tuning, RAG optimization, and evaluation harness engineering.',
    personalImpact: 'Your skill match for AI Engineer roles stands at 84%, with key matches in Python, ML, and SQL. Bridging CUDA and Distributed PyTorch will unlock senior requisitions.',
    visualType: 'hiring_companies_list',
    visualData: {
      roleTitle: 'AI Engineer',
      openRoles: 12480,
      activeEmployers: 840,
      medianSalary: '₹28L - ₹55L / yr',
      companies: [
        { name: 'NVIDIA', openRoles: 1320, growth: '+28.6%', location: 'Bangalore, Pune, Remote', match: '88% Match' },
        { name: 'Microsoft', openRoles: 2480, growth: '+18.2%', location: 'Bangalore, Hyderabad', match: '92% Match' },
        { name: 'Google', openRoles: 1680, growth: '+14.5%', location: 'Bangalore, Hyderabad', match: '86% Match' },
        { name: 'TCS (AI Labs)', openRoles: 1940, growth: '+22.0%', location: 'Chennai, Bangalore', match: '94% Match' },
        { name: 'Shopify', openRoles: 760, growth: '+16.8%', location: 'Remote, Bangalore', match: '82% Match' }
      ]
    },
    evidence: [
      { type: 'Live Index', title: '12,480 Active Role Openings', text: 'Requisition volume for AI and ML Systems positions reached an all-time high in Q3 across enterprise engineering centers.', date: 'Weekly Sync', isDemo: true },
      { type: 'Compensation Study', title: 'Salary Premium for AI Engineers', text: 'Engineers demonstrating verified multi-agent orchestration and model optimization commands a 42% salary premium over traditional backend roles.', date: 'Salary Benchmark 2026', isDemo: true }
    ],
    recommendation: 'Focus on building demonstrable project evidence in production RAG systems and distributed model deployment.',
    actions: [
      { id: 'view_career_ai', label: 'View Job Intelligence', route: '/individual/career', role: 'AI Engineer', icon: 'briefcase-business', primary: true },
      { id: 'prep_skills_ai', label: 'Explore Skill Profile', route: '/individual/skills', skill: 'Machine Learning', icon: 'layers-3' },
      { id: 'build_roadmap_ai', label: 'Build Role Roadmap', route: '/individual/learning', action: 'build_roadmap', goal: 'Job Prep', role: 'AI Engineer', icon: 'git-fork' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'Am I ready for AI Engineer roles?',
      'What skill gaps do I have for AI Engineer?',
      'Why is NVIDIA relevant to AI?',
      'What should I learn next?'
    ]
  },
  {
    id: 'where_practice_python',
    triggers: ['where can i practice python', 'practice python', 'find challenges', 'python challenges', 'python community', 'practice challenges'],
    domain: 'COMMUNITY INTELLIGENCE',
    domainIcon: 'users-round',
    badgeClass: 'badge-community',
    finding: 'The Python & Machine Learning community has 18 active peer-reviewed challenges, 4 collaborative open-source projects, and 2 active study sessions this week.',
    why: 'Demonstrable peer-reviewed challenge submissions provide transparent skill evidence that employers value significantly more than self-reported resume claims.',
    personalImpact: 'Submitting a solution to the "Build a resilient REST API" challenge will generate verified evidence for your Python Health Factor diagnostic (currently 86/100 in Practical Projects).',
    visualType: 'community_cards',
    visualData: {
      communityName: 'Python & AI Engineering Community',
      activeMembers: '12.4k',
      items: [
        { type: 'Challenge', title: 'Build a Resilient REST API with FastAPI', difficulty: 'Intermediate', participants: 248, daysLeft: 4, skills: ['Python', 'FastAPI', 'SQL'], outcome: 'Peer-reviewed project evidence' },
        { type: 'Challenge', title: 'Compare Two GPU Kernels (Triton vs CUDA)', difficulty: 'Advanced', participants: 52, daysLeft: 7, skills: ['Python', 'CUDA', 'ML'], outcome: 'Benchmark note & repository evidence' },
        { type: 'Study Session', title: 'Python Async Deep Dive & Event Loop internals', date: 'Thursday 6:00 PM IST', host: 'Senior Staff Engineer', participants: 18, outcome: 'Live architectural Q&A' }
      ]
    },
    evidence: [
      { type: 'Community Benchmark', title: '12,400 Active Peers', text: 'Over 248 engineering participants completed peer reviews in the Python community during the last month.', date: 'Platform Metrics', isDemo: true },
      { type: 'Evidence Verification', title: 'Diagnostic Diagnostic Impact', text: 'Completing one verified community challenge increases skill health recency scores by an average of +12 points.', date: 'Telemetry Insights', isDemo: true }
    ],
    recommendation: 'Participate in the FastAPI REST API challenge to solidify your async service design patterns.',
    actions: [
      { id: 'join_community', label: 'Join Python Community', route: '/individual/community', community: 'python', icon: 'users-round', primary: true },
      { id: 'explore_challenge', label: 'Explore Challenge', route: '/individual/community', tab: 'challenges', challenge: 'rest-api', icon: 'flag-triangle-right' },
      { id: 'view_learning', label: 'Continue Learning', route: '/individual/learning', icon: 'book-open' }
    ],
    followUps: [
      'What should I learn after Python?',
      'How is Python changing?',
      'Am I ready for AI Engineer roles?',
      'What should I learn next?'
    ]
  },
  {
    id: 'python_vs_java',
    triggers: ['python or java', 'python vs java', 'compare python and java', 'difference between python and java', 'which is better python or java'],
    domain: 'COMPARISON INTELLIGENCE',
    domainIcon: 'columns-2',
    badgeClass: 'badge-comparison',
    finding: 'Python dominates AI, ML, and rapid cloud-native microservices (+18.4% velocity), while Java maintains structural dominance in enterprise transaction banking and legacy enterprise backends (+6.8% velocity).',
    why: 'Python provides unmatched velocity and library unification across data, AI, and API layers. Java provides strict static typing, mature threading models, and high-throughput low-latency JVM execution at massive enterprise scale.',
    personalImpact: 'Since your stated career trajectory is Senior AI System Architect, doubling down on Python plus low-level GPU acceleration (CUDA) yields dramatically higher ROI than pivoting back to Java enterprise middleware.',
    visualType: 'comparison_table',
    visualData: {
      leftTitle: 'Python Ecosystem',
      rightTitle: 'Java Ecosystem',
      criteria: [
        { label: 'Market Velocity', left: '+18.4% (Accelerating)', right: '+6.8% (Stable / Mature)', winner: 'left' },
        { label: 'AI & Data Integration', left: 'Industry Standard (96/100)', right: 'Secondary Adaptors (62/100)', winner: 'left' },
        { label: 'Enterprise Transaction Systems', left: 'Moderate (74/100)', right: 'Dominant (95/100)', winner: 'right' },
        { label: 'Learning & Iteration Speed', left: 'Very Rapid', right: 'Moderate (Boilerplate)', winner: 'left' },
        { label: 'Your Profile Alignment', left: '92% Strong Fit (Health 88)', right: '58% Match', winner: 'left' },
        { label: 'Top Hiring Companies', left: 'NVIDIA, OpenAI, Google, Startups', leftRoles: 'AI Engineer, ML Systems', right: 'TCS, Infosys, Morgan Stanley, Oracle', rightRoles: 'Backend Dev, Core Banking' }
      ]
    },
    evidence: [
      { type: 'Role Index', title: 'Open Requisition Ratio', text: 'In AI and modern cloud systems, Python is requested in 3.8x more new postings than Java in Bangalore tech parks.', date: 'Q3 Market Data', isDemo: true },
      { type: 'Enterprise Survey', title: 'Language Distribution in Tech', text: '78% of enterprise engineering leaders plan to increase Python adoption for intelligent agent services.', date: 'Tech Trends 2026', isDemo: true }
    ],
    recommendation: 'Maintain Python as your primary language for AI systems; learn Go or C++ if you need low-latency systems engineering rather than enterprise Java.',
    actions: [
      { id: 'explore_python_skill', label: 'Explore Python Skill', route: '/individual/skills', skill: 'Python', icon: 'layers-3', primary: true },
      { id: 'view_job_market', label: 'View Job Market', route: '/individual/career', icon: 'briefcase-business' },
      { id: 'build_roadmap_py', label: 'Build Roadmap', route: '/individual/learning', action: 'build_roadmap', goal: 'Improve Skill', skill: 'Python', icon: 'git-fork' }
    ],
    followUps: [
      'What should I learn after Python?',
      'Why is Python still in demand?',
      'Which companies are hiring AI Engineers?',
      'Should I learn CUDA?'
    ]
  },
  {
    id: 'ready_for_ai_engineer',
    triggers: ['am i ready for ai engineer', 'ready for ai engineer', 'career readiness', 'ai engineer readiness', 'skill gap for ai engineer', 'ready for role'],
    domain: 'CAREER READINESS INTELLIGENCE',
    domainIcon: 'target',
    badgeClass: 'badge-career',
    finding: 'Your readiness for AI Engineer positions is evaluated at 84% Strong Match across core requirements, with immediate strengths in Python, Machine Learning, and SQL.',
    why: 'Readiness is computed transparently from your verified skill health (Python 88/100, ML 86/100, SQL 82/100), completed diagnostic assessments (84%), and portfolio evidence across 3 deployed repositories.',
    personalImpact: 'The primary skill gap preventing 100% top-percentile readiness is GPU Infrastructure (CUDA) and Distributed Model Serving (vLLM / Triton), which appear in 68% of senior job requisitions.',
    visualType: 'readiness_breakdown',
    visualData: {
      targetRole: 'AI Engineer',
      overallScore: 84,
      status: 'High Match',
      pillars: [
        { name: 'Core Language (Python)', coverage: 95, status: 'Verified High', score: 88 },
        { name: 'Machine Learning Fundamentals', coverage: 88, status: 'Verified High', score: 86 },
        { name: 'Data Pipeline & SQL', coverage: 82, status: 'Competent', score: 82 },
        { name: 'Cloud & Container Deployment', coverage: 74, status: 'Competent', score: 75 },
        { name: 'Hardware Acceleration (CUDA)', coverage: 24, status: 'Actionable Gap', score: 28 }
      ],
      openPositions: 12480,
      salaryRange: '₹28L - ₹55L'
    },
    evidence: [
      { type: 'Requisition Analysis', title: 'Target Role Competency Matrix', text: '12,480 role requisitions analyzed: 94% require Python, 86% require PyTorch/ML, 68% require GPU/inference optimization.', date: 'Current Quarter', isDemo: true },
      { type: 'Diagnostic Diagnostic', title: 'Personal Skill Assessment', text: 'Diagnostic scores: Python (Advanced 88%), Machine Learning (Advanced 84%), Cloud Deployment (Intermediate 74%).', date: 'Last 14 Days', isDemo: true }
    ],
    recommendation: 'Close the 16% gap by starting an accelerated 4-week CUDA & inference optimization roadmap.',
    actions: [
      { id: 'view_job_role', label: 'View Role in Career', route: '/individual/career', role: 'AI Engineer', icon: 'briefcase-business', primary: true },
      { id: 'build_role_roadmap', label: 'Build Role Roadmap', route: '/individual/learning', action: 'build_roadmap', goal: 'Job Prep', role: 'AI Engineer', icon: 'git-fork' },
      { id: 'explore_skill_gap', label: 'Explore CUDA Skill', route: '/individual/skills', skill: 'CUDA', icon: 'layers-3' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'Should I learn CUDA?',
      'Which companies are hiring AI Engineers?',
      'What should I learn next?',
      'Find challenges related to my roadmap'
    ]
  },
  {
    id: 'should_i_learn_cuda',
    triggers: ['should i learn cuda', 'why should i learn cuda', 'is cuda worth learning', 'cuda relevance', 'how difficult is cuda', 'learn cuda'],
    domain: 'SKILL + MARKET INTELLIGENCE',
    domainIcon: 'cpu',
    badgeClass: 'badge-skill-market',
    finding: 'Learning CUDA is one of the highest leverage technical investments for 2026, offering a +28.6% market growth index and a 38% salary premium in AI infrastructure engineering.',
    why: 'As LLM parameter scales grow, the primary bottleneck in production systems is memory bandwidth and GPU compute efficiency. Engineers who can write custom CUDA kernels or Triton shaders unlock 5-10x cost reductions for employers.',
    personalImpact: 'Adding CUDA to your Python/ML foundation directly qualifies you for specialized AI Platform and Kernel Optimization roles at companies like NVIDIA, Microsoft, and high-growth AI labs.',
    visualType: 'skill_projection',
    visualData: {
      skillName: 'CUDA Acceleration',
      momentum: '+28.6%',
      demandIndex: 91,
      estimatedTime: '4 - 6 Weeks for fundamentals',
      salaryPremium: '+38% over pure Python backend',
      topEmployers: ['NVIDIA', 'Microsoft AI', 'Google DeepMind', 'Meta Infrastructure', 'Qualcomm'],
      learningMilestones: [
        { name: 'GPU Architecture & Memory Hierarchy', weeks: 'Week 1-2', diff: 'Intermediate' },
        { name: 'CUDA Kernel Syntax & Thread Blocks', weeks: 'Week 3-4', diff: 'Advanced' },
        { name: 'PyTorch C++ / CUDA Extensions', weeks: 'Week 5-6', diff: 'Advanced' }
      ]
    },
    evidence: [
      { type: 'Labor Market Signal', title: '1,320 NVIDIA & Partner Roles', text: 'Demand for GPU programming capabilities surged 64% over the prior year as inference scaling demands optimized hardware utilization.', date: 'Quarterly Analysis', isDemo: true },
      { type: 'Academic / Tech Signal', title: 'Kernel Efficiency Imperative', text: 'State of the art reasoning models depend critically on memory-coalesced fused attention kernels.', date: 'Research Index', isDemo: true }
    ],
    recommendation: 'Accept a targeted 4-week "Learn CUDA" roadmap starting with GPU memory fundamentals and kernel benchmarking.',
    actions: [
      { id: 'build_cuda_roadmap', label: 'Build CUDA Roadmap', route: '/individual/learning', action: 'build_roadmap', goal: 'Learn Skill', skill: 'CUDA', icon: 'git-fork', primary: true },
      { id: 'explore_cuda_skill', label: 'Explore Skill Profile', route: '/individual/skills', skill: 'CUDA', icon: 'layers-3' },
      { id: 'view_nvidia_market', label: 'View NVIDIA Market', route: '/individual/market-insights', company: 'NVIDIA', icon: 'landmark' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'Am I ready for AI Engineer roles?',
      'Which companies are hiring AI Engineers?',
      'Where can I practice Python and CUDA?',
      'What should I learn next?'
    ]
  },
  {
    id: 'what_should_i_learn_next',
    triggers: ['what should i learn next', 'which skills should i learn next', 'what to learn', 'what should i learn', 'recommend a skill', 'skill recommendation'],
    domain: 'LEARNING & SKILL INTELLIGENCE',
    domainIcon: 'book-open',
    badgeClass: 'badge-learning',
    finding: 'Based on your active Python foundation and target role of Senior AI System Architect, the optimal learning trajectory is: CUDA Acceleration → MLOps / Model Serving → Generative AI Agents.',
    why: 'This sequence transitions your capability profile from standalone algorithmic scripting into high-performance production AI infrastructure, which has the highest shortage-to-demand ratio.',
    personalImpact: 'Completing this sequence will elevate your career readiness from 84% to 96% and align your profile with tier-1 enterprise compensation brackets (₹38L - ₹65L).',
    visualType: 'roadmap_preview',
    visualData: {
      roadmapTitle: 'AI System Architect Acceleration Path',
      duration: '8 Weeks',
      stages: [
        { step: 1, name: 'CUDA Kernel Fundamentals', time: 'Weeks 1-2', focus: 'Thread blocks, shared memory, profiling', status: 'Recommended Start' },
        { step: 2, name: 'Production Inference with vLLM & Triton', time: 'Weeks 3-5', focus: 'Continuous batching, quantization (AWQ/GPTQ)', status: 'Upcoming' },
        { step: 3, name: 'Distributed Agent Orchestration', time: 'Weeks 6-8', focus: 'Evaluation harnesses, stateful memory pipelines', status: 'Upcoming' }
      ]
    },
    evidence: [
      { type: 'Role Demand Analysis', title: '42,180 Cross-Domain Openings', text: 'Systems engineers combining Python + CUDA + MLOps see 4.2x higher interview conversion rates.', date: 'Labor Insight', isDemo: true },
      { type: 'Learning Telemetry', title: 'Roadmap Completion Impact', text: 'TalentScope users completing the 8-week accelerated roadmap achieved verified skill certification in 92nd percentile.', date: 'Platform Telemetry', isDemo: true }
    ],
    recommendation: 'Generate and review the 8-week AI System Architect roadmap to track your daily progress in the Learning workspace.',
    actions: [
      { id: 'build_full_roadmap', label: 'Build Roadmap', route: '/individual/learning', action: 'build_roadmap', goal: 'Job Prep', role: 'AI Engineer', icon: 'git-fork', primary: true },
      { id: 'continue_learning', label: 'Open Learning Workspace', route: '/individual/learning', icon: 'book-open' },
      { id: 'explore_ml_skills', label: 'Explore Skills', route: '/individual/skills', skill: 'Machine Learning', icon: 'layers-3' },
      { id: 'view_evidence', label: 'View Evidence', action: 'open_evidence', icon: 'file-text' }
    ],
    followUps: [
      'Should I learn CUDA?',
      'Am I ready for AI Engineer roles?',
      'Which companies are hiring AI Engineers?',
      'Where can I practice Python?'
    ]
  }
];

// Fallback Dynamic Intelligence Synthesizer for arbitrary user questions
export function synthesizeIntelligenceResponse(question, context = defaultAiContext) {
  const qLower = question.toLowerCase().trim();

  // 1. Direct Scenario Trigger Matching
  for (const scenario of intelligenceScenarios) {
    for (const trigger of scenario.triggers) {
      if (qLower.includes(trigger)) {
        return {
          ...scenario,
          userQuestion: question,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          contextSnapshot: { ...context }
        };
      }
    }
  }

  // 2. Keyword & Entity Heuristic Matching
  if (qLower.includes('python')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'python_changing');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }
  if (qLower.includes('nvidia') || qLower.includes('company') || qLower.includes('employer')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'nvidia_relevance');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }
  if (qLower.includes('job') || qLower.includes('hiring') || qLower.includes('salary') || qLower.includes('vacancy')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'companies_hiring_ai');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }
  if (qLower.includes('cuda') || qLower.includes('gpu') || qLower.includes('hardware')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'should_i_learn_cuda');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }
  if (qLower.includes('challenge') || qLower.includes('community') || qLower.includes('practice') || qLower.includes('mentor')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'where_practice_python');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }
  if (qLower.includes('ready') || qLower.includes('readiness') || qLower.includes('career') || qLower.includes('gap')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'ready_for_ai_engineer');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }
  if (qLower.includes('vs') || qLower.includes('compare') || qLower.includes('or')) {
    const s = intelligenceScenarios.find(sc => sc.id === 'python_vs_java');
    return { ...s, userQuestion: question, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), contextSnapshot: { ...context } };
  }

  // 3. Structured Cross-Domain Synthesis for General Queries
  return {
    id: `dyn_${Date.now()}`,
    userQuestion: question,
    domain: 'CROSS-DOMAIN WORKFORCE INTELLIGENCE',
    domainIcon: 'sparkles',
    badgeClass: 'badge-cross-domain',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    finding: `Analyzing signals across your active context (${context.location}, ${context.role}, ${context.skill}): verified momentum indicates sustained technological transition toward accelerated AI architectures.`,
    why: `Industry data indicates that technical adaptability in ${context.skill} combined with systems engineering yields the strongest defensive moat against skill half-life decay.`,
    personalImpact: `Your current profile as ${context.userProfile} aligns closely with these shifts. Prioritizing structured assessment and practical project evidence will maximize your career leverage.`,
    visualType: 'metrics_bar',
    visualData: {
      title: `Intelligence Signal Synthesis (${context.location} · ${context.timeframe})`,
      items: [
        { label: 'Role Alignment Index', growth: '+18.4%', score: 88, category: context.role, color: '#B22DEF' },
        { label: 'Skill Health Index', growth: '+14.2%', score: 86, category: context.skill, color: '#8B3DFF' },
        { label: 'Market Demand Velocity', growth: '+22.0%', score: 91, category: 'Regional Demand', color: '#19B77A' },
        { label: 'Learning Roadmap Sync', growth: '64% Active', score: 74, category: 'Learning Progress', color: '#42075D' }
      ]
    },
    evidence: [
      { type: 'Cross-Domain Signal', title: 'Workforce Intelligence Aggregation', text: `42,180 total signals evaluated across skills, open requisitions, and enterprise hiring momentum in ${context.location}.`, date: 'Live Aggregation', isDemo: true },
      { type: 'Diagnostic Telemetry', title: 'Platform Competency Verification', text: `Diagnostic performance benchmarks for ${context.skill} confirmed in upper quartile.`, date: 'Profile Verified', isDemo: true }
    ],
    recommendation: `Explore active roadmaps and practice challenges matching ${context.skill} to strengthen verified competency evidence.`,
    actions: [
      { id: 'explore_skill', label: `Explore ${context.skill}`, route: '/individual/skills', skill: context.skill, icon: 'layers-3', primary: true },
      { id: 'view_market', label: 'View Market Insights', route: '/individual/market-insights', icon: 'chart-no-axes-combined' },
      { id: 'view_learning', label: 'Learning Workspace', route: '/individual/learning', icon: 'book-open' }
    ],
    followUps: [
      'What skills are growing fastest?',
      'Which companies are hiring AI Engineers?',
      'Why is Python still in demand?',
      'Am I ready for AI Engineer roles?'
    ],
    contextSnapshot: { ...context }
  };
}

// Session & Storage Management
export function loadAiSession() {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return data;
    }
  } catch (err) {
    console.warn('Failed to load AI session from localStorage:', err);
  }
  return {
    history: [],
    context: { ...defaultAiContext }
  };
}

export function saveAiSession(session) {
  try {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Failed to save AI session to localStorage:', err);
  }
}

export function loadSavedInsights() {
  try {
    const raw = localStorage.getItem(AI_SAVED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load saved insights:', err);
  }
  return [];
}

export function saveInsight(insight) {
  try {
    const saved = loadSavedInsights();
    if (!saved.some(item => item.id === insight.id)) {
      saved.unshift({
        id: insight.id || `insight_${Date.now()}`,
        savedAt: new Date().toLocaleDateString(),
        domain: insight.domain,
        userQuestion: insight.userQuestion,
        finding: insight.finding,
        recommendation: insight.recommendation
      });
      localStorage.setItem(AI_SAVED_KEY, JSON.stringify(saved));
      return true;
    }
  } catch (err) {
    console.warn('Failed to save insight:', err);
  }
  return false;
}
