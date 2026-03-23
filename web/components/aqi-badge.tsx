import { cn, formatAQI, getAQIBadgeClass } from '@/lib/utils'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
const FONT_DISPLAY = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

interface AQIBadgeProps {
  aqi: number
  className?: string
  showValue?: boolean
}

function getAQIStyles(aqi: number): {
  bg: string; border: string; text: string; dot: string; glow: string
} {
  if (aqi <= 50)  return {
    bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)',
    text: '#34d399', dot: '#34d399', glow: 'rgba(52,211,153,0.15)',
  }
  if (aqi <= 100) return {
    bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)',
    text: '#fbbf24', dot: '#fbbf24', glow: 'rgba(251,191,36,0.12)',
  }
  if (aqi <= 150) return {
    bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)',
    text: '#f97316', dot: '#f97316', glow: 'rgba(249,115,22,0.12)',
  }
  return {
    bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)',
    text: '#f87171', dot: '#f87171', glow: 'rgba(248,113,113,0.12)',
  }
}

export function AQIBadge({ aqi, className, showValue = true }: AQIBadgeProps) {
  const badgeClass = getAQIBadgeClass(aqi)
  const label      = formatAQI(aqi)
  const styles     = getAQIStyles(aqi)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold',
        badgeClass,
        className,
      )}
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
        boxShadow: `0 0 8px ${styles.glow}`,
        fontFamily: FONT_DISPLAY,
        letterSpacing: '0.02em',
      }}
    >
      {/* Status dot */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: styles.dot, boxShadow: `0 0 4px ${styles.dot}` }}
      />

      {/* Category label */}
      <span className="font-semibold">{label}</span>

      {/* Numeric value — slightly muted but legible */}
      {showValue && (
        <span
          className="tabular-nums font-medium"
          style={{ opacity: 0.75, fontSize: '11px' }}
        >
          {aqi.toFixed(0)}
        </span>
      )}
    </div>
  )
}