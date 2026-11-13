import { StudyWarState, WeekdayKey, WeeklyRoutine } from '../types';

export const QUICK_SUBJECT_CHIPS = ['Gujarati', 'Hindi', 'Sanskrit', 'Computer'];

export const SUBJECT_COLORS = [
  '#A78BFA', // Purple
  '#FB923C', // Orange
  '#FACC15', // Yellow
  '#22D3EE', // Cyan
];

export const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export const WEEKDAYS: WeekdayKey[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function createEmptyRoutine(): WeeklyRoutine {
  return {
    MON: [],
    TUE: [],
    WED: [],
    THU: [],
    FRI: [],
    SAT: [],
    SUN: [],
  };
}

export function getTodayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayWeekdayKey(date = new Date()): WeekdayKey {
  const map: WeekdayKey[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return map[date.getDay()];
}

export function formatLastRevised(
  dateKey?: string
): { label: string; isDue: boolean } | null {
  if (!dateKey) return null;
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return null;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const revisedMidnight = new Date(y, m - 1, d).getTime();
  const diffDays = Math.max(0, Math.round((todayMidnight - revisedMidnight) / 86_400_000));
  if (diffDays === 0) return { label: 'REVISED TODAY', isDue: false };
  if (diffDays >= 7) return { label: `DUE • ${diffDays}D AGO`, isDue: true };
  return { label: `${diffDays}D AGO`, isDue: false };
}

export const INITIAL_STATE: StudyWarState = {
  themeId: 'war-pink',
  profile: {
    name: '',
    studentClass: '',
    bio: '',
    photoDataUrl: '',
  },
  subjects: [],
  chapters: [],
  marks: [],
  notes: [],
  weeklyRoutine: createEmptyRoutine(),
  targets: [],
  plan: [],
  tomorrowPlan: [],
  homework: [],
  focusedTodayMinutes: 0,
  settings: {
    dailyGoalMinutes: 120,
    soundEnabled: true,
    hapticsEnabled: true,
    examDate: '',
    backupMode: 'manual',
    editHintDismissed: false,
  },
  lastActiveDate: getTodayDateKey(),
};
