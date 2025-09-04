'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  Color,
  CircleGeometry,
  RingGeometry,
  type Mesh,
  type MeshStandardMaterial,
  type ShaderMaterial,
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
  const annotationShaderMaterialRef = useRef<ShaderMaterial>(null)
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

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
  `

  const fragmentShader = `
    uniform float u_time;
    uniform vec3 u_bg;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;

    varying vec2 vUv;

    //
    // Description : Array and textureless GLSL 2D simplex noise function.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //

    // https://github.com/hughsk/glsl-noise/blob/master/simplex/2d.glsl

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec2 mod289(vec2 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec3 permute(vec3 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    float snoise(vec2 v)
      {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
    // First corner
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
      vec2 i1;
      //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
      //i1.y = 1.0 - i1.x;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      // x0 = x0 - 0.0 + 0.0 * C.xx ;
      // x1 = x0 - i1 + 1.0 * C.xx ;
      // x2 = x0 - 1.0 + 2.0 * C.xx ;
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

    // Permutations
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    // End of Simplex Noise Code


    void main() {
      vec3 color = u_bg;

      float noise1 = snoise(vUv + (u_time * 0.05));
      float noise2 = snoise(vUv + (u_time * 0.05));

      color = mix(color, u_colorA, noise1);
      color = mix(color, u_colorB, noise2);

      gl_FragColor = vec4(color ,1.0);
    }
  `

  const uniforms = useMemo(() => ({
    u_time: {
      value: 0.0,
    },
    u_bg: {
      value: new Color('#faf9f9'),
    },
    u_colorA: {
      value: new Color('#efecec'),
    },
    u_colorB: {
      value: new Color('#fffafa'),
    },
  }), [])

  useFrame((state) => {
    if (!annotationShaderMaterialRef.current) {
      return
    }

    const { clock } = state;

    annotationShaderMaterialRef.current.uniforms.u_time.value = clock.getElapsedTime();
  })

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
        <shaderMaterial
          ref={annotationShaderMaterialRef}
          uniforms={uniforms}
          wireframe={false}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
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
