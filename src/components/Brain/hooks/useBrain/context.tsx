import {
  createContext,
  useRef,
  type RefObject,
} from 'react'

import type { BrainProviderProps } from './types'

export const BrainProviderContext = createContext<{
  expandedItemIdRef: RefObject<string | null> | null,
}>({
  expandedItemIdRef: null,
})

export const BrainProvider = ({ children }: BrainProviderProps) => {
  const expandedItemIdRef = useRef<string>(null)

  return (
    <BrainProviderContext.Provider
      value={{
        expandedItemIdRef,
      }}
    >
      {children}
    </BrainProviderContext.Provider>
  )
}
