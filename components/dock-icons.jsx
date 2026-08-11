function Glyph({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/*
 * Every dock on the site draws from this one map. Callers reference icons by key rather
 * than passing elements around, which keeps page configs plain data.
 */
export const DOCK_ICONS = {
  home: (
    <Glyph>
      <path d="M3.6 10.4 12 3.8l8.4 6.6" />
      <path d="M5.8 9.6V19a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1V9.6" />
      <path d="M9.8 20v-5.2h4.4V20" />
    </Glyph>
  ),
  about: (
    <Glyph>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </Glyph>
  ),
  profile: (
    <Glyph>
      <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.4" />
      <circle cx="8.6" cy="10.4" r="2.1" />
      <path d="M5.4 16.4a3.4 3.4 0 0 1 6.4 0" />
      <path d="M14.8 9.8h4M14.8 13.6h4" />
    </Glyph>
  ),
  experience: (
    <Glyph>
      <rect x="2.8" y="7.2" width="18.4" height="12.6" rx="2.2" />
      <path d="M8.8 7.2V5.8A1.8 1.8 0 0 1 10.6 4h2.8a1.8 1.8 0 0 1 1.8 1.8v1.4" />
      <path d="M2.8 12.4h18.4" />
    </Glyph>
  ),
  education: (
    <Glyph>
      <path d="M12 4.2 2.6 9 12 13.8 21.4 9 12 4.2Z" />
      <path d="M6.6 11.2v4.4c0 1.5 2.4 2.7 5.4 2.7s5.4-1.2 5.4-2.7v-4.4" />
      <path d="M21.4 9v5" />
    </Glyph>
  ),
  competitions: (
    <Glyph>
      <path d="M7.4 4h9.2v4.6a4.6 4.6 0 0 1-9.2 0V4Z" />
      <path d="M7.4 5.8H5.4a2.3 2.3 0 0 0 2.4 2.5" />
      <path d="M16.6 5.8h2a2.3 2.3 0 0 1-2.4 2.5" />
      <path d="M12 13.2v3.6" />
      <path d="M8.8 19.8h6.4" />
    </Glyph>
  ),
  volunteer: (
    <Glyph>
      <path d="M20.8 5.4a5.2 5.2 0 0 0-7.4 0L12 6.8l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4l1.4 1.4L12 21.2l7.4-7L20.8 12.8a5.2 5.2 0 0 0 0-7.4Z" />
    </Glyph>
  ),
  skills: (
    <Glyph>
      <path d="M8.4 8.2 4 12l4.4 3.8" />
      <path d="M15.6 8.2 20 12l-4.4 3.8" />
      <path d="M13.4 5.4 10.6 18.6" />
    </Glyph>
  ),
  achievements: (
    <Glyph>
      <path d="m12 3.8 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.8Z" />
    </Glyph>
  ),
  projects: (
    <Glyph>
      <rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.8" />
      <rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.8" />
      <rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.8" />
      <rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.8" />
    </Glyph>
  ),
  contact: (
    <Glyph>
      <rect x="2.8" y="5.4" width="18.4" height="13.2" rx="2.2" />
      <path d="m3.6 7.6 8.4 5.8 8.4-5.8" />
    </Glyph>
  ),
  ai: (
    <Glyph>
      <path d="M12 3.4l1.7 4.3 4.3 1.7-4.3 1.7L12 15.4l-1.7-4.3L6 9.4l4.3-1.7L12 3.4Z" />
      <path d="M18.4 15.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
    </Glyph>
  ),
  vr: (
    <Glyph>
      <path d="M3.4 9.2A2.2 2.2 0 0 1 5.6 7h12.8a2.2 2.2 0 0 1 2.2 2.2v4.4a2.2 2.2 0 0 1-2.2 2.2h-2.7a2 2 0 0 1-1.5-.7L12 13.6l-2.2 1.5a2 2 0 0 1-1.5.7H5.6a2.2 2.2 0 0 1-2.2-2.2V9.2Z" />
      <path d="M8 19.2h8" />
    </Glyph>
  ),
  media: (
    <Glyph>
      <rect x="2.6" y="7" width="18.8" height="10.6" rx="4" />
      <path d="M7.4 10.8v3M5.9 12.3h3" />
      <circle cx="15.8" cy="11.4" r="0.9" />
      <circle cx="18" cy="13.4" r="0.9" />
    </Glyph>
  ),
  certificate: (
    <Glyph>
      <circle cx="12" cy="9.4" r="5.2" />
      <path d="M9.2 14.2 8 21l4-2.2 4 2.2-1.2-6.8" />
    </Glyph>
  ),
  list: (
    <Glyph>
      <path d="M5 7.2h14M5 12h14M5 16.8h9" />
    </Glyph>
  ),
  mail: (
    <Glyph>
      <rect x="2.8" y="5.4" width="18.4" height="13.2" rx="2.2" />
      <path d="m3.6 7.6 8.4 5.8 8.4-5.8" />
    </Glyph>
  ),
  form: (
    <Glyph>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="2.4" />
      <path d="M7.6 8.6h8.8M7.6 12.4h8.8M7.6 16.2h5" />
    </Glyph>
  ),
};
