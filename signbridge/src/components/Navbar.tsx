import { useState } from "react";
import { Keyboard, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { SignDialect } from "../data/signbridgeData";
import { DownloadZipButton } from "./DownloadZipButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Live Demo", href: "#live-demo" },
  { label: "Impact", href: "#impact" },
];

interface NavbarProps {
  dialect: SignDialect;
  onDialectChange: (dialect: SignDialect) => void;
  onOpenShortcuts: () => void;
}

export function Navbar({
  dialect,
  onDialectChange,
  onOpenShortcuts,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lavender-nav border-b border-[#E8DCFF]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 font-[Poppins] text-xl font-bold tracking-tight text-[#38205F] whitespace-nowrap shrink-0"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-4 0v4" />
              <path d="M14 10V4a2 2 0 0 0-4 0v6" />
              <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </span>
          <span>SignBridge</span>
        </a>

        {/* Zone 2: 5 Concise Single-Line Nav Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 text-sm font-medium text-[#302343]/85 transition-colors duration-150 hover:text-[#7041B5] whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-[#9061D8] after:to-[#7041B5] after:transition-all after:duration-200 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Dataset Switcher, Shortcuts Trigger & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenShortcuts}
            aria-label="Open keyboard shortcuts guide"
            title="Keyboard shortcuts (?)"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] text-[#7041B5] transition-colors duration-150 hover:border-[#9061D8] hover:bg-[#F0E9FF] hover:text-[#38205F] shrink-0"
          >
            <Keyboard className="h-4.5 w-4.5" aria-hidden="true" />
          </button>

          <div className="hidden sm:block">
            <LanguageSwitcher
              dialect={dialect}
              onChange={onDialectChange}
              variant="navbar"
            />
          </div>

          <div className="hidden md:block">
            <DownloadZipButton variant="navbar" />
          </div>

          <a
            href="#contact"
            className="btn-gradient-primary hidden xl:inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0"
          >
            Partner With Us
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] text-[#38205F] transition-colors hover:bg-[#F0E9FF] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            aria-label="Mobile navigation"
            className="border-t border-[#E8DCFF] bg-white px-4 pb-5 pt-3 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-2">
              <LanguageSwitcher
                dialect={dialect}
                onChange={onDialectChange}
                variant="mobile"
              />
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenShortcuts();
                }}
                className="flex items-center justify-between rounded-xl border border-[#E8DCFF] bg-[#F8F5FF] px-3.5 py-2.5 text-sm font-semibold text-[#38205F] transition-colors hover:bg-[#F0E9FF]"
              >
                <span className="inline-flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                  <span>Keyboard Shortcuts</span>
                </span>
                <kbd className="rounded-md border border-[#D8C4FF] bg-white px-2 py-0.5 font-mono text-xs text-[#7041B5]">
                  ?
                </kbd>
              </button>
              <DownloadZipButton variant="mobile" />
              <div className="mt-1 flex flex-col gap-1">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3.5 py-2.5 text-base font-medium text-[#302343] transition-colors hover:bg-[#F8F5FF] hover:text-[#7041B5]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="btn-gradient-primary mt-1 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                Partner With Us
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
