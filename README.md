# To-Do Voice App

## Overview
A simple to-do list app built with React Native (Expo) featuring:
- Voice-to-text task creation (OpenAI or Groq, with a mock fallback)
- Add/Edit tasks with optional due dates
- Sorting by due date (incomplete first)
- Search/filter by title and description
- Light/Dark theme toggle
- Smooth list animations
- TypeScript and unit tests for core logic

## Prerequisites
- Node.js 18+
- npm 9+
- Expo CLI: `npm install -g expo-cli` (optional; you can use `npx expo`)
- iOS Simulator (Xcode) or Android Emulator, or a physical device with Expo Go

## Setup
1) Install dependencies:
```bash
npm install
```

2) Create a `.env` file in the project root:
```bash
# Choose one: mock | groq | openai
TRANSCRIPTION_PROVIDER=mock

# API key used when TRANSCRIPTION_PROVIDER is 'groq' or 'openai'
# Never commit real keys to source control
OPENAI_API_KEY=YOUR_API_KEY_HERE
```
Notes:
- When `TRANSCRIPTION_PROVIDER=mock`, the app generates sample phrases without calling any external API.
- For Groq, set `TRANSCRIPTION_PROVIDER=groq` and provide your Groq API key in `OPENAI_API_KEY`.
- For OpenAI, set `TRANSCRIPTION_PROVIDER=openai` and provide your OpenAI API key in `OPENAI_API_KEY`.

Environment variables are loaded via `app.config.js` and injected into `expo.extra`:
- `app.config.js:16-19`

## Running
Start the app:
```bash
npm start
```
Then choose:
- iOS: press `i`
- Android: press `a`
- Web: press `w`

You can also run platform-specific:
```bash
npm run ios
npm run android
npm run web
```

## Voice Transcription
The app records audio using `expo-av` and transcribes it using the selected provider.
- Providers:
  - `mock`: no network calls, returns sample phrases
  - `groq`: calls `https://api.groq.com/openai/v1/audio/transcriptions` with `model=whisper-large-v3`
  - `openai`: calls `https://api.openai.com/v1/audio/transcriptions` with `model=whisper-1`
- The bearer token is read from `expo.extra.OPENAI_API_KEY`.

Key code paths:
- `src/voice/VoiceFab.tsx:20-55` — start/stop recording and call transcription
- `src/voice/speechTranscription.ts:3-68` — provider selection and API request
- `src/voice/split.ts:1-38` — robust phrase splitting and artifact cleanup

## Features
- Add tasks with title, optional description, and optional due date
- List sorted: incomplete first, then by earliest due date, then newest created
- Search bar filters by title/description
- Theme toggle in the header (sun/moon)
- Layout animations on add, delete, and toggle

## Theme
Theme context supplies colors to UI and navigation:
- `src/state/ThemeContext.tsx:45-63`
- `App.tsx:1-34` — navigation theme bound to context
- Screens/components consume `useTheme()`

## Testing & Quality
- Type checking: `npm run typecheck`
- Linting: `npm run lint`
- Unit tests: `npm test`
  - Current tests cover task splitting logic: `src/__tests__/split.test.ts`

## Troubleshooting
- Android date/time picker native module errors:
  - Ensure `@react-native-community/datetimepicker` is installed via Expo:
    ```bash
    npx expo install @react-native-community/datetimepicker
    ```
- If search typing causes UI glitches, avoid triggering `LayoutAnimation` on every keystroke.
- If voice transcription fails with “Missing API Key”, ensure `.env` is present and the app was restarted.

## Security Note
Do not commit real API keys to this repository. Use `.env` locally and share secrets securely. If you must distribute credentials, use a dedicated secrets manager or secure channel rather than embedding in documentation.
