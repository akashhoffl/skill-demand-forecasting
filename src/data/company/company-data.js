// ============================================================================
// TALENTSCOPE.AI — COMPANY WORKFORCE INTELLIGENCE DATA
// Enterprise & organizational data models for Company Portal (#874FFF)
// All data clearly identified as simulated prototype intelligence
// ============================================================================

export const companyProfile = {
  id: 'ORG-NV-2026',
  name: 'NVIDIA Enterprise Solutions',
  shortName: 'NVIDIA',
  brandColor: '#874FFF',
  logoInitials: 'NV',
  industry: 'Semiconductor & AI Compute Infrastructure',
  globalHeadcount: 29600,
  engineeringHeadcount: 14200,
  apacHeadcount: 4850,
  headquarters: 'Santa Clara, CA, USA',
  primaryHubs: ['Santa Clara, CA', 'Bangalore, India', 'Taipei, Taiwan', 'Cambridge, UK', 'Tokyo, Japan'],
  chiefPeopleOfficer: 'Dr. Elena Vance (EVP & Chief People Officer)',
  headOfWorkforcePlanning: 'Marcus Sterling (VP Global Strategic Workforce Planning)',
  fiscalYear: 'FY 2026 / 2027',
  simulationStatus: 'Simulated Enterprise Intelligence'
};

export const companyOverviewMetrics = {
  workforceHealth: {
    label: 'Workforce Health',
    score: 86,
    maxScore: 100,
    status: 'Stable & Resilient',
    change: '+4.2%',
    trend: 'up',
    summary: 'Core technical capability matches 86% of pipeline deliverables across APAC and US engineering hubs.',
    subSignal: 'Succession readiness: 74% L5+'
  },
  criticalSkillGap: {
    label: 'Critical Skill Gap',
    value: '14%',
    headline: '3 Critical Priorities',
    change: '-2.1%',
    trend: 'down',
    summary: 'Identified gaps in CUDA kernel optimization, multi-node NCCL orchestration, and FP4 quantization.',
    subSignal: '3 teams have urgent need'
  },
  roleEvolutionRisk: {
    label: 'Role Evolution Risk',
    level: 'Low-to-Med',
    headline: '2 Roles Transitioning',
    change: 'Stable',
    trend: 'neutral',
    summary: 'AI Engineers and Cloud Backend engineers are augmenting routine tasks with automated compiler tuning.',
    subSignal: '34% routine task automation'
  },
  hiringDemand: {
    label: 'Hiring Demand',
    value: '+18.4%',
    headline: '82 Open Requisitions',
    change: '+18.4%',
    trend: 'up',
    summary: 'High talent acquisition velocity for Autonomous Systems, Sovereign AI pods, and Distributed Infrastructure.',
    subSignal: '12 priority roles identified'
  },
  aiImpactIndex: {
    label: 'AI Impact Index',
    level: 'Medium Impact',
    headline: '8 Workflows Augmented',
    change: '+28%',
    trend: 'up',
    summary: 'Generative test suite generation and automated kernel profiling are accelerating developer throughput.',
    subSignal: '+22% engineering velocity'
  },
  internalMobilityRate: {
    label: 'Internal Mobility',
    value: '31.4%',
    headline: '24 Placements This Q',
    change: '+6.8%',
    trend: 'up',
    summary: 'Employees transitioned internally across systems engineering before external recruiting cycles opened.',
    subSignal: 'Average ramp time: 22 days'
  }
};

