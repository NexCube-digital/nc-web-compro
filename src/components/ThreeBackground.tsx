import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Animated 3D Cube Component
function AnimatedCube({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001 * speed
      meshRef.current.rotation.y += 0.002 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2
    }
  })
  
  return (
    <Float speed={1.5 * speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

// Animated Sphere with Distortion
function AnimatedSphere({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <Sphere args={[0.6, 64, 64]} position={position}>
        <MeshDistortMaterial 
          color={color}
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

// Particle Field
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 10
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#0066FF" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main Scene Component
function Scene() {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      
      {/* Directional Light */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#FF9900" />
      
      {/* Point Lights for glow effect */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#0066FF" />
      <pointLight position={[5, 0, 0]} intensity={0.5} color="#FF9900" />
      
      {/* NEXCUBE 3D Elements */}
      <AnimatedCube position={[-3, 2, -2]} color="#0066FF" speed={0.8} />
      <AnimatedCube position={[3, -1, -3]} color="#FF9900" speed={1.2} />
      <AnimatedCube position={[0, 1, -1]} color="#0080FF" speed={1} />
      
      <AnimatedSphere position={[-2, -2, -2]} color="#0052CC" />
      <AnimatedSphere position={[2, 2, -3]} color="#FF7700" />
      
      {/* Particle Field */}
      <ParticleField />
    </>
  )
}

// Main Component
export const ThreeBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
        performance={{ min: 0.5 }} // Auto performance adjustment
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
