# Release & Play Store — Tambola

## Prerequisites

- JDK 21 (`brew install openjdk@21`) — pinned in `android/gradle.properties` via `org.gradle.java.home`
- Android SDK (Android Studio, or command-line tools)
- `export ANDROID_HOME=$HOME/Library/Android/sdk`
- `export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH`

## Debug build

```bash
npm run cap:sync
cd android && ./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Signing — already configured

Release signing is wired in `android/app/build.gradle`. It reads
`android/keystore.properties`, and falls back to an unsigned build when that file is
missing (so a clean clone still builds).

Both the keystore and the properties file are **gitignored** and exist only on this machine:

| File | What it is |
|---|---|
| `android/tambola-upload.keystore` | RSA-4096 upload key, alias `tambola-upload`, valid to 2054 |
| `android/keystore.properties` | store path, alias and passwords |

> **Back these up.** Copy the `.keystore` file and its password into a password manager
> now. Enrol in **Play App Signing** when you create the app in the console — Google then
> holds the real signing key, and a lost *upload* key can be reset through support. Without
> Play App Signing, losing this file means you can never update the app.

To recreate the keystore from scratch:

```bash
cd android
keytool -genkeypair -v -keystore tambola-upload.keystore -alias tambola-upload \
  -keyalg RSA -keysize 4096 -validity 10000
cat > keystore.properties <<'EOF'
storeFile=../tambola-upload.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=tambola-upload
keyPassword=YOUR_KEY_PASSWORD
EOF
chmod 600 keystore.properties tambola-upload.keystore
```

## Release AAB

```bash
npm run release        # build web + sync + bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Verify it is signed before uploading:

```bash
jarsigner -verify android/app/build/outputs/bundle/release/app-release.aab   # → "jar verified."
```

## Version bumps

Edit `android/app/build.gradle` → `defaultConfig`:

- `versionCode` — integer, must increase on **every** upload. Play rejects a repeat.
- `versionName` — the string users see, e.g. `1.0.1`.

## Publishing the privacy policy

Play requires a publicly reachable privacy policy URL for every app.
`docs/privacy-policy.html` is ready to serve. To host it free on GitHub Pages:

1. Push the repo to GitHub.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/docs`.
3. The policy lands at `https://<user>.github.io/<repo>/privacy-policy.html`.
4. Open it once to confirm, then paste that URL into the Play Console listing.

## Play Console — first submission

Console: https://play.google.com/console/u/0/developers/4953426829520023902/app-list

All listing text, graphics paths, content-rating answers and data-safety answers are in
[`store/listing.md`](../store/listing.md). Order of operations:

1. **Create app** — name `Tambola — Housie Caller`, Game, Free, default language English (India).
2. **Set up your app** checklist, in this order — Play blocks the release until each is green:
   - App access → *All functionality is available without special access*
   - Ads → *No ads*
   - Content rating → complete the questionnaire (answers in `store/listing.md`; the
     gambling question is **No**, with the reasoning noted there)
   - Target audience → 13+; *does not appeal to children*
   - News app → No
   - Data safety → *no data collected or shared*
   - Government app / financial / health → No
   - Privacy policy URL → the Pages URL above
3. **Store listing** — short + full description, app icon, feature graphic, 4 phone screenshots.
4. **Production → Create new release**
   - Opt in to **Play App Signing** when prompted (do this; see the warning above).
   - Upload `app-release.aab`.
   - Release name: `1.0 (1)`. Release notes: `First release.`
5. **Countries / regions** — select at least India.
6. **Send for review.** First review of a new personal developer account typically takes
   several days and may require the 12-tester closed-testing programme before production
   is unlocked — check the console's own prompts, as this rule applies to accounts created
   after Nov 2023.

## Updating an existing release

```bash
# bump versionCode (and versionName) in android/app/build.gradle first
npm run release
jarsigner -verify android/app/build/outputs/bundle/release/app-release.aab
# upload the new .aab to a Production release
```
