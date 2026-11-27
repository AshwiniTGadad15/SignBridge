import { useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";

interface DownloadZipButtonProps {
  variant?: "navbar" | "footer" | "mobile";
}

export function DownloadZipButton({ variant = "navbar" }: DownloadZipButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleDownload = async () => {
    if (status === "loading") return;
    setStatus("loading");

    try {
      const response = await fetch("/api/download-zip", {
        method: "GET",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "signbridge-lavender-website.zip";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 4000);

      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3500);
    }
  };

  if (variant === "footer") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-xl border border-[#D8C4FF]/40 bg-white/10 px-3.5 py-2 text-xs font-semibold text-[#D8C4FF] transition-colors hover:bg-white/20 hover:text-white disabled:opacity-70 whitespace-nowrap"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            <span>Packaging ZIP...</span>
          </>
        ) : status === "done" ? (
          <>
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>ZIP Downloaded</span>
          </>
        ) : status === "error" ? (
          <span>Download blocked — use AI Studio Download icon</span>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download Source (.zip)</span>
          </>
        )}
      </button>
    );
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "loading"}
        className="flex items-center justify-between rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] px-3.5 py-2.5 text-sm font-semibold text-[#38205F] transition-colors hover:bg-[#F0E9FF] disabled:opacity-70"
      >
        <span className="inline-flex items-center gap-2">
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#7041B5]" aria-hidden="true" />
          ) : status === "done" ? (
            <Check className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
          )}
          <span>
            {status === "loading"
              ? "Packaging ZIP..."
              : status === "done"
              ? "ZIP Downloaded"
              : status === "error"
              ? "Use AI Studio Download"
              : "Download Project (.zip)"}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status === "loading"}
      title="Download SignBridge project as a ZIP folder"
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8C4FF] bg-[#F8F5FF] px-3.5 py-2 text-sm font-semibold text-[#38205F] transition-colors duration-150 hover:border-[#9061D8] hover:bg-[#F0E9FF] disabled:opacity-70 whitespace-nowrap shrink-0"
    >
      {status === "loading" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-[#7041B5]" aria-hidden="true" />
          <span>Packaging...</span>
        </>
      ) : status === "done" ? (
        <>
          <Check className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
          <span>Saved .zip</span>
        </>
      ) : status === "error" ? (
        <span className="text-xs text-[#7041B5]">Retry ZIP</span>
      ) : (
        <>
          <Download className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
          <span>Download ZIP</span>
        </>
      )}
    </button>
  );
}
