import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, BookOpen, Check, MoreVertical, Plus } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatLastRevised } from '../data/studyData';
import { useLongPress } from '../hooks/useLongPress';
import { ChapterItem, MarkItem, NoteItem, SubjectItem } from '../types';
import {
  AddChapterModal,
  AddMarkModal,
  AddSubjectWizard,
  LongPressActionModal,
} from './StepModals';

function formatShortDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${d} ${months[m - 1] || ''}`;
}

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
  const revisedInfo = formatLastRevised(chapter.lastRevisedAt);

  return (
    <div
      {...handlers}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
      className={`card-flat animate-item-in pl-4 pr-2.5 py-4 sm:py-5 flex items-center gap-3.5 cursor-pointer border transition-all duration-150 ${
        chapter.done ? 'card-done-sweep ' : ''
      }${
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

      <div className="flex-1 min-w-0">
        <span className="block text-lg sm:text-xl font-extrabold leading-snug text-white break-words">
          {chapter.name}
        </span>
        {revisedInfo && (
          <span
            className="block text-[10px] font-extrabold uppercase tracking-wider mt-0.5"
            style={{ color: revisedInfo.isDue ? '#FB923C' : '#8A8A8A' }}
          >
            {revisedInfo.label}
          </span>
        )}
      </div>

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

function MarkCard({
  mark,
  index,
  onOpenMenu,
}: {
  mark: MarkItem;
  index: number;
  onOpenMenu: () => void;
}) {
  const { handlers, isHolding } = useLongPress(onOpenMenu, onOpenMenu);
  const pct = Math.round((mark.scored / mark.total) * 100);

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
      <div className="min-w-0 flex-1">
        <p className="text-base sm:text-lg font-extrabold text-white truncate">
          {mark.title}
        </p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A] mt-0.5">
          {formatShortDate(mark.date)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-mono-num text-base font-extrabold text-white">
          {mark.scored} / {mark.total}
        </p>
        <p
          className="font-mono-num text-xs font-extrabold"
          style={{ color: pct >= 75 ? '#22C55E' : pct >= 40 ? 'var(--primary)' : '#FB923C' }}
        >
          {pct}%
        </p>
      </div>

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Delete ${mark.title}`}
        className="btn-flat w-8 h-8 !rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-white shrink-0 cursor-pointer"
      >
        <MoreVertical size={17} />
      </button>
    </div>
  );
}

function NoteCard({
  note,
  index,
  onOpenMenu,
}: {
  note: NoteItem;
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
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold text-white break-words leading-snug">
          {note.text}
        </p>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A] mt-1">
          {formatShortDate(note.date)}
        </p>
      </div>

      <button
        type="button"
        data-card-menu="true"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
        aria-label={`Edit note`}
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

      {allDone ? (
        <span className="font-mono-num text-xs sm:text-sm font-extrabold text-[#4ADE80] shrink-0 uppercase inline-flex items-center gap-1">
          <Check size={14} strokeWidth={3} />
          <span>ALL DONE</span>
        </span>
      ) : (
        <span className="font-mono-num text-xs sm:text-sm font-extrabold text-white shrink-0 uppercase">
          {totalCount === 0 ? 'NO CHAPTER YET' : `${doneCount} / ${totalCount} Done`}
        </span>
      )}

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
    markChapterRevised,
    renameChapter,
    deleteChapter,
    addMark,
    deleteMark,
    addNote,
    editNote,
    deleteNote,
    dismissEditHint,
  } = useStudy();

  const [subjectTab, setSubjectTab] = useState<'CHAPTERS' | 'MARKS' | 'NOTES'>('CHAPTERS');
  const [chapterFilter, setChapterFilter] = useState<'ALL' | 'LEFT' | 'REVISE'>('ALL');
  const [noteInput, setNoteInput] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddMark, setShowAddMark] = useState(false);
  const [longPressSubject, setLongPressSubject] = useState<SubjectItem | null>(null);
  const [longPressChapter, setLongPressChapter] = useState<ChapterItem | null>(null);
  const [longPressMark, setLongPressMark] = useState<MarkItem | null>(null);
  const [longPressNote, setLongPressNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    setSubjectTab('CHAPTERS');
    setChapterFilter('ALL');
    setNoteInput('');
  }, [selectedSubjectId]);

  const showHint = !state.settings.editHintDismissed;
  const openChapterMenu = (ch: ChapterItem) => {
    dismissEditHint();
    setLongPressChapter(ch);
  };
  const openSubjectMenu = (sub: SubjectItem) => {
    dismissEditHint();
    setLongPressSubject(sub);
  };
  const openMarkMenu = (mk: MarkItem) => {
    dismissEditHint();
    setLongPressMark(mk);
  };
  const openNoteMenu = (nt: NoteItem) => {
    dismissEditHint();
    setLongPressNote(nt);
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
    const filteredChapters =
      chapterFilter === 'LEFT'
        ? chapters.filter((c) => !c.done)
        : chapterFilter === 'REVISE'
          ? chapters.filter((c) => c.revise)
          : chapters;

    const subjectMarks = state.marks.filter((m) => m.subjectId === activeSubject.id);
    const avgMarksPct =
      subjectMarks.length > 0
        ? Math.round(
            subjectMarks.reduce((sum, m) => sum + (m.scored / m.total) * 100, 0) /
              subjectMarks.length
          )
        : 0;
    const subjectNotes = state.notes.filter((n) => n.subjectId === activeSubject.id);

    const handleAddNote = (e: React.FormEvent) => {
      e.preventDefault();
      if (!noteInput.trim()) return;
      addNote(activeSubject.id, noteInput);
      setNoteInput('');
    };

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

          {showHint &&
            ((subjectTab === 'CHAPTERS' && chapters.length > 0) ||
              (subjectTab === 'MARKS' && subjectMarks.length > 0) ||
              (subjectTab === 'NOTES' && subjectNotes.length > 0)) && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A] shrink-0">
                HOLD TO EDIT
              </span>
            )}
        </div>

        {/* Flat Segmented Switch: CHAPTERS | MARKS | NOTES */}
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#1E1E1E] p-1 border border-white/[0.06]">
          {(['CHAPTERS', 'MARKS', 'NOTES'] as const).map((tab) => {
            const active = subjectTab === tab;
            const label =
              tab === 'MARKS' && subjectMarks.length > 0
                ? `MARKS (${subjectMarks.length})`
                : tab === 'NOTES' && subjectNotes.length > 0
                  ? `NOTES (${subjectNotes.length})`
                  : tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSubjectTab(tab)}
                className="btn-flat min-h-[40px] !rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'var(--hero-text)' : '#8A8A8A',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {subjectTab === 'CHAPTERS' ? (
          <>
            {chapters.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {(['ALL', 'LEFT', 'REVISE'] as const).map((f) => {
                  const active = chapterFilter === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setChapterFilter(f)}
                      className="btn-flat min-h-[36px] !rounded-xl text-[11px] font-extrabold uppercase tracking-wider border cursor-pointer"
                      style={{
                        backgroundColor: active ? '#FFFFFF' : '#1E1E1E',
                        color: active ? '#000000' : '#8A8A8A',
                        borderColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            )}

            {chapters.length === 0 ? (
              <div className="card-flat p-8 text-center mb-[100px]">
                <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
                  No Chapter Yet
                </p>
              </div>
            ) : filteredChapters.length === 0 ? (
              <div className="card-flat p-8 text-center mb-[100px]">
                <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
                  {chapterFilter === 'LEFT' ? 'All Chapters Done' : 'No Revise Chapters'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 pb-[100px]">
                {filteredChapters.map((ch, idx) => (
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
          </>
        ) : subjectTab === 'MARKS' ? (
          <div className="space-y-3 pb-6">
            {subjectMarks.length === 0 ? (
              <div className="card-flat p-8 text-center space-y-4">
                <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
                  No Marks Yet
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMark(true)}
                  className="btn-flat min-h-[48px] px-6 text-xs tracking-wider inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--hero-text)',
                  }}
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>ADD MARKS</span>
                </button>
              </div>
            ) : (
              <>
                <div className="card-flat p-4 flex items-center justify-between gap-3 border border-white/[0.06]">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                      AVERAGE ({subjectMarks.length} {subjectMarks.length === 1 ? 'TEST' : 'TESTS'})
                    </p>
                    <p className="font-mono-num text-3xl font-extrabold text-white mt-0.5">
                      {avgMarksPct}%
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddMark(true)}
                    className="btn-flat min-h-[44px] px-4 text-xs tracking-wider inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--hero-text)',
                    }}
                  >
                    <Plus size={15} strokeWidth={3} />
                    <span>ADD MARKS</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {subjectMarks.map((mk, idx) => (
                    <MarkCard
                      key={mk.id}
                      mark={mk}
                      index={idx}
                      onOpenMenu={() => openMarkMenu(mk)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            <form onSubmit={handleAddNote} className="flex items-center gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Mistake or formula..."
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

            {subjectNotes.length === 0 ? (
              <div className="card-flat p-8 text-center">
                <p className="font-display text-xl font-extrabold uppercase text-[#8A8A8A]">
                  No Notes Yet
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {subjectNotes.map((nt, idx) => (
                  <NoteCard
                    key={nt.id}
                    note={nt}
                    index={idx}
                    onOpenMenu={() => openNoteMenu(nt)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <AddChapterModal
          open={showAddChapter}
          onClose={() => setShowAddChapter(false)}
          onSaveSingle={(name) => addChapter(activeSubject.id, name)}
          onSaveBulk={(fromNum, toNum) => addBulkChapters(activeSubject.id, fromNum, toNum)}
        />

        <AddMarkModal
          open={showAddMark}
          onClose={() => setShowAddMark(false)}
          onSave={(title, scored, total) => addMark(activeSubject.id, title, scored, total)}
        />

        <LongPressActionModal
          open={Boolean(longPressChapter)}
          itemLabel={longPressChapter?.name || ''}
          reviseActive={Boolean(longPressChapter?.revise)}
          onMarkRevised={() => {
            if (longPressChapter) markChapterRevised(longPressChapter.id);
          }}
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

        <LongPressActionModal
          open={Boolean(longPressMark)}
          itemLabel={
            longPressMark
              ? `${longPressMark.title} (${longPressMark.scored}/${longPressMark.total})`
              : ''
          }
          allowEdit={false}
          onClose={() => setLongPressMark(null)}
          onDelete={() => {
            if (longPressMark) deleteMark(longPressMark.id);
          }}
        />

        <LongPressActionModal
          open={Boolean(longPressNote)}
          itemLabel={longPressNote?.text || ''}
          onClose={() => setLongPressNote(null)}
          onEdit={(newText) => {
            if (longPressNote) editNote(longPressNote.id, newText);
          }}
          onDelete={() => {
            if (longPressNote) deleteNote(longPressNote.id);
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
