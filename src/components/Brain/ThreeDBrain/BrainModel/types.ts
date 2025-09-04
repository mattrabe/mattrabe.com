import type {
  BufferGeometry,
  Color,
  Object3D,
} from 'three'

export type BrainNode = {
  color?: Color,
  isTransitionMaterial?: boolean,
  object3d: Node3D,
}

export type Node3D = Object3D & {
  geometry: BufferGeometry,
}
