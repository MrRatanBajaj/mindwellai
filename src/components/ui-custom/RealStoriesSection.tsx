import { useEffect, useRef } from "react";
import { Instagram, Play } from "lucide-react";

// Real Stories, Real People — Instagram Reels carousel with auto-scroll.
// Users can click any card to open the reel inline (via native Instagram embed).
const REELS = [
  { id: "DP1eSKtjxIF", author: "@realityvjbaba", caption: "Real people, real breakthroughs on WellMindAI." },
  { id: "DP9xrTgDBsK", author: "@realityvjbaba", caption: "Reality TV meets real mental wellness." },
  { id: "DQ0m7GKjO4Y", author: "@realityvjbaba", caption: "The moment silence broke — real story." },
  { id: "DP4RhX7DTsq", author: "@realityvjbaba", caption: "Grounded again, one conversation at a time." },
  { id: "DP7Y2VXjm1z", author: "@realityvjbaba", caption: "Behind the smile — a real journey." },
];

// Ensure Instagram embed.js is loaded exactly once and re-parses when we mount.
function useInstagramEmbed() {
  useEffect(() => {
    const process = () => {
      // @ts-expect-error – global from //www.instagram.com/embed.js
      if (typeof window !== "undefined" && window.instgrm?.Embeds?.process) {
        // @ts-expect-error – global from //www.instagram.com/embed.js
        window.instgrm.Embeds.process();
      }
    };
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      s.onload = process;
      document.body.appendChild(s);
    } else {
      process();
    }
  }, []);
}

const RealStoriesSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  useInstagramEmbed();

  // Auto-scroll loop — pauses on hover.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let paused = false;
    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    const step = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += 0.5;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="px-6 py-20 bg-gradient-to-b from-background via-[#fdf6ec] to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Play className="w-3.5 h-3.5" /> Real Stories · Real People
          </div>
          <h2 className="font-display text-4xl md:text-5xl">Stories that made India pause.</h2>
          <p className="mt-4 text-foreground/70">
            Real conversations, real breakdowns, real breakthroughs. Watch how WellMindAI shows up when it matters most.
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar"
          style={{ scrollBehavior: "auto" }}
        >
          {[...REELS, ...REELS].map((reel, i) => (
            <div
              key={`${reel.id}-${i}`}
              className="snap-start shrink-0 w-[320px] md:w-[360px] rounded-3xl border border-foreground/10 bg-card overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`https://www.instagram.com/reel/${reel.id}/`}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: 0,
                  boxShadow: "none",
                  margin: 0,
                  minWidth: "100%",
                  width: "100%",
                }}
              >
                <a
                  href={`https://www.instagram.com/reel/${reel.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 text-center"
                >
                  <Instagram className="w-8 h-8 mx-auto text-pink-500 mb-3" />
                  <span className="block text-sm text-foreground/70">Loading Reel by {reel.author}…</span>
                </a>
              </blockquote>
              <div className="p-4 border-t border-foreground/10">
                <p className="text-sm text-foreground/80 line-clamp-2">{reel.caption}</p>
                <p className="mt-1 text-xs text-muted-foreground">{reel.author}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Hover to pause · Cards auto-scroll · Tap a card to watch the full reel
        </p>
      </div>
    </section>
  );
};

export default RealStoriesSection;
