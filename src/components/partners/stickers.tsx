"use client";

// The stickers on the sponsor sheet. The thick white stroke behind each shape is the die-cut border.
const dieCut = { stroke: "#fff", strokeWidth: 12, strokeLinejoin: "round", paintOrder: "stroke" } as const;
const drawn = "size-full overflow-visible";

export function AtomSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={drawn}>
      <circle cx="60" cy="60" r="52" fill="var(--color-react)" {...dieCut} />
      <g fill="none" stroke="var(--color-ink)" strokeWidth="3.6" transform="translate(60 60)">
        <ellipse rx="38" ry="14.5" />
        <ellipse rx="38" ry="14.5" transform="rotate(60)" />
        <ellipse rx="38" ry="14.5" transform="rotate(120)" />
      </g>
      <circle cx="60" cy="60" r="6" fill="var(--color-ink)" />
    </svg>
  );
}

export function ShirtSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={drawn}>
      <path d="M44 14C50 24 70 24 76 14L104 28L116 56L96 64L92 54V106H28V54L24 64L4 56L16 28Z" fill="var(--color-ink)" {...dieCut} />
      <g fill="none" stroke="var(--color-react)" strokeWidth="2" transform="translate(60 54)">
        <ellipse rx="13" ry="5" />
        <ellipse rx="13" ry="5" transform="rotate(60)" />
        <ellipse rx="13" ry="5" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function CreditSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={drawn}>
      <rect x="8" y="24" width="104" height="72" rx="14" fill="var(--color-azure)" {...dieCut} />
      <path d="M46 46L32 60L46 74M74 46L88 60L74 74M65 42L55 78" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FreeSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={drawn}>
      <circle cx="60" cy="60" r="50" fill="var(--color-ink)" {...dieCut} />
      <text x="60" y="76" textAnchor="middle" fill="var(--color-react)" fontSize="44" letterSpacing="-2">₱0</text>
    </svg>
  );
}

export function BracesSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={drawn}>
      <rect x="14" y="14" width="92" height="92" rx="24" fill="var(--color-react)" transform="rotate(6 60 60)" {...dieCut} />
      <path d="M50 36C40 36 44 54 34 60C44 66 40 84 50 84M70 36C80 36 76 54 86 60C76 66 80 84 70 84" fill="none" stroke="var(--color-ink)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function HeartSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={drawn}>
      <path d="M60 104C24 78 10 60 10 40C10 24 22 14 36 14C46 14 55 19 60 28C65 19 74 14 84 14C98 14 110 24 110 40C110 60 96 78 60 104Z" fill="var(--color-azure)" {...dieCut} />
    </svg>
  );
}
