import {
  createContext,
  useRef,
  useState,
  type RefObject,
} from 'react'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'

import type { CameraControlsRefProviderProps } from './types'

export const CameraControlsRefContext = createContext<{
  cameraControlsRef: RefObject<OrbitControlsType | null> | null,
  isCameraControlReady: boolean,
  setIsCameraControlReady: (isCameraControlReady: boolean) => void,
}>({
  cameraControlsRef: null,
  isCameraControlReady: false,
  setIsCameraControlReady: () => {},
})

export const CameraControlsRefProvider = ({ children }: CameraControlsRefProviderProps) => {
  const cameraControlsRef = useRef<OrbitControlsType | null>(null)

  const [
    isCameraControlReady,
    setIsCameraControlReady,
  ] = useState(false)

  return (
    <CameraControlsRefContext.Provider
      value={{
        cameraControlsRef,
        isCameraControlReady,
        setIsCameraControlReady,
      }}
    >
      {children}
    </CameraControlsRefContext.Provider>
  )
}
