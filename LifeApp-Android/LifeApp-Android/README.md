# LifeApp — Android APK Build Guide

This folder contains everything you need to build LifeApp as a native Android APK using **Capacitor**.

---

## 📋 Prerequisites (install these first)

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| JDK | 17+ | https://adoptium.net |
| Android Studio | Latest | https://developer.android.com/studio |

> **Android Studio** includes the Android SDK automatically. You don't need to install the SDK separately.

After installing Android Studio, open it once and complete the setup wizard — this installs the SDK and required build tools.

---

## 🚀 Build Steps

### Step 1 — Run the build script

**Mac / Linux:**
```bash
chmod +x build.sh
./build.sh
```

**Windows:**
Double-click `build.bat` or run it in Command Prompt.

This script will:
- Install Capacitor packages (`npm install`)
- Add the Android platform (`npx cap add android`)
- Sync your web app into the Android project (`npx cap sync android`)

### Step 2 — Open in Android Studio

1. Open **Android Studio**
2. Click **File → Open**
3. Navigate to this folder and select the **`android`** subfolder (created in Step 1)
4. Wait for Gradle to sync (bottom progress bar — may take 2–3 minutes first time)

### Step 3 — Build the APK

In Android Studio:
1. Click **Build** in the top menu
2. Select **Build Bundle(s) / APK(s) → Build APK(s)**
3. Wait for build to complete
4. Click **"locate"** in the notification that appears

**APK location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Install on Your Phone

**Method A — USB:**
1. Enable Developer Options on your phone (Settings → About → tap Build Number 7 times)
2. Enable USB Debugging in Developer Options
3. Connect phone via USB
4. In Android Studio: Run → Run 'app' (installs directly)

**Method B — File transfer:**
1. Copy `app-debug.apk` to your phone (USB, WhatsApp, Google Drive, etc.)
2. Open the file on your phone
3. If prompted "Install from unknown sources" → Allow
4. Install

---

## 🏭 Release APK (for sharing / Play Store)

For a release APK (smaller, optimized, signable):

```bash
cd android
./gradlew assembleRelease
```

To sign it (required for Play Store):
```bash
# Generate a keystore (one time)
keytool -genkey -v -keystore lifeapp.keystore -alias lifeapp -keyalg RSA -keysize 2048 -validity 10000

# Sign the APK
apksigner sign --ks lifeapp.keystore \
  --out lifeapp-release.apk \
  android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 🔧 Customization

### Change App Name
Edit `capacitor.config.json`:
```json
"appName": "LifeApp"
```

### Change Package ID
Edit `capacitor.config.json`:
```json
"appId": "com.lifeapp.knowyourself"
```

### Update Web Content
Edit files in `www/` then run:
```bash
npx cap sync android
```

---

## 📁 Project Structure

```
LifeApp-Android/
├── www/                    ← Your web app (HTML/CSS/JS)
│   ├── index.html          ← Main app
│   ├── manifest.json       ← PWA manifest
│   ├── sw.js               ← Service worker
│   └── icon-*.png          ← Icons
├── android/                ← Android project (created by build.sh)
├── capacitor.config.json   ← Capacitor configuration
├── package.json            ← Node dependencies
├── build.sh                ← Mac/Linux build script
├── build.bat               ← Windows build script
└── README.md               ← This file
```

---

## ❓ Troubleshooting

**"SDK not found" error:**
- Open Android Studio → SDK Manager → install Android 14 (API 34)
- Or set `ANDROID_HOME` environment variable to your SDK path

**Gradle sync fails:**
- Check your internet connection (Gradle downloads dependencies)
- Try File → Sync Project with Gradle Files in Android Studio

**"npx cap add android" hangs:**
- Check internet connection
- Run `npm install` first, then retry

---

*LifeApp v2.0 · Built with Capacitor 6 · Android target API 34*
