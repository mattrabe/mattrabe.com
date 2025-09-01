'use client'

import {
  useEffect,
  useMemo,
} from 'react'
import { Html } from '@react-three/drei'

import { useStyles } from '@/hooks/useStyles'

import { Annotation } from '../Annotation'
import { useCameraControls } from '../hooks/useCameraControls'

import { annotations } from './annotations'

export function Annotations() {
  const { getColorVarThree } = useStyles()

  const colors = useMemo(() => ({
    background: getColorVarThree('--brain-background'),
    foreground: getColorVarThree('--brain-foreground'),
  }), [ getColorVarThree ])

  const { setCameraControls } = useCameraControls()

  useEffect(() => {
    if (annotations.every(annotation => !annotation.isAutoShow)) {
      // No autoload annotation exists - start rotation immediately
      setCameraControls({
        autoRotateEnabled: true,
        dragToRotateEnabled: true,
      })
    }
  }, [ setCameraControls ])

  if (!colors) {
    return null
  }

  return (
    <>
      {annotations.map((annotation) => (
        <Annotation
          key={annotation.label}
          colors={colors}
          {...annotation}
        />
      ))}

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
