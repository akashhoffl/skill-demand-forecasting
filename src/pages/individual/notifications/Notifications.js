/**
 * TalentScope.ai - Dedicated Notifications Page
 * Connected real-time intelligence feeds, market alerts, and career updates
 */

const NOTIFICATIONS_STORAGE_KEY = 'talentscope-notifications-list-v1';

const defaultNotifications = [
  {
    id: 'notif-1',
    category: 'skill',
    categoryLabel: 'Skill Intelligence',
    title: 'Generative AI Demand Surge in Enterprise AI',
    desc: 'Hiring demand for Multi-Agent Orchestration, LangChain, and Small Language Model fine-tuning grew +28% this month across target markets.',
    timestamp: '12m ago',
    isUnread: true,
    route: '/individual/skills',
    actionLabel: 'Inspect Skill Demand',
    icon: 'layers-3'
  },
  {
    id: 'notif-2',
    category: 'market',
    categoryLabel: 'Market Intelligence',
    title: 'NVIDIA & Microsoft Enterprise Hiring Expansion',
    desc: '340+ AI Systems and LLM Infrastructure positions opened. High overlap with your PyTorch and CUDA optimization profile.',
    timestamp: '45m ago',
    isUnread: true,
    route: '/individual/market-insights',
    actionLabel: 'View Market Telemetry',
    icon: 'chart-no-axes-combined'
  },
  {
    id: 'notif-3',
    category: 'job',
    categoryLabel: 'Job Market',
    title: '3 New Roles with 92%+ Profile Match',
    desc: 'Principal Applied AI Engineer at CloudScale Systems and Lead ML Architect at NovaAI match your skill stack and remote preference.',
    timestamp: '2h ago',
    isUnread: true,
    route: '/individual/career',
    actionLabel: 'Explore Matching Roles',
    icon: 'briefcase'
  },
  {
    id: 'notif-4',
    category: 'learning',
    categoryLabel: 'Learning Roadmap',
    title: 'Learning Milestone: Vector DBs Completed',
    desc: 'You completed the Vector Search & Embedding Quantization module. Next up: Distributed Fine-Tuning with LoRA & DeepSpeed.',
    timestamp: 'Yesterday',
    isUnread: false,
    route: '/individual/learning',
    actionLabel: 'Resume Roadmap',
    icon: 'book-open'
  },
  {
    id: 'notif-5',
    category: 'community',
    categoryLabel: 'Community',
    title: 'New Reply in "Production Multi-Agent RAG"',
    desc: 'Sarah Chen replied to your thread: "How are you handling context window compression in high-throughput pipelines?"',
    timestamp: 'Yesterday',
    isUnread: false,
    route: '/individual/community',
    actionLabel: 'View Discussion Thread',
    icon: 'users-round'
  },
  {
    id: 'notif-6',
    category: 'skill',
    categoryLabel: 'Skill Intelligence',
    title: 'New Benchmark Available: PyTorch 2.4 & Triton',
    desc: 'The benchmark assessment for PyTorch compilation and custom kernel authoring is live. Take it to verify Top 5% ranking.',
    timestamp: '2d ago',
    isUnread: false,
    route: '/individual/skills',
    actionLabel: 'Take Benchmark Assessment',
    icon: 'layers-3'
  },
  {
    id: 'notif-7',
    category: 'market',
    categoryLabel: 'Market Intelligence',
    title: 'Quarterly Compensation Trend Shift',
    desc: 'Median base salary for Senior & Principal AI Engineers in Bengaluru rose by 14% to ₹52L. View comparative insights.',
    timestamp: '3d ago',
    isUnread: false,
    route: '/individual/market-insights',
    actionLabel: 'Inspect Compensation Data',
    icon: 'chart-no-axes-combined'
  },
  {
    id: 'notif-8',
    category: 'job',
    categoryLabel: 'Job Market',
    title: 'Recruiter Viewed Your Verified Profile',
    desc: 'Talent Acquisition at Databricks viewed your verified profile signals and Generative AI assessment score.',
    timestamp: '4d ago',
    isUnread: false,
    route: '/individual/career',
    actionLabel: 'Check Recruiter Signals',
    icon: 'briefcase'
  }
];

function getNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [...defaultNotifications];
    return JSON.parse(raw);
  } catch (e) {
    return [...defaultNotifications];
  }
}

function saveNotifications(items) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

let notificationItems = getNotifications();
let activeFilter = 'all';
let rootContainer = null;
let currentActions = {};

export function renderNotificationsPage({ context = {}, actions = {} } = {}) {
  currentActions = actions;
  rootContainer = document.getElementById('mainContent');
  if (!rootContainer) return;

  drawNotifications();
}

