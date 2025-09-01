import {
  useCallback,
  useContext,
  useMemo,
} from 'react'

import { CameraControlsRefContext } from './context'

export function useCameraControls() {
  const { cameraControlsRef } = useContext(CameraControlsRefContext)

  const setCameraControls = useCallback(({
    autoRotateEnabled,
    dragToRotateEnabled,
  }: {
    autoRotateEnabled?: boolean,
    dragToRotateEnabled?: boolean,
  }) => {
    if (!cameraControlsRef?.current) {
      return
    }

    if (autoRotateEnabled !== undefined) {
      cameraControlsRef.current.autoRotate = autoRotateEnabled
    }

    if (dragToRotateEnabled !== undefined) {
      cameraControlsRef.current.enableRotate = dragToRotateEnabled
    }
  }, [ cameraControlsRef ])

  const cameraControls = useMemo(() => ({
    autoRotateEnabled: cameraControlsRef?.current?.autoRotate || false,
    dragToRotateEnabled: cameraControlsRef?.current?.enableRotate || false,
  }), [ cameraControlsRef ])

  return useMemo(() => ({
    cameraControls,
    cameraControlsRef,
    setCameraControls,
  }), [
    cameraControls,
    cameraControlsRef,
    setCameraControls,
  ])
}

export { CameraControlsRefContext }

export * from './types'
