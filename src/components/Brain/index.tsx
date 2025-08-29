import {
  Suspense,
  useCallback,
  useRef,
} from 'react'

import { Canvas } from '@react-three/fiber'

import { BrainLoader } from './Loader'

import { ThreeDBrain } from './ThreeDBrain'

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
