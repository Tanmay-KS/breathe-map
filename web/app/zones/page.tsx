'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/nav-bar'
import { FooterDisclaimer } from '@/components/footer-disclaimer'
import { AQIBadge } from '@/components/aqi-badge'
import { Loader } from '@/components/loader'
import { Zone, AQIEstimate } from '@/lib/types'
import { useCity } from '@/context/CityContext'
import { Home, Building2, Factory, Trees, Layers, MapPin } from 'lucide-react'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
// Edit these values to change fonts across the entire page in one place.
// FONT_IMPORT  → Google Fonts URL family string (the part after ?family=)
// FONT_DISPLAY → font-family for headings, labels, and button text
// FONT_BODY    → font-family for body text, descriptions, and data values
const FONT_IMPORT = 'Google+Sans:wght@300;400;500;600;700'
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

const LAND_USE_ICONS: Record<string, React.ReactNode> = {
  residential: <Home size={13} className="text-zinc-500" />,
  commercial: <Building2 size={13} className="text-zinc-500" />,
  industrial: <Factory size={13} className="text-zinc-500" />,
  green_space: <Trees size={13} className="text-zinc-500" />,
  mixed: <Layers size={13} className="text-zinc-500" />,
}

function aqiBarColor(aqi: number) {
  if (aqi <= 50) return '#34d399'
  if (aqi <= 100) return '#fbbf24'
  if (aqi <= 150) return '#f97316'
  return '#f87171'
}

// Mini bar used in the table for traffic / population
function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium text-zinc-400 tabular-nums">{value}%</span>
    </div>
  )
}

