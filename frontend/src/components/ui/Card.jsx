import { motion } from 'framer-motion'

export default function Card({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) {
  return (
    <motion.div
      className={`bg-dark-surface border border-dark-border rounded-xl p-6 ${className}`}
      whileHover={hover ? { 
        scale: 1.02,
        borderColor: 'rgba(0, 255, 209, 0.3)',
        transition: { duration: 0.2 }
      } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}
