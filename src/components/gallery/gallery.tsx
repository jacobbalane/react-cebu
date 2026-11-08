"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Reveal, SplitHeading } from "@/components/motion";
import { useLenis } from "@/components/smooth-scroll";
import { albums, type Album, type GalleryPhoto } from "@/data/gallery";
import { FACEBOOK_PHOTOS_URL } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

type Shot = GalleryPhoto & { album: Album };

const everything: Shot[] = albums.flatMap((album) => album.photos.map((photo) => ({ ...photo, album })));
const easing = "ease-[cubic-bezier(.2,.8,.2,1)]";
const fade = () => (window.matchMedia(MOTION_OK).matches ? 0.3 : 0);

const widths = [
  { query: "(min-width: 88rem)", columns: 5 },
  { query: "(min-width: 64rem)", columns: 4 },
  { query: "(min-width: 48rem)", columns: 3 },
];
const columnCount = () => widths.find(({ query }) => window.matchMedia(query).matches)?.columns ?? 2;
const watchWidth = (tell: () => void) => {
  window.addEventListener("resize", tell);
  return () => window.removeEventListener("resize", tell);
};

/** Deals the photos into columns, each to the shortest so far. Heights are in column widths. */
function layOut(count: number) {
  const columns = Array.from({ length: count }, () => ({ height: 0, shots: [] as Shot[] }));
  for (const shot of everything) {
    const column = columns.reduce((shortest, next) => (next.height < shortest.height ? next : shortest));
    column.shots.push(shot);
    column.height += shot.height / shot.width;
  }
  return columns;
}

type Point = { x: number; y: number };

/** A closed outline through the points, with every corner rounded, inward or outward. */
function roundedPath(points: Point[], radius: number) {
  return (
    points
      .map((point, i) => {
        const before = points[(i - 1 + points.length) % points.length];
        const after = points[(i + 1) % points.length];
        const toBefore = Math.hypot(before.x - point.x, before.y - point.y);
        const toAfter = Math.hypot(after.x - point.x, after.y - point.y);
        const r = Math.min(radius, toBefore / 2, toAfter / 2);
        const start = { x: point.x + ((before.x - point.x) / toBefore) * r, y: point.y + ((before.y - point.y) / toBefore) * r };
        const end = { x: point.x + ((after.x - point.x) / toAfter) * r, y: point.y + ((after.y - point.y) / toAfter) * r };
        return `${i ? "L" : "M"}${start.x} ${start.y}Q${point.x} ${point.y} ${end.x} ${end.y}`;
      })
      .join("") + "Z"
  );
}

/**
 * Traces the cyan shape: along the bottom of each column's last photo, one gap below it, stepping
 * between columns on the side that keeps clear of the taller photo, then down to the wall's bottom.
 */
function traceBand(wall: HTMLElement, row: HTMLElement) {
  const gap = parseFloat(getComputedStyle(row).columnGap);
  const radius = parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.875;
  const columns = [...row.children] as HTMLElement[];
  const lasts = columns.map((column) => column.lastElementChild as HTMLElement);
  lasts.forEach((last) => {
    last.style.height = "";
  });
  const edges = columns.map((column, i) => ({ left: column.offsetLeft, right: column.offsetLeft + column.offsetWidth, top: lasts[i].offsetTop + lasts[i].offsetHeight + gap }));
  // A small step reads as a mistake, so columns that nearly line up are made to line up exactly.
  edges.forEach((edge, i) => {
    const before = edges[i - 1];
    if (!before || Math.abs(edge.top - before.top) >= radius * 4) return;
    const level = Math.max(edge.top, before.top);
    for (let back = i; back >= 0 && edges[back].top >= before.top - radius * 4 && edges[back].top <= level; back--) edges[back].top = level;
  });
  // The last photo in each column stretches to its line, so the gap above the shape stays even.
  lasts.forEach((last, i) => {
    last.style.height = `${edges[i].top - gap - last.offsetTop}px`;
  });

  const points: Point[] = [{ x: edges[0].left, y: edges[0].top }];
  edges.forEach((edge, i) => {
    const next = edges[i + 1];
    if (!next || next.top === edge.top) return;
    const x = next.top > edge.top ? edge.right : next.left;
    points.push({ x, y: edge.top }, { x, y: next.top });
  });
  const end = edges[edges.length - 1];
  points.push({ x: end.right, y: end.top }, { x: end.right, y: wall.offsetHeight }, { x: edges[0].left, y: wall.offsetHeight });
  return roundedPath(points, radius);
}

