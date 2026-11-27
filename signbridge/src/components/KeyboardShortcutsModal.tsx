import { useEffect, useRef } from "react";
import { Keyboard, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SIGN_DATASETS, type SignDialect } from "../data/signbridgeData";

interface ShortcutItem {
  keys: string[];
  action: string;
  detail: string;
}

interface ShortcutGroup {
  heading: string;
  items: ShortcutItem[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    heading: "Live Translation Controls",
    items: [
      {
        keys: ["Space"],
        action: "Start or pause translation",
        detail: "Play or pause sign sequence playback, or capture a camera frame",
      },
      {
        keys: ["←", "→"],
        action: "Step through sign sequence",
        detail: "Move backward or forward across individual gloss gestures",
      },
      {
        keys: ["R"],
        action: "Restart sequence",
        detail: "Return playback to the first gesture in the active sentence",
      },
      {
        keys: ["V"],
        action: "Speak phrase aloud",
        detail: "Read the active sentence or detected sign translation via audio",
      },
    ],
  },
  {
    heading: "Dataset & Workspace Navigation",
    items: [
      {
        keys: ["Ctrl", "D"],
        action: "Toggle sign language dataset",
        detail: "Cycle instantly across ASL, BSL, and ISL linguistic models",
      },
      {
        keys: ["Ctrl", "M"],
        action: "Switch Live Demo mode",
        detail: "Alternate between Text-to-Sign and Camera-to-Speech views",
      },
      {
        keys: ["?"],
        action: "Open or close shortcuts",
        detail: "Also available via Ctrl + / anywhere outside text fields",
      },
      {
        keys: ["Esc"],
        action: "Dismiss overlays",
        detail: "Close this guide or any open dataset dropdown menu",
      },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
  dialect: SignDialect;
  onCycleDialect: () => void;
}

export function KeyboardShortcutsModal({
  open,
  onClose,
  dialect,
  onCycleDialect,
}: KeyboardShortcutsModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dataset = SIGN_DATASETS[dialect];

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.setTimeout(() => closeBtnRef.current?.focus(), 40);

      return () => {
        document.body.style.overflow = originalOverflow;
        previousFocusRef.current?.focus?.();
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-modal-title"
          aria-describedby="shortcuts-modal-desc"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#38205F]/45 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[#D8C4FF] bg-white shadow-[0_24px_64px_-20px_rgba(56,32,95,0.45)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E8DCFF] bg-gradient-to-r from-[#F8F5FF] via-[#F0E9FF] to-[#E8DCFF]/60 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-[0_8px_20px_-6px_rgba(112,65,181,0.5)]">
                  <Keyboard className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="shortcuts-modal-title"
                    className="font-[Poppins] text-xl font-bold text-[#38205F]"
                  >
                    Keyboard Shortcuts
                  </h2>
                  <p
                    id="shortcuts-modal-desc"
                    className="mt-0.5 text-xs text-[#302343]/80 sm:text-sm"
                  >
                    Control live sign translation and switch dialects without leaving your keyboard.
                  </p>
                </div>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close keyboard shortcuts modal"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D8C4FF] bg-white/90 text-[#38205F] transition-colors hover:bg-[#F0E9FF]"
              >
                <X className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Shortcut Groups */}
            <div className="overflow-y-auto px-6 py-5 sm:px-7 sm:py-6">
              <div className="space-y-6">
                {SHORTCUT_GROUPS.map((group) => (
                  <section key={group.heading}>
                    <h3 className="text-xs font-semibold tracking-wide text-[#7041B5]">
                      {group.heading}
                    </h3>
                    <ul className="mt-2.5 divide-y divide-[#F0E9FF]">
                      {group.items.map((item) => (
                        <li
                          key={item.action}
                          className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center sm:gap-4"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#38205F]">
                              {item.action}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-[#302343]/75">
                              {item.detail}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5">
                            {item.keys.map((keyLabel, idx) => (
                              <span
                                key={`${item.action}-${keyLabel}`}
                                className="inline-flex items-center gap-1.5"
                              >
                                {idx > 0 && item.keys[0] !== "←" && (
                                  <span
                                    aria-hidden="true"
                                    className="text-xs font-medium text-[#7041B5]"
                                  >
                                    +
                                  </span>
                                )}
                                <kbd className="inline-flex min-w-[2rem] items-center justify-center rounded-lg border border-[#D8C4FF] bg-[#F8F5FF] px-2.5 py-1 font-mono text-xs font-semibold text-[#38205F] shadow-[0_2px_0_0_#D8C4FF]">
                                  {keyLabel}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>

            {/* Footer Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DCFF] bg-[#F8F5FF] px-6 py-4 sm:px-7">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#302343]/80">
                <span>
                  Active dataset:{" "}
                  <strong className="font-semibold text-[#38205F]">
                    {dataset.code} ({dataset.name})
                  </strong>
                </span>
                <span aria-hidden="true" className="text-[#9061D8]">
                  ·
                </span>
                <button
                  type="button"
                  onClick={onCycleDialect}
                  className="font-semibold text-[#7041B5] underline decoration-[#D8C4FF] underline-offset-4 transition-colors hover:text-[#38205F]"
                >
                  Toggle dataset now
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-gradient-primary rounded-xl px-5 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
