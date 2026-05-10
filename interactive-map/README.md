# Pristina Trash Actor Map

An interactive system-map of Pristina's waste management network, built at the **Trash, Please** hackathon — Prishtina Hackerspace, May 9–10, 2026.

Nodes are the real actors in Pristina's waste system (companies, institutions, workers, citizens). Edges are money flows, authority chains, operational dependencies, and political alignments. **Scenario levers** let you ask *"what if?"* and watch the stress propagate through the network in a wave animation.

→ **Live:** [https://github.com/flosskosova/trash](https://github.com/flosskosova/trash)

---

## Screenshots

> The left sidebar shows the legend (node tiers + edge types) and scenario cards. Clicking a node opens a detail panel on the right with actor stats, quotes, and source links.

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
# 1. Clone
git clone https://github.com/flosskosova/trash.git
cd trash/trash-map

# 2. Install
npm install

# 3. Run dev server (http://localhost:5173)
npm run dev
```

### Other scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Project structure

```
trash-map/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ActorNode.jsx        # Custom React Flow node (tier colour, stress badge)
│   │   ├── ActorSidebar.jsx     # Right panel — actor detail, stats, quotes, sources
│   │   ├── EdgeLabel.jsx        # Mid-edge status label
│   │   ├── GraphCanvas.jsx      # React Flow canvas + custom LabeledEdge
│   │   ├── LeftSidebar.jsx      # Collapsible left panel: Legend + Scenario cards
│   │   ├── Legend.jsx           # Standalone floating legend (unused; replaced by LeftSidebar)
│   │   ├── LeverIcon.jsx        # Thin wrapper — renders any lucide-react icon by name
│   │   ├── LeverPanel.jsx       # (legacy) floating lever panel
│   │   └── NewsTicker.jsx       # Scrolling headline bar shown when a scenario is active
│   ├── data/
│   │   ├── edges.js             # Edge definitions + EDGE_COLORS map
│   │   ├── levers.js            # Scenario lever definitions (see "Adding a scenario" below)
│   │   └── nodes.js             # Actor node definitions + TIER_COLORS map
│   ├── hooks/
│   │   └── useActiveLever.js    # Manages active lever state + wave-reveal animation
│   ├── App.jsx                  # Root layout: header, LeftSidebar, GraphCanvas, ActorSidebar
│   ├── index.css                # Global styles + Tailwind imports
│   └── main.jsx                 # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Stack

| Library | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI framework |
| [Vite](https://vite.dev) | 8 | Dev server & bundler |
| [@xyflow/react](https://reactflow.dev) | 12 | Graph canvas (nodes, edges, minimap, controls) |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling (Vite plugin) |
| [lucide-react](https://lucide.dev) | 1 | Icons |
| [DM Sans / DM Mono](https://fonts.google.com) | — | Variable fonts via `@fontsource` |

---

## How the data is structured

### Nodes (`src/data/nodes.js`)

Each actor is a React Flow node of type `actorNode`:

```js
{
  id: 'pastrimi',           // unique — referenced by edges and levers
  type: 'actorNode',
  position: { x, y },       // manual layout (5-tier grid, see file header)
  data: {
    label: 'Pastrimi',                  // short name shown on canvas
    fullName: 'KRM Pastrimi JSC',       // shown in ActorSidebar header
    tier: 'operational',                // drives node colour — see TIER_COLORS
    role: '…',                          // narrative paragraph
    keyPerson: 'CEO Petrit Reçica',     // null if none
    leverage: ['…'],                    // bullet list
    dependencies: ['…'],
    fears: ['…'],
    stats: [{ label, value }],          // table rows in the sidebar
    quote: '"…"',                       // pull quote (null if none)
    quoteSource: '…',
    quoteUrl: 'https://…',
  }
}
```

**Tiers and colours:**

| Tier key | Colour | Used for |
|---|---|---|
| `operational` | Amber | Companies doing the work (Pastrimi, KLMC) |
| `municipal` | Blue | Municipality, Municipal Assembly |
| `national` | Purple | Ministries, courts, national agencies |
| `citizens` | Green | Residents |
| `informal` | Slate | Informal waste pickers |
| `external` | Sky | EU, international donors |
| `endpoint` | Stone | Physical sites (Mirash landfill) |
| `blocked` | Red | Actors currently excluded from the system |

### Edges (`src/data/edges.js`)

```js
{
  id: 'pastrimi-klmc-debt',
  source: 'pastrimi',
  target: 'klmc',
  data: {
    relationshipType: 'money',   // drives colour + dash pattern — see EDGE_COLORS
    label: '€1.9M debt',         // optional mid-edge label
    status: 'disputed',          // 'active' | 'disputed' | 'resolved'
  }
}
```

**Edge types:**

| `relationshipType` | Stroke style | Colour |
|---|---|---|
| `money` | Solid | Green |
| `authority` | Long dash `6 3` | Purple |
| `political` | Short dash `3 3` | Blue |
| `oversight` | Dash-gap `8 4` | Orange |
| `operational` | Solid | Amber |

### Levers (`src/data/levers.js`)

A lever is a "what-if" scenario card. When activated it:

1. **Dims** all unaffected nodes and edges immediately.
2. **Reveals stress levels** in a wave animation (defined by `revealOrder`).
3. **Animates affected edges** after all node waves settle.
4. **Shows a rolling news ticker** across the top of the canvas.

```js
{
  id: 'klmc-fee-increase',          // unique string
  iconName: 'Banknote',             // any lucide-react icon name (PascalCase)
  title: 'KLMC raises landfill fees 30%',
  description: '…',                 // one-line card subtitle
  context: '…',                     // expanded paragraph shown when active
  headlines: ['…', '…', '…', '…'], // 4 ticker headlines

  // Wave propagation: each inner array is one wave (300 ms apart)
  revealOrder: [
    ['klmc'],
    ['pastrimi'],
    ['workers', 'citizens'],
    ['mirash'],
  ],

  affectedNodeIds: ['klmc', 'pastrimi', 'workers', 'citizens', 'mirash'],
  affectedEdgeIds: ['pastrimi-klmc-debt', 'citizens-pastrimi-payment'],

  nodeEffects: {
    klmc: {
      stressLevel: 'none',    // 'none' | 'low' | 'medium' | 'high'
      narrative: '…',         // shown in ActorSidebar under "Scenario impact"
    },
    // … one entry per affected node
  },

  // Optional — marks this as a historical event replay
  historical: true,
  historicalDate: 'May – June 2025',
}
```

---

## Adding a new actor

1. Add an entry to `initialNodes` in `src/data/nodes.js`.
2. Add any edges from/to it in `src/data/edges.js`.
3. Reference it in a lever's `affectedNodeIds` / `nodeEffects` if relevant.

## Adding a new scenario

1. Add a lever object to `levers` in `src/data/levers.js` (see schema above).
2. Choose an `iconName` from [lucide.dev](https://lucide.dev/icons/) — use PascalCase exactly as shown.
3. Define `revealOrder` as arrays of node IDs: each inner array is one wave, revealed 300 ms after the previous.

## Adding a new edge type

1. Add the colour to `EDGE_COLORS` in `src/data/edges.js`.
2. Add the dash pattern in the `strokeStyle` map inside `LabeledEdge` in `GraphCanvas.jsx`.
3. Add a row to `EDGE_LEGEND` in `LeftSidebar.jsx`.

---

## Key interactions

| Action | Result |
|---|---|
| Click a node | Opens the actor detail panel (right sidebar) |
| Click the same node again | Closes the panel |
| Click a scenario card | Activates the scenario; waves propagate |
| Click an active card again | Clears the scenario |
| Click **Clear scenario** link | Also clears the scenario |
| Hamburger button (top-left) | Toggles the left sidebar |
| Scroll the canvas | Pan / zoom via React Flow |

---

## Data sources

All actor data drawn from the research dossier at `../dossier/how-trash-works-pristina.md`.

Primary sources: KOHA, Telegrafi, Prishtina Insight, BIRN, Ombudsperson Institution of Kosovo, RFE/RL, JICA, EU Office in Kosovo, GIZ.

> ⚠️ **Note:** The dossier was AI-assisted. Verify individual claims against the inline source URLs attached to each node's `quoteUrl` and `stats` fields before publishing or citing.
