// ============================================================================
// TALENTSCOPE.AI — AUTHENTICATION & SESSION STATE MANAGEMENT
// Supports: Individual, Employee (Connected / Independent), Company Admin
// Handles: Persistent local sessions, demo seeds, onboarding progress sync
// ============================================================================

const STORAGE_KEY_USERS = 'talentscope_users_v2';
const STORAGE_KEY_SESSION = 'talentscope_session_v2';
const STORAGE_KEY_ONBOARDING_DRAFT = 'talentscope_onboarding_draft_v2';
const STORAGE_KEY_LATEST_REPORT = 'talentscope_latest_report_v2';

// Standard Pre-Seeded Accounts for Testing & Instant Login
const DEFAULT_SEEDED_USERS = [
  {
    id: 'user_alex',
    email: 'alex@example.com',
    password: 'password123',
    name: 'Alex Mercer',
    userType: 'individual',
    employeeType: null,
    companyId: null,
    companyName: null,
    department: null,
    avatar: 'assets/avatar.png',
    ageGroup: '22–25',
    location: { country: 'India', region: 'Karnataka', city: 'Bangalore' },
    currentStage: 'Student',
    education: 'Computer Science & AI',
    experience: 'Less than 1 year',
    skills: ['Python', 'Machine Learning', 'SQL', 'Git'],
    skillLevels: { 'Python': 'Comfortable', 'Machine Learning': 'Beginner', 'SQL': 'Comfortable', 'Git': 'Comfortable' },
    careerGoals: ['Get my first job', 'Build AI skills'],
    targetRoles: ['AI Engineer', 'Machine Learning Specialist'],
    interests: ['Artificial Intelligence', 'Software Development', 'Data'],
    learningPreferences: ['Hands-on practice', 'Projects'],
    weeklyLearningTime: '5–10 hours',
    workPreference: 'Remote',
    favoriteCompanies: ['Google', 'NVIDIA', 'Microsoft'],
    onboardingComplete: true,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user_sarah',
    email: 'sarah@techcorp.com',
    password: 'password123',
    name: 'Sarah Jenkins',
    userType: 'employee',
    employeeType: 'company-connected',
    companyId: 'techcorp-1',
    companyName: 'TechCorp Global',
    department: 'Platform Engineering',
    currentRole: 'Software Engineer',
    industry: 'Enterprise Cloud & AI',
    avatar: 'assets/avatar.png',
    location: { country: 'United States', region: 'California', city: 'San Francisco' },
    experience: '3–5 years',
    skills: ['Python', 'Kubernetes', 'Distributed Systems', 'Docker', 'Go'],
    skillLevels: { 'Python': 'Advanced', 'Kubernetes': 'Comfortable', 'Distributed Systems': 'Beginner', 'Docker': 'Advanced', 'Go': 'Comfortable' },
    careerGoals: ['Move to a senior role', 'Improve my technical skills'],
    targetRoles: ['Senior AI Platform Engineer', 'Staff Infrastructure Engineer'],
    desiredSkills: ['CUDA & GPU Optimization', 'NCCL', 'TensorRT'],
    interests: ['AI Infrastructure', 'Cloud Architecture'],
    learningPreferences: ['Hands-on practice', 'Projects'],
    weeklyLearningTime: '2–5 hours',
    internalGrowthGoals: ['Prepare for promotion', 'Understand where my role is going'],
    onboardingComplete: true,
    createdAt: '2026-02-01T10:30:00Z'
  },
  {
    id: 'user_david',
    email: 'david@dev.io',
    password: 'password123',
    name: 'David Chen',
    userType: 'employee',
    employeeType: 'independent',
    companyId: null,
    companyName: null,
    department: null,
    currentRole: 'Full Stack Developer',
    industry: 'Fintech & Web3',
    avatar: 'assets/avatar.png',
    location: { country: 'Germany', region: 'Berlin', city: 'Berlin' },
    experience: '1–2 years',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    skillLevels: { 'JavaScript': 'Advanced', 'TypeScript': 'Comfortable', 'React': 'Advanced', 'Node.js': 'Comfortable', 'PostgreSQL': 'Comfortable' },
    careerGoals: ['Explore opportunities', 'Improve my skills'],
    targetRoles: ['Senior Full Stack Engineer', 'Backend Architect'],
    desiredSkills: ['Microservices', 'System Design', 'Rust'],
    interests: ['Fintech', 'Software Architecture'],
    learningPreferences: ['Projects', 'Videos'],
    weeklyLearningTime: '5–10 hours',
    internalGrowthGoals: [],
    onboardingComplete: true,
    createdAt: '2026-03-10T14:15:00Z'
  },
  {
    id: 'user_elena',
    email: 'admin@novatech.com',
    password: 'password123',
    name: 'Elena Rostova',
    userType: 'company',
    employeeType: null,
    companyId: 'novatech-global',
    companyName: 'NovaTech Solutions',
    industry: 'Artificial Intelligence & Enterprise Software',
    avatar: 'assets/avatar.png',
    location: { country: 'United States', region: 'Washington', city: 'Seattle' },
    workforceSize: '501–1,000',
    description: 'Enterprise AI infrastructure and intelligent automation platform serving Fortune 500 organizations.',
    businessAreas: ['Technology', 'Engineering', 'Operations', 'Research'],
    criticalSkills: ['Python', 'PyTorch', 'Kubernetes', 'Distributed Computing', 'MLOps'],
    futureSkills: ['Agentic AI', 'CUDA Optimization', 'LLM Fine-tuning', 'Vector Databases'],
    workforceGoals: ['Build future skills', 'Understand workforce gaps', 'Plan future workforce'],
    workforceChallenges: ['Finding the right skills', 'Keeping employee skills current', 'Preparing employees for AI'],
    importantRoles: ['AI Engineer', 'MLOps Architect', 'Cloud Systems Lead'],
    workforceDecisions: ['Workforce planning', 'Upskilling', 'Hiring'],
    platformGoals: ['Understand the market', 'Understand our workforce', 'Find skill gaps'],
    onboardingComplete: true,
    createdAt: '2026-01-20T11:00:00Z'
  }
];

