import { useState, useEffect } from 'react'

export function useScrollProgress(targetRef) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef?.current) return

      const element = targetRef.current
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementHeight = rect.height
      const windowHeight = window.innerHeight
      
      // Calculate progress: 0 when element enters viewport, 1 when it exits
      const scrollTop = window.scrollY
      const triggerPoint = elementTop - windowHeight
      const exitPoint = elementTop + elementHeight
      
      const totalDistance = exitPoint - triggerPoint
      const currentDistance = scrollTop - triggerPoint
      
      const progress = Math.max(0, Math.min(1, currentDistance / totalDistance))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  return scrollProgress
}
