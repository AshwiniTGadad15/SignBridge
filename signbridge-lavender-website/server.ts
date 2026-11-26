import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "8mb" }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const ALLOWED_DIALECTS = new Set(["ASL", "BSL", "ISL"]);

app.post("/api/translate-to-sign", async (req, res) => {
  try {
    const rawText = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    const rawDialect = typeof req.body?.dialect === "string" ? req.body.dialect.toUpperCase() : "ASL";
    const dialect = ALLOWED_DIALECTS.has(rawDialect) ? rawDialect : "ASL";

    if (!rawText) {
      return res.status(400).json({ error: "Please enter a phrase to translate into sign language." });
    }
    if (rawText.length > 260) {
      return res.status(400).json({ error: "Please keep phrases under 260 characters for live sign synthesis." });
    }

    const ai = getGeminiClient();

    const dialectName =
      dialect === "BSL"
        ? "British Sign Language (BSL)"
        : dialect === "ISL"
        ? "Indian Sign Language (ISL)"
        : "American Sign Language (ASL)";

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: `Translate the following English sentence into ${dialectName}: "${rawText}"`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          "You are an expert sign language linguist specializing in ASL, BSL, and ISL. Convert spoken English into accurate Sign Language Gloss following authentic topic-comment syntax, non-manual markers (eyebrows, head tilt, facial expression), and clear step-by-step physical execution instructions for each sign. Keep descriptions concise, accurate, and respectful of Deaf linguistics. For each step, pick one visualArchetype strictly from: open_palm, point_index, pinch_connect, curved_cup, two_hand_bridge, fingerspell, chest_heart, chin_forward.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dialect: { type: Type.STRING },
            glossSequence: {
              type: Type.STRING,
              description: "Uppercase linguistic gloss sequence in authentic sign grammar order.",
            },
            nonManualMarkers: {
              type: Type.STRING,
              description: "Facial expression, eyebrow position, mouth morpheme, and head posture cues.",
            },
            grammarNote: {
              type: Type.STRING,
              description: "One concise sentence explaining how the sign grammar structures this thought.",
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  gloss: { type: Type.STRING },
                  spokenMeaning: { type: Type.STRING },
                  handshape: { type: Type.STRING },
                  palmOrientation: { type: Type.STRING },
                  location: { type: Type.STRING },
                  movement: { type: Type.STRING },
                  visualArchetype: { type: Type.STRING },
                },
                required: [
                  "gloss",
                  "spokenMeaning",
                  "handshape",
                  "palmOrientation",
                  "location",
                  "movement",
                  "visualArchetype",
                ],
              },
            },
          },
          required: ["dialect", "glossSequence", "nonManualMarkers", "grammarNote", "steps"],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? "{}").trim());
    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to complete sign translation.";
    console.error("[translate-to-sign] error:", message);
    return res.status(500).json({ error: message });
  }
});

app.post("/api/recognize-sign", async (req, res) => {
  try {
    const imageBase64 = typeof req.body?.imageBase64 === "string" ? req.body.imageBase64 : "";
    const rawMime = typeof req.body?.mimeType === "string" ? req.body.mimeType : "image/jpeg";
    const mimeType = ["image/jpeg", "image/png", "image/webp"].includes(rawMime)
      ? rawMime
      : "image/jpeg";
    const rawDialect = typeof req.body?.dialect === "string" ? req.body.dialect.toUpperCase() : "ASL";
    const dialect = ALLOWED_DIALECTS.has(rawDialect) ? rawDialect : "ASL";

    if (!imageBase64) {
      return res.status(400).json({ error: "Please capture a camera frame or upload a hand gesture image." });
    }

    const cleanedBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanedBase64,
            },
          },
          {
            text: `Analyze the hand gesture or sign language pose in this image using ${dialect} conventions. Identify the closest sign or fingerspelled letter, translate it into natural spoken English, describe the observed handshape, finger positions, and orientation, and suggest a helpful conversational reply. If no hand is clearly visible, explain kindly what adjustment helps the camera read the sign.`,
          },
        ],
      },
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            handDetected: { type: Type.BOOLEAN },
            detectedGloss: { type: Type.STRING },
            spokenTranslation: { type: Type.STRING },
            confidenceLabel: { type: Type.STRING, description: "High, Moderate, or Needs Clearer Framing" },
            handshapeBreakdown: { type: Type.STRING },
            orientationNote: { type: Type.STRING },
            suggestedReply: { type: Type.STRING },
          },
          required: [
            "handDetected",
            "detectedGloss",
            "spokenTranslation",
            "confidenceLabel",
            "handshapeBreakdown",
            "orientationNote",
            "suggestedReply",
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? "{}").trim());
    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to analyze hand gesture.";
    console.error("[recognize-sign] error:", message);
    return res.status(500).json({ error: message });
  }
});

app.post("/api/contact", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const organization = typeof req.body?.organization === "string" ? req.body.organization.trim() : "";
  const topic = typeof req.body?.topic === "string" ? req.body.topic.trim() : "Enterprise Pilot";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Please enter your full name." });
  }
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!message || message.length < 10) {
    return res.status(400).json({ error: "Please include a brief description of your accessibility goals." });
  }

  const referenceId = `SB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return res.json({
    received: true,
    referenceId,
    summary: { name, email, organization, topic },
  });
});

// Pure-Node PKZIP archive builder for downloading clean project source
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c >>> 0;
}

function computeCrc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function collectProjectFiles(rootDir: string, currentDir = rootDir): { relPath: string; fullPath: string }[] {
  const EXCLUDED_DIRS = new Set(["node_modules", "dist", ".git", ".aistudio"]);
  const EXCLUDED_FILES = new Set([".env", "bun.lock"]);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  const results: { relPath: string; fullPath: string }[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      results.push(...collectProjectFiles(rootDir, path.join(currentDir, entry.name)));
    } else if (entry.isFile()) {
      if (EXCLUDED_FILES.has(entry.name) || entry.name.endsWith(".zip")) continue;
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath).split(path.sep).join("/");
      results.push({ relPath, fullPath });
    }
  }
  return results;
}

function buildZipBuffer(files: { archiveName: string; data: Buffer }[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() & 0x1f) << 11) |
    ((now.getMinutes() & 0x3f) << 5) |
    ((now.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((Math.max(now.getFullYear(), 1980) - 1980) & 0x7f) << 9) |
    (((now.getMonth() + 1) & 0x0f) << 5) |
    (now.getDate() & 0x1f);

  for (const file of files) {
    const nameBuf = Buffer.from(file.archiveName, "utf8");
    const crc = computeCrc32(file.data);
    const compressed = zlib.deflateRawSync(file.data, { level: 6 });

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6); // UTF-8 filename flag
    localHeader.writeUInt16LE(8, 8); // Deflate compression
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(file.data.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(file.data.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + compressed.length;
  }

  const centralDirBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirBuf, eocd]);
}

app.get("/api/download-zip", (_req, res) => {
  try {
    const projectFiles = collectProjectFiles(__dirname);
    const payload = projectFiles.map(({ relPath, fullPath }) => ({
      archiveName: `signbridge-lavender-website/${relPath}`,
      data: fs.readFileSync(fullPath),
    }));
    const zipBuffer = buildZipBuffer(payload);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="signbridge-lavender-website.zip"'
    );
    res.setHeader("Content-Length", String(zipBuffer.length));
    return res.send(zipBuffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to package project ZIP.";
    console.error("[download-zip] error:", message);
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SignBridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
