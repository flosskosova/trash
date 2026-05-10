// Custom edge label tooltip (shown on hover via React Flow's edgeTypes)
// Used as a floating label mid-edge for key relationships

export default function EdgeLabel({ label, status }) {
  if (!label) return null

  const statusColor = {
    active:   'bg-slate-700 text-slate-300 border-slate-600',
    disputed: 'bg-red-950 text-red-300 border-red-700',
    resolved: 'bg-slate-800 text-slate-500 border-slate-700',
    broken:   'bg-red-950 text-red-400 border-red-800',
  }[status] ?? 'bg-slate-700 text-slate-300 border-slate-600'

  return (
    <div className={`px-1.5 py-0.5 rounded border text-[9px] font-medium whitespace-nowrap pointer-events-none ${statusColor}`}>
      {label}
    </div>
  )
}
