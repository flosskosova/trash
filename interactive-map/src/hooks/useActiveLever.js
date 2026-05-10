import { useState, useMemo, useEffect, useRef } from 'react'
import { levers } from '../data/levers'

// Wave delay between each group of nodes (ms)
const WAVE_DELAY = 300

export function useActiveLever() {
  const [activeLeverId, setActiveLeverId] = useState(null)
  // revealedNodeIds grows wave-by-wave after lever activation (for stress + reactions)
  const [revealedNodeIds, setRevealedNodeIds] = useState(new Set())
  // revealedEdgeIds appears after all node waves
  const [revealedEdgeIds, setRevealedEdgeIds] = useState(new Set())
  const timeoutsRef = useRef([])

  const activeLever = useMemo(
    () => levers.find((l) => l.id === activeLeverId) ?? null,
    [activeLeverId]
  )

  // Full set — used for dimming (stable from lever activation)
  const affectedNodeIds = useMemo(
    () => new Set(activeLever?.affectedNodeIds ?? []),
    [activeLever]
  )

  const affectedEdgeIds = useMemo(
    () => new Set(activeLever?.affectedEdgeIds ?? []),
    [activeLever]
  )

  // Shock-wave: progressively reveal nodes in the order defined by revealOrder
  useEffect(() => {
    // Clear any in-flight timeouts from the previous lever
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    if (!activeLeverId) {
      setRevealedNodeIds(new Set())
      setRevealedEdgeIds(new Set())
      return
    }

    const lever = levers.find((l) => l.id === activeLeverId)
    if (!lever) return

    const waves = lever.revealOrder ?? [lever.affectedNodeIds]
    const accumulated = new Set()
    let delay = 0

    waves.forEach((wave) => {
      const t = setTimeout(() => {
        wave.forEach((id) => accumulated.add(id))
        setRevealedNodeIds(new Set(accumulated))
      }, delay)
      timeoutsRef.current.push(t)
      delay += WAVE_DELAY
    })

    // Edges animate in after all node waves settle
    const edgeT = setTimeout(() => {
      setRevealedEdgeIds(new Set(lever.affectedEdgeIds))
    }, delay + 50)
    timeoutsRef.current.push(edgeT)

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [activeLeverId])

  function toggleLever(id) {
    setActiveLeverId((prev) => (prev === id ? null : id))
  }

  return {
    activeLever,
    activeLeverId,
    // affectedNodeIds / affectedEdgeIds — full set, drives dimming (stable)
    affectedNodeIds,
    affectedEdgeIds,
    // revealedNodeIds / revealedEdgeIds — grows over time, drives stress + reactions
    revealedNodeIds,
    revealedEdgeIds,
    toggleLever,
  }
}
