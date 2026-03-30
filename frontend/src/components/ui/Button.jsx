import { motion } from 'framer-motion'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-thread-cyan/10 hover:bg-thread-cyan/20 text-thread-cyan border border-thread-cyan/20',
    secondary: 'bg-dark-surface hover:bg-dark-border text-white border border-dark-border',
    outline: 'bg-transparent border border-dark-border hover:border-thread-cyan text-white hover:text-thread-cyan',
    ghost: 'bg-transparent hover:bg-dark-surface text-gray-400 hover:text-white',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
