import { useMemo } from 'react'
import type { Object3D } from 'three'
import type { GLTF } from 'three-stdlib'
import type { ObjectMap } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  useGLTF,
} from '@react-three/drei'

import { useStyles } from '@/hooks/useStyles'

import type {
  BrainNode,
  Node3D,
} from './types'

const BRAIN_GLB_PATH = '/3D/models/brain_areas.glb'
//const BRAIN_GLB_PATH = '/3D/models/brain_areas-compressed.glb'

useGLTF.preload(BRAIN_GLB_PATH)

export function BrainModel({ onClickBrain }: { onClickBrain?: () => void }) {
  const brainGtlf = useGLTF(BRAIN_GLB_PATH)

  const brainNodes = useBrainNodes(brainGtlf)

  const { BRAIN_TEXTURE_blinn2: material } = useMemo(() => brainGtlf.materials, [ brainGtlf.materials ])

  /*
  // Make the camera fly in on load. Do this instead of using `Stage.adjustCamera`, so that we are always setting to Vector3Tuple explicitly
  useEffect(() => {
    const timeout = setTimeout(() => {
      flyCameraIn()
    }, 500)

    return () => clearTimeout(timeout)
  }, [ flyCameraIn ])
  */

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
        >
          {(brainNodes[key].isTransitionMaterial && (
            <MeshTransmissionMaterial
              color={brainNodes[key].color}
              // background={brainNodes[key].color}
              chromaticAberration={0} // default 0.3
              anisotropy={0} // default is 0.1
              distortionScale={0} // default is 0.5
              temporalDistortion={0} // default is 0
              transmissionSampler={false} // default is false
            />
          )) || <meshStandardMaterial color={brainNodes[key].color} />}
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
    const brainRaw: Record<string, Omit<BrainNode, 'object3d'> & { object3d: Object3D }> = {
      pituitaryGland: {
        color: colors.medium,
        object3d: gltf.nodes.Brain_Part_01_BRAIN_TEXTURE_blinn2_0,
      },
      cerebellum: {
        color: colors.dark,
        object3d: gltf.nodes.Brain_Part_02_BRAIN_TEXTURE_blinn2_0,
      },
      corpusCallosum: {
        color: colors.medium,
        object3d: gltf.nodes.Brain_Part_03_BRAIN_TEXTURE_blinn2_0,
      },
      leftHemisphere: {
        color: colors.light,
        isTransitionMaterial: true,
        object3d: gltf.nodes.Brain_Part_04_BRAIN_TEXTURE_blinn2_0,
      },
      stem: {
        color: colors.medium,
        object3d: gltf.nodes.Brain_Part_05_BRAIN_TEXTURE_blinn2_0,
      },
      rightHemisphere: {
        color: colors.light,
        isTransitionMaterial: true,
        object3d: gltf.nodes.Brain_Part_06_BRAIN_TEXTURE_blinn2_0,
      },
    }

    // `.geometry` does not exist on the THREE.Object3D type, but it does exist in the nodes pulled out from the GLB
    // Map over the nodes here using the isNode3D type gaurd to apply the proper type while maintaining type safety
    const brain: Record<string, BrainNode> = Object.entries(brainRaw)
      .reduce((acc: Record<string, BrainNode>, [key, value]) => {
        if (isNode3D(value.object3d)) {
          acc[key] = {
            color: value.color,
            isTransitionMaterial: value.isTransitionMaterial,
            object3d: value.object3d,
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
