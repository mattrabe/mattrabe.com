'use client'

import {
  useEffect,
  useMemo,
} from 'react'
import { Color } from 'three'
import { Html } from '@react-three/drei'

import { useBrain } from '@/components/Brain/hooks/useBrain'
import { useCameraControls } from '@/components/Brain/hooks/useCameraControls'

import { useStyles } from '@/hooks/useStyles'

import { Annotation } from './Annotation'
import { useAnnotations } from './useAnnotations'

export function Annotations() {
  const { getColorVarThree } = useStyles()
  const colors = useMemo(() => ({
    background: getColorVarThree('--brain-background'),
    foreground: getColorVarThree('--brain-foreground'),
    white: new Color('#ffffff'),
  }), [ getColorVarThree ])

  const { setCameraControls } = useCameraControls()

  const { hasWelcomeBeenShown } = useBrain()

  const annotations = useAnnotations()

  const annotationComponents = useMemo(() => annotations.map((annotation) => (
    <Annotation
      key={annotation.label}
      colors={colors}
      {...annotation}
    />
  )), [
    annotations,
    colors,
  ])

  // Start rotation immediately if no autoload annotation exists or it has already been shown
  useEffect(() => {
    if (hasWelcomeBeenShown() || annotations.every(annotation => !annotation.isAutoShow)) {
      setCameraControls({
        autoRotateEnabled: true,
        dragToRotateEnabled: true,
      })
    }
  }, [
    annotations,
    hasWelcomeBeenShown,
    setCameraControls,
  ])

  if (!colors) {
    return null
  }

  return (
    <>
      {annotationComponents}

      {/* Output all of the annotations content as HTML, in case a bot wants to scrape it. The content rendered in the Canvas is not scrapable. */}
      <Html
        style={{ display: 'none' }}
      >
        {annotations.map((annotation) => (
          <p key={annotation.label}>{annotation.label}: {annotation.content}</p>
        ))}
      </Html>
    </>
  )
}

export { useAnnotations } from './useAnnotations'
