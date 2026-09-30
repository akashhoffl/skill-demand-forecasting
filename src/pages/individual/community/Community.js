import {
  communityCatalog,
  communityChallengeCatalog,
  communityDiscussionCatalog,
  communityEventCatalog,
  communityMentorCatalog,
  communityNavigation,
  communityOpportunityCatalog,
  communityProjectCatalog
} from './community-data.js';
import { bookMentoringSlot } from '../../../data/platform-state.js';


const COMMUNITY_STATE_KEY = 'talentscope-community-workspace-v1';
const emptyContribution = { questionsAsked: 0, helpfulAnswers: 0, challengesCompleted: 0, projectsShared: 0, peerReviews: 0, mentorSessions: 0, eventsAttended: 0 };
const emptyFilters = { skill: '', community: '', contentType: '', difficulty: '', role: '', company: '', location: '', format: '', timing: '', participation: '', saved: false, recommended: false };
const sectionsWithData = ['discover', 'mine', 'discussions', 'challenges', 'projects', 'mentors', 'events', 'opportunities'];

function readCommunityState() {
  try {
    const saved = JSON.parse(localStorage.getItem(COMMUNITY_STATE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') throw new Error('No saved community state');
    return {
      activeSection: sectionsWithData.includes(saved.activeSection) ? saved.activeSection : 'discover',
      joinedCommunities: Array.isArray(saved.joinedCommunities) ? saved.joinedCommunities : [],
      followedDiscussions: Array.isArray(saved.followedDiscussions) ? saved.followedDiscussions : [],
      followedMentors: Array.isArray(saved.followedMentors) ? saved.followedMentors : [],
      savedItems: Array.isArray(saved.savedItems) ? saved.savedItems : [],
      participatingChallenges: Array.isArray(saved.participatingChallenges) ? saved.participatingChallenges : [],
      completedChallenges: Array.isArray(saved.completedChallenges) ? saved.completedChallenges : [],
      submissions: saved.submissions && typeof saved.submissions === 'object' ? saved.submissions : {},
      registeredEvents: Array.isArray(saved.registeredEvents) ? saved.registeredEvents : [],
      collaboratingProjects: Array.isArray(saved.collaboratingProjects) ? saved.collaboratingProjects : [],
      showcasedProjects: Array.isArray(saved.showcasedProjects) ? saved.showcasedProjects : [],
      userProjects: Array.isArray(saved.userProjects) ? saved.userProjects : [],
      userDiscussions: Array.isArray(saved.userDiscussions) ? saved.userDiscussions : [],
      userReplies: saved.userReplies && typeof saved.userReplies === 'object' ? saved.userReplies : {},
      reactions: saved.reactions && typeof saved.reactions === 'object' ? saved.reactions : {},
      helpfulAnswers: Array.isArray(saved.helpfulAnswers) ? saved.helpfulAnswers : [],
      evidence: Array.isArray(saved.evidence) ? saved.evidence : [],
      activity: Array.isArray(saved.activity) ? saved.activity.slice(0, 8) : [],
      notifications: Array.isArray(saved.notifications) ? saved.notifications.slice(0, 12) : [],
      requests: Array.isArray(saved.requests) ? saved.requests : [],
      contributions: { ...emptyContribution, ...(saved.contributions || {}) },
      filters: { ...emptyFilters, ...(saved.filters || {}) },
      query: '',
      filterOpen: false,
      modal: null,
      toast: '',
      draftFilters: { ...emptyFilters }
    };
  } catch {
    return {
      activeSection: 'discover', joinedCommunities: [], followedDiscussions: [], followedMentors: [], savedItems: [],
      participatingChallenges: [], completedChallenges: [], submissions: {}, registeredEvents: [], collaboratingProjects: [],
      showcasedProjects: [], userProjects: [], userDiscussions: [], userReplies: {}, reactions: {}, helpfulAnswers: [],
      evidence: [], activity: [], notifications: [], requests: [], contributions: { ...emptyContribution }, filters: { ...emptyFilters },
      query: '', filterOpen: false, modal: null, toast: '', draftFilters: { ...emptyFilters }
    };
  }
}

const communityState = readCommunityState();
let pageContext = {};
let pageActions = {};

function persistCommunityState() {
  const { query, filterOpen, modal, toast, draftFilters, ...persisted } = communityState;
  try { localStorage.setItem(COMMUNITY_STATE_KEY, JSON.stringify(persisted)); } catch (error) { console.warn('Community prototype state could not be saved.', error); }
}

function html(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function normalize(value) { return String(value || '').trim().toLowerCase(); }
function slug(value) { return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function icon(name, extraClass = '') { return `<i data-lucide="${html(name)}"${extraClass ? ` class="${html(extraClass)}"` : ''} aria-hidden="true"></i>`; }
function communityById(id) { return communityCatalog.find(item => item.id === id); }
function isJoined(id) { return communityState.joinedCommunities.includes(id); }
function isSaved(id) { return communityState.savedItems.includes(id); }
function isFollowing(id) { return communityState.followedDiscussions.includes(id) || communityState.followedMentors.includes(id); }
function safeUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}

function currentContext() {
  const skills = [...new Set([...(pageContext.skills || []), ...(pageContext.favoriteSkills || [])].filter(Boolean))];
  if (pageContext.learning?.skill) skills.unshift(pageContext.learning.skill);
  return {
    ...pageContext,
    skills: [...new Set(skills)],
    favoriteSkills: pageContext.favoriteSkills || [],
    role: pageContext.targetRole || 'All Roles',
    company: pageContext.targetCompany || '',
    location: pageContext.location || 'Global',
    learning: pageContext.learning || null
  };
}

function communityRelevance(community, context = currentContext()) {
  const signals = [...context.skills, context.role, context.company, ...(context.interests || [])].map(normalize).filter(Boolean);
  return community.tags.reduce((score, tag) => score + (signals.some(signal => signal === normalize(tag) || signal.includes(normalize(tag)) || normalize(tag).includes(signal)) ? 1 : 0), 0);
}

function relevanceReason(community, context = currentContext()) {
  if (context.learning?.skill && communityRelevance(community, context) > 0) return `Related to your ${context.learning.title || `${context.learning.skill} learning path`}`;
  const favorite = context.favoriteSkills.find(skill => community.tags.some(tag => normalize(tag) === normalize(skill)));
  if (favorite) return `Matches your favorite skill, ${favorite}`;
  const skill = context.skills.find(item => community.tags.some(tag => normalize(tag) === normalize(item)));
  if (skill) return `Connects with ${skill} in your skill profile`;
  if (context.role && context.role !== 'All Roles' && community.tags.some(tag => normalize(context.role).includes(normalize(tag)) || normalize(tag).includes(normalize(context.role)))) return `Supports your ${context.role} direction`;
  return 'Open to anyone exploring this domain';
}

function recommendedCommunities(limit = 5) {
  const context = currentContext();
  return [...communityCatalog].sort((a, b) => communityRelevance(b, context) - communityRelevance(a, context) || b.discussions - a.discussions).slice(0, limit);
}

function communityLabel(id) { return communityById(id)?.name || 'Community discussion'; }
function joinedCommunityNames() { return communityState.joinedCommunities.map(communityById).filter(Boolean); }
function allDiscussions() { return [...communityState.userDiscussions, ...communityDiscussionCatalog]; }
function allProjects() { return [...communityState.userProjects, ...communityProjectCatalog]; }
function challengeStatus(challenge) {
  if (communityState.completedChallenges.includes(challenge.id)) return 'Completed';
  if (communityState.submissions[challenge.id]) return 'Under Review';
  if (communityState.participatingChallenges.includes(challenge.id)) return 'In Progress';
  return challenge.status;
}
function formatDemoDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + Number(daysFromNow || 0));
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}
function initials(value) { return String(value || '?').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(); }

function toast(message) {
  communityState.toast = message;
  renderCommunityPage();
  window.setTimeout(() => {
    communityState.toast = '';
    const note = document.querySelector('.community-toast');
    note?.remove();
  }, 2600);
}

function recordActivity(message) {
  communityState.activity.unshift({ id: `activity-${Date.now()}`, message, time: 'Just now' });
  communityState.activity = communityState.activity.slice(0, 8);
  communityState.notifications.unshift({ id: `notice-${Date.now()}`, message, read: false, time: 'Just now' });
  communityState.notifications = communityState.notifications.slice(0, 12);
  persistCommunityState();
}

function actionButton(action, label, iconName = '', options = {}) {
  const classes = ['community-button', options.primary ? 'community-button--primary' : '', options.small ? 'community-button--small' : '', options.subtle ? 'community-button--subtle' : ''].filter(Boolean).join(' ');
  const disabled = options.disabled ? ' disabled' : '';
  const attributes = options.id ? ` id="${html(options.id)}"` : '';
  const destination = options.section ? ` data-section="${html(options.section)}"` : options.skill ? ` data-skill="${html(options.skill)}"` : options.company ? ` data-company="${html(options.company)}"` : '';
  const aria = options.aria ? ` aria-label="${html(options.aria)}"` : '';
  return `<button type="button" class="${classes}" data-action="${html(action)}"${options.itemId ? ` data-id="${html(options.itemId)}"` : ''}${destination}${attributes}${aria}${disabled}>${iconName ? icon(iconName) : ''}<span>${html(label)}</span></button>`;
}

function skillLinks(skills = []) {
  if (!skills.length) return '';
  return `<div class="community-skill-links">${skills.map(skill => `<button type="button" class="community-skill-link" data-action="open-skill" data-skill="${html(skill)}">${html(skill)}</button>`).join('')}</div>`;
}

function communityCard(community, options = {}) {
  const joined = isJoined(community.id);
  const compact = options.compact ? ' community-card--compact' : '';
  return `<article class="community-card${compact}" data-community-card="${html(community.id)}">
    <div class="community-card__top"><span class="community-icon community-icon--${html(community.accent)}">${icon(community.icon)}</span><span class="community-category">${html(community.category)}</span></div>
    <button type="button" class="community-card__title" data-action="open-community" data-id="${html(community.id)}">${html(community.name)}<span aria-hidden="true">${icon('arrow-up-right')}</span></button>
    <p class="community-card__focus">${html(community.focus)}</p>
    <p class="community-card__reason">${html(relevanceReason(community))}</p>
    <div class="community-card__stats"><span>${html(community.members)} <small>members</small></span><span>${community.discussions} <small>discussions</small></span></div>
    <div class="community-card__activity">${icon('activity')}<span>${community.challenges} challenges <b>·</b> ${community.events} events</span></div>
    <div class="community-card__footer"><span class="community-live-indicator"><i></i>${html(community.activity)}</span>${actionButton(joined ? 'leave-community' : 'join-community', joined ? 'Joined' : 'Join', joined ? 'check' : 'plus', { itemId: community.id, small: true, subtle: joined })}</div>
  </article>`;
}

function renderSectionNav() {
  return `<nav class="community-section-nav" aria-label="Community spaces" role="tablist">${communityNavigation.map((section, index) => `<button type="button" id="communityTab-${section.id}" class="community-section-tab ${communityState.activeSection === section.id ? 'is-active' : ''}" role="tab" aria-selected="${communityState.activeSection === section.id}" aria-controls="community-view" tabindex="${communityState.activeSection === section.id ? '0' : '-1'}" data-section="${section.id}">${icon(section.icon)}<span>${html(section.label)}</span>${section.id === 'mine' && communityState.joinedCommunities.length ? `<b>${communityState.joinedCommunities.length}</b>` : ''}</button>`).join('')}</nav>`;
}

function renderSearchAndFilters() {
  const activeFilterCount = Object.entries(communityState.filters).filter(([key, value]) => key === 'saved' || key === 'recommended' ? value : Boolean(value)).length;
  const context = currentContext();
  const skills = [...new Set([...context.skills, ...communityCatalog.map(item => item.skill)])];
  const selected = (key, values) => values.map(value => `<option value="${html(value)}" ${communityState.draftFilters[key] === value ? 'selected' : ''}>${html(value)}</option>`).join('');
  return `<div class="community-toolbar">
    <label class="community-search" for="communitySearch">${icon('search')}<input id="communitySearch" type="search" value="${html(communityState.query)}" placeholder="Search communities, discussions, challenges..." autocomplete="off" aria-label="Search community content"><kbd>Enter</kbd></label>
    <button type="button" class="community-filter-trigger" data-action="toggle-filters" aria-expanded="${communityState.filterOpen}" aria-controls="communityFilterPanel">${icon('sliders-horizontal')}<span>Filters</span>${activeFilterCount ? `<b>${activeFilterCount}</b>` : ''}</button>
    ${actionButton('ask-question', 'Ask a question', 'plus', { primary: true })}
    <button type="button" class="community-icon-button" data-action="open-notifications" aria-label="Community notifications, ${communityState.notifications.filter(item => !item.read).length} unread" title="Notifications">${icon('bell')}${communityState.notifications.some(item => !item.read) ? '<i class="community-notification-dot"></i>' : ''}</button>
    <button type="button" class="community-contribution-trigger" data-action="open-contribution">${icon('user-round')}<span>My contribution</span></button>
    <div class="community-search-results" id="communitySearchResults" ${communityState.query.trim().length < 2 ? 'hidden' : ''} role="region" aria-label="Community search results">${communityState.query.trim().length >= 2 ? renderSearchResults(communityState.query) : ''}</div>
    <aside class="community-filter-panel" id="communityFilterPanel" role="dialog" aria-label="Community filters" ${communityState.filterOpen ? '' : 'hidden'}>
      <div class="community-filter-panel__heading"><div><span class="community-kicker">REFINE DISCOVERY</span><h3>Community filters</h3></div><button type="button" class="community-icon-button" data-action="toggle-filters" aria-label="Close filters">${icon('x')}</button></div>
      <div class="community-filter-groups">
        <label><span>Skill or domain</span><select data-filter="skill"><option value="">All skills</option>${selected('skill', skills)}</select></label>
        <label><span>Community</span><select data-filter="community"><option value="">All communities</option>${selected('community', communityCatalog.map(item => item.name))}</select></label>
        <label><span>Content type</span><select data-filter="contentType"><option value="">All content</option>${selected('contentType', ['Question', 'Technical discussion', 'Career discussion', 'Project discussion', 'Resource discussion', 'Domain discussion', 'Challenge', 'Project', 'Mentor', 'Event', 'Opportunity'])}</select></label>
        <label><span>Difficulty</span><select data-filter="difficulty"><option value="">Any level</option>${selected('difficulty', ['Beginner', 'Intermediate', 'Advanced'])}</select></label>
        <label><span>Role</span><select data-filter="role"><option value="">All roles</option>${selected('role', [...new Set([context.role, 'Software Engineer', 'AI Engineer', 'Data Engineer', 'Backend Engineer'].filter(value => value && value !== 'All Roles'))])}</select></label>
        <label><span>Company context</span><select data-filter="company"><option value="">Any company</option>${selected('company', [...new Set([context.company, 'NVIDIA', 'Microsoft', 'Google'].filter(Boolean))])}</select></label>
        <label><span>Location</span><select data-filter="location"><option value="">Any location</option>${selected('location', ['Global', 'India', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Remote'])}</select></label>
        <label><span>Format</span><select data-filter="format"><option value="">Online or in person</option>${selected('format', ['Online', 'In person'])}</select></label>
        <label><span>Timing</span><select data-filter="timing"><option value="">Any time</option>${selected('timing', ['Upcoming', 'This week', 'Open now'])}</select></label>
        <label><span>Participation</span><select data-filter="participation"><option value="">Anyone</option>${selected('participation', ['Joined communities', 'Saved content', 'Recommended'])}</select></label>
      </div>
      <div class="community-filter-toggles"><label><input type="checkbox" data-filter="saved" ${communityState.draftFilters.saved ? 'checked' : ''}>Saved only</label><label><input type="checkbox" data-filter="recommended" ${communityState.draftFilters.recommended ? 'checked' : ''}>Recommended for me</label></div>
      <div class="community-filter-actions"><button type="button" data-action="clear-filters">Clear all</button>${actionButton('apply-filters', 'Apply filters', '', { primary: true, small: true })}</div>
    </aside>
  </div>`;
}

function searchItems() {
  const discussions = allDiscussions();
  const projects = allProjects();
  return [
    ...communityCatalog.map(item => ({ type: 'Communities', id: item.id, title: item.name, detail: `${item.category} · ${item.focus}`, skills: item.tags, searchable: `${item.name} ${item.category} ${item.focus} ${item.tags.join(' ')}` })),
    ...discussions.map(item => ({ type: 'Discussions', id: item.id, title: item.title, detail: `${communityLabel(item.communityId)} · ${item.author} · ${item.replies} replies`, skills: item.skills, searchable: `${item.title} ${item.body} ${item.author} ${item.skills.join(' ')}` })),
    ...communityChallengeCatalog.map(item => ({ type: 'Challenges', id: item.id, title: item.title, detail: `${communityLabel(item.communityId)} · ${item.difficulty} · ${challengeStatus(item)}`, skills: item.skills, searchable: `${item.title} ${item.problem} ${item.skills.join(' ')}` })),
    ...projects.map(item => ({ type: 'Projects', id: item.id, title: item.title, detail: `${item.status} · ${item.creator}`, skills: item.skills, searchable: `${item.title} ${item.problem} ${item.skills.join(' ')}` })),
    ...communityMentorCatalog.map(item => ({ type: 'Mentors', id: item.id, title: item.name, detail: `${item.domain} · ${item.expertise}`, skills: item.skills, searchable: `${item.name} ${item.domain} ${item.expertise} ${item.skills.join(' ')}` })),
    ...communityEventCatalog.map(item => ({ type: 'Events', id: item.id, title: item.title, detail: `${item.type} · ${formatDemoDate(item.daysFromNow)} · ${item.location}`, skills: item.skills, searchable: `${item.title} ${item.type} ${item.host} ${item.skills.join(' ')}` })),
    ...communityOpportunityCatalog.map(item => ({ type: 'Opportunities', id: item.id, title: item.title, detail: `${item.type} · ${item.organizer}`, skills: item.skills, searchable: `${item.title} ${item.organizer} ${item.role} ${item.skills.join(' ')}` }))
  ];
}

function matchesFilters(item) {
  const filters = communityState.filters;
  const itemSkills = (item.skills || item.tags || [item.skill]).filter(Boolean).map(normalize);
  const itemText = normalize(`${item.title || item.name || ''} ${item.category || ''} ${item.communityId ? communityLabel(item.communityId) : ''} ${item.organizer || item.company || ''} ${item.role || ''} ${item.location || ''} ${item.type || ''} ${item.difficulty || ''} ${(item.skills || item.tags || []).join(' ')}`);
  if (filters.skill && !itemSkills.includes(normalize(filters.skill)) && !itemText.includes(normalize(filters.skill))) return false;
  if (filters.community && normalize(communityLabel(item.communityId)) !== normalize(filters.community) && normalize(item.name) !== normalize(filters.community)) return false;
  if (filters.contentType && normalize(item.type || '') !== normalize(filters.contentType)) return false;
  if (filters.difficulty && normalize(item.difficulty || '') !== normalize(filters.difficulty)) return false;
  if (filters.role && item.role && !normalize(item.role).includes(normalize(filters.role)) && !normalize(filters.role).includes(normalize(item.role))) return false;
  if (filters.company && !itemText.includes(normalize(filters.company))) return false;
  if (filters.location && item.location && !normalize(item.location).includes(normalize(filters.location))) return false;
  if (filters.format && item.location && normalize(item.location) !== normalize(filters.format) && normalize(filters.format) !== 'in person') return false;
  if (filters.timing === 'Upcoming' && !(Number(item.daysFromNow) > 0)) return false;
  if (filters.timing === 'This week' && !(Number(item.daysFromNow) > 0 && Number(item.daysFromNow) <= 7)) return false;
  if (filters.timing === 'Open now' && item.status && !['Open', 'In Progress'].includes(challengeStatus(item))) return false;
  if (filters.participation === 'Joined communities' && !communityState.joinedCommunities.includes(item.communityId) && !communityState.joinedCommunities.includes(item.id)) return false;
  if ((filters.saved || filters.participation === 'Saved content') && !isSaved(item.id)) return false;
  if ((filters.recommended || filters.participation === 'Recommended') && item.communityId && !communityState.joinedCommunities.includes(item.communityId) && communityRelevance(communityById(item.communityId) || { tags: item.skills || [] }) === 0) return false;
  return true;
}

function renderSearchResults(query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const grouped = searchItems().filter(item => matchesFilters(item) && words.every(word => normalize(item.searchable).includes(word))).reduce((result, item) => { (result[item.type] ||= []).push(item); return result; }, {});
  const groups = Object.entries(grouped).filter(([, items]) => items.length).slice(0, 7);
  if (!groups.length) return `<div class="community-search-empty"><strong>No matching community spaces yet</strong><span>Try a skill, role or a shorter phrase.</span></div>`;
  return groups.map(([group, items]) => `<section class="community-search-group"><h3>${html(group)}</h3>${items.slice(0, 3).map(item => `<button type="button" data-action="open-search-result" data-result-type="${html(item.type)}" data-id="${html(item.id)}"><span>${icon(item.type === 'Communities' ? 'users-round' : item.type === 'Discussions' ? 'messages-square' : item.type === 'Challenges' ? 'flag-triangle-right' : item.type === 'Projects' ? 'blocks' : item.type === 'Mentors' ? 'user-round-check' : item.type === 'Events' ? 'calendar-days' : 'move-up-right')}</span><span><strong>${html(item.title)}</strong><small>${html(item.detail)}</small></span>${icon('arrow-up-right')}</button>`).join('')}</section>`).join('');
}

function renderSwitchContextModal() {
  const context = currentContext();
  const availableSkills = [...new Set([...(pageContext.skills || []), 'Python', 'Machine Learning', 'Backend Development', 'System Architecture', 'Embedded Systems', 'Data Engineering', 'TypeScript'])];
  const availableRoles = ['AI Engineer', 'Software Engineer', 'Backend Engineer', 'Machine Learning Engineer', 'Systems Architect', 'Data Engineer'];
  const availableCompanies = ['NVIDIA', 'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple'];
  const activeSkill = context.learning?.skill || context.favoriteSkills[0] || context.skills[0] || 'Python';

  return `${modalHeader('SWITCH ACTIVE CONTEXT', 'Personalize your community view')}
    <form class="community-form" data-form="switch-context">
      <p class="community-modal-lede">Switching your focus immediately updates recommended communities, practice challenges, and relevant discussions.</p>
      <div class="community-form-grid">
        <label>
          <span>Active Skill Focus</span>
          <select name="skill">
            ${availableSkills.map(s => `<option value="${html(s)}"${s === activeSkill ? ' selected' : ''}>${html(s)}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Target Role</span>
          <select name="role">
            ${availableRoles.map(r => `<option value="${html(r)}"${r === context.role ? ' selected' : ''}>${html(r)}</option>`).join('')}
          </select>
        </label>
      </div>
      <label>
        <span>Target Company Context</span>
        <select name="company">
          <option value="">Any company</option>
          ${availableCompanies.map(c => `<option value="${html(c)}"${c === context.company ? ' selected' : ''}>${html(c)}</option>`).join('')}
        </select>
      </label>
      <div class="community-form-actions">
        <button type="button" class="community-button community-button--subtle" data-action="close-modal">Cancel</button>
        <button type="submit" class="community-button community-button--primary">Apply context</button>
      </div>
    </form>`;
}

function renderContextNote() {
  const context = currentContext();
  const activeSkill = context.learning?.skill || context.favoriteSkills[0] || context.skills[0] || 'Choose a skill';
  return `<div class="community-context-line">
    <span class="community-context-line__icon">${icon('waypoints')}</span>
    <div class="community-context-line__body">
      <small>YOUR COMMUNITY CONTEXT</small>
      <strong>${html(activeSkill)}${context.learning?.title ? ` · ${html(context.learning.title)}` : ''}</strong>
    </div>
    ${context.role && context.role !== 'All Roles' ? `<span class="community-context-chip">${html(context.role)}</span>` : ''}
    ${context.company ? `<span class="community-context-chip">${html(context.company)}</span>` : ''}
    <span class="community-context-line__spacer"></span>
    <button type="button" class="community-context-switch-btn" data-action="switch-context" title="Switch active skill or role context">
      ${icon('sliders-horizontal')}<span>Switch context</span>
    </button>
  </div>`;
}

function renderPageShell() {
  const context = currentContext();
  const unread = communityState.notifications.filter(item => !item.read).length;
  return `<div class="community-page-container">
    <header class="community-page-header">
      <div class="community-page-heading"><span class="community-eyebrow">SKILL COMMUNITY</span><h1>Community</h1><p>Learn with people who share your skills, interests and goals.</p></div>
      <div class="community-header-aside"><span class="community-orbit-icon">${icon('orbit')}</span><div><strong>Learn together. Build proof.</strong><small>Discuss, practice and get useful feedback.</small></div></div>
    </header>
    ${renderContextNote()}
    ${renderSearchAndFilters()}
    ${renderSectionNav()}
    <div class="community-active-context" aria-live="polite"><span>${icon('sparkles')}${html(context.learning ? `Connected to ${context.learning.title || `${context.learning.skill} learning`}` : 'A workspace for skills, practice and peer feedback')}</span><a href="#/individual/learning" data-action="open-learning">${context.learning ? 'Continue learning' : 'Explore Learning'} ${icon('arrow-up-right')}</a></div>
    <section id="community-view" class="community-view" role="tabpanel" tabindex="0" aria-labelledby="communityTab-${communityState.activeSection}">${renderActiveSection()}</section>
    <footer class="community-page-footer"><span>Community activity shown here is illustrative prototype data. No real member, mentor, company or event connection is implied.</span><button type="button" data-action="open-contribution">View contribution summary ${icon('arrow-up-right')}</button></footer>
    ${renderModal()}
    ${communityState.toast ? `<div class="community-toast" role="status">${icon('check')}<span>${html(communityState.toast)}</span></div>` : ''}
  </div>`;
}

function sectionHeading(kicker, title, description, action = '') {
  return `<div class="community-section-heading"><div><span class="community-kicker">${html(kicker)}</span><h2>${html(title)}</h2><p>${html(description)}</p></div>${action}</div>`;
}

function renderActivityList(limit = 3) {
  const userActivity = communityState.activity.slice(0, limit);
  const demoActivity = [
    'A Python API design discussion is marked solved.',
    'The model evaluation clinic is open for peer questions.',
    'A sensor-interface challenge is accepting practice submissions.'
  ];
  const lines = userActivity.length ? userActivity.map(item => ({ message: item.message, time: item.time, personal: true })) : demoActivity.slice(0, limit).map((message, index) => ({ message, time: ['Illustrative update', 'This week', 'Upcoming'][index], personal: false }));
  return `<div class="community-activity-list">${lines.map((item, index) => `<article class="community-activity-item"><span class="community-activity-marker ${item.personal ? 'is-personal' : ''}">${icon(item.personal ? 'check' : ['messages-square', 'sparkles', 'flag-triangle-right'][index])}</span><div><p>${html(item.message)}</p><small>${html(item.time)}${item.personal ? '' : ' · demo activity'}</small></div></article>`).join('')}</div>`;
}

function renderContributionSummary(compact = false) {
  const entries = [
    ['Questions', communityState.contributions.questionsAsked], ['Helpful answers', communityState.contributions.helpfulAnswers],
    ['Challenges completed', communityState.contributions.challengesCompleted], ['Projects shared', communityState.contributions.projectsShared],
    ['Peer reviews', communityState.contributions.peerReviews], ['Mentor sessions', communityState.contributions.mentorSessions],
    ['Events attended', communityState.contributions.eventsAttended]
  ];
  return `<div class="community-contribution-grid${compact ? ' is-compact' : ''}">${entries.map(([label, value]) => `<div><strong>${value}</strong><span>${html(label)}</span></div>`).join('')}</div>`;
}

function renderMiniDiscussion(discussion) {
  return `<article class="community-discussion-row"><div class="community-discussion-row__main"><span class="community-discussion-type">${html(discussion.type)} · ${html(communityLabel(discussion.communityId))}</span><button type="button" class="community-discussion-title" data-action="open-discussion" data-id="${html(discussion.id)}">${html(discussion.title)}</button><span class="community-discussion-author">${html(discussion.author)} · ${html(discussion.authorRole || 'Community member')} · ${html(discussion.time || 'Just now')}</span></div><div class="community-discussion-meta"><span>${icon('messages-square')}${discussion.replies + (communityState.userReplies[discussion.id] || []).length} replies</span><span>${icon('heart')} ${discussion.reactions + (communityState.reactions[discussion.id] ? 1 : 0)}</span><span class="community-status-tag ${discussion.status === 'Solved' || discussion.status === 'Answered' ? 'is-complete' : ''}">${html(discussion.status)}</span></div></article>`;
}

function renderChallengeCard(challenge, featured = false) {
  const status = challengeStatus(challenge);
  const inProgress = status === 'In Progress' || status === 'Under Review' || status === 'Completed';
  const action = status === 'Completed' ? 'View completion' : inProgress ? status === 'Under Review' ? 'View submission' : 'Continue challenge' : status === 'Upcoming' ? 'View challenge' : 'Join challenge';
  const actionKey = status === 'Completed' || status === 'Under Review' || status === 'Upcoming' ? 'open-challenge' : inProgress ? 'continue-challenge' : 'join-challenge';
  return `<article class="community-challenge-card${featured ? ' is-featured' : ''}">
    <div class="community-challenge-card__top"><span class="community-challenge-icon">${icon(challenge.communityId === 'embedded' ? 'cpu' : challenge.communityId === 'machine-learning' ? 'brain-circuit' : 'terminal-square')}</span><span class="community-status-tag ${statusClass(status)}">${html(status)}</span></div>
    <span class="community-card-meta">${html(communityLabel(challenge.communityId))} · ${html(challenge.difficulty)}</span><h3>${html(challenge.title)}</h3><p>${html(challenge.problem)}</p>
    ${skillLinks(challenge.skills.slice(0, 3))}
    <div class="community-challenge-details"><span>${icon('users-round')}${challenge.participants + (communityState.participatingChallenges.includes(challenge.id) ? 1 : 0)} participants <small>demo</small></span><span>${icon('clock')}${challenge.daysFromNow ? `Closes ${formatDemoDate(challenge.daysFromNow)}` : 'Review window'}</span><span>${icon('award')}${html(challenge.reward)}</span></div>
    ${challenge.company ? `<div class="community-company-note">${icon('building-2')}<span>${html(challenge.company)}</span></div>` : ''}
    <div class="community-challenge-card__footer">${actionButton(actionKey, action, inProgress ? 'arrow-right' : 'flag-triangle-right', { itemId: challenge.id, primary: !inProgress && status === 'Open', small: true })}${actionButton('save-item', isSaved(challenge.id) ? 'Saved' : 'Save', isSaved(challenge.id) ? 'bookmark-check' : 'bookmark', { itemId: challenge.id, subtle: true, small: true, aria: `${isSaved(challenge.id) ? 'Remove saved' : 'Save'} ${challenge.title}` })}</div>
  </article>`;
}

function statusClass(status) {
  if (['Completed', 'Solved', 'Answered', 'Peer reviewed'].includes(status)) return 'is-complete';
  if (['Under Review', 'Upcoming', 'Open'].includes(status)) return status === 'Under Review' ? 'is-review' : status === 'Open' ? 'is-open' : 'is-upcoming';
  if (['Expired'].includes(status)) return 'is-expired';
  return 'is-progress';
}

function renderEventCard(event, featured = false) {
  const registered = communityState.registeredEvents.includes(event.id);
  return `<article class="community-event-card${featured ? ' is-featured' : ''}"><div class="community-event-date"><strong>${html(formatDemoDate(event.daysFromNow).split(' ')[1])}</strong><span>${html(formatDemoDate(event.daysFromNow).split(' ')[0])}</span></div><div class="community-event-copy"><span class="community-card-meta">${html(event.type)} · ${html(communityLabel(event.communityId))}</span><h3>${html(event.title)}</h3><p>${html(event.time)} · ${html(event.location)} · Hosted by ${html(event.host)}</p><div class="community-event-skills">${event.skills.slice(0, 2).map(skill => `<button type="button" data-action="open-skill" data-skill="${html(skill)}">${html(skill)}</button>`).join('')}</div></div><div class="community-event-side"><small>${event.participants} participants · demo</small>${actionButton(registered ? 'event-registered' : 'register-event', registered ? 'Registered' : 'Register', registered ? 'check' : 'calendar-plus', { itemId: event.id, primary: !registered, small: true })}</div></article>`;
}

function renderProjectCard(project, featured = false) {
  const collaborating = communityState.collaboratingProjects.includes(project.id);
  const showcased = communityState.showcasedProjects.includes(project.id);
  return `<article class="community-project-card${featured ? ' is-featured' : ''}"><div class="community-project-art community-project-art--${featured ? 'large' : 'small'}"><span>${icon(project.communityId === 'embedded' ? 'cpu' : project.communityId === 'machine-learning' ? 'brain-circuit' : 'blocks')}</span><small>${html(communityLabel(project.communityId))} · community project</small></div><div class="community-project-content"><div class="community-project-title-row"><span class="community-status-tag ${statusClass(project.status)}">${html(project.status)}</span>${showcased ? `<span class="community-showcase-label">${icon('badge-check')} Showcased</span>` : ''}</div><button type="button" class="community-card-title-button" data-action="open-project" data-id="${html(project.id)}">${html(project.title)}</button><p>${html(project.problem)}</p>${skillLinks(project.skills.slice(0, 3))}<div class="community-project-meta"><span>${icon('users-round')}${project.contributors + (collaborating ? 1 : 0)} contributors</span><span>${icon('message-circle-heart')}${project.feedback} feedback notes</span><span>Started by ${html(project.creator)}</span></div><div class="community-project-actions">${actionButton(collaborating ? 'project-joined' : 'join-project', collaborating ? 'Collaborating' : project.lookingFor?.length ? 'Join project' : 'View project', collaborating ? 'check' : 'users-round', { itemId: project.id, primary: !collaborating && Boolean(project.lookingFor?.length), small: true })}${actionButton('open-project', 'View work', 'arrow-up-right', { itemId: project.id, subtle: true, small: true })}</div>${project.lookingFor?.length ? `<div class="community-looking-for">Looking for: ${project.lookingFor.map(html).join(' · ')}</div>` : ''}</div></article>`;
}

function renderMentorCard(mentor) {
  const following = communityState.followedMentors.includes(mentor.id);
  const isEnterprise = Boolean(mentor.verifiedEmployee || mentor.company);
  return `<article class="community-mentor-card${isEnterprise ? ' is-enterprise' : ''}"><div class="community-mentor-head"><span class="community-avatar" style="${isEnterprise ? 'background:#2735F5; color:#fff;' : ''}">${html(initials(mentor.name))}</span><div><h3>${html(mentor.name)} ${mentor.rating ? `<span style="font-size:11px; color:#F59E0B; font-weight:700;">★ ${mentor.rating}</span>` : ''}</h3><p>${html(mentor.domain)}</p></div><span class="community-demo-tag" style="${isEnterprise ? 'background:rgba(39,53,245,0.08); color:#2735F5; border-color:rgba(39,53,245,0.2); font-weight:600;' : ''}">${isEnterprise ? html(mentor.company) : 'Community'}</span></div><p class="community-mentor-expertise">${html(mentor.expertise)}</p>${skillLinks(mentor.skills)}<dl><div><dt>Experience</dt><dd>${html(mentor.experience)}</dd></div><div><dt>Availability</dt><dd><strong style="${mentor.availableSlots?.length ? 'color:#059669;' : ''}">${html(mentor.availability)}</strong></dd></div><div><dt>Sessions</dt><dd>${html(mentor.sessions.join(' · '))}</dd></div></dl><div class="community-mentor-actions">${actionButton('open-mentor', 'View mentor', 'user-round', { itemId: mentor.id, subtle: true, small: true })}${actionButton('ask-mentor', 'Ask question', 'message-circle-question', { itemId: mentor.id, primary: true, small: true })}${actionButton('book-mentor', mentor.availableSlots?.length ? 'Book Mock Slot' : 'Request session', 'calendar-check', { itemId: mentor.id, small: true, aria: `Book a session with ${mentor.name}` })}</div><button type="button" class="community-text-action" data-action="follow-mentor" data-id="${html(mentor.id)}">${following ? 'Following' : 'Follow mentor'}</button></article>`;
}


function renderOpportunityCard(opportunity) {
  return `<article class="community-opportunity-row"><span class="community-opportunity-icon">${icon(opportunity.type.includes('Company') ? 'building-2' : opportunity.type === 'Mentorship' ? 'user-round-check' : opportunity.type === 'Collaboration' ? 'blocks' : 'compass')}</span><div class="community-opportunity-copy"><span class="community-card-meta">${html(opportunity.type)} · ${html(opportunity.organizer)}</span><button type="button" class="community-card-title-button" data-action="open-opportunity" data-id="${html(opportunity.id)}">${html(opportunity.title)}</button><p>${html(opportunity.role)} · ${html(opportunity.location)}</p>${skillLinks(opportunity.skills.slice(0, 3))}<small>${html(opportunity.connection)}</small></div><div class="community-opportunity-actions">${actionButton('save-item', isSaved(opportunity.id) ? 'Saved' : 'Save', isSaved(opportunity.id) ? 'bookmark-check' : 'bookmark', { itemId: opportunity.id, subtle: true, small: true })}${actionButton('open-opportunity', 'Explore', 'arrow-up-right', { itemId: opportunity.id, primary: true, small: true })}</div></article>`;
}

function renderCommunityPanel(community) {
  if (!community) return `<div class="community-empty-state"><span>${icon('users-round')}</span><h3>Choose a community to explore</h3><p>Start with a skill from your profile or learning path.</p></div>`;
  const recent = allDiscussions().filter(item => item.communityId === community.id).slice(0, 2);
  return `<article class="community-panel-feature"><div class="community-panel-feature__header"><span class="community-icon community-icon--${html(community.accent)}">${icon(community.icon)}</span><div><span class="community-category">${html(community.category)}</span><h3>${html(community.name)}</h3><p>${html(community.focus)}</p></div><span class="community-demo-tag">Community preview</span></div><p class="community-panel-feature__reason">${html(relevanceReason(community))}</p>${skillLinks([community.skill, ...community.tags.filter(skill => skill !== community.skill).slice(0, 2)])}<div class="community-panel-feature__facts"><span><strong>${html(community.members)}</strong> members <small>demo</small></span><span><strong>${community.discussions}</strong> discussions <small>demo</small></span><span><strong>${community.challenges}</strong> challenges <small>demo</small></span><span><strong>${community.events}</strong> events <small>demo</small></span></div><div class="community-panel-feature__actions">${actionButton(isJoined(community.id) ? 'leave-community' : 'join-community', isJoined(community.id) ? 'Leave community' : 'Join community', isJoined(community.id) ? 'check' : 'plus', { itemId: community.id, primary: !isJoined(community.id) })}${actionButton('open-skill', 'View skill intelligence', 'chart-no-axes-combined', { skill: community.skill, subtle: true })}</div><div class="community-panel-feature__threads"><h4>Recent discussions</h4>${recent.length ? recent.map(renderMiniDiscussion).join('') : `<p class="community-muted-note">No sample discussions are listed for this group yet.</p>`}</div></article>`;
}

function renderDiscoverView() {
  const context = currentContext();
  const recommendations = recommendedCommunities(4);
  const featured = recommendations[0];
  const secondaries = recommendations.slice(1, 4);
  const joined = joinedCommunityNames();
  const discussions = allDiscussions().filter(matchesFilters).slice(0, 3);
  const nextChallenge = communityChallengeCatalog.find(item => challengeStatus(item) === 'Open') || communityChallengeCatalog[0];
  const nextEvent = communityEventCatalog.find(item => !communityState.registeredEvents.includes(item.id)) || communityEventCatalog[0];
  const featuredCompany = context.company || 'your company interests';
  return `<div class="community-discover-view">
    <section class="community-welcome-surface"><div class="community-welcome-copy"><span class="community-kicker">A PLACE TO PRACTICE TOGETHER</span><h2>Bring a skill into the room.</h2><p>Meet a community, ask a better question, then build something you can show.</p><div class="community-welcome-actions">${actionButton('join-community', isJoined(featured.id) ? `Joined ${featured.name}` : `Explore ${featured.name}`, isJoined(featured.id) ? 'check' : 'arrow-right', { itemId: featured.id, primary: true })}${actionButton('set-section', 'Start a discussion', 'messages-square', { section: 'discussions', subtle: true })}</div><div class="community-welcome-context"><span>${icon('book-open')} ${context.learning ? `Learning: ${html(context.learning.title || context.learning.skill)}` : 'Learning path can connect here'}</span><span>${icon('briefcase-business')} ${html(context.role)} direction</span></div></div><div class="community-welcome-art" aria-hidden="true"><div class="community-art-orbit community-art-orbit--outer"></div><div class="community-art-orbit community-art-orbit--inner"></div><span class="community-art-node community-art-node--main">${icon(featured.icon)}</span><span class="community-art-node community-art-node--one">${icon('messages-square')}</span><span class="community-art-node community-art-node--two">${icon('hammer')}</span><span class="community-art-node community-art-node--three">${icon('sparkles')}</span></div><div class="community-welcome-caption">${html(relevanceReason(featured))}</div></section>
    <div class="community-discover-grid">
      <section class="community-section-block community-my-communities-preview">${sectionHeading('YOUR SPACES', 'My communities', 'Pick up where you have already joined.', `<button type="button" class="community-inline-link" data-section="mine">View all ${icon('arrow-right')}</button>`)}${joined.length ? `<div class="community-joined-list">${joined.slice(0, 3).map(item => `<article class="community-joined-row"><span class="community-icon community-icon--${html(item.accent)}">${icon(item.icon)}</span><div><button type="button" data-action="open-community" data-id="${html(item.id)}">${html(item.name)}</button><small>${item.unread || 0} unread discussions · ${html(item.activity)}</small></div><button type="button" class="community-icon-button" data-action="open-community" data-id="${html(item.id)}" aria-label="Open ${html(item.name)}">${icon('arrow-up-right')}</button></article>`).join('')}</div>` : `<div class="community-inline-empty"><span>${icon('users-round')}</span><div><strong>No communities joined yet</strong><p>Join one that fits your skills to build your own community spaces.</p></div><button type="button" class="community-text-action" data-action="set-section" data-section="mine">Find a space ${icon('arrow-right')}</button></div>`}</section>
      <section class="community-section-block community-skill-context">${sectionHeading('CONNECTED TO YOUR GOALS', context.learning ? 'Your learning has company' : 'A thread into your next step', context.learning ? `Your ${context.learning.skill} path can lead into peer practice.` : `Start with ${context.favoriteSkills[0] || context.skills[0] || 'a skill'} and connect practice to a real discussion.`)}<div class="community-learning-link">${icon('route')}<div><small>${context.learning ? 'CURRENT LEARNING' : 'CAREER DIRECTION'}</small><strong>${html(context.learning?.title || context.role)}</strong><span>${html(context.company ? `Company interest: ${context.company}` : 'Turn a discussion into a practice project.')}</span></div>${actionButton(context.learning ? 'open-learning' : 'open-career', context.learning ? 'Continue' : 'Explore roles', 'arrow-up-right', { small: true, subtle: true })}</div><button type="button" class="community-context-small-link" data-action="open-market" data-company="${html(context.company || featuredCompany)}">Connect a company discussion to Market Intelligence ${icon('arrow-up-right')}</button></section>
    </div>
    <section class="community-section-block community-recommended-block">${sectionHeading('DISCOVER COMMUNITIES', context.skills.length ? 'Spaces around your skills' : 'Popular skill communities', context.skills.length ? `Selected for ${context.skills.slice(0, 3).join(', ')} and your ${context.role} direction.` : 'A few good places to start exploring across software and core engineering.', `<button type="button" class="community-inline-link" data-section="mine">Browse all ${icon('arrow-right')}</button>`)}<div class="community-discovery-grid">${[featured, ...secondaries].map(item => communityCard(item)).join('')}</div></section>
    <div class="community-lower-grid"><section class="community-section-block community-discussions-preview">${sectionHeading('DISCUSS AND SHARE', 'Conversations with a purpose', 'Questions, ideas and project feedback connected to a skill.', `<button type="button" class="community-inline-link" data-section="discussions">All discussions ${icon('arrow-right')}</button>`)}<div class="community-discussion-list">${discussions.map(renderMiniDiscussion).join('') || `<div class="community-empty-state community-empty-state--compact"><span>${icon('messages-square')}</span><h3>No conversations match this view</h3><p>Clear a filter or ask the first question.</p>${actionButton('ask-question', 'Ask a question', 'plus', { primary: true, small: true })}</div>`}</div></section><aside class="community-side-rail"><section class="community-section-block community-activity-block">${sectionHeading('COMMUNITY ACTIVITY', 'A little is happening', 'Illustrative activity from these skill spaces.')} ${renderActivityList(3)}</section><section class="community-section-block community-next-step"><span class="community-kicker">NEXT UP</span><h3>${html(nextChallenge.title)}</h3><p>${html(communityLabel(nextChallenge.communityId))} · ${html(nextChallenge.difficulty)} · ${nextChallenge.daysFromNow ? `Closes ${formatDemoDate(nextChallenge.daysFromNow)}` : 'Review window'}</p>${actionButton('open-challenge', 'See the challenge', 'arrow-right', { itemId: nextChallenge.id, subtle: true, small: true })}<div class="community-next-event"><span>${icon('calendar-days')}</span><div><small>NEXT COMMUNITY EVENT</small><strong>${html(nextEvent.title)}</strong><span>${formatDemoDate(nextEvent.daysFromNow)} · ${html(nextEvent.location)}</span></div></div></section></aside></div>
    <section class="community-evidence-strip"><span class="community-evidence-icon">${icon('badge-check')}</span><div><span class="community-kicker">BUILD PROOF THROUGH PRACTICE</span><h3>Good work can travel with you.</h3><p>Completed challenges and reviewed projects can become optional skill evidence. Joining a community alone never changes your skill profile.</p></div>${actionButton('set-section', 'See projects', 'arrow-right', { section: 'projects', subtle: true })}</section>
  </div>`;
}

function renderMyCommunitiesView() {
  const joined = joinedCommunityNames();
  if (!joined.length) return `<div class="community-empty-feature"><div><span class="community-kicker">MY COMMUNITIES</span><h2>Your spaces start with one good question.</h2><p>Join a skill community to keep its discussions, practice challenges and events close at hand.</p>${actionButton('set-section', 'Discover communities', 'compass', { section: 'discover', primary: true })}</div><span class="community-empty-feature__art">${icon('users-round')}</span></div><div class="community-section-block">${sectionHeading('RECOMMENDED STARTING POINTS', 'Communities that fit your context', 'Recommendations use skills and any active learning path in your profile.')}<div class="community-discovery-grid">${recommendedCommunities(3).map(item => communityCard(item)).join('')}</div></div>`;
  return `<div class="community-section-block">${sectionHeading('MY COMMUNITIES', 'Your joined spaces', 'Recent discussions, challenges and event reminders in one place.', actionButton('set-section', 'Discover more', 'plus', { section: 'discover', subtle: true, small: true }))}<div class="community-my-space-grid">${joined.map(item => `<article class="community-my-space"><div class="community-my-space__head"><span class="community-icon community-icon--${html(item.accent)}">${icon(item.icon)}</span><div><span class="community-category">${html(item.category)}</span><h3>${html(item.name)}</h3></div><button type="button" class="community-text-action" data-action="leave-community" data-id="${html(item.id)}">Leave</button></div><div class="community-my-space__pulse"><span>${icon('activity')}${html(item.activity)}</span><span class="community-demo-tag">Illustrative update</span></div><div class="community-my-space__stats"><div><strong>${item.unread || 0}</strong><span>unread discussions · demo</span></div><div><strong>${item.challenges}</strong><span>active challenges · demo</span></div><div><strong>${item.events}</strong><span>upcoming events · demo</span></div></div><div class="community-my-space__next"><div><small>ACTIVE CHALLENGE</small><strong>${html(communityChallengeCatalog.find(challenge => challenge.communityId === item.id)?.title || 'No challenge listed')}</strong></div>${actionButton('set-section', 'Explore', 'arrow-right', { section: 'challenges', small: true, subtle: true })}</div><div class="community-my-space__footer">${actionButton('open-community', 'Open community', 'arrow-up-right', { itemId: item.id, small: true })}${actionButton('open-skill', 'Skill intelligence', 'chart-no-axes-combined', { skill: item.skill, small: true, subtle: true })}</div></article>`).join('')}</div></div><div class="community-lower-grid"><section class="community-section-block">${sectionHeading('RECENT ACTIVITY', 'Updates from your spaces', 'Activity here is labeled demo until a community service is connected.')}${renderActivityList(4)}</section><section class="community-section-block">${sectionHeading('YOUR CONTRIBUTION', 'Participation with a purpose', 'Counts are stored in this browser prototype.')}${renderContributionSummary(true)}</section></div>`;
}

function renderDiscussionsView() {
  const discussions = allDiscussions().filter(matchesFilters);
  return `<div class="community-section-block community-discussions-view">${sectionHeading('DISCUSSIONS', 'Questions get better with context.', 'Browse technical, career, project and domain conversations.', actionButton('ask-question', 'Ask a question', 'plus', { primary: true, small: true }))}<div class="community-discussions-layout"><div class="community-discussion-list">${discussions.map(renderMiniDiscussion).join('') || `<div class="community-empty-state"><span>${icon('messages-square')}</span><h3>No discussions match these filters</h3><p>Clear filters or start a conversation in a skill community.</p>${actionButton('clear-filters', 'Clear filters', 'x', { subtle: true })}</div>`}</div><aside class="community-discussion-aside"><span class="community-kicker">ASK WELL</span><h3>A clear question gets useful answers.</h3><ol><li>Share what you are trying to do.</li><li>Include the decision or error you are facing.</li><li>Link a skill, project or learning topic.</li></ol>${actionButton('ask-question', 'Write a question', 'message-circle-question', { primary: true, small: true })}<div class="community-aside-note">${icon('route')}<span>Questions can connect back to your Learning path.</span></div></aside></div></div>`;
}

function renderChallengesView() {
  const challenges = communityChallengeCatalog.filter(matchesFilters);
  const active = challenges.filter(item => ['In Progress', 'Under Review'].includes(challengeStatus(item)));
  return `<div class="community-section-block">${sectionHeading('CHALLENGES', 'Turn a skill into something you can show.', 'Practice briefs are connected to a domain and can receive peer feedback.', `<span class="community-demo-tag">Prototype challenges</span>`)}${active.length ? `<section class="community-in-progress-strip"><span>${icon('play-circle')}</span><div><small>YOUR ACTIVE PRACTICE</small><strong>${active.map(item => html(item.title)).join(' · ')}</strong></div>${actionButton('continue-challenge', 'Continue', 'arrow-right', { itemId: active[0].id, primary: true, small: true })}</section>` : ''}<div class="community-challenge-grid">${challenges.map(item => renderChallengeCard(item, item.id === challenges[0]?.id)).join('') || `<div class="community-empty-state"><span>${icon('flag-triangle-right')}</span><h3>No challenges match this context</h3><p>Change the skill or clear filters to explore other practice briefs.</p>${actionButton('clear-filters', 'Clear filters', 'x', { subtle: true })}</div>`}</div><section class="community-evidence-strip"><span class="community-evidence-icon">${icon('badge-check')}</span><div><span class="community-kicker">COMPLETION CAN BECOME EVIDENCE</span><h3>Feedback comes before evidence.</h3><p>A completed, reviewed challenge can be added to your skill profile when you choose. Participation alone does not raise skill health.</p></div>${actionButton('open-skill', 'View skill intelligence', 'arrow-up-right', { skill: currentContext().skills[0] || 'Python', subtle: true })}</section></div>`;
}

function renderProjectsView() {
  const projects = allProjects().filter(matchesFilters);
  const highlighted = projects.find(item => item.status === 'Looking for collaborators') || projects[0];
  return `<div class="community-section-block">${sectionHeading('COMMUNITY PROJECTS', 'Build with people, keep the work yours.', 'Projects are spaces for collaboration and feedback, separate from roadmap assignments.', actionButton('create-project', 'Create project', 'plus', { primary: true, small: true }))}<div class="community-project-feature-grid">${highlighted ? renderProjectCard(highlighted, true) : ''}<aside class="community-project-aside"><span class="community-kicker">SHOW YOUR WORK</span><h3>From practice to proof.</h3><p>Share the problem, skills and outcome. Add skill evidence only after meaningful completion and review.</p>${actionButton('open-contribution', 'View contributions', 'badge-check', { subtle: true, small: true })}${actionButton('set-section', 'Find a challenge', 'flag-triangle-right', { section: 'challenges', subtle: true, small: true })}</aside></div><div class="community-project-grid">${projects.filter(item => item.id !== highlighted?.id).map(item => renderProjectCard(item)).join('') || `<div class="community-empty-state community-empty-state--wide"><span>${icon('blocks')}</span><h3>No other community projects yet</h3><p>Start a small project or look for collaborators in the project above.</p>${actionButton('create-project', 'Create project', 'plus', { primary: true, small: true })}</div>`}</div></div>`;
}

function renderMentorsView() {
  const context = currentContext();
  const mentors = [...communityMentorCatalog].sort((a, b) => Number(b.skills.some(skill => context.skills.some(item => normalize(item) === normalize(skill)))) - Number(a.skills.some(skill => context.skills.some(item => normalize(item) === normalize(skill)))));
  return `<div class="community-section-block">${sectionHeading('MENTORS AND PEER GUIDES', 'Find someone to think it through with.', 'Demo profiles show areas of practice. Background and availability are not verified.') }<div class="community-mentor-intro"><span>${icon('message-circle-more')}</span><p>Ask a focused question, request a project review, or ask about a session. Session availability is not connected.</p></div><div class="community-mentor-grid">${mentors.map(renderMentorCard).join('')}</div></div>`;
}

function renderEventsView() {
  const events = communityEventCatalog.filter(matchesFilters).sort((a, b) => a.daysFromNow - b.daysFromNow);
  return `<div class="community-section-block">${sectionHeading('EVENTS', 'Meet around a shared topic.', 'Workshops, study rooms and review sessions shown here are illustrative.', `<span class="community-demo-tag">Demo schedule</span>`)}<div class="community-event-feature">${events[0] ? renderEventCard(events[0], true) : `<div class="community-empty-state"><span>${icon('calendar-days')}</span><h3>No events match these filters</h3><p>Clear filters to see other community event concepts.</p>${actionButton('clear-filters', 'Clear filters', 'x', { subtle: true })}</div>`}</div><div class="community-event-list">${events.slice(1).map(item => renderEventCard(item)).join('')}</div><p class="community-data-note">Dates and registration are local prototype states. No event availability or attendance is verified.</p></div>`;
}

function renderOpportunitiesView() {
  const opportunities = communityOpportunityCatalog.filter(matchesFilters);
  const companyChallenges = opportunities.filter(item => item.type.includes('Company'));
  return `<div class="community-section-block">${sectionHeading('COMMUNITY OPPORTUNITIES', 'Let shared practice open a next door.', 'Collaboration, mentorship and challenge concepts with a clear community connection.', `<span class="community-demo-tag">No hiring guarantees</span>`)}${companyChallenges.length ? `<section class="community-company-opportunity">${icon('building-2')}<div><span class="community-kicker">COMPANY CHALLENGE CONCEPT</span><h3>${html(companyChallenges[0].title)}</h3><p>${html(companyChallenges[0].organizer)} · ${html(companyChallenges[0].connection)}</p>${skillLinks(companyChallenges[0].skills)}</div>${actionButton('open-opportunity', 'Explore', 'arrow-up-right', { itemId: companyChallenges[0].id, primary: true, small: true })}</section>` : ''}<div class="community-opportunity-list">${opportunities.map(renderOpportunityCard).join('') || `<div class="community-empty-state"><span>${icon('compass')}</span><h3>No opportunities match these filters</h3><p>Try another skill or clear filters.</p>${actionButton('clear-filters', 'Clear filters', 'x', { subtle: true })}</div>`}</div><p class="community-data-note">These are illustrative pathways, not confirmed jobs, company programs or mentor appointments.</p></div>`;
}

function renderActiveSection() {
  switch (communityState.activeSection) {
    case 'mine': return renderMyCommunitiesView();
    case 'discussions': return renderDiscussionsView();
    case 'challenges': return renderChallengesView();
    case 'projects': return renderProjectsView();
    case 'mentors': return renderMentorsView();
    case 'events': return renderEventsView();
    case 'opportunities': return renderOpportunitiesView();
    default: return renderDiscoverView();
  }
}

function modalHeader(kicker, title, closeLabel = 'Close dialog') {
  return `<div class="community-modal-header"><div><span class="community-kicker">${html(kicker)}</span><h2 id="communityDialogTitle">${html(title)}</h2></div><button type="button" class="community-icon-button" data-action="close-modal" aria-label="${html(closeLabel)}">${icon('x')}</button></div>`;
}

function renderQuestionModal() {
  const context = currentContext();
  const skillOptions = [...new Set([...context.skills, ...communityCatalog.map(item => item.skill)])];
  return `${modalHeader('START A DISCUSSION', 'Ask a question')}<form class="community-form" data-form="question"><label><span>Question</span><input name="title" required minlength="12" maxlength="150" placeholder="What are you trying to solve?" autocomplete="off"><small>Write a clear question in one sentence.</small></label><label><span>Description</span><textarea name="description" required minlength="20" rows="5" placeholder="Share the context, what you tried and where you are stuck."></textarea></label><div class="community-form-grid"><label><span>Skill or community</span><select name="skill" required>${skillOptions.map(skill => `<option ${normalize(skill) === normalize(context.skills[0]) ? 'selected' : ''}>${html(skill)}</option>`).join('')}</select></label><label><span>Discussion type</span><select name="type"><option>Question</option><option>Technical discussion</option><option>Career discussion</option><option>Project discussion</option><option>Resource discussion</option><option>Domain discussion</option></select></label></div><label><span>Optional tags</span><input name="tags" maxlength="100" placeholder="FastAPI, testing, deployment"><small>Separate tags with commas.</small></label><label><span>Optional project or learning context</span><input name="context" maxlength="120" value="${html(context.learning?.title || '')}" placeholder="A project, challenge or learning topic"></label><p class="community-form-note">Your question is saved in this browser prototype and appears in Discussions.</p><div class="community-form-actions"><button type="button" class="community-button community-button--subtle" data-action="close-modal">Cancel</button><button type="submit" class="community-button community-button--primary">Post question</button></div></form>`;
}

function answersFor(discussion) {
  return [...(discussion.answers || []), ...(communityState.userReplies[discussion.id] || [])];
}

function renderDiscussionModal(discussion) {
  const answers = answersFor(discussion);
  const reacted = Boolean(communityState.reactions[discussion.id]);
  const helpful = communityState.helpfulAnswers;
  const challenge = communityChallengeCatalog.find(item => item.communityId === discussion.communityId);
  return `${modalHeader(communityLabel(discussion.communityId), discussion.title)}<div class="community-discussion-detail"><div class="community-discussion-detail__meta"><span class="community-avatar">${html(initials(discussion.author))}</span><span><strong>${html(discussion.author)}</strong><small>${html(discussion.authorRole || 'Community member')} · ${html(discussion.time || 'Just now')}</small></span><span class="community-status-tag ${statusClass(discussion.status)}">${html(discussion.status)}</span></div><p class="community-discussion-detail__body">${html(discussion.body)}</p>${skillLinks(discussion.skills || [])}<div class="community-discussion-detail__context">${discussion.roadmapRelated && currentContext().learning ? `${icon('route')} Related to your current learning: ${html(currentContext().learning.title || currentContext().learning.skill)}` : `${icon('waypoints')} Connected to ${html(communityLabel(discussion.communityId))}`}</div><div class="community-discussion-actions">${actionButton('react-discussion', reacted ? 'Helpful' : 'Mark helpful', reacted ? 'check' : 'heart', { itemId: discussion.id, subtle: true, small: true })}${actionButton('save-item', isSaved(discussion.id) ? 'Saved' : 'Save discussion', isSaved(discussion.id) ? 'bookmark-check' : 'bookmark', { itemId: discussion.id, subtle: true, small: true })}${actionButton('follow-discussion', communityState.followedDiscussions.includes(discussion.id) ? 'Following' : 'Follow discussion', communityState.followedDiscussions.includes(discussion.id) ? 'bell-ring' : 'bell-plus', { itemId: discussion.id, subtle: true, small: true })}${actionButton('open-skill', 'Skill intelligence', 'chart-no-axes-combined', { skill: discussion.skills?.[0], subtle: true, small: true })}</div><div class="community-answer-heading"><h3>Answers and replies</h3><span>${answers.length} contributions</span></div>${answers.length ? `<div class="community-answer-list">${answers.map(answer => `<article class="community-answer ${answer.accepted ? 'is-accepted' : ''}"><div class="community-answer__head"><span class="community-avatar community-avatar--small">${html(initials(answer.author))}</span><span><strong>${html(answer.author)}</strong><small>${html(answer.role || 'Community member')}</small></span>${answer.label ? `<span class="community-answer-label ${answer.accepted ? 'is-accepted' : answer.label.includes('Mentor') ? 'is-mentor' : ''}">${icon(answer.accepted ? 'badge-check' : answer.label.includes('Mentor') ? 'user-round-check' : 'check')}${html(answer.label)}</span>` : ''}</div><p>${html(answer.text)}</p><button type="button" class="community-answer-helpful" data-action="helpful-answer" data-id="${html(answer.id)}" aria-pressed="${helpful.includes(answer.id)}">${icon('thumbs-up')}${helpful.includes(answer.id) ? 'Helpful' : 'Mark helpful'} · ${Number(answer.helpful || 0) + (helpful.includes(answer.id) ? 1 : 0)}</button></article>`).join('')}</div>` : `<div class="community-empty-state community-empty-state--compact"><span>${icon('messages-square')}</span><h3>Be the first to reply</h3><p>Share a concrete idea or ask for one more detail.</p></div>`}${discussion.companyResponse ? `<aside class="community-company-response">${icon('building-2')}<div><strong>Company response · demo example</strong><p>This label demonstrates how an organization response could appear. No company representative is connected.</p></div></aside>` : ''}<form class="community-reply-form" data-form="reply" data-id="${html(discussion.id)}"><label for="communityReply">Add a reply</label><textarea id="communityReply" name="reply" required minlength="8" rows="3" placeholder="Share a useful reply..."></textarea><div class="community-form-actions">${actionButton('open-learning', 'Related learning', 'book-open', { subtle: true, small: true })}<button type="submit" class="community-button community-button--primary">Reply</button></div></form>${challenge ? `<aside class="community-related-challenge"><span>${icon('flag-triangle-right')}</span><div><small>RELATED PRACTICE</small><strong>${html(challenge.title)}</strong></div>${actionButton('open-challenge', 'Explore', 'arrow-right', { itemId: challenge.id, small: true, subtle: true })}</aside>` : ''}</div>`;
}

function renderChallengeModal(challenge) {
  const status = challengeStatus(challenge);
  const joined = communityState.participatingChallenges.includes(challenge.id);
  const submission = communityState.submissions[challenge.id];
  const completed = communityState.completedChallenges.includes(challenge.id);
  return `${modalHeader('CHALLENGE DETAILS', challenge.title)}<div class="community-challenge-detail"><div class="community-modal-badges"><span class="community-status-tag ${statusClass(status)}">${html(status)}</span><span class="community-status-tag is-neutral">${html(challenge.difficulty)}</span><span class="community-status-tag is-neutral">${html(challenge.timeEstimate)}</span></div><p class="community-modal-lede">${html(challenge.problem)}</p><div class="community-challenge-brief-grid"><div><small>EXPECTED OUTCOME</small><p>${html(challenge.outcome)}</p></div><div><small>REQUIRED SKILLS</small>${skillLinks(challenge.skills)}</div><div><small>DEADLINE</small><p>${challenge.daysFromNow ? `${formatDemoDate(challenge.daysFromNow)} · illustrative deadline` : 'Review window · demo'}</p></div><div><small>PARTICIPANTS</small><p>${challenge.participants + (joined ? 1 : 0)} participants · demo count</p></div></div><div class="community-challenge-rules"><section><h3>Brief rules</h3><ul>${challenge.rules.map(rule => `<li>${html(rule)}</li>`).join('')}</ul></section><section><h3>Review criteria</h3><ul>${challenge.criteria.map(rule => `<li>${html(rule)}</li>`).join('')}</ul></section></div><div class="community-challenge-resource"><span>${icon('book-open')}</span><div><small>RELATED LEARNING</small><strong>${html(challenge.skills[0])} practice and review</strong></div>${actionButton('open-learning', 'Explore', 'arrow-up-right', { small: true, subtle: true })}</div>${submission ? `<div class="community-submission-note"><strong>${completed ? 'Completed after your review' : 'Submission under review'}</strong><p>${html(submission)}${communityState.evidence.some(item => item.sourceId === challenge.id) ? '<br><span>Skill evidence saved by you.</span>' : ''}</p></div>` : ''}<div class="community-modal-footer">${completed ? `${actionButton('add-challenge-evidence', communityState.evidence.some(item => item.sourceId === challenge.id) ? 'Evidence added' : 'Add skill evidence', 'badge-check', { itemId: challenge.id, subtle: true, disabled: communityState.evidence.some(item => item.sourceId === challenge.id) })}` : status === 'Under Review' ? actionButton('complete-challenge-review', 'Mark review complete', 'badge-check', { itemId: challenge.id, primary: true }) : status === 'Upcoming' ? `<span class="community-modal-note">This practice brief opens soon.</span>` : joined ? actionButton('continue-challenge', 'Continue challenge', 'arrow-right', { itemId: challenge.id, primary: true }) : actionButton('join-challenge', 'Start challenge', 'flag-triangle-right', { itemId: challenge.id, primary: true })}</div>${joined && !submission && !completed ? `<form class="community-submission-form" data-form="challenge-submission" data-id="${html(challenge.id)}"><label><span>Submit work for feedback</span><textarea name="submission" required minlength="20" rows="3" placeholder="Link your work or describe the completed practice and the checks you made."></textarea></label><small>Submitting records a local review state. No reviewer is automatically assigned.</small><button type="submit" class="community-button community-button--subtle">Submit for feedback</button></form>` : ''}<p class="community-data-note">Challenge participation and submissions are stored in this browser prototype.</p></div>`;
}

function renderProjectModal(project) {
  const collaborating = communityState.collaboratingProjects.includes(project.id);
  const showcased = communityState.showcasedProjects.includes(project.id);
  const owned = communityState.userProjects.some(item => item.id === project.id);
  const eligibleEvidence = Boolean(project.completed && project.peerReviewed && owned);
  return `${modalHeader('COMMUNITY PROJECT', project.title)}<div class="community-project-detail"><span class="community-status-tag ${statusClass(project.status)}">${html(project.status)}</span><p class="community-modal-lede">${html(project.problem)}</p><div class="community-project-detail-grid"><div><small>CREATOR</small><p>${html(project.creator)}</p></div><div><small>TECHNOLOGY</small><p>${html(project.technology)}</p></div><div><small>CONTRIBUTORS</small><p>${project.contributors + (collaborating ? 1 : 0)}</p></div><div><small>COMMUNITY FEEDBACK</small><p>${project.feedback} notes · illustrative</p></div><div><small>SKILLS</small>${skillLinks(project.skills)}</div>${project.link ? `<div><small>PROJECT LINK</small><a href="${html(safeUrl(project.link))}" target="_blank" rel="noreferrer">Open project ${icon('arrow-up-right')}</a></div>` : ''}</div><p class="community-data-note">${html(project.notes || 'Community project information is illustrative.')}</p><div class="community-project-detail-actions">${project.lookingFor?.length && !collaborating ? actionButton('join-project', 'Join project', 'users-round', { itemId: project.id, primary: true }) : ''}${collaborating ? `<span class="community-status-tag is-complete">${icon('check')} You are collaborating</span>` : ''}${owned ? actionButton('toggle-showcase', showcased ? 'Remove from showcase' : 'Showcase project', 'panels-top-left', { itemId: project.id, subtle: true }) : ''}${eligibleEvidence ? actionButton('add-project-evidence', communityState.evidence.some(item => item.sourceId === project.id) ? 'Evidence added' : 'Add skill evidence', 'badge-check', { itemId: project.id, subtle: true, disabled: communityState.evidence.some(item => item.sourceId === project.id) }) : ''}</div><div class="community-project-feedback"><h3>Feedback and review</h3><p>${project.completed && project.peerReviewed ? 'This project has a peer review recorded by its creator.' : 'Feedback belongs to the project contributors. No reviewer is connected in this prototype.'}</p>${actionButton('react-project', 'Helpful project', communityState.reactions[project.id] ? 'check' : 'thumbs-up', { itemId: project.id, small: true, subtle: true })}</div></div>`;
}

function renderMentorModal(mentor, intent = 'profile') {
  const following = communityState.followedMentors.includes(mentor.id);
  if (intent === 'ask' || intent === 'session') {
    const hasSlots = mentor.availableSlots && mentor.availableSlots.length > 0;
    return `${modalHeader(intent === 'ask' ? 'ASK A MENTOR' : 'BOOK MENTORSHIP / MOCK INTERVIEW', intent === 'ask' ? `Ask ${mentor.name} a question` : `Schedule Session with ${mentor.name} · ${mentor.company || 'Enterprise'}`)}
    <form class="community-form" data-form="mentor-request" data-id="${html(mentor.id)}" data-kind="${intent}">
      <p class="community-data-note" style="margin-bottom:12px;">${html(mentor.bio)}</p>
      ${intent === 'session' ? `
        ${hasSlots ? `
          <label style="margin-bottom:12px; display:block;">
            <span style="font-weight:600; color:var(--ink); font-size:12px; display:block; margin-bottom:5px;">Select Available Mock Interview / Review Slot</span>
            <select name="slotId" style="width:100%; height:38px; border-radius:8px; border:1px solid #D1D5DB; padding:0 10px; font-size:12.5px; background:#fff;">
              ${mentor.availableSlots.map(s => `<option value="${s.id}">${s.date} · ${s.time} — [${s.format}] ${s.focusArea}</option>`).join('')}
            </select>
          </label>
        ` : `
          <label><span>Session topic</span><select name="topic">${mentor.sessions.map(item => `<option>${html(item)}</option>`).join('')}</select></label>
        `}
      ` : ''}
      <label><span>${intent === 'ask' ? 'Your question' : 'Preparation Notes or Focus Areas'}</span><textarea name="message" rows="3" placeholder="Share your candidate background, topics you want to drill, or specific architecture questions."></textarea></label>
      <div class="community-form-actions">
        <button type="button" class="community-button community-button--subtle" data-action="close-modal">Cancel</button>
        <button type="submit" class="community-button community-button--primary">${intent === 'ask' ? 'Send Question' : 'Confirm Booking'}</button>
      </div>
    </form>`;
  }
  return `${modalHeader('MENTOR PROFILE', mentor.name)}<div class="community-mentor-detail"><div class="community-mentor-profile-head"><span class="community-avatar community-avatar--large" style="${mentor.company ? 'background:#2735F5; color:#fff;' : ''}">${html(initials(mentor.name))}</span><div><h3>${html(mentor.domain)}</h3><p>${html(mentor.expertise)} · <strong>${html(mentor.company || 'Community')}</strong></p></div></div><p>${html(mentor.bio)}</p>${skillLinks(mentor.skills)}<dl><div><dt>Practice experience</dt><dd>${html(mentor.experience)}</dd></div><div><dt>Availability</dt><dd><strong>${html(mentor.availability)}</strong></dd></div><div><dt>Community involvement</dt><dd>${mentor.communityIds.map(id => html(communityLabel(id))).join(' · ')}</dd></div><div><dt>Session formats</dt><dd>${html(mentor.sessions.join(' · '))}</dd></div></dl><div class="community-modal-footer">${actionButton('follow-mentor', following ? 'Following' : 'Follow mentor', following ? 'check' : 'user-round-plus', { itemId: mentor.id, subtle: true })}${actionButton('ask-mentor', 'Ask a question', 'message-circle-question', { itemId: mentor.id, primary: true })}${actionButton('book-mentor', mentor.availableSlots?.length ? 'Book Mock Slot' : 'Request session', 'calendar-check', { itemId: mentor.id })}</div></div>`;
}


function renderEventModal(event) {
  const registered = communityState.registeredEvents.includes(event.id);
  return `${modalHeader('COMMUNITY EVENT', event.title)}<div class="community-event-detail"><span class="community-status-tag is-upcoming">${html(event.type)}</span><p class="community-modal-lede">${html(event.notes)}</p><dl><div><dt>Date</dt><dd>${formatDemoDate(event.daysFromNow)} · ${html(event.time)}</dd></div><div><dt>Host</dt><dd>${html(event.host)}</dd></div><div><dt>Skill</dt><dd>${event.skills.map(html).join(' · ')}</dd></div><div><dt>Format</dt><dd>${html(event.location)}</dd></div><div><dt>Participants</dt><dd>${event.participants + (registered ? 1 : 0)} · illustrative count</dd></div></dl><p class="community-data-note">${html(event.notes)} Registration is local to this browser and does not reserve an external place.</p><div class="community-modal-footer">${actionButton(registered ? 'event-registered' : 'register-event', registered ? 'Registered' : 'Register', registered ? 'check' : 'calendar-plus', { itemId: event.id, primary: !registered, disabled: registered })}${actionButton('open-skill', 'View related skill', 'arrow-up-right', { skill: event.skills[0], subtle: true })}</div></div>`;
}

function renderOpportunityModal(opportunity) {
  return `${modalHeader('COMMUNITY OPPORTUNITY', opportunity.title)}<div class="community-opportunity-detail"><span class="community-status-tag is-neutral">${html(opportunity.type)}</span><p class="community-modal-lede">${html(opportunity.connection)}</p><dl><div><dt>Organizer</dt><dd>${html(opportunity.organizer)}</dd></div><div><dt>Role or activity</dt><dd>${html(opportunity.role)}</dd></div><div><dt>Location</dt><dd>${html(opportunity.location)}</dd></div><div><dt>Skills</dt><dd>${opportunity.skills.map(html).join(' · ')}</dd></div><div><dt>Community link</dt><dd>${html(communityLabel(opportunity.communityId))}</dd></div></dl><div class="community-modal-footer">${actionButton('save-item', isSaved(opportunity.id) ? 'Saved' : 'Save opportunity', isSaved(opportunity.id) ? 'bookmark-check' : 'bookmark', { itemId: opportunity.id, subtle: true })}${opportunity.type.includes('Company') ? actionButton('open-market', 'Explore company signals', 'chart-no-axes-combined', { company: pageContext.targetCompany || 'NVIDIA', subtle: true }) : actionButton('set-section', 'Explore related practice', 'flag-triangle-right', { section: opportunity.type === 'Mentorship' ? 'mentors' : 'projects', subtle: true })}${actionButton('open-career', 'Explore Career', 'arrow-up-right', { primary: true })}</div></div>`;
}

function renderContributionModal() {
  return `${modalHeader('YOUR COMMUNITY CONTRIBUTION', 'Work that adds up')}<div class="community-contribution-modal"><p class="community-modal-lede">This summary reflects actions you completed in this browser prototype. It does not award points for joining or browsing.</p>${renderContributionSummary()}<div class="community-evidence-list"><h3>Skill evidence you chose to keep</h3>${communityState.evidence.length ? communityState.evidence.map(item => `<article><span>${icon(item.kind === 'challenge' ? 'flag-triangle-right' : 'blocks')}</span><div><strong>${html(item.title)}</strong><small>${html(item.kind === 'challenge' ? 'Completed challenge' : 'Completed, peer-reviewed project')} · ${html(item.skill)} · added by you</small></div><button type="button" data-action="open-skill" data-skill="${html(item.skill)}">View skill ${icon('arrow-up-right')}</button></article>`).join('') : `<div class="community-empty-state community-empty-state--compact"><span>${icon('badge-check')}</span><h3>No skill evidence saved yet</h3><p>Completed and reviewed work becomes eligible. You choose when to add it.</p></div>`}</div></div>`;
}

function renderNotificationModal() {
  if (!communityState.notifications.length) return `${modalHeader('COMMUNITY NOTIFICATIONS', 'No community updates yet')}<div class="community-empty-state"><span>${icon('bell')}</span><h3>Your updates will appear here</h3><p>Prototype replies, review states and saved requests can add local notifications.</p></div>`;
  return `${modalHeader('COMMUNITY NOTIFICATIONS', 'Your community updates')}<div class="community-notification-list">${communityState.notifications.map(item => `<article class="${item.read ? '' : 'is-unread'}"><span>${icon(item.message.toLowerCase().includes('challenge') ? 'flag-triangle-right' : 'messages-square')}</span><div><strong>${html(item.message)}</strong><small>${html(item.time)} · local prototype</small></div>${!item.read ? `<button type="button" data-action="read-notification" data-id="${html(item.id)}">Mark read</button>` : ''}</article>`).join('')}</div><div class="community-modal-footer">${actionButton('read-all-notifications', 'Mark all read', 'check-check', { subtle: true })}</div>`;
}

function renderCommunityDetailModal(community) {
  return `${modalHeader('SKILL COMMUNITY', community.name)}${renderCommunityPanel(community)}<div class="community-modal-footer">${actionButton(isJoined(community.id) ? 'leave-community' : 'join-community', isJoined(community.id) ? 'Leave community' : 'Join community', isJoined(community.id) ? 'check' : 'plus', { itemId: community.id, primary: !isJoined(community.id) })}${actionButton('set-section', 'See discussions', 'messages-square', { section: 'discussions', subtle: true })}</div>`;
}

function renderProjectForm() {
  const context = currentContext();
  return `${modalHeader('START A COMMUNITY PROJECT', 'What would you like to build?')}<form class="community-form" data-form="project"><label><span>Project title</span><input name="title" required minlength="4" maxlength="90" placeholder="Give the project a clear working title"></label><label><span>Problem to solve</span><textarea name="problem" required minlength="20" rows="4" placeholder="Who is this for, and what should the project help them do?"></textarea></label><div class="community-form-grid"><label><span>Primary skill</span><select name="skill">${[...new Set([...context.skills, ...communityCatalog.map(item => item.skill)])].map(skill => `<option>${html(skill)}</option>`).join('')}</select></label><label><span>Project format</span><select name="format"><option>Solo</option><option>Looking for collaborators</option><option>Team project</option><option>Mentor-supported</option><option>Company challenge project</option></select></label></div><label><span>Technology used</span><input name="technology" maxlength="100" placeholder="Tools, frameworks or materials"></label><label><span>Demo or repository link, optional</span><input name="link" type="url" placeholder="https://"></label><label class="community-check-field"><input name="completed" type="checkbox"><span>My project is complete and I have received peer feedback.</span></label><p class="community-form-note">Sharing your project does not add skill evidence automatically. Evidence is optional and requires completed, peer-reviewed work.</p><div class="community-form-actions"><button type="button" class="community-button community-button--subtle" data-action="close-modal">Cancel</button><button type="submit" class="community-button community-button--primary">Share project</button></div></form>`;
}

function renderModal() {
  if (!communityState.modal) return '';
  const modal = communityState.modal;
  let content = '';
  if (modal.type === 'question') content = renderQuestionModal();
  else if (modal.type === 'discussion') { const item = allDiscussions().find(discussion => discussion.id === modal.id); if (item) content = renderDiscussionModal(item); }
  else if (modal.type === 'challenge') { const item = communityChallengeCatalog.find(challenge => challenge.id === modal.id); if (item) content = renderChallengeModal(item); }
  else if (modal.type === 'project') { const item = allProjects().find(project => project.id === modal.id); if (item) content = renderProjectModal(item); }
  else if (modal.type === 'community') { const item = communityById(modal.id); if (item) content = renderCommunityDetailModal(item); }
  else if (modal.type === 'create-project') content = renderProjectForm();
  else if (modal.type === 'mentor' || modal.type === 'mentor-ask' || modal.type === 'mentor-session') { const item = communityMentorCatalog.find(mentor => mentor.id === modal.id); if (item) content = renderMentorModal(item, modal.type === 'mentor-ask' ? 'ask' : modal.type === 'mentor-session' ? 'session' : 'profile'); }
  else if (modal.type === 'event') { const item = communityEventCatalog.find(event => event.id === modal.id); if (item) content = renderEventModal(item); }
  else if (modal.type === 'opportunity') { const item = communityOpportunityCatalog.find(opportunity => opportunity.id === modal.id); if (item) content = renderOpportunityModal(item); }
  else if (modal.type === 'contribution') content = renderContributionModal();
  else if (modal.type === 'notifications') content = renderNotificationModal();
  else if (modal.type === 'switch-context') content = renderSwitchContextModal();
  else if (modal.type === 'profile') content = `<div class="community-modal-header"><div><span class="community-kicker">PUBLIC COMMUNITY PROFILE</span><h2 id="communityDialogTitle">${html(modal.name)}</h2></div><button type="button" class="community-icon-button" data-action="close-modal" aria-label="Close profile">${icon('x')}</button></div><p class="community-modal-lede">${html(modal.role || 'Community participant')} · demo profile</p>${skillLinks(modal.skills || [])}<p class="community-data-note">Only community-relevant demo information is shown here.</p>`;
  if (!content) return '';
  return `<div class="community-modal-scrim" data-action="modal-scrim"><section class="community-modal" role="dialog" aria-modal="true" aria-labelledby="communityDialogTitle" tabindex="-1">${content}</section></div>`;
}

function refreshCommunity() {
  persistCommunityState();
  renderCommunityPage();
}

function openModal(type, id = '', extra = {}) {
  communityState.modal = { type, id, ...extra };
  renderCommunityPage();
}

function closeModal() {
  communityState.modal = null;
  renderCommunityPage();
}

function toggleList(listName, id) {
  const list = communityState[listName];
  communityState[listName] = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
  persistCommunityState();
}

function markNotificationRead(id = '') {
  communityState.notifications = communityState.notifications.map(item => id ? item.id === id ? { ...item, read: true } : item : { ...item, read: true });
}

function dispatchAction(button) {
  const action = button.dataset.action;
  const id = button.dataset.id || '';
  const community = communityById(id);
  const discussion = allDiscussions().find(item => item.id === id);
  const challenge = communityChallengeCatalog.find(item => item.id === id);
  const project = allProjects().find(item => item.id === id);
  const mentor = communityMentorCatalog.find(item => item.id === id);
  const event = communityEventCatalog.find(item => item.id === id);
  const opportunity = communityOpportunityCatalog.find(item => item.id === id);

  if (action === 'set-section') {
    communityState.activeSection = sectionsWithData.includes(button.dataset.section) ? button.dataset.section : 'discover';
    communityState.query = '';
    communityState.modal = null;
    renderCommunityPage();
  } else if (action === 'toggle-filters') {
    communityState.filterOpen = !communityState.filterOpen;
    communityState.draftFilters = { ...communityState.filters };
    renderCommunityPage();
  } else if (action === 'apply-filters') {
    communityState.filters = { ...communityState.draftFilters };
    communityState.filterOpen = false;
    renderCommunityPage();
  } else if (action === 'clear-filters') {
    communityState.filters = { ...emptyFilters };
    communityState.draftFilters = { ...emptyFilters };
    communityState.filterOpen = false;
    communityState.query = '';
    renderCommunityPage();
  } else if (action === 'switch-context') openModal('switch-context');
  else if (action === 'ask-question') openModal('question');
  else if (action === 'join-community' && community) {
    if (!isJoined(id)) { communityState.joinedCommunities.push(id); recordActivity(`You joined ${community.name}.`); }
    else toast(`You are already in ${community.name}.`);
    refreshCommunity();
  } else if (action === 'leave-community' && community) {
    communityState.joinedCommunities = communityState.joinedCommunities.filter(item => item !== id);
    recordActivity(`You left ${community.name}.`);
    communityState.modal = null;
    refreshCommunity();
  } else if (action === 'open-community' && community) openModal('community', id);
  else if (action === 'open-discussion' && discussion) openModal('discussion', id);
  else if (action === 'save-item') {
    toggleList('savedItems', id);
    toast(isSaved(id) ? 'Saved to your community workspace.' : 'Removed from saved community items.');
  } else if (action === 'follow-discussion' && discussion) {
    toggleList('followedDiscussions', id);
    communityState.modal = { type: 'discussion', id };
    refreshCommunity();
  } else if (action === 'react-discussion' && discussion) {
    communityState.reactions[id] = !communityState.reactions[id];
    if (!communityState.reactions[id]) delete communityState.reactions[id];
    communityState.modal = { type: 'discussion', id };
    refreshCommunity();
  } else if (action === 'helpful-answer') {
    toggleList('helpfulAnswers', id);
    communityState.contributions.helpfulAnswers = communityState.helpfulAnswers.length;
    communityState.modal = { type: 'discussion', id: communityState.modal?.id };
    refreshCommunity();
  } else if (action === 'open-challenge' && challenge) openModal('challenge', id);
  else if ((action === 'join-challenge' || action === 'continue-challenge') && challenge) {
    if (!communityState.participatingChallenges.includes(id)) communityState.participatingChallenges.push(id);
    communityState.modal = { type: 'challenge', id };
    recordActivity(`You started ${challenge.title}.`);
    refreshCommunity();
  } else if (action === 'complete-challenge-review' && challenge) {
    if (!communityState.completedChallenges.includes(id)) communityState.completedChallenges.push(id);
    communityState.contributions.challengesCompleted = communityState.completedChallenges.length;
    recordActivity(`You completed and reviewed ${challenge.title}.`);
    communityState.modal = { type: 'challenge', id };
    refreshCommunity();
  } else if (action === 'add-challenge-evidence' && challenge) {
    if (!communityState.evidence.some(item => item.sourceId === id)) communityState.evidence.unshift({ sourceId: id, kind: 'challenge', title: challenge.title, skill: challenge.skills[0], date: new Date().toISOString() });
    communityState.modal = { type: 'challenge', id };
    refreshCommunity();
  } else if (action === 'create-project') openModal('create-project');
  else if (action === 'open-project' && project) openModal('project', id);
  else if (action === 'join-project' && project) {
    if (!communityState.collaboratingProjects.includes(id)) communityState.collaboratingProjects.push(id);
    recordActivity(`You joined the ${project.title} project.`);
    communityState.modal = { type: 'project', id };
    refreshCommunity();
  } else if (action === 'toggle-showcase' && project) {
    toggleList('showcasedProjects', id);
    communityState.modal = { type: 'project', id };
    refreshCommunity();
  } else if (action === 'add-project-evidence' && project) {
    if (!communityState.evidence.some(item => item.sourceId === id)) communityState.evidence.unshift({ sourceId: id, kind: 'project', title: project.title, skill: project.skills[0], date: new Date().toISOString() });
    communityState.modal = { type: 'project', id };
    refreshCommunity();
  } else if (action === 'react-project' && project) {
    communityState.reactions[id] = !communityState.reactions[id];
    if (!communityState.reactions[id]) delete communityState.reactions[id];
    communityState.modal = { type: 'project', id };
    refreshCommunity();
  } else if (action === 'open-mentor' && mentor) openModal('mentor', id);
  else if (action === 'ask-mentor' && mentor) openModal('mentor-ask', id);
  else if (action === 'book-mentor' && mentor) openModal('mentor-session', id);
  else if (action === 'follow-mentor' && mentor) {
    toggleList('followedMentors', id);
    communityState.modal = { type: 'mentor', id };
    refreshCommunity();
  } else if (action === 'open-event' && event) openModal('event', id);
  else if (action === 'register-event' && event) {
    if (!communityState.registeredEvents.includes(id)) communityState.registeredEvents.push(id);
    recordActivity(`You registered interest in ${event.title}.`);
    communityState.modal = { type: 'event', id };
    refreshCommunity();
  } else if (action === 'event-registered' && event) openModal('event', id);
  else if (action === 'open-opportunity' && opportunity) openModal('opportunity', id);
  else if (action === 'open-contribution') openModal('contribution');
  else if (action === 'open-notifications') { communityState.notifications = communityState.notifications.map(item => ({ ...item, read: true })); openModal('notifications'); }
  else if (action === 'read-notification') { markNotificationRead(id); communityState.modal = { type: 'notifications' }; refreshCommunity(); }
  else if (action === 'read-all-notifications') { markNotificationRead(); communityState.modal = { type: 'notifications' }; refreshCommunity(); }
  else if (action === 'open-skill') pageActions.openSkill?.(button.dataset.skill);
  else if (action === 'open-learning') pageActions.openLearning?.(currentContext().learning?.skill || currentContext().skills[0]);
  else if (action === 'open-career') pageActions.openCareer?.(currentContext().role);
  else if (action === 'open-market') pageActions.openMarket?.(button.dataset.company || currentContext().company);
  else if (action === 'close-modal') closeModal();
  else if (action === 'open-search-result') openSearchResult(button.dataset.resultType, id);
}

function openSearchResult(type, id) {
  const section = ({ Communities: 'discover', Discussions: 'discussions', Challenges: 'challenges', Projects: 'projects', Mentors: 'mentors', Events: 'events', Opportunities: 'opportunities' })[type] || 'discover';
  communityState.activeSection = section;
  communityState.query = '';
  communityState.modal = null;
  renderCommunityPage();
  if (type === 'Communities') openModal('community', id);
  else if (type === 'Discussions') openModal('discussion', id);
  else if (type === 'Challenges') openModal('challenge', id);
  else if (type === 'Projects') openModal('project', id);
  else if (type === 'Mentors') openModal('mentor', id);
  else if (type === 'Events') openModal('event', id);
  else if (type === 'Opportunities') openModal('opportunity', id);
}

function bindCommunityEvents(root) {
  if (root._communityClickHandler) {
    root.removeEventListener('click', root._communityClickHandler);
    root.removeEventListener('input', root._communityInputHandler);
    root.removeEventListener('change', root._communityChangeHandler);
    root.removeEventListener('submit', root._communitySubmitHandler);
    root.removeEventListener('keydown', root._communityKeydownHandler);
  }

  root._communityClickHandler = event => {
    const sectionTab = event.target.closest('[data-section]');
    if (sectionTab) {
      event.preventDefault();
      communityState.activeSection = sectionTab.dataset.section;
      communityState.modal = null;
      communityState.filterOpen = false;
      persistCommunityState();
      renderCommunityPage();
      root.querySelector(`[data-section="${communityState.activeSection}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (event.target.closest('[data-action="modal-scrim"]') && event.target === event.target.closest('[data-action="modal-scrim"]')) { closeModal(); return; }

    // Close filters if clicked outside
    if (communityState.filterOpen && !event.target.closest('#communityFilterPanel') && !event.target.closest('[data-action="toggle-filters"]')) {
      communityState.filterOpen = false;
      renderCommunityPage();
      return;
    }

    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    if (button.dataset.action === 'set-section') { dispatchAction(button); return; }
    dispatchAction(button);
  };

  root._communityInputHandler = event => {
    if (event.target.id === 'communitySearch') {
      communityState.query = event.target.value;
      const panel = root.querySelector('#communitySearchResults');
      if (panel) { panel.hidden = communityState.query.trim().length < 2; panel.innerHTML = panel.hidden ? '' : renderSearchResults(communityState.query); window.lucide?.createIcons?.(); }
    }
  };

  root._communityChangeHandler = event => {
    const control = event.target.closest('[data-filter]');
    if (control) communityState.draftFilters[control.dataset.filter] = control.type === 'checkbox' ? control.checked : control.value;
  };

  root._communitySubmitHandler = event => {
    const form = event.target.closest('[data-form]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const read = key => String(values.get(key) || '').trim();
    const formType = form.dataset.form;

    if (formType === 'switch-context') {
      const selectedSkill = read('skill');
      const selectedRole = read('role');
      const selectedCompany = read('company');
      pageContext.learning = { skill: selectedSkill, title: `${selectedSkill} Mastery Track` };
      pageContext.skills = [selectedSkill, ...(pageContext.skills || []).filter(s => s !== selectedSkill)];
      pageContext.favoriteSkills = [selectedSkill, ...(pageContext.favoriteSkills || []).filter(s => s !== selectedSkill)];
      pageContext.targetRole = selectedRole;
      pageContext.targetCompany = selectedCompany;
      closeModal();
      toast(`Community context updated for ${selectedSkill}.`);
    } else if (formType === 'question') {
      const skill = read('skill');
      const community = communityCatalog.find(item => item.tags.some(tag => normalize(tag) === normalize(skill))) || communityCatalog[0];
      const discussion = { id: `question-${Date.now()}`, title: read('title'), body: `${read('description')}${read('context') ? `\n\nContext: ${read('context')}` : ''}`, communityId: community.id, skills: [skill, ...read('tags').split(',').map(item => item.trim()).filter(Boolean)].slice(0, 5), type: read('type') || 'Question', author: currentContext().user?.shortName || currentContext().user?.name || 'You', authorRole: 'Community member', time: 'Just now', replies: 0, reactions: 0, status: 'Open', mentorResponse: false, companyResponse: false, roadmapRelated: Boolean(currentContext().learning), answers: [] };
      communityState.userDiscussions.unshift(discussion);
      communityState.contributions.questionsAsked += 1;
      communityState.activeSection = 'discussions';
      recordActivity(`You asked a question in ${community.name}.`);
      communityState.modal = { type: 'discussion', id: discussion.id };
      persistCommunityState();
      renderCommunityPage();
    } else if (formType === 'reply') {
      const id = form.dataset.id;
      const discussion = allDiscussions().find(item => item.id === id);
      if (!discussion) return;
      const list = communityState.userReplies[id] || [];
      list.push({ id: `reply-${Date.now()}`, author: currentContext().user?.shortName || 'You', role: 'Community member', text: read('reply'), helpful: 0, accepted: false, label: '' });
      communityState.userReplies[id] = list;
      recordActivity(`You replied to ${discussion.title}.`);
      communityState.modal = { type: 'discussion', id };
      renderCommunityPage();
    } else if (formType === 'challenge-submission') {
      const challenge = communityChallengeCatalog.find(item => item.id === form.dataset.id);
      if (!challenge) return;
      communityState.submissions[challenge.id] = read('submission');
      recordActivity(`Your ${challenge.title} submission is ready for review.`);
      communityState.modal = { type: 'challenge', id: challenge.id };
      renderCommunityPage();
    } else if (formType === 'project') {
      const title = read('title');
      const skill = read('skill') || currentContext().skills[0] || 'Python';
      const link = safeUrl(read('link'));
      const completed = values.get('completed') === 'on';
      const project = { id: `project-${Date.now()}`, title, communityId: communityCatalog.find(item => item.tags.some(tag => normalize(tag) === normalize(skill)))?.id || 'python', skills: [skill], creator: currentContext().user?.shortName || 'You', contributors: 1, status: completed ? 'Completed, peer review self-reported' : read('format') === 'Looking for collaborators' ? 'Looking for collaborators' : 'In progress', lookingFor: read('format') === 'Looking for collaborators' ? ['Community collaborators'] : [], feedback: 0, reactions: 0, completed, peerReviewed: completed, problem: read('problem'), technology: read('technology') || 'Not specified', link, notes: 'Created and stored in this browser prototype.' };
      communityState.userProjects.unshift(project);
      communityState.contributions.projectsShared += 1;
      communityState.showcasedProjects.push(project.id);
      recordActivity(`You shared ${project.title}.`);
      communityState.activeSection = 'projects';
      communityState.modal = { type: 'project', id: project.id };
      renderCommunityPage();
    } else if (formType === 'mentor-request') {
      const mentor = communityMentorCatalog.find(item => item.id === form.dataset.id);
      if (!mentor) return;
      const slotId = read('slotId');
      const selectedSlot = mentor.availableSlots?.find(s => s.id === slotId);
      const topic = selectedSlot ? selectedSlot.focusArea : (read('topic') || 'Technical Mock Interview');
      const message = read('message');

      if (form.dataset.kind === 'session') {
        bookMentoringSlot({
          slotId: slotId || 'slot-custom',
          mentorId: mentor.id,
          menteeName: currentContext().user?.name || 'Individual Candidate',
          focus: topic
        });
        communityState.requests.unshift({
          id: `request-${Date.now()}`,
          mentor: mentor.name,
          type: 'Confirmed Mock Session',
          topic,
          message,
          status: 'Confirmed'
        });
        communityState.contributions.mentorSessions += 1;
        recordActivity(`You booked a technical session with ${mentor.name} on "${topic}".`);
        communityState.modal = null;
        persistCommunityState();
        toast(`✓ Session confirmed with ${mentor.name}! Slot reserved.`);
        renderCommunityPage();
      } else {
        communityState.requests.unshift({
          id: `request-${Date.now()}`,
          mentor: mentor.name,
          type: 'Question draft',
          topic: 'Technical Advice',
          message,
          status: 'Sent to mentor'
        });
        recordActivity(`You sent a question to ${mentor.name}.`);
        communityState.modal = null;
        persistCommunityState();
        toast(`Question sent to ${mentor.name}. You will be notified of responses.`);
      }
    }

  };

  root._communityKeydownHandler = event => {
    if (event.key === 'Escape' && communityState.modal) { closeModal(); return; }
    if (event.key === 'Escape' && communityState.filterOpen) { communityState.filterOpen = false; renderCommunityPage(); return; }
    const tab = event.target.closest('[role="tab"][data-section]');
    if (!tab || !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...root.querySelectorAll('[role="tab"][data-section]')];
    const index = tabs.indexOf(tab);
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex]?.click();
    root.querySelectorAll('[role="tab"][data-section]')[nextIndex]?.focus();
  };

  root.addEventListener('click', root._communityClickHandler);
  root.addEventListener('input', root._communityInputHandler);
  root.addEventListener('change', root._communityChangeHandler);
  root.addEventListener('submit', root._communitySubmitHandler);
  root.addEventListener('keydown', root._communityKeydownHandler);
}

export function renderCommunityPage(options = {}) {
  renderCommunityPageInternal(options);
}

function renderCommunityPageInternal(options) {
  if (options.context) pageContext = options.context;
  if (options.actions) pageActions = options.actions;
  const root = document.querySelector('#mainContent');
  if (!root) return;
  root.innerHTML = renderPageShell();
  window.lucide?.createIcons?.();
  bindCommunityEvents(root);
  if (communityState.modal) root.querySelector('.community-modal')?.focus({ preventScroll: true });
}
