// ============================================================================
// TALENTSCOPE.AI — COMPANY PORTAL NAVIGATION REGISTRY
// Restructured Information Architecture (No Duplicate Governance) (#874FFF)
// ============================================================================

export const companyNavigation = [
  {
    label: 'Overview',
    items: [
      { route: '/company/home', label: 'Company Home', icon: 'layout-dashboard' }
    ]
  },
  {
    label: 'Workforce',
    items: [
      { route: '/company/workforce', label: 'Workforce', icon: 'users' }
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { route: '/company/market', label: 'Market Intelligence', icon: 'globe' },
      { route: '/company/skills', label: 'Skill Intelligence', icon: 'layers' }
    ]
  },
  {
    label: 'Planning',
    items: [
      { route: '/company/mobility', label: 'Internal Mobility', icon: 'git-pull-request' },
      { route: '/company/simulation', label: 'Workforce Simulation', icon: 'cpu' }
    ]
  },
  {
    label: 'Management',
    items: [
      { route: '/company/profile', label: 'Company Profile', icon: 'building' },
      { route: '/company/admin', label: 'Administration', icon: 'shield-check' }
    ]
  },
  {
    label: 'AI',
    items: [
      { route: '/company/ai-assistant', label: 'Strategic AI Copilot', icon: 'sparkles' }
    ]
  },
  {
    label: 'System',
    items: [
      { route: '/company/settings', label: 'Enterprise Settings', icon: 'settings-2' }
    ]
  }
];

export const companyRoutes = {
  '/company/home': {
    title: 'Company Home',
    eyebrow: 'COMPANY INTELLIGENCE',
    description: 'Executive Workforce Intelligence Console — strategic signals, skill coverage, role risk, and recommended actions.',
    icon: 'layout-dashboard'
  },
  '/company/workforce': {
    title: 'Workforce Planning',
    eyebrow: 'ORGANIZATIONAL WORKFORCE',
    description: 'Understand the people, team allocations, skill health, and projected headcount in your company.',
    icon: 'users'
  },
  '/company/market': {
    title: 'Market Intelligence',
    eyebrow: 'EXTERNAL MARKET TO ENTERPRISE IMPACT',
    description: 'Connect global technology momentum, competitor moves, and market shifts to enterprise talent needs.',
    icon: 'globe'
  },
  '/company/skills': {
    title: 'Skill Intelligence',
    eyebrow: 'ORGANIZATIONAL SKILL PORTFOLIO',
    description: 'Monitor enterprise skill demand, half-life, critical gaps, and strategic upskilling roadmaps.',
    icon: 'layers'
  },
  '/company/mobility': {
    title: 'Internal Mobility',
    eyebrow: 'TALENT REDEPLOYMENT & PROGRESSION',
    description: 'Unlock internal talent capability before external recruiting: matches, promotion readiness, and progress.',
    icon: 'git-pull-request'
  },
  '/company/simulation': {
    title: 'Workforce Simulation',
    eyebrow: 'STRATEGIC SCENARIO WORKSPACE',
    description: 'Model future market disruptions and evaluate workforce capability, cost, and upskilling impact.',
    icon: 'cpu'
  },
  '/company/profile': {
    title: 'Company Profile',
    eyebrow: 'ENTERPRISE IDENTITY & GOVERNANCE',
    description: 'Public organization identity, strategic tech adoption signals, and internal workforce boundary.',
    icon: 'building'
  },
  '/company/admin': {
    title: 'Administration',
    eyebrow: 'ENTERPRISE ADMINISTRATION',
    description: 'Manage organization hierarchy, access control, skill architectures, data sources, and privacy.',
    icon: 'shield-check'
  },
  '/company/ai-assistant': {
    title: 'Strategic AI Copilot',
    eyebrow: 'EXECUTIVE INTELLIGENCE ASSISTANT',
    description: 'Grounded enterprise workforce intelligence copilot for strategic planning and talent insights.',
    icon: 'sparkles'
  },
  '/company/settings': {
    title: 'Enterprise Settings',
    eyebrow: 'SYSTEM CONFIGURATION',
    description: 'Configure tenant parameters, modeling weights, simulation limits, and notification thresholds.',
    icon: 'settings-2'
  }
};
