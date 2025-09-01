'use client'

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  Color,
  Object3D,
} from 'three'
import type { GLTF } from 'three-stdlib'
import type {
  ObjectMap,
  ThreeEvent,
} from '@react-three/fiber'
import {
  OrbitControls,
  Stage,
  useGLTF,
  useProgress,
} from '@react-three/drei'

import { useCameraControls } from '@/components/Brain/hooks/useCameraControls'
import { useCameraPosition } from '@/components/Brain/hooks/useCameraPosition'

import { useBrain } from '@/components/Brain/hooks/useBrain'
import { useStyles } from '@/hooks/useStyles'

import { Annotations } from '../Annotations'
import { BrainLoader } from '../Loader'

import type { Node3D } from '../types'

const BRAIN_GLB_PATH = '/3d-models/brain_areas.glb'
//const BRAIN_GLB_PATH = '/3d-models/brain_areas-compressed.glb'

useGLTF.preload(BRAIN_GLB_PATH)

export function ThreeDBrain() {
  const progress = useProgress()

  const { setExpandedItemId } = useBrain()
  const { cameraControlsRef } = useCameraControls()

  const onClickBrain = useCallback(() => {
    // Clear the expanded item id when the brain is clicked
    setExpandedItemId(null)
  }, [ setExpandedItemId ])

  return (
    <Suspense
      fallback={(
        <BrainLoader
          state={progress}
          wrapperStyle={{ transform: 'translate(-50%, -50%)' }}
        />
      )}
    >
      <Stage
        adjustCamera={false}
        environment='sunset'
        intensity={1}
        preset='upfront'
        // shadows={false}
      >
        <BrainModel
          onClickBrain={onClickBrain}
        />
      </Stage>

      <Annotations />

      <OrbitControls
        ref={cameraControlsRef}
        makeDefault={true}

        autoRotate={false} // This will be set to `true` once the auto-open "Hello!" annotation is closed
        autoRotateSpeed={0.25}

        enableRotate={false} // This will be set to `true` once the auto-open "Hello!" annotation is closed
        dampingFactor={0.1}

        enableZoom={false}
      />
    </Suspense>
  )
}

function BrainModel({ onClickBrain }: { onClickBrain?: () => void }) {
  const brainGtlf = useGLTF(BRAIN_GLB_PATH)

  const { flyCameraIn } = useCameraPosition()

  const brainNodes = useBrainNodes(brainGtlf)

  const { BRAIN_TEXTURE_blinn2: material } = useMemo(() => brainGtlf.materials, [ brainGtlf.materials ])

  const { getColorVarThree } = useStyles()
  const colors = {
    highlight: getColorVarThree('--brain-red'),
  }

  const [
    selectedNode,
    setSelectedNode,
  ] = useState<string>()

  const onClickNode = useCallback((key: string) => (event: ThreeEvent<PointerEvent>) => {
    // Click events will propagate through all nodes that intersect the raycast.
    // We only want to select the first node, so stop propagation.
    event.stopPropagation()

//    setSelectedNode(key)
  }, [])

  // Make the camera fly in on load. Do this instead of using `Stage.adjustCamera`, so that we are always setting to Vector3Tuple explicitly
  useEffect(() => {
    flyCameraIn()
  }, [ flyCameraIn ])

  return (
    <group
      dispose={null}
      onClick={onClickBrain}
    >
      {Object.keys(brainNodes).map(key => (
        <mesh
          key={key}
          // castShadow={false}
          geometry={brainNodes[key].object3d.geometry}
          material={material}
          onClick={onClickNode(key)}
        >
          <meshStandardMaterial color={selectedNode === key ? colors.highlight : brainNodes[key].color} />
        </mesh>
      ))}
    </group>
  )
}

function useBrainNodes(gltf: GLTF & ObjectMap) {
  const { getColorVarThree } = useStyles()
  const colors = useMemo(() => ({
    dark: getColorVarThree('--brain-dark'),
    medium: getColorVarThree('--brain-medium'),
    light: getColorVarThree('--brain-light'),
  }), [ getColorVarThree ])

  return useMemo(() => {
    const brainRaw: Record<string, { color?: Color, object3d: Object3D }> = {
      pituitaryGland: {
        object3d: gltf.nodes.Brain_Part_01_BRAIN_TEXTURE_blinn2_0,
        color: colors.medium,
      },
      cerebellum: {
        object3d: gltf.nodes.Brain_Part_02_BRAIN_TEXTURE_blinn2_0,
        color: colors.dark,
      },
      corpusCallosum: {
        object3d: gltf.nodes.Brain_Part_03_BRAIN_TEXTURE_blinn2_0,
        color: colors.medium,
      },
      leftHemisphere: {
        object3d: gltf.nodes.Brain_Part_04_BRAIN_TEXTURE_blinn2_0,
        color: colors.light,
      },
      stem: {
        object3d: gltf.nodes.Brain_Part_05_BRAIN_TEXTURE_blinn2_0,
        color: colors.medium,
      },
      rightHemisphere: {
        object3d: gltf.nodes.Brain_Part_06_BRAIN_TEXTURE_blinn2_0,
        color: colors.light,
      },
    }

    // `.geometry` does not exist on the THREE.Object3D type, but it does exist in the nodes pulled out from the GLB
    // Map over the nodes here using the isNode3D type gaurd to apply the proper type while maintaining type safety
    const brain: Record<string, { color?: Color, object3d: Node3D }> = Object.entries(brainRaw)
      .reduce((acc: Record<string, { color?: Color, object3d: Node3D }>, [key, value]) => {
        if (isNode3D(value.object3d)) {
          acc[key] = {
            object3d: value.object3d,
            color: value.color,
          }
        }

        return acc
      }, {})

    return brain
  }, [
    colors,
    gltf,
  ])
}

function isNode3D(node: Object3D): node is Node3D {
  return 'geometry' in node
}
