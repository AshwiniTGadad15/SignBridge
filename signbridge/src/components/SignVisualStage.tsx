import { motion } from "motion/react";

interface SignVisualStageProps {
  archetype: string;
  gloss: string;
  handshape: string;
  movement: string;
}

export function SignVisualStage({
  archetype,
  gloss,
  handshape,
  movement,
}: SignVisualStageProps) {
  const normalized = archetype.toLowerCase();

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#D8C4FF]/80 bg-gradient-to-b from-[#F8F5FF] via-[#F0E9FF] to-[#E8DCFF]/70 p-6">
      <motion.svg
        key={`${gloss}-${normalized}`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        viewBox="0 0 260 180"
        className="h-44 w-full max-w-[260px]"
        role="img"
        aria-label={`Visual sign schematic for ${gloss}: ${handshape}`}
      >
        <defs>
          <linearGradient id="sbHandFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E8DCFF" />
            <stop offset="100%" stopColor="#D8C4FF" />
          </linearGradient>
          <linearGradient id="sbVioletStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9061D8" />
            <stop offset="100%" stopColor="#7041B5" />
          </linearGradient>
          <radialGradient id="sbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9061D8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#9061D8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ambient lavender backdrop halo */}
        <circle cx="130" cy="94" r="68" fill="url(#sbGlow)" />

        {/* Subtle kinematic motion guide arcs */}
        <motion.path
          d={
            normalized.includes("bridge") || normalized.includes("connect")
              ? "M 55 110 Q 130 34 205 110"
              : normalized.includes("chin") || normalized.includes("forward")
              ? "M 92 64 Q 134 52 178 96"
              : normalized.includes("chest") || normalized.includes("heart")
              ? "M 86 112 A 44 44 0 1 1 174 112"
              : "M 74 72 Q 130 36 186 72"
          }
          fill="none"
          stroke="url(#sbVioletStroke)"
          strokeWidth="2.2"
          strokeDasharray="5 5"
          strokeLinecap="round"
          initial={{ pathLength: 0.2, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* Sculptural stylized hand posture */}
        {normalized.includes("bridge") || normalized.includes("connect") ? (
          <g>
            {/* Left interlocking hand */}
            <motion.path
              d="M72 134 C66 112 72 92 86 84 C94 79 102 82 106 89 L122 86 C128 85 132 90 130 96 L114 106 L122 122 C116 135 94 142 72 134 Z"
              fill="url(#sbHandFill)"
              stroke="url(#sbVioletStroke)"
              strokeWidth="2.2"
              initial={{ x: -8 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            {/* Right interlocking hand */}
            <motion.path
              d="M188 134 C194 112 188 92 174 84 C166 79 158 82 154 89 L138 86 C132 85 128 90 130 96 L146 106 L138 122 C144 135 166 142 188 134 Z"
              fill="url(#sbHandFill)"
              stroke="url(#sbVioletStroke)"
              strokeWidth="2.2"
              initial={{ x: 8 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <circle cx="130" cy="94" r="5" fill="#7041B5" />
          </g>
        ) : normalized.includes("point") ? (
          <g>
            <path
              d="M114 148 L114 108 C114 96 122 90 124 88 L124 46 C124 40 136 40 136 46 L136 86 C144 86 154 92 154 106 L154 134 C154 144 144 152 130 152 C122 152 114 150 114 148 Z"
              fill="url(#sbHandFill)"
              stroke="url(#sbVioletStroke)"
              strokeWidth="2.2"
            />
            <circle cx="130" cy="46" r="4.5" fill="#7041B5" />
            <circle cx="130" cy="88" r="3.5" fill="#9061D8" />
          </g>
        ) : normalized.includes("curved") || normalized.includes("cup") ? (
          <g>
            <path
              d="M96 138 C86 112 94 74 122 64 C144 56 168 68 172 86 C174 96 166 102 158 98 C150 94 144 82 130 84 C116 86 114 108 124 120 L156 120 C162 120 164 130 156 136 C142 146 106 150 96 138 Z"
              fill="url(#sbHandFill)"
              stroke="url(#sbVioletStroke)"
              strokeWidth="2.2"
            />
            <circle cx="122" cy="66" r="4" fill="#7041B5" />
            <circle cx="164" cy="92" r="4" fill="#9061D8" />
          </g>
        ) : (
          /* Open expressive palm with 21-point inspired joint dots */
          <g>
            <path
              d="M104 146 L94 108 C92 100 100 96 104 102 L108 110 L106 66 C106 58 116 58 116 66 L119 96 L123 54 C123 46 134 46 134 54 L135 94 L142 58 C143 50 154 52 152 60 L147 98 L158 72 C161 65 170 69 167 77 L156 118 C152 136 142 150 124 150 C114 150 108 148 104 146 Z"
              fill="url(#sbHandFill)"
              stroke="url(#sbVioletStroke)"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Key kinematic landmark nodes */}
            <circle cx="111" cy="64" r="3.2" fill="#7041B5" />
            <circle cx="128" cy="52" r="3.2" fill="#7041B5" />
            <circle cx="147" cy="57" r="3.2" fill="#7041B5" />
            <circle cx="163" cy="73" r="3.2" fill="#7041B5" />
            <circle cx="128" cy="116" r="4" fill="#9061D8" />
          </g>
        )}
      </motion.svg>

      <div className="mt-2 text-center">
        <p className="font-mono text-sm font-semibold tracking-wider text-[#7041B5]">
          {gloss}
        </p>
        <p className="mt-1 text-xs text-[#302343]/75">{movement}</p>
      </div>
    </div>
  );
}
