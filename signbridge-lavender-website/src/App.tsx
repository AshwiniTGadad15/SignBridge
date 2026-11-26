import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ImpactSection } from "./components/ImpactSection";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { LiveDemoSection } from "./components/LiveDemoSection";
import { Navbar } from "./components/Navbar";
import { TechnologySection } from "./components/TechnologySection";
import { SIGN_DATASETS, type SignDialect } from "./data/signbridgeData";

const STORAGE_KEY = "signbridge_dialect";
const DIALECT_ORDER: SignDialect[] = ["ASL", "BSL", "ISL"];

function readInitialDialect(): SignDialect {
  if (typeof window === "undefined") return "ASL";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ASL" || saved === "BSL" || saved === "ISL") {
      return saved;
    }
  } catch {
    // Ignore storage restrictions
  }
  return "ASL";
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function App() {
  const [dialect, setDialect] = useState<SignDialect>(readInitialDialect);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showHotkeyToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  const cycleDialect = useCallback(() => {
    setDialect((prev) => {
      const next = DIALECT_ORDER[(DIALECT_ORDER.indexOf(prev) + 1) % DIALECT_ORDER.length];
      const ds = SIGN_DATASETS[next];
      showHotkeyToast(`Ctrl+D · Switched dataset to ${ds.code} (${ds.name})`);
      return next;
    });
  }, [showHotkeyToast]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, dialect);
    } catch {
      // Ignore storage restrictions
    }
  }, [dialect]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const editable = isEditableElement(event.target);

      // Escape always closes the shortcuts modal
      if (event.key === "Escape" && shortcutsOpen) {
        event.preventDefault();
        setShortcutsOpen(false);
        return;
      }

      // Ctrl+D (or Cmd+D) toggles sign language dialect anywhere
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        cycleDialect();
        return;
      }

      // Ctrl+/ toggles shortcuts modal
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // Ctrl+M switches Live Demo mode
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "m") {
        event.preventDefault();
        window.dispatchEvent(
          new CustomEvent("signbridge:hotkey", { detail: "toggle-mode" })
        );
        return;
      }

      // Ignore single-key shortcuts while typing inside form inputs or when modal is open
      if (editable) return;

      if (event.key === "?" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      if (shortcutsOpen) return;

      // Avoid hijacking Space when user has focused a button or link
      const isInteractiveFocus =
        event.target instanceof HTMLElement &&
        (event.target.tagName === "BUTTON" || event.target.tagName === "A");

      if (event.code === "Space" && !isInteractiveFocus && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        window.dispatchEvent(
          new CustomEvent("signbridge:hotkey", { detail: "toggle-translation" })
        );
        return;
      }

      if (event.key === "ArrowLeft" && !event.altKey && !event.metaKey) {
        window.dispatchEvent(
          new CustomEvent("signbridge:hotkey", { detail: "step-prev" })
        );
        return;
      }

      if (event.key === "ArrowRight" && !event.altKey && !event.metaKey) {
        window.dispatchEvent(
          new CustomEvent("signbridge:hotkey", { detail: "step-next" })
        );
        return;
      }

      if (
        event.key.toLowerCase() === "r" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        window.dispatchEvent(
          new CustomEvent("signbridge:hotkey", { detail: "restart" })
        );
        return;
      }

      if (
        event.key.toLowerCase() === "v" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        window.dispatchEvent(
          new CustomEvent("signbridge:hotkey", { detail: "speak" })
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleDialect, shortcutsOpen]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F8F5FF] text-[#302343]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[#38205F] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        <Navbar
          dialect={dialect}
          onDialectChange={setDialect}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />

        <main id="main-content">
          <HeroSection dialect={dialect} />
          <AboutSection />
          <FeaturesSection />
          <HowItWorksSection />
          <LiveDemoSection
            dialect={dialect}
            onDialectChange={setDialect}
            onOpenShortcuts={() => setShortcutsOpen(true)}
            onHotkeyFeedback={showHotkeyToast}
          />
          <TechnologySection />
          <ImpactSection />
          <ContactSection />
        </main>

        <Footer
          dialect={dialect}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />

        <KeyboardShortcutsModal
          open={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
          dialect={dialect}
          onCycleDialect={cycleDialect}
        />

        {/* Accessible live feedback toast for keyboard shortcut actions */}
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-5 right-5 z-[60] max-w-sm"
        >
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-[#D8C4FF] bg-[#38205F] px-4 py-3 text-xs font-medium text-white shadow-[0_14px_34px_-10px_rgba(56,32,95,0.45)]"
              >
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
