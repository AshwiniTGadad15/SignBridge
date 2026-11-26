import { useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { HOW_IT_WORKS_STEPS } from "../data/signbridgeData";

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = HOW_IT_WORKS_STEPS[activeIndex];

  return (
    <section id="how-it-works" className="bg-[#F0E9FF] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold text-[#7041B5]">How It Works</p>
          <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
            From natural motion to{" "}
            <span className="text-gradient-violet">clear conversation in four stages.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#302343]/80">
            Select any stage along the lavender timeline to inspect how SignBridge transforms
            spatial hand movement and facial nuance into fluid dialogue.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Interactive Lavender Timeline with Violet Connecting Line */}
          <div className="relative lg:col-span-7">
            {/* Vertical violet connecting line */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-6 top-8 w-0.5 bg-gradient-to-b from-[#9061D8] via-[#7041B5] to-[#D8C4FF]"
            />

            <ol className="relative space-y-4">
              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={step.number}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={`group relative flex w-full items-start gap-5 rounded-2xl border p-5 text-left transition-all duration-200 ${
                        isActive
                          ? "border-[#9061D8] bg-white shadow-[0_14px_36px_-14px_rgba(112,65,181,0.28)]"
                          : "border-[#D8C4FF]/80 bg-white/75 hover:border-[#9061D8]/60 hover:bg-white"
                      }`}
                    >
                      {/* Timeline Node */}
                      <span
                        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-[Poppins] text-sm font-bold tabular-nums transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-[0_8px_20px_-6px_rgba(112,65,181,0.55)]"
                            : "border border-[#D8C4FF] bg-[#F8F5FF] text-[#7041B5] group-hover:border-[#9061D8]"
                        }`}
                      >
                        {step.number}
                      </span>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-xs font-medium text-[#7041B5]">{step.subtitle}</p>
                        <h3 className="mt-1 font-[Poppins] text-lg font-semibold text-[#38205F]">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#302343]/80">
                          {step.description}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Active Stage Technical Deep-Dive Card */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.number}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-lavender rounded-3xl p-7 sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-[#E8DCFF] pb-4">
                  <span className="text-xs font-semibold text-[#7041B5]">
                    Stage {current.number} · {current.detailLabel}
                  </span>
                  <span className="font-mono text-xs text-[#302343]/70 tabular-nums">
                    {activeIndex + 1} / {HOW_IT_WORKS_STEPS.length}
                  </span>
                </div>

                <h3 className="mt-5 font-[Poppins] text-2xl font-bold text-[#38205F]">
                  {current.title}
                </h3>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#F8F5FF] to-[#E8DCFF]/60 p-5 border border-[#D8C4FF]/60">
                  <p className="text-xs font-medium text-[#7041B5]">Operational Benchmark</p>
                  <p className="mt-1 font-[Poppins] text-lg font-semibold text-[#38205F]">
                    {current.detailMetric}
                  </p>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {current.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#302343]/85">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#E8DCFF] pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        prev === 0 ? HOW_IT_WORKS_STEPS.length - 1 : prev - 1
                      )
                    }
                    className="rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] px-4 py-2 text-sm font-semibold text-[#38205F] transition-colors hover:bg-[#E8DCFF]/70 whitespace-nowrap shrink-0"
                  >
                    Previous Stage
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length)
                    }
                    className="btn-gradient-primary rounded-xl px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0"
                  >
                    Next Stage
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
