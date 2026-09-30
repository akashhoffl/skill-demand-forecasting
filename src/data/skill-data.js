import { dashboardState, dedicatedSkillState } from '../app/state.js';

export const skillOptions = [
  'Machine Learning',
  'Python',
  'Java',
  'Generative AI',
  'Cloud Computing',
  'SQL',
  'CUDA',
  'Deep Learning',
  'PyTorch',
  'React',
  'Node.js'
];

export const skillMarketData = [
  { id: 'ml', name: 'Machine Learning', category: 'AI & Data', growth: 22.4, direction: 'up', isMySkill: true, isFavorite: true, values: [42, 50, 58, 66, 74, 80, 86], adjacentSkills: ['Python', 'Deep Learning', 'PyTorch', 'CUDA'] },
  { id: 'python', name: 'Python', category: 'Programming', growth: 18.4, direction: 'up', isMySkill: true, isFavorite: true, values: [50, 58, 64, 72, 78, 85, 92], adjacentSkills: ['FastAPI', 'Django', 'SQL', 'Machine Learning'] },
  { id: 'genai', name: 'Generative AI', category: 'AI & Data', growth: 34.2, direction: 'up', isMySkill: false, isFavorite: true, values: [30, 42, 55, 68, 79, 88, 94], adjacentSkills: ['LLMs', 'Prompt Engineering', 'LangChain', 'RAG'] },
  { id: 'cloud', name: 'Cloud Computing', category: 'Infrastructure', growth: 14.2, direction: 'up', isMySkill: true, isFavorite: false, values: [60, 65, 70, 75, 78, 82, 85], adjacentSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'] },
  { id: 'sql', name: 'SQL', category: 'AI & Data', growth: 8.5, direction: 'stable', isMySkill: true, isFavorite: false, values: [75, 76, 78, 79, 80, 81, 82], adjacentSkills: ['PostgreSQL', 'Data Engineering', 'Python'] },
  { id: 'cuda', name: 'CUDA', category: 'AI Hardware', growth: 28.6, direction: 'up', isMySkill: false, isFavorite: false, values: [20, 32, 48, 62, 75, 84, 91], adjacentSkills: ['C++', 'GPU Optimization', 'PyTorch'] }
];

export const dedicatedSkillIntelligenceData = {
  skills: [
    {
      id: 'ml',
      name: 'Machine Learning',
      category: 'AI & Data',
      level: 'Advanced',
      health: 88,
      relevance: 94,
      halfLifeYears: 4.2,
      halfLifeMonths: 50,
      decayRisk: 'Low Risk',
      growth: 22.4,
      direction: 'up',
      status: 'healthy',
      lastUpdated: '2 hours ago',
      icon: 'brain-circuit',
      history: [50, 58, 66, 74, 81, 85, 88],
      aiExplanation: 'Machine Learning remains central to enterprise engineering requisitions, showing strong demand across AI infrastructure, predictive modeling, and data engineering pipelines.',
      missingSkills: ['CUDA Parallelization', 'Distributed PyTorch', 'Model Quantization'],
      adjacentSkills: ['Python', 'Deep Learning', 'PyTorch', 'CUDA'],
      requiredInRoles: ['AI Engineer', 'ML Operations Lead', 'Data Science Specialist'],
      gapSeverity: 'Low',
      techVelocity: 92,
      jobDemandCount: 42180,
      topLocations: ['Bangalore', 'Hyderabad', 'Chennai', 'Global'],
      healthFactors: [
        { name: 'Recency', score: 92, status: 'Healthy', explanation: 'Recent activity within the last 7 days keeps your knowledge fresh.' },
        { name: 'Practice Activity', score: 86, status: 'Active', explanation: 'Regular coding exercises and model tuning challenges completed.' },
        { name: 'Assessment Performance', score: 84, status: 'Verified', explanation: 'Scored 84% on the Advanced Machine Learning skills diagnostic.' },
        { name: 'Practical Projects', score: 90, status: 'Strong', explanation: '3 active project repositories with production model deployments.' },
        { name: 'Market Relevance', score: 94, status: 'High', explanation: '94/100 demand index alignment in target regional markets.' }
      ],
      evidence: [
        { type: 'Job Signal', title: '42,180 Active Openings', text: '42,180 active role requisitions explicitly require Machine Learning competencies in target location.', date: '30 Days Ago', typeBadgeClass: 'job', isDemo: true },
        { type: 'Technology Signal', title: 'IEEE Tech Benchmark', text: 'IEEE Spectrum ranks Machine Learning among top 3 core skills driving engineering compensation premiums.', date: '15 Days Ago', typeBadgeClass: 'tech', isDemo: true },
        { type: 'Industry Report', title: 'Enterprise AI Survey', text: '84% of Fortune 500 tech teams added machine learning upskilling requirements to engineering career tracks.', date: '5 Days Ago', typeBadgeClass: 'industry', isDemo: true }
      ]
    },
    {
      id: 'python',
      name: 'Python',
      category: 'Programming',
      level: 'Expert',
      health: 92,
      relevance: 96,
      halfLifeYears: 5.5,
      halfLifeMonths: 66,
      decayRisk: 'Low Risk',
      growth: 18.4,
      direction: 'up',
      status: 'healthy',
      lastUpdated: '1 day ago',
      icon: 'code-2',
      history: [60, 68, 74, 80, 85, 90, 92],
      aiExplanation: 'Python maintains high market relevance as the primary language for backend systems, data science, and AI development.',
      missingSkills: ['AsyncIO Internals', 'C-Extension Bindings'],
      adjacentSkills: ['FastAPI', 'Django', 'SQL', 'Machine Learning'],
      requiredInRoles: ['Senior Software Engineer', 'AI Engineer', 'Backend Lead'],
      gapSeverity: 'Low',
      techVelocity: 88,
      jobDemandCount: 56400,
      topLocations: ['Global', 'India', 'United States'],
      healthFactors: [
        { name: 'Recency', score: 96, status: 'Healthy', explanation: 'Active daily usage in code production and scripts.' },
        { name: 'Practice Activity', score: 90, status: 'Active', explanation: 'Consistent commits and script execution logged.' },
        { name: 'Assessment Performance', score: 92, status: 'Verified', explanation: 'Master level rating on Python core data structures.' },
        { name: 'Practical Projects', score: 94, status: 'Strong', explanation: 'Multiple production APIs and CLI utilities created.' },
        { name: 'Market Relevance', score: 96, status: 'High', explanation: 'Primary foundational language across tech roles.' }
      ],
      evidence: [
        { type: 'Job Signal', title: '56,400 Requisitions', text: 'Python is listed in over 56,400 active tech hiring requisitions globally.', date: 'Recent', typeBadgeClass: 'job', isDemo: true },
        { type: 'Industry Report', title: 'TIOBE Index Leadership', text: 'Python continues to rank #1 in developer language usage charts worldwide.', date: '10 Days Ago', typeBadgeClass: 'industry', isDemo: true }
      ]
    },
    {
      id: 'genai',
      name: 'Generative AI',
      category: 'AI & Data',
      level: 'Intermediate',
      health: 76,
      relevance: 98,
      halfLifeYears: 2.1,
      halfLifeMonths: 25,
      decayRisk: 'Rapid Evolution',
      growth: 34.2,
      direction: 'up',
      status: 'growing',
      lastUpdated: '3 hours ago',
      icon: 'sparkles',
      history: [30, 42, 55, 68, 74, 76, 76],
      aiExplanation: 'Generative AI is accelerating rapidly. Framework benchmarks evolve every 6 months, requiring continuous practical refresh.',
      missingSkills: ['Fine-Tuning LLaMA', 'RAG Evaluation Frameworks', 'LangChain Agents'],
      adjacentSkills: ['LLMs', 'Prompt Engineering', 'LangChain', 'RAG'],
      requiredInRoles: ['AI Engineer', 'Generative Solutions Architect', 'AI Product Manager'],
      gapSeverity: 'Moderate',
      techVelocity: 98,
      jobDemandCount: 28900,
      topLocations: ['Bangalore', 'San Francisco', 'London'],
      healthFactors: [
        { name: 'Recency', score: 80, status: 'Moderate', explanation: 'Updated 2 weeks ago with basic prompt chaining tests.' },
        { name: 'Practice Activity', score: 72, status: 'Needs Focus', explanation: 'Needs more hands-on fine-tuning and RAG architecture practice.' },
        { name: 'Assessment Performance', score: 75, status: 'Verified', explanation: 'Passed Intermediate GenAI concepts diagnostic.' },
        { name: 'Practical Projects', score: 74, status: 'Moderate', explanation: '1 demo app built with OpenAI API.' },
        { name: 'Market Relevance', score: 98, status: 'High', explanation: 'Highest growth demand vector across enterprise software.' }
      ],
      evidence: [
        { type: 'Technology Signal', title: 'Rapid Tech Shift', text: 'LLM orchestration demand increased by 34.2% quarter-over-quarter.', date: '2 Days Ago', typeBadgeClass: 'tech', isDemo: true },
        { type: 'Job Signal', title: '28,900 Active Roles', text: 'Generative AI roles increased by 140% year-over-year.', date: '7 Days Ago', typeBadgeClass: 'job', isDemo: true }
      ]
    },
    {
      id: 'cloud',
      name: 'Cloud Computing',
      category: 'Infrastructure',
      level: 'Advanced',
      health: 84,
      relevance: 89,
      halfLifeYears: 4.8,
      halfLifeMonths: 58,
      decayRisk: 'Low Risk',
      growth: 14.2,
      direction: 'up',
      status: 'healthy',
      lastUpdated: '4 days ago',
      icon: 'cloud',
      history: [65, 70, 74, 78, 80, 82, 84],
      aiExplanation: 'Cloud architecture capabilities are consistently required across DevOps, AI deployment, and backend engineering teams.',
      missingSkills: ['Multi-Cloud Infrastructure', 'FinOps Resource Optimization'],
      adjacentSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      requiredInRoles: ['Cloud Architect', 'DevOps Lead', 'Infrastructure Engineer'],
      gapSeverity: 'Low',
      techVelocity: 82,
      jobDemandCount: 38200,
      topLocations: ['Global', 'India', 'Europe'],
      healthFactors: [
        { name: 'Recency', score: 88, status: 'Healthy', explanation: 'Cloud deployment activities logged last week.' },
        { name: 'Practice Activity', score: 82, status: 'Active', explanation: 'Docker and Kubernetes container labs completed.' },
        { name: 'Assessment Performance', score: 85, status: 'Verified', explanation: 'Cloud Practitioner certification verified.' },
        { name: 'Practical Projects', score: 84, status: 'Strong', explanation: 'Configured automated CI/CD deployment pipelines.' },
        { name: 'Market Relevance', score: 89, status: 'High', explanation: 'Essential infrastructure competency.' }
      ],
      evidence: [
        { type: 'Industry Report', title: 'Cloud Infrastructure Report', text: 'Cloud adoption continues steady growth with multi-cloud management taking priority.', date: '10 Days Ago', typeBadgeClass: 'industry', isDemo: true }
      ]
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'AI & Data',
      level: 'Expert',
      health: 90,
      relevance: 85,
      halfLifeYears: 7.0,
      halfLifeMonths: 84,
      decayRisk: 'Low Risk',
      growth: 8.5,
      direction: 'stable',
      status: 'healthy',
      lastUpdated: '5 days ago',
      icon: 'database',
      history: [80, 82, 84, 86, 88, 89, 90],
      aiExplanation: 'SQL remains the foundational data querying standard across relational databases, analytical platforms, and AI feature engineering.',
      missingSkills: ['Query Optimization at Scale', 'PostgreSQL Window Functions'],
      adjacentSkills: ['PostgreSQL', 'Data Engineering', 'Python', 'Snowflake'],
      requiredInRoles: ['Data Engineer', 'Data Analyst', 'Backend Software Engineer'],
      gapSeverity: 'Low',
      techVelocity: 75,
      jobDemandCount: 48900,
      topLocations: ['Global', 'India', 'United States'],
      healthFactors: [
        { name: 'Recency', score: 92, status: 'Healthy', explanation: 'Regular database queries executed.' },
        { name: 'Practice Activity', score: 88, status: 'Active', explanation: 'SQL optimization problems solved.' },
        { name: 'Assessment Performance', score: 90, status: 'Verified', explanation: 'Expert score on SQL joins and indexing.' },
        { name: 'Practical Projects', score: 90, status: 'Strong', explanation: 'Database schema design and migration scripts.' },
        { name: 'Market Relevance', score: 85, status: 'High', explanation: 'Ubiquitous requirement across data roles.' }
      ],
      evidence: [
        { type: 'Job Signal', title: '48,900 Job Postings', text: 'SQL is present in 48,900 open data and engineering job listings.', date: '12 Days Ago', typeBadgeClass: 'job', isDemo: true }
      ]
    },
    {
      id: 'cuda',
      name: 'CUDA',
      category: 'AI Hardware',
      level: 'Beginner',
      health: 58,
      relevance: 92,
      halfLifeYears: 3.5,
      halfLifeMonths: 42,
      decayRisk: 'Moderate Risk',
      growth: 28.6,
      direction: 'up',
      status: 'attention',
      lastUpdated: '1 month ago',
      icon: 'cpu',
      history: [20, 28, 35, 42, 50, 55, 58],
      aiExplanation: 'CUDA parallel programming is in intense demand due to generative AI model training and GPU cluster acceleration needs.',
      missingSkills: ['Shared Memory Optimization', 'Triton Kernel Programming', 'TensorRT Acceleration'],
      adjacentSkills: ['C++', 'GPU Optimization', 'PyTorch', 'C++20'],
      requiredInRoles: ['AI Infrastructure Engineer', 'GPU Systems Engineer', 'HPC Developer'],
      gapSeverity: 'High',
      techVelocity: 95,
      jobDemandCount: 16400,
      topLocations: ['Bangalore', 'San Jose', 'Taiwan'],
      healthFactors: [
        { name: 'Recency', score: 50, status: 'Needs Focus', explanation: 'No GPU kernel activity logged in over 30 days.' },
        { name: 'Practice Activity', score: 54, status: 'Needs Focus', explanation: 'Requires more memory layout optimization practice.' },
        { name: 'Assessment Performance', score: 60, status: 'Moderate', explanation: 'Completed beginner CUDA C syntax assessment.' },
        { name: 'Practical Projects', score: 56, status: 'Needs Focus', explanation: '1 basic matrix multiplication kernel project.' },
        { name: 'Market Relevance', score: 92, status: 'High', explanation: 'High demand premium for GPU acceleration skills.' }
      ],
      evidence: [
        { type: 'Technology Signal', title: 'GPU Workload Expansion', text: 'Demand for custom CUDA/Triton GPU kernel developers grew by 28.6%.', date: '4 Days Ago', typeBadgeClass: 'tech', isDemo: true }
      ]
    }
  ]
};

// Helper: Filter skills by scope ('My Skills', 'Favorite Skills', 'All Skills')
export function getSkillsForScope(scope) {
  const allSkills = dedicatedSkillIntelligenceData.skills;
  const savedList = dashboardState.savedSkills || [];
  const favList = dashboardState.favoriteSkills || [];

  if (scope === 'My Skills') {
    return allSkills.filter(s => savedList.includes(s.name));
  } else if (scope === 'Favorite Skills') {
    return allSkills.filter(s => favList.includes(s.name));
  }
  return allSkills;
}

// Scope Actions: Toggle Saved Skills
export function toggleSavedSkill(skillName) {
  let list = [...(dashboardState.savedSkills || [])];
  if (list.includes(skillName)) {
    list = list.filter(s => s !== skillName);
  } else {
    list.push(skillName);
  }
  dashboardState.savedSkills = list;
  localStorage.setItem('talentscope-saved-skills', JSON.stringify(list));
  return list.includes(skillName);
}

// Scope Actions: Toggle Favorite Skills
export function toggleFavoriteSkill(skillName) {
  let list = [...(dashboardState.favoriteSkills || [])];
  if (list.includes(skillName)) {
    list = list.filter(s => s !== skillName);
  } else {
    list.push(skillName);
  }
  dashboardState.favoriteSkills = list;
  localStorage.setItem('talentscope-favorite-skills', JSON.stringify(list));
  return list.includes(skillName);
}

export function getFilteredAndSortedDedicatedSkills() {
  const scope = dedicatedSkillState.skillScope || 'My Skills';
  let list = getSkillsForScope(scope);

  if (dedicatedSkillState.searchQuery) {
    const q = dedicatedSkillState.searchQuery.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }

  return list;
}

export function getSkillIntelligenceOverview(location, timeRange) {
  const locMultiplier = location === 'Global' ? 1.2 : location === 'India' ? 1.1 : 1.0;
  return {
    totalSkillsTracked: dedicatedSkillIntelligenceData.skills.length,
    averageHealth: 84,
    averageRelevance: 91,
    topGrowthSkill: 'Generative AI',
    location,
    timeRange,
    totalJobRequisitions: Math.round(186400 * locMultiplier)
  };
}

export function getHistoricalTrendPoints(skillData, metric = 'demand', timeRange = '6M') {
  const isDecline = skillData.direction === 'down';
  const baseVal = metric === 'relevance' ? skillData.relevance : metric === 'growth' ? skillData.growth : skillData.health;

  let points = [];
  if (metric === 'demand') {
    const baseDemand = skillData.jobDemandCount || 24800;
    const factor = timeRange === '7D' ? 0.05 : timeRange === '30D' ? 0.12 : timeRange === '1Y' ? 0.35 : 0.20;
    points = [
      { date: 'Period 1', val: Math.round(baseDemand * (1 - factor * 1.2)) },
      { date: 'Period 2', val: Math.round(baseDemand * (1 - factor * 0.9)) },
      { date: 'Period 3', val: Math.round(baseDemand * (1 - factor * 0.6)) },
      { date: 'Period 4', val: Math.round(baseDemand * (1 - factor * 0.3)) },
      { date: 'Period 5', val: Math.round(baseDemand * (1 - factor * 0.1)) },
      { date: 'Current', val: baseDemand }
    ];
    return {
      label: 'Job Demand',
      formattedCurrent: baseDemand.toLocaleString(),
      unit: 'open roles',
      changePercent: `+${skillData.growth || 15.2}%`,
      changeDirection: 'up',
      points,
      events: [
        { id: 'ev-1', index: 2, title: 'Quarterly Demand Spike', val: points[2].val, desc: 'Enterprise hiring Surge in target market.' },
        { id: 'ev-2', index: 5, title: 'Current Hiring Requisitions', val: points[5].val, desc: 'Active verified job openings.' }
      ]
    };
  } else if (metric === 'relevance') {
    points = [
      { date: 'Period 1', val: Math.max(10, baseVal - 18) },
      { date: 'Period 2', val: Math.max(10, baseVal - 14) },
      { date: 'Period 3', val: Math.max(10, baseVal - 10) },
      { date: 'Period 4', val: Math.max(10, baseVal - 6) },
      { date: 'Period 5', val: Math.max(10, baseVal - 2) },
      { date: 'Current', val: baseVal }
    ];
    return {
      label: 'Market Relevance',
      formattedCurrent: `${baseVal} / 100`,
      unit: 'index score',
      changePercent: isDecline ? '-6.2%' : '+8.4%',
      changeDirection: isDecline ? 'down' : 'up',
      points,
      events: [
        { id: 'ev-rel-1', index: 4, title: 'Market Validation Shift', val: points[4].val, desc: 'High correlation with senior developer requisitions.' }
      ]
    };
  } else {
    // Growth / Health metric
    points = skillData.history ? skillData.history.map((h, i) => ({ date: `Month ${i+1}`, val: h })) : [
      { date: 'P1', val: 50 }, { date: 'P2', val: 62 }, { date: 'P3', val: 74 }, { date: 'P4', val: 81 }, { date: 'Current', val: baseVal }
    ];
    return {
      label: 'Skill Health & Velocity',
      formattedCurrent: `${baseVal} / 100`,
      unit: 'score',
      changePercent: `+${skillData.growth}%`,
      changeDirection: 'up',
      points,
      events: [
        { id: 'ev-growth-1', index: points.length - 1, title: 'Health Peak', val: baseVal, desc: 'Top proficiency rating achieved.' }
      ]
    };
  }
}

export function getSkillGapDetails(selectedSkillData) {
  const missing = selectedSkillData.missingSkills || ['CUDA Optimization', 'Distributed Training', 'Quantization'];
  const gapItems = missing.map((skillName, index) => {
    const isHigh = index === 0;
    return {
      id: `gap-${index}`,
      name: skillName,
      matchType: isHigh ? 'Skill Gap' : 'Partial Match',
      matchBadgeClass: isHigh ? 'gap' : 'partial',
      priority: isHigh ? 'High' : 'Medium',
      priorityClass: isHigh ? 'high' : 'medium',
      currentLevel: isHigh ? 'Beginner' : 'Intermediate',
      requiredLevel: 'Advanced',
      why: `Appears in 68% of senior ${selectedSkillData.requiredInRoles ? selectedSkillData.requiredInRoles[0] : 'Engineering'} requisitions in selected market.`,
      whyMatters: `Mastering ${skillName} bridges the technical gap for leadership and high-compensation roles.`,
      suggestedTopics: [`${skillName} Fundamentals`, 'Hands-on Projects', 'Performance Benchmarking'],
      relatedRoles: selectedSkillData.requiredInRoles || ['AI Engineer', 'ML Specialist']
    };
  });

  return {
    skillName: selectedSkillData.name,
    overallMatch: selectedSkillData.health >= 80 ? '88% Alignment' : '72% Alignment',
    gapItems
  };
}

export function getAIExplanationAndEvidence(skillData, location, timeRange) {
  const locText = location || 'your selected market';
  return {
    whyMatters: `${skillData.name} powers core backend systems, data pipelines, and AI automation models across tech enterprises in ${locText}.`,
    whatChanged: `Over the past ${timeRange || '30 days'}, job postings requiring ${skillData.name} grew by +${skillData.growth}%. Framework deployment benchmarks have updated.`,
    whatItMeansForYou: `The prototype profile score of ${skillData.health}/100 suggests a useful baseline. Maintaining active practice in adjacent tools like ${skillData.adjacentSkills ? skillData.adjacentSkills[0] : 'CUDA'} could strengthen this capability.`,
    whatToDoNext: `Focus on bridging the gap in ${skillData.missingSkills ? skillData.missingSkills[0] : 'advanced optimization'} to maintain your competitive alignment.`,
    whatCouldHappenNext: `Projected signals indicate ${skillData.name} will maintain a strong half-life of ~${skillData.halfLifeMonths || 50} months in ${locText}.`,
    evidence: skillData.evidence || [
      { type: 'Job Signal', title: 'High Requisition Volume', text: `${skillData.jobDemandCount || 24800} open roles explicitly require ${skillData.name}.`, date: '30 Days Ago', typeBadgeClass: 'job', isDemo: true }
    ]
  };
}

export function getSkillNextActionRecommendation(skillData) {
  if (skillData.health >= 80 && skillData.relevance >= 80) {
    return {
      state: 'HEALTHY + HIGH RELEVANCE',
      primaryActionTitle: `Strengthen ${skillData.name} Advanced Architectures`,
      rationale: `Your current skill health (${skillData.health}/100) and market relevance (${skillData.relevance}/100) are strong. Focus on mastering adjacent advanced tools like ${skillData.missingSkills ? skillData.missingSkills[0] : 'distributed systems'} to stay ahead.`,
      actions: ['Explore Skill', 'Take Assessment', 'Build Roadmap']
    };
  } else if (skillData.health < 70) {
    return {
      state: 'LOW HEALTH + HIGH RELEVANCE',
      primaryActionTitle: `Refresh & Practice ${skillData.name} Basics`,
      rationale: `This skill has high market relevance (${skillData.relevance}/100), but your practice health (${skillData.health}/100) needs attention.`,
      actions: ['Practice Exercises', 'Take Diagnostic', 'Build Targeted Roadmap']
    };
  } else {
    return {
      state: 'MODERATE HEALTH',
      primaryActionTitle: `Expand ${skillData.name} Project Portfolio`,
      rationale: `Building practical project evidence for ${skillData.name} will elevate your verified health score to Expert tier.`,
      actions: ['Explore Skill', 'Take Assessment', 'Build Roadmap']
    };
  }
}
