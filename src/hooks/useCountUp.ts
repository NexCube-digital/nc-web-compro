import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  enableScrollTrigger?: boolean;
}

export const useCountUp = (options: CountUpOptions) => {
  const {
    start = 0,
    end,
    duration = 2.5,
    decimals = 0,
    suffix = '',
    prefix = '',
    separator = ',',
    enableScrollTrigger = true
  } = options;

  const [count, setCount] = useState(start);
  const elementRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const obj = { value: start };
      
      gsap.to(obj, {
        value: end,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
          const value = obj.value;
          const formatted = decimals > 0 
            ? value.toFixed(decimals) 
            : Math.floor(value).toString();
          
          // Add separator for thousands
          const parts = formatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          
          setCount(parseFloat(parts.join('.')));
        }
      });
    };

    if (enableScrollTrigger) {
      ScrollTrigger.create({
        trigger: elementRef.current,
        start: 'top 80%',
        once: true,
        onEnter: animate
      });
    } else {
      animate();
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === elementRef.current) {
          trigger.kill();
        }
      });
    };
  }, [start, end, duration, decimals, separator, enableScrollTrigger]);

  const formattedValue = () => {
    const value = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${parts.join('.')}${suffix}`;
  };

  return { count, formattedValue, elementRef };
};

// Hook for progress bar animation
export const useProgressBar = (targetPercent: number, duration = 2) => {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      gsap.to({ value: 0 }, {
        value: targetPercent,
        duration: duration,
        ease: 'power2.out',
        onUpdate: function() {
          setProgress(this.targets()[0].value);
        }
      });
    };

    ScrollTrigger.create({
      trigger: elementRef.current,
      start: 'top 80%',
      once: true,
      onEnter: animate
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === elementRef.current) {
          trigger.kill();
        }
      });
    };
  }, [targetPercent, duration]);

  return { progress, elementRef };
};
