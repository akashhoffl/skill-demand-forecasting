export function renderPageContainer(contentHtml, className = '') {
  return `
    <div class="page-container ${className}">
      ${contentHtml}
    </div>
  `;
}
