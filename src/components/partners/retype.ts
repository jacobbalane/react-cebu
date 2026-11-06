import { gsap, MOTION_OK } from "@/lib/gsap";

const ERASE = 0.015;
const TYPE = 0.025;
const FADE = 0.16;

const letterOf = (text: string) => {
  const letter = document.createElement("span");
  letter.textContent = text;
  return letter;
};

/**
 * Turns a line of text into one that changes like someone retyping it: it erases back to the first
 * letter that differs, then types the rest, each letter fading as it goes. Returns the function that
 * changes it, and a change mid-way carries on from whatever is on screen.
 */
export function retype(box: HTMLElement) {
  let letters = [...(box.textContent ?? "")].map(letterOf);
  // The rest of the sentence, held invisibly, so a word being typed doesn't jump to the next line.
  const rest = document.createElement("span");
  rest.style.visibility = "hidden";
  box.replaceChildren(...letters, rest);
  let line: gsap.core.Timeline | null = null;

  const write = (text: string) => {
    const next = [...text];
    line?.kill();
    rest.textContent = "";

    let same = 0;
    while (same < letters.length && letters[same].textContent === next[same]) same += 1;
    // A letter caught fading when the sentence changed again comes back if it's staying.
    gsap.to(letters.slice(0, same), { opacity: 1, duration: FADE, overwrite: true });

    if (!window.matchMedia(MOTION_OK).matches) {
      letters.slice(same).forEach((letter) => letter.remove());
      letters = letters.slice(0, same);
      next.slice(same).forEach((value) => {
        const letter = letterOf(value);
        rest.before(letter);
        letters.push(letter);
      });
      return;
    }

    line = gsap.timeline();
    const going = letters.slice(same).reverse();
    going.forEach((letter, i) => {
      line?.to(letter, { opacity: 0, duration: FADE, overwrite: true, onComplete: () => letter.remove() }, i * ERASE);
      line?.call(() => {
        letters = letters.filter((other) => other !== letter);
      }, undefined, i * ERASE);
    });

    const start = going.length * ERASE + (going.length ? FADE : 0);
    const coming = next.slice(same);
    coming.forEach((value, i) => {
      line?.call(() => {
        const letter = letterOf(value);
        rest.before(letter);
        rest.textContent = coming.slice(i + 1).join("");
        letters.push(letter);
        gsap.fromTo(letter, { opacity: 0 }, { opacity: 1, duration: FADE, ease: "power1.out" });
      }, undefined, start + i * TYPE);
    });
  };

  return {
    write,
    stop: () => {
      line?.kill();
    },
  };
}
