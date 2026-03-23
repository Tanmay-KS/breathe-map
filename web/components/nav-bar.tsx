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

export function NavBar() {
  const pathname = usePathname()
  const [scrolled, setScrolled]               = useState(false)
  const [mobileOpen, setMobileOpen]           = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const { currentCityId, currentCity, cities, setCurrentCity } = useCity()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap');

        :root {
          --font-display: ${FONT_DISPLAY};
          --font-body:    ${FONT_BODY};
        }

        .nav-font   { font-family: var(--font-body); }
        .brand-font { font-family: var(--font-display); }

        .nav-link-active {
          color: #34d399;
          background: rgba(52,211,153,0.09);
        }
        .nav-link-idle {
          color: #a1a1aa;
        }
        .nav-link-idle:hover {
          color: #e4e4e7;
          background: rgba(255,255,255,0.05);
        }

        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu-enter { animation: mobileSlide 0.18s ease both; }
      `}</style>

      <nav
        className="nav-font sticky top-0 z-50 border-b"
        style={{
          backgroundColor: scrolled ? 'rgba(9,9,11,0.95)' : 'rgba(9,9,11,0.82)',
          borderBottomColor: scrolled ? 'rgba(39,39,42,0.8)' : 'rgba(39,39,42,0.4)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-15">

            {/* ── Brand ── */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #059669, #34d399)',
                  boxShadow: '0 0 10px rgba(52,211,153,0.3)',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span
                className="brand-font text-[17px] sm:text-[18px] font-semibold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #e4e4e7 0%, #a1a1aa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Breathe Map
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-150',
                      active ? 'nav-link-active' : 'nav-link-idle',
                    )}
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400"
                        style={{ bottom: '4px' }}
                      />
                    )}
                  </Link>
                )
              })}

              {/* ── Desktop city selector ── */}
              <div className="relative z-50 ml-3">
                <button
                  onClick={() => setCityDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/18 border border-emerald-500/20"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {currentCity.name}
                  <svg
                    width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      transform: cityDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {cityDropdownOpen && (
                  <>
                    {/* Click-away backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setCityDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-800/60 bg-zinc-950/96 backdrop-blur-md shadow-xl z-50 py-1.5 overflow-hidden">
                      {cities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => { setCurrentCity(city.id); setCityDropdownOpen(false) }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2.5 hover:bg-zinc-800/50',
                            city.id === currentCity.id
                              ? 'text-emerald-400 font-semibold'
                              : 'text-zinc-400 hover:text-zinc-200',
                          )}
                          style={{ fontFamily: FONT_DISPLAY }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: city.id === currentCity.id ? '#34d399' : 'transparent' }}
                          />
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              <span
                className="w-[18px] h-0.5 rounded-full bg-zinc-400 transition-all duration-200 origin-center"
                style={{ transform: mobileOpen ? 'rotate(45deg) translateY(5px)' : 'none' }}
              />
              <span
                className="w-[18px] h-0.5 rounded-full bg-zinc-400 transition-all duration-200"
                style={{ opacity: mobileOpen ? 0 : 1, transform: mobileOpen ? 'scaleX(0)' : 'scaleX(1)' }}
              />
              <span
                className="w-[18px] h-0.5 rounded-full bg-zinc-400 transition-all duration-200 origin-center"
                style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-5px)' : 'none' }}
              />
            </button>

          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="mobile-menu-enter md:hidden border-t border-zinc-800/60 bg-zinc-950/96 backdrop-blur-md">
            <div className="px-4 py-3">

              {/* Nav links */}
              <div className="space-y-0.5">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150',
                        active ? 'nav-link-active' : 'nav-link-idle',
                      )}
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: active ? '#34d399' : '#3f3f46' }}
                      />
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* City selector */}
              <div className="mt-3 pt-3 border-t border-zinc-800/60">
                <span
                  className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.15em] px-3.5 mb-2"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  City
                </span>
                <div className="space-y-0.5">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => { setCurrentCity(city.id); setMobileOpen(false) }}
                      className={cn(
                        'w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors flex items-center gap-3',
                        city.id === currentCity.id
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40',
                      )}
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: city.id === currentCity.id ? '#34d399' : '#3f3f46' }}
                      />
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </nav>
    </>
  )
}