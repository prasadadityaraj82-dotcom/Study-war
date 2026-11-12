import { useEffect, useState } from 'react';
import { Timer, User } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const SHORT_MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

function formatTodayPill(date: Date): string {
  const day = SHORT_DAYS[date.getDay()];
  const num = date.getDate();
  const month = SHORT_MONTHS[date.getMonth()];
  return `${day}, ${num} ${month}`;
}

export function TopBar() {
  const { state, setActiveTab, openFocusMode } = useStudy();
  const displayName = state.profile.name ? state.profile.name : 'YOUR NAME';
  const photo = state.profile.photoDataUrl;
  const [dateLabel, setDateLabel] = useState(() => formatTodayPill(new Date()));

  useEffect(() => {
    const syncDate = () => setDateLabel(formatTodayPill(new Date()));
    const interval = window.setInterval(syncDate, 60_000);
    document.addEventListener('visibilitychange', syncDate);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', syncDate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#000000]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Profile Photo + Name */}
        <button
          type="button"
          onClick={() => setActiveTab('PROFILE')}
          className="btn-flat flex items-center gap-2 sm:gap-2.5 min-h-[42px] min-w-0 cursor-pointer"
          aria-label="Edit profile"
        >
          <div className="relative shrink-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 overflow-hidden flex items-center justify-center bg-[#1E1E1E]"
              style={{ borderColor: 'var(--primary)' }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} style={{ color: 'var(--primary)' }} />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22FF88] border-2 border-[#000000]" />
          </div>
          <span className="font-display text-base sm:text-lg font-extrabold tracking-wide uppercase text-white truncate">
            {displayName}
          </span>
        </button>

        {/* Right: Auto Date Grey Pill + Focus Pink Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1E1E1E] border border-white/[0.08] text-[#D4D4D4] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap">
            {dateLabel}
          </span>

          <button
            type="button"
            onClick={openFocusMode}
            className="btn-flat !rounded-full px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--hero-text)',
            }}
          >
            <Timer size={13} strokeWidth={2.5} />
            <span>FOCUS</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('HOME')}
          className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white leading-none cursor-pointer"
        >
          STUDY WAR
        </button>
      </div>
    </header>
  );
}
