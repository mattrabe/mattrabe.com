import type { RefObject } from 'react'

export type ThreeDBrainProps = {
  expandedItemIdRef: RefObject<string | undefined>,
  onClickBrain?: () => void,
}
