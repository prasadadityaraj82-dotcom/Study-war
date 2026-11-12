import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, BookOpen, Check, MoreVertical, Plus } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useLongPress } from '../hooks/useLongPress';
import { ChapterItem, SubjectItem } from '../types';
import {
  AddChapterModal,
  AddSubjectWizard,
  LongPressActionModal,
} from './StepModals';

function ChapterCard({
  chapter,
  index,
  onToggle,
  onOpenMenu,
}: {
  chapter: ChapterItem;
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
        backgroundColor: chapter.done ? 'rgba(34, 197, 94, 0.12)' : '#1E1E1E',
        borderColor: isHolding
          ? 'var(--primary)'
          : chapter.done
            ? 'rgba(34, 197, 94, 0.35)'
            : 'rgba(255,255,255,0.06)',
      }}
    >
      <div className={`tick-flat ${chapter.done ? 'tick-flat-done' : ''}`}>
        {chapter.done && <Check size={16} strokeWidth={3} />}
      </div>

      <span className="flex-1 min-w-0 text-lg sm:text-xl font-extrabold leading-snug text-white break-words">
        {chapter.name}
      </span>

      {chapter.revise && (
        <span className="px-2.5 py-1 rounded-full bg-[#F97316]/20 text-[#FB923C] text-[10px] font-extrabold uppercase tracking-wider shrink-0">
          REVISE
        </span>
      )}

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Edit ${chapter.name}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={17} />
      </button>
    </div>
  );
}

