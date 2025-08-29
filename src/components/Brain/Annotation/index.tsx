import {
  useCallback,
  useRef,
  useState,
} from 'react'

import {
  CircleGeometry,
  RingGeometry,
  type Mesh,
} from 'three'
import {
  useFrame,
  type ThreeEvent,
} from '@react-three/fiber'
import { Text } from '@react-three/drei'
import {
  animated,
  useSpring,
} from '@react-spring/three'

import { DARK_GRAY } from '../colors'

import type { AnnotationProps } from './types'

const AnimatedText = animated(Text)

const scaleFactor = 12

export function Annotation({
  label,
  id = label,
  enableCameraControl,
  expandedItemIdRef,
  position: positionProp,
  setCameraPosition,
  size = 0.025,
}: AnnotationProps) {
  const circleRef = useRef<Mesh>(null)
  const detailsBoxRef = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<Mesh>(null)
  const textRef = useRef<Mesh>(null)

  const [
    color,
    setColor,
  ] = useState(DARK_GRAY)

  // Rotate the annotation when the camera rotates, so that it is always facing the camera
  useFrame(state => {
    circleRef.current?.rotation.set(state.camera.rotation.x, state.camera.rotation.y, state.camera.rotation.z)
    outlineRef.current?.rotation.set(state.camera.rotation.x, state.camera.rotation.y, state.camera.rotation.z)
  })

  const [
    springs,
    springsApi,
  ] = useSpring(() => ({
    cameraPosition: [ 0, 0, 2.5 ],
    numCircleSegmentsToRender: 36,
    scale: 1,
    textOpacity: 1,
    textPosition: [
      positionProp[0] + (0.0001 * (positionProp[0] < 0 ? -1 : 1)),
      positionProp[1] + (0.0001 * (positionProp[1] < 0 ? -1 : 1)),
      positionProp[2] + (0.0001 * (positionProp[2] < 0 ? -1 : 1)),
    ],
    config: () => {
      return {
        mass: 1,
        friction: 25,
        duration: 750,
      }
    },
    onStart: () => {
      setCameraPosition?.([
        positionProp[0],
        positionProp[1],
        2.5 * (positionProp[2] < 0 ? -1 : 1),
      ])

      enableCameraControl(!expandedItemIdRef.current)
    },
  }), [ positionProp ])

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()

    // Allow only one annotation to be expanded at a time
    if (expandedItemIdRef.current && expandedItemIdRef.current !== id) {
      return
    }

    expandedItemIdRef.current = expandedItemIdRef.current === id ? undefined : id

    if (detailsBoxRef?.current?.style) {
      detailsBoxRef.current.style.display = expandedItemIdRef.current ? 'block' : 'none'
    }

    springsApi.start({
      numCircleSegmentsToRender: expandedItemIdRef.current === id ? 36 : 36 * scaleFactor * Math.PI * 10,
      scale: expandedItemIdRef.current === id ? scaleFactor : 1,
      textOpacity: expandedItemIdRef.current === id ? 1 : 0,
      textPosition: expandedItemIdRef.current === id ? [ 0, 0, 1 ] : [ positionProp[0], positionProp[1], positionProp[2] + 0.0001 ],
    })
  }, [
    expandedItemIdRef,
    id,
    positionProp,
    springsApi,
  ])

  return (
    <>
      {/* outline circle */}
      <animated.mesh
        castShadow={false}
        geometry={new RingGeometry(size, size + 0.00075, 100, 100)}
        position={[ positionProp[0], positionProp[1], positionProp[2] - 0.0001 ]}
        ref={outlineRef}
        scale={springs.scale}
      >
        <meshStandardMaterial color={color} />
      </animated.mesh>

      {/* container circle */}
      <animated.mesh
        castShadow={false}
        geometry={new CircleGeometry(size, 100)}
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
        position={positionProp}
        ref={circleRef}
        scale={springs.scale}
      >
      <AnimatedText
        castShadow={false}
        position={[ 0, 0, 0 ]}
        anchorX='center'
        anchorY='middle'
        textAlign='center'
        fontSize={0.0125}
        ref={textRef}
      >
        {label}

        <meshStandardMaterial color={color} />
      </AnimatedText>

      </animated.mesh>
    </>
  )
}

export * from './types'
