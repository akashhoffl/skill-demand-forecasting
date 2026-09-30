export function renderLoadingState(text = 'Loading intelligence telemetry...') {
  return `
    <div class="loading-state-box" style="padding:40px; text-align:center; color:#7A7085;">
      <div class="safeguard-pulse-dot" style="margin: 0 auto 12px auto;"></div>
      <p style="font-size:13px; font-weight:600; margin:0;">${text}</p>
    </div>
  `;
}
