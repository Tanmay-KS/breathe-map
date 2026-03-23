'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { FooterDisclaimer } from '@/components/footer-disclaimer'
import { ZoneCluster, AQICorrelation } from '@/lib/types'
import { useCity } from '@/context/CityContext'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
// Edit these values to change fonts across the entire page in one place.
// FONT_IMPORT  → Google Fonts URL family string (the part after ?family=)
// FONT_DISPLAY → font-family for headings, labels, and button text
// FONT_BODY    → font-family for body text, descriptions, and data values
const FONT_IMPORT  = 'Google+Sans:wght@300;400;500;600;700'
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY    = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

// ── Correlation row ──────────────────────────────────────────────────────────
function CorrelationRow({ correlation, index }: { correlation: AQICorrelation; index: number }) {
  const [barWidth, setBarWidth] = useState(0)
  const [hovered, setHovered] = useState(false)

  const isPositive = correlation.correlation_coefficient > 0
  const absValue   = Math.abs(correlation.correlation_coefficient)
  const color      = isPositive ? '#f97316' : '#34d399'
  const strength   = absValue >= 0.7 ? 'Strong' : absValue >= 0.4 ? 'Moderate' : 'Weak'

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(absValue * 100), 200 + index * 80)
    return () => clearTimeout(t)
  }, [absValue, index])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        borderColor: hovered ? `${color}35` : 'rgba(255,255,255,0.06)',
        backgroundColor: hovered ? `${color}07` : 'rgba(255,255,255,0.02)',
        animationDelay: `${index * 60}ms`,
      }}
      className="rounded-xl border p-4 sm:p-5 cursor-default"
    >
      {/* Factor name + coefficient */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-zinc-100 text-sm sm:text-[15px] mb-1"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {correlation.factor}
          </p>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {correlation.description}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className="text-xl sm:text-2xl font-bold tabular-nums"
            style={{ color, fontFamily: FONT_DISPLAY }}
          >
            {isPositive ? '+' : ''}{correlation.correlation_coefficient.toFixed(2)}
          </p>
          <p
            className="text-[10px] uppercase tracking-widest mt-0.5 font-semibold"
            style={{ color: `${color}90` }}
          >
            {isPositive ? 'positive' : 'negative'}
          </p>
        </div>
      </div>

      {/* Strength badge + bar in one row */}
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: `${color}15`, color, fontFamily: FONT_DISPLAY }}
        >
          {strength}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-zinc-800/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${barWidth}%`,
              backgroundColor: color,
              marginLeft: isPositive ? 0 : 'auto',
            }}
          />
        </div>
        <span className="text-[11px] text-zinc-500 tabular-nums w-8 text-right flex-shrink-0">
          {Math.round(absValue * 100)}%
        </span>
      </div>
    </div>
  )
}

// ── Cluster card ─────────────────────────────────────────────────────────────
function ClusterCard({ cluster, zoneLookup, index }: {
  cluster: ZoneCluster; zoneLookup: Record<string, string>; index: number
}) {
  const [hovered, setHovered] = useState(false)

  const aqiColor =
    cluster.average_aqi <= 50  ? '#34d399' :
    cluster.average_aqi <= 100 ? '#fbbf24' :
    cluster.average_aqi <= 150 ? '#f97316' : '#f87171'

  const clusterColors = ['#818cf8', '#34d399', '#fbbf24', '#f97316']
  const accent = clusterColors[index % clusterColors.length]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.2s ease',
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px ${accent}20`
          : '0 2px 8px rgba(0,0,0,0.15)',
        borderColor: hovered ? `${accent}35` : 'rgba(255,255,255,0.07)',
        animationDelay: `${index * 100}ms`,
      }}
      className="rounded-2xl border bg-zinc-900/60 p-5 sm:p-6 cursor-default overflow-hidden relative"
    >
      {/* Accent left bar */}
      <div className="absolute top-0 left-0 w-0.5 h-full rounded-l-2xl" style={{ backgroundColor: accent }} />
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl transition-opacity duration-300"
        style={{ backgroundColor: accent, opacity: hovered ? 0.08 : 0.03 }}
      />

      {/* Header: cluster id + avg AQI */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
            >
              {cluster.cluster_id}
            </div>
            <h3
              className="text-sm sm:text-[15px] font-semibold text-zinc-100"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Cluster {cluster.cluster_id}
            </h3>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {cluster.characteristics}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-zinc-500 mb-0.5">Avg AQI</p>
          <p
            className="text-2xl sm:text-3xl font-bold tabular-nums"
            style={{ color: aqiColor, fontFamily: FONT_DISPLAY }}
          >
            {cluster.average_aqi}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
          Land Use:{' '}
          <span className="text-zinc-200 font-semibold capitalize ml-0.5">
            {cluster.dominant_land_use.replace('_', ' ')}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
          <span className="text-zinc-200 font-semibold">{cluster.zones.length}</span>
          <span className="ml-0.5">zones</span>
        </span>
      </div>

      {/* AQI progress bar */}
      <div className="h-1.5 rounded-full bg-zinc-800/60 overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min((cluster.average_aqi / 200) * 100, 100)}%`,
            backgroundColor: aqiColor,
          }}
        />
      </div>

      {/* Zone tags */}
      <div className="flex flex-wrap gap-1.5">
        {cluster.zones.map((zoneId) => (
          <span
            key={zoneId}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
            style={{
              backgroundColor: `${accent}12`,
              color: accent,
              border: `1px solid ${accent}20`,
              fontFamily: FONT_DISPLAY,
            }}
          >
            {zoneLookup[zoneId] || `Zone ${zoneId.slice(0, 8)}`}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Methodology card ─────────────────────────────────────────────────────────
function MethodologyCard({ icon, color, title, desc }: {
  icon: React.ReactNode; color: string; title: string; desc: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, border-color 0.2s ease, box-shadow 0.25s ease',
        borderColor: hovered ? `${color}28` : 'rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
      }}
      className="rounded-2xl border bg-zinc-900/50 p-5 cursor-default"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3.5"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}20` }}
      >
        {icon}
      </div>
      <h4
        className="font-semibold text-zinc-100 text-sm mb-2"
        style={{ fontFamily: FONT_DISPLAY }}
      >
        {title}
      </h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

// ── Section heading with divider ─────────────────────────────────────────────
function SectionHeading({ title, delay, mounted }: { title: string; delay: number; mounted: boolean }) {
  return (
    <div
      style={{ animation: mounted ? `fadeSlideUp 0.5s ease ${delay}ms both` : 'none' }}
      className="flex items-center gap-3 mb-5 sm:mb-6"
    >
      <h2
        className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight flex-shrink-0"
        style={{ fontFamily: FONT_DISPLAY }}
      >
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-700/50 to-transparent" />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const { currentCityId } = useCity()
  const [correlations, setCorrelations] = useState<AQICorrelation[]>([])
  const [clusters, setClusters]         = useState<ZoneCluster[]>([])
  const [zoneLookup, setZoneLookup]     = useState<Record<string, string>>({})
  const [isLoading, setIsLoading]       = useState(true)
  const [mounted, setMounted]           = useState(false)

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const [correlationRes, clusterRes] = await Promise.all([
          fetch(`/api/analysis/correlations?cityId=${currentCityId}`, { cache: 'no-store' }),
          fetch(`/api/analysis/clusters?cityId=${currentCityId}`,      { cache: 'no-store' }),
        ])
        const correlationData = await correlationRes.json()
        const clusterData     = await clusterRes.json()
        setCorrelations(correlationData.data ?? [])
        setClusters(clusterData.data ?? [])
        setZoneLookup(clusterData.zone_lookup ?? {})
      } catch (error) {
        console.error('Failed to load analysis:', error)
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }
    void loadAnalysis()
  }, [currentCityId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <p className="text-zinc-500 text-sm tracking-wide" style={{ fontFamily: FONT_BODY }}>
            Loading analysis…
          </p>
        </div>
      </div>
    )
  }

  const positiveCount = correlations.filter((c) => c.correlation_coefficient > 0).length
  const strongCount   = correlations.filter((c) => Math.abs(c.correlation_coefficient) >= 0.7).length

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap');

        :root {
          --font-display: ${FONT_DISPLAY};
          --font-body:    ${FONT_BODY};
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-title { font-family: var(--font-display); }
        .body-font  { font-family: var(--font-body); }
      `}</style>

      <NavBar />

      <main className="body-font flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">

        {/* ── Header ── */}
        <div
          style={{ animation: mounted ? 'fadeSlideUp 0.5s ease both' : 'none' }}
          className="mb-7 sm:mb-9"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="text-[10px] sm:text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Exploratory
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span
              className="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-[0.12em]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Non-causal · Persisted zone data
            </span>
          </div>
          <h1
            className="hero-title text-3xl sm:text-4xl md:text-5xl text-zinc-100 tracking-tight font-bold mb-2.5"
          >
            Pattern Analysis
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Explore correlations between environmental factors and AQI patterns from persisted zone data.
          </p>
        </div>

        {/* ── Quick stats ── */}
        <div
          style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 80ms both' : 'none' }}
          className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-8 sm:mb-10"
        >
          {[
            { label: 'Factors Analyzed',     value: correlations.length, color: '#818cf8' },
            { label: 'Positive Correlations', value: positiveCount,       color: '#f97316' },
            { label: 'Strong Signals',        value: strongCount,         color: '#34d399' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-3 sm:px-5 py-3.5 sm:py-4 text-center cursor-default"
            >
              <div
                className="text-xl sm:text-2xl font-bold tabular-nums mb-1"
                style={{ color: s.color, fontFamily: FONT_DISPLAY }}
              >
                {s.value}
              </div>
              <div
                className="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider leading-tight"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── CORRELATION ANALYSIS ── */}
        <section className="mb-10 sm:mb-12">
          <SectionHeading title="Factor Correlations" delay={140} mounted={mounted} />

          {/* Legend */}
          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 160ms both' : 'none' }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-xs text-zinc-400">Positive — higher factor → higher AQI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-xs text-zinc-400">Negative — higher factor → lower AQI</span>
            </div>
          </div>

          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 180ms both' : 'none' }}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5"
          >
            {correlations.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-8">No correlation data available.</p>
            ) : (
              <div className="space-y-2.5">
                {correlations.map((correlation, index) => (
                  <CorrelationRow key={index} correlation={correlation} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Interpretation guide */}
          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 260ms both' : 'none' }}
            className="mt-4 rounded-xl border border-indigo-800/30 bg-indigo-950/20 p-4"
          >
            <h4
              className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              <svg width="13" height="13" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
              </svg>
              Interpretation Guide
            </h4>
            <p className="text-sm text-zinc-400 mb-2 leading-relaxed">
              Values range from{' '}
              <span className="text-zinc-200 font-semibold">−1 to +1</span>.
              Positive means as the factor increases, AQI tends to increase. Negative means the inverse.
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              <span className="text-amber-400 font-semibold">⚠ Note:</span>{' '}
              These are exploratory correlations and do not imply causation.
            </p>
          </div>
        </section>

        {/* ── ZONE CLUSTERS ── */}
        <section className="mb-10 sm:mb-12">
          <SectionHeading title="Zone Clusters" delay={300} mounted={mounted} />

          <p
            style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 320ms both' : 'none' }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-5 max-w-xl"
          >
            Zones grouped by similarity in estimated AQI levels and land use characteristics.
          </p>

          {clusters.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-10 text-center">
              <p className="text-zinc-600 text-sm">No cluster data available.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {clusters.map((cluster, i) => (
                <ClusterCard
                  key={cluster.cluster_id}
                  cluster={cluster}
                  zoneLookup={zoneLookup}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Clustering note */}
          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 420ms both' : 'none' }}
            className="mt-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4"
          >
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-zinc-200 font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                About Clustering:{' '}
              </span>
              Zones are grouped using land-use type and estimated AQI ranges. Real cluster analysis
              would require more sophisticated statistical methods.
            </p>
          </div>
        </section>

        {/* ── METHODOLOGY ── */}
        <section>
          <SectionHeading title="Methodology & Limitations" delay={460} mounted={mounted} />

          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.5s ease 500ms both' : 'none' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          >
            <MethodologyCard
              color="#818cf8"
              title="Correlation Calculation"
              desc="Correlations are computed from persisted zone data using theoretical relationships between factors and air quality."
              icon={
                <svg width="15" height="15" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 3v18h18" strokeLinecap="round" />
                  <path d="M7 16l4-4 4 4 4-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <MethodologyCard
              color="#34d399"
              title="Clustering Method"
              desc="Zones are grouped using land-use type and estimated AQI ranges as similarity metrics."
              icon={
                <svg width="15" height="15" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="9" cy="7" r="4" />
                  <circle cx="17" cy="14" r="3" />
                  <circle cx="6" cy="17" r="2.5" />
                </svg>
              }
            />
            <MethodologyCard
              color="#60a5fa"
              title="Data Source"
              desc="Analyses use persisted zone data fetched from the backend API at runtime, not static mock values."
              icon={
                <svg width="15" height="15" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                  <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
                </svg>
              }
            />
            <MethodologyCard
              color="#fbbf24"
              title="Important Disclaimer"
              desc="Results are exploratory and not suitable for policy or regulatory decisions. Always validate with real-world data."
              icon={
                <svg width="15" height="15" fill="none" stroke="#fbbf24" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                </svg>
              }
            />
          </div>
        </section>

      </main>
      <FooterDisclaimer />
    </div>
  )
}