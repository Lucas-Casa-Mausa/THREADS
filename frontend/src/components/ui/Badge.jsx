export default function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}) {
  const variants = {
    default: 'bg-dark-surface text-gray-400 border-dark-border',
    cyan: 'bg-thread-cyan/10 text-thread-cyan border-thread-cyan/20',
    green: 'bg-thread-green/10 text-thread-green border-thread-green/20',
    coral: 'bg-thread-coral/10 text-thread-coral border-thread-coral/20',
    yellow: 'bg-thread-yellow/10 text-thread-yellow border-thread-yellow/20',
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
