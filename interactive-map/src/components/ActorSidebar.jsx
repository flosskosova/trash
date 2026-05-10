import { X, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { TIER_COLORS } from '../data/nodes'
import LeverIcon from './LeverIcon'

/* Stagger settings shared between sections */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 26 } },
}

const TIER_LABELS = {
  operational: 'Operational',
  municipal:   'Municipal',
  national:    'National',
  citizens:    'Citizens',
  informal:    'Informal',
  external:    'External',
  endpoint:    'Physical endpoint',
  blocked:     'Blocked / Contested',
}

export default function ActorSidebar({ node, activeLever, onClose }) {
  if (!node) return null

  const d     = node.data
  const color = TIER_COLORS[d.tier] ?? '#94A3B8'
  const leverEffect = activeLever?.nodeEffects?.[node.id] ?? null

  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0,  opacity: 1 }}
      exit={{    x: 60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        width: 340,
        background: '#0A0D16',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '-16px 0 48px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-5 py-4 sticky top-0 z-10"
        style={{
          background: `linear-gradient(135deg, ${color}10 0%, transparent 60%), #0A0D16`,
          borderBottom: `1px solid ${color}22`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* Tier label */}
            <div
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-2"
              style={{ background: `${color}18`, color }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
              {TIER_LABELS[d.tier] ?? d.tier}
            </div>

            <h2 className="text-white font-bold text-base leading-tight mb-0.5">{d.label}</h2>

            {d.fullName !== d.label && (
              <p className="text-slate-500 text-xs leading-tight">{d.fullName}</p>
            )}
            {d.keyPerson && (
              <p className="text-slate-600 text-xs mt-0.5 italic">{d.keyPerson}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors mt-0.5"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto sidebar-scroll px-5 py-5 space-y-6"
      >

        {/* Lever effect banner */}
        {leverEffect && (
          <motion.div variants={itemVariants}>
            <LeverBanner effect={leverEffect} lever={activeLever} />
          </motion.div>
        )}

        {/* Role */}
        <motion.div variants={itemVariants}>
          <Section title="Role">
            <p className="text-slate-300 text-sm leading-relaxed">{d.role}</p>
          </Section>
        </motion.div>

        {/* What they control */}
        {d.leverage?.length > 0 && (
          <motion.div variants={itemVariants}>
            <Section title="What they control">
              <BulletList items={d.leverage} accentColor="#34D399" />
            </Section>
          </motion.div>
        )}

        {/* What they need */}
        {d.dependencies?.length > 0 && (
          <motion.div variants={itemVariants}>
            <Section title="What they need">
              <BulletList items={d.dependencies} accentColor="#FBBF24" />
            </Section>
          </motion.div>
        )}

        {/* What they fear */}
        {d.fears?.length > 0 && (
          <motion.div variants={itemVariants}>
            <Section title="What they fear">
              <BulletList items={d.fears} accentColor="#F87171" />
            </Section>
          </motion.div>
        )}

        {/* Stats table */}
        {d.stats?.length > 0 && (
          <motion.div variants={itemVariants}>
            <Section title="Key numbers">
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {d.stats.map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start gap-3 px-3 py-2.5 text-sm"
                    style={{
                      borderBottom: i < d.stats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <span className="text-slate-500 text-[11px] shrink-0 pt-px">{s.label}</span>
                    <span className="text-slate-200 text-[12px] font-medium text-right font-mono">{s.value}</span>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* Quote */}
        {d.quote && (
          <motion.div
            variants={itemVariants}
            className="rounded-lg px-4 py-3"
            style={{
              background:   'rgba(255,255,255,0.03)',
              borderLeft:   '2px solid rgba(255,255,255,0.12)',
            }}
          >
            <p className="text-slate-300 text-sm leading-relaxed italic">"{d.quote}"</p>
            {d.quoteSource && (
              <p className="text-slate-600 text-xs mt-2">
                — {d.quoteSource}
                {d.quoteUrl && (
                  <>
                    {' '}
                    <a
                      href={d.quoteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-sky-500 hover:text-sky-400 transition-colors"
                    >
                      <ExternalLink size={10} strokeWidth={2} />
                    </a>
                  </>
                )}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.aside>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  )
}

function BulletList({ items, accentColor }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
          <span className="shrink-0 mt-[3px] w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LeverBanner({ effect, lever }) {
  const levels = {
    high:   { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   text: '#FCA5A5', label: 'High stress'   },
    medium: { bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)',  text: '#FDBA74', label: 'Medium stress' },
    low:    { bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.25)',   text: '#FDE047', label: 'Low stress'    },
    none:   { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#94A3B8', label: 'No stress'     },
  }

  const style = levels[effect.stressLevel] ?? levels.none

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className="rounded-xl px-3.5 py-3"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <LeverIcon iconName={lever.iconName} size={13} style={{ color: style.text }} />
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: style.text }}>
          {style.label}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: style.text + 'CC' }}>
        {effect.narrative}
      </p>
    </motion.div>
  )
}
