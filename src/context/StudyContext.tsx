import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getTodayDateKey, INITIAL_STATE, SUBJECT_COLORS } from '../data/studyData';
import { DEFAULT_THEME_ID, THEMES } from '../data/themes';
import {
  AppSettings,
  BackupSnapshot,
  StudyWarState,
  TabKey,
  ThemeConfig,
  ThemeId,
  UserProfile,
} from '../types';
import { soundEngine } from '../utils/soundEngine';

const STORAGE_KEY = 'study_war_blank_v2';
const THEME_STORAGE_KEY = 'study_war_theme_v2';
const BACKUPS_STORAGE_KEY = 'study_war_backups_v1';
const MAX_BACKUPS = 8;

export interface PendingTaskItem {
  id: string;
  source: 'target' | 'plan';
  title: string;
  minutes?: number;
}

interface StudyContextValue {
  state: StudyWarState;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  focusLaunchCount: number;
  openFocusMode: () => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  currentTheme: ThemeConfig;
  setTheme: (themeId: ThemeId) => void;
  toast: string | null;
  showToast: (msg: string) => void;

  // Profile & Settings
  updateProfile: (profile: UserProfile) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  dismissEditHint: () => void;
  resetAllData: () => void;

  // Subjects & Chapters
  addSubject: (name: string, studentClass: string) => string;
  renameSubject: (id: string, name: string) => void;
  deleteSubject: (id: string) => void;
  addChapter: (subjectId: string, name: string) => void;
  addBulkChapters: (subjectId: string, fromNum: number, toNum: number) => void;
  toggleChapterDone: (chapterId: string) => void;
  toggleChapterRevise: (chapterId: string) => void;
  renameChapter: (chapterId: string, name: string) => void;
  deleteChapter: (chapterId: string) => void;

  // Today's Target
  addTarget: (text: string) => void;
  toggleTargetDone: (id: string) => void;
  renameTarget: (id: string, text: string) => void;
  deleteTarget: (id: string) => void;

  // Today's Plan (Schedule)
  addPlanItem: (title: string, minutes: number) => void;
  togglePlanDone: (id: string) => void;
  deletePlanItem: (id: string) => void;
  clearDonePlan: () => void;

  // Tomorrow's Plan
  addTomorrowItem: (title: string, minutes: number) => void;
  toggleTomorrowDone: (id: string) => void;
  deleteTomorrowItem: (id: string) => void;

  // Pending Tasks
  getPendingTasks: () => PendingTaskItem[];
  movePendingToTomorrow: (source: 'target' | 'plan', id: string) => void;
  deletePendingItem: (source: 'target' | 'plan', id: string) => void;

  // Homework
  addHomework: (text: string) => void;
  toggleHomeworkDone: (id: string) => void;
  deleteHomework: (id: string) => void;
  clearDoneHomework: () => void;

  // Backups
  backups: BackupSnapshot[];
  createBackup: (mode?: 'manual' | 'auto') => void;
  restoreBackup: (backupId: string) => void;
  deleteBackup: (backupId: string) => void;
  deleteOldBackups: () => void;
  importBackupJson: (rawJson: string) => boolean;
}

const StudyContext = createContext<StudyContextValue | null>(null);

function normalizeState(parsed: Partial<StudyWarState>, savedTheme?: ThemeId | null): StudyWarState {
  return {
    ...INITIAL_STATE,
    ...parsed,
    themeId: savedTheme || parsed.themeId || DEFAULT_THEME_ID,
    profile: {
      ...INITIAL_STATE.profile,
      ...(parsed.profile || {}),
    },
    settings: {
      ...INITIAL_STATE.settings,
      ...(parsed.settings || {}),
    },
    subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
    chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
    targets: Array.isArray(parsed.targets) ? parsed.targets : [],
    plan: Array.isArray(parsed.plan) ? parsed.plan : [],
    tomorrowPlan: Array.isArray(parsed.tomorrowPlan) ? parsed.tomorrowPlan : [],
    homework: Array.isArray(parsed.homework) ? parsed.homework : [],
    lastActiveDate: parsed.lastActiveDate || getTodayDateKey(),
  };
}

