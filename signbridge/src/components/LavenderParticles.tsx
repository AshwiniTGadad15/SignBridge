import { motion, useReducedMotion } from "motion/react";

interface ParticleConfig {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const PARTICLES: ParticleConfig[] = [
  { id: 1, left: "8%", top: "18%", size: 10, duration: 7.5, delay: 0, opacity: 0.55 },
  { id: 2, left: "18%", top: "72%", size: 14, duration: 9.2, delay: 1.1, opacity: 0.42 },
  { id: 3, left: "32%", top: "14%", size: 8, duration: 8.4, delay: 0.6, opacity: 0.5 },
  { id: 4, left: "48%", top: "82%", size: 12, duration: 10.1, delay: 1.8, opacity: 0.36 },
  { id: 5, left: "64%", top: "16%", size: 9, duration: 7.8, delay: 0.4, opacity: 0.48 },
  { id: 6, left: "78%", top: "76%", size: 16, duration: 9.6, delay: 1.5, opacity: 0.35 },
  { id: 7, left: "90%", top: "28%", size: 11, duration: 8.8, delay: 0.9, opacity: 0.5 },
  { id: 8, left: "54%", top: "42%", size: 7, duration: 6.9, delay: 2.1, opacity: 0.42 },
];

export function LavenderParticles() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle ambient glowing lavender orbs */}
      <div className="animate-glow-breath absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D8C4FF]/50 blur-3xl" />
      <div className="animate-glow-breath absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#E8DCFF]/80 blur-3xl [animation-delay:2.5s]" />
      <div className="animate-glow-breath absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-[#9061D8]/15 blur-3xl [animation-delay:4.2s]" />

      {/* Floating lavender particles */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={
            prefersReduced
              ? undefined
              : {
                  y: [0, -18, 4, 0],
                  x: [0, 8, -6, 0],
                  opacity: [p.opacity * 0.7, p.opacity, p.opacity * 0.75, p.opacity * 0.7],
                }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-gradient-to-br from-[#D8C4FF] to-[#9061D8] shadow-[0_0_14px_rgba(144,97,216,0.35)]"
        />
      ))}
    </div>
  );
}
