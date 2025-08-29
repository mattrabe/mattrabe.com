import { LifeLine } from 'react-loading-indicators'

import type { LoadingIndicatorProps } from './types'

export function LoadingIndicator(props: LoadingIndicatorProps) {
  return (
    <LifeLine
      color='#999'
      {...props}
    />
  )
}
