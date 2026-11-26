import { motion } from "motion/react";
import { ABOUT_PILLARS, ASSETS } from "../data/signbridgeData";
import { ResilientImage } from "./ResilientImage";

export function AboutSection() {
  return (
    <section id="about" className="bg-[#F8F5FF] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* 3D Sculptural Illustration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex lg:col-span-5"
          >
            <div className="glass-card-lavender flex w-full flex-col overflow-hidden rounded-[28px] p-3.5">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#F8F5FF] lg:h-full">
                <ResilientImage
                  src={ASSETS.aboutDialogue}
                  alt="3D sculptural alabaster and lilac hands signing a bridge of mutual communication"
                  fallbackTitle="SignBridge Dialogue Illustration"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Editorial Mission + White Cards */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sm font-semibold text-[#7041B5]">About SignBridge</p>
              <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
                Designed for dignity, fluency, and{" "}
                <span className="text-gradient-violet">shared understanding.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#302343]/85">
                Over 70 million Deaf people worldwide use more than 300 rich, grammatically
                distinct sign languages. Yet daily moments—checking into a clinic, joining a
                seminar, or greeting a colleague—still break down when an interpreter is not
                immediately present. SignBridge closes that gap with software co-designed by
                Deaf linguists and computer vision researchers.
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ABOUT_PILLARS.map((pillar, idx) => (
                <motion.article
                  key={pillar.index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-[#D8C4FF]/80 bg-white p-5 shadow-[0_10px_28px_-14px_rgba(112,65,181,0.16)] transition-all duration-200 hover:-translate-y-1 hover:border-[#9061D8]/70 hover:shadow-[0_16px_36px_-14px_rgba(112,65,181,0.24)]"
                >
                  <p className="font-mono text-xs font-medium text-[#7041B5] tabular-nums">
                    {pillar.index}.
                  </p>
                  <h3 className="mt-2 font-[Poppins] text-base font-semibold text-[#38205F]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#302343]/80">
                    {pillar.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
