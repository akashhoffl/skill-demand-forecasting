export const user = {
  name: 'Akash Vance',
  role: 'AI & Full Stack Engineer',
  initials: 'AV',
  avatarBg: '#B22DEF',
  email: 'akash@example.com',
  location: 'Bangalore, India',
  targetRole: 'Senior AI System Architect'
};

export function updateUserDetails() {
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name);
  document.querySelectorAll('[data-user-short-name]').forEach(el => el.textContent = user.name.split(' ')[0]);
  document.querySelectorAll('[data-user-meta]').forEach(el => el.textContent = `${user.role} · ${user.location}`);
  document.querySelectorAll('[data-user-initials]').forEach(el => el.textContent = user.initials);
}