export const companyStrategicSignals = [
  {
    id: 'cmp-sig-1',
    category: 'Technology Shift',
    title: 'Blackwell B200 Hyperscale Cluster Rollout',
    change: '+34.2%',
    timeframe: 'Active Q3 · 480 Nodes',
    whatChanged: 'Migration toward B200 compute pods for hyperscale customer inference workloads.',
    whyItMatters: 'Requires internal teams to profile CUDA memory bandwidth and build FP4 quantization pipelines.',
    affectedArea: 'Autonomous Systems & HPC Infrastructure',
    affectedTeams: ['Autonomous Compute', 'Inference Services', 'Silicon Compiler'],
    evidence: 'Engineering All-Hands & Technical Whitepaper #882',
    actionLabel: 'Review Skill Coverage',
    actionRoute: '#/company/skills',
    metric: '480+ Pods Active'
  },
  {
    id: 'cmp-sig-2',
    category: 'Workforce Expansion',
    title: 'Bangalore Edge AI & Autonomous Hub',
    change: '+28.5%',
    timeframe: 'Ongoing · 55 Positions',
    whatChanged: 'High hiring velocity in Bangalore focusing on robotics stacks, automotive vision, and edge compute.',
    whyItMatters: 'Opportunity to upskill existing L4 AI Engineers into Senior L5 Platform roles internally.',
    affectedArea: 'APAC Engineering Division',
    affectedTeams: ['Autonomous Compute', 'Embedded Systems', 'Platform Core'],
    evidence: 'Global Workforce Requisition Report Q3',
    actionLabel: 'Inspect Mobility Matches',
    actionRoute: '#/company/mobility',
    metric: '55 Open Requisitions'
  },
  {
    id: 'cmp-sig-3',
    category: 'Market Regulation',
    title: 'Sovereign AI Data Residency Mandates',
    change: '+41.0%',
    timeframe: 'YTD 2026 · 8 Contracts',
    whatChanged: 'National public sector contracts require localized model fine-tuning with zero offshore data egress.',
    whyItMatters: 'High demand for engineers certified in secure on-prem Triton container isolation and offline RAG.',
    affectedArea: 'Enterprise Solutions & Public Sector',
    affectedTeams: ['Enterprise Systems', 'Security Architecture'],
    evidence: 'APAC Executive Briefing & Press Releases',
    actionLabel: 'View Market Intelligence',
    actionRoute: '#/company/market',
    metric: '8 Major Regional Deals'
  },
  {
    id: 'cmp-sig-4',
    category: 'Product Modernization',
    title: 'TensorRT-LLM Microservices Standardization',
    change: '+19.5%',
    timeframe: 'Last 30 Days · 92% Adopted',
    whatChanged: 'Standardization of microservice-based RAG inference across all customer-facing software products.',
    whyItMatters: 'Legacy REST backend engineers must redeploy or upskill to containerized Triton microservices.',
    affectedArea: 'Core Software Platforms',
    affectedTeams: ['Inference Services', 'Core Platform API'],
    evidence: 'Software Architecture Guild Release v4.2',
    actionLabel: 'Plan Redeployment',
    actionRoute: '#/company/workforce',
    metric: '92% Architecture Adoption'
  },
  {
    id: 'cmp-sig-5',
    category: 'Competitor Movement',
    title: 'AMD ROCm 6.2 & Cerebras Cloud Expansion',
    change: '+15.8%',
    timeframe: 'Market Intelligence · Q3',
    whatChanged: 'Competitive pressure on price-per-token inference latency across open-weights LLM workloads.',
    whyItMatters: 'CUDA software moat must be strengthened with proprietary kernel performance optimizations.',
    affectedArea: 'HPC & AI Compiler Divisions',
    affectedTeams: ['Compiler Architecture', 'GPU Kernel Lab'],
    evidence: 'Benchmarking Suite vs Competitor Hardware',
    actionLabel: 'Simulate Scenario',
    actionRoute: '#/company/simulation',
    metric: '18% Latency Benchmark Moat'
  }
];

