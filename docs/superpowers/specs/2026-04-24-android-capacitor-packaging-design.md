# Tambola Android App — Capacitor Packaging

**Date:** 2026-04-24
**Status:** Approved

## Goal

Package the existing Tambola (Housie) React/Vite web app as a native Android app suitable for Google Play Store publishing using Capacitor.

## Current State

- React 19 + Vite 8 web app
- Mobile-first design (390px max-width, safe-area insets)
- Features: 1-90 number caller, voice rhymes via Web Speech API, prize tracking, dark/light themes, confetti
- No backend — fully client-side

## Approach: Capacitor

Capacitor wraps the Vite build output (`dist/`) in a native Android WebView. No code rewrite needed.

### New files/dependencies

| Item | Purpose |
|------|---------|
| `@capacitor/core` | Runtime bridge between web and native |
| `@capacitor/cli` | CLI for init, sync, build |
| `@capacitor/android` | Android platform plugin |
| `@capacitor/status-bar` | Style status bar to match app theme |
| `@capacitor/splash-screen` | Show splash while WebView loads |
| `capacitor.config.ts` | App ID, name, webDir, plugin config |
| `android/` | Generated native Android project |

### Vite config change

Set `base: './'` so asset paths are relative (required for file:// loading in WebView).

### App identity

- **App ID:** `com.valerian.tambola` (confirmed — permanent on Play Store)
- **App name:** Tambola
- **Launcher icons:** Generated from existing logo/favicon in required Android sizes (mdpi through xxxhdpi)
- **Splash screen:** Solid background with centered logo, auto-hide after app loads

### Status bar / navigation bar

- Dark theme: transparent/dark status bar, light icons
- Light theme: light status bar, dark icons
- Matched via Capacitor StatusBar plugin on app load and theme toggle

### Build output

- Debug: APK via `./gradlew assembleDebug`
- Release: AAB via `./gradlew bundleRelease` (Play Store requirement)

### Signing (user responsibility)

Release builds require a Java keystore. Steps documented but user runs them (passwords involved). Alternatively, use Play App Signing where Google manages the key.

## Out of scope

- Play Store listing (screenshots, descriptions, feature graphic)
- Play Store developer account setup
- Backend/API integration
- iOS packaging (can be added later with `@capacitor/ios`)

## Implementation steps

1. Install Capacitor dependencies
2. Create `capacitor.config.ts` with app config
3. Update `vite.config.js` — set `base: './'`
4. Initialize Android platform (`npx cap add android`)
5. Configure StatusBar and SplashScreen plugins in app code
6. Generate launcher icons in all required densities
7. Update `AndroidManifest.xml` metadata (theme, orientation, etc.)
8. Build and sync: `npm run build && npx cap sync android`
9. Verify debug APK builds: `cd android && ./gradlew assembleDebug`
10. Document release signing and AAB generation steps
