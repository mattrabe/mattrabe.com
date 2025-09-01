import {
  useCallback,
  useContext,
  useMemo,
} from 'react'

import { BrainProviderContext } from './context'

export function useBrain() {
  const { expandedItemIdRef } = useContext(BrainProviderContext)

  const setExpandedItemId = useCallback((expandedItemId: string | null) => {
    if (!expandedItemIdRef) {
      return
    }

    expandedItemIdRef.current = expandedItemId
  }, [ expandedItemIdRef ])

  return useMemo(() => ({
    expandedItemIdRef,
    expandedItemId: expandedItemIdRef?.current,
    setExpandedItemId,
  }), [
    expandedItemIdRef,
    setExpandedItemId,
  ])
}

export { BrainProviderContext }

export * from './types'