export const companyCriticalSkillGaps = [
  {
    id: 'c-cuda',
    name: 'CUDA & GPU Optimization',
    category: 'Hardware Acceleration',
    icon: 'zap',
    currentCoverage: 58,
    futureDemand: 85,
    gap: 27,
    risk: 'High',
    affectedTeams: ['Autonomous Compute', 'Inference Services', 'HPC Pods'],
    headcountWithSkill: 142,
    headcountNeeded: 218,
    action: 'Upskill',
    priority: 'Critical Q3'
  },
  {
    id: 'c-nccl',
    name: 'Distributed Systems & NCCL',
    category: 'Networking & Scale',
    icon: 'network',
    currentCoverage: 62,
    futureDemand: 82,
    gap: 20,
    risk: 'Medium',
    affectedTeams: ['Cloud Infrastructure', 'NeMo Cloud', 'Cluster Ops'],
    headcountWithSkill: 98,
    headcountNeeded: 140,
    action: 'Upskill / Hire',
    priority: 'High Q3'
  },
  {
    id: 'c-quant',
    name: 'Model Quantization (FP4 / FP8)',
    category: 'AI Model Efficiency',
    icon: 'cpu',
    currentCoverage: 45,
    futureDemand: 78,
    gap: 33,
    risk: 'High',
    affectedTeams: ['Inference Services', 'Embedded Edge'],
    headcountWithSkill: 64,
    headcountNeeded: 112,
    action: 'Upskill',
    priority: 'Critical Q3'
  },
  {
    id: 'c-triton',
    name: 'Triton Inference Server',
    category: 'Microservice Serving',
    icon: 'layers',
    currentCoverage: 71,
    futureDemand: 88,
    gap: 17,
    risk: 'Medium',
    affectedTeams: ['Inference Services', 'Core Platform API'],
    headcountWithSkill: 180,
    headcountNeeded: 224,
    action: 'Redeploy',
    priority: 'Medium'
  },
  {
    id: 'c-python',
    name: 'Python & ML Pipelines',
    category: 'Core Programming',
    icon: 'code-2',
    currentCoverage: 92,
    futureDemand: 90,
    gap: 0,
    risk: 'Low',
    affectedTeams: ['All Engineering Pods'],
    headcountWithSkill: 420,
    headcountNeeded: 410,
    action: 'Maintain',
    priority: 'Healthy'
  },
  {
    id: 'c-pytorch',
    name: 'PyTorch & Distributed Training',
    category: 'AI Frameworks',
    icon: 'flame',
    currentCoverage: 88,
    futureDemand: 92,
    gap: 4,
    risk: 'Low',
    affectedTeams: ['NeMo Cloud', 'Research Pods'],
    headcountWithSkill: 310,
    headcountNeeded: 325,
    action: 'Maintain',
    priority: 'Healthy'
  }
];

export const companyWorkforceImpact = {
  rolesSummary: [
    { role: 'AI Engineer (L4)', currentHeadcount: 84, futureDemand: 120, delta: '+36', status: 'High Growth', risk: 'Low-to-Med', evolution: 'Task automation in modeling; deeper kernel tuning required' },
    { role: 'Senior AI Platform Engineer (L5)', currentHeadcount: 32, futureDemand: 58, delta: '+26', status: 'Critical Shortage', risk: 'High', evolution: 'Architecture shift toward 128+ GPU distributed clusters' },
    { role: 'Distributed Systems Architect (L6)', currentHeadcount: 14, futureDemand: 24, delta: '+10', status: 'Urgent Requisition', risk: 'Critical', evolution: 'Multi-datacenter low-latency InfiniBand/NCCL orchestration' },
    { role: 'Backend REST API Engineer (L4)', currentHeadcount: 42, futureDemand: 28, delta: '-14', status: 'Redeployment Candidate', risk: 'Medium', evolution: 'Legacy endpoints deprecated; transitioning to Triton microservices' },
    { role: 'ML Compiler & Optimization Specialist (L5)', currentHeadcount: 18, futureDemand: 28, delta: '+10', status: 'Specialized Demand', risk: 'High', evolution: 'Automated compiler passes for Blackwell Tensor Core architectures' }
  ],
  aiAugmentationMatrix: [
    { workflow: 'Unit Test Generation & Coverage', automationRate: '68%', status: 'Fully Automated with AI', impact: '+35% Engineering Sprint Throughput' },
    { workflow: 'Routine FP32 Model Fine-tuning', automationRate: '54%', status: 'Automated via AutoTrain Pods', impact: 'Engineers redirected to custom kernel profiling' },
    { workflow: 'Triton Docker Deployment Configs', automationRate: '42%', status: 'Templated via AI Copilots', impact: '-60% deployment failure rate' },
    { workflow: 'Low-level CUDA C++ Attention Kernel Tuning', automationRate: '12%', status: 'Human-Led High-Value Skill', impact: 'Core competitive advantage; critical workforce gap' }
  ]
};