function Tile({ shot, onOpen }: { shot: Shot; onOpen: (shot: Shot) => void }) {
  return (
    <button
      type="button"
      data-reveal
      onClick={() => onOpen(shot)}
      aria-label={`View photo: ${shot.alt}`}
      className="tile group block w-full cursor-zoom-in bg-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes="(min-width: 1408px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        className={`block size-full object-cover transition-[filter,scale] duration-700 ${easing} group-hover:scale-105 group-hover:grayscale-0 [@media(hover:hover)]:grayscale`}
      />
      <span className={`absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-black/80 to-transparent p-4 pt-12 text-left text-white opacity-0 transition-opacity duration-500 ${easing} group-hover:opacity-100 group-focus-visible:opacity-100`}>
        <span className="text-lg leading-tight">{shot.album.title}</span>
        {shot.album.when && <span className="text-base">{shot.album.when}</span>}
      </span>
    </button>
  );
}

/** The cyan shape that closes the wall, stepping around the photos above it, with the way to the rest of them. */
function MoreBand({ path }: { path: string }) {
  return (
    <>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {path && <path d={path} className="fill-react" />}
      </svg>
      <div id="more-photos" className="absolute bottom-0 left-0 flex max-w-[31rem] flex-col items-start gap-5 p-6 text-ink sm:p-10">
        <div className="flex flex-col gap-2">
          <h3 className="title m-0 text-[clamp(1.75rem,3vw,2.5rem)]">There’s plenty more on Facebook</h3>
          <p className="m-0 text-lg leading-normal">Hundreds of photos from our events, all on the React Cebu page.</p>
        </div>
        <a href={FACEBOOK_PHOTOS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-black">
          See more photos on Facebook
        </a>
      </div>
    </>
  );
}

/** A photo at full size, with the event it's from. Arrow keys move through the photos and Escape closes it. */
function Lightbox({ shot, onMove, onClose }: { shot: Shot | null; onMove: (step: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const picture = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const open = shot !== null;

  useEffect(() => {
    const box = dialog.current;
    if (!open || !box || box.open) return;
    box.showModal();
    lenis.current?.stop();
    gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: fade() });
  }, [open, lenis]);

  useEffect(() => {
    if (shot) gsap.fromTo(picture.current, { opacity: 0 }, { opacity: 1, duration: fade() });
  }, [shot]);

  const close = () => {
    gsap.to(dialog.current, {
      opacity: 0,
      duration: fade(),
      onComplete: () => {
        dialog.current?.close();
        lenis.current?.start();
        onClose();
      },
    });
  };

  const keys = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") onMove(-1);
    if (event.key === "ArrowRight") onMove(1);
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Photo viewer"
      onKeyDown={keys}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => event.target === event.currentTarget && close()}
      className="m-0 size-full max-h-none max-w-none bg-black/90 p-0 text-white backdrop:bg-transparent"
    >
      {shot && (
        <div className="pointer-events-none flex size-full flex-col gap-4 p-4 sm:p-6">
          <div className="pointer-events-auto flex items-start justify-between gap-4 self-stretch">
            <p className="m-0 text-lg leading-tight">
              {shot.album.title}
              {shot.album.when && <span className="block text-base text-white/70">{shot.album.when}</span>}
            </p>
            <button type="button" onClick={close} className="btn btn-white shrink-0 cursor-pointer">
              Close
            </button>
          </div>
          <div ref={picture} className="relative min-h-0 flex-1">
            <Image src={shot.src} alt={shot.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="pointer-events-auto flex justify-center gap-2">
            <button type="button" onClick={() => onMove(-1)} className="btn btn-white cursor-pointer">
              Previous
            </button>
            <button type="button" onClick={() => onMove(1)} className="btn btn-white cursor-pointer">
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

/** Fades in once the wall has been scrolled a little, and out as the cyan shape with its own button arrives. It takes no height of its own. */
function MorePhotos() {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    gsap.set(ref.current, { autoAlpha: 0, y: 16 });
    const trigger = ScrollTrigger.create({
      trigger: "#photos",
      start: "top -30%",
      endTrigger: "#more-photos",
      end: "top bottom",
      onToggle: ({ isActive }) => gsap.to(ref.current, { autoAlpha: isActive ? 1 : 0, y: isActive ? 0 : 16, duration: fade() * 2, ease: "power3.out", overwrite: true }),
    });
    return () => trigger.kill();
  });

  return (
    <div className="pointer-events-none sticky bottom-4 z-30 -mt-14 flex justify-end pr-2 sm:bottom-6">
      <a ref={ref} href={FACEBOOK_PHOTOS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary pointer-events-auto min-h-14 px-7 text-lg shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.25)] hover:bg-white hover:text-ink">
        More photos on Facebook
      </a>
    </div>
  );
}

/**
 * The photos used across the site on one wall, muted until the pointer lands on a photo and it says
 * which event it's from. Touch screens have no pointer to do that, so they stay in colour. A cyan
 * shape cut around the last photos fills in to one straight bottom edge.
 */
export function Gallery() {
  const [shot, setShot] = useState<Shot | null>(null);
  const count = useSyncExternalStore(watchWidth, columnCount, () => 4);
  const columns = useMemo(() => layOut(count), [count]);
  const [band, setBand] = useState("");
  const wall = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  // The wall changes height with its columns, so the button has to measure again.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [count]);

  // Tile heights follow the wall's width, so the shape is traced again whenever that changes.
  useEffect(() => {
    if (!wall.current || !row.current) return;
    const box = wall.current;
    const line = row.current;
    // A hidden wall measures as nothing, so it keeps the shape it has until it's back.
    const trace = () => {
      if (box.offsetWidth) setBand(traceBand(box, line));
    };
    const watch = new ResizeObserver(trace);
    watch.observe(box);
    return () => watch.disconnect();
  }, [count]);

  const move = (step: number) => {
    setShot((now) => {
      if (!now) return now;
      const at = everything.indexOf(now);
      return everything[(at + step + everything.length) % everything.length];
    });
  };

  return (
    <section id="photos" aria-labelledby="photos-title" className="scroll-mt-24 px-2 pb-32 max-md:pb-20 pt-28 max-md:pt-20">
      <SplitHeading id="photos-title" className="display m-0 mb-10 px-4 text-[clamp(2.5rem,4.2vw,3.75rem)]">A look back at our events</SplitHeading>

      {/* The space under the columns is where the cyan shape's words sit. */}
      <div ref={wall} className="relative pb-[21rem] sm:pb-[19rem]">
        {/* Each column reveals on its own, so a fast scroll doesn't leave the last column waiting for the others. */}
        <div ref={row} className="flex items-start gap-2">
          {columns.map((column, i) => (
            <Reveal key={`${count}-${i}`} className="flex min-w-0 flex-1 flex-col gap-2">
              {column.shots.map((photo) => (
                <Tile key={photo.src} shot={photo} onOpen={setShot} />
              ))}
            </Reveal>
          ))}
        </div>
        <MoreBand path={band} />
      </div>

      <Lightbox shot={shot} onMove={move} onClose={() => setShot(null)} />
      <MorePhotos />
    </section>
  );
}
