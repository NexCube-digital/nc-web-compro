import { useEffect, useRef, useState } from 'react';

/**
 * Frame Optimization Hook
 * Optimizes animations to run at smooth 60fps
 */

interface FrameOptimizationOptions {
  targetFPS?: number;
  enableAdaptive?: boolean;
}

export const useFrameOptimization = (options: FrameOptimizationOptions = {}) => {
  const { targetFPS = 60, enableAdaptive = true } = options;
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    let animationFrameId: number;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Calculate actual FPS
      if (lastTimeRef.current) {
        const delta = currentTime - lastTimeRef.current;
        const currentFPS = 1000 / delta;
        fpsRef.current = currentFPS;
        
        // Update FPS state every 30 frames
        if (frameRef.current % 30 === 0) {
          setFps(Math.round(currentFPS));
        }
      }

      // Frame limiter untuk consistent performance
      const timeSinceLastFrame = currentTime - lastTimeRef.current;
      
      if (timeSinceLastFrame >= frameInterval) {
        lastTimeRef.current = currentTime - (timeSinceLastFrame % frameInterval);
        frameRef.current++;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetFPS]);

  return { fps, currentFrame: frameRef.current };
};

/**
 * Smooth Scroll Hook with requestAnimationFrame
 */
export const useSmoothScrollRAF = () => {
  const scrollingRef = useRef<boolean>(false);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);

  useEffect(() => {
    const smoothScroll = () => {
      if (scrollingRef.current) {
        const diff = targetScrollRef.current - currentScrollRef.current;
        const ease = 0.1; // Easing factor (0.1 = smooth, 1 = instant)

        if (Math.abs(diff) > 0.5) {
          currentScrollRef.current += diff * ease;
          window.scrollTo(0, currentScrollRef.current);
          requestAnimationFrame(smoothScroll);
        } else {
          currentScrollRef.current = targetScrollRef.current;
          window.scrollTo(0, currentScrollRef.current);
          scrollingRef.current = false;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!scrollingRef.current) {
        currentScrollRef.current = window.scrollY;
      }
      
      targetScrollRef.current = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          currentScrollRef.current + e.deltaY
        )
      );

      if (!scrollingRef.current) {
        scrollingRef.current = true;
        requestAnimationFrame(smoothScroll);
      }
    };

    // Uncomment to enable custom smooth scroll
    // window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      // window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const scrollTo = (target: number, duration: number = 1000) => {
    const start = window.scrollY;
    const distance = target - start;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, start + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return { scrollTo };
};

/**
 * Parallax Effect with requestAnimationFrame
 */
export const useParallaxRAF = (speed: number = 0.5) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateParallax = () => {
      if (elementRef.current) {
        const scrollY = window.scrollY;
        const offset = scrollY * speed;
        elementRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        animationFrameId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return elementRef;
};

/**
 * Intersection Observer with Frame Optimization
 */
export const useIntersectionRAF = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Use requestAnimationFrame untuk smooth callback
          requestAnimationFrame(() => {
            callback(entry.isIntersecting);
          });
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return elementRef;
};

/**
 * Counter Animation with requestAnimationFrame
 */
export const useCounterRAF = (
  end: number,
  duration: number = 2000,
  start: number = 0
) => {
  const [count, setCount] = useState<number>(start);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = (t: number): number => {
        return 1 - Math.pow(1 - t, 4);
      };

      const currentCount = start + (end - start) * easeOutQuart(progress);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, start]);

  return Math.round(count);
};

/**
 * Mouse Position Tracker with RAF
 */
export const useMouseRAF = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;
    let ticking = false;

    const updatePosition = () => {
      setPosition({ ...positionRef.current });
      ticking = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (!ticking) {
        animationFrameId = requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return position;
};

/**
 * Resize Observer with RAF
 */
export const useResizeRAF = (callback: (width: number, height: number) => void) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationFrameId: number;
    let ticking = false;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            callback(width, height);
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [callback]);

  return elementRef;
};

/**
 * Performance Monitor
 */
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    frameTime: 0,
  });

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let animationFrameId: number;

    const measurePerformance = (currentTime: number) => {
      frames++;
      const delta = currentTime - lastTime;

      // Update metrics every second
      if (delta >= 1000) {
        const fps = Math.round((frames * 1000) / delta);
        const frameTime = delta / frames;
        
        // @ts-ignore - performance.memory is not in all browsers
        const memory = performance.memory
          ? // @ts-ignore
            Math.round(performance.memory.usedJSHeapSize / 1048576)
          : 0;

        setMetrics({ fps, memory, frameTime });

        lastTime = currentTime;
        frames = 0;
      }

      animationFrameId = requestAnimationFrame(measurePerformance);
    };

    animationFrameId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return metrics;
};

export default {
  useFrameOptimization,
  useSmoothScrollRAF,
  useParallaxRAF,
  useIntersectionRAF,
  useCounterRAF,
  useMouseRAF,
  useResizeRAF,
  usePerformanceMonitor,
};