export const companyRecommendedActions = [
  {
    id: 'act-1',
    type: 'UPSKILL',
    tag: 'Priority 1 · Strategic',
    title: 'CUDA & Kernel Optimization Academy',
    reason: '3 teams have a 27% projected skill gap. External hiring pipeline cannot meet Q4 Blackwell cluster demand.',
    impact: 'Closes gap for 42 engineers internally; accelerates qualification for Senior L5 roles.',
    costBenefit: '$180K internal training vs $1.4M external recruiting agency fees',
    priority: 'High',
    actionLabel: 'Launch Learning Sprint',
    secondaryLabel: 'View Affected Teams',
    route: '#/company/skills'
  },
  {
    id: 'act-2',
    type: 'REDEPLOY',
    tag: 'Priority 2 · Internal Mobility',
    title: 'Transition 14 REST Backend Developers to Triton Microservices',
    reason: 'Legacy API endpoints deprecated with 92% adoption of standardized Triton microservice containers.',
    impact: 'Zero layoffs; eliminates external hiring need for 14 junior microservices engineers.',
    costBenefit: 'Protects organizational domain knowledge & saves $420K severance/recruitment friction',
    priority: 'High',
    actionLabel: 'Review Redeployment Cohort',
    secondaryLabel: 'Mobility Matrix',
    route: '#/company/mobility'
  },
  {
    id: 'act-3',
    type: 'HIRE',
    tag: 'Priority 3 · Targeted Acquisition',
    title: 'Acquire 6 Principal Distributed Systems Architects (L6/L7)',
    reason: 'Internal bench strength at L6 InfiniBand & NCCL architecture is currently insufficient for hyperscale pods.',
    impact: 'Provides technical mentorship for 28 internal L4/L5 engineers in APAC.',
    costBenefit: 'Directly unblocks $42M in enterprise Blackwell cluster deployment contracts',
    priority: 'Medium',
    actionLabel: 'Open Targeted Requisitions',
    secondaryLabel: 'Talent Market Map',
    route: '#/company/market'
  },
  {
    id: 'act-4',
    type: 'RESKILL',
    tag: 'Priority 4 · Capability Expansion',
    title: 'Model Quantization (FP4/FP8) Certification Cohort',
    reason: 'Blackwell architecture hardware speedups depend on low-bitwidth quantization expertise.',
    impact: 'Increases qualified inference optimization pool from 64 to 110 engineers in 90 days.',
    costBenefit: '2.4x throughput improvement on client inference clusters',
    priority: 'Medium',
    actionLabel: 'Schedule Certification',
    secondaryLabel: 'Curriculum Details',
    route: '#/company/skills'
  },
  {
    id: 'act-5',
    type: 'MONITOR',
    tag: 'Priority 5 · Competitive Intelligence',
    title: 'Track AMD ROCm 6.2 & Open-Source Kernel Parity',
    reason: 'Competitor open-source frameworks are gaining developer adoption in mid-tier enterprise inference.',
    impact: 'Maintains developer loyalty by ensuring NVIDIA Triton stack remains 2x faster out-of-the-box.',
    costBenefit: 'Informs FY2027 compiler R&D roadmap allocations',
    priority: 'Ongoing',
    actionLabel: 'Simulate Scenario',
    secondaryLabel: 'Competitive Report',
    route: '#/company/simulation'
  }
];

