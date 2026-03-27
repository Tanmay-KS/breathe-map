'use client'

const FONT_DISPLAY = "'Google Sans', sans-serif"

interface LoaderProps {
  variant?: 'page' | 'inline'
  label?: string
}

export function Loader({ variant = 'page', label }: LoaderProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2.5">
        <div
          className="w-4 h-4 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(52,211,153,0.2)', borderTopColor: '#34d399' }}
        />
        {label && (
          <span className="text-sm text-zinc-500" style={{ fontFamily: FONT_DISPLAY }}>
            {label}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(52,211,153,0.15)', borderTopColor: '#34d399' }}
        />
        {label && (
          <p className="text-sm text-zinc-500" style={{ fontFamily: FONT_DISPLAY }}>
            {label}
          </p>
        )}
      </div>
    </div>
  )
}
