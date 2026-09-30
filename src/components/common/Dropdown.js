export function optionMarkup(options, selected) {
  return options.map(opt => `<option value="${opt}" ${opt === selected ? 'selected' : ''}>${opt}</option>`).join('');
}

export function selectControl(id, label, options, selected) {
  return `
    <div class="console-control-group">
      ${label ? `<label for="${id}">${label}:</label>` : ''}
      <select class="console-select" id="${id}">
        ${optionMarkup(options, selected)}
      </select>
    </div>
  `;
}
