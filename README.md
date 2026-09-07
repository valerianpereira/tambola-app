# Tambola

Tambola (Housie) caller app — React + Vite web app, packaged for Android with Capacitor.
Calls numbers out loud via text-to-speech, tracks the drawn board, and runs fully offline.

## Prerequisites

- Node.js 20+ and npm
- For Android builds: JDK 17+, Android Studio (SDK + build tools), `ANDROID_HOME` set

## Setup

```bash
git clone git@github.com:valerianpereira/tambola-app.git
cd tambola-app
npm install
```

## Run in the browser

```bash
npm run dev        # dev server with HMR at http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the built dist/
npm run lint       # eslint
```

## Run on Android

```bash
npm run cap:sync   # build + copy web assets into the android project
npm run cap:open   # open in Android Studio, then Run
```

Or build a debug APK from the CLI:

```bash
npm run cap:sync
cd android && ./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

Note: `dist/` is gitignored, so run `npm run cap:sync` at least once before any Android build —
otherwise the app ships without web assets.

## Release builds

```bash
npm run release    # web build + cap sync + signed release AAB
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Release signing is already wired in `android/app/build.gradle`; it reads the gitignored
`android/keystore.properties`. Full signing, versioning and Play Console steps:
[docs/RELEASE.md](docs/RELEASE.md).

## Play Store assets

Everything needed for the listing lives in `store/`:

- `store/listing.md` — descriptions, content-rating and data-safety answers
- `store/graphics/` — 512x512 icon, 1024x500 feature graphic
- `store/screenshots/` — four 960x1708 phone screenshots

The privacy policy Play requires is `docs/privacy-policy.html`, ready to serve from
GitHub Pages (see docs/RELEASE.md).

## Project layout

```
src/
  TambolaApp.jsx      main UI
  useGameState.js     game state + number draw logic
  capacitor-init.js   splash screen / status bar setup
  data.js             number call phrases
resources/            source SVGs for app icon and splash
android/              Capacitor Android project
store/                Play Store listing copy, graphics, screenshots
docs/                 release guide, privacy policy, design notes
```

App icon and splash are regenerated from `resources/` with `npx capacitor-assets generate`.
