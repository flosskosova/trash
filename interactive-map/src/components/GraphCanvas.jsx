import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import ActorNode from './ActorNode'
import { initialNodes, TIER_COLORS } from '../data/nodes'
import { initialEdges, EDGE_COLORS } from '../data/edges'

const nodeTypes = { actorNode: ActorNode }

// Custom edge with mid-point label and status coloring
function LabeledEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data = {},
  markerEnd,
  style = {},
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  const color = EDGE_COLORS[data.relationshipType] ?? '#64748B'

  const strokeStyle = {
    authority: '6 3',
    political: '3 3',
    oversight: '8 4',
    money:     undefined,
    operational: undefined,
  }[data.relationshipType]

  const opacity = data.dimmed ? 0.12 : (data.status === 'resolved' ? 0.35 : 1)

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: data.highlighted ? color : color,
          strokeWidth: data.highlighted ? 2.5 : 1.5,
          strokeDasharray: strokeStyle,
          opacity,
          transition: 'opacity 0.3s, stroke-width 0.3s',
          ...style,
        }}
      />
      {data.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="nodrag nopan"
          >
            <span
              className={`px-1 py-0.5 rounded text-[8px] font-medium border whitespace-nowrap
                ${data.status === 'disputed' ? 'bg-red-950/90 border-red-700 text-red-300' : ''}
                ${data.status === 'resolved' ? 'bg-slate-800/90 border-slate-700 text-slate-500' : ''}
                ${data.status === 'active'   ? 'bg-slate-800/90 border-slate-700 text-slate-400' : ''}
              `}
              style={{ opacity: data.dimmed ? 0 : 1, transition: 'opacity 0.3s' }}
            >
              {data.label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const edgeTypes = { labeled: LabeledEdge }

export default function GraphCanvas({
  selectedNodeId,
  onNodeClick,
  affectedNodeIds,
  affectedEdgeIds,
  revealedNodeIds,
  revealedEdgeIds,
  activeLever,
}) {
  const hasLever = !!activeLever

  // Derive display nodes:
  // - dimming uses full affectedNodeIds (stable from lever activation, no flicker)
  // - stressLevel + reaction use revealedNodeIds (grows wave-by-wave)
  const displayNodes = useMemo(() => {
    return initialNodes.map((n) => {
      const inAffected = affectedNodeIds.has(n.id)
      const inRevealed = revealedNodeIds.has(n.id)
      const effect     = activeLever?.nodeEffects?.[n.id]
      return {
        ...n,
        data: {
          ...n.data,
          dimmed:      hasLever && !inAffected,
          stressLevel: inRevealed ? (effect?.stressLevel ?? null) : null,
          reaction:    inRevealed ? (effect?.reaction    ?? null) : null,
        },
      }
    })
  }, [hasLever, affectedNodeIds, revealedNodeIds, activeLever])

  // Derive display edges:
  // - dimming uses affectedEdgeIds; animation uses revealedEdgeIds
  const displayEdges = useMemo(() => {
    return initialEdges.map((e) => {
      const inAffected = affectedEdgeIds.has(e.id)
      const inRevealed = revealedEdgeIds.has(e.id)
      return {
        ...e,
        type: 'labeled',
        animated: hasLever && inRevealed,
        data: {
          ...e.data,
          dimmed:      hasLever && !inAffected,
          highlighted: hasLever && inRevealed,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: hasLever && !inAffected
            ? '#1e293b'
            : EDGE_COLORS[e.data.relationshipType] ?? '#64748B',
          width: 12,
          height: 12,
        },
      }
    })
  }, [hasLever, affectedEdgeIds, revealedEdgeIds])

  const [nodes, , onNodesChange] = useNodesState(displayNodes)
  const [edges, , onEdgesChange] = useEdgesState(displayEdges)

  // Keep nodes in sync when lever changes
  const syncedNodes = useMemo(() => {
    return nodes.map((n) => {
      const updated = displayNodes.find((d) => d.id === n.id)
      return updated ? { ...n, data: updated.data } : n
    })
  }, [nodes, displayNodes])

  const syncedEdges = useMemo(() => {
    return edges.map((e) => {
      const updated = displayEdges.find((d) => d.id === e.id)
      return updated ? { ...e, ...updated, data: updated.data } : e
    })
  }, [edges, displayEdges])

  const handleNodeClick = useCallback(
    (_, node) => { onNodeClick(node) },
    [onNodeClick]
  )

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={syncedNodes}
        edges={syncedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'labeled' }}
      >
        <Background color="#1a2540" gap={28} size={1} variant="dots" />
        <Controls />
        <MiniMap
          nodeColor={(n) => TIER_COLORS[n.data?.tier] ?? '#475569'}
          maskColor="rgba(7,9,15,0.75)"
          style={{ background: '#0F1829' }}
        />
      </ReactFlow>
    </div>
  )
}
