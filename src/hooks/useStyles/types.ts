import type { Color } from 'three'

export type GetColorVarHex = (variableName: string) => string | undefined

export type GetColorVarRgbString = (variableName: string) => string | undefined

export type GetColorVarThree = (variableName: string) => Color | undefined
