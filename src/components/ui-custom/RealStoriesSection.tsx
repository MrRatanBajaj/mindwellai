import { useEffect, useRef } from "react";

// Real Stories, Real People — visual-first reel wall.
// Uses Instagram's native embed player so the actual video shows on the page.
const REELS = [
  "DP1eSKtjxIF",
  "DP9xrTgDBsK",
  "DQ0m7GKjO4Y",
  "DP4RhX7DTsq",
  "DP7Y2VXjm1z",
];

const RealStoriesSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  // Gentle auto-scroll, pauses on hover/touch.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    const step = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += 0.4;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Real stories · real people</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Moments worth watching.</h2>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto px-6 pb-6 no-scrollbar"
        style={{ scrollBehavior: "auto" }}
      >
        {[...REELS, ...REELS].map((id, i) => (
          <div
            key={`${id}-${i}`}
            className="shrink-0 w-[280px] md:w-[320px] aspect-[9/16] rounded-[28px] overflow-hidden border border-foreground/10 bg-[#2A2522] shadow-lg"
          >
            <iframe
              src={`https://www.instagram.com/reel/${id}/embed/captioned/`}
              title="Story"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              scrolling="no"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RealStoriesSection;
