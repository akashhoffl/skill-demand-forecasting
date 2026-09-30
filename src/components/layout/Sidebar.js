export const navigation = [
  {
    group: 'INDIVIDUAL PORTAL',
    items: [
      { label: 'Home', route: '/individual/home', icon: 'layout-dashboard' },
      { label: 'My Skills', route: '/individual/skills', icon: 'cpu' },
      { label: 'Learning', route: '/individual/learning', icon: 'book-open' },
      { label: 'Career', route: '/individual/career', icon: 'briefcase' },
      { label: 'Community', route: '/individual/community', icon: 'users' }
    ]
  }
];

export function renderNavigation(currentRoutePath) {
  const primaryNav = document.getElementById('primaryNav');
  if (!primaryNav) return;

  primaryNav.innerHTML = navigation.map(group => `
    <div class="nav-group">
      <span class="nav-group__heading">${group.group}</span>
      ${group.items.map(item => {
        const isActive = currentRoutePath === item.route;
        return `
          <a class="nav-item ${isActive ? 'is-active' : ''}" href="#${item.route}" data-route="${item.route}" data-tooltip="${item.label}">
            <i data-lucide="${item.icon}"></i>
            <span class="nav-item__label">${item.label}</span>
          </a>
        `;
      }).join('')}
    </div>
  `).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function setSidebarExpanded(expanded) {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (!sidebar || !sidebarToggle) return;

  if (expanded) {
    sidebar.classList.add('is-expanded');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    sidebarToggle.setAttribute('aria-label', 'Collapse sidebar');
    sidebarToggle.setAttribute('title', 'Collapse sidebar');
  } else {
    sidebar.classList.remove('is-expanded');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    sidebarToggle.setAttribute('aria-label', 'Expand sidebar');
    sidebarToggle.setAttribute('title', 'Expand sidebar');
  }
}

export function openMobileNav() {
  const sidebar = document.getElementById('sidebar');
  const mobileScrim = document.getElementById('mobileScrim');
  if (!sidebar || !mobileScrim) return;
  sidebar.classList.add('is-mobile-open');
  mobileScrim.classList.add('is-visible');
  mobileScrim.setAttribute('aria-hidden', 'false');
}

export function closeMobileNav() {
  const sidebar = document.getElementById('sidebar');
  const mobileScrim = document.getElementById('mobileScrim');
  if (!sidebar || !mobileScrim) return;
  sidebar.classList.remove('is-mobile-open');
  mobileScrim.classList.remove('is-visible');
  mobileScrim.setAttribute('aria-hidden', 'true');
}
