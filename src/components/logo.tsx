import Image from "next/image";

// The React Cebu mark from react.jscebu.org: a black atom over "CEBU", 646×729.
const RATIO = 646 / 729;

/** The logo on a fog disc like the nav pills, so the black mark reads on dark and light pages alike. */
export function Logo({ size = 48 }: { size?: number }) {
  const height = Math.round(size * 0.64);
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-fog" style={{ width: size, height: size }}>
      <Image src="/images/react-cebu-logo.webp" alt="" width={Math.round(height * RATIO)} height={height} preload />
    </span>
  );
}
