export function Icon({ name, size = 20, stroke = 'currentColor' }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'play':
      return <svg {...p}><polygon points="6 4 20 12 6 20 6 4" fill={stroke} /></svg>;
    case 'pause':
      return (
        <svg {...p}>
          <rect x="6" y="4" width="4" height="16" fill={stroke} stroke="none" rx="1" />
          <rect x="14" y="4" width="4" height="16" fill={stroke} stroke="none" rx="1" />
        </svg>
      );
    case 'skip':
      return (
        <svg {...p}>
          <polygon points="5 4 13 12 5 20 5 4" fill={stroke} />
          <polygon points="13 4 21 12 13 20 13 4" fill={stroke} />
        </svg>
      );
    case 'undo':
      return (
        <svg {...p}>
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10a6 6 0 0 1 0 12H9" />
        </svg>
      );
    case 'volume':
      return (
        <svg {...p}>
          <polygon points="3 9 7 9 12 5 12 19 7 15 3 15 3 9" fill={stroke} />
          <path d="M16 8a5 5 0 0 1 0 8" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </svg>
      );
    case 'volume-off':
      return (
        <svg {...p}>
          <polygon points="3 9 7 9 12 5 12 19 7 15 3 15 3 9" fill={stroke} />
          <line x1="17" y1="9" x2="23" y2="15" />
          <line x1="23" y1="9" x2="17" y2="15" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...p}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <polyline points="3 3 3 8 8 8" />
        </svg>
      );
    case 'hand':
      return (
        <svg {...p}>
          <path d="M7 11V5a2 2 0 0 1 4 0v6" />
          <path d="M11 11V3a2 2 0 0 1 4 0v8" />
          <path d="M15 11V5a2 2 0 0 1 4 0v9a7 7 0 0 1-14 0v-1a2 2 0 0 1 4 0" />
        </svg>
      );
    default:
      return null;
  }
}
