import type { RefObject } from 'react'
import type { Vector3Tuple } from 'three'

export type AnnotationProps = {
  label: string,
  id?: string,
  enableCameraControl: (enabled: boolean) => void,
  expandedItemIdRef: RefObject<string | undefined>,
  position: Vector3Tuple,
  setCameraPosition?: (position?: Vector3Tuple) => void,
  size?: number,
}