function drawNotifications() {
  if (!rootContainer) return;

  const unreadCount = notificationItems.filter(n => n.isUnread).length;
  const filtered = filterList(notificationItems, activeFilter);

  rootContainer.innerHTML = `
    <div class="ts-notifications-page">
      <!-- Header -->
      <section class="notifications-header-card" aria-label="Notifications Header">
        <div class="notifications-title-area">
          <div class="notifications-title-row">
            <h1 class="notifications-title">Notifications</h1>
            ${unreadCount > 0 ? `<span class="notifications-badge-count"><i data-lucide="bell"></i> ${unreadCount} Unread</span>` : `<span class="notifications-badge-count" style="color: #10B981; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2);"><i data-lucide="check-check"></i> All Caught Up</span>`}
          </div>
          <p class="notifications-subtitle">Real-time alerts, market shifts, skill updates, and learning milestones</p>
        </div>

        <div class="notifications-header-actions">
          <a href="#/individual/settings" class="btn-notif-action">
            <i data-lucide="settings-2"></i> Settings
          </a>
          <button type="button" class="btn-notif-action btn-primary" id="btnMarkAllRead">
            <i data-lucide="check-check"></i> Mark All as Read
          </button>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <nav class="notifications-filter-bar" aria-label="Filter notifications">
        <button class="notif-filter-pill ${activeFilter === 'all' ? 'is-active' : ''}" data-filter="all">
          <span>All</span>
          <span class="pill-count">${notificationItems.length}</span>
        </button>
        <button class="notif-filter-pill ${activeFilter === 'unread' ? 'is-active' : ''}" data-filter="unread">
          <span>Unread</span>
          <span class="pill-count">${unreadCount}</span>
        </button>
        <button class="notif-filter-pill ${activeFilter === 'skill' ? 'is-active' : ''}" data-filter="skill">
          <span>Skill Intelligence</span>
          <span class="pill-count">${notificationItems.filter(n => n.category === 'skill').length}</span>
        </button>
        <button class="notif-filter-pill ${activeFilter === 'market' ? 'is-active' : ''}" data-filter="market">
          <span>Market Intelligence</span>
          <span class="pill-count">${notificationItems.filter(n => n.category === 'market').length}</span>
        </button>
        <button class="notif-filter-pill ${activeFilter === 'job' ? 'is-active' : ''}" data-filter="job">
          <span>Job Market</span>
          <span class="pill-count">${notificationItems.filter(n => n.category === 'job').length}</span>
        </button>
        <button class="notif-filter-pill ${activeFilter === 'learning' ? 'is-active' : ''}" data-filter="learning">
          <span>Learning</span>
          <span class="pill-count">${notificationItems.filter(n => n.category === 'learning').length}</span>
        </button>
        <button class="notif-filter-pill ${activeFilter === 'community' ? 'is-active' : ''}" data-filter="community">
          <span>Community</span>
          <span class="pill-count">${notificationItems.filter(n => n.category === 'community').length}</span>
        </button>
      </nav>

      <!-- Notification Feed -->
      <div class="notifications-feed-list">
        ${filtered.length === 0 ? renderEmptyState() : filtered.map(renderNotificationCard).join('')}
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  attachListeners();
}

function filterList(items, filter) {
  if (filter === 'unread') return items.filter(i => i.isUnread);
  if (filter === 'all') return items;
  return items.filter(i => i.category === filter);
}

function renderNotificationCard(item) {
  return `
    <article class="notif-item-card ${item.isUnread ? 'is-unread' : ''}" id="${item.id}">
      ${item.isUnread ? `<span class="notif-unread-indicator" title="Unread"></span>` : ''}
      
      <div class="notif-icon-box ${item.category}">
        <i data-lucide="${item.icon}"></i>
      </div>

      <div class="notif-content-block">
        <div class="notif-meta-row">
          <span class="notif-category-tag">${item.categoryLabel}</span>
          <span class="notif-timestamp">${item.timestamp}</span>
        </div>

        <h3 class="notif-title">${item.title}</h3>
        <p class="notif-desc">${item.desc}</p>

        <div class="notif-cta-row">
          <a href="#${item.route}" class="btn-notif-link">
            <span>${item.actionLabel}</span>
            <i data-lucide="arrow-up-right" style="width: 14px; height: 14px;"></i>
          </a>

          <div class="notif-quick-tools">
            <button type="button" class="btn-notif-tool btn-toggle-read" data-id="${item.id}" title="${item.isUnread ? 'Mark as read' : 'Mark as unread'}">
              <i data-lucide="${item.isUnread ? 'check' : 'mail'}"></i>
            </button>
            <button type="button" class="btn-notif-tool btn-delete-notif" data-id="${item.id}" title="Remove notification">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderEmptyState() {
  return `
    <div class="notif-empty-state">
      <div class="notif-empty-icon">
        <i data-lucide="inbox"></i>
      </div>
      <h3 class="notif-empty-title">All Caught Up!</h3>
      <p class="notif-empty-desc">There are no notifications matching your current filter. You're completely up to date with market signals and learning updates.</p>
      <button type="button" class="btn-notif-action" id="btnResetFilter" style="margin-top: 6px;">
        <i data-lucide="list"></i> Show All Notifications
      </button>
    </div>
  `;
}

function attachListeners() {
  // Filter pills
  document.querySelectorAll('.notif-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');
      if (f) {
        activeFilter = f;
        drawNotifications();
      }
    });
  });

  // Reset filter button in empty state
  document.getElementById('btnResetFilter')?.addEventListener('click', () => {
    activeFilter = 'all';
    drawNotifications();
  });

  // Mark all read
  document.getElementById('btnMarkAllRead')?.addEventListener('click', () => {
    notificationItems = notificationItems.map(item => ({ ...item, isUnread: false }));
    saveNotifications(notificationItems);
    drawNotifications();
    showToast('All notifications marked as read');
  });

  // Toggle single item read
  document.querySelectorAll('.btn-toggle-read').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const item = notificationItems.find(n => n.id === id);
      if (item) {
        item.isUnread = !item.isUnread;
        saveNotifications(notificationItems);
        drawNotifications();
      }
    });
  });

  // Delete single notification
  document.querySelectorAll('.btn-delete-notif').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      notificationItems = notificationItems.filter(n => n.id !== id);
      saveNotifications(notificationItems);
      drawNotifications();
      showToast('Notification removed');
    });
  });
}

function showToast(message) {
  const existing = document.querySelector('.ts-toast-banner');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ts-toast-banner';
  toast.innerHTML = `<i data-lucide="check-circle" style="color: #10B981; width: 18px; height: 18px;"></i> <span>${message}</span>`;
  document.body.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
