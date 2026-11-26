import {
  Camera,
  Cpu,
  Globe,
  MessageSquareText,
  ShieldCheck,
  Smile,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    id: "continuous",
    span: "lg:col-span-2",
    icon: Camera,
    number: "01",
    title: "Continuous Phrase Recognition",
    meta: "60 fps vision · No wearable sensors",
    description:
      "Reads full, natural signing sentences—not isolated dictionary gestures—using any standard laptop webcam, tablet, or smartphone camera.",
  },
  {
    id: "bidirectional",
    span: "lg:col-span-1",
    icon: MessageSquareText,
    number: "02",
    title: "Bidirectional Speech & Sign",
    meta: "Voice-to-gloss · Sign-to-speech",
    description:
      "Converts spoken responses into structured sign language gloss and step-by-step handshape guidance in seconds.",
  },
  {
    id: "non-manual",
    span: "lg:col-span-1",
    icon: Smile,
    number: "03",
    title: "Facial & Non-Manual Nuance",
    meta: "Eyebrow · Head posture · Gaze",
    description:
      "Tracks 468 facial landmarks alongside hand movement to accurately detect questions, negation, emphasis, and emotional tone.",
  },
  {
    id: "dialects",
    span: "lg:col-span-2",
    icon: Globe,
    number: "04",
    title: "Regional Sign Dialect Intelligence",
    meta: "ASL · BSL · ISL grammar models",
    description:
      "Honors the distinct syntax, two-handed alphabets, and regional phrasing of American, British, and Indian Sign Languages rather than forcing word-for-word English.",
  },
  {
    id: "edge",
    span: "lg:col-span-1",
    icon: Cpu,
    number: "05",
    title: "Low-Latency Edge SDK",
    meta: "Web · iOS · Android kiosks",
    description:
      "Lightweight quantized weights run smoothly on clinical tablets and classroom Chromebooks with reliable offline fallback.",
  },
  {
    id: "privacy",
    span: "lg:col-span-2",
    icon: ShieldCheck,
    number: "06",
    title: "Zero-Retention Privacy Architecture",
    meta: "HIPAA-ready workflows · Ephemeral processing",
    description:
      "Extracts anonymized skeletal coordinates in memory without archiving raw video recordings, protecting sensitive medical and academic conversations.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-gradient-to-b from-[#F8F5FF] to-[#F0E9FF]/70 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold text-[#7041B5]">Core Capabilities</p>
          <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
            Every layer crafted for{" "}
            <span className="text-gradient-violet">human-grade sign fluency.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#302343]/80">
            Purpose-built vision, linguistic modeling, and privacy engineering working together
            inside one responsive platform.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid of White Cards with Purple Gradient Icons */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex flex-col justify-between rounded-3xl border border-[#D8C4FF]/80 bg-white p-7 shadow-[0_12px_34px_-16px_rgba(112,65,181,0.16)] transition-all duration-200 hover:-translate-y-1 hover:border-[#9061D8]/75 hover:shadow-[0_20px_44px_-16px_rgba(112,65,181,0.26)] ${feature.span}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-[0_8px_20px_-6px_rgba(112,65,181,0.5)] transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-medium text-[#7041B5]/80 tabular-nums">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-[Poppins] text-xl font-semibold text-[#38205F]">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#302343]/80 sm:text-[15px]">
                    {feature.description}
                  </p>
                </div>

                <p className="mt-6 border-t border-[#F0E9FF] pt-4 text-xs font-medium text-[#7041B5]">
                  {feature.meta}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
