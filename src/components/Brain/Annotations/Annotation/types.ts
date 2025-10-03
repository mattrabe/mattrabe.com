import type {
  Color,
  Vector3Tuple,
} from 'three'

export type AnnotationProps = {
  id?: string, // Defaults to label
  colors: {
    background?: Color,
    foreground?: Color,
    white: Color,
  },
  content?: React.ReactNode,
  fontSize?: number,
  expandedCameraPosition?: Vector3Tuple,
  expandedFontSize?: number,
  expandedPosition?: Vector3Tuple,
  expandedScale?: number,
  isAutoShow?: boolean, // Defaults to false
  label: string,
  position: Vector3Tuple,
  size?: number,
}
