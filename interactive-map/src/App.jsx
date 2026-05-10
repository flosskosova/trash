import { useState, useCallback } from 'react'
import { Trash2, ExternalLink } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import GraphCanvas from './components/GraphCanvas'
import ActorSidebar from './components/ActorSidebar'
import NewsTicker from './components/NewsTicker'
import LeftSidebar from './components/LeftSidebar'
import LeverIcon from './components/LeverIcon'
import { useActiveLever } from './hooks/useActiveLever'

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const {
    activeLever,
    activeLeverId,
    affectedNodeIds,
    affectedEdgeIds,
    revealedNodeIds,
    revealedEdgeIds,
    toggleLever,
  } = useActiveLever()

  const handleNodeClick = useCallback((node) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node))
  }, [])

  const handleCloseSidebar = useCallback(() => setSelectedNode(null), [])

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden" style={{ background: '#07090F' }}>

      {/* ── Top header ─────────────────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center gap-3 px-4 z-50"
        style={{
          height: 48,
          background: '#07090F',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
          className="shrink-0 w-8 h-8 flex flex-col justify-center items-center gap-[5px] rounded-md transition-colors hover:bg-white/5"
        >
          <span
            className="block h-px bg-slate-400 transition-all duration-200"
            style={{ width: sidebarOpen ? 14 : 16, transform: sidebarOpen ? 'none' : 'none' }}
          />
          <span className="block w-4 h-px bg-slate-400" />
          <span
            className="block h-px bg-slate-400 transition-all duration-200"
            style={{ width: sidebarOpen ? 10 : 16 }}
          />
        </button>

        <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Small trash icon accent */}
          <span
            className="shrink-0 w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Trash2 size={13} className="text-red-400" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <span className="text-white font-semibold text-sm tracking-tight">Pristina Trash System</span>
            <span className="hidden sm:inline text-slate-600 text-xs ml-2">Actor map · May 2026</span>
          </div>
        </div>

        {/* Active scenario pill */}
        <div className="ml-auto flex items-center gap-3">
          <AnimatePresence mode="wait">
            {activeLever && (
              <motion.div
                key={activeLever.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: -4 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{    opacity: 0, scale: 0.85, y: -4 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.6 }}
                className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                style={
                  activeLever.historical
                    ? {
                        background: 'rgba(251,191,36,0.1)',
                        color: '#FDE68A',
                        border: '1px solid rgba(251,191,36,0.25)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.07)',
                        color: '#E2E8F0',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }
                }
              >
                <LeverIcon
                  iconName={activeLever.iconName}
                  size={13}
                  style={{ color: activeLever.historical ? '#FDE68A' : '#E2E8F0' }}
                />
                <span className="max-w-[160px] truncate">{activeLever.title}</span>
                {activeLever.historical && (
                  <span
                    className="text-[8px] font-black uppercase tracking-widest px-1 py-0.5 rounded"
                    style={{ background: 'rgba(251,191,36,0.2)', color: '#F59E0B' }}
                  >
                    REPLAY
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href="https://github.com/flosskosova/trash"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-600 hover:text-slate-400 text-xs transition-colors"
          >
            GitHub
            <ExternalLink size={10} strokeWidth={2} />
          </a>
        </div>
      </header>

      {/* ── Body row ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar */}
        <LeftSidebar
          open={sidebarOpen}
          activeLeverId={activeLeverId}
          activeLever={activeLever}
          onToggle={toggleLever}
        />

        {/* Canvas wrapper */}
        <div className="flex-1 relative overflow-hidden">
          {/* Floating news ticker */}
          <AnimatePresence>
            {activeLever && <NewsTicker lever={activeLever} />}
          </AnimatePresence>

          <GraphCanvas
            selectedNodeId={selectedNode?.id}
            onNodeClick={handleNodeClick}
            affectedNodeIds={affectedNodeIds}
            affectedEdgeIds={affectedEdgeIds}
            revealedNodeIds={revealedNodeIds}
            revealedEdgeIds={revealedEdgeIds}
            activeLever={activeLever}
          />
        </div>

        {/* Actor detail panel */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <ActorSidebar
              key={selectedNode.id}
              node={selectedNode}
              activeLever={activeLever}
              onClose={handleCloseSidebar}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
