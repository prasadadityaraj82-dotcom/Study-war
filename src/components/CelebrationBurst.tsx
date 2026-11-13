import { motion } from 'motion/react';

const SPARKS = [
  { angle: -90, dist: 92, size: 10, color: 'var(--primary)', shape: 'circle' },
  { angle: -62, dist: 108, size: 8, color: '#22C55E', shape: 'diamond' },
  { angle: -34, dist: 96, size: 9, color: '#FFFFFF', shape: 'circle' },
  { angle: -8, dist: 112, size: 10, color: 'var(--primary)', shape: 'diamond' },
  { angle: 22, dist: 98, size: 8, color: '#22C55E', shape: 'circle' },
  { angle: 50, dist: 108, size: 9, color: '#FFFFFF', shape: 'diamond' },
  { angle: 82, dist: 90, size: 10, color: 'var(--primary)', shape: 'circle' },
  { angle: 118, dist: 104, size: 8, color: '#22C55E', shape: 'diamond' },
  { angle: 148, dist: 96, size: 9, color: '#FFFFFF', shape: 'circle' },
  { angle: 176, dist: 110, size: 10, color: 'var(--primary)', shape: 'diamond' },
  { angle: -148, dist: 98, size: 8, color: '#22C55E', shape: 'circle' },
  { angle: -120, dist: 106, size: 9, color: '#FFFFFF', shape: 'diamond' },
];

export function CelebrationBurst({ burstKey }: { burstKey: number }) {
  if (burstKey <= 0) return null;

  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {/* Expanding crisp center ring */}
      <motion.div
        initial={{ opacity: 0.85, scale: 0.25 }}
        animate={{ opacity: 0, scale: 2.1 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-24 h-24 rounded-full border-2 border-[#22C55E]"
      />

      {/* 12 crisp 2D sparks */}
      {SPARKS.map((sp, i) => {
        const rad = (sp.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * sp.dist;
        const ty = Math.sin(rad) * sp.dist;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.6, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: tx,
              y: ty,
              scale: [0.6, 1.25, 0.4],
              rotate: sp.shape === 'diamond' ? 135 : 0,
            }}
            transition={{
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              width: sp.size,
              height: sp.size,
              backgroundColor: sp.color,
              borderRadius: sp.shape === 'circle' ? '9999px' : '2px',
            }}
            className="absolute"
          />
        );
      })}
    </div>
  );
}
