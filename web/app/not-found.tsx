// app/not-found.tsx
// Next.js App Router 404 page

import Link from 'next/link'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
const FONT_IMPORT  = 'Google+Sans:wght@300;400;500;600;700'
const FONT_DISPLAY = "'Google Sans', sans-serif"
const FONT_BODY    = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_IMPORT}&display=swap');

        :root {
          --font-display: ${FONT_DISPLAY};
          --font-body:    ${FONT_BODY};
          --green:        #34d399;
          --green-dim:    #6ee7b7;
          --green-glow:   rgba(52, 211, 153, 0.35);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #09090b;
          font-family: var(--font-body);
          min-height: 100dvh;
        }

        /* ── Cat animations ── */

        /* Gentle floating bob */
        @keyframes bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25%       { transform: translateY(-6px) rotate(-1deg); }
          75%       { transform: translateY(-3px) rotate(1deg); }
        }

        /* Tail sway */
        @keyframes tailSway {
          0%, 100% { transform: rotate(-10deg); }
          50%       { transform: rotate(18deg); }
        }

        /* Ear twitch — alternating */
        @keyframes earTwitchLeft {
          0%, 85%, 100% { transform: rotate(0deg); }
          90%            { transform: rotate(-12deg); }
          95%            { transform: rotate(4deg); }
        }
        @keyframes earTwitchRight {
          0%, 75%, 100% { transform: rotate(0deg); }
          80%            { transform: rotate(12deg); }
          88%            { transform: rotate(-5deg); }
        }

        /* Eye blink */
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96%            { transform: scaleY(0.08); }
        }

        /* Paw tap */
        @keyframes pawTap {
          0%, 60%, 100% { transform: translateY(0); }
          70%            { transform: translateY(-5px); }
          80%            { transform: translateY(1px); }
          90%            { transform: translateY(-2px); }
        }

        /* Neon pulse on the cat outline */
        @keyframes neonPulse {
          0%, 100% { filter: drop-shadow(0 0 4px var(--green-glow)) drop-shadow(0 0 10px rgba(52,211,153,0.2)); }
          50%       { filter: drop-shadow(0 0 8px var(--green-glow)) drop-shadow(0 0 18px rgba(52,211,153,0.3)); }
        }

        /* Page fade-in */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* 404 shimmer */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .cat-wrapper {
          animation: bob 4s ease-in-out infinite, neonPulse 3s ease-in-out infinite;
        }

        .cat-tail {
          transform-origin: 100% 10%;
          animation: tailSway 2.5s ease-in-out infinite;
        }

        .cat-ear-left {
          transform-origin: 50% 100%;
          animation: earTwitchLeft 6s ease-in-out infinite;
        }

        .cat-ear-right {
          transform-origin: 50% 100%;
          animation: earTwitchRight 6s ease-in-out infinite 1.2s;
        }

        .cat-eye-left,
        .cat-eye-right {
          transform-origin: center center;
          animation: blink 5s ease-in-out infinite;
        }
        .cat-eye-right {
          animation-delay: 0.08s;
        }

        .cat-paw-left {
          animation: pawTap 4s ease-in-out infinite 1s;
          transform-origin: center top;
        }

        .fade-1 { animation: fadeUp 0.6s ease 0.1s both; }
        .fade-2 { animation: fadeUp 0.6s ease 0.25s both; }
        .fade-3 { animation: fadeUp 0.6s ease 0.4s both; }
        .fade-4 { animation: fadeUp 0.6s ease 0.55s both; }
        .fade-5 { animation: fadeUp 0.6s ease 0.7s both; }

        .four-o-four {
          font-family: var(--font-display);
          font-size: clamp(6rem, 18vw, 10rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #e4e4e7 0%, #71717a 40%, #34d399 70%, #6ee7b7 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeUp 0.6s ease 0.1s both, shimmer 6s linear infinite 1s;
        }

        .back-btn {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #34d399;
          color: #09090b;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 20px rgba(52,211,153,0.25), 0 4px 12px rgba(0,0,0,0.3);
        }
        .back-btn:hover {
          background: #6ee7b7;
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(52,211,153,0.4), 0 8px 20px rgba(0,0,0,0.4);
        }

        .sec-btn {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 20px;
          background: transparent;
          color: #a1a1aa;
          border: 1px solid rgba(63,63,70,0.7);
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .sec-btn:hover {
          color: #e4e4e7;
          border-color: rgba(52,211,153,0.3);
          background: rgba(52,211,153,0.04);
        }
      `}</style>

      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '480px',
            position: 'relative',
            zIndex: 1,
            gap: 0,
          }}
        >

          {/* Neon cat — SVG with CSS animation parts */}
          <div className="cat-wrapper fade-1" style={{ marginBottom: '2rem' }}>
            <svg
              width="110"
              height="110"
              viewBox="0 0 110 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body */}
              <ellipse
                cx="55" cy="72"
                rx="24" ry="20"
                stroke="#34d399" strokeWidth="2.2" fill="rgba(52,211,153,0.04)"
              />

              {/* Head */}
              <circle
                cx="55" cy="44"
                r="20"
                stroke="#34d399" strokeWidth="2.2" fill="rgba(52,211,153,0.04)"
              />

              {/* Left ear */}
              <g className="cat-ear-left">
                <polygon
                  points="38,30 33,14 46,26"
                  stroke="#34d399" strokeWidth="2" strokeLinejoin="round"
                  fill="rgba(52,211,153,0.08)"
                />
                {/* Inner ear */}
                <polygon
                  points="39,28 35,17 44,26"
                  fill="rgba(52,211,153,0.15)"
                  stroke="none"
                />
              </g>

              {/* Right ear */}
              <g className="cat-ear-right">
                <polygon
                  points="72,30 77,14 64,26"
                  stroke="#34d399" strokeWidth="2" strokeLinejoin="round"
                  fill="rgba(52,211,153,0.08)"
                />
                {/* Inner ear */}
                <polygon
                  points="71,28 75,17 66,26"
                  fill="rgba(52,211,153,0.15)"
                  stroke="none"
                />
              </g>

              {/* Left eye */}
              <g className="cat-eye-left">
                <ellipse cx="47" cy="42" rx="3.5" ry="4.5" fill="#34d399" opacity="0.9" />
                <ellipse cx="47" cy="42" rx="1.5" ry="2.5" fill="#09090b" />
                {/* Eye gleam */}
                <circle cx="48.5" cy="40.5" r="1" fill="#a7f3d0" opacity="0.8" />
              </g>

              {/* Right eye */}
              <g className="cat-eye-right">
                <ellipse cx="63" cy="42" rx="3.5" ry="4.5" fill="#34d399" opacity="0.9" />
                <ellipse cx="63" cy="42" rx="1.5" ry="2.5" fill="#09090b" />
                {/* Eye gleam */}
                <circle cx="64.5" cy="40.5" r="1" fill="#a7f3d0" opacity="0.8" />
              </g>

              {/* Nose */}
              <path
                d="M55 48 L53 50 L57 50 Z"
                fill="#6ee7b7" opacity="0.8"
              />

              {/* Mouth */}
              <path
                d="M53 50.5 Q55 53 57 50.5"
                stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinecap="round"
              />

              {/* Whiskers left */}
              <line x1="36" y1="48" x2="50" y2="49.5" stroke="#34d399" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
              <line x1="35" y1="51" x2="50" y2="51" stroke="#34d399" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />

              {/* Whiskers right */}
              <line x1="74" y1="48" x2="60" y2="49.5" stroke="#34d399" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
              <line x1="75" y1="51" x2="60" y2="51" stroke="#34d399" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />

              {/* Left front paw */}
              <g className="cat-paw-left">
                <ellipse cx="42" cy="90" rx="7" ry="4.5" stroke="#34d399" strokeWidth="2" fill="rgba(52,211,153,0.06)" />
                <line x1="39" y1="92" x2="39" y2="88" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <line x1="42" y1="92.5" x2="42" y2="88" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <line x1="45" y1="92" x2="45" y2="88" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              </g>

              {/* Right front paw */}
              <ellipse cx="68" cy="90" rx="7" ry="4.5" stroke="#34d399" strokeWidth="2" fill="rgba(52,211,153,0.06)" />
              <line x1="65" y1="92" x2="65" y2="88" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="68" y1="92.5" x2="68" y2="88" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="71" y1="92" x2="71" y2="88" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

              {/* Tail */}
              <g className="cat-tail">
                <path
                  d="M79 80 Q96 72 92 58 Q88 46 82 50"
                  stroke="#34d399" strokeWidth="2.2" fill="none" strokeLinecap="round"
                />
                {/* Tail tip */}
                <circle cx="82" cy="50" r="3" stroke="#34d399" strokeWidth="2" fill="rgba(52,211,153,0.15)" />
              </g>

              {/* Chest stripe / fur detail */}
              <path
                d="M48 64 Q55 68 62 64"
                stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"
              />
            </svg>
          </div>

          {/* 404 number */}
          <div className="four-o-four">404</div>

          {/* Status badge */}
          <div
            className="fade-2"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(52,211,153,0.18)',
              background: 'rgba(52,211,153,0.06)',
              color: '#6ee7b7',
              fontSize: '11px',
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: '1.25rem',
              marginBottom: '1rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            Page not found
          </div>

          {/* Message */}
          <p
            className="fade-3"
            style={{
              fontFamily: FONT_BODY,
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#a1a1aa',
              maxWidth: '320px',
              marginBottom: '2rem',
            }}
          >
            This zone doesn't exist on the map.
            <br />
            Let's get you back to somewhere real.
          </p>

          {/* CTAs */}
          <div
            className="fade-4"
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link href="/dashboard" className="back-btn">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              Back to Dashboard
            </Link>
            <Link href="/zones" className="sec-btn">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              View Zones
            </Link>
          </div>

          {/* Error code */}
          <p
            className="fade-5"
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: '12px',
              color: '#3f3f46',
              marginTop: '2.5rem',
              letterSpacing: '0.05em',
            }}
          >
            HTTP 404 · Route not matched
          </p>

        </div>
      </div>
    </>
  )
}