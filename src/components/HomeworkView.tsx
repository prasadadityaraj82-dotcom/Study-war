import { useState } from 'react';
import { Check, MoreVertical, Plus } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useLongPress } from '../hooks/useLongPress';
import { HomeworkItem } from '../types';
import { LongPressActionModal } from './StepModals';

function HomeworkRow({
  item,
  index,
  onToggle,
  onOpenMenu,
}: {
  item: HomeworkItem;
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
        isHolding ? 'scale-[0.97] ring-2 ring-[var(--primary)]/50' : ''
      }`}
      style={{
        animationDelay: `${Math.min(index * 60, 240)}ms`,
        opacity: item.done ? 0.6 : 1,
        backgroundColor: item.done ? 'rgba(34, 197, 94, 0.10)' : '#1E1E1E',
        borderColor: isHolding
          ? 'var(--primary)'
          : item.done
            ? 'rgba(34, 197, 94, 0.30)'
            : 'rgba(255,255,255,0.06)',
      }}
    >
      <div className={`tick-flat ${item.done ? 'tick-flat-done' : ''}`}>
        {item.done && <Check size={16} strokeWidth={3} />}
      </div>

      <span
        className={`text-base sm:text-lg font-bold flex-1 min-w-0 break-words ${
          item.done ? 'line-through text-[#8A8A8A]' : 'text-white'
        }`}
      >
        {item.text}
      </span>

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Delete ${item.text}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={17} />
      </button>
    </div>
  );
}

export function HomeworkView() {
  const {
    state,
    addHomework,
    toggleHomeworkDone,
    deleteHomework,
    clearDoneHomework,
    dismissEditHint,
  } = useStudy();
  const [text, setText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<HomeworkItem | null>(null);

  const showHint = !state.settings.editHintDismissed;
  const hasDone = state.homework.some((h) => h.done);
  const openMenu = (hw: HomeworkItem) => {
    dismissEditHint();
    setDeleteTarget(hw);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addHomework(text);
    setText('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            HOMEWORK
          </h1>
          {showHint && state.homework.length > 0 && !hasDone && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A] shrink-0">
              HOLD TO DELETE
            </span>
          )}
        </div>

        {hasDone && (
          <button
            type="button"
            onClick={clearDoneHomework}
            className="btn-flat px-3 py-1.5 bg-[#1E1E1E] text-[#EF4444] text-xs tracking-wider border border-[#EF4444]/30 cursor-pointer shrink-0"
          >
            CLEAR DONE
          </button>
        )}
      </div>

      {/* Top Input + [ADD] FLAT Pink Button */}
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is Homework? Write..."
          className="flex-1 min-h-[48px] rounded-[16px] bg-[#1E1E1E] border border-white/10 px-4 text-sm sm:text-base font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
        />
        <button
          type="submit"
          className="btn-flat min-h-[48px] px-5 text-xs sm:text-sm tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--hero-text)',
          }}
        >
          <Plus size={17} strokeWidth={3} />
          <span>ADD</span>
        </button>
      </form>

      {state.homework.length === 0 ? (
        <div className="min-h-[42vh] flex items-center justify-center text-center">
          <p className="font-display text-2xl font-extrabold uppercase text-[#8A8A8A]">
            No Homework Yet
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {state.homework.map((hw, idx) => (
            <HomeworkRow
              key={hw.id}
              item={hw}
              index={idx}
              onToggle={() => toggleHomeworkDone(hw.id)}
              onOpenMenu={() => openMenu(hw)}
            />
          ))}
        </div>
      )}

      <LongPressActionModal
        open={Boolean(deleteTarget)}
        itemLabel={deleteTarget?.text || ''}
        allowEdit={false}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => {
          if (deleteTarget) deleteHomework(deleteTarget.id);
        }}
      />
    </div>
  );
}
