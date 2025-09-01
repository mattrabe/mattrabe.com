import type { RefObject } from 'react'
import type {
  Color,
  Vector3Tuple,
} from 'three'

export type AnnotationProps = {
  id?: string, // Defaults to label
  cameraPosition?: Vector3Tuple,
  colors: {
    background?: Color,
    foreground?: Color,
  },
  content?: React.ReactNode,
  contentPosition?: Vector3Tuple,
  fontSize?: number,
  expandedContentScale?: number,

  expandedItemIdRef: RefObject<string | undefined>,

  isAutoShow?: boolean, // Defaults to false
  label: string,
  position: Vector3Tuple,
  size?: number,
}
