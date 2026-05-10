import { Handle, Position } from '@xyflow/react'
import { motion, AnimatePresence } from 'motion/react'
import { TIER_COLORS } from '../data/nodes'

const STRESS_GLOW = {
  none:   'none',
  low:    '0 0 10px 2px rgba(234,179,8,0.5)',
  medium: '0 0 14px 4px rgba(249,115,22,0.6)',
  high:   '0 0 18px 6px rgba(239,68,68,0.8)',
}

export default function ActorNode({ data, selected }) {
  const color = TIER_COLORS[data.tier] ?? '#94A3B8'
  const glow  = STRESS_GLOW[data.stressLevel ?? 'none']

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: data.dimmed ? 0.2 : 1,
        scale:   data.stressLevel && data.stressLevel !== 'none' ? 1.04 : 1,
      }}
      whileHover={data.dimmed ? undefined : { scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.6 }}
      style={{
        border: `2px solid ${selected ? '#fff' : color}`,
        boxShadow: selected
          ? `0 0 0 3px ${color}55, ${glow}`
          : glow,
        transition: 'box-shadow 0.4s, border-color 0.3s',
        minWidth: 148,
        maxWidth: 148,
      }}
      className="relative rounded-lg bg-slate-800 px-3 py-2 cursor-pointer select-none"
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

      {/* tier dot + label */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
        <span className="text-white text-xs font-semibold leading-tight truncate">
          {data.label}
        </span>
      </div>

      {/* full name (smaller, muted) */}
      {data.fullName !== data.label && (
        <p className="text-slate-400 text-[10px] leading-tight truncate pl-3.5">
          {data.fullName}
        </p>
      )}

      {/* key person */}
      {data.keyPerson && (
        <p className="text-slate-500 text-[10px] leading-tight pl-3.5 mt-0.5">
          {data.keyPerson}
        </p>
      )}

      {/* stress badge — spring pop in/out as lever waves reveal stressed actors */}
      <AnimatePresence>
        {data.stressLevel && data.stressLevel !== 'none' && (
          <motion.div
            key={data.stressLevel}
            initial={{ opacity: 0, scale: 0.4, y: 4 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{    opacity: 0, scale: 0.4, y: 4 }}
            transition={{ type: 'spring', stiffness: 480, damping: 18, mass: 0.5 }}
            className={`mt-1.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-center
              ${data.stressLevel === 'high'   ? 'bg-red-900/70 text-red-300'       : ''}
              ${data.stressLevel === 'medium' ? 'bg-orange-900/70 text-orange-300' : ''}
              ${data.stressLevel === 'low'    ? 'bg-yellow-900/70 text-yellow-300' : ''}`}
          >
            {data.stressLevel} stress
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
