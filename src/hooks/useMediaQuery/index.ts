import { useMemo } from 'react'
import { useMediaQuery as useMediaQueryRR } from 'react-responsive'

export function useMediaQuery() {
  const isDesktop = useMediaQueryRR({ query: '(min-width: 1224px)' })
  const isTablet = useMediaQueryRR({ query: '(min-width: 768px) and (max-width: 1223px)' })
  const isPhone = useMediaQueryRR({ query: '(max-width: 767px)' })

  return useMemo(() => ({
    isDesktop,
    isPhone,
    isTablet,
  }), [
    isDesktop,
    isPhone,
    isTablet,
  ])
}
