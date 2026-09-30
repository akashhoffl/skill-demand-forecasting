// ============================================================================
// TALENTSCOPE.AI — UNIFIED PLATFORM DATA & STATE MODEL
// Shared canonical entities with stable IDs connecting Individual, Employee,
// and Company portals into ONE cohesive ecosystem.
// ============================================================================

const STORAGE_KEYS = {
  USER: 'talentscope-platform-user',
  QUESTION_BANKS: 'talentscope-question-banks',
  BOOKINGS: 'talentscope-mentoring-bookings',
  INVITATIONS: 'talentscope-company-invitations',
  NOTIFICATIONS: 'talentscope-notifications',
  EMPLOYEE_TYPE: 'talentscope-employee-type'
};

function safeGetItem(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function safeSetItem(key, val) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
    }
  } catch (e) {
    // ignore
  }
}

function safeDispatch(name, detail) {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  } catch (e) {
    // ignore
  }
}

// ----------------------------------------------------------------------------
// 1. UNIFIED USER IDENTITY MODEL
// ----------------------------------------------------------------------------

export const initialPlatformUser = {
  id: 'USR-88291',
  employeeId: 'EMP-88291',
  name: 'Arun Sharma',
  shortName: 'Arun',
  initials: 'AS',
  avatarBg: '#2735F5',
  email: 'arun.sharma@nvidia.internal',
  portalType: 'employee', // 'individual' | 'employee' | 'company-admin'
  employeeType: 'company-connected', // 'company-connected' | 'independent'
  companyId: 'ORG-NV-2026',
  companyName: 'NVIDIA Enterprise Solutions',
  roleId: 'ai-engineer',
  role: 'AI Engineer',
  level: 'L4 — Professional',
  department: 'Autonomous Systems & Compute',
  location: 'Bangalore, India',
  targetRoleId: 'senior-ai-platform-engineer',
  targetRole: 'Senior AI Platform Engineer',
  targetLevel: 'L5 — Senior Lead',
  reputationPoints: 1840,
  mentorStatus: 'Active Technical Mentor',
  skills: ['python', 'pytorch', 'cuda', 'dist-sys', 'triton', 'genai', 'sql'],
  goals: ['L5 Promotion', 'Distributed Inference Architecture', 'GPU Kernel Mastery']
};

export function getPlatformUser() {
  try {
    const saved = safeGetItem(STORAGE_KEYS.USER);
    const parsed = saved ? JSON.parse(saved) : initialPlatformUser;
    
    // Sync employeeType with talentscope-employee-type if present
    const empType = safeGetItem(STORAGE_KEYS.EMPLOYEE_TYPE);
    if (empType === 'independent_employee') {
      parsed.employeeType = 'independent';
      parsed.companyId = null;
      parsed.companyName = null;
    } else if (empType === 'company_employee') {
      parsed.employeeType = 'company-connected';
      parsed.companyId = 'ORG-NV-2026';
      parsed.companyName = 'NVIDIA Enterprise Solutions';
    }
    return parsed;
  } catch {
    return initialPlatformUser;
  }
}

