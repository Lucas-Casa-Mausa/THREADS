import { motion } from 'framer-motion'
import ThreadCanvas from './ThreadCanvas'
import ConceptCards from './ConceptCards'
import Button from '../ui/Button'

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Animated Thread Background */}
      <ThreadCanvas />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/50 to-dark-bg pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Text */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-5xl">
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              THREADS
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Master Concurrency Through Visual Storytelling
            </motion.p>
            
            <motion.p 
              className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              An interactive journey through threads, parallelism, and concurrent programming 
              with stunning animations and real-world examples.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button variant="primary" size="lg">
                Start Learning
              </Button>
              <Button variant="outline" size="lg">
                View Examples
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="flex justify-center pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-500 text-sm"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="mb-2">Scroll to explore</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="text-thread-cyan"
            >
              <path 
                d="M10 4v12m0 0l-4-4m4 4l4-4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
        
        {/* Concept Cards */}
        <div className="pb-20">
          <ConceptCards />
        </div>
      </div>
    </section>
  )
}
