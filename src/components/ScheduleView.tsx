import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarPlus, Check, MoreVertical, Plus, Timer, X } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getTodayWeekdayKey, WEEKDAYS } from '../data/studyData';
import { useLongPress } from '../hooks/useLongPress';
import { PlanItem, RoutineSlot, WeekdayKey } from '../types';
import { LongPressActionModal } from './StepModals';

const MINUTE_CHIPS = [15, 30, 45, 60];

function PlanCard({
  item,
  index,
  onToggle,
  onOpenMenu,
}: {
  item: PlanItem;
  index: number;
  onToggle: () => void;
  onOpenMenu: () => void;
}) {
  const { handlers, isHolding } = useLongPress(onOpenMenu, onToggle);

  return (
    <div
      {...handlers}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
      className={`card-flat animate-item-in pl-4 pr-2.5 py-4 sm:py-5 flex items-center gap-3.5 cursor-pointer border transition-all duration-150 ${
        item.done ? 'card-done-sweep ' : ''
      }${
        isHolding ? 'scale-[0.97] ring-2 ring-[var(--primary)]/50' : ''
      }`}
      style={{
        animationDelay: `${Math.min(index * 60, 240)}ms`,
        backgroundColor: item.done ? 'rgba(34, 197, 94, 0.12)' : '#1E1E1E',
        borderColor: isHolding
          ? 'var(--primary)'
          : item.done
            ? 'rgba(34, 197, 94, 0.35)'
            : 'rgba(255,255,255,0.06)',
      }}
    >
      <div className={`tick-flat ${item.done ? 'tick-flat-done' : ''}`}>
        {item.done && <Check size={16} strokeWidth={3} />}
      </div>

      <span
        className={`text-base sm:text-lg font-extrabold flex-1 min-w-0 break-words ${
          item.done ? 'line-through text-[#8A8A8A]' : 'text-white'
        }`}
      >
        {item.title} - {item.minutes} min
      </span>

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Delete ${item.title}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={17} />
      </button>
    </div>
  );
}

function RoutineCard({
  slot,
  index,
  onOpenMenu,
}: {
  slot: RoutineSlot;
  index: number;
  onOpenMenu: () => void;
}) {
  const { handlers, isHolding } = useLongPress(onOpenMenu, onOpenMenu);

  return (
    <div
      {...handlers}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpenMenu();
      }}
      style={{
        animationDelay: `${Math.min(index * 60, 240)}ms`,
        borderColor: isHolding ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
      }}
      className={`card-flat animate-item-in pl-4 pr-2.5 py-4 flex items-center justify-between gap-3 cursor-pointer border transition-all duration-150 ${
        isHolding ? 'scale-[0.97] ring-2 ring-[var(--primary)]/50' : ''
      }`}
    >
      <span className="text-base sm:text-lg font-extrabold text-white flex-1 min-w-0 break-words">
        {slot.title} - {slot.minutes} min
      </span>

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Delete ${slot.title}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={17} />
      </button>
    </div>
  );
}

