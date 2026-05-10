import React, { useRef, useEffect, useState } from "react"
import * as d3 from "d3"

const events = [
  {
    id: 1,
    date: "2024-12-05",
    type: "regulation",
    title: "Municipal Assembly passes the regulation",
    short: "PDK and VV bloc pass amendment giving Pastrimi exclusive billing authority over Mayor Rama's objections.",
    detail: "The Pristina Municipal Assembly amends Waste Management Regulation 01-030/01-227581/23. The amendment, no. 01-030/01-161704/24, transfers waste billing authority from the Municipality to Pastrimi and effectively cancels the Municipality's tender for five private operators. Passes with PDK and VV votes; LDK opposes. Mayor Rama's administration immediately challenges the regulation as illegitimate."
  },
  {
    id: 2,
    date: "2025-01-01",
    type: "operational",
    title: "Pastrimi begins direct billing",
    short: "Pastrimi sends bills directly to citizens. Municipality continues issuing its own bills in parallel.",
    detail: "Under the new regulation, Pastrimi begins billing citizens directly. The Municipality refuses to recognize the regulation and continues issuing its own waste bills. Citizens receive duplicate bills. Confusion about where to pay becomes widespread. Some pay Pastrimi, some pay the Municipality, some refuse to pay either pending clarity."
  },
  {
    id: 3,
    date: "2025-02-05",
    type: "political",
    title: "Municipality tells citizens not to pay Pastrimi",
    short: "Mayor Rama's office announces on Facebook that residents are not obligated to pay Pastrimi invoices.",
    detail: "The Municipality of Pristina formally announces via Facebook that citizens are not obligated to pay Pastrimi invoices issued from January 1, 2025, and directs them to pay the Municipality instead. Pastrimi calls the announcement 'illegal and arbitrary' and accuses the Municipality of trying to bankrupt Pastrimi to justify the 16-million-euro private operator tender."
  },
  {
    id: 4,
    date: "2025-02-15",
    type: "operational",
    title: "Pastrimi halts collection",
    short: "Trash accumulates on Pristina streets. Pastrimi cites Municipality non-payment as cause.",
    detail: "Pastrimi halts collection for several days in protest at the Municipality's failure to pay debts (the company alleged 2.7 million euros owed at this point). Trash accumulates visibly on Pristina streets. The Municipality declares a state of emergency in waste collection, with Mayor Rama citing 'significant risk of a public health crisis' to justify the emergency. The emergency declaration provides legal cover for short-term private operator contracts."
  },
  {
    id: 5,
    date: "2025-04-15",
    type: "political",
    title: "21,000 citizens have paid the Municipality",
    short: "By April, the Municipality has collected funds from over 21,000 residents. Pastrimi demands the money back.",
    detail: "By the start of April, over 21,000 citizens have made waste payments to the Municipality rather than Pastrimi. Pastrimi demands the Municipality return these funds. The Municipality refuses. Pastrimi alleges the unpaid debt has reached 2 million euros (early April), then 2.2 million (end of April), then approximately 2.5 million (later)."
  },
  {
    id: 6,
    date: "2025-04-26",
    type: "political",
    title: "Reçica gives extended interview",
    short: "Pastrimi CEO frames dispute as Municipality's attempt to replace public enterprise with private operators.",
    detail: "Pastrimi CEO Petrit Reçica gives an extended interview to Telegrafi. He defends the regulation as legally valid, frames the dispute as the Municipality's attempt to replace a public enterprise with private operators, and emphasizes that Pastrimi is a self-financing enterprise that is not part of the municipal budget."
  },
  {
    id: 7,
    date: "2025-05-10",
    type: "operational",
    title: "Pastrimi workers begin strike",
    short: "About 800 workers strike, protesting Municipality non-payment and private operator contracts.",
    detail: "Pastrimi workers begin sustained strike action, protesting both the Municipality's withholding of payments and the contracting of private operators by the Municipality. The Municipality hires two private companies to remove garbage during the strike, but they fail to do the job properly. Citizens' complaints about the stench from non-collection continue during high-temperature days. Strike action will continue for about a month."
  },
  {
    id: 8,
    date: "2025-05-19",
    type: "court",
    title: "Ombudsperson convenes meeting",
    short: "Ombudsperson Hilmi Jashari convenes mediation. Mayor Rama does not attend.",
    detail: "Ombudsperson Hilmi Jashari convenes a meeting between Pastrimi (CEO Reçica attends) and the Municipality (Mayor Rama does not attend). The Ombudsperson publicly criticizes the Municipality's absence as 'disrespect for this institution' showing 'complete irresponsibility of the representatives of the municipality in relation to the interests and concerns of the citizens of Pristina as well as of more than 800 employees' of Pastrimi."
  },
  {
    id: 9,
    date: "2025-06-10",
    type: "court",
    title: "Supreme Court upholds regulation",
    short: "The Supreme Court of Kosovo rules in favor of the December 2024 regulation. Municipality must comply.",
    detail: "The Supreme Court of Kosovo issues its ruling, upholding the Municipal Assembly's December 2024 regulation. The ruling rejects the Municipality of Pristina's claim to repeal the regulation and confirms that Pastrimi has billing authority. This is the legal floor of the dispute: the regulation stands, Pastrimi bills, the Municipality cannot legally redirect citizen payments."
  },
  {
    id: 10,
    date: "2025-06-24",
    type: "operational",
    title: "Workers protest private operators",
    short: "Even after the court ruling, workers protest in front of Pastrimi HQ over private operator contracts.",
    detail: "Despite the Supreme Court ruling and ongoing mediation, Pastrimi workers protest in front of the company building. They oppose continued operation of the private operators contracted by the Municipality during the emergency. Worker Adnan Sinani, quoted in KOHA, says workers are 'tired of the tricks they play among themselves' and want to be allowed to do their job."
  },
  {
    id: 11,
    date: "2025-06-25",
    type: "court",
    title: "Mediated resolution",
    short: "Municipality returns collected funds to Pastrimi. Worker strike ends.",
    detail: "Through mediation, the Municipality of Pristina returns the debt of collected funds to Pastrimi following the Supreme Court ruling. The worker strike ends. The regulation stands. Pastrimi bills directly. The Municipality has not formally accepted the new arrangement and has not canceled the private operator tender on paper. The relationship remains adversarial. Summer 2026 (high temperatures, peak waste generation) is a plausible flashpoint for the next acute crisis."
  }
]

