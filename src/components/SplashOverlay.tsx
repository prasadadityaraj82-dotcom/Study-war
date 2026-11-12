import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const TITLE_LETTERS = 'STUDY WAR'.split('');

const GLINTS = [
  { x: -116, y: -76, size: 16, color: '#FFFFFF', delay: 2.15 },
  { x: 118, y: -70, size: 18, color: '#FF2D78', delay: 2.45 },
  { x: 0, y: -124, size: 15, color: '#22C55E', delay: 2.75 },
];

export function SplashOverlay({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'PLAYING' | 'FLASH' | 'DONE'>('PLAYING');
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('FLASH'), 6250);
    const t2 = window.setTimeout(() => {
      setPhase('DONE');
      onFinishRef.current();
    }, 7000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === 'DONE') return null;

  return (
    <div
      data-splash-overlay="true"
      className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center overflow-hidden px-4 select-none"
      role="dialog"
      aria-label="STUDY WAR Opening Animation"
    >
      {/* Subtle Ambient Center Depth Aura */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.55, 0.42, 0.65, 0], scale: [0.7, 1.05, 1, 1.15, 0.9] }}
        transition={{ duration: 6.4, times: [0, 0.12, 0.55, 0.82, 1], ease: 'easeOut' }}
        className="pointer-events-none absolute w-[360px] h-[360px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,45,120,0.22) 0%, rgba(255,45,120,0.06) 45%, rgba(0,0,0,0) 72%)',
        }}
      />

      {/* Top & Bottom Sleek Anime Cinema Letterbox Bars */}
      <motion.div
        aria-hidden="true"
        initial={{ y: -28 }}
        animate={phase === 'FLASH' ? { y: -28 } : { y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute top-0 left-0 right-0 h-7 bg-[#090909] border-b border-white/5 z-10"
      />
      <motion.div
        aria-hidden="true"
        initial={{ y: 28 }}
        animate={phase === 'FLASH' ? { y: 28 } : { y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-7 bg-[#090909] border-t border-white/5 z-10"
      />

      {/* Top Right [SKIP] Button (44px+ Hit Target) */}
      <button
        type="button"
        onClick={() => onFinishRef.current()}
        className="btn-flat absolute top-9 right-5 z-30 min-h-[44px] px-4 py-2 bg-[#1E1E1E] text-white text-xs font-extrabold tracking-wider cursor-pointer"
      >
        SKIP
      </button>

      {/* Clean Anime Speed Beams on Impact Beats */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: '14%', rotate: -14, delay: 0.42 },
          { left: '84%', rotate: 14, delay: 0.44 },
          { left: '22%', rotate: -10, delay: 3.56 },
          { left: '78%', rotate: 10, delay: 3.58 },
        ].map((beam, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: [0, 0.45, 0], scaleY: [0.2, 1.15, 1.3] }}
            transition={{ delay: beam.delay, duration: 0.55, ease: 'easeOut' }}
            style={{ left: beam.left, rotate: `${beam.rotate}deg` }}
            className="absolute top-[16%] w-[2px] h-56 rounded-full bg-gradient-to-b from-transparent via-[#FF2D78] to-transparent"
          />
        ))}
      </div>

      {/* Main Anime + Matiks Stage (with crisp micro-impact shake on title slash) */}
      <motion.div
        animate={
          phase === 'FLASH'
            ? { scale: [1, 1.03, 0.88], opacity: [1, 1, 0] }
            : {
                x: [0, 0, -4, 4, -2, 0],
                y: [0, 0, 3, -2, 1, 0],
                scale: 1,
                opacity: 1,
              }
        }
        transition={
          phase === 'FLASH'
            ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
            : {
                duration: 4.1,
                times: [0, 0.86, 0.88, 0.91, 0.94, 1],
                ease: 'easeOut',
              }
        }
        className="relative flex flex-col items-center justify-center z-20"
      >
        {/* Stage 1–3: Hero Icon Stage */}
        <div className="relative w-76 h-52 flex items-center justify-center">
          {/* Dynamic Ground Shadow (scales cleanly as book lands) */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: [0, 0.85, 0.65], scaleX: [0.3, 1.18, 1] }}
            transition={{ delay: 0.38, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 w-36 h-4 rounded-full bg-[#FF2D78]/25"
          />

          {/* Impact Shockwave Ring */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: [0, 0.95, 0], scale: [0.35, 1.3, 1.75] }}
            transition={{ delay: 0.42, duration: 0.55, ease: 'easeOut' }}
            className="absolute bottom-7 w-40 h-12 rounded-full border-2 border-[#FF2D78] pointer-events-none"
          />

          {/* Clean Anime Wind-Burst Ground Curls */}
          <motion.svg
            aria-hidden="true"
            width="230"
            height="56"
            viewBox="0 0 230 56"
            fill="none"
            className="absolute bottom-6 pointer-events-none"
            initial={{ opacity: 0, scaleX: 0.65 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.65, 1.12, 1.28] }}
            transition={{ delay: 0.42, duration: 0.52, ease: 'easeOut' }}
          >
            <path
              d="M54 38 C38 36, 26 27, 14 29 C22 20, 35 19, 48 25"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M176 38 C192 36, 204 27, 216 29 C208 20, 195 19, 182 25"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </motion.svg>

          {/* Vertical Smear Streak */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: -190, scaleY: 1.7 }}
            animate={{ opacity: [0, 0.95, 0], y: [-190, -10, 18], scaleY: [1.7, 1.1, 0.15] }}
            transition={{ duration: 0.46, ease: 'easeIn' }}
            className="pointer-events-none absolute w-12 h-28 rounded-full bg-gradient-to-b from-transparent via-[#FF2D78]/80 to-white"
          />

          {/* Radial Light Burst when Book Opens */}
          <motion.svg
            aria-hidden="true"
            width="220"
            height="130"
            viewBox="0 0 220 130"
            fill="none"
            className="pointer-events-none absolute -top-2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.85, 0], scale: [0.6, 1.15, 1.3] }}
            transition={{ delay: 1.15, duration: 0.85, ease: 'easeOut' }}
          >
            <line x1="110" y1="88" x2="110" y2="16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="110" y1="88" x2="54" y2="30" stroke="#FF2D78" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="110" y1="88" x2="166" y2="30" stroke="#FF2D78" strokeWidth="2.5" strokeLinecap="round" />
          </motion.svg>

          {/* Crisp 4-Point Anime Sparkle Glints */}
          {GLINTS.map((sp, i) => (
            <motion.svg
              key={i}
              aria-hidden="true"
              width={sp.size}
              height={sp.size}
              viewBox="0 0 24 24"
              fill="none"
              className="absolute pointer-events-none"
              initial={{ opacity: 0, x: sp.x, y: sp.y, scale: 0, rotate: -20 }}
              animate={{
                opacity: [0, 1, 0.25, 0.95, 0],
                scale: [0, 1.2, 0.8, 1.05, 0],
                rotate: [-20, 0, 12, 24],
              }}
              transition={{ delay: sp.delay, duration: 1.35, ease: 'easeInOut' }}
            >
              <path
                d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z"
                fill={sp.color}
              />
            </motion.svg>
          ))}

          {/* Clean Solid Tapered Motion Arcs Behind Pop-Out Icons */}
          <svg
            aria-hidden="true"
            width="220"
            height="130"
            viewBox="0 0 220 130"
            fill="none"
            className="pointer-events-none absolute"
          >
            <motion.path
              d="M104 82 Q52 54 24 24"
              stroke="#FF2D78"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
              transition={{ delay: 1.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M116 82 Q168 54 196 26"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.85, 0] }}
              transition={{ delay: 2.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          {/* 1. Pencil (Clean Arc + Matiks Chunky Shadow + Smooth Float) */}
          <motion.div
            initial={{ opacity: 0, x: 0, y: 18, scale: 0.25, rotate: -50 }}
            animate={{
              opacity: [0, 1, 1],
              x: [0, -56, -94, -88],
              y: [18, -72, -48, -54],
              scale: [0.25, 1.16, 0.96, 1],
              rotate: [-50, -10, -22, -16],
            }}
            transition={{
              delay: 1.9,
              duration: 0.65,
              times: [0, 0.45, 0.78, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute"
            style={{ filter: 'drop-shadow(0px 6px 0px #B3004A)' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, -2.5, 0] }}
              transition={{ delay: 2.65, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                <rect
                  x="18"
                  y="6"
                  width="12"
                  height="28"
                  rx="3.5"
                  fill="#FF2D78"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <rect x="18" y="6" width="12" height="6" rx="2" fill="#FFFFFF" />
                <polygon points="18,34 30,34 24,44" fill="#FFFFFF" />
                <polygon points="22,40 26,40 24,44" fill="#000000" />
              </svg>
            </motion.div>
          </motion.div>

          {/* 2. Stopwatch (Clean Arc + Matiks Chunky Shadow + Smooth Float) */}
          <motion.div
            initial={{ opacity: 0, x: 0, y: 18, scale: 0.25, rotate: 45 }}
            animate={{
              opacity: [0, 1, 1],
              x: [0, 58, 96, 88],
              y: [18, -70, -46, -52],
              scale: [0.25, 1.16, 0.96, 1],
              rotate: [45, -6, 12, 8],
            }}
            transition={{
              delay: 2.18,
              duration: 0.65,
              times: [0, 0.45, 0.78, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute"
            style={{ filter: 'drop-shadow(0px 6px 0px #333333)' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 2.5, 0] }}
              transition={{ delay: 2.9, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="25" r="17" fill="#1E1E1E" stroke="#FFFFFF" strokeWidth="3" />
                <rect x="20" y="4" width="8" height="4" rx="2" fill="#FF2D78" />
                <path
                  d="M24 16V25L31 29"
                  stroke="#FF2D78"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* 3. Victory Check Badge (Top Apex + Matiks Chunky Shadow + Smooth Float) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.2, rotate: -18 }}
            animate={{
              opacity: [0, 1, 1],
              y: [16, -98, -82],
              scale: [0.2, 1.2, 1],
              rotate: [-18, 6, 0],
            }}
            transition={{
              delay: 2.48,
              duration: 0.6,
              times: [0, 0.5, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute"
            style={{ filter: 'drop-shadow(0px 6px 0px #15803D)' }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ delay: 3.1, duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2.5" />
                <path
                  d="M15 24L21 30L33 18"
                  stroke="#FFFFFF"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Matiks-Clean Squash & Stretch Open Book */}
          <motion.div
            initial={{ opacity: 0, y: -150, scaleX: 0.76, scaleY: 1.3 }}
            animate={{
              opacity: [0, 1, 1, 1, 1],
              y: [-150, 7, -9, 2, 0],
              scaleX: [0.76, 1.22, 0.93, 1.04, 1],
              scaleY: [1.3, 0.74, 1.09, 0.97, 1],
            }}
            transition={{
              duration: 0.9,
              times: [0, 0.44, 0.68, 0.86, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
            style={{
              transformOrigin: 'center bottom',
              filter: 'drop-shadow(0px 9px 0px #B3004A)',
            }}
          >
            <svg width="146" height="100" viewBox="0 0 146 100" fill="none">
              {/* Chunky Book Cover */}
              <rect
                x="8"
                y="14"
                width="130"
                height="76"
                rx="15"
                fill="#FF2D78"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              {/* Subtle Top Highlight Strip (Matiks glossy rim) */}
              <rect x="16" y="17" width="114" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.22" />

              {/* Left Page */}
              <motion.rect
                x="16"
                y="21"
                width="54"
                height="61"
                rx="7"
                fill="#FFFFFF"
                initial={{ scaleX: 0.8 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.95, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Turning Page Motion Silhouette */}
              <motion.path
                d="M73 21 Q95 9 114 21 L114 82 Q95 70 73 82 Z"
                fill="#FFE0EE"
                initial={{ opacity: 0, scaleX: 0.15 }}
                animate={{ opacity: [0, 0.95, 0], scaleX: [0.15, 1, 0.1] }}
                transition={{ delay: 1.06, duration: 0.42, ease: 'easeInOut' }}
                style={{ transformOrigin: '73px 51px' }}
              />

              {/* Right Page */}
              <motion.rect
                x="76"
                y="21"
                width="54"
                height="61"
                rx="7"
                fill="#F5F5F5"
                initial={{ scaleX: 0.06, opacity: 0.35 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '76px 51px' }}
              />

              {/* Clean Page Ink Lines */}
              <line x1="24" y1="35" x2="60" y2="35" stroke="#FF2D78" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="24" y1="48" x2="54" y2="48" stroke="#D4D4D4" strokeWidth="3" strokeLinecap="round" />
              <line x1="24" y1="60" x2="48" y2="60" stroke="#D4D4D4" strokeWidth="3" strokeLinecap="round" />
              <line x1="84" y1="35" x2="120" y2="35" stroke="#FF2D78" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="84" y1="48" x2="114" y2="48" stroke="#D4D4D4" strokeWidth="3" strokeLinecap="round" />

              {/* Center Spine */}
              <rect x="70" y="16" width="6" height="70" rx="3" fill="#B3004A" />
            </svg>
          </motion.div>
        </div>

        {/* Stage 4: Katana Slash + "STUDY WAR" Matiks Title + Sheen */}
        <div className="relative mt-2 overflow-hidden px-3 py-1">
          {/* Crisp Anime Slash */}
          <motion.svg
            aria-hidden="true"
            width="320"
            height="72"
            viewBox="0 0 320 72"
            fill="none"
            className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.path
              d="M10 54 Q160 22 310 14"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ delay: 3.5, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.path
              d="M18 58 Q162 28 302 22"
              stroke="#FF2D78"
              strokeWidth="6.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.85, 0] }}
              transition={{ delay: 3.53, duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>

          {/* Diagonal Specular Sheen Sweep Across Settled Title */}
          <motion.div
            aria-hidden="true"
            initial={{ x: '-140%', opacity: 0 }}
            animate={{ x: ['-140%', '180%'], opacity: [0, 0.55, 0] }}
            transition={{ delay: 4.65, duration: 0.65, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 z-10"
          />

          <div className="flex items-center justify-center gap-1">
            {TITLE_LETTERS.map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: -34, scaleY: 1.32, scaleX: 0.82 }}
                animate={{
                  opacity: [0, 1, 1, 1],
                  y: [-34, 4, -1, 0],
                  scaleY: [1.32, 0.86, 1.05, 1],
                  scaleX: [0.82, 1.12, 0.97, 1],
                }}
                transition={{
                  delay: 3.76 + idx * 0.07,
                  duration: 0.4,
                  times: [0, 0.48, 0.78, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-5xl sm:text-6xl font-extrabold uppercase text-white inline-block"
                style={{
                  transformOrigin: 'center bottom',
                  textShadow: '0 6px 0 #B3004A',
                  minWidth: char === ' ' ? '14px' : undefined,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Stage 5: "WIN YOUR DAY" + Tapered Brush Underline */}
        <div className="mt-3 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 8, letterSpacing: '0.32em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.20em' }}
            transition={{ delay: 4.95, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base font-extrabold uppercase text-white"
          >
            WIN YOUR DAY
          </motion.p>
          <svg width="164" height="14" viewBox="0 0 164 14" fill="none" className="mt-1">
            <motion.path
              d="M6 8 Q82 3 158 7"
              stroke="#FF2D78"
              strokeWidth="5.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 5.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Stage 6: Clean Anime White Flash Out */}
      {phase === 'FLASH' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.92, 0] }}
          transition={{ duration: 0.72, ease: 'easeInOut' }}
          className="fixed inset-0 bg-white pointer-events-none z-40"
        />
      )}
    </div>
  );
}