export const companyEmployees = [
  {
    id: 'EMP-88291',
    name: 'Arun Sharma',
    initials: 'AS',
    role: 'AI Engineer',
    level: 'L4',
    team: 'Autonomous Compute',
    location: 'Bangalore, India',
    skillHealth: 88,
    keySkills: ['Python', 'PyTorch', 'TensorRT', 'CUDA (Intermediate)'],
    targetRoleFit: 78,
    targetRole: 'Senior AI Platform Engineer (L5)',
    mobilityStatus: 'Recommended for Review',
    riskLevel: 'Low',
    priorityGap: 'CUDA & NCCL'
  },
  {
    id: 'EMP-90412',
    name: 'Ananya Sharma',
    initials: 'AS',
    role: 'Staff Distributed Systems Engineer',
    level: 'L6',
    team: 'Cloud Infrastructure',
    location: 'Bangalore, India',
    skillHealth: 94,
    keySkills: ['NCCL', 'C++', 'InfiniBand', 'Distributed GPU'],
    targetRoleFit: 92,
    targetRole: 'Principal Architect (L7)',
    mobilityStatus: 'Succession Pipeline Active',
    riskLevel: 'Retention Priority',
    priorityGap: 'None (Mentor Role)'
  },
  {
    id: 'EMP-74109',
    name: 'David Chen',
    initials: 'DC',
    role: 'Distinguished Systems Architect',
    level: 'L7',
    team: 'Core Silicon Architecture',
    location: 'Santa Clara, CA',
    skillHealth: 96,
    keySkills: ['Hardware Profiling', 'Kernel Compilers', 'C++', 'Microarchitecture'],
    targetRoleFit: 98,
    targetRole: 'Fellow / Chief Architect',
    mobilityStatus: 'Leadership Pillar',
    riskLevel: 'Low',
    priorityGap: 'None (Guild Lead)'
  },
  {
    id: 'EMP-81023',
    name: 'Marcus Vance',
    initials: 'MV',
    role: 'ML Platform Engineer',
    level: 'L4',
    team: 'Inference Services',
    location: 'Santa Clara, CA',
    skillHealth: 74,
    keySkills: ['Docker / K8s', 'Python', 'Triton Server', 'Model Packaging'],
    targetRoleFit: 72,
    targetRole: 'Senior Inference Platform Lead',
    mobilityStatus: 'Upskilling in Progress',
    riskLevel: 'Medium',
    priorityGap: 'FP4 Quantization'
  },
  {
    id: 'EMP-68934',
    name: 'Priya Sundaram',
    initials: 'PS',
    role: 'Director of AI Infrastructure',
    level: 'L8',
    team: 'Autonomous Compute & APAC Hub',
    location: 'Bangalore, India',
    skillHealth: 92,
    keySkills: ['Engineering Leadership', 'Distributed Compute', 'HPC Strategy'],
    targetRoleFit: 95,
    targetRole: 'VP Systems Engineering',
    mobilityStatus: 'Executive Bench',
    riskLevel: 'Low',
    priorityGap: 'None'
  },
  {
    id: 'EMP-94512',
    name: 'Sunita Rao',
    initials: 'SR',
    role: 'Autonomous Inference Engineer',
    level: 'L3',
    team: 'Autonomous Compute',
    location: 'Bangalore, India',
    skillHealth: 68,
    keySkills: ['Python', 'Linux Kernel', 'OpenCV', 'PyTorch'],
    targetRoleFit: 64,
    targetRole: 'AI Engineer (L4)',
    mobilityStatus: 'Mentorship Assigned',
    riskLevel: 'High Upskill Opportunity',
    priorityGap: 'CUDA Kernels & Triton'
  },
  {
    id: 'EMP-85210',
    name: 'Vikram Patel',
    initials: 'VP',
    role: 'Cloud Backend Engineer',
    level: 'L4',
    team: 'Core Platform API',
    location: 'Bangalore, India',
    skillHealth: 81,
    keySkills: ['REST APIs', 'Go', 'PostgreSQL', 'Microservices'],
    targetRoleFit: 75,
    targetRole: 'Triton Microservices Specialist',
    mobilityStatus: 'Redeployment Candidate',
    riskLevel: 'Transition Risk',
    priorityGap: 'Triton Server & C++'
  }
];

export const companyTeams = [
  {
    id: 'team-auto',
    name: 'Autonomous Compute & Edge',
    division: 'Automotive & Robotics Software',
    lead: 'Priya Sundaram',
    headcount: 48,
    openRoles: 18,
    skillHealth: 82,
    criticalGaps: ['CUDA Kernels', 'Real-time OS'],
    riskLevel: 'High Need',
    budgetStatus: 'Approved Expansion'
  },
  {
    id: 'team-inf',
    name: 'Hyperscale Inference Services',
    division: 'AI Cloud Platform',
    lead: 'Jonathan Reynolds',
    headcount: 64,
    openRoles: 22,
    skillHealth: 87,
    criticalGaps: ['FP4 Quantization', 'Triton Microservices'],
    riskLevel: 'Medium',
    budgetStatus: 'Fully Funded'
  },
  {
    id: 'team-nemo',
    name: 'NeMo Cloud & LLM Platform',
    division: 'Generative AI Software',
    lead: 'Sarah Lin',
    headcount: 52,
    openRoles: 14,
    skillHealth: 91,
    criticalGaps: ['Multi-node NCCL', 'RLHF Tracing'],
    riskLevel: 'Low',
    budgetStatus: 'High Strategic Priority'
  },
  {
    id: 'team-silicon',
    name: 'Core Silicon & Compilers',
    division: 'Hardware Acceleration',
    lead: 'David Chen',
    headcount: 38,
    openRoles: 8,
    skillHealth: 85,
    criticalGaps: ['Compiler Passes', 'Verilog Synthesis'],
    riskLevel: 'Specialized Shortage',
    budgetStatus: 'Stable'
  }
];

