# Release Build — Tambola Android App

## Prerequisites

- JDK 17+ installed (`brew install openjdk@17`)
- Android Studio installed (provides Android SDK, build tools, emulator)
- `ANDROID_HOME` environment variable set (e.g. `export ANDROID_HOME=~/Library/Android/sdk`)
- Add to PATH: `export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH`

## Development build (debug APK)

```bash
npm run build && npx cap sync android
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

Install on a connected device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Generate a signing keystore (one-time)

```bash
keytool -genkey -v -keystore tambola-release.keystore \
  -alias tambola -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore file and passwords securely. You will need them for every release.

## Configure signing in Gradle

Create `android/keystore.properties` (do NOT commit this file):

```properties
storeFile=../tambola-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=tambola
keyPassword=YOUR_KEY_PASSWORD
```

Add to `android/app/build.gradle` above `android {`:

```groovy
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside `android { }`, add:

```groovy
signingConfigs {
    release {
        storeFile file(keystoreProperties['storeFile'] ?: 'debug.keystore')
        storePassword keystoreProperties['storePassword'] ?: ''
        keyAlias keystoreProperties['keyAlias'] ?: ''
        keyPassword keystoreProperties['keyPassword'] ?: ''
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

## Build release AAB (for Play Store)

```bash
npm run build && npx cap sync android
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Upload to Play Store

1. Go to https://play.google.com/console
2. Create your app listing (requires $25 developer account)
3. Upload the `.aab` file under "Production" > "Create new release"
4. Fill in store listing details (screenshots, description, feature graphic, etc.)
5. Set content rating, pricing, and distribution
6. Submit for review

## Alternative: Play App Signing

Instead of managing your own keystore, you can use Play App Signing where Google manages the signing key. Upload a signed APK/AAB with an upload key, and Google re-signs it with the actual release key. This is recommended for new apps.
