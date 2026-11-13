import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Coffee, Pause, Play, Plus, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatLastRevised } from '../data/studyData';
import { soundEngine } from '../utils/soundEngine';

const TIME_CIRCLES = [15, 25, 45, 60];

export function FocusView() {
  const { state, setActiveTab, toggleChapterDone, logFocusSession } = useStudy();

  const [step, setStep] = useState<
    'PICK_CHAPTER' | 'PICK_TIME' | 'READY' | 'RUNNING' | 'DONE' | 'BREAK' | 'BREAK_DONE'
  >('PICK_CHAPTER');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [chapterFilter, setChapterFilter] = useState<'ALL' | 'REVISE'>('ALL');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [sessionTotalMinutes, setSessionTotalMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const [loggedMinutes, setLoggedMinutes] = useState<number>(25);
  const [isPaused, setIsPaused] = useState(false);
  const loggedRef = useRef(false);

  // Wall-clock accurate countdown (stays exact even if Android sleeps or switches tabs)
  useEffect(() => {
    if ((step !== 'RUNNING' && step !== 'BREAK') || isPaused || endTimeMs === null) {
      return;
    }

    const syncClock = () => {
      const remaining = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        soundEngine.playFocusBell();
        setEndTimeMs(null);
        setStep(step === 'BREAK' ? 'BREAK_DONE' : 'DONE');
      }
    };

    syncClock();
    const id = window.setInterval(syncClock, 500);
    document.addEventListener('visibilitychange', syncClock);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', syncClock);
    };
  }, [step, isPaused, endTimeMs]);

  useEffect(() => {
    if (step === 'DONE' && !loggedRef.current) {
      loggedRef.current = true;
      const elapsedSeconds = Math.max(0, sessionTotalMinutes * 60 - secondsLeft);
      const earned =
        secondsLeft === 0
          ? sessionTotalMinutes
          : Math.max(1, Math.round(elapsedSeconds / 60));
      setLoggedMinutes(earned);
      logFocusSession(earned);
    }
  }, [step, sessionTotalMinutes, secondsLeft, logFocusSession]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const studiedChapter = selectedChapterId
    ? state.chapters.find((c) => c.id === selectedChapterId)
    : undefined;
  const filteredChapters =
    chapterFilter === 'REVISE'
      ? state.chapters.filter((c) => c.revise)
      : state.chapters;

  if (step === 'PICK_CHAPTER') {
    return (
      <div className="min-h-[65vh] flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#8A8A8A]">
            STEP 1 OF 3
          </span>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
              WHAT TO STUDY?
            </h1>

            {state.chapters.length > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-[#1E1E1E] p-1 border border-white/10">
                {(['ALL', 'REVISE'] as const).map((tab) => {
                  const active = chapterFilter === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setChapterFilter(tab)}
                      className="btn-flat !rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
                      style={{
                        backgroundColor: active ? 'var(--primary)' : 'transparent',
                        color: active ? 'var(--hero-text)' : '#8A8A8A',
                      }}
                    >
                      {tab === 'ALL' ? 'ALL' : 'REVISE ONLY'}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Always-Available FREE FOCUS Option (works even with 0 chapters) */}
          <button
            type="button"
            onClick={() => {
              setSelectedChapterId('');
              setSelectedChapter('FREE FOCUS');
            }}
            style={{
              borderColor:
                selectedChapter === 'FREE FOCUS' && !selectedChapterId
                  ? 'var(--primary)'
                  : 'rgba(255,255,255,0.08)',
            }}
            className="card-flat w-full p-4 flex items-center justify-between gap-3 text-left border-2 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl bg-[#000000] flex items-center justify-center shrink-0"
                style={{ color: 'var(--primary)' }}
              >
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-extrabold text-white uppercase">
                  FREE FOCUS
                </p>
                <p className="text-[11px] font-bold uppercase text-[#8A8A8A]">
                  ANY TOPIC OR REVISION
                </p>
              </div>
            </div>
            <div
              className={`tick-flat ${
                selectedChapter === 'FREE FOCUS' && !selectedChapterId ? 'tick-flat-done' : ''
              }`}
            >
              {selectedChapter === 'FREE FOCUS' && !selectedChapterId && (
                <Check size={16} strokeWidth={3} />
              )}
            </div>
          </button>

          {state.chapters.length > 0 && filteredChapters.length === 0 ? (
            <div className="card-flat p-6 text-center">
              <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
                No Revise Chapters
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredChapters.map((ch, idx) => {
                const sub = state.subjects.find((s) => s.id === ch.subjectId);
                const active = selectedChapterId === ch.id;
                const revisedInfo = formatLastRevised(ch.lastRevisedAt);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      setSelectedChapter(ch.name);
                    }}
                    style={{
                      animationDelay: `${Math.min(idx * 60, 240)}ms`,
                      borderColor: active ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                    }}
                    className="card-flat animate-item-in w-full p-4 flex items-center justify-between gap-3 text-left border-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      {sub && (
                        <p
                          className="text-[11px] font-extrabold uppercase"
                          style={{ color: sub.color }}
                        >
                          {sub.name}
                        </p>
                      )}
                      <p className="text-base sm:text-lg font-extrabold text-white truncate">
                        {ch.name}
                      </p>
                      {revisedInfo && (
                        <p
                          className="text-[10px] font-extrabold uppercase tracking-wider mt-0.5"
                          style={{ color: revisedInfo.isDue ? '#FB923C' : '#8A8A8A' }}
                        >
                          {revisedInfo.label}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ch.revise && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F97316]/20 text-[#FB923C] text-[10px] font-extrabold uppercase">
                          REVISE
                        </span>
                      )}
                      <div className={`tick-flat ${active ? 'tick-flat-done' : ''}`}>
                        {active && <Check size={16} strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main 3D Pink [NEXT] */}
        <button
          type="button"
          disabled={!selectedChapter}
          onClick={() => setStep('PICK_TIME')}
          className="btn-3d-main w-full min-h-[54px] tracking-wider cursor-pointer"
        >
          NEXT
        </button>
      </div>
    );
  }

  if (step === 'PICK_TIME') {
    return (
      <div className="min-h-[65vh] flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('PICK_CHAPTER')}
              aria-label="Back to topic"
              className="btn-flat w-10 h-10 bg-[#1E1E1E] text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8A8A8A]">
              STEP 2 OF 3
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
            HOW LONG?
          </h1>

          {/* 4 FLAT Circles [15 MIN] [25 MIN] [45 MIN] [60 MIN] */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 pt-4">
            {TIME_CIRCLES.map((m) => {
              const active = selectedMinutes === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMinutes(m)}
                  className="btn-flat aspect-square !rounded-full flex flex-col items-center justify-center border-2 cursor-pointer"
                  style={{
                    backgroundColor: active ? 'var(--primary)' : '#1E1E1E',
                    color: active ? 'var(--hero-text)' : '#FFFFFF',
                    borderColor: active ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <span className="font-display text-2xl sm:text-4xl font-extrabold leading-none">
                    {m}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase mt-1">MIN</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 3D Pink [NEXT] */}
        <button
          type="button"
          onClick={() => {
            loggedRef.current = false;
            setSessionTotalMinutes(selectedMinutes);
            setSecondsLeft(selectedMinutes * 60);
            setEndTimeMs(null);
            setIsPaused(false);
            setStep('READY');
          }}
          className="btn-3d-main w-full min-h-[54px] tracking-wider cursor-pointer"
        >
          NEXT
        </button>
      </div>
    );
  }

  if (step === 'READY') {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-full max-w-sm flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep('PICK_TIME')}
            aria-label="Back to duration"
            className="btn-flat w-10 h-10 bg-[#1E1E1E] text-white flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#8A8A8A]">
            STEP 3 OF 3
          </span>
          <span className="w-10" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
          READY TO START?
        </h1>

        <div className="card-flat w-full max-w-sm p-8 space-y-3 border border-white/[0.06]">
          <p className="font-mono-num text-6xl font-extrabold text-white leading-none">
            {String(selectedMinutes).padStart(2, '0')}:00
          </p>
          <p className="text-base font-extrabold text-[#8A8A8A] uppercase">
            {selectedChapter}
          </p>
        </div>

        {/* Main 3D Pink [START] */}
        <button
          type="button"
          onClick={() => {
            setIsPaused(false);
            setEndTimeMs(Date.now() + secondsLeft * 1000);
            setStep('RUNNING');
          }}
          className="btn-3d-main w-full max-w-sm min-h-[56px] !text-lg tracking-wider cursor-pointer"
        >
          START
        </button>
      </div>
    );
  }

  if (step === 'RUNNING') {
    return (
      <div className="min-h-[68vh] flex flex-col items-center justify-center text-center space-y-5">
        <div className="card-flat w-full max-w-sm p-10 space-y-4 border border-white/[0.06]">
          <p className="font-mono-num text-6xl sm:text-7xl font-extrabold text-white leading-none">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
          <p className="text-sm font-extrabold uppercase text-[#8A8A8A]">
            {isPaused ? `PAUSED • ${selectedChapter}` : selectedChapter}
          </p>
        </div>

        {/* Flat Controls: [PAUSE / RESUME] & [+5 MIN] */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={() => {
              if (isPaused) {
                setEndTimeMs(Date.now() + secondsLeft * 1000);
                setIsPaused(false);
              } else {
                const rem =
                  endTimeMs !== null
                    ? Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000))
                    : secondsLeft;
                setSecondsLeft(rem);
                setEndTimeMs(null);
                setIsPaused(true);
              }
            }}
            className="btn-flat min-h-[48px] bg-[#1E1E1E] text-white text-xs tracking-wider inline-flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSessionTotalMinutes((m) => m + 5);
              setSecondsLeft((prev) => prev + 300);
              setEndTimeMs((prev) => (prev !== null ? prev + 300_000 : null));
            }}
            className="btn-flat min-h-[48px] bg-[#1E1E1E] text-white text-xs tracking-wider inline-flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
          >
            <Plus size={15} strokeWidth={3} />
            <span>5 MIN</span>
          </button>
        </div>

        {/* Main 3D Pink [DONE] */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playFocusBell();
            setEndTimeMs(null);
            setStep('DONE');
          }}
          className="btn-3d-main w-full max-w-sm min-h-[56px] !text-lg tracking-wider cursor-pointer"
        >
          DONE
        </button>
      </div>
    );
  }

  if (step === 'BREAK') {
    return (
      <div className="min-h-[68vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="card-flat w-full max-w-sm p-10 space-y-4 border border-white/[0.06]">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#22C55E]">
            SHORT BREAK
          </p>
          <p className="font-mono-num text-6xl sm:text-7xl font-extrabold text-white leading-none">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
          <p className="text-xs font-extrabold uppercase text-[#8A8A8A]">
            REST YOUR EYES
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEndTimeMs(null);
            setStep('BREAK_DONE');
          }}
          className="btn-flat w-full max-w-sm min-h-[50px] bg-[#1E1E1E] text-white text-sm tracking-wider border border-white/10 cursor-pointer"
        >
          SKIP BREAK
        </button>
      </div>
    );
  }

  if (step === 'BREAK_DONE') {
    return (
      <div className="min-h-[68vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border-2 border-[#22C55E] text-[#22C55E] flex items-center justify-center animate-item-in">
          <Coffee size={36} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
          BREAK OVER
        </h1>
        <button
          type="button"
          onClick={() => {
            loggedRef.current = false;
            setStep('PICK_CHAPTER');
          }}
          className="btn-3d-main w-full max-w-sm min-h-[56px] !text-lg tracking-wider cursor-pointer"
        >
          NEXT ROUND
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('HOME')}
          className="btn-flat w-full max-w-sm min-h-[48px] bg-[#1E1E1E] text-white text-sm tracking-wider cursor-pointer"
        >
          GO HOME
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[68vh] flex flex-col items-center justify-center text-center space-y-5">
      <div className="w-20 h-20 rounded-full bg-[#22C55E] text-white flex items-center justify-center animate-item-in">
        <Check size={40} strokeWidth={3.5} />
      </div>

      <h1 className="font-display text-4xl font-extrabold uppercase text-white">
        Done
      </h1>

      <div className="space-y-1">
        <p
          className="font-mono-num text-base font-extrabold uppercase"
          style={{ color: 'var(--primary)' }}
        >
          +{loggedMinutes} MIN LOGGED
        </p>
        <p className="font-mono-num text-xs font-extrabold uppercase tracking-wider text-[#8A8A8A]">
          TODAY: {state.focusedTodayMinutes} MIN FOCUSED
        </p>
      </div>

      {/* Flat [MARK CHAPTER DONE] Option */}
      {studiedChapter && (
        <button
          type="button"
          disabled={studiedChapter.done}
          onClick={() => toggleChapterDone(studiedChapter.id)}
          className="btn-flat w-full max-w-sm min-h-[50px] text-sm tracking-wider inline-flex items-center justify-center gap-2 border cursor-pointer"
          style={{
            backgroundColor: studiedChapter.done ? 'rgba(34, 197, 94, 0.18)' : '#1E1E1E',
            borderColor: studiedChapter.done ? '#22C55E' : 'rgba(255,255,255,0.12)',
            color: studiedChapter.done ? '#4ADE80' : '#FFFFFF',
            opacity: 1,
          }}
        >
          <Check size={17} strokeWidth={3} />
          <span>{studiedChapter.done ? 'CHAPTER DONE' : 'MARK CHAPTER DONE'}</span>
        </button>
      )}

      {/* Flat [5 MIN BREAK] Option */}
      <button
        type="button"
        onClick={() => {
          setIsPaused(false);
          setSecondsLeft(300);
          setEndTimeMs(Date.now() + 300_000);
          setStep('BREAK');
        }}
        className="btn-flat w-full max-w-sm min-h-[48px] bg-[#1E1E1E] text-white text-sm tracking-wider inline-flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
      >
        <Coffee size={16} style={{ color: 'var(--primary)' }} />
        <span>5 MIN BREAK</span>
      </button>

      {/* Main 3D Pink [GO HOME] */}
      <button
        type="button"
        onClick={() => setActiveTab('HOME')}
        className="btn-3d-main w-full max-w-sm min-h-[56px] !text-lg tracking-wider cursor-pointer"
      >
        GO HOME
      </button>
    </div>
  );
}
