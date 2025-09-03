import {
  Suspense,
  useCallback,
} from 'react'
import {
  OrbitControls,
  Stage,
  useProgress,
} from '@react-three/drei'

import { Annotations } from '@/components/Brain/Annotations'
import { BrainLoader } from '@/components/Brain/Loader'
import { useCameraControls } from '@/components/Brain/hooks/useCameraControls'
import { useBrain } from '@/components/Brain/hooks/useBrain'

import { BrainModel } from './BrainModel'

export function ThreeDBrain() {
  const progress = useProgress()

  const { expandedItemIdRef } = useBrain()
  const { cameraControlsRef } = useCameraControls()

  const onClickBrain = useCallback(() => {
    // Clear the expanded item id when the brain is clicked
    if (expandedItemIdRef) {
      // In order to close any open annotation we would need to trigger the animation to close it, which is currently in Brain/Annotation.
      // Just setting the ref to null here won't trigger the animation, and it will cause problems on subsequent clicks.
      // So leaving this disabled for now.
      // expandedItemIdRef.current = null
    }
  }, [ expandedItemIdRef ])

  return (
    <Suspense
      fallback={(
        <BrainLoader
          state={progress}
          wrapperStyle={{ transform: 'translate(-50%, -50%)' }}
        />
      )}
    >
      <Annotations />

      <Stage
        adjustCamera={false}
        environment='sunset'
        intensity={1}
        preset='upfront'
        // shadows={false}
      >
        <BrainModel
          onClickBrain={onClickBrain}
        />
      </Stage>

      <OrbitControls
        ref={cameraControlsRef}

        autoRotate={false} // This will be set to `true` once the auto-open "Hello!" annotation is closed
        autoRotateSpeed={-0.1}

        enableRotate={false} // This will be set to `true` once the auto-open "Hello!" annotation is closed
        dampingFactor={0.1}

        enableZoom={false}
      />
    </Suspense>
  )
}

