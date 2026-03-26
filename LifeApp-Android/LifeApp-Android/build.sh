#!/bin/bash
# ════════════════════════════════════════════════════════
#  LifeApp Android Build Script
#  Run this once on your machine to set up the APK project
# ════════════════════════════════════════════════════════

set -e

echo ""
echo "  LifeApp — Android Build Setup"
echo "══════════════════════════════════════"
echo ""

# 1. Check prerequisites
echo "▶ Checking Node.js..."
node -v || { echo "❌ Node.js not found. Install from https://nodejs.org"; exit 1; }

echo "▶ Checking npm..."
npm -v || { echo "❌ npm not found."; exit 1; }

echo "▶ Checking Java..."
java -version 2>&1 | head -1 || { echo "❌ Java not found. Install JDK 17+ from https://adoptium.net"; exit 1; }

echo ""
echo "▶ Installing Capacitor packages..."
npm install

echo ""
echo "▶ Adding Android platform..."
npx cap add android

echo ""
echo "▶ Syncing web assets into Android project..."
npx cap sync android

echo ""
echo "══════════════════════════════════════"
echo "  ✅ Setup complete!"
echo ""
echo "  NEXT STEPS to generate your APK:"
echo ""
echo "  OPTION A — Android Studio (recommended):"
echo "  1. Open Android Studio"
echo "  2. File → Open → select the 'android' folder"
echo "  3. Build → Build Bundle(s)/APK(s) → Build APK(s)"
echo "  4. APK will be at:"
echo "     android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "  OPTION B — Command line (if Android SDK in PATH):"
echo "  cd android && ./gradlew assembleDebug"
echo "  APK: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "  OPTION C — Release APK (for Play Store / sideloading):"
echo "  cd android && ./gradlew assembleRelease"
echo "  Then sign with: apksigner sign --ks your-keystore.jks app-release-unsigned.apk"
echo ""
echo "══════════════════════════════════════"
