import { motion } from "motion/react";
import { ASSETS, TECH_MODULES } from "../data/signbridgeData";
import { ResilientImage } from "./ResilientImage";

export function TechnologySection() {
  return (
    <section id="technology" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <p className="text-sm font-semibold text-[#7041B5]">Core Technology</p>
            <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
              Precision spatial vision engineered for{" "}
              <span className="text-gradient-violet">expressive sign language.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-base leading-relaxed text-[#302343]/80 lg:col-span-5"
          >
            Rather than relying on static single-letter classifiers, SignBridge fuses 3D
            skeletal geometry with temporal linguistic context inside an edge-ready neural stack.
          </motion.p>
        </div>

        {/* Wide 16:9 3D Hand-Tracking Kinematic Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 overflow-hidden rounded-[28px] border border-[#D8C4FF]/80 bg-gradient-to-br from-[#F0E9FF] to-[#E8DCFF]/70 p-3 sm:p-4 shadow-[0_18px_46px_-20px_rgba(112,65,181,0.2)]"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-[#F0E9FF]">
            <ResilientImage
              src={ASSETS.techTracking}
              alt="3D scientific isometric studio render of a translucent lavender hand with precision violet wireframe kinematics and 21 illuminated landmark joints"
              fallbackTitle="3D Hand-Mesh Tracking Visualization"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Light Purple Gradient Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TECH_MODULES.map((mod, idx) => (
            <motion.article
              key={mod.code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="flex flex-col justify-between rounded-3xl border border-[#D8C4FF]/80 bg-gradient-to-br from-[#F8F5FF] via-[#F0E9FF] to-[#E8DCFF]/85 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#9061D8] hover:shadow-[0_16px_36px_-16px_rgba(112,65,181,0.25)]"
            >
              <div>
                <p className="font-mono text-xs font-medium text-[#7041B5] tabular-nums">
                  {mod.code}.
                </p>
                <h3 className="mt-3 font-[Poppins] text-lg font-semibold text-[#38205F]">
                  {mod.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#302343]/80">
                  {mod.summary}
                </p>
              </div>

              <div className="mt-6 border-t border-[#D8C4FF]/70 pt-4">
                <p className="font-[Poppins] text-2xl font-bold text-[#7041B5] tabular-nums">
                  {mod.metric}
                </p>
                <p className="mt-0.5 text-xs text-[#302343]/75">{mod.metricCaption}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
