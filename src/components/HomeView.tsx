import { useState } from 'react';
import { BookOpen, CalendarDays, Check, CheckSquare, Clock, MoreVertical, Plus } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useLongPress } from '../hooks/useLongPress';
import { SubjectItem, TargetItem } from '../types';
import {
  AddSubjectWizard,
  LongPressActionModal,
  SingleInputModal,
} from './StepModals';

function TargetRow({
  target,
  index,
  onToggle,
  onOpenMenu,
}: {
  target: TargetItem;
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
      style={{
        animationDelay: `${Math.min(index * 60, 240)}ms`,
        backgroundColor: target.done ? 'rgba(34, 197, 94, 0.14)' : '#141414',
        borderColor: isHolding
          ? 'var(--primary)'
          : target.done
            ? 'rgba(34, 197, 94, 0.45)'
            : 'rgba(255, 255, 255, 0.08)',
      }}
      className={`animate-item-in rounded-[16px] pl-4 pr-2 py-3 flex items-center gap-3 cursor-pointer border transition-all duration-150 ${
        target.done ? 'card-done-sweep ' : ''
      }${
        isHolding ? 'scale-[0.97] ring-2 ring-[var(--primary)]/50' : 'active:scale-[0.98]'
      }`}
    >
      <div className={`tick-flat ${target.done ? 'tick-flat-done' : ''}`}>
        {target.done && <Check size={16} strokeWidth={3} />}
      </div>
      <span
        className={`text-base font-bold flex-1 min-w-0 break-words ${
          target.done ? 'line-through text-white/70' : 'text-white'
        }`}
      >
        {target.text}
      </span>
      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Edit ${target.text}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

function SubjectGridCard({
  subject,
  index,
  doneCount,
  totalCount,
  onOpen,
  onOpenMenu,
}: {
  subject: SubjectItem;
  index: number;
  doneCount: number;
  totalCount: number;
  onOpen: () => void;
  onOpenMenu: () => void;
}) {
  const { handlers, isHolding } = useLongPress(onOpenMenu, onOpen);
  const allDone = totalCount > 0 && doneCount === totalCount;
  return (
    <div
      {...handlers}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen();
      }}
      style={{
        animationDelay: `${index * 80}ms`,
        backgroundColor: allDone ? 'rgba(34, 197, 94, 0.14)' : '#1E1E1E',
        borderColor: isHolding
          ? 'var(--primary)'
          : allDone
            ? 'rgba(34, 197, 94, 0.55)'
            : 'rgba(255,255,255,0.06)',
      }}
      className={`card-flat animate-card-in p-4 text-left cursor-pointer flex flex-col justify-between min-h-[112px] border transition-all duration-150 ${
        isHolding ? 'scale-[0.97] ring-2 ring-[var(--primary)]/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={18} style={{ color: subject.color }} className="shrink-0" />
          <span
            className="font-display text-lg font-extrabold uppercase tracking-wide truncate"
            style={{ color: subject.color }}
          >
            {subject.name}
          </span>
        </div>
        <button
          type="button"
          data-card-menu="true"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu();
          }}
          aria-label={`Edit ${subject.name}`}
          className="btn-flat -mr-1.5 -mt-1 w-7 h-7 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
        >
          <MoreVertical size={15} />
        </button>
      </div>

      <div className="mt-3">
        {allDone ? (
          <p className="font-mono-num text-xs sm:text-sm font-extrabold text-[#4ADE80] uppercase inline-flex items-center gap-1">
            <Check size={14} strokeWidth={3} />
            <span>ALL DONE</span>
          </p>
        ) : (
          <p className="font-mono-num text-xs sm:text-sm font-extrabold text-white uppercase">
            {totalCount === 0 ? 'NO CHAPTER YET' : `${doneCount} / ${totalCount} Done`}
          </p>
        )}
        <p className="text-[10px] font-bold uppercase text-[#8A8A8A] mt-0.5">
          Class {subject.studentClass}
        </p>
      </div>
    </div>
  );
}

export function HomeView() {
  const {
    state,
    setActiveTab,
    setSelectedSubjectId,
    addSubject,
    renameSubject,
    deleteSubject,
    addTarget,
    toggleTargetDone,
    renameTarget,
    deleteTarget,
    getPendingTasks,
    dismissEditHint,
  } = useStudy();

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [longPressSubject, setLongPressSubject] = useState<SubjectItem | null>(null);
  const [longPressTarget, setLongPressTarget] = useState<TargetItem | null>(null);

  const showHint = !state.settings.editHintDismissed;
  const doneTargets = state.targets.filter((t) => t.done).length;
  const totalTargets = state.targets.length;
  const allTargetsWon = totalTargets > 0 && doneTargets === totalTargets;

  const tomorrowCount = state.tomorrowPlan.length;
  const pendingCount = getPendingTasks().length;
  const hwDone = state.homework.filter((h) => h.done).length;
  const hwTotal = state.homework.length;

  const displayedSubjects = state.subjects.slice(0, 4);

  const openTargetMenu = (t: TargetItem) => {
    dismissEditHint();
    setLongPressTarget(t);
  };

  const openSubjectMenu = (s: SubjectItem) => {
    dismissEditHint();
    setLongPressSubject(s);
  };

  return (
    <div className="space-y-5">
      {/* ONE Merged Card: TODAY'S WAR + Count + Targets + [ADD TARGET] 3D Pink Button */}
      <section
        className="animate-card-in rounded-[20px] p-5 sm:p-6 space-y-4 transition-colors duration-200 border"
        style={
          allTargetsWon
            ? {
                backgroundColor: '#22C55E',
                borderColor: '#4ADE80',
                color: '#FFFFFF',
              }
            : {
                backgroundImage:
                  'linear-gradient(180deg, rgba(var(--primary-rgb), 0.24) 0%, #1E1E1E 100%)',
                borderColor: 'rgba(var(--primary-rgb), 0.45)',
              }
        }
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight leading-none text-white">
              TODAY&apos;S WAR
            </h1>
            <p className="text-sm sm:text-base font-extrabold uppercase tracking-wide mt-1.5 text-white">
              {totalTargets === 0
                ? 'NO TARGET YET'
                : allTargetsWon
                ? 'WAR WON TODAY'
                : `${doneTargets} / ${totalTargets} DONE`}
            </p>
          </div>
          {showHint && totalTargets > 0 && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/60 pt-1 shrink-0">
              HOLD TO EDIT
            </span>
          )}
        </div>

        {state.targets.length > 0 && (
          <div className="space-y-2 pb-1 max-h-56 overflow-y-auto no-scrollbar">
            {state.targets.map((t, idx) => (
              <TargetRow
                key={t.id}
                target={t}
                index={idx}
                onToggle={() => toggleTargetDone(t.id)}
                onOpenMenu={() => openTargetMenu(t)}
              />
            ))}
          </div>
        )}

        {/* Main 3D Pink Button #1: [ADD TARGET] */}
        <button
          type="button"
          onClick={() => setShowAddTarget(true)}
          className="btn-3d-main w-full min-h-[52px] tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={20} strokeWidth={3} />
          <span>ADD TARGET</span>
        </button>
      </section>

      {/* MY SUBJECTS Grid (4 Subjects + 5th Card [ADD SUBJECT] Dotted Border, FLAT) */}
      <section>
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <div className="flex items-baseline gap-2.5 min-w-0">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
              MY SUBJECTS
            </h2>
            {showHint && state.subjects.length > 0 && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                HOLD TO EDIT
              </span>
            )}
          </div>
          {state.subjects.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedSubjectId(null);
                setActiveTab('SUBJECTS');
              }}
              className="btn-flat px-3.5 py-1.5 bg-[#1E1E1E] text-white text-xs tracking-wider cursor-pointer shrink-0"
            >
              SEE ALL →
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {displayedSubjects.map((sub, idx) => {
            const subChapters = state.chapters.filter((c) => c.subjectId === sub.id);
            const doneCount = subChapters.filter((c) => c.done).length;
            return (
              <SubjectGridCard
                key={sub.id}
                subject={sub}
                index={idx}
                doneCount={doneCount}
                totalCount={subChapters.length}
                onOpen={() => {
                  setSelectedSubjectId(sub.id);
                  setActiveTab('SUBJECTS');
                }}
                onOpenMenu={() => openSubjectMenu(sub)}
              />
            );
          })}

          {/* 5th Card: [ADD SUBJECT] Dotted Border, FLAT */}
          <button
            type="button"
            onClick={() => setShowAddSubject(true)}
            style={{ animationDelay: `${displayedSubjects.length * 80}ms` }}
            className="card-flat animate-card-in p-4 min-h-[112px] border-2 border-dashed border-white/25 hover:border-[var(--primary)] flex flex-col items-center justify-center gap-2 text-center cursor-pointer"
          >
            <Plus size={24} style={{ color: 'var(--primary)' }} strokeWidth={3} />
            <span className="font-display text-base font-extrabold uppercase tracking-wide text-white">
              ADD SUBJECT
            </span>
          </button>
        </div>
      </section>

      {/* HOME BOTTOM 3 FLAT BOXES: [TOMORROW'S PLAN] [PENDING] [HOMEWORK] */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-3 items-stretch">
        {/* 1. TOMORROW'S PLAN - Blue FLAT */}
        <button
          type="button"
          onClick={() => setActiveTab('TOMORROW')}
          style={{ animationDelay: '0ms' }}
          className="btn-flat animate-card-in py-4 px-2.5 sm:px-3 text-center flex flex-col items-center justify-center gap-1.5 min-h-[116px] h-full bg-[#3B82F6] text-white cursor-pointer"
        >
          <CalendarDays size={20} className="shrink-0" />
          <span className="font-display text-xs sm:text-sm font-extrabold uppercase leading-tight text-center">
            TOMORROW&apos;S PLAN
          </span>
          <p className="text-[10px] sm:text-xs font-extrabold uppercase leading-tight text-white/95">
            {tomorrowCount === 0
              ? 'NO TASKS'
              : `${tomorrowCount} ${tomorrowCount === 1 ? 'TASK' : 'TASKS'}`}
          </p>
        </button>

        {/* 2. PENDING - Orange FLAT */}
        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          style={{ animationDelay: '80ms' }}
          className="btn-flat animate-card-in py-4 px-2.5 sm:px-3 text-center flex flex-col items-center justify-center gap-1.5 min-h-[116px] h-full bg-[#F97316] text-white cursor-pointer"
        >
          <Clock size={20} className="shrink-0" />
          <span className="font-display text-xs sm:text-sm font-extrabold uppercase leading-tight text-center">
            PENDING
          </span>
          <p className="text-[10px] sm:text-xs font-extrabold uppercase leading-tight text-white/95">
            {pendingCount === 0 ? 'ALL DONE' : `${pendingCount} LEFT`}
          </p>
        </button>

        {/* 3. HOMEWORK - Purple FLAT */}
        <button
          type="button"
          onClick={() => setActiveTab('HOMEWORK')}
          style={{ animationDelay: '160ms' }}
          className="btn-flat animate-card-in py-4 px-2.5 sm:px-3 text-center flex flex-col items-center justify-center gap-1.5 min-h-[116px] h-full bg-[#9B5CFF] text-white cursor-pointer"
        >
          <CheckSquare size={20} className="shrink-0" />
          <span className="font-display text-xs sm:text-sm font-extrabold uppercase leading-tight text-center">
            HOMEWORK
          </span>
          <p className="text-[10px] sm:text-xs font-extrabold uppercase leading-tight font-mono-num text-white/95">
            {hwTotal === 0 ? 'OPEN' : `${hwDone} / ${hwTotal} DONE`}
          </p>
        </button>
      </section>

      {/* Modals */}
      <AddSubjectWizard
        open={showAddSubject}
        onClose={() => setShowAddSubject(false)}
        onSave={(name, studentClass) => {
          addSubject(name, studentClass);
        }}
      />

      <SingleInputModal
        open={showAddTarget}
        title="Today's Target?"
        placeholder="e.g. Finish Ch 1"
        quickChips={Array.from(
          new Set(
            [...state.chapters]
              .sort((a, b) => Number(a.done) - Number(b.done))
              .map((c) => c.name)
          )
        ).slice(0, 10)}
        onClose={() => setShowAddTarget(false)}
        onSave={(text) => addTarget(text)}
      />

      <LongPressActionModal
        open={Boolean(longPressSubject)}
        itemLabel={longPressSubject?.name || ''}
        onClose={() => setLongPressSubject(null)}
        onEdit={(newName) => {
          if (longPressSubject) renameSubject(longPressSubject.id, newName);
        }}
        onDelete={() => {
          if (longPressSubject) deleteSubject(longPressSubject.id);
        }}
      />

      <LongPressActionModal
        open={Boolean(longPressTarget)}
        itemLabel={longPressTarget?.text || ''}
        onClose={() => setLongPressTarget(null)}
        onEdit={(newText) => {
          if (longPressTarget) renameTarget(longPressTarget.id, newText);
        }}
        onDelete={() => {
          if (longPressTarget) deleteTarget(longPressTarget.id);
        }}
      />
    </div>
  );
}
