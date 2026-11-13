import { useEffect, useState } from 'react';
import { CheckCheck, Pencil, RotateCw, Trash2, X } from 'lucide-react';
import { CLASS_OPTIONS, QUICK_SUBJECT_CHIPS } from '../data/studyData';

export function AddSubjectWizard({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, studentClass: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  useEffect(() => {
    if (open) {
      setStep(1);
      setName('');
      setStudentClass('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
            STEP {step} OF 2
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              Subject Name?
            </h2>

            {/* Quick Add Chips: Gujarati first, FLAT */}
            <div className="flex flex-wrap gap-2">
              {QUICK_SUBJECT_CHIPS.map((chip) => {
                const selected = name === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setName(chip)}
                    className="btn-flat px-3.5 py-2 text-xs cursor-pointer"
                    style={{
                      backgroundColor: selected ? 'var(--primary)' : '#000000',
                      color: selected ? 'var(--hero-text)' : '#FFFFFF',
                    }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) setStep(2);
              }}
              placeholder="e.g. Gujarati"
              className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
            />

            <button
              type="button"
              disabled={!name.trim()}
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
              Which Class?
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {CLASS_OPTIONS.map((cls) => {
                const selected = studentClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setStudentClass(cls)}
                    className="btn-flat min-h-[44px] font-mono-num text-sm cursor-pointer"
                    style={{
                      backgroundColor: selected ? 'var(--primary)' : '#000000',
                      color: selected ? 'var(--hero-text)' : '#FFFFFF',
                    }}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!studentClass}
              onClick={() => {
                onSave(name.trim(), studentClass);
                onClose();
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
  );
}

export function SingleInputModal({
  open,
  title,
  placeholder,
  initialValue = '',
  buttonLabel = 'SAVE',
  quickChips,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  buttonLabel?: string;
  quickChips?: string[];
  onClose: () => void;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold uppercase text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {quickChips && quickChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar">
            {quickChips.map((chip) => {
              const selected = value === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setValue(chip)}
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onSave(value.trim());
              onClose();
            }
          }}
          placeholder={placeholder}
          className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
        />

        <button
          type="button"
          disabled={!value.trim()}
          onClick={() => {
            onSave(value.trim());
            onClose();
          }}
          className="btn-flat w-full min-h-[48px] text-sm tracking-wider cursor-pointer"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--hero-text)',
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

const BULK_PRESETS = [
  { label: '1 - 5', from: 1, to: 5 },
  { label: '1 - 10', from: 1, to: 10 },
  { label: '1 - 15', from: 1, to: 15 },
  { label: '1 - 20', from: 1, to: 20 },
];

export function AddChapterModal({
  open,
  onClose,
  onSaveSingle,
  onSaveBulk,
}: {
  open: boolean;
  onClose: () => void;
  onSaveSingle: (name: string) => void;
  onSaveBulk: (fromNum: number, toNum: number) => void;
}) {
  const [mode, setMode] = useState<'SINGLE' | 'BULK'>('SINGLE');
  const [name, setName] = useState('');
  const [fromNum, setFromNum] = useState(1);
  const [toNum, setToNum] = useState(10);

  useEffect(() => {
    if (open) {
      setMode('SINGLE');
      setName('');
      setFromNum(1);
      setToNum(10);
    }
  }, [open]);

  if (!open) return null;

  const safeFrom = Math.max(1, Math.min(fromNum || 1, toNum || 1));
  const safeTo = Math.min(safeFrom + 49, Math.max(fromNum || 1, toNum || 1));
  const bulkCount = safeTo - safeFrom + 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold uppercase text-white">
            Add Chapter
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switch: SINGLE | BULK 1-10 */}
        <div className="grid grid-cols-2 gap-2">
          {(['SINGLE', 'BULK'] as const).map((tab) => {
            const active = mode === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className="btn-flat min-h-[40px] text-xs tracking-wider cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--primary)' : '#000000',
                  color: active ? 'var(--hero-text)' : '#8A8A8A',
                }}
              >
                {tab === 'SINGLE' ? 'SINGLE' : 'BULK 1 - 10'}
              </button>
            );
          })}
        </div>

        {mode === 'SINGLE' ? (
          <div className="space-y-4">
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  onSaveSingle(name.trim());
                  onClose();
                }
              }}
              placeholder="e.g. Chapter 1"
              className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
            />
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => {
                onSaveSingle(name.trim());
                onClose();
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
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {BULK_PRESETS.map((preset) => {
                const selected = fromNum === preset.from && toNum === preset.to;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setFromNum(preset.from);
                      setToNum(preset.to);
                    }}
                    className="btn-flat min-h-[38px] font-mono-num text-xs cursor-pointer"
                    style={{
                      backgroundColor: selected ? 'var(--primary)' : '#000000',
                      color: selected ? 'var(--hero-text)' : '#FFFFFF',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A8A8A] mb-1">
                  FROM
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={fromNum}
                  onChange={(e) => setFromNum(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full min-h-[46px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-mono-num font-bold text-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A8A8A] mb-1">
                  TO
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={toNum}
                  onChange={(e) => setToNum(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full min-h-[46px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-mono-num font-bold text-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSaveBulk(safeFrom, safeTo);
                onClose();
              }}
              className="btn-flat w-full min-h-[48px] text-sm tracking-wider cursor-pointer"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--hero-text)',
              }}
            >
              ADD {bulkCount} {bulkCount === 1 ? 'CHAPTER' : 'CHAPTERS'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const TEST_NAME_CHIPS = ['Unit Test', 'Weekly Test', 'Mock Test', 'Pre-Board'];
const TOTAL_MARKS_CHIPS = [20, 40, 80, 100];

export function AddMarkModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, scored: number, total: number) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [scored, setScored] = useState('');
  const [total, setTotal] = useState('100');

  useEffect(() => {
    if (open) {
      setStep(1);
      setTitle('');
      setScored('');
      setTotal('100');
    }
  }, [open]);

  if (!open) return null;

  const scoredNum = Number(scored);
  const totalNum = Number(total);
  const scoredValid = scored.trim() !== '' && !Number.isNaN(scoredNum) && scoredNum >= 0;
  const totalValid =
    total.trim() !== '' &&
    !Number.isNaN(totalNum) &&
    totalNum > 0 &&
    totalNum >= (scoredValid ? scoredNum : 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
            STEP {step} OF 3
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              Test Name?
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {TEST_NAME_CHIPS.map((chip) => {
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
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && title.trim()) setStep(2);
              }}
              placeholder="e.g. Unit Test 1"
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
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              Marks Scored?
            </h2>
            <input
              type="number"
              min={0}
              step="0.5"
              autoFocus
              value={scored}
              onChange={(e) => setScored(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && scoredValid) setStep(3);
              }}
              placeholder="e.g. 36"
              className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-lg font-mono-num font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
            />
            <button
              type="button"
              disabled={!scoredValid}
              onClick={() => setStep(3)}
              className="btn-flat w-full min-h-[48px] text-sm tracking-wider cursor-pointer"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--hero-text)',
              }}
            >
              NEXT
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              Out Of Total?
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {TOTAL_MARKS_CHIPS.map((t) => {
                const selected = Number(total) === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTotal(String(t))}
                    className="btn-flat min-h-[44px] font-mono-num text-sm cursor-pointer"
                    style={{
                      backgroundColor: selected ? 'var(--primary)' : '#000000',
                      color: selected ? 'var(--hero-text)' : '#FFFFFF',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <input
              type="number"
              min={1}
              step="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && totalValid) {
                  onSave(title.trim(), scoredNum, totalNum);
                  onClose();
                }
              }}
              placeholder="e.g. 40"
              className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-lg font-mono-num font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[var(--primary)]"
            />
            <button
              type="button"
              disabled={!totalValid}
              onClick={() => {
                onSave(title.trim(), scoredNum, totalNum);
                onClose();
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
  );
}

export function LongPressActionModal({
  open,
  itemLabel,
  allowEdit = true,
  reviseActive,
  onToggleRevise,
  onMarkRevised,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean;
  itemLabel: string;
  allowEdit?: boolean;
  reviseActive?: boolean;
  onToggleRevise?: () => void;
  onMarkRevised?: () => void;
  onClose: () => void;
  onEdit?: (newName: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(itemLabel);

  useEffect(() => {
    if (open) {
      setEditing(false);
      setName(itemLabel);
    }
  }, [open, itemLabel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-extrabold uppercase text-white truncate">
            {editing ? 'Edit Name?' : itemLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {editing && onEdit ? (
          <div className="space-y-3">
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  onEdit(name.trim());
                  onClose();
                }
              }}
              className="w-full min-h-[48px] rounded-[16px] bg-[#000000] border border-white/15 px-4 text-base font-bold text-white focus:outline-none focus:border-[var(--primary)]"
            />
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => {
                onEdit(name.trim());
                onClose();
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
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {onMarkRevised && (
              <button
                type="button"
                onClick={() => {
                  onMarkRevised();
                  onClose();
                }}
                className="btn-flat min-h-[48px] bg-[#22C55E] text-white text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCheck size={16} />
                <span>REVISED TODAY</span>
              </button>
            )}
            {onToggleRevise && (
              <button
                type="button"
                onClick={() => {
                  onToggleRevise();
                  onClose();
                }}
                className="btn-flat min-h-[48px] text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: reviseActive ? '#F97316' : '#000000',
                  color: '#FFFFFF',
                }}
              >
                <RotateCw size={16} />
                <span>{reviseActive ? 'REMOVE REVISE' : 'MARK REVISE'}</span>
              </button>
            )}
            {allowEdit && onEdit && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-flat min-h-[48px] bg-[#000000] text-white text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pencil size={16} />
                <span>EDIT</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="btn-flat min-h-[48px] bg-[#EF4444] text-white text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={16} />
              <span>DELETE</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
