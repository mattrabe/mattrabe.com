import {
  Suspense,
  useCallback,
  useRef,
} from 'react'
import { Canvas } from '@react-three/fiber'

import { CameraControlsRefProvider } from '@/components/Brain/hooks/useCameraControls/context'

import { BrainLoader } from './Loader'

import { ThreeDBrain } from './ThreeDBrain'

export function Brain() {
  const expandedItemIdRef = useRef<string>(undefined)

  const cameraRef = useRef<HTMLCanvasElement>(null)

  const onClickBrain = useCallback(() => {
    // Clear the expanded item id when the brain is clicked
    expandedItemIdRef.current = undefined
  }, [])

  return (
    <>
      <Suspense fallback={<BrainLoader />}>
        <Canvas
          ref={cameraRef}
          camera={{
            fov: 42,
            // castShadow: false,
          }}
          fallback={<Fallback />}
          // shadows={false}
        >
          <CameraControlsRefProvider>
            <ThreeDBrain
              expandedItemIdRef={expandedItemIdRef}
              onClickBrain={onClickBrain}
            />
          </CameraControlsRefProvider>
        </Canvas>
      </Suspense>
    </>
  )
}

function Fallback() {
  return <p>Boo, your browser doesn&apos;t support javascript or HTML canvas.</p>
}
