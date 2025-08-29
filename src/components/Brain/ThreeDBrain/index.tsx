import {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'

import type {
  Event,
  Object3D,
  Vector3Tuple,
} from 'three'
import type {
  GLTF,
  OrbitControls as OrbitControlsType,
} from 'three-stdlib'
import {
  useThree,
  type ObjectMap,
  type ThreeEvent,
} from '@react-three/fiber'
import {
  OrbitControls,
  Stage,
  useGLTF,
  useProgress,
} from '@react-three/drei'
import {
  useSpring,
} from '@react-spring/three'

import { useMediaQuery } from '@/hooks/useMediaQuery'

import { DARK_GRAY } from '../colors'

import { Annotations } from '../Annotations'
import { Attribution } from '../Attribution'
import { BrainLoader } from '../Loader'

import type { Node3D } from '../types'

const HIGHLIGHT_COLOR = DARK_GRAY

const BRAIN_GLB_PATH = '/3d-models/brain_areas.glb'

useGLTF.preload(BRAIN_GLB_PATH)

export function ThreeDBrain({
  expandedItemIdRef,
  onClickBrain,
}: {
  expandedItemIdRef: RefObject<string | undefined>,
  onClickBrain?: () => void,
}) {
  const orbitControlsRef = useRef<OrbitControlsType>(null)

  const progress = useProgress()

  const { isDesktop } = useMediaQuery()

  const { camera } = useThree()

  const [
    springs,
    springsApi,
  ] = useSpring<{
    cameraPosition: Vector3Tuple,

  }>({
    cameraPosition: [ 0, 0, 5 ],
    onChange: ({ value }) => {
      camera.position.set(value.cameraPosition[0], value.cameraPosition[1], value.cameraPosition[2])
    },
  }, [])

  const onAfterOrbitControlsChange = useCallback((event?: Event<string, unknown>) => {
    console.log('onAfterOrbitControlsChange', event, camera.position.toArray())

    springsApi.start({
      cameraPosition: camera.position.toArray(),
      config: { duration: 0 },
    })
  }, [
    camera.position,
    springsApi,
  ])

  const setCameraPosition = useCallback((position: Vector3Tuple = [ 0, 0, 0 ]) => {
    springsApi.start({
      cameraPosition: position,
      config: { duration: 1000 },
    })
  }, [ springsApi ])

  const enableCameraControl = useCallback((enabled: boolean) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enableRotate = enabled
    }
  }, [])

  return (
    <Suspense fallback={<BrainLoader state={progress} wrapperStyle={{ transform: 'translate(-50%, -50%)' }} />}>
      <Stage
        adjustCamera={isDesktop ? 1.25 : 1.1}
        environment='sunset'
        intensity={1}
        preset='upfront'
      >
        <BrainModel onClickBrain={onClickBrain} />

        <Attribution />
      </Stage>

      <Annotations
        expandedItemIdRef={expandedItemIdRef}
        enableCameraControl={enableCameraControl}
        setCameraPosition={setCameraPosition}
      />

      <OrbitControls
        ref={orbitControlsRef}
        makeDefault={true}
        autoRotate={false}
        autoRotateSpeed={0.5}

        enableRotate={true}
        dampingFactor={0.1}

        enableZoom={false}

        onEnd={onAfterOrbitControlsChange}
      />
    </Suspense>
  )
}

function BrainModel({ onClickBrain }: { onClickBrain?: () => void}) {
  const brainGtlf = useGLTF(BRAIN_GLB_PATH)

  const brainNodes = useMemo(() => getBrainNodes(brainGtlf), [ brainGtlf ])

  const { BRAIN_TEXTURE_blinn2: material } = useMemo(() => brainGtlf.materials, [ brainGtlf.materials ])

  const [
    selectedNode,
    setSelectedNode,
  ] = useState<string>()

  const onClickNode = useCallback((key: string) => (event: ThreeEvent<PointerEvent>) => {
    // Click events will propagate through all nodes that intersect the raycast.
    // We only want to select the first node, so stop propagation.
    event.stopPropagation()

    setSelectedNode(key)
  }, [ setSelectedNode ])

  return (
    <group
      dispose={null}
      onClick={onClickBrain}
      scale={[1, 1, 1]}
    >
      {Object.keys(brainNodes).map(key => (
        <mesh
          key={key}
          geometry={brainNodes[key].geometry}
          material={material}
          onClick={onClickNode(key)}
        >
          {selectedNode === key && <meshStandardMaterial color={HIGHLIGHT_COLOR} />}
        </mesh>
      ))}
    </group>
  )
}

function getBrainNodes(gltf: GLTF & ObjectMap) {
  return (() => {
    const brainRaw: Record<string, Object3D> = {
      pituitaryGland: gltf.nodes.Brain_Part_01_BRAIN_TEXTURE_blinn2_0,
      cerebellum: gltf.nodes.Brain_Part_02_BRAIN_TEXTURE_blinn2_0,
      corpusCallosum: gltf.nodes.Brain_Part_03_BRAIN_TEXTURE_blinn2_0,
      leftHemisphere: gltf.nodes.Brain_Part_04_BRAIN_TEXTURE_blinn2_0,
      stem: gltf.nodes.Brain_Part_05_BRAIN_TEXTURE_blinn2_0,
      rightHemisphere: gltf.nodes.Brain_Part_06_BRAIN_TEXTURE_blinn2_0,
    }

    // `.geometry` does not exist on the THREE.Object3D type, but it does exist in the nodes pulled out from the GLB
    // Map over the nodes here using the isNode3D type gaurd to apply the proper type while maintaining type safety
    const brain: Record<string, Node3D> = Object.entries(brainRaw)
      .reduce((acc: Record<string, Node3D>, [key, value]) => {
        if (isNode3D(value)) {
          acc[key] = value
        }

        return acc
      }, {})

    return brain
  })()
}

function isNode3D(node: Object3D): node is Node3D {
  return 'geometry' in node
}
