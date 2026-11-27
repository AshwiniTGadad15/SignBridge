# SignBridge — Lavender Theme Accessibility Web App

AI-powered bidirectional sign language translation website built with React, TypeScript, Tailwind CSS, Motion, Express, and the Gemini API.

## Quick Start

1. Extract this ZIP folder and open it in your terminal:
   ```bash
   cd signbridge-lavender-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and set your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. Start the development server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Included Features

- Full lavender & purple visual design system (`#F8F5FF`, `#F0E9FF`, `#D8C4FF`, `#E8DCFF`, `#9061D8`, `#7041B5`, `#38205F`)
- Custom 3D sculptural sign language illustrations (`src/assets/images/`)
- Navbar ASL / BSL / ISL sign language dataset switcher
- Interactive Live Demo with text/voice-to-sign gloss sequencing, dialect-aware Web Speech API **Listen** audio synthesis, and camera/photo gesture recognition
- Accessible Keyboard Shortcuts modal (`?` or `Ctrl+/`) with working global hotkeys (`Space`, `Ctrl+D`, `Ctrl+M`, `←`/`→`, `R`, `V`, `Esc`)
