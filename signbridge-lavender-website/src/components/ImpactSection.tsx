import { motion } from "motion/react";
import { ASSETS, COMMUNITY_QUOTES, IMPACT_CASES } from "../data/signbridgeData";
import { ResilientImage } from "./ResilientImage";

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="bg-gradient-to-b from-[#F8F5FF] via-[#F0E9FF]/80 to-[#F8F5FF] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Heading & Impact Cases */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-semibold text-[#7041B5]">Real-World Impact</p>
              <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
                Measured accessibility across{" "}
                <span className="text-gradient-violet">clinics, campuses, and teams.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#302343]/80">
                SignBridge complements certified human interpreters by removing everyday wait
                barriers during spontaneous, urgent, and collaborative interactions.
              </p>
            </motion.div>

            <div className="mt-8 space-y-4">
              {IMPACT_CASES.map((item, idx) => (
                <motion.article
                  key={item.sector}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className="glass-card-lavender grid grid-cols-1 gap-4 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9061D8]/75 sm:grid-cols-12 sm:items-center"
                >
                  <div className="sm:col-span-4">
                    <p className="text-xs font-semibold text-[#7041B5]">{item.sector}</p>
                    <p className="mt-1 font-[Poppins] text-2xl font-bold text-[#38205F] tabular-nums">
                      {item.metric}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-[#302343]/75">
                      {item.metricDetail}
                    </p>
                  </div>
                  <div className="border-t border-[#E8DCFF] pt-4 sm:col-span-8 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <h3 className="font-[Poppins] text-base font-semibold text-[#38205F]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#302343]/80">
                      {item.summary}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* 3D Lavender & Violet Impact Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex lg:col-span-5"
          >
            <div className="glass-card-lavender flex w-full flex-col overflow-hidden rounded-[28px] p-3.5">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#F4EEFF] lg:h-full">
                <ResilientImage
                  src={ASSETS.impactCommunity}
                  alt="3D sculptural pearl, lavender, and deep violet hands signing community and unity with flowing lilac light ribbons"
                  fallbackTitle="Inclusive Community Impact Illustration"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Attributable Community Perspectives */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {COMMUNITY_QUOTES.map((q) => (
            <figure
              key={q.name}
              className="rounded-3xl border border-[#D8C4FF]/80 bg-white p-7 shadow-[0_12px_34px_-16px_rgba(112,65,181,0.16)]"
            >
              <blockquote className="text-base leading-relaxed text-[#302343]">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#F0E9FF] pt-4 text-sm">
                <span className="font-semibold text-[#38205F]">{q.name}</span>
                <span aria-hidden="true" className="text-[#9061D8]">
                  ·
                </span>
                <span className="text-[#7041B5]">{q.role}</span>
                <span aria-hidden="true" className="text-[#9061D8]">
                  ·
                </span>
                <span className="text-[#302343]/75">{q.organization}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
