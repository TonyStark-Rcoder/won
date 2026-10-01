import React, { useState } from 'react';
import {
  Smartphone,
  Sliders,
  Download,
  Upload,
  UserCheck,
  Zap,
  Flame,
  Award,
  Shield,
  Edit2,
  Check,
} from 'lucide-react';
import { AvatarStyle, PathClass, PlayerRank, UserProfile } from '../types';
import { AnimeAvatar } from '../components/AnimeAvatar';
import { RANK_THEMES } from '../services/levelSystem';
import { sound } from '../services/soundEngine';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenSettings: () => void;
  onOpenApkGuide: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenSettings,
  onOpenApkGuide,
  onExportData,
  onImportData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.username);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarStyle>(profile.avatarStyle);
  const [selectedPath, setSelectedPath] = useState<PathClass>(profile.path);

  const currentRankTheme = RANK_THEMES[profile.rank] || RANK_THEMES[PlayerRank.E];

  const avatars = [
    AvatarStyle.SHADOW_WARRIOR,
    AvatarStyle.CYBER_MAGE,
    AvatarStyle.DARK_KNIGHT,
    AvatarStyle.MYSTIC_HUNTER,
    AvatarStyle.FUTURISTIC_WARRIOR,
  ];

  const handleSaveProfile = () => {
    sound.playClick();
    onUpdateProfile({
      username: tempName.trim() || profile.username,
      avatarStyle: selectedAvatar,
      path: selectedPath,
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportData(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-['Orbitron'] text-slate-100 tracking-wider">
            HUNTER ARCHIVES
          </h1>
          <p className="text-xs text-slate-400">
            Codename credentials, neural signature, and APK deployment
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 transition"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Hunter ID Card */}
      <div className="relative rounded-2xl bg-[#090815] border-2 border-cyan-500/40 p-5 shadow-xl shadow-black/80 overflow-hidden">
        {/* Ambient Rank Aura */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentRankTheme.auraColor }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <AnimeAvatar
            style={isEditing ? selectedAvatar : profile.avatarStyle}
            rank={profile.rank}
            size="lg"
            animated
            showBadge
          />

          <div className="flex-1 text-center sm:text-left min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold font-['Orbitron'] text-slate-400 mb-1">
                    EDIT HUNTER CODENAME
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={20}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-400 text-slate-100 text-sm font-bold font-['Orbitron'] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-['Orbitron'] text-slate-400 mb-1">
                    CHOOSE AVATAR FORM
                  </label>
                  <div className="flex gap-2">
                    {avatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`p-1 rounded-lg border transition ${
                          selectedAvatar === av ? 'border-cyan-400 bg-cyan-950/40' : 'border-slate-800'
                        }`}
                      >
                        <AnimeAvatar style={av} size="sm" animated={false} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-['Orbitron'] text-slate-400 mb-1">
                    HUNTER PATH
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.values(PathClass).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPath(p)}
                        className={`px-2 py-1 rounded text-xs font-['Orbitron'] font-bold border ${
                          selectedPath === p ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300' : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-['Orbitron'] text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold font-['Orbitron'] text-slate-100">
                    {profile.username}
                  </h2>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsEditing(true);
                      setTempName(profile.username);
                      setSelectedAvatar(profile.avatarStyle);
                      setSelectedPath(profile.path);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400"
                    title="Edit Codename & Avatar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs font-semibold font-['Rajdhani'] text-slate-400 uppercase mt-0.5">
                  {profile.title} • {profile.path} PATH
                </div>

                {/* Badges strip */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
                  <span
                    className={`text-xs font-bold font-['Orbitron'] px-2.5 py-1 rounded-lg border ${currentRankTheme.badgeBg} ${currentRankTheme.badgeBorder} ${currentRankTheme.textColor}`}
                  >
                    RANK {profile.rank}
                  </span>

                  <span className="text-xs font-bold font-['Orbitron'] text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>LVL {profile.level}</span>
                  </span>

                  <span className="text-xs font-bold font-['Orbitron'] text-amber-400 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{profile.streakCurrent}d STREAK</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">LIFETIME XP</div>
            <div className="text-sm font-bold font-mono text-cyan-400">{profile.totalXp}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">BEST STREAK</div>
            <div className="text-sm font-bold font-mono text-amber-400">{profile.streakBest} Days</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">STATUS</div>
            <div className="text-sm font-bold font-mono text-emerald-400">AWAKENED</div>
          </div>
        </div>
      </div>

      {/* APK Compilation Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-purple-950/40 border border-cyan-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-400/80 text-cyan-400 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold font-['Orbitron'] text-slate-100">
              BUILD ANDROID APK
            </div>
            <p className="text-xs text-slate-400">
              Capacitor Gradle build commands & WebAPK install instructions
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenApkGuide();
          }}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-['Orbitron'] text-xs tracking-wider uppercase transition shadow-md shadow-cyan-500/30 flex-shrink-0"
        >
          View Guide
        </button>
      </div>

      {/* Data Backup & Migration */}
      <div className="p-4 rounded-2xl bg-[#090815] border border-slate-800 space-y-3">
        <div className="text-xs font-bold font-['Orbitron'] text-slate-300 uppercase">
          DATA BACKUP & RECOVERY
        </div>
        <p className="text-xs text-slate-400">
          All progress is safely stored offline in your device. Export a JSON backup to transfer between Android devices or browsers.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onExportData();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-950/60 text-cyan-300 font-['Orbitron'] text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT SYSTEM BACKUP</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-['Orbitron'] text-xs font-bold cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>RESTORE BACKUP</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
