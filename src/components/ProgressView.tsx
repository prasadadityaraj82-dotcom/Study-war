import { useEffect, useState } from 'react';
import { useStudy } from '../context/StudyContext';

export function ProgressView() {
  const { state } = useStudy();

  const totalChapters = state.chapters.length;
  const doneChapters = state.chapters.filter((c) => c.done).length;

  const todayTotal = state.targets.length + state.plan.length + state.homework.length;
  const todayDone =
    state.targets.filter((t) => t.done).length +
    state.plan.filter((p) => p.done).length +
    state.homework.filter((h) => h.done).length;
  const remainingTasks =
    Math.max(0, todayTotal - todayDone) + Math.max(0, totalChapters - doneChapters);

  const [displayDone, setDisplayDone] = useState(0);
  const [displayToday, setDisplayToday] = useState(0);
  const [displayRemaining, setDisplayRemaining] = useState(0);

  // Smooth 400ms count animation
  useEffect(() => {
    const startTime = performance.now();
    const duration = 400;
    const fromDone = displayDone;
    const fromToday = displayToday;
    const fromRem = displayRemaining;

    let rafId = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayDone(Math.round(fromDone + (doneChapters - fromDone) * eased));
      setDisplayToday(Math.round(fromToday + (todayDone - fromToday) * eased));
      setDisplayRemaining(Math.round(fromRem + (remainingTasks - fromRem) * eased));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneChapters, todayDone, remainingTasks]);

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const ratio = totalChapters > 0 ? doneChapters / totalChapters : 0;
  const strokeDashoffset = circumference - ratio * circumference;

  const getExamCountdownLabel = (): string | null => {
    const raw = state.settings.examDate;
    if (!raw) return null;
    const [y, m, d] = raw.split('-').map(Number);
    if (!y || !m || !d) return null;
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const examMidnight = new Date(y, m - 1, d).getTime();
    const diffDays = Math.round((examMidnight - todayMidnight) / 86_400_000);
    if (diffDays > 1) return `${diffDays} DAYS LEFT`;
    if (diffDays === 1) return '1 DAY LEFT';
    if (diffDays === 0) return 'EXAM TODAY';
    return 'EXAM PASSED';
  };

  const examLabel = getExamCountdownLabel();

  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <section className="card-flat animate-card-in w-full max-w-md p-8 flex flex-col items-center text-center space-y-6 border border-white/[0.06]">
        {examLabel && (
          <span
            className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--hero-text)',
            }}
          >
            {examLabel}
          </span>
        )}

        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#000000"
              strokeWidth="14"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="var(--primary)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-400"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            {totalChapters === 0 ? (
              <span
                className="font-display text-2xl font-extrabold uppercase leading-tight"
                style={{ color: 'var(--primary)' }}
              >
                NO TARGET YET
              </span>
            ) : (
              <>
                <span className="font-display text-4xl font-extrabold text-white tabular-nums leading-none">
                  {displayDone} / {totalChapters}
                </span>
                <span
                  className="text-xs font-extrabold uppercase tracking-widest mt-1.5"
                  style={{ color: 'var(--primary)' }}
                >
                  DONE
                </span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-base font-extrabold text-white font-mono-num">
            Today: {displayToday} {displayToday === 1 ? 'Task' : 'Tasks'} Done
          </p>
          <p className="text-base font-extrabold text-[#8A8A8A] font-mono-num">
            Remaining: {displayRemaining} {displayRemaining === 1 ? 'Task' : 'Tasks'} Left
          </p>
        </div>
      </section>
    </div>
  );
}
