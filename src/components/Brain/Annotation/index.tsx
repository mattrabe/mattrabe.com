'use client'

import {
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  Color,
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
import {
  Text,
  useTexture,
} from '@react-three/drei'
import {
  animated,
  useSpring,
  type SpringValue,
} from '@react-spring/three'

import { useBrain } from '@/components/Brain/hooks/useBrain'
import { useCameraControls } from '@/components/Brain/hooks/useCameraControls'
import { useCameraPosition } from '@/components/Brain/hooks/useCameraPosition'

import type { AnnotationProps } from './types'

const AnimatedText = animated(Text)

export function Annotation({
  label,
  id = label,
  colors,
  content,
  expandedScale = 12,
  fontSize = 0.02,
  expandedFontSize = fontSize,
  isAutoShow = false,
  position: positionProp,
  expandedPosition = positionProp,
  expandedCameraPosition = [
    (Math.max(expandedPosition[0], expandedPosition[1], expandedPosition[2]) === expandedPosition[0]) ? (expandedPosition[0] + (1.5 * (expandedPosition[0] < 0 ? -1 : 1))) : (1.5 * expandedPosition[0]),
    (Math.max(expandedPosition[0], expandedPosition[1], expandedPosition[2]) === expandedPosition[1]) ? (expandedPosition[1] + (1.5 * (expandedPosition[1] < 0 ? -1 : 1))) : (1.5 * expandedPosition[1]),
    (Math.max(expandedPosition[0], expandedPosition[1], expandedPosition[2]) === expandedPosition[2]) ? (expandedPosition[2] + (1.5 * (expandedPosition[2] < 0 ? -1 : 1))) : (1.5 * expandedPosition[2]),
  ],
  size = 0.025,
}: AnnotationProps) {
  const circleRef = useRef<Mesh>(null)
  const outlineRef = useRef<Mesh>(null)
  const labelMaterialRef = useRef<MeshStandardMaterial>(null)
  const contentMaterialRef = useRef<MeshStandardMaterial>(null)
  const previousCameraPositionRef = useRef<Vector3Tuple>([ 0, 0, 2.5 ])

  const { setCameraControls } = useCameraControls()

  const { setCameraPosition } = useCameraPosition()

  useFrame((state) => {
    // Rotate the annotation when the camera rotates, so that it is always facing the camera
    if (circleRef.current && outlineRef.current) {
      const x = state.camera.rotation.x
      const y = state.camera.rotation.y
      const z = state.camera.rotation.z

      circleRef.current.rotation.set(x, y, z)
      outlineRef.current.rotation.set(x, y, z)
    }

    // Update the opacity of the label and content materials based on springs
    if (labelMaterialRef.current) {
      labelMaterialRef.current.opacity = springs.labelOpacity.get()
    }
    if (contentMaterialRef.current) {
      contentMaterialRef.current.opacity = springs.contentOpacity.get()
    }
  })

  const { camera } = useThree()

  const {
    expandedItemIdRef,
    hasWelcomeBeenShown,
    setHasWelcomeBeenShown,
  } = useBrain()

  const [
    springs,
    springsApi,
  ] = useSpring(() => ({
    cameraPosition: camera.position.toArray(),
    scale: 1,
    circlePosition: positionProp,
    ringPosition: [ positionProp[0], positionProp[1], positionProp[2] - 0.0001 ],
    labelOpacity: 1,
    contentOpacity: 0,
    config: {
      mass: 1,
      friction: 25,
      duration: 333,
    },
  }), [])

  // Open this annotation
  const openAnnotation = useCallback(async () => {
    if (!expandedItemIdRef) {
      return
    }

    // Set the expanded item id to the id of this annotation
    expandedItemIdRef.current = id

    // Disable camera rotation
    setCameraControls({
      autoRotateEnabled: false,
      dragToRotateEnabled: false,
    })

    // Stash the current camera position so that we can return the camera to this position when this annotation is closed
    previousCameraPositionRef.current = camera.position.toArray()

    // Update the spring to the current position, so that the antimation starting point is where the cameria is right now
    await new Promise(resolve => setCameraPosition?.(camera.position.toArray(), {
      duration: 0,
      onEnd: () => resolve(undefined),
    }))

    // Wait a bit for springs to settle
    await new Promise(resolve => setTimeout(resolve, 100))

    springsApi.start({
      scale: expandedScale,
      circlePosition: expandedPosition,
      ringPosition: [ expandedPosition[0], expandedPosition[1], expandedPosition[2] - 0.0001 ],
      labelOpacity: 0, // This value is applied to the mesh via useFrame()
      contentOpacity: 1, // This value is applied to the mesh via useFrame()
    })

    // Move the camera to the annotation position
    setCameraPosition?.(expandedCameraPosition)
  }, [
    camera.position,
    expandedCameraPosition,
    expandedItemIdRef,
    expandedPosition,
    expandedScale,
    id,
    setCameraControls,
    setCameraPosition,
    springsApi,
  ])

  // Close this annotation
  const closeAnnotation = useCallback(async () => {
    if (!expandedItemIdRef) {
      return
    }

    // Set the expanded item id to null
    expandedItemIdRef.current = null

    springsApi.start({
      scale: 1,
      circlePosition: positionProp,
      ringPosition: [ positionProp[0], positionProp[1], positionProp[2] - 0.0001 ],
      labelOpacity: 1, // This value is applied to the mesh via useFrame()
      contentOpacity: 0, // This value is applied to the mesh via useFrame()
    })

    // Move the camera back to the previous position
    setCameraPosition?.(previousCameraPositionRef.current, {
      onEnd: () => {
        // Re-enable camera rotation
        setCameraControls({
          autoRotateEnabled: true,
          dragToRotateEnabled: true,
        })
      },
    })
  }, [
    expandedItemIdRef,
    positionProp,
    setCameraControls,
    setCameraPosition,
    springsApi,
  ])

  const handleClick = useCallback(async (event: ThreeEvent<MouseEvent>) => {
    // Don't fire click events on any layers that might be below this annotation
    event?.stopPropagation()

    if (!expandedItemIdRef) {
      return
    }

    // If this annotation cannot be opened, don't do anything
    if (!content) {
      return
    }

    // Allow only one annotation to be expanded at a time
    if (expandedItemIdRef.current && expandedItemIdRef.current !== id) {
      return
    }

    if (expandedItemIdRef.current === id) {
      closeAnnotation()
    }
    else {
      openAnnotation()
    }
  }, [
    content,
    closeAnnotation,
    expandedItemIdRef,
    id,
    openAnnotation,
  ])

  // Open this annotation automatically if it isAutoShow
  useEffect(() => {
    if (!isAutoShow) {
      return
    }

    if (hasWelcomeBeenShown()) {
      return
    }

    const timeout = setTimeout(() => {
      // Show the welcome annotation
      openAnnotation()

      // Set the welcome shown flag to true
      setHasWelcomeBeenShown(true)
    }, 1000)

    return () => clearTimeout(timeout)
  })

  const annotationTexture = useTexture('/3D/textures/annotationTexture.jpg')

  if (!colors?.background || !colors?.foreground) {
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
        <meshStandardMaterial
          metalness={100} // reflect a lot, makes a shiny ring
        />
      </animated.mesh>

      {/* container circle */}
      <animated.mesh
        castShadow={false}
        geometry={new CircleGeometry(size, 100)}
        onClick={handleClick}
        onPointerOver={!!content ? () => document.body.style.cursor = 'pointer' : undefined}
        onPointerOut={!!content ? () => document.body.style.cursor = 'default' : undefined}
        position={springs.circlePosition}
        ref={circleRef}
        scale={springs.scale}
      >
        <meshStandardMaterial
          color={colors.background}
          map={annotationTexture}
          metalness={1.35}
          // roughness={0} // Makes the surface completely mirror reflective, which reflects back the stage background producing a cool effect. Problem is that when you expand an annotation the user then sees the pixelated background enlarged
        />

        <AnimatedText
          castShadow={false}
          position={[ 0, 0, 0.0001 ]}
          anchorX='center'
          anchorY='middle'
          textAlign='center'
          fontSize={fontSize}
          outlineWidth={0.0025}
          outlineBlur={0.003125}
          outlineColor={new Color(2.55, 2.25, 2.25)}
        >
          {label}

          <meshStandardMaterial
            ref={labelMaterialRef}
            color={colors.foreground}
            transparent={true}
          />
        </AnimatedText>
        <AnimatedText
          castShadow={false}
          position={[ 0, 0, 0.001 ]}
          anchorX='center'
          anchorY='middle'
          textAlign='center'
          fontSize={expandedFontSize / expandedScale * 2}
          outlineWidth={0.00025}
          outlineBlur={0.003125}
          outlineColor={new Color(2.55, 2.25, 2.25)}
        >
          {content}

          <meshStandardMaterial
            ref={contentMaterialRef}
            color={colors.foreground}
            transparent={true}
          />
        </AnimatedText>
      </animated.mesh>
    </>
  )
}

export * from './types'
