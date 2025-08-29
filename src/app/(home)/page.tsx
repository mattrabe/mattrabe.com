'use client'

import { Brain } from '@/components/Brain'

import { ScreenWrapper } from '@/components/ScreenWrapper'

export default function Home() {
  return (
    <ScreenWrapper>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Brain />
      </div>
    </ScreenWrapper>
  )
}
