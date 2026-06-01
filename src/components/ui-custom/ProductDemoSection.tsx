import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const ProductDemoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play(); setPlaying(true);
    } else {
      videoRef.current.pause(); setPlaying(false);
    }
  };
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 order-2 lg:order-1"
        >
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">See it in 60 seconds</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-5 leading-tight text-balance">
            From overwhelmed to <span className="serif-italic text-primary">heard</span> — in one tap.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-lg">
            Watch a real walkthrough: open the app, tap Aria, and start talking. No forms. No clinic queues. Just a calm voice that listens — in Hinglish, English, or whatever feels safe.
          </p>
          <ul className="space-y-3 text-sm text-foreground/80">
            {[
              "Auto-connecting phone-style call with Aria",
              "Daily Emotional Color Brain Map™ on your dashboard",
              "Private journal + self-help library at your fingertips",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: phone frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 order-1 lg:order-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-accent/30 to-calm-lavender/20 rounded-[3rem] blur-3xl opacity-70" />
            <div className="relative w-[260px] md:w-[300px] aspect-[9/19.5] rounded-[2.5rem] bg-foreground/90 p-3 shadow-2xl">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl z-20" />
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src="/demo/wellmind-product-demo.mp4"
                  className="w-full h-full object-cover"
                  autoPlay loop muted playsInline preload="metadata"
                />
                <div className="absolute bottom-3 right-3 flex gap-2 z-10">
                  <Button size="icon" variant="secondary" onClick={togglePlay} className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-foreground backdrop-blur">
                    {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="secondary" onClick={toggleMute} className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-foreground backdrop-blur">
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDemoSection;
