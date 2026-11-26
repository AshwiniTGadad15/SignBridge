import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import {
  ASSETS,
  HERO_METRICS,
  SIGN_DATASETS,
  type SignDialect,
} from "../data/signbridgeData";
import { LavenderParticles } from "./LavenderParticles";
import { ResilientImage } from "./ResilientImage";

interface HeroSectionProps {
  dialect: SignDialect;
}

export function HeroSection({ dialect }: HeroSectionProps) {
  const dataset = SIGN_DATASETS[dialect];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#F8F5FF] via-[#F0E9FF] to-[#E8DCFF]/65 pt-14 pb-20 lg:pt-20 lg:pb-24"
    >
      <LavenderParticles />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2-Column Balanced Split */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <p className="mb-4 text-sm font-semibold tracking-wide text-[#7041B5]">
              Active dataset: {dataset.name} ({dataset.code}) · {dataset.corpusSize}
            </p>

            <h1
              className="font-[Poppins] font-bold tracking-tight text-[#38205F] [text-wrap:balance]"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.65rem)", lineHeight: 1.12 }}
            >
              Bridging sign and speech in{" "}
              <span className="text-gradient-violet">natural real time.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#302343]/85 sm:text-lg">
              SignBridge translates continuous sign language gestures and facial expressions
              into clear spoken audio—and turns spoken words into grammatically faithful
              visual sign guidance across healthcare, classrooms, and workplaces.
            </p>

            {/* Primary CTA + Quiet Secondary Anchor */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="#live-demo"
                className="btn-gradient-primary inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-base font-semibold text-white whitespace-nowrap shrink-0"
              >
                <span>Try {dataset.code} Live Demo</span>
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold text-[#7041B5] transition-colors duration-150 hover:bg-white/70 hover:text-[#38205F] whitespace-nowrap shrink-0"
              >
                <PlayCircle className="h-5 w-5 text-[#9061D8]" aria-hidden="true" />
                <span>See How It Works</span>
              </a>
            </div>
          </motion.div>

          {/* 3D Sign Language Illustration Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex lg:col-span-6"
          >
            <div className="glass-card-lavender relative flex w-full flex-col overflow-hidden rounded-[28px] p-3 sm:p-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#F4EEFF] lg:h-full lg:min-h-[390px]">
                <ResilientImage
                  src={ASSETS.heroHands}
                  alt="3D sculptural alabaster and frosted lavender glass hands performing a welcoming sign language gesture with luminous motion trails"
                  fallbackTitle="SignBridge 3D Sign Language Gesture"
                  className="h-full w-full object-cover"
                />
                {/* Measured subtle lavender bottom scrim for caption legibility */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#38205F]/75 via-[#38205F]/25 to-transparent px-5 pb-4 pt-12">
                  <p className="text-xs font-medium text-[#E8DCFF]">
                    {dataset.name} · {dataset.alphabetStyle}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Continuous two-way recognition for everyday human dialogue
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Proof Strip Directly Below Hero Split */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {HERO_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="glass-card-lavender rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="font-[Poppins] text-2xl font-bold tracking-tight text-[#7041B5] tabular-nums sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#38205F]">{metric.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#302343]/75">{metric.context}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
