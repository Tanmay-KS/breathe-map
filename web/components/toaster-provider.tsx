'use client'

import { Toaster } from 'react-hot-toast'

// ─── FONT CONFIG ────────────────────────────────────────────────────────────
const FONT_BODY = "'Google Sans', sans-serif"
// ────────────────────────────────────────────────────────────────────────────

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: 'transparent',
          padding: 0,
          boxShadow: 'none',
          fontFamily: FONT_BODY,
        },
      }}
    />
  )
}