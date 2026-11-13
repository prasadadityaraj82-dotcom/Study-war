import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, MoreVertical, Plus, X } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useLongPress } from '../hooks/useLongPress';
import { PlanItem } from '../types';
import { LongPressActionModal } from './StepModals';

const MINUTE_CHIPS = [15, 30, 60];

function TomorrowCard({
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

export function TomorrowView() {
  const {
    state,
    addTomorrowItem,
    renameTomorrowItem,
    toggleTomorrowDone,
    deleteTomorrowItem,
    dismissEditHint,
  } = useStudy();

  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState<number>(30);
  const [deleteTarget, setDeleteTarget] = useState<PlanItem | null>(null);

  const showHint = !state.settings.editHintDismissed;

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

  const openAdd = () => {
    setStep(1);
    setTitle('');
    setMinutes(30);
    setShowAdd(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
          TOMORROW&apos;S PLAN
        </h1>
        {showHint && state.tomorrowPlan.length > 0 && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A] shrink-0">
            HOLD TO EDIT
          </span>
        )}
      </div>

      {state.tomorrowPlan.length === 0 ? (
        <div className="min-h-[52vh] flex flex-col items-center justify-center text-center space-y-5">
          <p className="font-display text-3xl font-extrabold uppercase text-[#8A8A8A]">
            Nothing for Tomorrow
          </p>
          {/* Main 3D Pink Button #5: [ADD FOR TOMORROW] */}
          <button
            type="button"
            onClick={openAdd}
            className="btn-3d-main min-h-[54px] px-7 tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} strokeWidth={3} />
            <span>ADD FOR TOMORROW</span>
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2.5 pb-[100px]">
            {state.tomorrowPlan.map((item, idx) => (
              <TomorrowCard
                key={item.id}
                item={item}
                index={idx}
                onToggle={() => toggleTomorrowDone(item.id)}
                onOpenMenu={() => openMenu(item)}
              />
            ))}
          </div>

          {/* Fixed Bottom Full-Width [ADD FOR TOMORROW] Button */}
          {typeof document !== 'undefined' &&
            createPortal(
              <div className="fixed bottom-[80px] left-0 right-0 z-30 px-4 pointer-events-none">
                <div className="max-w-5xl mx-auto">
                  <button
                    type="button"
                    onClick={openAdd}
                    className="btn-3d-main pointer-events-auto w-full min-h-[54px] tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus size={20} strokeWidth={3} />
                    <span>ADD FOR TOMORROW</span>
                  </button>
                </div>
              </div>,
              document.body
            )}
        </>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                STEP {step} OF 2
              </span>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
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
                  placeholder="e.g. Gujarati Ch 3"
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
                <div className="grid grid-cols-3 gap-2.5">
                  {MINUTE_CHIPS.map((m) => {
                    const active = minutes === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMinutes(m)}
                        className="btn-flat min-h-[50px] font-mono-num text-sm cursor-pointer"
                        style={{
                          backgroundColor: active ? 'var(--primary)' : '#000000',
                          color: active ? 'var(--hero-text)' : '#FFFFFF',
                        }}
                      >
                        {m} MIN
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addTomorrowItem(title, minutes);
                    setShowAdd(false);
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
          if (deleteTarget) renameTomorrowItem(deleteTarget.id, newTitle);
        }}
        onDelete={() => {
          if (deleteTarget) deleteTomorrowItem(deleteTarget.id);
        }}
      />
    </div>
  );
}
