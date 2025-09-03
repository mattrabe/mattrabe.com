import {
  useCallback,
  useMemo,
} from 'react'
import type { Vector3Tuple } from 'three'
import { useThree } from '@react-three/fiber'
import {
  useSpring,
  type SpringConfig,
} from '@react-spring/three'

import { useMediaQuery } from '@/hooks/useMediaQuery'

const CAMERA_POSITION_DEFAULT: Record<string, Vector3Tuple> = {
  phone: [ 0, 0, 2.5 ],
  tablet: [ 0, 0, 2.5 ],
}

export function useDefaultCameraPosition() {
  const { isGteTablet } = useMediaQuery()

  return CAMERA_POSITION_DEFAULT[isGteTablet ? 'tablet' : 'phone']
}

export function useCameraPosition() {
  const { camera } = useThree()

  const defaultCameraPosition = useDefaultCameraPosition()

  const [
    ,
    cameraSpringsApi,
  ] = useSpring<{
    cameraPosition: Vector3Tuple,
  }>({
    cameraPosition: defaultCameraPosition,
    onChange: ({ value }) => {
      // We cannot do eg <Camera position={springs.cameraPosition} to directly update the camera,
      // so we use this onChange event to update `camera.position` every time the spring changes.
      camera.position.set(value.cameraPosition[0], value.cameraPosition[1], value.cameraPosition[2])

      // Unfortunately this is also firing when the user resizes the window, which resets the camera. Not the end of the world, but not ideal.
    },
  }, [ defaultCameraPosition ])

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

  /*
  This function was causing problems, possibly related to the interplay between the canvas camera and the springs
  Disabling for now.
  const flyCameraIn = useCallback(() => {
    if (isCameraControlReady) {
      return
    }

    setCameraPosition(isGteTablet ? CAMERA_POSITION_DEFAULT.tablet : CAMERA_POSITION_DEFAULT.phone, { onEnd: () => {
      // Indicate that we have completed the initial fly-in in order it to enable camera controls
      setIsCameraControlReady(true)

      if (isBrainReadyRef) {
        isBrainReadyRef.current = true
      }
    } })
  }, [
    isBrainReadyRef,
    isCameraControlReady,
    isGteTablet,
    setCameraPosition,
    setIsCameraControlReady,
  ])
  */

  return useMemo(() => ({
    setCameraPosition,
  }), [
    setCameraPosition,
  ])
}
