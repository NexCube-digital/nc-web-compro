import { useEffect } from 'react'

/**
 * Custom hook for smooth scroll with Three.js integration
 * Combines GSAP ScrollTrigger with Three.js for buttery smooth animations
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Optimize scroll performance
    let ticking = false
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      lastScrollY = window.scrollY
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Dispatch custom event for Three.js components
          window.dispatchEvent(new CustomEvent('smoothscroll', {
            detail: { scrollY: lastScrollY }
          }))
          
          ticking = false
        })
        
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
}

/**
 * Optimize Three.js performance based on device capabilities
 */
export const useThreePerformance = () => {
  useEffect(() => {
    // Detect device performance
    const isLowPerformance = () => {
      // Check if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 2
      
      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory || 4
      
      return isMobile || cores < 4 || memory < 4
    }
    
    // Set performance hints
    if (isLowPerformance()) {
      document.documentElement.setAttribute('data-performance', 'low')
    } else {
      document.documentElement.setAttribute('data-performance', 'high')
    }
    
    return () => {
      document.documentElement.removeAttribute('data-performance')
    }
  }, [])
}

/**
 * Combine GSAP and Three.js for synchronized animations
 */
export const useGSAPThreeSync = (selector: string) => {
  useEffect(() => {
    const handleAnimation = (event: any) => {
      const elements = document.querySelectorAll(selector)
      const scrollProgress = event.detail.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      
      elements.forEach((element) => {
        // Update CSS custom properties for smooth integration
        (element as HTMLElement).style.setProperty('--scroll-progress', scrollProgress.toString())
      })
    }
    
    window.addEventListener('smoothscroll', handleAnimation)
    
    return () => {
      window.removeEventListener('smoothscroll', handleAnimation)
    }
  }, [selector])
}

export default {
  useSmoothScroll,
  useThreePerformance,
  useGSAPThreeSync
}
