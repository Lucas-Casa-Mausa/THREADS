import { useState, useEffect } from 'react'

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect if device is touch-enabled
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    if (isTouch) return // Skip mouse tracking on touch devices

    const handleMouseMove = (e) => {
      // Normalize to -1 to 1 range
      setPosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouch])

  return { ...position, isTouch }
}
