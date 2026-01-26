import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedCubeProps {
  size?: number;
  className?: string;
}

export const AnimatedCube: React.FC<AnimatedCubeProps> = ({ size = 200, className = '' }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cubeRef.current || !containerRef.current) return;

    // Auto rotate animation
    gsap.to(cubeRef.current, {
      rotationY: 360,
      rotationX: 15,
      duration: 20,
      repeat: -1,
      ease: 'none'
    });

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !cubeRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cubeRef.current, {
        rotationY: x * 30,
        rotationX: -y * 30,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={`${className} perspective-1000`} style={{ perspective: '1000px' }}>
      <div
        ref={cubeRef}
        className="relative transform-3d"
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-100px)'
        }}
      >
        {/* Front face - Blue */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-300 flex items-center justify-center text-white font-black text-4xl shadow-2xl"
          style={{
            transform: 'rotateY(0deg) translateZ(100px)'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-50">
            <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-400"
          style={{
            transform: 'rotateY(180deg) translateZ(100px)'
          }}
        />

        {/* Right face - Blue gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400"
          style={{
            transform: 'rotateY(90deg) translateZ(100px)'
          }}
        />

        {/* Left face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-500"
          style={{
            transform: 'rotateY(-90deg) translateZ(100px)'
          }}
        />

        {/* Top face - Lighter */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-300"
          style={{
            transform: 'rotateX(90deg) translateZ(100px)'
          }}
        />

        {/* Bottom face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-950 border-2 border-blue-600"
          style={{
            transform: 'rotateX(-90deg) translateZ(100px)'
          }}
        />

        {/* Orange Frame */}
        <div
          className="absolute"
          style={{
            width: size * 1.4,
            height: size * 1.4,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) translateZ(-50px)',
            border: '8px solid',
            borderImage: 'linear-gradient(135deg, #FF9900, #FF7700) 1',
            borderRadius: '20px',
            opacity: 0.6
          }}
        />
      </div>
    </div>
  );
};
