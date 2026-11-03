export function Logo({ size = 44 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-black"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.68} height={size * 0.68} viewBox="-50 -50 100 100" aria-hidden="true">
        <g fill="none" stroke="#ffffff" strokeWidth="6">
          <ellipse rx="42" ry="16" />
          <ellipse rx="42" ry="16" transform="rotate(60)" />
          <ellipse rx="42" ry="16" transform="rotate(120)" />
        </g>
        <circle r="9" fill="#61dafb" />
      </svg>
    </span>
  );
}
