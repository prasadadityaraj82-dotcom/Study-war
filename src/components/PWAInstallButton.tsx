import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="btn-flat w-full min-h-[50px] bg-[#1E1E1E] text-white text-sm tracking-wider flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
      >
        <Download size={18} style={{ color: 'var(--primary)' }} />
        <span>INSTALL APP</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="btn-flat w-full min-h-[50px] bg-[#1E1E1E] text-white text-sm tracking-wider flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
        >
          <Download size={18} style={{ color: 'var(--primary)' }} />
          <span>INSTALL ON IOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="dna-card w-full max-w-sm p-5 border border-white/10 space-y-4 animate-item-in">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold uppercase text-white">
                  Install App
                </h2>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close"
                  className="btn-flat w-9 h-9 bg-[#000000] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 text-xs font-bold uppercase text-[#D4D4D4]">
                <p>1. Tap Safari Share</p>
                <p>2. Tap Add to Home Screen</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="btn-flat w-full min-h-[46px] text-xs tracking-wider cursor-pointer"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--hero-text)',
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
