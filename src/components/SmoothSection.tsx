import React, { useRef, useEffect, useState } from 'react';
import { useIntersectionRAF } from '../hooks/useFrameOptimization';

interface SmoothSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  delay?: number;
}

/**
 * Smooth Section Component with RAF-optimized animations
 * Provides user-friendly frame-by-frame animations
 */
export const SmoothSection: React.FC<SmoothSectionProps> = ({
  children,
  className = '',
  animationType = 'fade',
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useIntersectionRAF(
    (intersecting) => {
      if (intersecting && !hasAnimated) {
        setTimeout(() => {
          setIsVisible(true);
          setHasAnimated(true);
        }, delay);
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
  );

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    if (animationType === 'none') return className;

    if (!isVisible) {
      switch (animationType) {
        case 'fade':
          return `${baseClasses} opacity-0 ${className}`;
        case 'slide-up':
          return `${baseClasses} opacity-0 translate-y-10 ${className}`;
        case 'slide-down':
          return `${baseClasses} opacity-0 -translate-y-10 ${className}`;
        case 'scale':
          return `${baseClasses} opacity-0 scale-95 ${className}`;
        default:
          return `${baseClasses} opacity-0 ${className}`;
      }
    }

    return `${baseClasses} opacity-100 translate-y-0 scale-100 ${className}`;
  };

  return (
    <div ref={sectionRef as React.RefObject<HTMLDivElement>} className={getAnimationClasses()}>
      {children}
    </div>
  );
};

/**
 * Smooth Grid Component with staggered animations
 */
interface SmoothGridProps {
  children: React.ReactNode[];
  className?: string;
  cols?: number;
  gap?: number;
  staggerDelay?: number;
}

export const SmoothGrid: React.FC<SmoothGridProps> = ({
  children,
  className = '',
  cols = 3,
  gap = 6,
  staggerDelay = 100,
}) => {
  return (
    <div className={`grid md:grid-cols-${cols} gap-${gap} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <SmoothSection
          animationType="slide-up"
          delay={index * staggerDelay}
        >
          {child}
        </SmoothSection>
      ))}
    </div>
  );
};

/**
 * Smooth Card Component with hover effects
 */
interface SmoothCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
}

export const SmoothCard: React.FC<SmoothCardProps> = ({
  children,
  className = '',
  gradient = 'from-blue-500 to-cyan-500',
  hover = true,
}) => {
  return (
    <div
      className={`
        relative backdrop-blur-xl bg-white/80 rounded-3xl p-6 md:p-8
        border border-white/50 shadow-lg
        transition-all duration-300 ease-out
        ${hover ? 'hover:bg-white/95 hover:shadow-2xl hover:-translate-y-2 hover:scale-105' : ''}
        ${className}
      `}
      style={{ willChange: 'transform, opacity' }}
    >
      {hover && (
        <>
          {/* Gradient Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
          />
          
          {/* Glow Effect */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur opacity-0 hover:opacity-30 transition-opacity duration-500`}
          />
        </>
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SmoothSection;
