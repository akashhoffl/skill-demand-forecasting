export function renderPortalLayout(childrenHtml) {
  return `
    <div class="portal-layout-wrapper">
      ${childrenHtml}
    </div>
  `;
}
