import { useRef, useState } from 'react';
import {
  Archive,
  CalendarDays,
  Check,
  Download,
  Palette,
  RotateCcw,
  Save,
  Settings,
  Smartphone,
  Timer,
  Trash2,
  Upload,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { THEMES } from '../data/themes';
import { PWAInstallButton } from './PWAInstallButton';

export function MenuView() {
  const {
    state,
    currentTheme,
    setTheme,
    setActiveTab,
    updateSettings,
    resetAllData,
    backups,
    createBackup,
    restoreBackup,
    deleteBackup,
    deleteOldBackups,
    importBackupJson,
    showToast,
  } = useStudy();

  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayName = state.profile.name ? state.profile.name : 'YOUR NAME';
  const classLabel = state.profile.studentClass ? `Class ${state.profile.studentClass}` : '';

  const handleExportFile = () => {
    try {
      const payload = JSON.stringify(
        { exportedAt: new Date().toISOString(), data: state },
        null,
        2
      );
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `study-war-backup.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Backup Exported');
    } catch {
      showToast('Export Failed');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      importBackupJson(String(reader.result || ''));
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-6">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
        MENU
      </h1>

      {/* 1. REAL PROFILE CARD (Photo + Name + Class + Bio + [EDIT PROFILE] FLAT) */}
      <section className="card-flat animate-card-in p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-14 h-14 rounded-full border-2 overflow-hidden flex items-center justify-center bg-[#000000] shrink-0"
            style={{ borderColor: 'var(--primary)' }}
          >
            {state.profile.photoDataUrl ? (
              <img
                src={state.profile.photoDataUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={24} style={{ color: 'var(--primary)' }} />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold uppercase text-white truncate">
              {displayName}
            </h2>
            {classLabel && (
              <p className="text-xs font-extrabold uppercase text-[#8A8A8A]">
                {classLabel}
              </p>
            )}
            {state.profile.bio && (
              <p className="text-xs font-semibold text-[#D4D4D4] truncate mt-0.5">
                {state.profile.bio}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('PROFILE')}
          className="btn-flat px-4 py-2.5 bg-[#000000] text-white text-xs tracking-wider cursor-pointer shrink-0 border border-white/10"
        >
          EDIT PROFILE
        </button>
      </section>

      {/* FOCUS MODE SHORTCUT (FLAT) */}
      <button
        type="button"
        onClick={() => setActiveTab('FOCUS')}
        className="btn-flat w-full min-h-[50px] bg-[#1E1E1E] text-white text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
      >
        <Timer size={18} style={{ color: 'var(--primary)' }} />
        <span>FOCUS MODE</span>
      </button>

      {/* INSTALL APP (PWA — auto-hides if already installed/APK) */}
      <PWAInstallButton />

      {/* 2. APPEARANCE — 8 FLAT THEMES */}
      <section className="card-flat animate-card-in p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={18} style={{ color: 'var(--primary)' }} />
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
              APPEARANCE
            </h2>
          </div>
          <span
            className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--hero-text)',
            }}
          >
            {currentTheme.name}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {THEMES.map((theme) => {
            const isSelected = theme.id === currentTheme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                className="btn-flat flex flex-col items-center gap-2 cursor-pointer"
                aria-label={`Select ${theme.name}`}
              >
                <div
                  className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center ${
                    isSelected ? 'ring-3 ring-white ring-offset-2 ring-offset-[#1E1E1E]' : ''
                  }`}
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.heroText,
                  }}
                >
                  {isSelected && <Check size={24} strokeWidth={3} />}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight text-center leading-tight ${
                    isSelected ? 'text-white' : 'text-[#8A8A8A]'
                  }`}
                >
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. BACKUPS — AUTO OR MANUAL + SAVE + RESTORE + DELETE OLD */}
      <section className="card-flat animate-card-in p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Archive size={18} style={{ color: 'var(--primary)' }} />
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
              BACKUPS
            </h2>
          </div>

          {/* AUTO / MANUAL FLAT PILL SWITCH */}
          <div className="flex items-center gap-1 rounded-full bg-[#000000] p-1 border border-white/10">
            {(['manual', 'auto'] as const).map((mode) => {
              const active = state.settings.backupMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateSettings({ backupMode: mode })}
                  className="btn-flat !rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
                  style={{
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                    color: active ? 'var(--hero-text)' : '#8A8A8A',
                  }}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* FLAT ACTION BUTTONS: SAVE NOW | EXPORT | IMPORT */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => createBackup('manual')}
            className="btn-flat min-h-[42px] px-2 text-[11px] tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--hero-text)',
            }}
          >
            <Save size={14} />
            <span>SAVE NOW</span>
          </button>

          <button
            type="button"
            onClick={handleExportFile}
            className="btn-flat min-h-[42px] px-2 bg-[#000000] text-white text-[11px] tracking-wider flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <Download size={14} />
            <span>EXPORT</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-flat min-h-[42px] px-2 bg-[#000000] text-white text-[11px] tracking-wider flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <Upload size={14} />
            <span>IMPORT</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>

        {backups.length === 0 ? (
          <div className="rounded-[14px] bg-[#000000] py-4 px-3 text-center">
            <span className="text-xs font-extrabold uppercase text-[#8A8A8A]">
              NO BACKUP YET
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {backups.length > 1 && (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                  {backups.length} SAVED
                </span>
                <button
                  type="button"
                  onClick={deleteOldBackups}
                  className="btn-flat px-2.5 py-1 bg-[#000000] text-[#EF4444] text-[10px] font-extrabold uppercase tracking-wider border border-[#EF4444]/30 cursor-pointer"
                >
                  DELETE OLD
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
              {backups.map((bk) => (
                <div
                  key={bk.id}
                  className="rounded-[14px] bg-[#000000] px-3.5 py-2.5 flex items-center justify-between gap-2 border border-white/[0.06]"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase text-white truncate">
                      {bk.label}
                    </p>
                    <p className="text-[10px] font-mono-num font-bold uppercase text-[#8A8A8A]">
                      {bk.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => restoreBackup(bk.id)}
                      className="btn-flat px-3 py-1.5 bg-[#1E1E1E] text-white text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
                    >
                      RESTORE
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBackup(bk.id)}
                      aria-label="Delete backup"
                      className="btn-flat w-8 h-8 bg-[#1E1E1E] text-[#EF4444] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. SETTINGS ONLY (FLAT) */}
      <section className="card-flat animate-card-in p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Settings size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
            SETTINGS
          </h2>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#000000] px-4 py-3">
          <div className="flex items-center gap-2">
            {state.settings.soundEnabled ? (
              <Volume2 size={16} style={{ color: 'var(--primary)' }} />
            ) : (
              <VolumeX size={16} className="text-[#8A8A8A]" />
            )}
            <span className="text-xs font-extrabold uppercase text-white">
              SOUND
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
            className="btn-flat px-4 py-2 text-xs font-extrabold uppercase tracking-wider cursor-pointer border border-white/10"
            style={{
              backgroundColor: state.settings.soundEnabled ? 'var(--primary)' : '#1E1E1E',
              color: state.settings.soundEnabled ? 'var(--hero-text)' : '#8A8A8A',
            }}
          >
            {state.settings.soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#000000] px-4 py-3">
          <div className="flex items-center gap-2">
            <Smartphone
              size={16}
              style={{
                color: state.settings.hapticsEnabled !== false ? 'var(--primary)' : '#8A8A8A',
              }}
            />
            <span className="text-xs font-extrabold uppercase text-white">
              HAPTICS
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              updateSettings({ hapticsEnabled: state.settings.hapticsEnabled === false })
            }
            className="btn-flat px-4 py-2 text-xs font-extrabold uppercase tracking-wider cursor-pointer border border-white/10"
            style={{
              backgroundColor:
                state.settings.hapticsEnabled !== false ? 'var(--primary)' : '#1E1E1E',
              color:
                state.settings.hapticsEnabled !== false ? 'var(--hero-text)' : '#8A8A8A',
            }}
          >
            {state.settings.hapticsEnabled !== false ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#000000] px-4 py-3">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={16}
              style={{ color: state.settings.examDate ? 'var(--primary)' : '#8A8A8A' }}
            />
            <span className="text-xs font-extrabold uppercase text-white">
              EXAM DATE
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              aria-label="Exam Date"
              value={state.settings.examDate || ''}
              onChange={(e) => updateSettings({ examDate: e.target.value })}
              className="bg-[#1E1E1E] text-white text-xs font-mono-num font-extrabold rounded-xl px-2.5 py-2 border border-white/10 cursor-pointer [color-scheme:dark]"
            />
            {state.settings.examDate && (
              <button
                type="button"
                onClick={() => updateSettings({ examDate: '' })}
                aria-label="Clear exam date"
                className="btn-flat w-8 h-8 bg-[#1E1E1E] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#000000] px-4 py-3">
          <span className="text-xs font-extrabold uppercase text-white">
            DAILY STUDY GOAL
          </span>
          <select
            aria-label="Daily Study Goal"
            value={state.settings.dailyGoalMinutes}
            onChange={(e) =>
              updateSettings({ dailyGoalMinutes: Number(e.target.value) })
            }
            className="bg-[#1E1E1E] text-white text-xs font-mono-num font-extrabold rounded-xl px-3 py-2 border border-white/10 cursor-pointer"
          >
            <option value={60}>60 MIN</option>
            <option value={120}>120 MIN</option>
            <option value={180}>180 MIN</option>
          </select>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="btn-flat w-full min-h-[46px] bg-[#000000] text-[#8A8A8A] hover:text-white text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>RESET STUDY PROGRESS</span>
          </button>
        ) : (
          <div className="rounded-[16px] bg-[#000000] border border-[#EF4444]/50 p-3 flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase text-[#EF4444]">
              Reset All Data?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setConfirmReset(false);
                }}
                className="btn-flat px-4 py-2 bg-[#EF4444] text-white text-xs cursor-pointer"
              >
                RESET
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="btn-flat px-4 py-2 bg-[#1E1E1E] text-white text-xs cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
