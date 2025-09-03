import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import { LifeLine } from 'react-loading-indicators'

import type { LoadingIndicatorProps } from './types'

export function LoadingIndicator({
  isInCanvas = true,
  precentProgress = 0,
  wrapperStyle,
  ...props
}: LoadingIndicatorProps) {
  const Wrapper = useMemo(() => isInCanvas ? Html : 'div', [ isInCanvas ])

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
      <LifeLine
        color='var(--color-muted-foreground)'
        text={`${precentProgress}%`}
        {...props}
      />
    </Wrapper>
  )
}