// Initialize users storage with seeds if missing
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY_USERS)) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_SEEDED_USERS));
  }
}
initStorage();

export function getAllUsers() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS)) || DEFAULT_SEEDED_USERS;
  } catch (e) {
    return DEFAULT_SEEDED_USERS;
  }
}

export function saveUser(user) {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    const session = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!session) return null;
    const { userId } = JSON.parse(session);
    const users = getAllUsers();
    return users.find(u => u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) || null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    return;
  }
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
    userId: user.id || user.email,
    user: user,
    timestamp: new Date().toISOString()
  }));
}

export function authenticateUser(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Please enter your password.' };
  }
  if (cleanPass.length < 8) {
    return { success: false, error: 'Password must contain at least 8 characters.' };
  }

  const users = getAllUsers();
  const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matched || matched.password !== cleanPass) {
    return {
      success: false,
      error: "Your email or password doesn't look right."
    };
  }

  setCurrentUser(matched);
  return {
    success: true,
    user: matched,
    redirectTo: determineUserRedirect(matched)
  };
}

export function registerUser({ email, password, userType = 'individual', employeeType = null, companyName = null }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!cleanPass || cleanPass.length < 8) {
    return { success: false, error: 'Password must contain at least 8 characters.' };
  }

  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Try signing in instead.' };
  }

  const newUser = {
    id: 'user_' + Date.now(),
    email: cleanEmail,
    password: cleanPass,
    name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    userType,
    employeeType,
    companyName,
    companyId: companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') : null,
    avatar: 'assets/avatar.png',
    onboardingComplete: false,
    createdAt: new Date().toISOString()
  };

  saveUser(newUser);
  setCurrentUser(newUser);

  return {
    success: true,
    user: newUser,
    redirectTo: '#/onboarding'
  };
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY_SESSION);
  clearOnboardingDraft();
}

export function determineUserRedirect(user) {
  if (!user) return '#/auth/login';

  // Incomplete onboarding -> return to onboarding
  if (!user.onboardingComplete) {
    return '#/onboarding';
  }

  // Completed onboarding -> redirect to user's assigned portal
  if (user.userType === 'company') {
    return '#/company/overview';
  } else if (user.userType === 'employee') {
    return '#/employee/overview';
  } else {
    return '#/individual/home';
  }
}

// Onboarding Draft Management
export function getOnboardingDraft(userType) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ONBOARDING_DRAFT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (userType && parsed.userType !== userType) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

export function saveOnboardingDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY_ONBOARDING_DRAFT, JSON.stringify({
      ...data,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {}
}

export function clearOnboardingDraft() {
  localStorage.removeItem(STORAGE_KEY_ONBOARDING_DRAFT);
}

// Report Storage
export function saveGeneratedReport(report) {
  try {
    localStorage.setItem(STORAGE_KEY_LATEST_REPORT, JSON.stringify(report));
  } catch (e) {}
}

export function getGeneratedReport() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LATEST_REPORT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