function SubjectListCard({
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
        borderColor: isHolding ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
      }}
      className={`card-flat animate-card-in pl-5 pr-3 py-5 flex items-center justify-between gap-2.5 cursor-pointer border transition-all duration-150 ${
        isHolding ? 'scale-[0.97] ring-2 ring-[var(--primary)]/50' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-11 h-11 rounded-2xl bg-[#000000] flex items-center justify-center shrink-0"
          style={{ color: subject.color }}
        >
          <BookOpen size={20} />
        </div>
        <div className="min-w-0">
          <h2
            className="font-display text-2xl font-extrabold uppercase tracking-wide truncate"
            style={{ color: subject.color }}
          >
            {subject.name}
          </h2>
          <p className="text-xs font-bold uppercase text-[#8A8A8A]">
            Class {subject.studentClass}
          </p>
        </div>
      </div>

      <span className="font-mono-num text-xs sm:text-sm font-extrabold text-white shrink-0 uppercase">
        {totalCount === 0 ? 'NO CHAPTER YET' : `${doneCount} / ${totalCount} Done`}
      </span>

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Edit ${subject.name}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={17} />
      </button>
    </div>
  );
}

export function SubjectsView() {
  const {
    state,
    selectedSubjectId,
    setSelectedSubjectId,
    addSubject,
    renameSubject,
    deleteSubject,
    addChapter,
    addBulkChapters,
    toggleChapterDone,
    toggleChapterRevise,
    renameChapter,
    deleteChapter,
    dismissEditHint,
  } = useStudy();

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [longPressSubject, setLongPressSubject] = useState<SubjectItem | null>(null);
  const [longPressChapter, setLongPressChapter] = useState<ChapterItem | null>(null);

  const showHint = !state.settings.editHintDismissed;
  const openChapterMenu = (ch: ChapterItem) => {
    dismissEditHint();
    setLongPressChapter(ch);
  };
  const openSubjectMenu = (sub: SubjectItem) => {
    dismissEditHint();
    setLongPressSubject(sub);
  };

  const activeSubject = state.subjects.find((s) => s.id === selectedSubjectId) || null;

  if (state.subjects.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
          No Subject Yet
        </h1>
        {/* Main 3D Pink Button #2: [ADD MY FIRST SUBJECT] */}
        <button
          type="button"
          onClick={() => setShowAddSubject(true)}
          className="btn-3d-main min-h-[54px] px-7 tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={20} strokeWidth={3} />
          <span>ADD MY FIRST SUBJECT</span>
        </button>

        <AddSubjectWizard
          open={showAddSubject}
          onClose={() => setShowAddSubject(false)}
          onSave={(name, cls) => {
            const newId = addSubject(name, cls);
            setSelectedSubjectId(newId);
          }}
        />
      </div>
    );
  }

  if (activeSubject) {
    const chapters = state.chapters.filter((c) => c.subjectId === activeSubject.id);
    const doneCount = chapters.filter((c) => c.done).length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedSubjectId(null)}
            className="btn-flat w-11 h-11 bg-[#1E1E1E] text-white flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Back to subjects"
          >
            <ArrowLeft size={18} />
          </button>

          <h1
            className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide flex-1 truncate"
            style={{ color: activeSubject.color }}
          >
            {chapters.length === 0
              ? activeSubject.name
              : `${activeSubject.name} - ${doneCount} / ${chapters.length} Done`}
          </h1>

          {showHint && chapters.length > 0 && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A] shrink-0">
              HOLD TO EDIT
            </span>
          )}
        </div>

        {chapters.length === 0 ? (
          <div className="card-flat p-8 text-center mb-[100px]">
            <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
              No Chapter Yet
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 pb-[100px]">
            {chapters.map((ch, idx) => (
              <ChapterCard
                key={ch.id}
                chapter={ch}
                index={idx}
                onToggle={() => toggleChapterDone(ch.id)}
                onOpenMenu={() => openChapterMenu(ch)}
              />
            ))}
          </div>
        )}

        {/* Main 3D Pink Button #3: [ADD CHAPTER] Fixed Above BottomNav */}
        {typeof document !== 'undefined' &&
          createPortal(
            <div className="fixed bottom-[80px] left-0 right-0 z-30 px-4 pointer-events-none">
              <div className="max-w-5xl mx-auto">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(true)}
                  className="btn-3d-main pointer-events-auto w-full min-h-[54px] tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={20} strokeWidth={3} />
                  <span>ADD CHAPTER</span>
                </button>
              </div>
            </div>,
            document.body
          )}

        <AddChapterModal
          open={showAddChapter}
          onClose={() => setShowAddChapter(false)}
          onSaveSingle={(name) => addChapter(activeSubject.id, name)}
          onSaveBulk={(fromNum, toNum) => addBulkChapters(activeSubject.id, fromNum, toNum)}
        />

        <LongPressActionModal
          open={Boolean(longPressChapter)}
          itemLabel={longPressChapter?.name || ''}
          reviseActive={Boolean(longPressChapter?.revise)}
          onToggleRevise={() => {
            if (longPressChapter) toggleChapterRevise(longPressChapter.id);
          }}
          onClose={() => setLongPressChapter(null)}
          onEdit={(newName) => {
            if (longPressChapter) renameChapter(longPressChapter.id, newName);
          }}
          onDelete={() => {
            if (longPressChapter) deleteChapter(longPressChapter.id);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
            MY SUBJECTS
          </h1>
          {showHint && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
              HOLD TO EDIT
            </span>
          )}
        </div>
        {/* Main 3D Pink Button #2: [ADD SUBJECT] */}
        <button
          type="button"
          onClick={() => setShowAddSubject(true)}
          className="btn-3d-main px-5 py-2.5 !text-xs tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={16} strokeWidth={3} />
          <span>ADD SUBJECT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {state.subjects.map((sub, idx) => {
          const subCh = state.chapters.filter((c) => c.subjectId === sub.id);
          const doneCount = subCh.filter((c) => c.done).length;
          return (
            <SubjectListCard
              key={sub.id}
              subject={sub}
              index={idx}
              doneCount={doneCount}
              totalCount={subCh.length}
              onOpen={() => setSelectedSubjectId(sub.id)}
              onOpenMenu={() => openSubjectMenu(sub)}
            />
          );
        })}
      </div>

      <AddSubjectWizard
        open={showAddSubject}
        onClose={() => setShowAddSubject(false)}
        onSave={(name, cls) => {
          const newId = addSubject(name, cls);
          setSelectedSubjectId(newId);
        }}
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
    </div>
  );
}