export function updatePlatformUser(updates) {
  const current = getPlatformUser();
  const next = { ...current, ...updates };
  try {
    safeSetItem(STORAGE_KEYS.USER, JSON.stringify(next));
    if (next.employeeType === 'independent') {
      safeSetItem(STORAGE_KEYS.EMPLOYEE_TYPE, 'independent_employee');
    } else {
      safeSetItem(STORAGE_KEYS.EMPLOYEE_TYPE, 'company_employee');
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  safeDispatch('talentscope:state-synced', { user: next });
  return next;
}


// ----------------------------------------------------------------------------
// 2. CANONICAL SKILLS REGISTRY (Stable IDs)
// ----------------------------------------------------------------------------

export const canonicalSkills = {
  python: {
    id: 'python',
    name: 'Python',
    category: 'Core Programming',
    proficiency: 'Expert',
    healthScore: 94,
    relevance: 96,
    momentum: '+12%',
    halfLife: '4.8 Years',
    mentorEligible: true,
    companyCoverage: 92,
    companyDemand: 90,
    gap: 0,
    icon: 'code-2',
    questionBankIds: ['qb-python-async'],
    mentorIds: ['mentor-arun', 'mentor-mira'],
    roadmapIds: ['rm-python-backend-advancement'],
    requiredInRoles: ['ai-engineer', 'senior-ai-platform-engineer', 'backend-engineer']
  },
  pytorch: {
    id: 'pytorch',
    name: 'PyTorch & Deep Learning',
    category: 'AI Frameworks',
    proficiency: 'Advanced',
    healthScore: 90,
    relevance: 94,
    momentum: '+15%',
    halfLife: '3.6 Years',
    mentorEligible: true,
    companyCoverage: 88,
    companyDemand: 92,
    gap: 4,
    icon: 'flame',
    questionBankIds: ['qb-pytorch-ddp'],
    mentorIds: ['mentor-arun', 'mentor-leena'],
    requiredInRoles: ['ai-engineer', 'senior-ai-platform-engineer', 'ml-compiler-specialist']
  },
  cuda: {
    id: 'cuda',
    name: 'CUDA & GPU Optimization',
    category: 'Hardware Acceleration',
    proficiency: 'Intermediate',
    healthScore: 62,
    relevance: 98,
    momentum: '+28%',
    halfLife: '5.2 Years',
    mentorEligible: false,
    companyCoverage: 58,
    companyDemand: 85,
    gap: 27,
    gapSeverity: 'Critical Q3',
    icon: 'cpu',
    questionBankIds: ['qb-cuda-memory'],
    mentorIds: ['mentor-david'],
    requiredInRoles: ['senior-ai-platform-engineer', 'ml-compiler-specialist']
  },
  'dist-sys': {
    id: 'dist-sys',
    name: 'Distributed Systems & NCCL',
    category: 'Systems Architecture',
    proficiency: 'Developing',
    healthScore: 54,
    relevance: 91,
    momentum: '+24%',
    halfLife: '4.2 Years',
    mentorEligible: false,
    companyCoverage: 62,
    companyDemand: 82,
    gap: 20,
    gapSeverity: 'High Q3',
    icon: 'network',
    questionBankIds: [],
    mentorIds: ['mentor-david', 'mentor-ananya'],
    requiredInRoles: ['senior-ai-platform-engineer', 'dist-sys-architect']
  },
  triton: {
    id: 'triton',
    name: 'Triton Inference Server',
    category: 'Microservice Serving',
    proficiency: 'Proficient',
    healthScore: 86,
    relevance: 88,
    momentum: '+18%',
    halfLife: '3.0 Years',
    mentorEligible: true,
    companyCoverage: 71,
    companyDemand: 88,
    gap: 17,
    gapSeverity: 'Medium',
    icon: 'zap',
    questionBankIds: [],
    mentorIds: ['mentor-arun'],
    requiredInRoles: ['ai-engineer', 'genai-systems-lead']
  },
  genai: {
    id: 'genai',
    name: 'Generative AI & LLM Systems',
    category: 'Generative AI',
    proficiency: 'Advanced',
    healthScore: 92,
    relevance: 94,
    momentum: '+22%',
    halfLife: '2.4 Years',
    mentorEligible: true,
    companyCoverage: 78,
    companyDemand: 91,
    gap: 13,
    icon: 'sparkles',
    questionBankIds: [],
    mentorIds: ['mentor-arun'],
    requiredInRoles: ['genai-systems-lead', 'ai-engineer']
  },
  ml: {
    id: 'ml',
    name: 'Machine Learning',
    category: 'AI & Data',
    proficiency: 'Advanced',
    healthScore: 88,
    relevance: 92,
    momentum: '+22%',
    halfLife: '4.2 Years',
    mentorEligible: true,
    companyCoverage: 86,
    companyDemand: 90,
    gap: 4,
    icon: 'brain-circuit',
    mentorIds: ['mentor-arun', 'mentor-leena'],
    requiredInRoles: ['ai-engineer']
  },
  sql: {
    id: 'sql',
    name: 'SQL & Data Engineering',
    category: 'Data Engineering',
    proficiency: 'Proficient',
    healthScore: 86,
    relevance: 80,
    momentum: '+4%',
    halfLife: '6.5 Years',
    mentorEligible: false,
    companyCoverage: 85,
    companyDemand: 80,
    gap: 0,
    icon: 'database',
    requiredInRoles: ['ai-engineer', 'backend-engineer']
  }
};

// ----------------------------------------------------------------------------
// 3. CANONICAL COMPANIES REGISTRY (Public vs Private)
// ----------------------------------------------------------------------------

export const canonicalCompanies = {
  'ORG-NV-2026': {
    id: 'ORG-NV-2026',
    slug: 'nvidia',
    name: 'NVIDIA Enterprise Solutions',
    shortName: 'NVIDIA',
    brandColor: '#76B900',
    portalAccent: '#874FFF',
    logoInitials: 'NV',
    industry: 'Semiconductor & AI Compute Infrastructure',
    headcount: '29,600+ Global (4,850 APAC Hub)',
    primaryHub: 'Bagmane Tech Park, Bangalore, India',
    globalHQ: 'Santa Clara, CA, USA',
    description: 'NVIDIA is the world leader in accelerated computing, building Blackwell GPU clusters, enterprise inference containers, and sovereign AI software stacks.',
    technologies: ['CUDA', 'Blackwell B200', 'TensorRT-LLM', 'Triton Server', 'NeMo', 'NCCL', 'InfiniBand'],
    publicRoles: ['ai-engineer', 'senior-ai-platform-engineer', 'ml-compiler-specialist', 'genai-systems-lead'],
    publicJobs: ['job-nv-ai-platform-eng', 'job-nv-genai-lead', 'job-nv-compiler-spec'],
    publicSignals: [
      { id: 'sig-1', title: 'Blackwell Enterprise Cluster Rollout', change: '+32.4%', detail: 'Deployment of B200 compute pods for hyperscale inference.', metric: '480+ Pods Active' },
      { id: 'sig-2', title: 'Bangalore Systems Engineering Expansion', change: '+24.8%', detail: '55 open requisitions in autonomous machine software stacks.', metric: '55 Open Requisitions' },
      { id: 'sig-3', title: 'Sovereign AI Infrastructure Engagements', change: '+41.0%', detail: 'Regional partnerships for on-premise local model fine-tuning.', metric: '8 Regional Contracts' }
    ],
    challenges: ['cuda-kernel', 'ai-challenge'],
    teams: ['Autonomous Compute & Edge', 'Hyperscale Inference Services', 'NeMo Cloud & LLM Platform', 'Core Silicon & Compilers']
  },
  microsoft: {
    id: 'microsoft',
    slug: 'microsoft',
    name: 'Microsoft',
    shortName: 'Microsoft',
    brandColor: '#00A4EF',
    portalAccent: '#00A4EF',
    logoInitials: 'MS',
    industry: 'Enterprise Cloud & AI Software',
    headcount: '220,000+ Global',
    primaryHub: 'Hyderabad & Bangalore, India',
    description: 'Microsoft powers enterprise intelligence through Azure Cloud, Copilot infrastructure, and hyperscale OpenAI partnerships.',
    technologies: ['Azure AI', 'Kubernetes', 'PyTorch', 'TypeScript', 'C#'],
    publicRoles: ['ai-engineer', 'backend-engineer'],
    publicJobs: ['job-msft-ml-infra'],
    publicSignals: [
      { id: 'ms-sig-1', title: 'Azure AI Hyperscale Pod Expansion', change: '+14.8%', metric: '2,480 Roles Open' }
    ]
  },
  google: {
    id: 'google',
    slug: 'google',
    name: 'Google',
    shortName: 'Google',
    brandColor: '#4285F4',
    portalAccent: '#4285F4',
    logoInitials: 'GO',
    industry: 'Cloud & AI Infrastructure',
    headcount: '180,000+ Global',
    primaryHub: 'Bangalore & Hyderabad, India',
    description: 'Google builds foundational AI models (Gemini), TPU compute clusters, and cloud platform infrastructure.',
    technologies: ['JAX', 'TensorFlow', 'TPU Accelerators', 'Kubernetes', 'Go'],
    publicRoles: ['ai-engineer'],
    publicJobs: [],
    publicSignals: [
      { id: 'go-sig-1', title: 'AI R&D Expansion APAC', change: '+12.2%', metric: '1,680 Roles Open' }
    ]
  },
  amazon: {
    id: 'amazon',
    slug: 'amazon',
    name: 'Amazon',
    shortName: 'Amazon',
    brandColor: '#FF9900',
    portalAccent: '#FF9900',
    logoInitials: 'AMZ',
    industry: 'Cloud Infrastructure & AWS',
    headcount: '1,500,000+ Global',
    primaryHub: 'Bangalore & Chennai, India',
    description: 'Amazon Web Services provides global compute, Bedrock foundation model hosting, and customized silicon (Trainium/Inferentia).',
    technologies: ['AWS Bedrock', 'SageMaker', 'Java', 'Python', 'Distributed Systems'],
    publicRoles: ['backend-engineer'],
    publicJobs: ['job-amz-cloud-arch'],
    publicSignals: [
      { id: 'amz-sig-1', title: 'Cloud Infrastructure Expansion', change: '+18.2%', metric: '2,100 Roles Open' }
    ]
  }
};

// ----------------------------------------------------------------------------
// 4. CANONICAL ROLES REGISTRY
// ----------------------------------------------------------------------------

export const canonicalRoles = {
  'ai-engineer': {
    id: 'ai-engineer',
    title: 'AI Engineer',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    level: 'L4 — Professional',
    department: 'Autonomous Systems & Compute',
    experienceRequired: '3-5 Years',
    requiredSkillIds: ['python', 'pytorch', 'triton'],
    overview: 'Develops and fine-tunes deep learning models and packages production inference microservices with Triton.',
    isPublic: true
  },
  'senior-ai-platform-engineer': {
    id: 'senior-ai-platform-engineer',
    title: 'Senior AI Platform Engineer',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    level: 'L5 — Senior Lead',
    department: 'Autonomous Systems & Compute',
    experienceRequired: '4-6 Years',
    requiredSkillIds: ['python', 'pytorch', 'cuda', 'dist-sys'],
    overview: 'Leads systems performance tuning, low-latency GPU kernel compilation, and multi-node NCCL cluster orchestration.',
    isPublic: true,
    internalRequisitionId: 'role-req-101'
  },
  'ml-compiler-specialist': {
    id: 'ml-compiler-specialist',
    title: 'ML Compiler & Optimization Specialist',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    level: 'L5 — Senior Lead',
    department: 'Software Infrastructure',
    experienceRequired: '3-5 Years',
    requiredSkillIds: ['c++', 'cuda', 'pytorch'],
    overview: 'Designs graph rewriting passes, memory placement optimizations, and specialized compiler backends for Blackwell silicon.',
    isPublic: true,
    internalRequisitionId: 'role-req-102'
  },
  'genai-systems-lead': {
    id: 'genai-systems-lead',
    title: 'Generative AI Systems Lead',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    level: 'L5 — Senior Lead',
    department: 'NeMo Cloud Software',
    experienceRequired: '3-5 Years',
    requiredSkillIds: ['python', 'pytorch', 'genai', 'triton'],
    overview: 'Drives high-throughput agentic retrieval systems, vector database indexing, and streaming LLM inference.',
    isPublic: true,
    internalRequisitionId: 'role-req-103'
  },
  'dist-sys-architect': {
    id: 'dist-sys-architect',
    title: 'Distributed Systems Architect',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    level: 'L6 — Principal',
    department: 'Cloud Infrastructure',
    experienceRequired: '7+ Years',
    requiredSkillIds: ['dist-sys', 'cuda', 'c++'],
    overview: 'Architects resilient InfiniBand/NVLink interconnect fabrics across 1,000+ GPU supercomputing clusters.',
    isPublic: true
  }
};

// ----------------------------------------------------------------------------
// 5. CANONICAL JOBS REGISTRY
// ----------------------------------------------------------------------------

export const canonicalJobs = [
  {
    id: 'job-nv-ai-platform-eng',
    title: 'Senior AI Platform Engineer',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    roleId: 'senior-ai-platform-engineer',
    team: 'Hyperscale Acceleration Group',
    location: 'Bangalore, India (Hybrid)',
    compensation: '₹38L – ₹58L + Stock',
    requiredSkillIds: ['python', 'pytorch', 'cuda', 'dist-sys'],
    matchedSkillIds: ['python', 'pytorch', 'triton'],
    gapSkillIds: ['cuda', 'dist-sys'],
    matchScore: 84,
    status: 'Actively Hiring',
    isInternalOnly: false,
    summary: 'Lead system performance profiling and CUDA kernel optimization for hyperscale Blackwell inference clusters.'
  },
  {
    id: 'job-nv-genai-lead',
    title: 'Generative AI Systems Lead',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    roleId: 'genai-systems-lead',
    team: 'NeMo Enterprise Solutions',
    location: 'Bangalore / Remote India',
    compensation: '₹42L – ₹65L + Stock',
    requiredSkillIds: ['python', 'pytorch', 'genai', 'triton'],
    matchedSkillIds: ['python', 'pytorch', 'genai', 'triton'],
    gapSkillIds: [],
    matchScore: 91,
    status: 'Actively Hiring',
    isInternalOnly: false,
    summary: 'Drive high-throughput enterprise agentic systems and scalable vector search retrieval architectures.'
  },
  {
    id: 'job-nv-compiler-spec',
    title: 'ML Compiler & Optimization Specialist',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA',
    roleId: 'ml-compiler-specialist',
    team: 'Deep Learning Software (DLS)',
    location: 'Bangalore / Pune (Hybrid)',
    compensation: '₹36L – ₹54L + Stock',
    requiredSkillIds: ['c++', 'cuda', 'pytorch'],
    matchedSkillIds: ['pytorch'],
    gapSkillIds: ['cuda', 'c++'],
    matchScore: 76,
    status: 'Actively Hiring',
    isInternalOnly: false,
    summary: 'Develop automated graph rewriting passes and memory placement optimizations for emerging Blackwell hardware.'
  },
  {
    id: 'job-msft-ml-infra',
    title: 'Staff ML Infrastructure Engineer',
    companyId: 'microsoft',
    companyName: 'Microsoft',
    roleId: 'ai-engineer',
    location: 'Bangalore / Hyderabad',
    compensation: '₹45L – ₹70L + Equity',
    requiredSkillIds: ['python', 'pytorch', 'dist-sys', 'triton'],
    matchedSkillIds: ['python', 'pytorch', 'triton'],
    gapSkillIds: ['dist-sys'],
    matchScore: 88,
    status: 'Actively Hiring',
    isInternalOnly: false,
    summary: 'Scale inference clusters across 1,000+ GPUs with dynamic batch scheduling and KV cache optimizations.'
  },
  {
    id: 'job-amz-cloud-arch',
    title: 'Cloud AI Solutions Architect',
    companyId: 'amazon',
    companyName: 'Amazon AWS',
    roleId: 'ai-engineer',
    location: 'Chennai / Bangalore',
    compensation: '₹35L – ₹52L + Stock',
    requiredSkillIds: ['cloud', 'python', 'genai'],
    matchedSkillIds: ['python', 'genai'],
    gapSkillIds: ['cloud'],
    matchScore: 82,
    status: 'Actively Hiring',
    isInternalOnly: false,
    summary: 'Architect cloud-native generative AI foundation pipelines on AWS Bedrock and SageMaker.'
  }
];

// ----------------------------------------------------------------------------
// 6. QUESTION BANKS & ASSESSMENTS (Employee Created -> Individual Available)
// ----------------------------------------------------------------------------

export const initialQuestionBanks = [
  {
    id: 'qb-python-async',
    title: 'Python Asynchronous & High-Throughput Pipelines',
    skillId: 'python',
    skillName: 'Python',
    difficulty: 'Advanced',
    creatorEmployeeId: 'EMP-88291',
    creatorName: 'Arun Sharma',
    creatorRole: 'AI Engineer · NVIDIA',
    totalQuestions: 16,
    totalAttempts: 128,
    averageScore: 78,
    passRate: '82%',
    status: 'Active & Verified',
    description: 'Practical debugging scenarios covering asyncio event loops, uvloop integration, threadpool contention, and zero-copy memory buffers.',
    sampleQuestions: [
      { id: 'q-101', title: 'Mitigating Event Loop Starvation in High-Frequency Inference Handlers', difficulty: 'Hard', type: 'Code Review', attempts: 124, correctPct: 74 },
      { id: 'q-102', title: 'GIL Bypass Strategies using NumPy Buffers and Multiprocessing Pipes', difficulty: 'Medium', type: 'Architecture Analysis', attempts: 118, correctPct: 81 }
    ]
  },
  {
    id: 'qb-pytorch-ddp',
    title: 'PyTorch Distributed Data Parallel (DDP) Architecture',
    skillId: 'pytorch',
    skillName: 'PyTorch',
    difficulty: 'Advanced',
    creatorEmployeeId: 'EMP-88291',
    creatorName: 'Arun Sharma',
    creatorRole: 'AI Engineer · NVIDIA',
    totalQuestions: 12,
    totalAttempts: 84,
    averageScore: 71,
    passRate: '75%',
    status: 'Active & Verified',
    description: 'Evaluating gradient bucketing, all-reduce communication overlap, Torch Dynamo compiler graphs, and autograd memory optimization.',
    sampleQuestions: [
      { id: 'q-201', title: 'Gradient Bucketing Tuning for 8x H100 Interconnect Bandwidth', difficulty: 'Hard', type: 'Architecture Scenario', attempts: 84, correctPct: 69 }
    ]
  },
  {
    id: 'qb-cuda-memory',
    title: 'CUDA Kernel Memory Coalescing & Bank Conflicts',
    skillId: 'cuda',
    skillName: 'CUDA',
    difficulty: 'Expert',
    creatorEmployeeId: 'EMP-74109',
    creatorName: 'David Chen',
    creatorRole: 'Distinguished Systems Architect · NVIDIA',
    totalQuestions: 10,
    totalAttempts: 46,
    averageScore: 59,
    passRate: '56%',
    status: 'Recommended Practice',
    description: 'Benchmarking shared memory stride access patterns, warp voting intrinsics, and WMMA tensor core usage.',
    sampleQuestions: [
      { id: 'q-301', title: 'Resolving 32-way Shared Memory Bank Conflicts in GEMM Inner Loops', difficulty: 'Expert', type: 'CUDA C++ Profiling', attempts: 46, correctPct: 52 }
    ]
  }
];

export function getCanonicalQuestionBanks() {
  try {
    const saved = safeGetItem(STORAGE_KEYS.QUESTION_BANKS);
    return saved ? JSON.parse(saved) : initialQuestionBanks;
  } catch {
    return initialQuestionBanks;
  }
}

export function saveQuestionBanks(banks) {
  try {
    safeSetItem(STORAGE_KEYS.QUESTION_BANKS, JSON.stringify(banks));
  } catch (e) {
    console.warn(e);
  }
  safeDispatch('talentscope:state-synced', { questionBanks: banks });
}


export function submitAssessmentAttempt({ questionBankId, score, candidateName = 'Learner' }) {
  const banks = getCanonicalQuestionBanks();
  const bank = banks.find(b => b.id === questionBankId);
  if (!bank) return false;

  const prevAttempts = bank.totalAttempts || 0;
  const newAttempts = prevAttempts + 1;
  const newAvg = Math.round(((bank.averageScore * prevAttempts) + score) / newAttempts);

  bank.totalAttempts = newAttempts;
  bank.averageScore = newAvg;
  saveQuestionBanks(banks);

  // If created by current employee Arun Sharma, reward reputation
  const user = getPlatformUser();
  if (bank.creatorEmployeeId === user.employeeId) {
    user.reputationPoints = (user.reputationPoints || 1840) + 25;
    updatePlatformUser({ reputationPoints: user.reputationPoints });
  }

  // Create shared notification
  addPlatformNotification({
    recipientRole: 'employee',
    title: 'New Assessment Completed',
    message: `${candidateName} completed "${bank.title}" with a score of ${score}%. (+25 Contributor Points)`,
    link: '#/employee/community'
  });

  return { success: true, newAttempts, newAvg, score };
}

// ----------------------------------------------------------------------------
// 7. MENTORING & MOCK INTERVIEWS (Shared Slots & Bookings)
// ----------------------------------------------------------------------------

export const initialMentors = [
  {
    id: 'mentor-arun',
    employeeId: 'EMP-88291',
    name: 'Arun Sharma',
    initials: 'AS',
    role: 'AI Engineer · Python & PyTorch Mentor',
    company: 'NVIDIA Enterprise Solutions',
    companyId: 'ORG-NV-2026',
    domain: 'High-Throughput ML Serving & Inference',
    skills: ['Python', 'PyTorch', 'TensorRT', 'Generative AI'],
    experience: '4.5 Years Systems Experience at NVIDIA',
    rating: 4.9,
    reviewsCount: 24,
    sessionsCompleted: 18,
    reputationPoints: 1840,
    bio: 'Lead AI Engineer specializing in low-latency model packaging and async inference pipelines. Host mock technical interviews for L4 systems candidates.',
    availableSlots: [
      { id: 'slot-1', date: 'Tomorrow, Sep 29', time: '5:00 PM — 5:45 PM IST', format: 'Technical Mock Interview', focusArea: 'Distributed ML Serving & Inference Architecture', status: 'available' },
      { id: 'slot-2', date: 'Thursday, Oct 1', time: '6:00 PM — 6:45 PM IST', format: 'Code & Architecture Review', focusArea: 'Python Async Systems & Production Triton Pipelines', status: 'available' }
    ]
  },
  {
    id: 'mentor-david',
    employeeId: 'EMP-74109',
    name: 'David Chen',
    initials: 'DC',
    role: 'Distinguished Systems Architect',
    company: 'NVIDIA Enterprise Solutions',
    companyId: 'ORG-NV-2026',
    domain: 'CUDA Compilers & Silicon Microarchitecture',
    skills: ['CUDA', 'Distributed Systems', 'C++'],
    experience: '8 Years at NVIDIA Silicon Architecture',
    rating: 5.0,
    reviewsCount: 42,
    sessionsCompleted: 35,
    reputationPoints: 3420,
    bio: 'Distinguished Architect leading Blackwell B200 compiler tuning. Specializes in low-level memory bank conflicts and NVLink topologies.',
    availableSlots: [
      { id: 'slot-3', date: 'Friday, Oct 2', time: '4:00 PM — 4:45 PM IST', format: 'Architectural System Design', focusArea: 'CUDA Shared Memory & NVLink Interconnects', status: 'available' }
    ]
  },
  {
    id: 'mentor-mira',
    name: 'Mira',
    initials: 'M',
    role: 'Staff Backend Developer',
    company: 'Community Fellowship',
    domain: 'Service Design & API Testing',
    skills: ['Python', 'FastAPI', 'Backend', 'SQL'],
    experience: '5 Years Enterprise API Design',
    rating: 4.8,
    reviewsCount: 16,
    sessionsCompleted: 12,
    reputationPoints: 1240,
    bio: 'Community mentor focusing on clean architectural boundaries, modular FastAPI services, and automated test pipelines.',
    availableSlots: [
      { id: 'slot-4', date: 'Saturday, Oct 3', time: '11:00 AM — 11:45 AM IST', format: 'API Review', focusArea: 'FastAPI Clean Architecture & Test Coverage', status: 'available' }
    ]
  }
];

export const initialBookings = [
  {
    id: 'booking-101',
    slotId: 'slot-past-1',
    mentorId: 'mentor-arun',
    mentorName: 'Arun Sharma',
    menteeName: 'Kavita Nair',
    menteeRole: 'Associate ML Engineer',
    skillId: 'pytorch',
    date: 'Today, Sep 28',
    time: '4:30 PM — 5:15 PM IST',
    focus: 'PyTorch Gradient Accumulation & DDP Profiling',
    format: 'Technical Mock Interview',
    status: 'confirmed',
    notes: 'Internal Guild Room #4'
  }
];

export function getCanonicalBookings() {
  try {
    const saved = safeGetItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : initialBookings;
  } catch {
    return initialBookings;
  }
}

export function saveCanonicalBookings(bookings) {
  try {
    safeSetItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.warn(e);
  }
  safeDispatch('talentscope:booking-created', { bookings });
}


export function bookMentoringSlot({ slotId, mentorId, menteeName = 'Akash Vance', menteeRole = 'AI / ML Engineer', focus = 'Technical Architecture Review' }) {
  const mentor = initialMentors.find(m => m.id === mentorId);
  const slot = mentor?.availableSlots.find(s => s.id === slotId);

  const bookings = getCanonicalBookings();
  const newBooking = {
    id: 'booking-' + Date.now(),
    slotId,
    mentorId,
    mentorName: mentor ? mentor.name : 'Technical Mentor',
    menteeName,
    menteeRole,
    date: slot ? slot.date : 'Upcoming Session',
    time: slot ? slot.time : 'Scheduled Time',
    focus: slot?.focusArea || focus,
    format: slot?.format || '45 min Mentorship Session',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  saveCanonicalBookings(bookings);

  // Mark slot as booked
  if (slot) {
    slot.status = 'booked';
  }

  // Award reputation to mentor
  const user = getPlatformUser();
  if (mentor?.employeeId === user.employeeId) {
    user.reputationPoints = (user.reputationPoints || 1840) + 50;
    updatePlatformUser({ reputationPoints: user.reputationPoints });
  }

  // Notifications for both sides
  addPlatformNotification({
    recipientRole: 'individual',
    title: 'Mentorship Session Confirmed',
    message: `Your session with ${newBooking.mentorName} on "${newBooking.focus}" is confirmed for ${newBooking.date} at ${newBooking.time}.`,
    link: '#/individual/community'
  });

  addPlatformNotification({
    recipientRole: 'employee',
    title: 'New Mock Interview Booked',
    message: `${menteeName} booked your slot on "${newBooking.focus}" for ${newBooking.date} at ${newBooking.time}.`,
    link: '#/employee/community'
  });

  return { success: true, booking: newBooking };
}

// ----------------------------------------------------------------------------
// 8. COMPANY INVITATION FLOW (Company Admin -> Employee)
// ----------------------------------------------------------------------------

export const initialCompanyInvitations = [
  {
    id: 'INV-8821',
    companyId: 'ORG-NV-2026',
    companyName: 'NVIDIA Enterprise Solutions',
    companyLogo: 'NV',
    email: 'arun.sharma.engineer@gmail.com',
    role: 'AI Engineer (L4)',
    team: 'Autonomous Compute',
    manager: 'Priya Sundaram (Director of AI Infrastructure)',
    status: 'pending',
    createdAt: 'Sep 28, 2026'
  }
];

export function getCompanyInvitations() {
  try {
    const saved = safeGetItem(STORAGE_KEYS.INVITATIONS);
    return saved ? JSON.parse(saved) : initialCompanyInvitations;
  } catch {
    return initialCompanyInvitations;
  }
}

export function saveCompanyInvitations(invs) {
  try {
    safeSetItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invs));
  } catch (e) {
    console.warn(e);
  }
  safeDispatch('talentscope:invitation-updated', { invitations: invs });
}


export function createCompanyInvitation({ companyId, email, role, team }) {
  const company = canonicalCompanies[companyId] || canonicalCompanies['ORG-NV-2026'];
  const invs = getCompanyInvitations();
  const newInv = {
    id: 'INV-' + Math.floor(1000 + Math.random() * 9000),
    companyId,
    companyName: company.name,
    companyLogo: company.logoInitials,
    email,
    role,
    team,
    manager: 'Priya Sundaram',
    status: 'pending',
    createdAt: 'Just now'
  };

  invs.unshift(newInv);
  saveCompanyInvitations(invs);

  addPlatformNotification({
    recipientRole: 'employee',
    title: 'Company Invitation Received',
    message: `${company.name} has invited you to join their verified workforce as ${role} in ${team}.`,
    link: '#/employee/notifications'
  });

  return newInv;
}

export function acceptCompanyInvitation(invitationId) {
  const invs = getCompanyInvitations();
  const inv = invs.find(i => i.id === invitationId);
  if (!inv) return false;

  inv.status = 'accepted';
  saveCompanyInvitations(invs);

  // Update employee user to company-connected
  updatePlatformUser({
    employeeType: 'company-connected',
    companyId: inv.companyId,
    companyName: inv.companyName,
    role: inv.role,
    department: inv.team
  });

  addPlatformNotification({
    recipientRole: 'company',
    title: 'Employee Invitation Accepted',
    message: `${inv.email} accepted invitation for ${inv.role} in ${inv.team}.`,
    link: '#/company/workforce'
  });

  return true;
}

export function rejectCompanyInvitation(invitationId) {
  const invs = getCompanyInvitations();
  const inv = invs.find(i => i.id === invitationId);
  if (!inv) return false;

  inv.status = 'rejected';
  saveCompanyInvitations(invs);
  return true;
}

// ----------------------------------------------------------------------------
// 9. UNIFIED NOTIFICATIONS MODEL
// ----------------------------------------------------------------------------

export const initialNotifications = [
  {
    id: 'notif-1',
    recipientRole: 'employee',
    title: 'Mock Interview Session Booked',
    message: 'Kavita Nair booked your 4:30 PM slot for PyTorch Gradient Accumulation & DDP Profiling.',
    time: 'Today at 10:15 AM',
    read: false,
    link: '#/employee/community'
  },
  {
    id: 'notif-2',
    recipientRole: 'employee',
    title: 'Question Bank Milestone Reached',
    message: 'Your "Python Asynchronous Pipelines" assessment reached 128 attempts with 78% average pass rate (+25 Rep Points).',
    time: 'Yesterday',
    read: true,
    link: '#/employee/community'
  },
  {
    id: 'notif-3',
    recipientRole: 'individual',
    title: 'New Assessment from NVIDIA AI Guild',
    message: 'Arun Sharma published "Python Asynchronous & High-Throughput Pipelines" (16 questions).',
    time: 'Yesterday',
    read: false,
    link: '#/individual/learning'
  },
  {
    id: 'notif-4',
    recipientRole: 'company',
    title: 'Critical Skill Gap Alert',
    message: 'CUDA Kernel optimization gap reached 27% across Autonomous Systems pod.',
    time: '2 days ago',
    read: false,
    link: '#/company/skills'
  }
];

export function getPlatformNotifications() {
  try {
    const saved = safeGetItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  } catch {
    return initialNotifications;
  }
}

export function addPlatformNotification(notif) {
  const list = getPlatformNotifications();
  const newNotif = {
    id: 'notif-' + Date.now(),
    time: 'Just now',
    read: false,
    ...notif
  };
  list.unshift(newNotif);
  try {
    safeSetItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  } catch (e) {
    console.warn(e);
  }
  safeDispatch('talentscope:notification-added', { notification: newNotif });
  return newNotif;
}


// ----------------------------------------------------------------------------
// 10. CONTEXT-AWARE GLOBAL SEARCH ENGINE
// ----------------------------------------------------------------------------

export function searchPlatformEntities(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const results = [];

  // 1. Search Skills
  Object.values(canonicalSkills).forEach(skill => {
    if (skill.name.toLowerCase().includes(q) || skill.category.toLowerCase().includes(q)) {
      results.push({
        id: skill.id,
        type: 'SKILL',
        badgeClass: 'skill',
        title: skill.name,
        subtitle: `${skill.category} · Health: ${skill.healthScore}/100`,
        route: `#/individual/skills/${skill.id}`,
        contextType: 'skill',
        contextValue: skill.name
      });
    }
  });

  // 2. Search Roles
  Object.values(canonicalRoles).forEach(role => {
    if (role.title.toLowerCase().includes(q) || (role.department && role.department.toLowerCase().includes(q))) {
      results.push({
        id: role.id,
        type: 'ROLE',
        badgeClass: 'role',
        title: role.title,
        subtitle: `${role.companyName} · ${role.level}`,
        route: `#/individual/career?role=${encodeURIComponent(role.title)}`,
        contextType: 'role',
        contextValue: role.title
      });
    }
  });

  // 3. Search Companies
  Object.values(canonicalCompanies).forEach(company => {
    if (company.name.toLowerCase().includes(q) || company.industry.toLowerCase().includes(q)) {
      results.push({
        id: company.id,
        type: 'COMPANY',
        badgeClass: 'company',
        title: company.name,
        subtitle: `${company.industry} · ${company.headcount}`,
        route: `#/individual/market-insights?company=${encodeURIComponent(company.shortName)}`,
        contextType: 'company',
        contextValue: company.shortName
      });
    }
  });

  // 4. Search Jobs
  canonicalJobs.forEach(job => {
    if (job.title.toLowerCase().includes(q) || job.companyName.toLowerCase().includes(q)) {
      results.push({
        id: job.id,
        type: 'JOB',
        badgeClass: 'job',
        title: job.title,
        subtitle: `${job.companyName} · ${job.location}`,
        route: `#/individual/career?job=${encodeURIComponent(job.id)}`,
        contextType: 'job',
        contextValue: job.id
      });
    }
  });

  // 5. Search Mentors
  initialMentors.forEach(mentor => {
    if (mentor.name.toLowerCase().includes(q) || mentor.role.toLowerCase().includes(q) || mentor.skills.some(s => s.toLowerCase().includes(q))) {
      results.push({
        id: mentor.id,
        type: 'MENTOR',
        badgeClass: 'mentor',
        title: mentor.name,
        subtitle: `${mentor.role} · ${mentor.rating} ★`,
        route: `#/individual/community?tab=mentors&mentor=${mentor.id}`,
        contextType: 'mentor',
        contextValue: mentor.id
      });
    }
  });

  // 6. Search Question Banks
  getCanonicalQuestionBanks().forEach(qb => {
    if (qb.title.toLowerCase().includes(q) || qb.skillName.toLowerCase().includes(q)) {
      results.push({
        id: qb.id,
        type: 'QUESTION BANK',
        badgeClass: 'assessment',
        title: qb.title,
        subtitle: `Skill: ${qb.skillName} · ${qb.totalAttempts} attempts · ${qb.averageScore}% avg`,
        route: `#/individual/learning?assessment=${qb.id}`,
        contextType: 'assessment',
        contextValue: qb.id
      });
    }
  });

  return results.slice(0, 8);
}
