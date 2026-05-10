import { Banknote, Scale, Globe, Truck } from 'lucide-react'

const ICON_MAP = {
  Banknote,
  Scale,
  Globe,
  Truck,
}

/**
 * Renders the correct lucide icon for a lever by its `iconName` string.
 * Falls back gracefully if the name is unknown.
 */
export default function LeverIcon({ iconName, size = 14, className = '', style = {} }) {
  const Icon = ICON_MAP[iconName]
  if (!Icon) return null
  return <Icon size={size} className={className} style={style} strokeWidth={1.75} />
}
