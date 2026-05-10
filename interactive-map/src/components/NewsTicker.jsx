// NewsTicker — floating pill banner that overlays the graph canvas.
// Historical levers: amber archive style. Others: subtle white/glass style.

import { Film, Radio } from 'lucide-react'
import { motion } from 'motion/react'

export default function NewsTicker({ lever }) {
  if (!lever) return null

  const isHistorical = !!lever.historical
  // Duplicate for seamless CSS loop
  const doubled = [...lever.headlines, ...lever.headlines]

  return (
    <motion.div
      key={lever.id}
      initial={{ opacity: 0, y: -16, x: '-50%', scale: 0.94 }}
      animate={{ opacity: 1, y: 0,   x: '-50%', scale: 1    }}
      exit={{    opacity: 0, y: -16, x: '-50%', scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 360, damping: 26, mass: 0.7 }}
      className="absolute top-4 left-1/2 z-30 pointer-events-none"
      style={{ maxWidth: 'min(600px, calc(100% - 32px))' }}
    >
      <div
        className="flex items-stretch rounded-full overflow-hidden shadow-2xl"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHistorical
            ? '1px solid rgba(245,158,11,0.28)'
            : '1px solid rgba(255,255,255,0.1)',
          background: isHistorical
            ? 'rgba(28,14,0,0.88)'
            : 'rgba(10,13,22,0.88)',
          boxShadow: isHistorical
            ? '0 8px 40px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.5)'
            : '0 8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Label badge */}
        <div
          className="shrink-0 flex items-center px-3.5 select-none"
          style={{
            background: isHistorical
              ? 'rgba(245,158,11,0.18)'
              : 'rgba(255,255,255,0.07)',
            borderRight: isHistorical
              ? '1px solid rgba(245,158,11,0.2)'
              : '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.14em] whitespace-nowrap"
            style={{ color: isHistorical ? '#FDE68A' : '#94A3B8' }}
          >
            {isHistorical
              ? <><Film size={10} strokeWidth={2} /> REPLAY</>
              : <><Radio size={10} strokeWidth={2} /> LIVE</>
            }
          </span>
        </div>

        {/* Scrolling text */}
        <div className="flex-1 overflow-hidden flex items-center" style={{ minWidth: 0 }}>
          <div className="ticker-track py-2 select-none">
            {doubled.map((headline, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-4 shrink-0 whitespace-nowrap"
                style={{ color: isHistorical ? '#FDE68A99' : '#64748B' }}
              >
                {headline}
                <span
                  className="mx-3 text-[8px]"
                  style={{ color: isHistorical ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.12)' }}
                >
                  ◆
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
