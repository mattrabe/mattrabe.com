'use client'

import {
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  CircleGeometry,
  RingGeometry,
  type Mesh,
  type MeshStandardMaterial,
  type Vector3Tuple,
} from 'three'
import {
  useFrame,
  useThree,
  type ThreeEvent,
} from '@react-three/fiber'
import { Text } from '@react-three/drei'
import {
  animated,
  useSpring,
  type SpringValue,
} from '@react-spring/three'

import { useCameraControls } from '@/components/Brain/hooks/useCameraControls'
import { useCameraPosition } from '@/components/Brain/hooks/useCameraPosition'

import type { AnnotationProps } from './types'

const AnimatedText = animated(Text)

export function Annotation({
  label,
  id = label,
  colors,
  content,
  expandedContentScale = 12,
  expandedItemIdRef,
  fontSize = 0.0125,
  isAutoShow = false,
  position: positionProp,
  cameraPosition = [
    positionProp[0],
    positionProp[1],
    2.5 * (positionProp[2] < 0 ? -1 : 1),
  ],
  contentPosition = positionProp,
  size = 0.025,
}: AnnotationProps) {
  const circleRef = useRef<Mesh>(null)
  const outlineRef = useRef<Mesh>(null)
  const labelMaterialRef = useRef<MeshStandardMaterial>(null)
  const contentMaterialRef = useRef<MeshStandardMaterial>(null)
  const previousCameraPositionRef = useRef<Vector3Tuple>([ 0, 0, 2.5 ])

  const { setCameraControls } = useCameraControls()

  const { setCameraPosition } = useCameraPosition()

  // Rotate the annotation when the camera rotates, so that it is always facing the camera
  useFrame((state) => {
    circleRef.current?.rotation.set(state.camera.rotation.x, state.camera.rotation.y, state.camera.rotation.z)
    outlineRef.current?.rotation.set(state.camera.rotation.x, state.camera.rotation.y, state.camera.rotation.z)

    if (labelMaterialRef.current) {
      labelMaterialRef.current.opacity = springs.labelOpacity.get()
    }
    if (contentMaterialRef.current) {
      contentMaterialRef.current.opacity = springs.contentOpacity.get()
    }
  })

  const { camera } = useThree()

  const [
    springs,
    springsApi,
  ] = useSpring(() => ({
    cameraPosition: camera.position.toArray(),
    numCircleSegmentsToRender: 36,
    scale: 1,
    textOpacity: 1,
    circlePosition: positionProp,
    ringPosition: [ positionProp[0], positionProp[1], positionProp[2] - 0.0001 ],
    labelOpacity: 1,
    contentOpacity: 0,
    config: {
      mass: 1,
      friction: 25,
      duration: 333,
    },
    onStart: async () => {
      if (expandedItemIdRef.current === id) {
        // Update the spring to the current position, so that the antimation starting point is where the cameria is right now
        await new Promise(resolve => setCameraPosition?.(camera.position.toArray(), {
          duration: 0,
          onEnd: () => resolve(undefined),
        }))

        // Wait a bit for spring stuff to settle
        await new Promise(resolve => setTimeout(resolve, 100))

        // Move the camera to the annotation position
        setCameraControls({
          autoRotateEnabled: false,
          dragToRotateEnabled: false,
        })

        setCameraPosition?.(cameraPosition, {
          onEnd: () => {
          },
        })
      }
      else {
        // Move the camera back to the previous position
        setCameraPosition?.(previousCameraPositionRef.current, {
          onEnd: () => {
            setCameraControls({
              autoRotateEnabled: true,
              dragToRotateEnabled: true,
            })
          },
        })
      }
    },
  }), [])

  const handleClick = useCallback(async (event?: ThreeEvent<MouseEvent>) => {
    // Don't fire click events on any layers that might be below this annotation
    event?.stopPropagation()

    // Allow only one annotation to be expanded at a time
    if (expandedItemIdRef.current && expandedItemIdRef.current !== id) {
      return
    }

    // Set the expanded item id to the id of the annotation that was clicked
    expandedItemIdRef.current = expandedItemIdRef.current === id ? undefined : id

    // Set the previous camera position to the current camera position
    if (expandedItemIdRef.current) {
      previousCameraPositionRef.current = camera.position.toArray()
    }

    springsApi.start({
      numCircleSegmentsToRender: expandedItemIdRef.current === id ? 36 : 36 * expandedContentScale * Math.PI * 10,
      scale: expandedItemIdRef.current === id ? expandedContentScale : 1,
      textOpacity: expandedItemIdRef.current === id ? 1 : 0,
      labelOpacity: expandedItemIdRef.current === id ? 0 : 1,
      contentOpacity: expandedItemIdRef.current === id ? 1 : 0,
      circlePosition: expandedItemIdRef.current === id ? contentPosition : positionProp,
      ringPosition: expandedItemIdRef.current === id ? [ contentPosition[0], contentPosition[1], contentPosition[2] - 0.0001 ] : [ positionProp[0], positionProp[1], positionProp[2] - 0.0001 ],
    })
  }, [
    expandedItemIdRef,
    id,
    positionProp,
    springsApi,
    contentPosition,
    camera.position,
    expandedContentScale
  ])

  // Open this annotation automatically if it isAutoShow
  useEffect(() => {
    if (!isAutoShow) {
      return
    }

    setTimeout(() => {
      handleClick()
    }, 1500)
  }, [
    handleClick,
    isAutoShow,
    setCameraControls,
  ])

  if (!colors.foreground) {
    return null
  }

  return (
    <>
      {/* outline circle */}
      <animated.mesh
        castShadow={false}
        geometry={new RingGeometry(size, size + 0.00075, 100, 100)}
        position={springs.ringPosition as unknown as SpringValue<Vector3Tuple>}
        ref={outlineRef}
        scale={springs.scale}
      >
        <meshStandardMaterial color={colors.foreground} />
      </animated.mesh>

      {/* container circle */}
      <animated.mesh
        castShadow={false}
        geometry={new CircleGeometry(size, 100)}
        onClick={handleClick}
        position={springs.circlePosition}
        ref={circleRef}
        scale={springs.scale}
      >
        <meshStandardMaterial
          color={colors.background}
        />

        <AnimatedText
          castShadow={false}
            position={[ 0, 0, 0 ]}
          anchorX='center'
          anchorY='middle'
          textAlign='center'
          fontSize={fontSize}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          {label}

          <meshStandardMaterial
            ref={labelMaterialRef}
            color={colors.foreground}
            opacity={springs.labelOpacity.get()}
            transparent={true}
          />
        </AnimatedText>
        <AnimatedText
          castShadow={false}
          position={[ 0, 0, 0 ]}
          anchorX='center'
          anchorY='middle'
          textAlign='center'
          fontSize={fontSize / expandedContentScale * 2}
          maxWidth={0.5}
        >
          {content}

          <meshStandardMaterial
            ref={contentMaterialRef}
            color={colors.foreground}
            opacity={springs.contentOpacity.get()}
            transparent={true}
          />
        </AnimatedText>
      </animated.mesh>
    </>
  )
}

export * from './types'
