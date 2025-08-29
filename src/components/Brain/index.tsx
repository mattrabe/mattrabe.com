'use client'

import {
  Suspense,
  useCallback,
  useRef,
} from 'react'

import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

import { BrainLoader } from './Loader'

import { ThreeDBrain } from './ThreeDBrain'

const BRAIN_GLB_PATH = '/3d-models/brain_areas.glb'

useGLTF.preload(BRAIN_GLB_PATH)

export function Brain() {
  const expandedItemIdRef = useRef<string>(undefined)

  const onClickBrain = useCallback(() => {
    expandedItemIdRef.current = undefined
  }, [])

  const cameraRef = useRef<HTMLCanvasElement>(null)

  return (
    <Suspense fallback={<BrainLoader />}>
      <Canvas
        ref={cameraRef}
        camera={{
          fov: 42,
          position: [0, 0, 5],
        }}
        fallback={<p>Boo, your browser can&apos;t see inside my brain.</p>}
      >
        <ThreeDBrain
          expandedItemIdRef={expandedItemIdRef}
          onClickBrain={onClickBrain}
        />
      </Canvas>
    </Suspense>
  )
}
