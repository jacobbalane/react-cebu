/** Stands in for a person's photo until the real one is confirmed. It fills its frame, and the frame sets the background. */
export function PersonPlaceholder({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className}>
      <circle cx="50" cy="38" r="18" fill="#c8c8c8" />
      <ellipse cx="50" cy="96" rx="36" ry="34" fill="#c8c8c8" />
    </svg>
  );
}
