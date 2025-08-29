import { useMemo } from 'react'

import { Html } from '@react-three/drei'

import { LoadingIndicator } from '@/components/LoadingIndicator'

import type { BrainLoaderProps } from './types'

export function BrainLoader({
  isInCanvas = true,
  state,
  wrapperStyle,
}: BrainLoaderProps) {
  const {
    active,
    progress = 0,
  } = state ?? {}

  const Wrapper = useMemo(() => isInCanvas ? Html : 'div', [ isInCanvas ])

  if (active) {
    return null
  }

  return (
    <Wrapper
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        ...wrapperStyle,
      }}
    >
      <LoadingIndicator
        text={`${progress}%`}
      />
    </Wrapper>
  )
}
