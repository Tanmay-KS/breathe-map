'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav-bar'
import { ZoneForm } from '@/components/zone-form'
import { Zone } from '@/lib/types'
import { useCity } from '@/context/CityContext'
import { toastError } from '@/lib/toast'
import { ErrorCodes } from '@/lib/errorCodes'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
// Edit these values to change fonts across the entire page in one place.
// FONT_IMPORT  → Google Fonts URL family string (the part after ?family=)
// FONT_DISPLAY → font-family for headings, labels, and button text
// FONT_BODY    → font-family for body text, descriptions, and data values
const FONT_IMPORT  = 'Google+Sans:wght@300;400;500;600;700'
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY    = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

export default function NewZonePage() {
  const router = useRouter()
  const { currentCityId } = useCity()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: Omit<Zone, 'id' | 'created_at'>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cityId: currentCityId }),
      })
      if (!response.ok) throw new Error('Failed to create zone')
      router.push('/zones')
    } catch (error) {
      console.error('Error creating zone:', error)
      toastError(ErrorCodes.ZONE_CREATE_FAILED.message, ErrorCodes.ZONE_CREATE_FAILED.code)
    } finally {
      setIsLoading(false)
    }
  }

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

      <main className="body-font flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-14">

        {/* ── Breadcrumb ── */}
        <div
          style={{ animation: 'fadeSlideUp 0.4s ease both' }}
          className="flex items-center gap-1.5 text-xs text-zinc-600 mb-6 sm:mb-8"
        >
          <Link
            href="/zones"
            className="hover:text-zinc-400 transition-colors duration-150"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Zones
          </Link>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-zinc-500" style={{ fontFamily: FONT_DISPLAY }}>New Zone</span>
        </div>

        {/* ── Header ── */}
        <div
          style={{ animation: 'fadeSlideUp 0.45s ease 40ms both' }}
          className="mb-6 sm:mb-7"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="text-[10px] sm:text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Configuration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span
              className="text-[10px] sm:text-[11px] text-zinc-600 uppercase tracking-[0.15em]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              New Zone
            </span>
          </div>
          <h1
            className="hero-title text-3xl sm:text-4xl md:text-5xl text-zinc-100 tracking-tight font-bold mb-2"
          >
            Create Zone
          </h1>
          <p className="text-zinc-500 text-sm sm:text-[15px] leading-relaxed max-w-md">
            Define a new monitoring zone with its characteristics and location parameters.
          </p>
        </div>

        {/* ── Form card ── */}
        <div
          style={{ animation: 'fadeSlideUp 0.5s ease 100ms both' }}
          className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 sm:p-7"
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-800/60">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #059669, #34d399)',
                boxShadow: '0 0 12px rgba(52,211,153,0.2)',
              }}
            >
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p
                className="text-sm font-semibold text-zinc-200"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Zone Parameters
              </p>
              <p className="text-xs text-zinc-500">All fields except notes are required.</p>
            </div>
          </div>

          <ZoneForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isLoading={isLoading}
          />
        </div>

        {/* ── Info note ── */}
        <div
          style={{ animation: 'fadeSlideUp 0.5s ease 160ms both' }}
          className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl border border-amber-800/25 bg-amber-950/15"
        >
          <svg
            width="13" height="13" fill="none" stroke="#fbbf24" strokeWidth="2"
            viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Zone parameters are used to estimate AQI via the deterministic model, not real sensor readings.
            The zone will be persisted via the API.
          </p>
        </div>

      </main>
    </div>
  )
}