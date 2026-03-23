// ─── FONT CONFIG ────────────────────────────────────────────────────────────
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY    = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

export function FooterDisclaimer() {
  return (
    <footer
      className="w-full border-t mt-8 sm:mt-10"
      style={{
        borderColor: 'rgba(39,39,42,0.5)',
        backgroundColor: 'rgba(9,9,11,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        fontFamily: FONT_BODY,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: '#71717a', fontFamily: FONT_DISPLAY }}
            >
              © 2026 Breathe Map
            </span>
          </div>

          {/* Disclaimer */}
          <p
            className="text-xs text-center sm:text-right leading-relaxed"
            style={{ color: '#52525b', fontFamily: FONT_BODY }}
          >
            Educational simulation only. Not for policy or regulatory use.
          </p>

        </div>
      </div>
    </footer>
  )
}