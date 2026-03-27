'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav-bar'
import { FooterDisclaimer } from '@/components/footer-disclaimer'
import { ZoneForm } from '@/components/zone-form'
import { Zone, AQIEstimate } from '@/lib/types'
import { useCity } from '@/context/CityContext'
import toast from 'react-hot-toast'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
const FONT_IMPORT = 'Google+Sans:wght@300;400;500;600;700'
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

// ── Confirmation Dialog ───────────────────────────────────────────────────────
function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    isSaving,
}: {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
    isSaving: boolean
}) {
    if (!open) return null
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="w-full max-w-sm rounded-2xl border p-6"
                style={{
                    background: '#18181b',
                    borderColor: 'rgba(255,255,255,0.12)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
                    animation: 'confirmIn 0.2s ease both',
                }}
            >
                <style>{`
          @keyframes confirmIn {
            from { opacity: 0; transform: scale(0.94) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
                {/* Icon */}
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                    <svg width="18" height="18" fill="none" stroke="#34d399" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinejoin="round" />
                    </svg>
                </div>

                <h3
                    className="text-center text-base font-bold text-zinc-100 mb-1.5"
                    style={{ fontFamily: FONT_DISPLAY }}
                >
                    Save Changes?
                </h3>
                <p className="text-center text-sm text-zinc-500 mb-6">
                    This will update the zone metadata in the database.
                </p>

                <div className="flex gap-2.5">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex-1 py-2.5 border border-zinc-700/60 text-zinc-400 font-semibold rounded-xl text-sm hover:border-zinc-600 hover:text-zinc-300 transition-all duration-150 disabled:opacity-40"
                        style={{ fontFamily: FONT_DISPLAY }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSaving}
                        className="flex-1 py-2.5 bg-emerald-500 text-zinc-950 font-semibold rounded-xl text-sm hover:bg-emerald-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ boxShadow: '0 0 14px rgba(52,211,153,0.25)', fontFamily: FONT_DISPLAY }}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-900/30 border-t-zinc-900 animate-spin" />
                                Saving…
                            </>
                        ) : (
                            'Save Zone'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function EditZonePage() {
    const params = useParams()
    const router = useRouter()
    const { currentCityId } = useCity()

    const [zone, setZone] = useState<Zone | null>(null)
    const [estimate, setEstimate] = useState<AQIEstimate | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Pending form data waiting for confirmation
    const pendingData = useRef<Omit<Zone, 'id' | 'created_at'> | Zone | null>(null)

    // Undo/redo history
    const [history, setHistory] = useState<Zone[]>([])
    const [historyIdx, setHistoryIdx] = useState(-1)
    const currentVersion = historyIdx >= 0 ? history[historyIdx] : zone

    useEffect(() => {
        const zoneId = params.id as string
        const load = async () => {
            try {
                const res = await fetch(`/api/zones/${zoneId}?cityId=${currentCityId}`, { cache: 'no-store' })
                if (!res.ok) { setIsLoading(false); setMounted(true); return }
                const data = await res.json()
                setZone(data.zone)
                setEstimate(data.estimate)
                setHistory([data.zone])
                setHistoryIdx(0)
            } catch (err) {
                console.error('Failed to load zone:', err)
            } finally {
                setIsLoading(false)
                setMounted(true)
            }
        }
        void load()
    }, [params.id, currentCityId])

    // Keyboard undo/redo
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault()
            setHistoryIdx((idx) => Math.max(0, idx - 1))
        }
        if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault()
            setHistoryIdx((idx) => Math.min(history.length - 1, idx + 1))
        }
    }, [history.length])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const handleFormSubmit = (data: Omit<Zone, 'id' | 'created_at'> | Zone) => {
        pendingData.current = data
        setShowConfirm(true)
    }

    const handleConfirmSave = async () => {
        if (!pendingData.current || !zone) return
        setIsSaving(true)
        try {
            const res = await fetch(`/api/zones/${zone.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingData.current),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to update zone')
            }
            const { zone: updated } = await res.json()
            // Push to history for undo/redo
            const newHistory = history.slice(0, historyIdx + 1).concat(updated)
            setHistory(newHistory)
            setHistoryIdx(newHistory.length - 1)
            setZone(updated)
            setShowConfirm(false)
            toast.success('Zone updated successfully')
            router.push(`/zones/${zone.id}`)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update zone'
            toast.error(message)
            setShowConfirm(false)
        } finally {
            setIsSaving(false)
        }
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                    <p className="text-zinc-500 text-sm tracking-wide" style={{ fontFamily: FONT_BODY }}>
                        Loading zone…
                    </p>
                </div>
            </div>
        )
    }

    // ── Not found ─────────────────────────────────────────────────────────────
    if (!zone) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap'); .body-font { font-family: ${FONT_BODY}; }`}</style>
                <NavBar />
                <main className="body-font flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
                    <p className="text-zinc-300 font-semibold" style={{ fontFamily: FONT_DISPLAY }}>Zone not found</p>
                    <Link href="/zones" className="px-5 py-2.5 bg-emerald-500 text-zinc-950 font-semibold rounded-xl text-sm" style={{ fontFamily: FONT_DISPLAY }}>
                        Back to Zones
                    </Link>
                </main>
            </div>
        )
    }

    const canUndo = historyIdx > 0
    const canRedo = historyIdx < history.length - 1

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap');
        :root { --font-display: ${FONT_DISPLAY}; --font-body: ${FONT_BODY}; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title { font-family: var(--font-display); }
        .body-font  { font-family: var(--font-body); }
      `}</style>

            <NavBar />
            <ConfirmDialog
                open={showConfirm}
                onConfirm={handleConfirmSave}
                onCancel={() => setShowConfirm(false)}
                isSaving={isSaving}
            />

            <main className="body-font flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">

                {/* Breadcrumb */}
                <div
                    style={{ animation: mounted ? 'fadeSlideUp 0.4s ease both' : 'none' }}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 mb-6 sm:mb-8"
                >
                    <Link href="/zones" className="hover:text-zinc-400 transition-colors duration-150" style={{ fontFamily: FONT_DISPLAY }}>
                        Zones
                    </Link>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Link
                        href={`/zones/${zone.id}`}
                        className="hover:text-zinc-400 transition-colors duration-150 truncate max-w-[160px]"
                        style={{ fontFamily: FONT_DISPLAY }}
                    >
                        {zone.name}
                    </Link>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-zinc-500" style={{ fontFamily: FONT_DISPLAY }}>Edit</span>
                </div>

                {/* Header */}
                <div
                    style={{ animation: mounted ? 'fadeSlideUp 0.4s ease 40ms both' : 'none' }}
                    className="mb-7 sm:mb-8 flex items-start justify-between gap-4"
                >
                    <div>
                        <span
                            className="text-[10px] sm:text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em] block mb-2"
                            style={{ fontFamily: FONT_DISPLAY }}
                        >
                            Editing Zone
                        </span>
                        <h1
                            className="hero-title text-2xl sm:text-3xl md:text-4xl text-zinc-100 tracking-tight font-bold"
                        >
                            {zone.name}
                        </h1>
                    </div>

                    {/* Undo / Redo */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                        <button
                            onClick={() => setHistoryIdx((i) => Math.max(0, i - 1))}
                            disabled={!canUndo}
                            title="Undo (Ctrl+Z)"
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M3 7v6h6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setHistoryIdx((i) => Math.min(history.length - 1, i + 1))}
                            disabled={!canRedo}
                            title="Redo (Ctrl+Y)"
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {history.length > 1 && (
                            <span className="text-[10px] text-zinc-600 ml-1" style={{ fontFamily: FONT_BODY }}>
                                v{historyIdx + 1}/{history.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* AQI reminder chip */}
                {estimate && (
                    <div
                        className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl border text-sm"
                        style={{
                            animation: mounted ? 'fadeSlideUp 0.4s ease 60ms both' : 'none',
                            borderColor: 'rgba(251,191,36,0.2)',
                            backgroundColor: 'rgba(251,191,36,0.05)',
                        }}
                    >
                        <svg width="13" height="13" fill="none" stroke="#fbbf24" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                        </svg>
                        <span className="text-zinc-400" style={{ fontFamily: FONT_BODY }}>
                            Editing will recalculate the estimated AQI of{' '}
                            <span className="font-semibold text-zinc-200">{estimate.estimated_aqi}</span> for this zone.
                        </span>
                    </div>
                )}

                {/* Form card */}
                <div
                    style={{ animation: mounted ? 'fadeSlideUp 0.4s ease 80ms both' : 'none' }}
                    className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 sm:p-7"
                >
                    <ZoneForm
                        initialZone={currentVersion ?? undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => router.push(`/zones/${zone.id}`)}
                        isLoading={isSaving}
                    />
                </div>

            </main>
            <FooterDisclaimer />
        </div>
    )
}
