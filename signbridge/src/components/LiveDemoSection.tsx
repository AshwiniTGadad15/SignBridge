import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "motion/react";
import {
  SAMPLE_GESTURES,
  SAMPLE_PHRASES,
  SIGN_DATASETS,
  type SignDialect,
} from "../data/signbridgeData";
import { SignVisualStage } from "./SignVisualStage";

type DemoMode = "text-to-sign" | "sign-to-speech";
type Dialect = SignDialect;

interface LiveDemoSectionProps {
  dialect: SignDialect;
  onDialectChange: (dialect: SignDialect) => void;
  onOpenShortcuts: () => void;
  onHotkeyFeedback: (message: string) => void;
}

interface SignStep {
  gloss: string;
  spokenMeaning: string;
  handshape: string;
  palmOrientation: string;
  location: string;
  movement: string;
  visualArchetype: string;
}

interface TranslateResult {
  dialect: string;
  glossSequence: string;
  nonManualMarkers: string;
  grammarNote: string;
  steps: SignStep[];
}

interface RecognizeResult {
  handDetected: boolean;
  detectedGloss: string;
  spokenTranslation: string;
  confidenceLabel: string;
  handshapeBreakdown: string;
  orientationNote: string;
  suggestedReply: string;
}

function buildDatasetTranslation(code: SignDialect): TranslateResult {
  const ds = SIGN_DATASETS[code];
  return {
    dialect: ds.code,
    glossSequence: ds.defaultGloss,
    nonManualMarkers: ds.defaultNonManual,
    grammarNote: ds.defaultGrammarNote,
    steps: ds.defaultSteps,
  };
}

function selectDialectVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: string
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const normalizedTarget = targetLang.replace("_", "-").toLowerCase();
  const baseLang = normalizedTarget.split("-")[0];

  const exactMatch = voices.find(
    (v) => v.lang.replace("_", "-").toLowerCase() === normalizedTarget
  );
  if (exactMatch) return exactMatch;

  const prefixMatch = voices.find((v) =>
    v.lang.replace("_", "-").toLowerCase().startsWith(`${normalizedTarget}-`)
  );
  if (prefixMatch) return prefixMatch;

  return (
    voices.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(baseLang)) ??
    null
  );
}

interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function LiveDemoSection({
  dialect,
  onDialectChange,
  onOpenShortcuts,
  onHotkeyFeedback,
}: LiveDemoSectionProps) {
  const [mode, setMode] = useState<DemoMode>("text-to-sign");

  // Text-to-sign state
  const [inputText, setInputText] = useState(SIGN_DATASETS[dialect].defaultPhrase);
  const [translation, setTranslation] = useState<TranslateResult>(() =>
    buildDatasetTranslation(dialect)
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlayingSteps, setIsPlayingSteps] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const speechRecRef = useRef<BrowserSpeechRecognition | null>(null);
  const prevDialectRef = useRef<SignDialect>(dialect);

  // Sync default dataset phrase & gloss preview when global dialect changes from Navbar or tabs
  useEffect(() => {
    if (prevDialectRef.current === dialect) return;
    const previousDefaultPhrase = SIGN_DATASETS[prevDialectRef.current].defaultPhrase;
    prevDialectRef.current = dialect;
    setIsPlayingSteps(false);
    setActiveStepIndex(0);
    setTranslateError(null);
    setTranslation(buildDatasetTranslation(dialect));
    if (inputText.trim() === previousDefaultPhrase || inputText.trim() === "") {
      setInputText(SIGN_DATASETS[dialect].defaultPhrase);
    }
  }, [dialect, inputText]);

  // Camera / Sign-to-speech state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizeError, setRecognizeError] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognizeResult | null>(null);

  // Dialect-aware Web Speech synthesis state
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
    };
  }, []);

  // Stop any active audio playback when dialect changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeechNotice(null);
  }, [dialect]);

  // Step auto-playback timer
  useEffect(() => {
    if (!isPlayingSteps || translation.steps.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % translation.steps.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlayingSteps, translation.steps.length]);

  // Listen for global keyboard hotkey commands dispatched from App.tsx
  const translatedSpokenSummary = translation.steps
    .map((step) => step.spokenMeaning.trim())
    .filter(Boolean)
    .join(", ");

  const hotkeyStateRef = useRef({
    mode,
    cameraActive,
    isRecognizing,
    isPlayingSteps,
    isSpeaking,
    dialect,
    stepsLength: translation.steps.length,
    translatedText: translatedSpokenSummary || inputText,
    spokenTranslation: recognitionResult?.spokenTranslation ?? "",
  });

  hotkeyStateRef.current = {
    mode,
    cameraActive,
    isRecognizing,
    isPlayingSteps,
    isSpeaking,
    dialect,
    stepsLength: translation.steps.length,
    translatedText: translatedSpokenSummary || inputText,
    spokenTranslation: recognitionResult?.spokenTranslation ?? "",
  };

  useEffect(() => {
    const onHotkey = (event: Event) => {
      const action = (event as CustomEvent<string>).detail;
      const state = hotkeyStateRef.current;

      if (action === "toggle-translation") {
        if (state.mode === "sign-to-speech" && state.cameraActive) {
          if (!state.isRecognizing) {
            captureFromCameraAndAnalyze();
            onHotkeyFeedback("Space · Capturing camera frame for sign recognition");
          }
        } else {
          setIsPlayingSteps((prev) => {
            const next = !prev;
            onHotkeyFeedback(
              next
                ? "Space · Sign sequence playback started"
                : "Space · Sign sequence playback paused"
            );
            return next;
          });
        }
      } else if (action === "step-prev") {
        setIsPlayingSteps(false);
        setActiveStepIndex((prev) =>
          prev === 0 ? Math.max(0, state.stepsLength - 1) : prev - 1
        );
      } else if (action === "step-next") {
        setIsPlayingSteps(false);
        setActiveStepIndex((prev) =>
          state.stepsLength > 0 ? (prev + 1) % state.stepsLength : 0
        );
      } else if (action === "restart") {
        setIsPlayingSteps(false);
        setActiveStepIndex(0);
        onHotkeyFeedback("R · Restarted sign sequence from step 1");
      } else if (action === "toggle-mode") {
        const nextMode: DemoMode =
          state.mode === "text-to-sign" ? "sign-to-speech" : "text-to-sign";
        handleModeChange(nextMode);
        onHotkeyFeedback(
          nextMode === "sign-to-speech"
            ? "Ctrl+M · Switched to Camera & Photo to Speech"
            : "Ctrl+M · Switched to Text & Voice to Sign"
        );
      } else if (action === "speak") {
        const phraseToSpeak =
          state.mode === "sign-to-speech" && state.spokenTranslation
            ? state.spokenTranslation
            : state.translatedText;
        if (state.isSpeaking) {
          stopSpeaking();
          onHotkeyFeedback("V · Stopped audio playback");
        } else if (phraseToSpeak.trim()) {
          const ds = SIGN_DATASETS[state.dialect];
          speakText(phraseToSpeak, state.dialect);
          onHotkeyFeedback(`V · Listening in ${ds.speechLocaleLabel} (${ds.code})`);
        }
      }
    };

    window.addEventListener("signbridge:hotkey", onHotkey);
    return () => window.removeEventListener("signbridge:hotkey", onHotkey);
  }, [onHotkeyFeedback]);

  // Clean up camera stream, recognition, and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (speechRecRef.current) {
        speechRecRef.current.stop();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleModeChange = (nextMode: DemoMode) => {
    if (nextMode !== "sign-to-speech") {
      stopCamera();
    }
    setMode(nextMode);
  };

  const handleTranslate = async (overrideText?: string, overrideDialect?: Dialect) => {
    const textToSend = (overrideText ?? inputText).trim();
    const dialectToSend = overrideDialect ?? dialect;
    if (!textToSend) {
      setTranslateError("Enter a spoken sentence above to generate its sign language guide.");
      return;
    }

    setTranslateError(null);
    setIsTranslating(true);
    setIsPlayingSteps(false);

    try {
      const response = await fetch("/api/translate-to-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend, dialect: dialectToSend }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to translate this phrase right now.");
      }

      if (!Array.isArray(data.steps) || data.steps.length === 0) {
        throw new Error("The translation returned no gesture steps. Please try rephrasing.");
      }

      setTranslation(data as TranslateResult);
      setActiveStepIndex(0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Translation request failed.";
      setTranslateError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleVoiceDictation = () => {
    const speechWindow = window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const RecognitionCtor =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setTranslateError(
        "Voice dictation is not supported in this browser. Type a sentence or select a sample phrase below."
      );
      return;
    }

    if (isListening && speechRecRef.current) {
      speechRecRef.current.stop();
      setIsListening(false);
      return;
    }

    setTranslateError(null);
    const recognition = new RecognitionCtor();
    recognition.lang = SIGN_DATASETS[dialect].speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = event.results?.[0]?.[0]?.transcript;
      if (spoken) {
        setInputText(spoken);
      }
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    speechRecRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const speakText = (text: string, targetDialect: SignDialect = dialect) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechNotice(
        "Audio synthesis is not supported in this browser. Try Chrome, Safari, or Edge."
      );
      return;
    }

    setSpeechNotice(null);
    window.speechSynthesis.cancel();

    const dataset = SIGN_DATASETS[targetDialect];
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = dataset.speechLang;
    utterance.rate = 0.96;

    const voices =
      availableVoices.length > 0
        ? availableVoices
        : window.speechSynthesis.getVoices();
    const matchedVoice = selectDialectVoice(voices, dataset.speechLang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleListen = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text, dialect);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setRecognizeError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is unavailable in this browser environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setPreviewImage(null);
      setCameraActive(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      }, 60);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Camera permission was denied. You can upload a hand photo or analyze a sample gesture below.";
      setCameraError(msg);
      setCameraActive(false);
    }
  };

  const analyzeBase64Image = async (dataUrl: string, mimeType = "image/jpeg") => {
    setRecognizeError(null);
    setIsRecognizing(true);
    try {
      const response = await fetch("/api/recognize-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: dataUrl,
          mimeType,
          dialect,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not analyze gesture frame.");
      }
      setRecognitionResult(data as RecognizeResult);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gesture analysis failed.";
      setRecognizeError(msg);
    } finally {
      setIsRecognizing(false);
    }
  };

  const captureFromCameraAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreviewImage(dataUrl);
    await analyzeBase64Image(dataUrl, "image/jpeg");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    stopCamera();
    setCameraError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (dataUrl) {
        setPreviewImage(dataUrl);
        await analyzeBase64Image(dataUrl, file.type || "image/jpeg");
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeSampleGesture = async (imageSrc: string) => {
    stopCamera();
    setCameraError(null);
    setRecognizeError(null);
    setPreviewImage(imageSrc);

    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          await analyzeBase64Image(reader.result, blob.type || "image/jpeg");
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setRecognizeError("Could not load sample gesture frame for analysis.");
    }
  };

  const currentStep = translation.steps[activeStepIndex] ?? translation.steps[0];

  return (
    <section id="live-demo" className="bg-[#F8F5FF] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold text-[#7041B5]">Interactive Live Demo</p>
            <h2 className="mt-2 font-[Poppins] text-3xl font-bold tracking-tight text-[#38205F] [text-wrap:balance] sm:text-4xl">
              Experience bidirectional{" "}
              <span className="text-gradient-violet">sign translation right now.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#302343]/80">
              Convert spoken sentences into structured sign gloss and handshape guidance, or
              analyze a hand gesture from your camera or photo upload.
            </p>
          </motion.div>

          {/* Dialect Selector (Lavender Segmented Control) */}
          <div
            role="group"
            aria-label="Sign language dialect selector"
            className="inline-flex items-center gap-1 self-start rounded-2xl border border-[#D8C4FF] bg-[#F0E9FF] p-1.5 md:self-auto"
          >
            {(["ASL", "BSL", "ISL"] as Dialect[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onDialectChange(code)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                  dialect === code
                    ? "bg-white text-[#38205F] shadow-sm"
                    : "text-[#7041B5] hover:text-[#38205F]"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Main Clean White Interface Container */}
        <div className="mt-10 overflow-hidden rounded-[30px] border border-[#D8C4FF]/85 bg-white shadow-[0_20px_60px_-24px_rgba(112,65,181,0.22)]">
          {/* Top Lavender Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DCFF] bg-[#F8F5FF]/90 px-5 py-4 sm:px-8">
            <div
              role="tablist"
              aria-label="Translation mode"
              className="inline-flex rounded-2xl bg-[#F0E9FF] p-1 border border-[#D8C4FF]/60"
            >
              <button
                role="tab"
                type="button"
                aria-selected={mode === "text-to-sign"}
                onClick={() => handleModeChange("text-to-sign")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                  mode === "text-to-sign"
                    ? "bg-gradient-to-r from-[#9061D8] to-[#7041B5] text-white shadow-sm"
                    : "text-[#38205F]/80 hover:text-[#38205F]"
                }`}
              >
                Text &amp; Voice to Sign
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={mode === "sign-to-speech"}
                onClick={() => handleModeChange("sign-to-speech")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                  mode === "sign-to-speech"
                    ? "bg-gradient-to-r from-[#9061D8] to-[#7041B5] text-white shadow-sm"
                    : "text-[#38205F]/80 hover:text-[#38205F]"
                }`}
              >
                Camera &amp; Photo to Speech
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-medium text-[#7041B5]">
                Active dataset: {SIGN_DATASETS[dialect].name} ({dialect})
              </p>
              <button
                type="button"
                onClick={onOpenShortcuts}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8C4FF] bg-white px-3 py-1.5 text-xs font-semibold text-[#38205F] transition-colors hover:bg-[#F0E9FF] whitespace-nowrap shrink-0"
              >
                <Keyboard className="h-3.5 w-3.5 text-[#7041B5]" aria-hidden="true" />
                <span>Shortcuts</span>
                <kbd className="ml-0.5 rounded bg-[#F0E9FF] px-1.5 py-0.5 font-mono text-[10px] text-[#7041B5]">
                  ?
                </kbd>
              </button>
            </div>
          </div>

          {/* MODE 1: Text & Voice to Sign */}
          {mode === "text-to-sign" ? (
            <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12">
              {/* Input Column */}
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <label
                    htmlFor="signbridge-phrase-input"
                    className="block text-sm font-semibold text-[#38205F]"
                  >
                    Spoken or written English phrase
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="signbridge-phrase-input"
                      rows={4}
                      maxLength={260}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a greeting, clinical instruction, or classroom question..."
                      className="w-full resize-none rounded-2xl border border-[#D8C4FF] bg-[#F8F5FF]/70 px-4 py-3.5 text-sm leading-relaxed text-[#302343] placeholder:text-[#302343]/45 focus:border-[#9061D8] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Lavender Controls & Purple Primary Action */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={isTranslating}
                      onClick={() => handleTranslate()}
                      className="btn-gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-65 whitespace-nowrap shrink-0"
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Translating...</span>
                        </>
                      ) : (
                        <span>Translate to {dialect}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleVoiceDictation}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isListening
                          ? "border-[#7041B5] bg-[#E8DCFF] text-[#38205F]"
                          : "border-[#D8C4FF] bg-[#F0E9FF] text-[#38205F] hover:bg-[#E8DCFF]"
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                          <span>Stop Listening</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                          <span>Dictate</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleListen(translatedSpokenSummary || inputText)}
                      aria-pressed={isSpeaking}
                      aria-label={
                        isSpeaking
                          ? "Stop audio playback"
                          : `Listen to translated text in ${SIGN_DATASETS[dialect].speechLocaleLabel}`
                      }
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isSpeaking
                          ? "border-[#7041B5] bg-[#E8DCFF] text-[#38205F]"
                          : "border-[#D8C4FF] bg-[#F8F5FF] text-[#7041B5] hover:bg-[#F0E9FF]"
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>

                  {speechNotice && (
                    <p role="status" className="mt-2.5 text-xs font-medium text-[#7041B5]">
                      {speechNotice}
                    </p>
                  )}

                  {translateError && (
                    <div
                      role="alert"
                      className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#9061D8]/40 bg-[#F0E9FF] p-3.5 text-sm text-[#38205F]"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#7041B5]" aria-hidden="true" />
                      <span>{translateError}</span>
                    </div>
                  )}

                  {/* Quick Everyday Scenarios */}
                  <div className="mt-7 border-t border-[#E8DCFF] pt-5">
                    <p className="text-xs font-semibold text-[#7041B5]">
                      Try a real-world scenario
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {SAMPLE_PHRASES.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => {
                            setInputText(sample.text);
                            onDialectChange(sample.dialect);
                            handleTranslate(sample.text, sample.dialect);
                          }}
                          className="rounded-xl border border-[#E8DCFF] bg-[#F8F5FF] px-3.5 py-2.5 text-left transition-colors hover:border-[#9061D8]/70 hover:bg-[#F0E9FF]"
                        >
                          <p className="text-xs font-semibold text-[#38205F]">
                            {sample.label} · {sample.dialect}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#302343]/75">
                            {sample.text}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Linguistic Grammar & Non-Manual Note */}
                <div className="mt-6 rounded-2xl border border-[#E8DCFF] bg-[#F8F5FF] p-4">
                  <p className="text-xs font-semibold text-[#7041B5]">
                    Non-manual expression &amp; syntax ({translation.dialect})
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#302343]/85">
                    {translation.nonManualMarkers}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#302343]/70">
                    {translation.grammarNote}
                  </p>
                </div>
              </div>

              {/* Output & Visual Gesture Sequencer Column */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#E8DCFF] bg-[#F8F5FF]/55 p-5 sm:p-6 lg:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DCFF] pb-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#7041B5]">
                        Sign Language Gloss Sequence · {SIGN_DATASETS[dialect].speechLocaleLabel}
                      </p>
                      <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-[#38205F]">
                        {translation.glossSequence}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleListen(translatedSpokenSummary || inputText)
                        }
                        aria-pressed={isSpeaking}
                        aria-label={
                          isSpeaking
                            ? "Stop audio playback"
                            : `Listen to translated text in ${SIGN_DATASETS[dialect].speechLocaleLabel}`
                        }
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                          isSpeaking
                            ? "border-[#7041B5] bg-gradient-to-r from-[#9061D8] to-[#7041B5] text-white shadow-sm"
                            : "border-[#D8C4FF] bg-white text-[#38205F] hover:border-[#9061D8] hover:bg-[#F0E9FF]"
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5 text-[#7041B5]" aria-hidden="true" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                      <span className="font-mono text-xs text-[#7041B5] tabular-nums">
                        Step {activeStepIndex + 1} of {translation.steps.length}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Gloss Token Selector */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {translation.steps.map((step, idx) => (
                      <button
                        key={`${step.gloss}-${idx}`}
                        type="button"
                        onClick={() => {
                          setIsPlayingSteps(false);
                          setActiveStepIndex(idx);
                        }}
                        className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                          idx === activeStepIndex
                            ? "bg-gradient-to-r from-[#9061D8] to-[#7041B5] text-white shadow-sm"
                            : "border border-[#D8C4FF] bg-white text-[#38205F] hover:border-[#9061D8]"
                        }`}
                      >
                        {idx + 1}. {step.gloss}
                      </button>
                    ))}
                  </div>

                  {/* Visual Hand Gesture Stage + Anatomical Breakdown */}
                  {currentStep && (
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-12">
                      <div className="sm:col-span-6">
                        <SignVisualStage
                          archetype={currentStep.visualArchetype}
                          gloss={currentStep.gloss}
                          handshape={currentStep.handshape}
                          movement={currentStep.movement}
                        />
                      </div>

                      <div className="flex flex-col justify-center space-y-3.5 rounded-2xl border border-[#E8DCFF] bg-white p-5 sm:col-span-6">
                        <div>
                          <p className="text-xs font-medium text-[#7041B5]">Spoken meaning</p>
                          <p className="mt-0.5 font-[Poppins] text-lg font-semibold text-[#38205F]">
                            {currentStep.spokenMeaning}
                          </p>
                        </div>
                        <dl className="space-y-2.5 border-t border-[#F0E9FF] pt-3 text-xs">
                          <div>
                            <dt className="font-semibold text-[#7041B5]">Handshape</dt>
                            <dd className="mt-0.5 text-[#302343]/85">{currentStep.handshape}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[#7041B5]">Palm orientation</dt>
                            <dd className="mt-0.5 text-[#302343]/85">
                              {currentStep.palmOrientation}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[#7041B5]">Signing location</dt>
                            <dd className="mt-0.5 text-[#302343]/85">{currentStep.location}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lavender Playback Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DCFF] pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlayingSteps(false);
                        setActiveStepIndex((prev) =>
                          prev === 0 ? translation.steps.length - 1 : prev - 1
                        );
                      }}
                      aria-label="Previous sign step"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8C4FF] bg-white text-[#38205F] transition-colors hover:bg-[#F0E9FF]"
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPlayingSteps((prev) => !prev)}
                      className="btn-gradient-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      {isPlayingSteps ? (
                        <>
                          <Pause className="h-4 w-4" aria-hidden="true" />
                          <span>Pause Sequence</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" aria-hidden="true" />
                          <span>Play Sequence</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPlayingSteps(false);
                        setActiveStepIndex((prev) => (prev + 1) % translation.steps.length);
                      }}
                      aria-label="Next sign step"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8C4FF] bg-white text-[#38205F] transition-colors hover:bg-[#F0E9FF]"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingSteps(false);
                      setActiveStepIndex(0);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#7041B5] transition-colors hover:bg-[#F0E9FF] whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: Camera & Photo to Speech */
            <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-6">
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl border border-[#D8C4FF] bg-gradient-to-br from-[#F8F5FF] to-[#E8DCFF]/75">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                  ) : previewImage ? (
                    <img
                      src={previewImage}
                      alt="Captured hand gesture ready for AI analysis"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="max-w-sm px-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9061D8] to-[#7041B5] text-white shadow-md">
                        <Camera className="h-7 w-7" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 font-[Poppins] text-lg font-semibold text-[#38205F]">
                        Ready for gesture capture
                      </h3>
                      <p className="mt-1.5 text-sm text-[#302343]/75">
                        Enable your webcam, upload a hand gesture photo, or test with a
                        sculptural reference frame below.
                      </p>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Camera / Upload Controls */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="btn-gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      <Camera className="h-4 w-4" aria-hidden="true" />
                      <span>Start Camera</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={isRecognizing}
                        onClick={captureFromCameraAndAnalyze}
                        className="btn-gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-65 whitespace-nowrap shrink-0"
                      >
                        {isRecognizing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <span>Capture &amp; Recognize Sign</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={stopCamera}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#D8C4FF] bg-[#F0E9FF] px-4 py-2.5 text-sm font-semibold text-[#38205F] hover:bg-[#E8DCFF] whitespace-nowrap shrink-0"
                      >
                        <CameraOff className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                        <span>Stop Camera</span>
                      </button>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D8C4FF] bg-[#F0E9FF] px-4 py-2.5 text-sm font-semibold text-[#38205F] transition-colors hover:bg-[#E8DCFF] whitespace-nowrap shrink-0"
                  >
                    <Upload className="h-4 w-4 text-[#7041B5]" aria-hidden="true" />
                    <span>Upload Photo</span>
                  </button>
                </div>

                {cameraError && (
                  <p className="mt-3 text-xs text-[#7041B5]">{cameraError}</p>
                )}

                {/* Sample Reference Frames */}
                <div className="mt-6 border-t border-[#E8DCFF] pt-5">
                  <p className="text-xs font-semibold text-[#7041B5]">
                    No camera nearby? Test with a 3D reference gesture
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {SAMPLE_GESTURES.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        disabled={isRecognizing}
                        onClick={() => analyzeSampleGesture(card.imageSrc)}
                        className="flex items-center gap-3 rounded-2xl border border-[#E8DCFF] bg-[#F8F5FF] p-2.5 text-left transition-all hover:border-[#9061D8] hover:bg-[#F0E9FF] disabled:opacity-60"
                      >
                        <img
                          src={card.imageSrc}
                          alt={card.title}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#38205F]">
                            {card.title}
                          </p>
                          <p className="truncate text-[11px] text-[#7041B5]">Analyze frame</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recognition Result Panel */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#E8DCFF] bg-[#F8F5FF]/65 p-6 lg:col-span-6">
                {isRecognizing ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#7041B5]" aria-hidden="true" />
                    <p className="mt-4 font-[Poppins] text-base font-semibold text-[#38205F]">
                      Inspecting handshape and signing kinematics...
                    </p>
                    <p className="mt-1 text-xs text-[#302343]/70">
                      Evaluating finger geometry and {dialect} context
                    </p>
                  </div>
                ) : recognizeError ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-[#9061D8]/40 bg-white p-5 text-sm text-[#38205F]"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#7041B5]" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">Unable to complete gesture analysis</p>
                      <p className="mt-1 text-xs text-[#302343]/80">{recognizeError}</p>
                    </div>
                  </div>
                ) : recognitionResult ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[#E8DCFF] pb-4">
                      <span className="text-xs font-semibold text-[#7041B5]">
                        Detected {dialect} Interpretation · {recognitionResult.confidenceLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleListen(recognitionResult.spokenTranslation)
                        }
                        aria-pressed={isSpeaking}
                        aria-label={
                          isSpeaking
                            ? "Stop audio playback"
                            : `Listen to detected sign in ${SIGN_DATASETS[dialect].speechLocaleLabel}`
                        }
                        className="btn-gradient-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Listen ({SIGN_DATASETS[dialect].speechLang})</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-[#D8C4FF]/80 bg-white p-5">
                      <p className="font-mono text-xs font-semibold text-[#7041B5]">
                        GLOSS: {recognitionResult.detectedGloss}
                      </p>
                      <p className="mt-2 font-[Poppins] text-2xl font-bold text-[#38205F]">
                        “{recognitionResult.spokenTranslation}”
                      </p>
                    </div>

                    <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-[#E8DCFF] bg-white p-5 text-sm">
                      <div>
                        <dt className="text-xs font-semibold text-[#7041B5]">
                          Observed handshape
                        </dt>
                        <dd className="mt-1 text-[#302343]/85">
                          {recognitionResult.handshapeBreakdown}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-[#7041B5]">
                          Orientation &amp; framing
                        </dt>
                        <dd className="mt-1 text-[#302343]/85">
                          {recognitionResult.orientationNote}
                        </dd>
                      </div>
                      <div className="border-t border-[#F0E9FF] pt-3">
                        <dt className="text-xs font-semibold text-[#7041B5]">
                          Suggested conversational reply
                        </dt>
                        <dd className="mt-1 text-[#38205F] font-medium">
                          {recognitionResult.suggestedReply}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col justify-center py-8">
                    <p className="text-xs font-semibold text-[#7041B5]">Live Speech Output</p>
                    <h3 className="mt-2 font-[Poppins] text-2xl font-bold text-[#38205F]">
                      Gesture recognition ready
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#302343]/80">
                      Capture a hand gesture from your camera, upload a clear hand photo, or
                      click one of the sculptural 3D gesture frames on the left. SignBridge
                      identifies the handshape, translates it into natural English, and lets
                      you play spoken audio immediately.
                    </p>
                    <p className="mt-6 border-t border-[#E8DCFF] pt-4 text-xs text-[#7041B5]">
                      Tip: Keep hands centered within chest-to-shoulder framing against even lighting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
