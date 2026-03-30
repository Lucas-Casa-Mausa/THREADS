import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition'
import { THREAD_PATHS } from '../../lib/constants'

export default function ThreadCanvas() {
  const containerRef = useRef(null)
  const { x: mouseX, y: mouseY, isTouch } = useMousePosition()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll-based animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transform scroll to path length (0 to 1)
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  // Use simplified threads for mobile
  const displayThreads = isMobile 
    ? THREAD_PATHS.slice(0, 2) // Only cyan and green on mobile
    : THREAD_PATHS

  // Mouse parallax offset (disabled on touch devices)
  const parallaxX = !isTouch && !isMobile ? mouseX * 20 : 0
  const parallaxY = !isTouch && !isMobile ? mouseY * 20 : 0

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Define Glow Filters */}
        <defs>
          {displayThreads.map((thread, i) => (
            <filter key={`filter-${i}`} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor={thread.color} floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Animated Thread Paths */}
        <motion.g
          style={{
            transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {displayThreads.map((thread, i) => (
            <motion.path
              key={`thread-${i}`}
              d={thread.d}
              stroke={thread.color}
              strokeWidth={isMobile ? 1.5 : 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${i})`}
              style={{ pathLength }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { 
                  delay: i * 0.2, 
                  duration: 2, 
                  ease: "easeInOut" 
                },
                opacity: { 
                  delay: i * 0.2, 
                  duration: 0.5 
                }
              }}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  )
}
