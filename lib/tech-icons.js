/**
 * Icon resolution for the interactive clouds.
 *
 * Two kinds of icon are supported:
 * - `{ slug }` resolves to a Simple Icons brand logo
 * - `{ glyph }` picks one of the inline drawings below, for concepts that have no logo
 *
 * Both come back as image URLs because the cloud rasterises them onto a canvas.
 */

const GLYPH_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

const glyphs = {
  frontend: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01"/>',
  backend:
    '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M6.8 7.5h.01M6.8 16.5h.01"/>',
  algorithms:
    '<circle cx="12" cy="4.6" r="2.4"/><circle cx="6" cy="19.4" r="2.4"/><circle cx="18" cy="19.4" r="2.4"/><path d="M12 7v3.6M6 17V12h12v5"/>',
  dataStructures: '<path d="M12 3 3 7.4l9 4.4 9-4.4L12 3Z"/><path d="M3 12.3 12 16.7l9-4.4"/><path d="M3 16.9 12 21.3l9-4.4"/>',
  mathematics: '<path d="M17.5 5.5h-11L12 12l-5.5 6.5h11"/>',
  prompt: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7.4 9.6 10.4 12l-3 2.4M12.6 14.8h4"/>',
  aiModels:
    '<path d="M11 3.2 12.6 8.4 17.8 10 12.6 11.6 11 16.8 9.4 11.6 4.2 10 9.4 8.4 11 3.2Z"/><path d="M18 15.2l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
  dataAnalysis: '<path d="M4 3.8v16.4h16"/><path d="M8 20.2v-5.6M12.6 20.2V9M17.2 20.2v-3.4"/>',
  vr: '<rect x="2.5" y="8.4" width="19" height="8.4" rx="3"/><circle cx="8" cy="12.6" r="1.9"/><circle cx="16" cy="12.6" r="1.9"/>',
  environment: '<path d="M12 2.6 21 7v10l-9 4.4L3 17V7l9-4.4Z"/><path d="M3 7l9 4.4L21 7"/><path d="M12 11.4v10"/>',
  spatialCapture:
    '<path d="M4 8.6V6a2 2 0 0 1 2-2h2.6M15.4 4H18a2 2 0 0 1 2 2v2.6M20 15.4V18a2 2 0 0 1-2 2h-2.6M8.6 20H6a2 2 0 0 1-2-2v-2.6"/><circle cx="12" cy="12" r="3.1"/>',
};

export function techIconUrl(item, tint) {
  if (item.icon.slug) return `https://cdn.simpleicons.org/${item.icon.slug}/${tint}`;
  const svg = `<svg ${GLYPH_ATTRS} stroke="#${tint}">${glyphs[item.icon.glyph]}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
