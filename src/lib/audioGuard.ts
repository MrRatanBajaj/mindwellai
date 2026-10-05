/**
 * Global "stop talking when the page changes" guard.
 * Every audio/video element that starts playing is tracked, so a route change
 * can silence all counsellor voices, browser speech and live voice calls at once.
 */
const playing = new Set<HTMLMediaElement>();
const stopHandlers = new Set<() => void>();
let installed = false;

export function installAudioGuard() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const orig = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
    playing.add(this);
    const drop = () => playing.delete(this);
    this.addEventListener("ended", drop, { once: true });
    return orig.call(this);
  };
}

/** Register extra cleanup (e.g. close a live voice connection). Returns unregister. */
export function onStopAllAudio(fn: () => void) {
  stopHandlers.add(fn);
  return () => { stopHandlers.delete(fn); };
}

export function stopAllAudio() {
  try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
  playing.forEach((el) => {
    // keep page-owned muted background videos alone
    if (el instanceof HTMLVideoElement && el.muted) return;
    try { el.pause(); } catch { /* noop */ }
  });
  playing.clear();
  stopHandlers.forEach((fn) => { try { fn(); } catch { /* noop */ } });
}
