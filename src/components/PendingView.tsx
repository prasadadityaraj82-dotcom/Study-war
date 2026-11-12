import { ArrowRight, Trash2 } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export function PendingView() {
  const { getPendingTasks, movePendingToTomorrow, deletePendingItem } = useStudy();
  const pendingTasks = getPendingTasks();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
          PENDING
        </h1>
        <span className="font-mono-num text-sm font-extrabold text-[#F97316]">
          {pendingTasks.length} LEFT
        </span>
      </div>

      {pendingTasks.length === 0 ? (
        <div className="min-h-[52vh] flex items-center justify-center text-center">
          <p className="font-display text-3xl font-extrabold uppercase text-[#22C55E]">
            ALL DONE TODAY
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingTasks.map((task, idx) => (
            <div
              key={`${task.source}-${task.id}`}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="card-flat animate-card-in p-4 sm:p-5 space-y-3 border border-white/[0.06]"
            >
              <p className="text-lg font-extrabold text-white">
                {task.title}
                {task.minutes ? ` - ${task.minutes} min` : ''}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => movePendingToTomorrow(task.source, task.id)}
                  className="btn-flat min-h-[44px] px-3 bg-[#3B82F6] text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>MOVE TO TOMORROW</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => deletePendingItem(task.source, task.id)}
                  className="btn-flat min-h-[44px] px-3 bg-[#EF4444] text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>DELETE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
