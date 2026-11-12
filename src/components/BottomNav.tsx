import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Home,
  Menu as MenuIcon,
  TrendingUp,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { TabKey } from '../types';

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: 'HOME', label: 'HOME', icon: Home },
  { key: 'SUBJECTS', label: 'SUBJECTS', icon: BookOpen },
  { key: 'SCHEDULE', label: 'SCHEDULE', icon: CalendarDays },
  { key: 'HOMEWORK', label: 'HOMEWORK', icon: CheckSquare },
  { key: 'PROGRESS', label: 'PROGRESS', icon: TrendingUp },
  { key: 'MENU', label: 'MENU', icon: MenuIcon },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useStudy();

  return (
    <nav
      aria-label="Primary Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000]/95 backdrop-blur-md border-t border-white/[0.08]"
    >
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 grid grid-cols-6 gap-1.5 sm:gap-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive =
            activeTab === key ||
            (key === 'HOME' &&
              (activeTab === 'FOCUS' || activeTab === 'TOMORROW' || activeTab === 'PENDING')) ||
            (key === 'MENU' && activeTab === 'PROFILE');

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className="btn-flat min-h-[46px] rounded-[16px] flex flex-col items-center justify-center gap-0.5 px-1 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'var(--primary)' : '#1E1E1E',
                color: isActive ? 'var(--hero-text)' : '#8A8A8A',
                boxShadow: isActive ? '0 0 14px rgba(var(--primary-rgb), 0.35)' : 'none',
              }}
            >
              <span
                className="transition-transform duration-200"
                style={{ transform: isActive ? 'translateY(-3px)' : 'translateY(0)' }}
              >
                <Icon size={16} />
              </span>
              <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-tight whitespace-nowrap leading-none">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
