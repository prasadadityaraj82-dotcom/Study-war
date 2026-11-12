import { useEffect, useRef, useState } from 'react';

export function useLongPress(onLongPress: () => void, onClick: () => void, delay = 450) {
  const timerRef = useRef<number | null>(null);
  const holdVisualTimerRef = useRef<number | null>(null);
  const longPressFired = useRef(false);
  const movedRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const clear = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (holdVisualTimerRef.current !== null) {
      window.clearTimeout(holdVisualTimerRef.current);
      holdVisualTimerRef.current = null;
    }
    setIsHolding(false);
    startPosRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (holdVisualTimerRef.current !== null) window.clearTimeout(holdVisualTimerRef.current);
    };
  }, []);

  const isMenuButton = (target: EventTarget | null) => {
    return Boolean((target as HTMLElement | null)?.closest('[data-card-menu="true"]'));
  };

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (isMenuButton(e.target)) return;
      longPressFired.current = false;
      movedRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };

      holdVisualTimerRef.current = window.setTimeout(() => {
        if (!movedRef.current) setIsHolding(true);
      }, 95);

      timerRef.current = window.setTimeout(() => {
        longPressFired.current = true;
        clear();
        onLongPress();
      }, delay);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!startPosRef.current) return;
      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);
      if (dx > 10 || dy > 10) {
        movedRef.current = true;
        clear();
      }
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (isMenuButton(e.target)) return;
      const fired = longPressFired.current;
      const moved = movedRef.current;
      clear();
      if (!fired && !moved) {
        onClick();
      }
    },
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e: React.MouseEvent) => {
      if (isMenuButton(e.target)) return;
      e.preventDefault();
      clear();
      onLongPress();
    },
  };

  return { handlers, isHolding };
}
