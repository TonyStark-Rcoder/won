import React, { useState } from 'react';
import { X, Smartphone, Download, Copy, Check, Terminal, FileCode, Shield } from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const capacitorConfigCode = `{
  "appId": "com.nexus.levelzero",
  "appName": "NEXUS: LEVEL ZERO",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#05050a"
  }
}`;

  const manifestSnippet = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nexus.levelzero">
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="NEXUS: LEVEL ZERO"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const terminalCommands = `# 1. Install Capacitor Android dependencies
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 2. Build the optimized production assets
npm run build

# 3. Add Android platform & sync
npx cap add android
npx cap sync android

# 4. Generate Debug APK using Gradle
cd android && ./gradlew assembleDebug

# Output APK path:
# android/app/build/outputs/apk/debug/app-debug.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[88vh] rounded-2xl bg-[#090815] border border-cyan-500/40 flex flex-col shadow-2xl shadow-cyan-950/70 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-cyan-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold font-['Orbitron'] text-slate-100 tracking-wider">
                ANDROID APK COMPILATION GUIDE
              </h2>
              <p className="text-xs text-slate-400">
                Turn NEXUS: LEVEL ZERO into a standalone Android APK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Method A: Instant PWA Install on Android */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-['Orbitron'] text-sm mb-1.5">
              <Download className="w-4 h-4" />
              <span>METHOD 1: INSTANT ANDROID WebAPK (ZERO SETUP)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              This app is fully PWA-compliant with standalone display, maskable icons, and offline storage.
            </p>
            <ol className="list-decimal list-inside text-xs space-y-1 text-slate-300">
              <li>Open this app on Android in Google Chrome.</li>
              <li>Tap the <strong className="text-cyan-300">Menu (⋮)</strong> at top-right.</li>
              <li>Select <strong className="text-cyan-300">"Install app"</strong> or <strong className="text-cyan-300">"Add to Home screen"</strong>.</li>
              <li>Android automatically generates a native WebAPK icon on your home screen and app drawer!</li>
            </ol>
          </div>

          {/* Method B: Native APK with Capacitor */}
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-bold font-['Orbitron'] text-sm mb-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>METHOD 2: BUILD STANDALONE APK (GRADLE / ANDROID STUDIO)</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Run these commands in the project root to generate a native <code className="text-cyan-300 font-mono">app-debug.apk</code>:
            </p>

            {/* Terminal snippet */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-slate-200">
              <button
                onClick={() => copyToClipboard(terminalCommands, 'commands')}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-sans flex items-center gap-1 text-cyan-300 transition"
              >
                {copiedKey === 'commands' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'commands' ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="overflow-x-auto whitespace-pre">{terminalCommands}</pre>
            </div>
          </div>

          {/* capacitor.config.json */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold font-['Orbitron'] text-slate-200">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>capacitor.config.json</span>
              </div>
              <button
                onClick={() => copyToClipboard(capacitorConfigCode, 'config')}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                {copiedKey === 'config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Config</span>
              </button>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{capacitorConfigCode}</pre>
            </div>
          </div>

          {/* AndroidManifest.xml */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold font-['Orbitron'] text-slate-200">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>android/app/src/main/AndroidManifest.xml</span>
              </div>
              <button
                onClick={() => copyToClipboard(manifestSnippet, 'manifest')}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                {copiedKey === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Manifest</span>
              </button>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{manifestSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-['Orbitron'] text-xs uppercase tracking-wider transition"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
