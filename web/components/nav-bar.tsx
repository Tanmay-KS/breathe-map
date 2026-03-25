'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useCity } from '@/context/CityContext'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
const FONT_IMPORT  = 'Google+Sans:wght@400;500;600;700'
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY    = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/',           label: 'Home'       },
  { href: '/dashboard',  label: 'Dashboard'  },
  { href: '/zones',      label: 'Zones'      },
  { href: '/analysis',   label: 'Analysis'   },
  { href: '/simulation', label: 'Simulation' },
]

function PinIcon({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #059669, #34d399)',
          // Softer glow — matches hero accent intensity
          boxShadow: '0 0 8px rgba(52,211,153,0.22)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
      <span
        className="text-[17px] lg:text-[18px] font-semibold tracking-tight"
        style={{
          fontFamily: FONT_DISPLAY,
          background: 'linear-gradient(135deg, #e4e4e7 0%, #a1a1aa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Breathe Map
      </span>
    </Link>
  )
}

export function NavBar() {
  const pathname = usePathname()
  const [scrolled, setScrolled]               = useState(false)
  const [drawerOpen, setDrawerOpen]           = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const { currentCity, cities, setCurrentCity } = useCity()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap');
        :root { --font-display: ${FONT_DISPLAY}; --font-body: ${FONT_BODY}; }
        .nav-font { font-family: var(--font-body); }

        /* Nav links — slightly wider spacing for breathing room */
        .nav-link-active { color: #34d399; background: rgba(52,211,153,0.08); }
        .nav-link-idle   { color: #71717a; }
        .nav-link-idle:hover { color: #d4d4d8; background: rgba(255,255,255,0.04); }

        /* Drawer links */
        .drawer-link-active { color: #34d399; background: rgba(52,211,153,0.08); }
        .drawer-link-idle   { color: #d4d4d8; }
        .drawer-link-idle:hover { color: #f4f4f5; background: rgba(255,255,255,0.04); }

        /* City buttons in drawer */
        .city-btn-active { color: #34d399; background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.2); }
        .city-btn-idle   { color: #71717a; background: transparent; border-color: rgba(63,63,70,0.4); }
        .city-btn-idle:hover { color: #d4d4d8; border-color: rgba(63,63,70,0.7); }

        @keyframes drawerIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .drawer-enter { animation: drawerIn 0.22s cubic-bezier(0.32,0.72,0,1) both; }

        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        .backdrop-enter { animation: backdropIn 0.2s ease both; }
      `}</style>

      {/* ── Top navbar ─────────────────────────────────────────────────────── */}
      <nav
        className="nav-font sticky top-0 z-40 border-b"
        style={{
          // Starts very transparent over the hero gradient, firms up on scroll
          backgroundColor: scrolled ? 'rgba(9,9,11,0.88)' : 'rgba(9,9,11,0.5)',
          borderBottomColor: scrolled ? 'rgba(39,39,42,0.6)' : 'rgba(39,39,42,0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            <BrandMark />

            {/* ── Desktop nav + city (lg+) ── */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      // Slightly wider px for breathing room
                      'px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150',
                      active ? 'nav-link-active' : 'nav-link-idle',
                    )}
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* City selector — muted, not a CTA pill */}
              <div className="relative z-50 ml-4 pl-4 border-l border-zinc-800/60">
                <button
                  onClick={() => setCityDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150"
                  style={{
                    fontFamily: FONT_DISPLAY,
                    // Muted — looks like a nav item, not a button
                    color: '#6ee7b7',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(52,211,153,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <PinIcon size={11} color="#6ee7b7" />
                  <span>{currentCity.name}</span>
                  <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      opacity: 0.5,
                      transform: cityDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {cityDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCityDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-800/50 bg-zinc-950/96 backdrop-blur-md shadow-xl z-50 py-1.5 overflow-hidden">
                      {cities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => { setCurrentCity(city.id); setCityDropdownOpen(false) }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-[13px] transition-colors hover:bg-zinc-800/40',
                            city.id === currentCity.id
                              ? 'text-emerald-400 font-medium'
                              : 'text-zinc-500 hover:text-zinc-200',
                          )}
                          style={{ fontFamily: FONT_DISPLAY }}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Mobile: city chip + hamburger ── */}
            <div className="flex lg:hidden items-center gap-2.5">
              {/* Read-only city indicator — minimal, not a CTA */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: '#6ee7b7',
                  background: 'rgba(52,211,153,0.06)',
                  border: '1px solid rgba(52,211,153,0.12)',
                }}
              >
                <PinIcon size={10} color="#6ee7b7" />
                {currentCity.name}
              </div>

              {/* Hamburger — borderless, lighter weight */}
              <button
                onClick={() => setDrawerOpen((v) => !v)}
                className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-lg transition-colors"
                style={{ background: drawerOpen ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                aria-label="Open menu"
              >
                <span
                  className="w-[16px] h-0.5 rounded-full bg-zinc-400 transition-all duration-200 origin-center"
                  style={{ transform: drawerOpen ? 'rotate(45deg) translateY(5px)' : 'none' }}
                />
                <span
                  className="w-[16px] h-0.5 rounded-full bg-zinc-400 transition-all duration-200"
                  style={{ opacity: drawerOpen ? 0 : 1 }}
                />
                <span
                  className="w-[16px] h-0.5 rounded-full bg-zinc-400 transition-all duration-200 origin-center"
                  style={{ transform: drawerOpen ? 'rotate(-45deg) translateY(-5px)' : 'none' }}
                />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="backdrop-enter lg:hidden fixed inset-0 z-40 bg-black/50"
            style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="drawer-enter lg:hidden fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col border-l"
            style={{
              backgroundColor: 'rgba(9,9,11,0.98)',
              borderLeftColor: 'rgba(39,39,42,0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0"
              style={{ borderBottomColor: 'rgba(39,39,42,0.5)' }}
            >
              <BrandMark />
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors flex-shrink-0"
                aria-label="Close menu"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Nav links */}
              <div className="space-y-0.5 mb-6">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-2" style={{ fontFamily: FONT_DISPLAY }}>
                  Navigation
                </p>
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        'flex items-center w-full px-3 rounded-xl text-[15px] font-medium transition-all duration-150',
                        active ? 'drawer-link-active' : 'drawer-link-idle',
                      )}
                      style={{ fontFamily: FONT_DISPLAY, minHeight: '44px' }}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              <div className="h-px bg-zinc-800/50 mb-6" />

              {/* City selection */}
              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-3" style={{ fontFamily: FONT_DISPLAY }}>
                  Select City
                </p>
                <div className="flex flex-wrap gap-2 px-1">
                  {cities.map((city) => {
                    const active = city.id === currentCity.id
                    return (
                      <button
                        key={city.id}
                        onClick={() => { setCurrentCity(city.id); setDrawerOpen(false) }}
                        className={cn(
                          'city-btn-idle px-4 rounded-xl text-[13.5px] font-medium transition-all duration-150 border',
                          active && 'city-btn-active',
                        )}
                        style={{ fontFamily: FONT_DISPLAY, minHeight: '40px' }}
                      >
                        {city.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-5 py-4 border-t flex-shrink-0"
              style={{ borderTopColor: 'rgba(39,39,42,0.5)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <p className="text-[11px] text-zinc-700 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                Educational simulation only. Not for regulatory use.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}