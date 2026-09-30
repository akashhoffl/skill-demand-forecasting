export function renderIndividualRoute({ route, page, renderHome, renderSkills, renderSaved, renderPlaceholder }) {
  if (route === '/individual/home') return renderHome();
  if (route === '/individual/skills') return renderSkills();
  if (route === '/individual/saved') return renderSaved();
  return renderPlaceholder(page);
}
