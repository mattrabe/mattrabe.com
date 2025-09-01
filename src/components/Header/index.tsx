'use client'

import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

import { Headshot } from '@/components/Headshot'
import { Menu } from '@/components/Menu'

const HEADSHOT_OPACITY = {
  off: 0.5,
  on: 1,
}
const HEADSHOT_EXPAND_DURATION_MS = 500

export function Header({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean
  setIsExpanded: Dispatch<SetStateAction<boolean>>
}) {
  const [
    isHovered,
    setIsHovered,
  ] = useState(false)

  const [
    isMenuVisible,
    setIsMenuVisible,
  ] = useState(false)

  const [
    isMenuOverlayVisible,
    setIsMenuOverlayVisible,
  ] = useState(false)

  const [
    headshotType,
    // setHeadshotType,
  ] = useState<'ai' | 'real'>('ai')

  useEffect(() => {
    if (!isExpanded) {
      // setHeadshotType('ai')

      setIsHovered(false)
      setIsMenuVisible(false)

      const timeout = setTimeout(() => {
        setIsMenuOverlayVisible(false)
      }, 250)

      return () => clearTimeout(timeout)
    }

    /*
    const timeout = setTimeout(() => {
      setHeadshotType(prev => prev === 'ai' ? 'real' : 'ai')
    }, 2500)

    return () => clearTimeout(timeout)
    */

    setIsMenuOverlayVisible(true)

    const timeout = setTimeout(() => {
      setIsMenuVisible(true)
    }, HEADSHOT_EXPAND_DURATION_MS - 200)

    return () => clearTimeout(timeout)
  }, [ isExpanded ])

  return (
    <div
      style={{
        position: 'fixed',
        top: 25,
        left: 25,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          transition: `opacity ${HEADSHOT_EXPAND_DURATION_MS * 2}ms ease-in-out, width ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out, height ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out`,
        }}
      >
        <div
          onMouseOver={() => { setIsHovered(true) }}
          onMouseOut={() => { setIsHovered(false) }}
          onClick={event => {
            event.stopPropagation()

            setIsExpanded(prev => !prev)
          }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            transition: `opacity ${HEADSHOT_EXPAND_DURATION_MS * 2}ms ease-in-out, width ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out, height ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out`,
          }}
        >
          <Headshot
            width={isExpanded ? 100 : 50}
            height={isExpanded ? 100 : 50}
            style={{
              opacity: (isHovered || isExpanded) ? HEADSHOT_OPACITY.on : HEADSHOT_OPACITY.off,
              transition: `opacity ${HEADSHOT_EXPAND_DURATION_MS * 2}ms ease-in-out, width ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out, height ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out`,
            }}
            type={headshotType}
          />
          <div
            style={{
              color: 'var(--color-foreground)',
              fontSize: isExpanded ? 21 : 14,
              overflow: 'hidden',
              opacity: (isHovered || isExpanded) ? HEADSHOT_OPACITY.on : HEADSHOT_OPACITY.off,
              transition: `opacity ${HEADSHOT_EXPAND_DURATION_MS}ms ease-in-out, font-size ${HEADSHOT_EXPAND_DURATION_MS * 0.9}ms ease-in-out`,
            }}
          >
            Matt Rabe
          </div>
        </div>

        <Menu
          isVisible={isMenuVisible}
          isOverlayVisible={isMenuOverlayVisible}
          onRequestClose={() => { console.log('clickclcick'); setIsMenuVisible(false) }}
        />
      </div>
    </div>
  )
}
