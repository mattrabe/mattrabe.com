'use client'

import { Suspense } from 'react'

import { Brain } from '@/components/Brain'
import { LoadingIndicator } from '@/components/LoadingIndicator'
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
        <Suspense fallback={<LoadingIndicator />}>
          <Brain />
        </Suspense>
      </div>
    </ScreenWrapper>
  )
}