export const workforceForecastTimeline = [
  {
    period: 'Current',
    months: 0,
    headcount: 4850,
    demand: 4850,
    gap: 0,
    gapPercent: '0%',
    upskillTarget: 60,
    redeployTarget: 14,
    externalHireTarget: 22,
    summary: 'Workforce fully allocated; initial Blackwell pods deployed.'
  },
  {
    period: '3 Months',
    months: 3,
    headcount: 4910,
    demand: 5020,
    gap: 110,
    gapPercent: '2.2%',
    upskillTarget: 95,
    redeployTarget: 24,
    externalHireTarget: 45,
    summary: 'Expansion of Bangalore Autonomous Hub starts creating talent deficit in CUDA.'
  },
  {
    period: '6 Months',
    months: 6,
    headcount: 4990,
    demand: 5280,
    gap: 290,
    gapPercent: '5.5%',
    upskillTarget: 145,
    redeployTarget: 38,
    externalHireTarget: 70,
    summary: 'Sovereign AI contracts ramp up; critical shortage in on-prem distributed orchestration.'
  },
  {
    period: '12 Months',
    months: 12,
    headcount: 5120,
    demand: 5650,
    gap: 530,
    gapPercent: '9.4%',
    upskillTarget: 240,
    redeployTarget: 52,
    externalHireTarget: 110,
    summary: 'Full Blackwell cluster rollout across APAC; internal upskilling must cover 65% of demand.'
  },
  {
    period: '24 Months',
    months: 24,
    headcount: 5300,
    demand: 6200,
    gap: 900,
    gapPercent: '14.5%',
    upskillTarget: 410,
    redeployTarget: 85,
    externalHireTarget: 180,
    summary: 'Long-term next-gen architecture shift; major talent pipeline required with regional universities.'
  }
];

export const simulationScenarios = [
  {
    id: 'scen-ai-30',
    title: 'AI Adoption +30% Surge',
    badge: 'High Impact',
    trigger: 'Global enterprise adoption of local LLMs accelerates by 30% over 12 months.',
    impacts: [
      { metric: 'CUDA Skill Demand', current: '85%', projected: '96%', delta: '+11%' },
      { metric: 'Workforce Deficit', current: '110 Engineers', projected: '280 Engineers', delta: '+170' },
      { metric: 'External Hire Dependency', current: '35%', projected: '54%', delta: '+19%' },
      { metric: 'Recruiting Cost Exposure', current: '$1.4M', projected: '$3.8M', delta: '+$2.4M' }
    ],
    recommendedStrategy: 'Accelerate DLI Academy Cohorts immediately. Upskilling 80 internal L4 engineers saves $1.9M and reduces time-to-productivity by 4.2 months.'
  },
  {
    id: 'scen-cloud-mig',
    title: 'Standardized Triton Cloud Migration',
    badge: 'Efficiency Gain',
    trigger: 'Mandatory migration of all legacy REST inference backends into standardized Triton containers within 6 months.',
    impacts: [
      { metric: 'REST Engineers at Risk', current: '42 Engineers', projected: '0 Needed', delta: '-42' },
      { metric: 'Triton Developers Needed', current: '64 Engineers', projected: '106 Engineers', delta: '+42' },
      { metric: 'Severance vs Redeployment', current: '$840K Severance', projected: '$140K Upskill', delta: '-$700K Net' },
      { metric: 'Domain Retention', current: 'Risk of Loss', projected: '100% Retained', delta: 'Protected' }
    ],
    recommendedStrategy: 'Execute internal redeployment cohort for all 42 REST engineers. 4-week structured sprint into containerized Triton serving.'
  },
  {
    id: 'scen-sovereign',
    title: 'APAC Sovereign AI Expansion',
    badge: 'Geographic Scale',
    trigger: 'Indian and APAC telecom & public sector mandates award 4 additional sovereign cloud infrastructure contracts.',
    impacts: [
      { metric: 'Bangalore Headcount Need', current: '4,850 Headcount', projected: '5,350 Headcount', delta: '+500' },
      { metric: 'Compliance & Security Lead Deficit', current: '8 Open Roles', projected: '28 Open Roles', delta: '+20' },
      { metric: 'Time-to-Hire Pressure', current: '42 Days', projected: '68 Days', delta: '+26 Days' },
      { metric: 'Contract Delivery Risk', current: 'Low', projected: 'High If Delayed', delta: 'Requires Action' }
    ],
    recommendedStrategy: 'Establish dedicated Bangalore Systems Architecture Fellowship. Partner with top regional technical institutes for rapid graduate onboarding.'
  }
];
