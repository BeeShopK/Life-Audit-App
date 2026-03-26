@echo off
REM ════════════════════════════════════════════════════════
REM  LifeApp Android Build Script (Windows)
REM ════════════════════════════════════════════════════════

echo.
echo   LifeApp - Android Build Setup
echo ======================================
echo.

echo Checking Node.js...
node -v || (echo Node.js not found. Install from https://nodejs.org && pause && exit /b 1)

echo Checking npm...
npm -v || (echo npm not found. && pause && exit /b 1)

echo.
echo Installing Capacitor packages...
call npm install

echo.
echo Adding Android platform...
call npx cap add android

echo.
echo Syncing web assets...
call npx cap sync android

echo.
echo ======================================
echo   Setup complete!
echo.
echo   Next: Open Android Studio
echo   File - Open - select the 'android' folder
echo   Build - Build APK(s)
echo   APK: android\app\build\outputs\apk\debug\app-debug.apk
echo ======================================
pause