// ── Mobile card (shown below md) ─────────────────────────────────────────────
function ZoneCard({ zone, estimate, index }: { zone: Zone; estimate?: AQIEstimate; index: number }) {
  const [hovered, setHovered] = useState(false)
  const color = estimate ? aqiBarColor(estimate.estimated_aqi) : '#52525b'

  return (
    <Link
      href={`/zones/${zone.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationName: 'fadeSlideUp',
        animationDuration: '0.4s',
        animationTimingFunction: 'ease',
        animationFillMode: 'both',
        animationDelay: `${index * 40}ms`,
        borderColor: hovered ? 'rgba(52,211,153,0.2)' : 'rgba(63,63,70,0.5)',
        backgroundColor: hovered ? 'rgba(52,211,153,0.03)' : 'rgba(24,24,27,0.6)',
        transition: 'border-color 0.15s ease, background-color 0.15s ease, transform 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      className="block rounded-xl border p-4 cursor-pointer"
    >
      {/* Top row: name + AQI badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: color, boxShadow: hovered ? `0 0 6px ${color}` : 'none' }}
          />
          <p
            className="font-semibold text-sm text-zinc-100 truncate"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {zone.name}
          </p>
        </div>
        {estimate
          ? <AQIBadge aqi={estimate.estimated_aqi} showValue={true} />
          : <span className="text-xs text-zinc-600">—</span>
        }
      </div>

      {/* Bottom row: type + bars */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-1.5 text-xs text-zinc-500 capitalize">
          <span className="opacity-70">
            {LAND_USE_ICONS[zone.land_use_type] ?? <MapPin size={13} className="text-zinc-500" />}
          </span>
          {zone.land_use_type.replace('_', ' ')}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="text-orange-400/70">Traffic</span>
          <MiniBar value={zone.traffic_density} color="#f97316" />
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="text-indigo-400/70">Pop.</span>
          <MiniBar value={zone.population_density} color="#818cf8" />
        </span>
      </div>

      {/* Chevron hint */}
      <div className="flex justify-end mt-2">
        <svg
          width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          style={{ color: hovered ? '#34d399' : '#3f3f46', transition: 'color 0.15s ease' }}
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}

// ── Desktop table row (shown at md and above) ────────────────────────────────
function ZoneRow({ zone, estimate, index }: { zone: Zone; estimate?: AQIEstimate; index: number }) {
  const [hovered, setHovered] = useState(false)
  const color = estimate ? aqiBarColor(estimate.estimated_aqi) : '#52525b'

  return (
    <Link
      href={`/zones/${zone.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? 'rgba(52,211,153,0.03)' : 'transparent',
        borderBottomColor: 'rgba(39,39,42,0.5)',
        transition: 'background-color 0.15s ease',
        animationName: 'fadeSlideUp',
        animationDuration: '0.4s',
        animationTimingFunction: 'ease',
        animationFillMode: 'both',
        animationDelay: `${index * 40}ms`,
      }}
      className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b last:border-b-0 cursor-pointer"
    >
      {/* Name — 4 cols */}
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
          style={{ backgroundColor: color, boxShadow: hovered ? `0 0 5px ${color}` : 'none' }}
        />
        <p
          className="font-semibold text-[13px] truncate transition-colors duration-150"
          style={{ color: hovered ? '#e4e4e7' : '#a1a1aa', fontFamily: FONT_DISPLAY }}
        >
          {zone.name}
        </p>
      </div>

      {/* Land use — 2 cols */}
      <div className="col-span-2 flex items-center">
        <span className="text-xs text-zinc-500 capitalize flex items-center gap-1.5">
          <span className="opacity-60">
            {LAND_USE_ICONS[zone.land_use_type] ?? <MapPin size={13} className="text-zinc-500" />}
          </span>
          {zone.land_use_type.replace('_', ' ')}
        </span>
      </div>

      {/* Traffic — 2 cols */}
      <div className="col-span-2 flex items-center">
        <MiniBar value={zone.traffic_density} color="#f97316" />
      </div>

      {/* Population — 2 cols */}
      <div className="col-span-2 flex items-center">
        <MiniBar value={zone.population_density} color="#818cf8" />
      </div>

      {/* AQI — 1 col */}
      <div className="col-span-1 flex items-center">
        {estimate
          ? <AQIBadge aqi={estimate.estimated_aqi} showValue={true} />
          : <span className="text-xs text-zinc-600">—</span>
        }
      </div>

      {/* Arrow — 1 col */}
      <div className="col-span-1 flex items-center justify-end">
        <svg
          width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          style={{
            color: hovered ? '#34d399' : '#3f3f46',
            transition: 'color 0.15s ease, transform 0.2s ease',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
          }}
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ZonesPage() {
  const { currentCityId } = useCity()
  const [zones, setZones] = useState<Zone[]>([])
  const [estimates, setEstimates] = useState<Map<string, AQIEstimate>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const loadZones = async () => {
      try {
        const response = await fetch(`/api/zones?cityId=${currentCityId}`, { cache: 'no-store' })
        const data = await response.json()
        setZones(data.zones ?? [])
        setEstimates(new Map(Object.entries(data.estimates ?? {}) as [string, AQIEstimate][]))
      } catch (error) {
        console.error('Failed to load zones:', error)
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }
    void loadZones()
  }, [currentCityId])

  if (isLoading) {
    return <Loader variant="page" label="Loading zones…" />
  }

  const FILTERS = ['all', 'residential', 'commercial', 'industrial', 'green_space', 'mixed']
  const filteredZones = filter === 'all' ? zones : zones.filter((z) => z.land_use_type === filter)

  const goodCount = Array.from(estimates.values()).filter((e) => e.category === 'good').length
  const moderateCount = Array.from(estimates.values()).filter((e) => e.category === 'moderate').length
  const poorCount = Array.from(estimates.values()).filter((e) => e.category === 'poor').length
  const severeCount = Array.from(estimates.values()).filter((e) => e.category === 'severe').length

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap');

        :root {
          --font-display: ${FONT_DISPLAY};
          --font-body:    ${FONT_BODY};
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-title  { font-family: var(--font-display); }
        .body-font   { font-family: var(--font-body); }

        .glow-btn {
          box-shadow: 0 0 16px rgba(52,211,153,0.2), 0 4px 12px rgba(0,0,0,0.3);
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .glow-btn:hover {
          box-shadow: 0 0 28px rgba(52,211,153,0.4), 0 6px 20px rgba(0,0,0,0.4);
          transform: translateY(-1px);
        }
        .filter-pill {
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
      `}</style>

      <NavBar />

      <main className="body-font flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">

        {/* ── Header ── */}
        <div
          style={{ animation: mounted ? 'fadeSlideUp 0.4s ease both' : 'none' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-7 sm:mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="text-[10px] sm:text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Monitoring
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span
                className="text-[10px] sm:text-[11px] text-zinc-600 uppercase tracking-[0.15em]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {zones.length} zones
              </span>
            </div>
            <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl text-zinc-100 tracking-tight font-bold mb-2">
              Air Quality Zones
            </h1>
            <p className="text-zinc-500 text-sm sm:text-[15px] leading-relaxed max-w-lg">
              Manage monitoring zones and view estimated AQI values for each area.
            </p>
          </div>
          <Link
            href="/zones/new"
            className="glow-btn inline-flex items-center justify-center px-5 py-3 bg-emerald-500 text-zinc-950 font-semibold rounded-xl text-sm flex-shrink-0 w-full sm:w-auto"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            New Zone
          </Link>
        </div>

        {/* ── AQI summary pills ── */}
        <div
          style={{ animation: mounted ? 'fadeSlideUp 0.4s ease 60ms both' : 'none' }}
          className="flex flex-wrap gap-2 mb-5 sm:mb-6"
        >
          {[
            { label: 'Good', count: goodCount, color: '#34d399' },
            { label: 'Moderate', count: moderateCount, color: '#fbbf24' },
            { label: 'Poor', count: poorCount, color: '#f97316' },
            { label: 'Severe', count: severeCount, color: '#f87171' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold"
              style={{
                backgroundColor: `${s.color}10`,
                borderColor: `${s.color}25`,
                color: s.color,
                fontFamily: FONT_DISPLAY,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.count} {s.label}
            </div>
          ))}
        </div>

        {/* ── Filter pills ── */}
        {zones.length > 0 && (
          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.4s ease 100ms both' : 'none' }}
            className="flex flex-wrap gap-1.5 mb-5 sm:mb-6"
          >
            {FILTERS.map((f) => {
              const active = filter === f
              const count = zones.filter((z) => z.land_use_type === f).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="filter-pill px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
                  style={{
                    fontFamily: FONT_DISPLAY,
                    backgroundColor: active ? 'rgba(52,211,153,0.12)' : 'rgba(39,39,42,0.5)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: active ? 'rgba(52,211,153,0.3)' : 'rgba(63,63,70,0.5)',
                    color: active ? '#34d399' : '#71717a',
                  }}
                >
                  {f === 'all' ? `All (${zones.length})` : f.replace('_', ' ')}
                  {f !== 'all' && (
                    <span className="ml-1.5 opacity-60">{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Empty state ── */}
        {zones.length === 0 ? (
          <div
            style={{ animation: mounted ? 'fadeSlideUp 0.4s ease 120ms both' : 'none' }}
            className="rounded-2xl border border-dashed border-zinc-700/50 bg-zinc-900/30 px-6 py-16 sm:py-20 text-center"
          >
            <div className="w-13 h-13 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mx-auto mb-5 w-14 h-14">
              <svg width="20" height="20" fill="none" stroke="#52525b" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <p
              className="text-zinc-400 font-semibold mb-2 text-sm sm:text-base"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              No zones created yet
            </p>
            <p className="text-zinc-600 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
              Create your first zone to start monitoring air quality estimates.
            </p>
            <Link
              href="/zones/new"
              className="glow-btn inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-zinc-950 font-semibold rounded-xl text-sm"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Create First Zone
            </Link>
          </div>

        ) : filteredZones.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 px-6 py-10 text-center">
            <p className="text-zinc-500 text-sm">No zones match this filter.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-3 text-emerald-500 text-xs font-semibold hover:text-emerald-400 transition-colors"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Clear filter
            </button>
          </div>

        ) : (
          <div style={{ animation: mounted ? 'fadeSlideUp 0.4s ease 140ms both' : 'none' }}>

            {/* ── Mobile: card list (hidden md+) ── */}
            <div className="md:hidden space-y-2.5">
              {filteredZones.map((zone, index) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  estimate={estimates.get(zone.id)}
                  index={index}
                />
              ))}
            </div>

            {/* ── Desktop: table (hidden below md) ── */}
            <div className="hidden md:block rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/70">
                {[
                  { label: 'Zone Name', span: 4 },
                  { label: 'Type', span: 2 },
                  { label: 'Traffic', span: 2 },
                  { label: 'Population', span: 2 },
                  { label: 'AQI', span: 1 },
                  { label: '', span: 1 },
                ].map((col, i) => (
                  <div
                    key={i}
                    className={`col-span-${col.span} text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]`}
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {col.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filteredZones.map((zone, index) => (
                <ZoneRow
                  key={zone.id}
                  zone={zone}
                  estimate={estimates.get(zone.id)}
                  index={index}
                />
              ))}

              {/* Footer */}
              <div className="px-5 py-3 border-t border-zinc-800/40 bg-zinc-900/40 flex items-center justify-between">
                <span className="text-[11px] text-zinc-600" style={{ fontFamily: FONT_BODY }}>
                  Showing{' '}
                  <span className="text-zinc-400 font-semibold">{filteredZones.length}</span>
                  {' '}of{' '}
                  <span className="text-zinc-400 font-semibold">{zones.length}</span>
                  {' '}zones
                </span>
                <Link
                  href="/zones/new"
                  className="text-[11px] text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  + Add zone
                </Link>
              </div>
            </div>

            {/* Mobile footer count */}
            <div className="md:hidden mt-4 flex items-center justify-between px-1">
              <span className="text-[11px] text-zinc-600" style={{ fontFamily: FONT_BODY }}>
                <span className="text-zinc-400 font-semibold">{filteredZones.length}</span>
                {' '}of{' '}
                <span className="text-zinc-400 font-semibold">{zones.length}</span>
                {' '}zones
              </span>
              <Link
                href="/zones/new"
                className="text-[11px] text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                + Add zone
              </Link>
            </div>

          </div>
        )}

      </main>
      <FooterDisclaimer />
    </div>
  )
}