import { SIGN_DATASETS, type SignDialect } from "../data/signbridgeData";
import { DownloadZipButton } from "./DownloadZipButton";

interface FooterProps {
  dialect: SignDialect;
  onOpenShortcuts: () => void;
}

export function Footer({ dialect, onOpenShortcuts }: FooterProps) {
  const dataset = SIGN_DATASETS[dialect];

  return (
    <footer className="bg-[#38205F] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 font-[Poppins] text-xl font-bold tracking-tight text-white"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#D8C4FF] to-[#9061D8] text-[#38205F]"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V6a2 2 0 0 0-4 0v4" />
                  <path d="M14 10V4a2 2 0 0 0-4 0v6" />
                  <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </span>
              <span>SignBridge</span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#E8DCFF]/90">
              AI-powered bidirectional sign language translation built alongside Deaf linguists
              to support natural, private communication across every room.
            </p>
          </div>

          {/* Navigation Mirror */}
          <div className="md:col-span-3">
            <h3 className="font-[Poppins] text-sm font-semibold text-[#D8C4FF]">Platform</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/85">
              <li>
                <a href="#about" className="transition-colors hover:text-[#D8C4FF]">
                  About SignBridge
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-[#D8C4FF]">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-[#D8C4FF]">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#live-demo" className="transition-colors hover:text-[#D8C4FF]">
                  Interactive Live Demo
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-[Poppins] text-sm font-semibold text-[#D8C4FF]">
              Research &amp; Accessibility
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/85">
              <li>
                <a href="#technology" className="transition-colors hover:text-[#D8C4FF]">
                  Spatial Vision Architecture
                </a>
              </li>
              <li>
                <a href="#impact" className="transition-colors hover:text-[#D8C4FF]">
                  Community Impact
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-[#D8C4FF]">
                  Partner &amp; Pilot Inquiries
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShortcuts}
                  className="transition-colors hover:text-[#D8C4FF]"
                >
                  Keyboard Shortcuts (?)
                </button>
              </li>
              <li className="pt-1">
                <DownloadZipButton variant="footer" />
              </li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-[#D8C4FF]/90">
              Designed for WCAG 2.2 AA readability, keyboard navigation, and reduced-motion comfort.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-xs text-[#E8DCFF]/80 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SignBridge Accessibility Technologies. All rights reserved.</p>
          <p>
            Active Dataset: {dataset.name} ({dataset.code}) · ASL · BSL · ISL
          </p>
        </div>
      </div>
    </footer>
  );
}
