"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitHeading } from "@/components/motion";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const expectations = [
  { title: "It’s free.", text: "You don’t pay to get in. Partners cover the room and the snacks.", ask: "Do I have to pay anything?" },
  { title: "Any level is fine.", text: "New to React or shipping it at work, there’s a place for you.", ask: "I’m still new. Is that okay?" },
  { title: "Questions are welcome.", text: "Nobody expects you to know it all. Everyone here was new once.", ask: "What if I ask something silly?" },
  { title: "Bring a laptop to workshops.", text: "For a talk or a meetup, just bring yourself.", ask: "What should I bring?" },
];

const bubble = "rounded-[26px] px-5 py-3.5 text-[21px] leading-[1.32]";

/**
 * What a first-timer wants to know, as a chat on a 3D phone. Scrolling types each question into the
 * message box, sends it, and brings back the community's answer, while the phone slowly turns.
 *
 * Sizes inside the phone are in px on purpose: the screen is a fixed 390 by 844, scaled as one piece.
 */
export function FirstEvent() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = ref.current;
      const host = stage?.querySelector<HTMLElement>("[data-scene]");
      const screen = stage?.querySelector<HTMLElement>("[data-screen]");
      const thread = stage?.querySelector<HTMLElement>("[data-thread]");
      const list = thread?.firstElementChild;
      if (!stage || !host || !screen || !thread || !list) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const asks = gsap.utils.toArray<HTMLElement>("[data-ask]", stage);
        const drafts = gsap.utils.toArray<HTMLElement>("[data-draft]", stage);
        const typing = gsap.utils.toArray<HTMLElement>("[data-typing]", stage);
        const replies = gsap.utils.toArray<HTMLElement>("[data-reply]", stage);
        const hearts = gsap.utils.toArray<HTMLElement>("[data-heart]", stage);

        // Until the 3D phone loads, or if it can't, the screen sits flat at the same size.
        const lay = () => {
          const fit = Math.min((host.clientHeight * 0.92) / 844, (host.clientWidth * 0.84) / 390);
          screen.style.transform = `translate(-50%, -50%) scale(${fit})`;
        };
        lay();

        // Like any chat, the list rises so the newest message sits at the bottom.
        const rise = (message: HTMLElement) => () => Math.min(0, thread.clientHeight - message.offsetTop - message.offsetHeight - 28);
        const pop = { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.6)" };
        const slide = { duration: 0.3, ease: "power2.out" };
        gsap.set([...asks, ...typing, ...replies], { autoAlpha: 0, y: 20, scale: 0.94 });
        gsap.set(hearts, { autoAlpha: 0, scale: 0.4 });

        // The chat runs on its own clock. Scrolling only decides how far it has got, so a message
        // always plays through in full and is never left half faded at a scroll position.
        const chat = gsap.timeline({ paused: true, defaults: { ease: "none" } });
        const stops = [0];
        drafts.forEach((draft, i) => {
          const at = 0.1 + i * 1.75;
          // Three snaps per exchange: the question is typed, it sends, then the dots and the answer.
          stops.push(at + 0.46, at + 0.82, at + 1.65);
          chat
            .to("[data-placeholder]", { autoAlpha: 0, duration: 0.05 }, at)
            .fromTo(draft, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "steps(16)" }, at)
            .fromTo("[data-send]", { scale: 1 }, { scale: 1.16, duration: 0.07, yoyo: true, repeat: 1 }, at + 0.46)
            .to(draft, { autoAlpha: 0, duration: 0.05 }, at + 0.52)
            .to("[data-placeholder]", { autoAlpha: 1, duration: 0.1 }, at + 0.56)
            .to(asks[i], pop, at + 0.52)
            .to(list, { y: rise(asks[i]), ...slide }, at + 0.52)
            .to(typing[i], pop, at + 0.82)
            .to(list, { y: rise(replies[i].parentElement as HTMLElement), ...slide }, at + 0.82)
            .to(typing[i], { autoAlpha: 0, duration: 0.08 }, at + 1.14)
            .to(replies[i], pop, at + 1.22)
            .to(hearts[i], { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(2.5)" }, at + 1.45);
        });

        let shown = 0;
        let playing: gsap.core.Tween | null = null;
        const showUpTo = (stop: number) => {
          if (stop === shown) return;
          const forward = stop > shown;
          const distance = Math.abs(stops[stop] - chat.time());
          shown = stop;
          playing?.kill();
          playing = chat.tweenTo(stops[stop], { duration: forward ? Math.min(distance, 2.4) : Math.min(distance * 0.3, 0.6), ease: "none" });
        };
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=420%",
          pin: true,
          anticipatePin: 1,
          onUpdate: ({ progress }) => showUpTo(Math.min(stops.length - 1, 1 + Math.floor(progress * (stops.length - 1)))),
          onLeaveBack: () => showUpTo(0),
        });

        const turn = { y: -0.2, x: 0.05 };
        gsap.to(turn, { y: 0.2, x: 0, ease: "sine.inOut", scrollTrigger: { trigger: stage, start: "top top", end: "+=420%", scrub: 0.6 } });

        // The phone swings up to face you as the section arrives, and leans a little toward the pointer.
        const enter = { x: 0.3, y: -0.7, lift: -180 };
        gsap.to(enter, { x: 0, y: 0, lift: 0, ease: "power1.out", scrollTrigger: { trigger: stage, start: "top bottom", end: "top top", scrub: 0.6 } });
        const lean = { x: 0, y: 0 };
        const follow = { duration: 0.9, ease: "power3.out" };
        const leanX = gsap.quickTo(lean, "x", follow);
        const leanY = gsap.quickTo(lean, "y", follow);
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const box = host.getBoundingClientRect();
          leanY(((event.clientX - box.left) / box.width - 0.5) * 0.36);
          leanX(((event.clientY - box.top) / box.height - 0.5) * 0.2);
        };
        const rest = () => {
          leanX(0);
          leanY(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", rest);

        // three.js only loads as the section gets close, so the rest of the page never waits for it.
        const slot = screen.parentElement;
        let phone: ReturnType<typeof import("@/components/events/phone-scene").createPhone> | null = null;
        let gone = false;
        const draw = (seconds: number) => {
          const drift = Math.sin(seconds * 0.8) * 0.012;
          phone?.render(enter.x + turn.x + lean.x + drift, enter.y + turn.y + lean.y + drift, enter.lift + Math.sin(seconds * 0.9) * 4);
        };
        const resize = new ResizeObserver(() => (phone ? phone.fit() : lay()));
        resize.observe(host);
        const load = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            load.disconnect();
            import("@/components/events/phone-scene")
              .then(({ createPhone }) => {
                if (gone) return;
                phone = createPhone(host, screen);
                phone.fit();
              })
              .catch(() => {});
          },
          { rootMargin: "150% 0px" },
        );
        load.observe(stage);
        const watch = new IntersectionObserver(([entry]) => {
          gsap.ticker.remove(draw);
          if (entry.isIntersecting) gsap.ticker.add(draw);
        });
        watch.observe(stage);

        return () => {
          gone = true;
          gsap.ticker.remove(draw);
          load.disconnect();
          watch.disconnect();
          resize.disconnect();
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", rest);
          phone?.dispose();
          // The 3D layer took the screen, so it goes back where React expects to find it.
          screen.removeAttribute("style");
          slot?.append(screen);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section aria-labelledby="expect-title" className="pb-32">
      <div ref={ref} className="flex min-h-[40rem] flex-col px-2 pb-2 pt-24 motion-safe:h-svh">
        <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden rounded-[0.75rem] bg-fog p-2">
          <SplitHeading id="expect-title" className="display m-0 p-4 text-center text-[clamp(2.5rem,4.2vw,3.75rem)] sm:p-6">
            What to expect at your first event
          </SplitHeading>

          <ul className="m-0 grid w-full max-w-[46rem] list-none gap-4 p-4 motion-safe:hidden">
            {expectations.map(({ title, text }) => (
              <li key={title}>
                <h3 className="title m-0 text-[clamp(1.75rem,3vw,2.5rem)]">{title}</h3>
                <p className="m-0 text-lg leading-normal text-muted">{text}</p>
              </li>
            ))}
          </ul>

          <div data-scene className="relative min-h-0 w-full flex-1 motion-reduce:hidden">
            <div className="absolute inset-0">
              <div data-screen className="absolute left-1/2 top-1/2 flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[54px] bg-white">
                <div className="absolute left-1/2 top-3 z-10 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black" />

                <div className="flex items-center gap-3 bg-white px-5 pb-3 pt-[62px]">
                  <div className="flex size-[54px] shrink-0 items-center justify-center rounded-full bg-fog">
                    <Image src="/images/react-cebu-logo.webp" alt="" width={36} height={40} className="h-[34px] w-auto" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[22px] font-medium leading-tight text-ink">React Cebu</span>
                    <span className="text-[16px] leading-tight text-muted">Community chat</span>
                  </div>
                </div>

                <div data-thread className="relative min-h-0 flex-1 overflow-hidden">
                  <div className="relative flex flex-col gap-3 px-4 pb-6 pt-3">
                    <p className={`m-0 max-w-[86%] self-start rounded-bl-[8px] bg-fog text-ink ${bubble}`}>Hey! Ask us anything about your first event.</p>
                    {expectations.map(({ title, text, ask }) => (
                      <div key={title} className="flex flex-col gap-3">
                        <p data-ask className={`m-0 max-w-[84%] origin-bottom-right self-end rounded-br-[8px] bg-azure text-white ${bubble}`}>
                          {ask}
                        </p>
                        <div className="grid pb-4">
                          <div data-typing aria-hidden="true" className="col-start-1 row-start-1 flex h-[52px] w-[84px] origin-bottom-left items-center justify-center gap-1.5 self-start rounded-[26px] rounded-bl-[8px] bg-fog">
                            {[0, 200, 400].map((delay) => (
                              <span key={delay} className="size-[9px] animate-pulse rounded-full bg-muted" style={{ animationDelay: `${delay}ms` }} />
                            ))}
                          </div>
                          <div data-reply className={`relative col-start-1 row-start-1 max-w-[88%] origin-bottom-left justify-self-start rounded-bl-[8px] bg-fog text-ink ${bubble}`}>
                            <h3 className="m-0 inline text-[21px] font-medium">{title}</h3> {text}
                            <span data-heart aria-hidden="true" className="absolute -bottom-[14px] right-3 flex size-[30px] items-center justify-center rounded-full bg-react text-ink ring-[3px] ring-white">
                              <svg viewBox="0 0 24 24" className="size-[16px] fill-current">
                                <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2.3 4.5 6 4.5c2.3 0 4.4 1.4 6 3.5 1.6-2.1 3.7-3.5 6-3.5 3.7 0 5.6 3.8 4 7.2C19.5 16.4 12 21 12 21z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white px-4 pb-8 pt-3">
                  <div className="relative flex h-[54px] min-w-0 flex-1 items-center overflow-hidden rounded-full bg-fog px-5 text-[18px]">
                    <span data-placeholder className="text-muted">
                      Message
                    </span>
                    {expectations.map(({ ask }) => (
                      <span key={ask} data-draft aria-hidden="true" className="invisible absolute left-5 whitespace-nowrap text-ink">
                        {ask}
                      </span>
                    ))}
                  </div>
                  <div data-send className="flex size-[54px] shrink-0 items-center justify-center rounded-full bg-azure text-white">
                    <svg viewBox="0 0 24 24" className="size-[24px] fill-none stroke-current stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
