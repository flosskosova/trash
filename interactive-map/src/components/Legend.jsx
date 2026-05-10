import { TIER_COLORS } from '../data/nodes'
import { EDGE_COLORS } from '../data/edges'

const TIERS = [
  { key: 'operational', label: 'Operational' },
  { key: 'municipal',   label: 'Municipal' },
  { key: 'national',    label: 'National' },
  { key: 'citizens',    label: 'Citizens' },
  { key: 'informal',    label: 'Informal' },
  { key: 'external',    label: 'External' },
  { key: 'endpoint',    label: 'Physical' },
  { key: 'blocked',     label: 'Blocked' },
]

const EDGE_LEGEND = [
  { key: 'money',       label: 'Money flow',  dash: null },
  { key: 'authority',   label: 'Authority',    dash: '6 3' },
  { key: 'political',   label: 'Political',    dash: '3 3' },
  { key: 'oversight',   label: 'Oversight',    dash: '8 4' },
  { key: 'operational', label: 'Operational',  dash: null },
]

export default function Legend() {
  return (
    <div className="absolute top-3 left-3 z-30 bg-slate-900/90 backdrop-blur rounded-lg border border-slate-700 px-3 py-2.5 text-xs">
      <p className="text-slate-500 font-semibold uppercase tracking-widest text-[9px] mb-2">Node tiers</p>
      <div className="space-y-1 mb-3">
        {TIERS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: TIER_COLORS[key] }} />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-slate-500 font-semibold uppercase tracking-widest text-[9px] mb-2">Edge types</p>
      <div className="space-y-1">
        {EDGE_LEGEND.map(({ key, label, dash }) => (
          <div key={key} className="flex items-center gap-1.5">
            <svg width="20" height="8" className="shrink-0">
              <line
                x1="0" y1="4" x2="20" y2="4"
                stroke={EDGE_COLORS[key] ?? '#64748B'}
                strokeWidth="1.5"
                strokeDasharray={dash ?? undefined}
              />
            </svg>
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
