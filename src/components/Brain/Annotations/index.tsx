import { type RefObject } from 'react'

import { type Vector3Tuple } from 'three'

import { Annotation } from '../Annotation'

import { annotations } from './annotations'

export function Annotations({
  expandedItemIdRef,
  enableCameraControl,
  setCameraPosition,
}: {
  expandedItemIdRef: RefObject<string | undefined>,
  enableCameraControl: (enabled: boolean) => void,
  setCameraPosition?: (position?: Vector3Tuple) => void,
}) {
  return annotations.map((annotation) => (
    <Annotation
      key={annotation.label}
      {...annotation}
      expandedItemIdRef={expandedItemIdRef}
      enableCameraControl={enableCameraControl}
      setCameraPosition={setCameraPosition}
    />
  ))
}