export function ScheduleView() {
  const {
    state,
    setActiveTab,
    addPlanItem,
    renamePlanItem,
    togglePlanDone,
    deletePlanItem,
    clearDonePlan,
    addRoutineSlot,
    renameRoutineSlot,
    deleteRoutineSlot,
    loadTodayRoutine,
    dismissEditHint,
  } = useStudy();

  const todayWeekday = getTodayWeekdayKey();
  const [scheduleTab, setScheduleTab] = useState<'TODAY' | 'ROUTINE'>('TODAY');
  const [selectedDay, setSelectedDay] = useState<WeekdayKey>(todayWeekday);

  const [addMode, setAddMode] = useState<'TODAY' | 'ROUTINE' | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState<number>(30);
  const [deleteTarget, setDeleteTarget] = useState<PlanItem | null>(null);
  const [deleteRoutineTarget, setDeleteRoutineTarget] = useState<RoutineSlot | null>(null);

  const showHint = !state.settings.editHintDismissed;
  const hasDone = state.plan.some((p) => p.done);
  const todayRoutineSlots = state.weeklyRoutine[todayWeekday] || [];
  const selectedDaySlots = state.weeklyRoutine[selectedDay] || [];

  const quickChips = Array.from(
    new Set([
      ...state.subjects.map((s) => s.name),
      ...[...state.chapters]
        .sort((a, b) => Number(a.done) - Number(b.done))
        .map((c) => c.name),
    ])
  ).slice(0, 10);

  const openMenu = (item: PlanItem) => {
    dismissEditHint();
    setDeleteTarget(item);
  };

  const openRoutineMenu = (slot: RoutineSlot) => {
    dismissEditHint();
    setDeleteRoutineTarget(slot);
  };

  const openAdd = (mode: 'TODAY' | 'ROUTINE') => {
    setStep(1);
    setTitle('');
    setMinutes(30);
    setAddMode(mode);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            {scheduleTab === 'TODAY' ? "TODAY'S PLAN" : 'WEEKLY ROUTINE'}
          </h1>
          {showHint &&
            ((scheduleTab === 'TODAY' && state.plan.length > 0) ||
              (scheduleTab === 'ROUTINE' && selectedDaySlots.length > 0)) && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                HOLD TO EDIT
              </span>
            )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {scheduleTab === 'TODAY' && hasDone && (
            <button
              type="button"
              onClick={clearDonePlan}
              className="btn-flat px-3 py-2 bg-[#1E1E1E] text-[#EF4444] text-xs tracking-wider border border-[#EF4444]/30 cursor-pointer"
            >
              CLEAR DONE
            </button>
          )}
          {scheduleTab === 'TODAY' && todayRoutineSlots.length > 0 && (
            <button
              type="button"
              onClick={loadTodayRoutine}
              className="btn-flat px-3 py-2 bg-[#1E1E1E] text-white text-xs tracking-wider flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <CalendarPlus size={14} style={{ color: 'var(--primary)' }} />
              <span>LOAD TODAY</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('FOCUS')}
            className="btn-flat px-3.5 py-2 bg-[#1E1E1E] text-white text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <Timer size={15} />
            <span>FOCUS</span>
          </button>
        </div>
      </div>

      {/* Flat Segmented Switch: TODAY | ROUTINE */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#1E1E1E] p-1 border border-white/[0.06]">
        {(['TODAY', 'ROUTINE'] as const).map((tab) => {
          const active = scheduleTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setScheduleTab(tab)}
              className="btn-flat min-h-[40px] !rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              style={{
                backgroundColor: active ? 'var(--primary)' : 'transparent',
                color: active ? 'var(--hero-text)' : '#8A8A8A',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {scheduleTab === 'TODAY' ? (
        state.plan.length === 0 ? (
          <div className="min-h-[48vh] flex flex-col items-center justify-center text-center space-y-4">
            <p className="font-display text-3xl font-extrabold uppercase text-[#8A8A8A]">
              Nothing for Today
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Main 3D Pink Button #4: [ADD FOR TODAY] */}
              <button
                type="button"
                onClick={() => openAdd('TODAY')}
                className="btn-3d-main min-h-[54px] px-7 tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Plus size={20} strokeWidth={3} />
                <span>ADD FOR TODAY</span>
              </button>

              {todayRoutineSlots.length > 0 && (
                <button
                  type="button"
                  onClick={loadTodayRoutine}
                  className="btn-flat min-h-[50px] px-5 bg-[#1E1E1E] text-white text-xs tracking-wider flex items-center gap-2 border border-white/10 cursor-pointer"
                >
                  <CalendarPlus size={16} style={{ color: 'var(--primary)' }} />
                  <span>LOAD {todayWeekday}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2.5 pb-[100px]">
              {state.plan.map((item, idx) => (
                <PlanCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onToggle={() => togglePlanDone(item.id)}
                  onOpenMenu={() => openMenu(item)}
                />
              ))}
            </div>

            {/* Fixed Bottom Full-Width [ADD FOR TODAY] Button */}
            {typeof document !== 'undefined' &&
              createPortal(
                <div className="fixed bottom-[80px] left-0 right-0 z-30 px-4 pointer-events-none">
                  <div className="max-w-5xl mx-auto">
                    <button
                      type="button"
                      onClick={() => openAdd('TODAY')}
                      className="btn-3d-main pointer-events-auto w-full min-h-[54px] tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={20} strokeWidth={3} />
                      <span>ADD FOR TODAY</span>
                    </button>
                  </div>
                </div>,
                document.body
              )}
          </>
        )
      ) : (
        <div className="space-y-4 pb-8">
          {/* 7-Day Flat Selector */}
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((day) => {
              const active = selectedDay === day;
              const isToday = day === todayWeekday;
              const count = (state.weeklyRoutine[day] || []).length;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className="btn-flat min-h-[46px] !rounded-xl flex flex-col items-center justify-center border cursor-pointer"
                  style={{
                    backgroundColor: active ? 'var(--primary)' : '#1E1E1E',
                    color: active ? 'var(--hero-text)' : '#FFFFFF',
                    borderColor: active
                      ? 'var(--primary)'
                      : isToday
                        ? 'rgba(255,255,255,0.28)'
                        : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <span className="text-[11px] font-extrabold tracking-wide">{day}</span>
                  {count > 0 && (
                    <span
                      className="text-[9px] font-mono-num font-bold leading-none mt-0.5"
                      style={{ opacity: active ? 0.9 : 0.6 }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedDaySlots.length === 0 ? (
            <div className="card-flat p-8 text-center space-y-4">
              <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
                Nothing Set for {selectedDay}
              </p>
              <button
                type="button"
                onClick={() => openAdd('ROUTINE')}
                className="btn-flat min-h-[48px] px-6 text-xs tracking-wider inline-flex items-center justify-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--hero-text)',
                }}
              >
                <Plus size={16} strokeWidth={3} />
                <span>ADD TO {selectedDay}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2.5">
                {selectedDaySlots.map((slot, idx) => (
                  <RoutineCard
                    key={slot.id}
                    slot={slot}
                    index={idx}
                    onOpenMenu={() => openRoutineMenu(slot)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => openAdd('ROUTINE')}
                  className="btn-flat flex-1 min-h-[48px] text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--hero-text)',
                  }}
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>ADD TO {selectedDay}</span>
                </button>

                {selectedDay === todayWeekday && (
                  <button
                    type="button"
                    onClick={() => {
                      loadTodayRoutine();
                      setScheduleTab('TODAY');
                    }}
                    className="btn-flat min-h-[48px] px-4 bg-[#1E1E1E] text-white text-xs tracking-wider flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer shrink-0"
                  >
                    <CalendarPlus size={15} style={{ color: 'var(--primary)' }} />
                    <span>LOAD TODAY</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {addMode && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                STEP {step} OF 2
              </span>
              <button
                type="button"
                onClick={() => setAddMode(null)}
                aria-label="Close"
                className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-extrabold uppercase text-white">
                  What to Study?
                </h2>
                {quickChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar">
                    {quickChips.map((chip) => {
                      const selected = title === chip;
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setTitle(chip)}
                          className="btn-flat px-3 py-1.5 text-xs cursor-pointer"
                          style={{
                            backgroundColor: selected ? 'var(--primary)' : '#000000',
                            color: selected ? 'var(--hero-text)' : '#D4D4D4',
                          }}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                )}
                <input
                  type="text"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && title.trim()) setStep(2);
                  }}
                  placeholder="e.g. Gujarati Ch 2"
                  className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => setStep(2)}
                  className="btn-flat w-full min-h-[48px] text-sm tracking-wider cursor-pointer"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--hero-text)',
                  }}
                >
                  NEXT
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-extrabold uppercase text-white">
                  How Many Minutes?
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {MINUTE_CHIPS.map((m) => {
                    const active = minutes === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMinutes(m)}
                        className="btn-flat min-h-[48px] font-mono-num text-xs sm:text-sm cursor-pointer"
                        style={{
                          backgroundColor: active ? 'var(--primary)' : '#000000',
                          color: active ? 'var(--hero-text)' : '#FFFFFF',
                        }}
                      >
                        {m}M
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (addMode === 'TODAY') {
                      addPlanItem(title, minutes);
                    } else {
                      addRoutineSlot(selectedDay, title, minutes);
                    }
                    setAddMode(null);
                  }}
                  className="btn-flat w-full min-h-[48px] text-sm tracking-wider cursor-pointer"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--hero-text)',
                  }}
                >
                  SAVE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <LongPressActionModal
        open={Boolean(deleteTarget)}
        itemLabel={deleteTarget?.title || ''}
        onClose={() => setDeleteTarget(null)}
        onEdit={(newTitle) => {
          if (deleteTarget) renamePlanItem(deleteTarget.id, newTitle);
        }}
        onDelete={() => {
          if (deleteTarget) deletePlanItem(deleteTarget.id);
        }}
      />

      <LongPressActionModal
        open={Boolean(deleteRoutineTarget)}
        itemLabel={deleteRoutineTarget?.title || ''}
        onClose={() => setDeleteRoutineTarget(null)}
        onEdit={(newTitle) => {
          if (deleteRoutineTarget) renameRoutineSlot(selectedDay, deleteRoutineTarget.id, newTitle);
        }}
        onDelete={() => {
          if (deleteRoutineTarget) deleteRoutineSlot(selectedDay, deleteRoutineTarget.id);
        }}
      />
    </div>
  );
}