function rolloverStateIfNewDay(
  state: StudyWarState,
  todayKey: string
): { nextState: StudyWarState; movedCount: number } {
  if (!state.lastActiveDate || state.lastActiveDate === todayKey) {
    return {
      nextState: state.lastActiveDate ? state : { ...state, lastActiveDate: todayKey },
      movedCount: 0,
    };
  }

  const movedItems = state.tomorrowPlan.map((item, idx) => ({
    ...item,
    id: `pl-${Date.now()}-${idx}`,
    done: false,
  }));

  return {
    nextState: {
      ...state,
      plan: [...state.plan, ...movedItems],
      tomorrowPlan: [],
      lastActiveDate: todayKey,
    },
    movedCount: movedItems.length,
  };
}

function loadInitialState(): StudyWarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StudyWarState>;
      const normalized = normalizeState(parsed, savedTheme);
      return rolloverStateIfNewDay(normalized, getTodayDateKey()).nextState;
    }
    if (savedTheme) {
      return { ...INITIAL_STATE, themeId: savedTheme, lastActiveDate: getTodayDateKey() };
    }
  } catch {
    // Fallback to blank initial state
  }
  return { ...INITIAL_STATE, lastActiveDate: getTodayDateKey() };
}

function loadInitialBackups(): BackupSnapshot[] {
  try {
    const raw = localStorage.getItem(BACKUPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BackupSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatBackupLabel(mode: 'auto' | 'manual', date: Date): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = date.getDate();
  const mon = months[date.getMonth()];
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${mode === 'auto' ? 'AUTO' : 'MANUAL'} • ${day} ${mon}, ${hh}:${mm}`;
}

function buildContentSignature(s: StudyWarState): string {
  return JSON.stringify({
    themeId: s.themeId,
    profile: s.profile,
    subjects: s.subjects,
    chapters: s.chapters,
    targets: s.targets,
    plan: s.plan,
    tomorrowPlan: s.tomorrowPlan,
    homework: s.homework,
  });
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyWarState>(loadInitialState);
  const [backups, setBackups] = useState<BackupSnapshot[]>(loadInitialBackups);
  const [activeTab, setActiveTab] = useState<TabKey>('HOME');
  const [focusLaunchCount, setFocusLaunchCount] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const lastAutoSigRef = useRef<string>(buildContentSignature(state));
  const prevBackupModeRef = useRef(state.settings.backupMode);
  const stateRef = useRef(state);
  stateRef.current = state;

  const openFocusMode = () => {
    setFocusLaunchCount((c) => c + 1);
    setActiveTab('FOCUS');
  };

  const currentTheme = useMemo(
    () => THEMES.find((t) => t.id === state.themeId) || THEMES[0],
    [state.themeId]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', currentTheme.primary);
    root.style.setProperty('--primary-dark', currentTheme.primaryDark);
    root.style.setProperty('--primary-rgb', currentTheme.primaryRgb);
    root.style.setProperty('--hero-text', currentTheme.heroText);
  }, [currentTheme]);

  useEffect(() => {
    soundEngine.setEnabled(state.settings.soundEnabled);
    soundEngine.setHapticsEnabled(state.settings.hapticsEnabled !== false);
  }, [state.settings.soundEnabled, state.settings.hapticsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(THEME_STORAGE_KEY, state.themeId);
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify(backups));
    } catch {
      // Ignore storage quota errors
    }
  }, [backups]);

  // Midnight Auto-Move: Tomorrow's Plan -> Today's Plan
  useEffect(() => {
    const checkRollover = () => {
      const todayKey = getTodayDateKey();
      const current = stateRef.current;
      if (current.lastActiveDate === todayKey) return;
      const { nextState, movedCount } = rolloverStateIfNewDay(current, todayKey);
      setState(nextState);
      if (movedCount > 0) {
        setToast('Tomorrow Moved to Today');
      }
    };

    const intervalId = window.setInterval(checkRollover, 30_000);
    document.addEventListener('visibilitychange', checkRollover);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', checkRollover);
    };
  }, []);

  const showToast = (msg: string) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const buildSnapshot = (targetState: StudyWarState, mode: 'manual' | 'auto'): BackupSnapshot => {
    const now = new Date();
    return {
      id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now.getTime(),
      label: formatBackupLabel(mode, now),
      mode,
      summary: `${targetState.subjects.length} SUB • ${targetState.chapters.length} CH`,
      data: JSON.parse(JSON.stringify(targetState)) as StudyWarState,
    };
  };

  // Auto-backup when backupMode === 'auto'
  useEffect(() => {
    const mode = state.settings.backupMode;
    const switchedToAuto = prevBackupModeRef.current !== 'auto' && mode === 'auto';
    prevBackupModeRef.current = mode;

    if (mode !== 'auto') return;
    const currentSig = buildContentSignature(state);
    if (!switchedToAuto && currentSig === lastAutoSigRef.current) return;

    const timer = window.setTimeout(() => {
      const snap = buildSnapshot(state, 'auto');
      lastAutoSigRef.current = currentSig;
      setBackups((prev) => {
        const withoutOldAuto = prev.filter((b) => b.mode !== 'auto');
        return [snap, ...withoutOldAuto].slice(0, MAX_BACKUPS);
      });
    }, switchedToAuto ? 250 : 1200);

    return () => window.clearTimeout(timer);
  }, [state]);

  const setTheme = (themeId: ThemeId) => {
    const found = THEMES.find((t) => t.id === themeId);
    if (!found) return;
    setState((prev) => ({ ...prev, themeId }));
    showToast(`Theme Changed to ${found.name}`);
  };

  const updateProfile = (profile: UserProfile) => {
    setState((prev) => ({
      ...prev,
      profile: {
        name: profile.name.trim(),
        studentClass: profile.studentClass.trim(),
        bio: profile.bio.trim().slice(0, 60),
        photoDataUrl: profile.photoDataUrl,
      },
    }));
    showToast('Profile Saved');
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
    showToast('Saved');
  };

  const dismissEditHint = () => {
    setState((prev) => {
      if (prev.settings.editHintDismissed) return prev;
      return {
        ...prev,
        settings: { ...prev.settings, editHintDismissed: true },
      };
    });
  };

  const resetAllData = () => {
    setState({ ...INITIAL_STATE, lastActiveDate: getTodayDateKey() });
    setSelectedSubjectId(null);
    showToast('Reset Done');
  };

  // Subjects
  const addSubject = (name: string, studentClass: string): string => {
    const trimmed = name.trim();
    const id = `sub-${Date.now()}`;
    setState((prev) => {
      const color = SUBJECT_COLORS[prev.subjects.length % SUBJECT_COLORS.length];
      return {
        ...prev,
        subjects: [...prev.subjects, { id, name: trimmed, studentClass, color }],
      };
    });
    soundEngine.playAdd();
    showToast('Subject Added');
    return id;
  };

  const renameSubject = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, name: trimmed } : s)),
    }));
    showToast('Subject Updated');
  };

  const deleteSubject = (id: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
      chapters: prev.chapters.filter((c) => c.subjectId !== id),
    }));
    if (selectedSubjectId === id) {
      setSelectedSubjectId(null);
    }
    soundEngine.playDelete();
    showToast('Deleted');
  };

  // Chapters
  const addChapter = (subjectId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { id: `ch-${Date.now()}`, subjectId, name: trimmed, done: false, revise: false },
      ],
    }));
    soundEngine.playAdd();
    showToast('Chapter Added');
  };

  const addBulkChapters = (subjectId: string, fromNum: number, toNum: number) => {
    const start = Math.max(1, Math.min(fromNum, toNum));
    const end = Math.min(start + 49, Math.max(fromNum, toNum));
    const baseTime = Date.now();
    const generated = Array.from({ length: end - start + 1 }, (_, idx) => ({
      id: `ch-${baseTime}-${idx}`,
      subjectId,
      name: `Chapter ${start + idx}`,
      done: false,
      revise: false,
    }));

    setState((prev) => ({
      ...prev,
      chapters: [...prev.chapters, ...generated],
    }));
    soundEngine.playAdd();
    showToast(`${generated.length} Chapters Added`);
  };

  const toggleChapterDone = (chapterId: string) => {
    const target = state.chapters.find((c) => c.id === chapterId);
    if (target) soundEngine.playTick(!target.done);
    setState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapterId ? { ...c, done: !c.done } : c
      ),
    }));
  };

  const toggleChapterRevise = (chapterId: string) => {
    const target = state.chapters.find((c) => c.id === chapterId);
    const nextRevise = target ? !target.revise : true;
    soundEngine.playPop();
    setState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapterId ? { ...c, revise: !c.revise } : c
      ),
    }));
    showToast(nextRevise ? 'Marked Revise' : 'Revise Removed');
  };

  const renameChapter = (chapterId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapterId ? { ...c, name: trimmed } : c
      ),
    }));
    showToast('Updated');
  };

  const deleteChapter = (chapterId: string) => {
    setState((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((c) => c.id !== chapterId),
    }));
    soundEngine.playDelete();
    showToast('Deleted');
  };

  // Targets
  const addTarget = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      targets: [...prev.targets, { id: `tg-${Date.now()}`, text: trimmed, done: false }],
    }));
    soundEngine.playAdd();
    showToast('Target Added');
  };

  const toggleTargetDone = (id: string) => {
    const target = state.targets.find((t) => t.id === id);
    if (target) {
      const nextDone = !target.done;
      soundEngine.playTick(nextDone);
      if (
        nextDone &&
        state.targets.length > 0 &&
        state.targets.every((t) => (t.id === id ? nextDone : t.done))
      ) {
        window.setTimeout(() => soundEngine.playWarWon(), 140);
      }
    }
    setState((prev) => ({
      ...prev,
      targets: prev.targets.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  };

  const renameTarget = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      targets: prev.targets.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
    }));
    showToast('Updated');
  };

  const deleteTarget = (id: string) => {
    setState((prev) => ({
      ...prev,
      targets: prev.targets.filter((t) => t.id !== id),
    }));
    soundEngine.playDelete();
    showToast('Deleted');
  };

  // Today's Plan
  const addPlanItem = (title: string, minutes: number) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      plan: [...prev.plan, { id: `pl-${Date.now()}`, title: trimmed, minutes, done: false }],
    }));
    soundEngine.playAdd();
    showToast('Added to Today');
  };

  const togglePlanDone = (id: string) => {
    const item = state.plan.find((p) => p.id === id);
    if (item) soundEngine.playTick(!item.done);
    setState((prev) => ({
      ...prev,
      plan: prev.plan.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    }));
  };

  const deletePlanItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      plan: prev.plan.filter((p) => p.id !== id),
    }));
    soundEngine.playDelete();
    showToast('Deleted');
  };

  const clearDonePlan = () => {
    setState((prev) => ({
      ...prev,
      plan: prev.plan.filter((p) => !p.done),
    }));
    soundEngine.playDelete();
    showToast('Cleared Done');
  };

  // Tomorrow's Plan
  const addTomorrowItem = (title: string, minutes: number) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      tomorrowPlan: [
        ...prev.tomorrowPlan,
        { id: `tm-${Date.now()}`, title: trimmed, minutes, done: false },
      ],
    }));
    soundEngine.playAdd();
    showToast('Added for Tomorrow');
  };

  const toggleTomorrowDone = (id: string) => {
    const item = state.tomorrowPlan.find((p) => p.id === id);
    if (item) soundEngine.playTick(!item.done);
    setState((prev) => ({
      ...prev,
      tomorrowPlan: prev.tomorrowPlan.map((p) =>
        p.id === id ? { ...p, done: !p.done } : p
      ),
    }));
  };

  const deleteTomorrowItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      tomorrowPlan: prev.tomorrowPlan.filter((p) => p.id !== id),
    }));
    soundEngine.playDelete();
    showToast('Deleted');
  };

  // Pending Tasks
  const getPendingTasks = (): PendingTaskItem[] => {
    const undoneTargets: PendingTaskItem[] = state.targets
      .filter((t) => !t.done)
      .map((t) => ({ id: t.id, source: 'target', title: t.text }));
    const undonePlan: PendingTaskItem[] = state.plan
      .filter((p) => !p.done)
      .map((p) => ({
        id: p.id,
        source: 'plan',
        title: p.title,
        minutes: p.minutes,
      }));
    return [...undoneTargets, ...undonePlan];
  };

  const movePendingToTomorrow = (source: 'target' | 'plan', id: string) => {
    setState((prev) => {
      if (source === 'target') {
        const found = prev.targets.find((t) => t.id === id);
        if (!found) return prev;
        return {
          ...prev,
          targets: prev.targets.filter((t) => t.id !== id),
          tomorrowPlan: [
            ...prev.tomorrowPlan,
            { id: `tm-${Date.now()}`, title: found.text, minutes: 30, done: false },
          ],
        };
      }
      const found = prev.plan.find((p) => p.id === id);
      if (!found) return prev;
      return {
        ...prev,
        plan: prev.plan.filter((p) => p.id !== id),
        tomorrowPlan: [
          ...prev.tomorrowPlan,
          { id: `tm-${Date.now()}`, title: found.title, minutes: found.minutes, done: false },
        ],
      };
    });
    showToast('Moved to Tomorrow');
  };

  const deletePendingItem = (source: 'target' | 'plan', id: string) => {
    if (source === 'target') {
      deleteTarget(id);
    } else {
      deletePlanItem(id);
    }
  };

  // Homework
  const addHomework = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      homework: [...prev.homework, { id: `hw-${Date.now()}`, text: trimmed, done: false }],
    }));
    soundEngine.playAdd();
    showToast('Homework Added');
  };

  const toggleHomeworkDone = (id: string) => {
    const item = state.homework.find((h) => h.id === id);
    if (item) soundEngine.playTick(!item.done);
    setState((prev) => ({
      ...prev,
      homework: prev.homework.map((h) => (h.id === id ? { ...h, done: !h.done } : h)),
    }));
  };

  const deleteHomework = (id: string) => {
    setState((prev) => ({
      ...prev,
      homework: prev.homework.filter((h) => h.id !== id),
    }));
    soundEngine.playDelete();
    showToast('Deleted');
  };

  const clearDoneHomework = () => {
    setState((prev) => ({
      ...prev,
      homework: prev.homework.filter((h) => !h.done),
    }));
    soundEngine.playDelete();
    showToast('Cleared Done');
  };

  // Backups
  const createBackup = (mode: 'manual' | 'auto' = 'manual') => {
    const snap = buildSnapshot(state, mode);
    if (mode === 'auto') {
      lastAutoSigRef.current = buildContentSignature(state);
      setBackups((prev) => {
        const withoutOldAuto = prev.filter((b) => b.mode !== 'auto');
        return [snap, ...withoutOldAuto].slice(0, MAX_BACKUPS);
      });
    } else {
      setBackups((prev) => [snap, ...prev].slice(0, MAX_BACKUPS));
      soundEngine.playAdd();
      showToast('Backup Saved');
    }
  };

  const restoreBackup = (backupId: string) => {
    const found = backups.find((b) => b.id === backupId);
    if (!found) return;
    const restored = normalizeState(found.data);
    lastAutoSigRef.current = buildContentSignature(restored);
    setState(restored);
    setSelectedSubjectId(null);
    soundEngine.playSuccess();
    showToast('Backup Restored');
  };

  const deleteBackup = (backupId: string) => {
    setBackups((prev) => prev.filter((b) => b.id !== backupId));
    soundEngine.playDelete();
    showToast('Backup Deleted');
  };

  const deleteOldBackups = () => {
    setBackups((prev) => prev.slice(0, 1));
    soundEngine.playDelete();
    showToast('Old Backups Deleted');
  };

  const importBackupJson = (rawJson: string): boolean => {
    try {
      const parsed = JSON.parse(rawJson) as Partial<StudyWarState> | { data?: Partial<StudyWarState> };
      const payload =
        parsed && typeof parsed === 'object' && 'data' in parsed && parsed.data
          ? parsed.data
          : (parsed as Partial<StudyWarState>);
      if (!payload || typeof payload !== 'object' || !Array.isArray(payload.subjects)) {
        showToast('Invalid Backup File');
        return false;
      }
      const restored = normalizeState(payload);
      lastAutoSigRef.current = buildContentSignature(restored);
      setState(restored);
      setSelectedSubjectId(null);
      soundEngine.playSuccess();
      showToast('Backup Loaded');
      return true;
    } catch {
      showToast('Invalid Backup File');
      return false;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        focusLaunchCount,
        openFocusMode,
        selectedSubjectId,
        setSelectedSubjectId,
        currentTheme,
        setTheme,
        toast,
        showToast,
        updateProfile,
        updateSettings,
        dismissEditHint,
        resetAllData,
        addSubject,
        renameSubject,
        deleteSubject,
        addChapter,
        addBulkChapters,
        toggleChapterDone,
        toggleChapterRevise,
        renameChapter,
        deleteChapter,
        addTarget,
        toggleTargetDone,
        renameTarget,
        deleteTarget,
        addPlanItem,
        togglePlanDone,
        deletePlanItem,
        clearDonePlan,
        addTomorrowItem,
        toggleTomorrowDone,
        deleteTomorrowItem,
        getPendingTasks,
        movePendingToTomorrow,
        deletePendingItem,
        addHomework,
        toggleHomeworkDone,
        deleteHomework,
        clearDoneHomework,
        backups,
        createBackup,
        restoreBackup,
        deleteBackup,
        deleteOldBackups,
        importBackupJson,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within StudyProvider');
  return ctx;
}
