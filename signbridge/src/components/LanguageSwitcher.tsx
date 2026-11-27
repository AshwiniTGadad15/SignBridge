import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  SIGN_DATASETS,
  SIGN_DIALECT_LIST,
  type SignDialect,
} from "../data/signbridgeData";

interface LanguageSwitcherProps {
  dialect: SignDialect;
  onChange: (dialect: SignDialect) => void;
  variant?: "navbar" | "mobile";
}

export function LanguageSwitcher({
  dialect,
  onChange,
  variant = "navbar",
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const current = SIGN_DATASETS[dialect];

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (variant === "mobile") {
    return (
      <div className="rounded-2xl border border-[#E8DCFF] bg-[#F8F5FF] p-3">
        <div className="flex items-center gap-2 px-1 text-xs font-semibold text-[#7041B5]">
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign language dataset</span>
        </div>
        <div
          role="radiogroup"
          aria-label="Sign language dataset"
          className="mt-2.5 grid grid-cols-3 gap-1.5"
        >
          {SIGN_DIALECT_LIST.map((item) => {
            const active = item.code === dialect;
            return (
              <button
                key={item.code}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(item.code)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  active
                    ? "bg-gradient-to-r from-[#9061D8] to-[#7041B5] text-white shadow-sm"
                    : "border border-[#D8C4FF]/80 bg-white text-[#38205F] hover:bg-[#F0E9FF]"
                }`}
              >
                {item.code}
              </button>
            );
          })}
        </div>
        <p className="mt-2 px-1 text-xs text-[#302343]/75">
          {current.name} · {current.region}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select sign language dataset. Current dataset: ${current.name}`}
        className="inline-flex items-center gap-2 rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] px-3.5 py-2 text-sm font-semibold text-[#38205F] transition-all duration-150 hover:border-[#9061D8] hover:bg-[#F0E9FF] whitespace-nowrap shrink-0"
      >
        <Globe className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
        <span>{dialect}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#7041B5] transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label="Sign language datasets"
            className="absolute right-0 mt-2.5 w-72 overflow-hidden rounded-2xl border border-[#D8C4FF]/90 bg-white p-2 shadow-[0_18px_46px_-14px_rgba(56,32,95,0.28)]"
          >
            <div className="px-3 pb-2 pt-1.5 border-b border-[#F0E9FF]">
              <p className="text-xs font-semibold text-[#7041B5]">
                Sign Language Dataset
              </p>
              <p className="mt-0.5 text-[11px] text-[#302343]/70">
                Updates gloss grammar, lexicon &amp; live demo
              </p>
            </div>

            <div className="mt-1.5 space-y-1">
              {SIGN_DIALECT_LIST.map((item) => {
                const isSelected = item.code === dialect;
                return (
                  <button
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(item.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 ${
                      isSelected
                        ? "bg-[#F0E9FF] text-[#38205F]"
                        : "text-[#302343] hover:bg-[#F8F5FF]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#7041B5]">
                          {item.code}
                        </span>
                        <span className="text-sm font-semibold text-[#38205F]">
                          {item.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#302343]/75">
                        {item.region} · {item.corpusSize}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
