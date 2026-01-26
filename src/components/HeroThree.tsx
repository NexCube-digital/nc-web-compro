import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'

// NEXCUBE 3D Logo
function NexCubeLogo() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Main Cube Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color="#FF9900"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
        
        {/* Inner Solid Cube */}
        <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial
            color="#0066FF"
            metalness={0.9}
            roughness={0.1}
            emissive="#0066FF"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Corner Spheres */}
        {[
          [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#FF9900" : "#0080FF"}
              metalness={0.8}
              roughness={0.2}
              emissive={i % 2 === 0 ? "#FF9900" : "#0080FF"}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </Float>
    </group>
  )
}

// Animated Rings
function AnimatedRings() {
  const ringsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.x += 0.003
      ringsRef.current.rotation.y += 0.005
    }
  })
  
  return (
    <group ref={ringsRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 4, i * Math.PI / 3, 0]}>
          <torusGeometry args={[3 + i * 0.5, 0.05, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? "#0066FF" : i === 1 ? "#0080FF" : "#FF9900"}
            transparent
            opacity={0.4}
            emissive={i === 0 ? "#0066FF" : i === 1 ? "#0080FF" : "#FF9900"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Scene with NEXCUBE
function HeroScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} color="#FF9900" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#0080FF" />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* NEXCUBE Logo */}
      <NexCubeLogo />
      
      {/* Animated Rings */}
      <AnimatedRings />
    </>
  )
}

// Main Component
export const HeroThree: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <HeroScene />
      </Canvas>
    </div>
  )
}

export default HeroThree
