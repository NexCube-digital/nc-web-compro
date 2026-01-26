import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string
  stagger?: number | { amount: number; from?: "center" | "end" | "start" | "edges" | "random" | number | [number, number] }
}

interface ScrollTriggerConfig extends AnimationConfig {
  trigger?: string
  start?: string
  end?: string
  scrub?: boolean | number
  toggleActions?: string
  markers?: boolean
}

export const useGsapFadeIn = (
  selector: string,
  config: AnimationConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) return

      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: config.duration || 0.6,
          delay: config.delay || 0,
          ease: config.ease || 'power2.out',
          stagger: config.stagger || 0.1
        }
      )
    }, 100)

    return () => clearTimeout(timer)
  }, [selector])
}

export const useGsapSlideIn = (
  selector: string,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  config: AnimationConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) return

      const fromValues: any = { opacity: 0 }
      const toValues: any = { opacity: 1 }

      switch (direction) {
        case 'left':
          fromValues.x = -50
          toValues.x = 0
          break
        case 'right':
          fromValues.x = 50
          toValues.x = 0
          break
        case 'up':
          fromValues.y = 50
          toValues.y = 0
          break
        case 'down':
          fromValues.y = -50
          toValues.y = 0
          break
      }

      gsap.fromTo(elements, fromValues, {
        ...toValues,
        duration: config.duration || 0.6,
        delay: config.delay || 0,
        ease: config.ease || 'power2.out',
        stagger: config.stagger || 0.1
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [selector, direction])
}

export const useGsapScale = (
  selector: string,
  config: AnimationConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) return

      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: config.duration || 0.6,
          delay: config.delay || 0,
          ease: config.ease || 'back.out',
          stagger: config.stagger || 0.1
        }
      )
    }, 100)

    return () => clearTimeout(timer)
  }, [selector])
}

export const useHoverEffect = (selector: string) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)

      elements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [selector])
}

// ScrollTrigger Animations - FULLY IMPROVED
export const useScrollFadeIn = (
  selector: string,
  config: ScrollTriggerConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        console.log(`[ScrollFadeIn] No elements found for: ${selector}`)
        return
      }

      console.log(`[ScrollFadeIn] Animating ${elements.length} elements for: ${selector}`)

      const animations: gsap.core.Tween[] = []

      elements.forEach((element, index) => {
        const anim = gsap.fromTo(
          element,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: config.duration || 0.6,
            ease: config.ease || 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: config.start || 'top 85%',
              end: config.end || 'bottom 20%',
              toggleActions: config.toggleActions || 'play none none none',
              markers: config.markers || false,
              once: false
            }
          }
        )
        animations.push(anim)
      })

      return () => {
        animations.forEach(anim => anim.kill())
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [selector])
}

export const useParallax = (
  selector: string,
  speed: number = 0.5,
  config: ScrollTriggerConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        console.log(`[Parallax] No elements found for: ${selector}`)
        return
      }

      console.log(`[Parallax] Animating ${elements.length} elements`)

      const animations: gsap.core.Tween[] = []

      elements.forEach((element) => {
        const anim = gsap.to(element, {
          y: () => -window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: config.start || 'top bottom',
            end: config.end || 'bottom top',
            scrub: config.scrub !== undefined ? config.scrub : 1,
            markers: config.markers || false
          }
        })
        animations.push(anim)
      })

      return () => {
        animations.forEach(anim => anim.kill())
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [selector, speed])
}

export const useScrollRotate = (
  selector: string,
  rotation: number = 360,
  config: ScrollTriggerConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        console.log(`[ScrollRotate] No elements found for: ${selector}`)
        return
      }

      console.log(`[ScrollRotate] Animating ${elements.length} elements`)

      const animations: gsap.core.Tween[] = []

      elements.forEach((element) => {
        const anim = gsap.to(element, {
          rotation: rotation,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: config.start || 'top bottom',
            end: config.end || 'bottom top',
            scrub: config.scrub !== undefined ? config.scrub : 2,
            markers: config.markers || false
          }
        })
        animations.push(anim)
      })

      return () => {
        animations.forEach(anim => anim.kill())
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [selector, rotation])
}

export const useScrollScale = (
  selector: string,
  config: ScrollTriggerConfig = {}
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        console.log(`[ScrollScale] No elements found for: ${selector}`)
        return
      }

      console.log(`[ScrollScale] Animating ${elements.length} elements`)

      const animations: gsap.core.Tween[] = []

      elements.forEach((element, index) => {
        const anim = gsap.fromTo(
          element,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: config.duration || 0.6,
            ease: config.ease || 'back.out(1.2)',
            scrollTrigger: {
              trigger: element,
              start: config.start || 'top 85%',
              end: config.end || 'bottom 20%',
              toggleActions: config.toggleActions || 'play none none none',
              markers: config.markers || false,
              once: false
            }
          }
        )
        animations.push(anim)
      })

      return () => {
        animations.forEach(anim => anim.kill())
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [selector])
}

export const useFloatingAnimation = (selector: string) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        console.log(`[FloatingAnimation] No elements found for: ${selector}`)
        return
      }

      console.log(`[FloatingAnimation] Animating ${elements.length} elements`)

      const animations: gsap.core.Tween[] = []

      elements.forEach((element, index) => {
        const anim = gsap.to(element, {
          y: -20,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.5
        })
        animations.push(anim)
      })

      return () => {
        animations.forEach(anim => anim.kill())
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [selector])
}
