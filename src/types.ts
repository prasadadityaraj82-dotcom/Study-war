export type TabKey =
  | 'HOME'
  | 'SUBJECTS'
  | 'SCHEDULE'
  | 'HOMEWORK'
  | 'PROGRESS'
  | 'MENU'
  | 'PROFILE'
  | 'FOCUS'
  | 'TOMORROW'
  | 'PENDING';

export type ThemeId =
  | 'war-pink'
  | 'electric-blue'
  | 'neon-green'
  | 'sunset-orange'
  | 'royal-purple'
  | 'crimson-red'
  | 'steel-gray'
  | 'rose-pink';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  primary: string;
  primaryDark: string;
  primaryRgb: string;
  heroText: '#FFFFFF' | '#0A0A0A';
}

export interface SubjectItem {
  id: string;
  name: string;
  studentClass: string;
  color: string;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  name: string;
  done: boolean;
  revise?: boolean;
  lastRevisedAt?: string;
}

export interface MarkItem {
  id: string;
  subjectId: string;
  title: string;
  scored: number;
  total: number;
  date: string;
}

export interface NoteItem {
  id: string;
  subjectId: string;
  text: string;
  date: string;
}

export type WeekdayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface RoutineSlot {
  id: string;
  title: string;
  minutes: number;
}

export type WeeklyRoutine = Record<WeekdayKey, RoutineSlot[]>;

export interface TargetItem {
  id: string;
  text: string;
  done: boolean;
}

export interface PlanItem {
  id: string;
  title: string;
  minutes: number;
  done: boolean;
}

export interface HomeworkItem {
  id: string;
  text: string;
  done: boolean;
}

export interface UserProfile {
  name: string;
  studentClass: string;
  bio: string;
  photoDataUrl: string;
}

export interface AppSettings {
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  examDate: string;
  backupMode: 'manual' | 'auto';
  editHintDismissed?: boolean;
}

export interface StudyWarState {
  themeId: ThemeId;
  profile: UserProfile;
  subjects: SubjectItem[];
  chapters: ChapterItem[];
  marks: MarkItem[];
  notes: NoteItem[];
  weeklyRoutine: WeeklyRoutine;
  targets: TargetItem[];
  plan: PlanItem[];
  tomorrowPlan: PlanItem[];
  homework: HomeworkItem[];
  focusedTodayMinutes: number;
  settings: AppSettings;
  lastActiveDate: string;
}

export interface BackupSnapshot {
  id: string;
  createdAt: number;
  label: string;
  mode: 'auto' | 'manual';
  summary: string;
  data: StudyWarState;
}
