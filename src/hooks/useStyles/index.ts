'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Color } from 'three'

import type {
  GetColorVarHex,
  GetColorVarRgbString,
  GetColorVarThree,
} from './types'

export function useStyles() {
  const [
    computedStyle,
    setComputedStyle,
  ] = useState<CSSStyleDeclaration>()

  useEffect(() => {
    const rootElement = document.documentElement

    setComputedStyle(window.getComputedStyle(rootElement))
  }, [])

  const getColorVarHex = useCallback<GetColorVarHex>(variableName => {
    const value = computedStyle?.getPropertyValue(variableName)

    if (!value) {
      return undefined
    }

    return value
  }, [ computedStyle ])

  const getColorVarRgbString = useCallback<GetColorVarRgbString>(variableName => {
    const value = computedStyle?.getPropertyValue(variableName)

    if (!value) {
      return undefined
    }

    return hexToRgb(value)
  }, [ computedStyle ])

  const getColorVarThree = useCallback<GetColorVarThree>(variableName => {
    const value = computedStyle?.getPropertyValue(variableName)

    if (!value) {
      return undefined
    }

    return new Color().setHex(parseInt(value.replace('#', '0x'), 16))
  }, [ computedStyle ])

  return useMemo(() => ({
    getColorVarHex,
    getColorVarRgbString,
    getColorVarThree,
  }), [
    getColorVarHex,
    getColorVarRgbString,
    getColorVarThree,
  ])
}

export function hexToRgb(hex: string) {
  // Remove the '#' if present
  let hexValue = hex.startsWith('#') ? hex.slice(1) : hex

  // Handle 3-digit shorthand hex codes (e.g., #F00 becomes #FF0000)
  if (hexValue.length === 3) {
    hexValue = hexValue[0] + hexValue[0] +
      hexValue[1] + hexValue[1] +
      hexValue[2] + hexValue[2]
  }

  // Parse the R, G, B values
  const r = parseInt(hexValue.substring(0, 2), 16)
  const g = parseInt(hexValue.substring(2, 4), 16)
  const b = parseInt(hexValue.substring(4, 6), 16)

  return `rgb(${r}, ${g}, ${b})`
}

export * from './types'
