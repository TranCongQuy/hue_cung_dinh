export function RoyalDivider({ variant = "lotus" }: { variant?: "lotus" | "fret" }) {
  if (variant === "fret") {
    return (
      <div className="royal-svg-divider" aria-hidden="true">
        <svg width="340" height="24" viewBox="0 0 340 24" fill="none">
          <line x1="0" y1="12" x2="112" y2="12" stroke="var(--secondary)" strokeOpacity="0.45" />
          <path
            d="M122 6h16v12h-10v-6h4M148 18V6h16v12h-10v-6h4M176 6h16v12h-16V6zm4 4v4h8v-4h-8zM202 6h16v12h-10v-6h4"
            stroke="var(--secondary)"
            strokeWidth="1.4"
          />
          <line x1="228" y1="12" x2="340" y2="12" stroke="var(--secondary)" strokeOpacity="0.45" />
        </svg>
      </div>
    );
  }

  return (
    <div className="royal-svg-divider" aria-hidden="true">
      <svg width="320" height="28" viewBox="0 0 320 28" fill="none">
        <line x1="8" y1="14" x2="124" y2="14" stroke="var(--secondary)" strokeOpacity="0.45" />
        <circle cx="132" cy="14" r="2.5" fill="var(--secondary)" />
        <path
          d="M160 3C164 9 170 11 175 14C170 17 164 19 160 25C156 19 150 17 145 14C150 11 156 9 160 3Z"
          stroke="var(--secondary)"
          strokeWidth="1.5"
          fill="rgba(212, 175, 55, 0.14)"
        />
        <circle cx="160" cy="14" r="3" fill="var(--primary)" />
        <circle cx="188" cy="14" r="2.5" fill="var(--secondary)" />
        <line x1="196" y1="14" x2="312" y2="14" stroke="var(--secondary)" strokeOpacity="0.45" />
      </svg>
    </div>
  );
}
