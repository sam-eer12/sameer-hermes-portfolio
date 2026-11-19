import React from "react";

/**
 * Geometric outline monolith emblem for the footer brand column,
 * styled cleanly in the Hermes Agent engineering aesthetic.
 */
export function NousOutlineFooterLogo({ className = "h-[86px] w-[60px]" }: { className?: string }) {
  return (
    <svg
      data-nous-badge="outline"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={className}
      width={60}
      height={86}
    >
      <rect x="1.5" y="1.5" width="57" height="81" rx="5" strokeWidth="2" />
      <circle cx="30" cy="36" r="16" />
      <ellipse cx="30" cy="36" rx="23" ry="6.5" transform="rotate(-12 30 36)" />
      <line x1="7" y1="36" x2="53" y2="36" strokeDasharray="2 2" />
      <path d="M18 68L30 56L42 68" />
      <line x1="14" y1="73" x2="46" y2="73" />
    </svg>
  );
}

/**
 * Geometric twin emblem displayed in the Paper Footer center badge bar.
 */
export function NousResearchCenterBadges() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-[44px] w-[44px]" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="36" height="36" />
        <ellipse cx="20" cy="20" rx="14" ry="5" transform="rotate(-15 20 20)" />
        <circle cx="20" cy="20" r="7" />
        <circle cx="27" cy="18" r="1.8" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 40 40" className="h-[44px] w-[44px]" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="20,4 36,20 20,36 4,20" />
        <rect x="14" y="14" width="12" height="12" />
        <line x1="4" y1="20" x2="36" y2="20" />
      </svg>
    </div>
  );
}

export function GitHubPixelIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M9 2h6v2H9V2zm-4 2h4v2H5V4zm10 0h4v2h-4V4zM3 6h2v8H3V6zm16 0h2v8h-2V6zM5 14h2v2H5v-2zm12 0h2v2h-2v-2zm-10 2h2v2H7v-2zm8 0h2v2h-2v-2zm-6 2h6v4H9v-4zm-4 0h2v2H5v-2z" />
    </svg>
  );
}

export function HuggingFacePixelIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7 3h10v2H7V3zM5 5h2v2H5V5zm12 0h2v2h-2V5zM3 7h2v10H3V7zm16 0h2v10h-2V7zm-11 3h2v2H8v-2zm6 0h2v2h-2v-2zm-5 4h6v2H9v-2zm-4 3h2v2H5v-2zm12 0h2v2h-2v-2zm-10 2h10v2H7v-2z" />
    </svg>
  );
}

export function LinkedInPixelIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h2v2H7V7zm0 4h2v6H7v-6zm4 0h6v6h-2v-4h-2v4h-2v-6z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "size-4 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6-6 6z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "size-4 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10 18l-6-6 6-6 1.4 1.45L7.85 11H20v2H7.85l3.55 3.55L10 18z" />
    </svg>
  );
}
