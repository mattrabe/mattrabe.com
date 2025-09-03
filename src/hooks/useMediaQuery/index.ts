import { useMemo } from 'react'
import { useMediaQuery as useMediaQueryRR } from 'react-responsive'

export function useMediaQuery() {
  const isDesktop = useMediaQueryRR({ query: '(min-width: 1224px)' })
  const isGteDesktop = isDesktop
  const isLteDesktop = isDesktop

  const isTablet = useMediaQueryRR({ query: '(min-width: 768px) and (max-width: 1223px)' })
  const isGteTablet = useMediaQueryRR({ query: '(min-width: 768px)' })
  const isLteTablet = useMediaQueryRR({ query: '(max-width: 1223px)' })

  const isPhone = useMediaQueryRR({ query: '(max-width: 767px)' })
  const isGtePhone = isPhone
  const isLtePhone = isPhone

  return useMemo(() => ({
    isDesktop,
    isGteDesktop,
    isLteDesktop,
    isTablet,
    isGteTablet,
    isLteTablet,
    isPhone,
    isGtePhone,
    isLtePhone,
  }), [
    isDesktop,
    isGteDesktop,
    isLteDesktop,
    isTablet,
    isGteTablet,
    isLteTablet,
    isPhone,
    isGtePhone,
    isLtePhone,
  ])
}
