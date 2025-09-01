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
  isAutoShow?: boolean, // Defaults to false
  label: string,
  position: Vector3Tuple,
  size?: number,
}
