import type {
  BufferGeometry,
  Object3D,
} from 'three'

export type Node3D = Object3D & {
  geometry: BufferGeometry,
}
