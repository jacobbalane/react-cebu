import Image from "next/image";

// The React Cebu mark from react.jscebu.org: a black atom over "CEBU", 646×729.
const RATIO = 646 / 729;

/** The logo on a fog disc like the nav pills, so the black mark reads on dark and light pages alike. */
export function Logo({ size = 48 }: { size?: number }) {
  const height = Math.round(size * 0.64);
  const width = Math.round(height * RATIO);
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-fog" style={{ width: size, height: size }}>
      {/* Sized in CSS too: otherwise the global img height:auto re-derives the height from the
          rounded width, a pixel off the one given, and Next warns about it. */}
      <Image src="/images/react-cebu-logo.webp" alt="" width={width} height={height} style={{ width, height }} preload />
    </span>
  );
}
