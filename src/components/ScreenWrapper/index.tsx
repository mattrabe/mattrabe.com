'use client'

import { useState } from 'react'

import { Header } from '@/components/Header'

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  const [
    isHeaderExpanded,
    setIsHeaderExpanded,
  ] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => setIsHeaderExpanded(false)}
    >
      <Header
        isExpanded={isHeaderExpanded}
        setIsExpanded={setIsHeaderExpanded}
      />

      {children}
    </div>
  )
}