const TYPE_META = {
  regulation: { label: "Regulation / Legal", color: "#1e3a5f" },
  operational: { label: "Operational", color: "#c0392b" },
  political: { label: "Political", color: "#d35400" },
  court: { label: "Court / Oversight", color: "#1a6b3c" },
}

function Timeline({ events, selected, onSelect, activeFilter }) {
  const svgRef = useRef(null)
  const wrapRef = useRef(null)
  const [dims, setDims] = useState({ width: 900, height: 260 })

  useEffect(() => {
    function measure() {
      if (wrapRef.current) {
        const w = wrapRef.current.offsetWidth
        setDims({ width: Math.max(w, 340), height: 260 })
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const { width, height } = dims
    const margin = { top: 30, right: 32, bottom: 48, left: 32 }
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("width", width).attr("height", height)

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f8f6f1")
      .attr("rx", 0)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const parseDate = d3.timeParse("%Y-%m-%d")
    const domainStart = new Date(2024, 11, 1)
    const domainEnd = new Date(2025, 6, 5)

    const x = d3.scaleTime().domain([domainStart, domainEnd]).range([0, innerW])

    // Grid lines (subtle)
    const months = d3.timeMonths(domainStart, domainEnd)
    g.selectAll(".grid-line")
      .data(months)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", 0)
      .attr("y2", innerH - 10)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1)

    // Main axis line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", innerH / 2)
      .attr("y2", innerH / 2)
      .attr("stroke", "#334155")
      .attr("stroke-width", 2)

    // Month ticks
    const monthLabels = [
      new Date(2024, 11, 1),
      new Date(2025, 0, 1),
      new Date(2025, 1, 1),
      new Date(2025, 2, 1),
      new Date(2025, 3, 1),
      new Date(2025, 4, 1),
      new Date(2025, 5, 1),
      new Date(2025, 6, 1),
    ]
    const labelFmt = d3.timeFormat("%b %Y")

    g.selectAll(".month-tick")
      .data(monthLabels)
      .enter()
      .append("line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", innerH / 2 - 8)
      .attr("y2", innerH / 2 + 8)
      .attr("stroke", "#475569")
      .attr("stroke-width", 1.5)

    g.selectAll(".month-label")
      .data(monthLabels)
      .enter()
      .append("text")
      .attr("x", d => x(d))
      .attr("y", innerH / 2 + 24)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .attr("fill", "#64748b")
      .text(d => labelFmt(d))

    // Stagger events above/below the line to avoid overlap
    const parsed = events.map((ev, i) => ({
      ...ev,
      parsedDate: parseDate(ev.date),
      above: i % 2 === 0,
    }))

    // Event dots — render non-selected first, then selected on top
    const visibleEvents = activeFilter
      ? parsed.filter(ev => ev.type === activeFilter)
      : parsed

    const dotR = 9

    // Stem lines
    g.selectAll(".stem")
      .data(visibleEvents)
      .enter()
      .append("line")
      .attr("class", "stem")
      .attr("x1", d => x(d.parsedDate))
      .attr("x2", d => x(d.parsedDate))
      .attr("y1", d => d.above ? innerH / 2 - dotR : innerH / 2 + dotR)
      .attr("y2", d => d.above ? innerH / 2 - 52 : innerH / 2 + 52)
      .attr("stroke", d => TYPE_META[d.type].color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,2")
      .attr("opacity", 0.5)

    // Short title labels above/below dots
    g.selectAll(".event-label")
      .data(visibleEvents)
      .enter()
      .append("text")
      .attr("class", "event-label")
      .attr("x", d => x(d.parsedDate))
      .attr("y", d => d.above ? innerH / 2 - 60 : innerH / 2 + 68)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .attr("fill", "#475569")
      .attr("pointer-events", "none")
      .text(d => {
        const words = d.title.split(" ")
        return words.slice(0, 4).join(" ") + (words.length > 4 ? "…" : "")
      })

    const dotGroups = g.selectAll(".dot-group")
      .data(visibleEvents)
      .enter()
      .append("g")
      .attr("class", "dot-group")
      .attr("transform", d => `translate(${x(d.parsedDate)},${innerH / 2})`)
      .attr("cursor", "pointer")
      .on("click", (event, d) => onSelect(d))

    // Selection ring
    dotGroups
      .filter(d => selected && d.id === selected.id)
      .append("circle")
      .attr("r", dotR + 6)
      .attr("fill", "none")
      .attr("stroke", d => TYPE_META[d.type].color)
      .attr("stroke-width", 2.5)
      .attr("opacity", 0.6)

    dotGroups.append("circle")
      .attr("r", dotR)
      .attr("fill", d => TYPE_META[d.type].color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition().duration(120)
          .attr("r", dotR + 3)
          .attr("filter", "drop-shadow(0 2px 6px rgba(0,0,0,0.22))")
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition().duration(120)
          .attr("r", dotR)
          .attr("filter", null)
      })

  }, [dims, events, selected, activeFilter, onSelect])

  return (
    <div ref={wrapRef} style={{ overflowX: "auto", width: "100%" }}>
      <svg ref={svgRef} style={{ display: "block" }} />
    </div>
  )
}

function TypePill({ type }) {
  const meta = TYPE_META[type]
  return (
    <span
      style={{
        backgroundColor: meta.color,
        color: "#fff",
        fontSize: "11px",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: "999px",
        display: "inline-block",
      }}
    >
      {meta.label}
    </span>
  )
}

function formatDate(str) {
  const d = new Date(str + "T00:00:00")
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 100, backgroundColor: "#1a1a1a" }}>
      <div style={{ height: "100%", width: `${pct}%`, backgroundColor: "#c0392b", transition: "width 0.1s linear" }} />
    </div>
  )
}

