import type { ComponentProps } from 'react'
import type { Progress } from '@react-three/drei'

export type BrainLoaderProps = {
  isInCanvas?: boolean,
  state?: Parameters<NonNullable<Parameters<typeof Progress>[0]['children']>>[0],
  wrapperStyle?: ComponentProps<'div'>['style'],
}
