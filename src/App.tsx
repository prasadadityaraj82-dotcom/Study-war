/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { CelebrationBurst } from './components/CelebrationBurst';
import { FocusView } from './components/FocusView';
import { HomeView } from './components/HomeView';
import { HomeworkView } from './components/HomeworkView';
import { MenuView } from './components/MenuView';
import { PendingView } from './components/PendingView';
import { ProfileView } from './components/ProfileView';
import { ProgressView } from './components/ProgressView';
import { ScheduleView } from './components/ScheduleView';
import { SplashOverlay } from './components/SplashOverlay';
import { SubjectsView } from './components/SubjectsView';
import { TomorrowView } from './components/TomorrowView';
import { TopBar } from './components/TopBar';
import { StudyProvider, useStudy } from './context/StudyContext';
import { useOnlineStatus } from './hooks/usePWAInstall';
import { soundEngine } from './utils/soundEngine';

function StudyWarShell() {
  const { activeTab, focusLaunchCount, toast, celebrationCount } = useStudy();
  const [showSplash, setShowSplash] = useState(true);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('[data-splash-overlay="true"]')) return;

      soundEngine.unlock();

      const btn3d = target.closest('.btn-3d-main') as HTMLButtonElement | null;
      if (btn3d && !btn3d.disabled) {
        soundEngine.play3dPress();
        return;
      }

      if (target.closest('.tick-flat')) return;

      const btnFlat = target.closest('.btn-flat') as HTMLButtonElement | null;
      if (btnFlat && !btnFlat.disabled) {
        soundEngine.playPop();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'HOME':
        return <HomeView />;
      case 'SUBJECTS':
        return <SubjectsView />;
      case 'SCHEDULE':
        return <ScheduleView />;
      case 'HOMEWORK':
        return <HomeworkView />;
      case 'PROGRESS':
        return <ProgressView />;
      case 'MENU':
        return <MenuView />;
      case 'PROFILE':
        return <ProfileView />;
      case 'FOCUS':
        return <FocusView key={focusLaunchCount} />;
      case 'TOMORROW':
        return <TomorrowView />;
      case 'PENDING':
        return <PendingView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col">
      {showSplash && <SplashOverlay onFinish={() => setShowSplash(false)} />}

      <TopBar />

      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-2"
        >
          <div className="rounded-xl bg-[#1E1E1E] border border-[#FB923C]/40 px-3.5 py-2 flex items-center justify-center gap-2 text-[#FB923C]">
            <WifiOff size={14} className="shrink-0" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              OFFLINE MODE — READY
            </span>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 pb-28 overflow-x-hidden">
        <div key={activeTab} className="animate-screen">
          {renderScreen()}
        </div>
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider whitespace-nowrap animate-item-in"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--hero-text)',
          }}
        >
          {toast}
        </div>
      )}

      <CelebrationBurst burstKey={celebrationCount} />

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <StudyWarShell />
    </StudyProvider>
  );
}
