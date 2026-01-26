import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Initial state
      gsap.set(ref.current, {
        opacity: 0,
        y: 20
      })

      // Animate in
      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: 'power2.out'
      })
    }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const children = ref.current.children as HTMLCollection

      // Set initial state
      gsap.set(children, {
        opacity: 0,
        y: 20
      })

      // Animate in with stagger
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        stagger: staggerDelay,
        ease: 'power2.out'
      })
    }
  }, [delay, staggerDelay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface FadeInUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out'
        }
      )
    }
  }, [delay, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className,
  direction = 'left',
  delay = 0,
  duration = 0.6
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const fromValues: any = { opacity: 0 }

      switch (direction) {
        case 'left':
          fromValues.x = -50
          break
        case 'right':
          fromValues.x = 50
          break
        case 'up':
          fromValues.y = 50
          break
        case 'down':
          fromValues.y = -50
          break
      }

      gsap.fromTo(
        ref.current,
        fromValues,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: 'power2.out'
        }
      )
    }
  }, [direction, delay, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: 'back.out'
        }
      )
    }
  }, [delay, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className
}) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current) {
      const obj = { value: start }

      gsap.to(obj, {
        value: end,
        duration,
        delay,
        ease: 'power2.out',
        onUpdate: () => {
          if (ref.current) {
            const formattedValue = obj.value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            ref.current.textContent = `${prefix}${formattedValue}${suffix}`
          }
        }
      })
    }
  }, [end, start, duration, delay, decimals, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {start.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
      {suffix}
    </span>
  )
}
