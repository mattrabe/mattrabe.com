import {
  useCallback,
  useContext,
  useMemo,
} from 'react'

import { BrainProviderContext } from './context'

const WELCOME_SHOWN_KEY = 'welcomeShown'

export function useBrain() {
  const { expandedItemIdRef } = useContext(BrainProviderContext)

  const hasWelcomeBeenShown = useCallback(() => {
    return localStorage.getItem(WELCOME_SHOWN_KEY) === 'true'
  }, [])

  const setHasWelcomeBeenShown = useCallback<(bool?: boolean) => void>(bool => {
    localStorage.setItem(WELCOME_SHOWN_KEY, (bool?.toString() || 'null'))
  }, [])

  return useMemo(() => ({
    expandedItemIdRef,
    hasWelcomeBeenShown,
    setHasWelcomeBeenShown,
  }), [
    expandedItemIdRef,
    hasWelcomeBeenShown,
    setHasWelcomeBeenShown,
  ])
}

export { BrainProviderContext }

export * from './types'
