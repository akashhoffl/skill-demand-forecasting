export const dashboardState = {
  market: 'Bangalore',
  timeRange: '30D',
  selectedSkill: 'Machine Learning',
  selectedCompany: 'NVIDIA',
  selectedRole: 'AI Engineer',
  focus: 'skills',
  savedSkills: JSON.parse(localStorage.getItem('talentscope-saved-skills') || '["Machine Learning", "Python", "Generative AI", "Cloud Computing"]'),
  favoriteSkills: JSON.parse(localStorage.getItem('talentscope-favorite-skills') || '["Machine Learning", "Python", "Generative AI"]'),
  savedCompanies: JSON.parse(localStorage.getItem('talentscope-saved-companies') || '["NVIDIA", "Microsoft", "Google", "Amazon"]'),
  favoriteCompanies: JSON.parse(localStorage.getItem('talentscope-favorite-companies') || '["NVIDIA", "Microsoft", "Google", "OpenAI"]'),
  savedRoles: JSON.parse(localStorage.getItem('talentscope-saved-roles') || '["AI Engineer", "Machine Learning Engineer", "Backend Developer", "Data Engineer"]'),
  favoriteRoles: JSON.parse(localStorage.getItem('talentscope-favorite-roles') || '["AI Engineer", "Machine Learning Engineer", "Cloud Solutions Architect"]')
};

export const dedicatedSkillState = {
  skillScope: 'My Skills',
  historyMetric: 'demand',
  historyTimeRange: '6M',
  selectedEventId: null,
  activeModal: null,
  modalData: null,
  isLoading: false,
  hasError: false
};

export const dedicatedMarketState = {
  companyScope: 'My Companies',
  selectedCompany: 'NVIDIA',
  selectedTab: 'Overview',
  selectedQuestion: null,
  activeModal: null,
  modalData: null,
  isLoading: false,
  hasError: false
};

export const dedicatedJobState = {
  roleScope: 'My Roles',
  selectedRole: 'AI Engineer',
  selectedCompanyContext: ['NVIDIA', 'Microsoft'],
  selectedTab: 'Overview',
  selectedSignal: 'all',
  selectedQuestion: null,
  activeModal: null,
  modalData: null,
  isLoading: false,
  hasError: false
};

export const intelligenceExplorerState = {
  isRoadmapPreviewing: false
};

export const roadmapState = {
  skill: 'Python',
  isActive: false
};

export const learningState = {
  activeMilestoneId: 'ms-assessment',
  selectedFilter: 'All'
};

// Unified platform state and canonical registries
export * from '../data/platform-state.js';

