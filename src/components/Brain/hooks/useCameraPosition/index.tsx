import {
  useCallback,
  useContext,
  useMemo,
} from 'react'
import type { Vector3Tuple } from 'three'
import { useThree } from '@react-three/fiber'
import {
  useSpring,
  type SpringConfig,
} from '@react-spring/three'

import { useMediaQuery } from '@/hooks/useMediaQuery'

import { CameraControlsRefContext } from '../useCameraControls/context'

export const CAMERA_POSITION_BEFORE_DEFAULT: Vector3Tuple = [ 0, 0, 5 ]

export const CAMERA_POSITION_DEFAULT: Record<string, Vector3Tuple> = {
  phone: [ 0, 0, 4 ],
  tablet: [ 0, 0, 3 ],
}

export function useCameraPosition() {
  const { camera } = useThree()

  const {
    isCameraControlReady,
    setIsCameraControlReady,
  } = useContext(CameraControlsRefContext)

  const { isGteTablet } = useMediaQuery()

  const startingCameraPosition = useMemo(() => (!isCameraControlReady && CAMERA_POSITION_BEFORE_DEFAULT) || CAMERA_POSITION_DEFAULT[isGteTablet ? 'tablet' : 'phone'], [
    isCameraControlReady,
    isGteTablet,
  ])

  const [
    ,
    cameraSpringsApi,
  ] = useSpring<{
    cameraPosition: Vector3Tuple,
  }>({
    cameraPosition: startingCameraPosition,
    onChange: ({ value }) => {
      // We cannot do eg <Camera position={springs.cameraPosition} to directly update the camera,
      // so we use this onChange event to update `camera.position` every time the spring changes.
      camera.position.set(value.cameraPosition[0], value.cameraPosition[1], value.cameraPosition[2])

      // Unfortunately this is also firing when the user resizes the window, which resets the camera. Not the end of the world, but not ideal.
    },
  }, [
    camera.position,
    startingCameraPosition,
  ])

  const setCameraPosition = useCallback((
    position: Vector3Tuple,
    config: SpringConfig & { onEnd?: () => void } = {},
  ) => {
    const duration = config?.duration ?? 333

    cameraSpringsApi.start({
      cameraPosition: position,
      config: {
        ...config,
        duration,
      },
    })

    if (config.onEnd) {
      const timeout = setTimeout(() => {
        config.onEnd?.()
      }, duration)

      return () => clearTimeout(timeout)
    }

    return () => undefined
  }, [ cameraSpringsApi ])

  const flyCameraIn = useCallback(() => {
    const timeout = setTimeout(() => {
      setCameraPosition(isGteTablet ? CAMERA_POSITION_DEFAULT.tablet : CAMERA_POSITION_DEFAULT.phone, { onEnd: () => {
        // If this is the first fly-in after page load, indicate that we have completed it
        if (!isCameraControlReady) {
          setIsCameraControlReady(true)
        }
      } })
    }, 0)

    return () => clearTimeout(timeout)
  }, [
    isCameraControlReady,
    isGteTablet,
    setCameraPosition,
    setIsCameraControlReady,
  ])

  return useMemo(() => ({
    flyCameraIn,
    setCameraPosition,
  }), [
    flyCameraIn,
    setCameraPosition,
  ])
}
