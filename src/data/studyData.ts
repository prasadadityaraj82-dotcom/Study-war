import { StudyWarState } from '../types';

export const QUICK_SUBJECT_CHIPS = ['Gujarati', 'Hindi', 'Sanskrit', 'Computer'];

export const SUBJECT_COLORS = [
  '#A78BFA', // Purple
  '#FB923C', // Orange
  '#FACC15', // Yellow
  '#22D3EE', // Cyan
];

export const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export function getTodayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
  targets: [],
  plan: [],
  tomorrowPlan: [],
  homework: [],
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
