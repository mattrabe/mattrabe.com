import {
  Suspense,
  useRef,
} from 'react'
import { Canvas } from '@react-three/fiber'

import { BrainProvider } from '@/components/Brain/hooks/useBrain/context'
import { CameraControlsRefProvider } from '@/components/Brain/hooks/useCameraControls/context'

import { BrainLoader } from './Loader'

import { ThreeDBrain } from './ThreeDBrain'

export function Brain() {
  const cameraRef = useRef<HTMLCanvasElement>(null)

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
          <BrainProvider>
            <CameraControlsRefProvider>
              <ThreeDBrain />
            </CameraControlsRefProvider>
          </BrainProvider>
        </Canvas>
      </Suspense>
    </>
  )
}

function Fallback() {
  return <p>Boo, your browser doesn&apos;t support javascript or HTML canvas.</p>
}
