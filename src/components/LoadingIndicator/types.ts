import type { ComponentProps } from 'react'
import type { LifeLineProps } from 'react-loading-indicators'

export type LoadingIndicatorProps = LifeLineProps & {
  isInCanvas?: boolean,
  percentProgress?: number, // Typically 0 to 100
  wrapperStyle?: ComponentProps<'div'>['style'],
}
