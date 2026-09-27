import { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function KaraModel() {
  const { scene, animations } = useGLTF('/kara.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    // Plays the first animation found in your GLB file (idle/breathing)
    const firstAnimation = Object.keys(actions)[0]
    if (firstAnimation && actions[firstAnimation]) {
      actions[firstAnimation].play()
    }
  }, [actions])

  return (
  <primitive 
    object={scene} 
    // 1. Double the scale to zoom into the portrait
    scale={3.6} 
    // 2. Lower Y to push the body down so the head sits in the center
    // Coordinates: [Left/Right, Up/Down, Forward/Backward]
    position={[0, -5.9, 0]} 
  />
)
}

// Preload the asset to eliminate loading lag
useGLTF.preload('/kara.glb')