export default function App() {
  const [selected, setSelected] = useState(events[0])
  const [activeFilter, setActiveFilter] = useState(null)

  const c = {
    page: "min-h-screen bg-[#f8f6f1] font-sans",
    headerWrap: "bg-[#111111] text-[#f8f6f1] px-5 py-8 md:px-12 md:py-10",
    kicker: "text-[#a3a09a] text-xs uppercase tracking-widest mb-2 font-semibold",
    headline: "text-[#f8f6f1] text-2xl md:text-5xl font-bold leading-tight mb-3",
    subtitle: "text-[#c9c5bc] text-base md:text-lg leading-relaxed max-w-2xl",
    timelineSection: "px-3 py-6 md:px-8 md:py-8 max-w-5xl mx-auto bg-[#f8f6f1]",
    legendRow: "flex flex-wrap gap-x-5 gap-y-2 mb-5 mt-1",
    legendItem: "flex items-center gap-2 text-xs text-[#475569] cursor-pointer select-none",
    legendDot: "w-3 h-3 rounded-full flex-shrink-0",
    detailSection: "border-t-2 border-[#1a1a1a] bg-[#fff] px-5 py-7 md:px-10 md:py-9 max-w-5xl mx-auto",
    detailDate: "text-[#94918a] text-sm font-medium mb-1 font-mono tracking-wide",
    detailLargeDate: "text-[#1a1a1a] text-3xl md:text-4xl font-bold mb-3 leading-none",
    detailTitle: "text-[#1a1a1a] text-xl md:text-2xl font-bold mb-2 leading-tight",
    detailBody: "text-[#3d3a35] text-base md:text-lg leading-relaxed mt-4",
    emptyState: "text-[#a3a09a] text-sm italic",
    footer: "border-t border-[#e2ddd6] bg-[#f0ede7] px-5 py-5 md:px-10 text-[#7a776f] text-xs leading-relaxed max-w-5xl mx-auto",
  }

  return (
    <div className={c.page}>
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <ScrollProgress />
      <header id="app-header" className={c.headerWrap}>
        <p className={c.kicker}>
          Pristina Waste Crisis
          <span style={{ display: "block", width: "28px", height: "2px", backgroundColor: "#c0392b", marginTop: "6px" }} />
        </p>
        <h1 className={c.headline}>
          The Pristina Waste Crisis<br className="hidden md:block" />
          <span className="font-light"> December 2024 – June 2025</span>
        </h1>
        <p className={c.subtitle}>
          How a regulation fight left a capital city's trash uncollected for months.
        </p>
        <p style={{ marginTop: "16px", fontSize: "12px", color: "#7a776f", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "0.05em" }}>
          <span style={{ backgroundColor: "#c0392b", color: "#fff", padding: "2px 8px", borderRadius: "3px", marginRight: "8px", fontWeight: 700 }}>{events.length} events</span>
          December 2024 – June 2025
        </p>
      </header>

      <div style={{ backgroundColor: "#111111", borderTop: "1px solid #2a2a2a", padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a776f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <span style={{ fontSize: "11px", color: "#7a776f", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "0.05em" }}>
          Click any dot on the timeline to read the full account
        </span>
      </div>
      <main id="app">
        <section id="timeline" className={c.timelineSection} style={{ borderBottom: "1px solid #e8e4de" }}>
          {/* Legend / Filter */}
          <div className={c.legendRow}>
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <button
                key={key}
                className={c.legendItem}
                onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                style={{ opacity: activeFilter && activeFilter !== key ? 0.4 : 1 }}
                title={activeFilter === key ? "Clear filter" : `Filter: ${meta.label}`}
              >
                <span
                  className={c.legendDot}
                  style={{
                    backgroundColor: meta.color,
                    boxShadow: activeFilter === key ? `0 0 0 2px ${meta.color}55` : "none",
                    outline: activeFilter === key ? `2px solid ${meta.color}` : "none",
                    outlineOffset: "2px",
                  }}
                />
                <span style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  {meta.label}
                </span>
                {activeFilter === key && (
                  <span style={{ color: meta.color, fontWeight: 700, marginLeft: 2 }}>×</span>
                )}
              </button>
            ))}
            {activeFilter && (
              <button
                className="text-xs text-[#475569] underline ml-2"
                style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}
                onClick={() => setActiveFilter(null)}
              >
                Show all
              </button>
            )}
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#a3a09a", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", alignSelf: "center" }}>
              {activeFilter ? events.filter(e => e.type === activeFilter).length : events.length} event{(activeFilter ? events.filter(e => e.type === activeFilter).length : events.length) !== 1 ? "s" : ""}
            </span>
          </div>

          <Timeline
            events={events}
            selected={selected}
            onSelect={ev => setSelected(ev.id === selected?.id ? null : ev)}
            activeFilter={activeFilter}
          />
        </section>

        <section
          id="detail"
          className={c.detailSection}
          key={selected?.id ?? "empty"}
          style={{
            borderLeft: selected ? `4px solid ${TYPE_META[selected.type]?.color ?? "#ccc"}` : "none",
            animation: "fadeSlide 0.25s ease",
          }}
        >
          {selected ? (
            <>
              <p className={c.detailDate} style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "11px", color: "#7a776f", marginBottom: "8px" }}>
                {formatDate(selected.date)}
              </p>
              <h2 className={c.detailTitle}>{selected.title}</h2>
              <div style={{ marginBottom: "12px" }}>
                <TypePill type={selected.type} />
              </div>
              <p style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "15px", fontWeight: 600, color: "#3d3a35", lineHeight: 1.5, borderLeft: "3px solid #e2ddd6", paddingLeft: "12px", marginBottom: "12px" }}>
                {selected.short}
              </p>
              <p className={c.detailBody}>{selected.detail}</p>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2ddd6" }}>
                {(() => {
                  const idx = events.findIndex(e => e.id === selected.id)
                  const prev = events[idx - 1]
                  const next = events[idx + 1]
                  return (
                    <>
                      <button
                        disabled={!prev}
                        onClick={() => prev && setSelected(prev)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: prev ? "#1a1a1a" : "#c9c5bc", background: "none", border: "none", cursor: prev ? "pointer" : "default", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", fontWeight: 500, padding: 0, textDecoration: prev ? "underline" : "none", textDecorationColor: "#c9c5bc" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Previous
                      </button>
                      <span style={{ color: "#e2ddd6", margin: "0 4px" }}>|</span>
                      <button
                        disabled={!next}
                        onClick={() => next && setSelected(next)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: next ? "#1a1a1a" : "#c9c5bc", background: "none", border: "none", cursor: next ? "pointer" : "default", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", fontWeight: 500, padding: 0, textDecoration: next ? "underline" : "none", textDecorationColor: "#c9c5bc" }}
                      >
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                      <span style={{ marginLeft: "auto", color: "#94918a", fontSize: "12px", alignSelf: "center" }}>
                        {events.findIndex(e => e.id === selected.id) + 1} of {events.length}
                      </span>
                    </>
                  )
                })()}
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b8b5ad" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className={c.emptyState}>
                  Select any dot on the timeline to read the full account of that moment.
                </p>
              </div>
              <p className="text-[#b8b5ad] text-xs mt-2">
                {events.length} events · Dec 2024 – Jun 2025
              </p>
            </div>
          )}
        </section>

        <footer style={{ borderTop: "1px solid #e2ddd6", backgroundColor: "#f0ede7", padding: "20px", color: "#7a776f", fontSize: "12px", lineHeight: 1.6, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          <strong style={{ color: "#3d3a35" }}>Sources —</strong> Public reporting by KOHA, Prishtina Insight, BIRN, RFE/RL, Telegrafi, and the Kosovo Ombudsperson Institution.
          <span style={{ display: "block", marginTop: "4px", color: "#a3a09a" }}>Built with Vibes.</span>
        </footer>
      </main>
    </div>
  )
}
