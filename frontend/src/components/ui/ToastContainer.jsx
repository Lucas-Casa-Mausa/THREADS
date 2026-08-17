import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '../../store/toastStore'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          border: 'border-thread-green/60 bg-dark-surface/95 text-white',
          glow: 'shadow-[0_0_15px_rgba(57,255,20,0.2)]',
          badge: 'bg-thread-green/20 text-thread-green border border-thread-green/40',
          icon: '✓',
        }
      case 'error':
        return {
          border: 'border-thread-coral/60 bg-dark-surface/95 text-white',
          glow: 'shadow-[0_0_15px_rgba(255,107,107,0.2)]',
          badge: 'bg-thread-coral/20 text-thread-coral border border-thread-coral/40',
          icon: '✕',
        }
      case 'info':
      default:
        return {
          border: 'border-thread-cyan/60 bg-dark-surface/95 text-white',
          glow: 'shadow-[0_0_15px_rgba(0,255,209,0.2)]',
          badge: 'bg-thread-cyan/20 text-thread-cyan border border-thread-cyan/40',
          icon: 'ℹ',
        }
    }
  }

  return (
    <div
      aria-live="polite"
      className="fixed top-24 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none max-w-sm w-full"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getTypeStyles(toast.type)
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`
                pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md
                ${styles.border} ${styles.glow}
              `}
              role="alert"
            >
              <div className="flex items-center space-x-3 pr-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${styles.badge}`}
                >
                  {styles.icon}
                </span>
                <span className="text-sm font-medium leading-snug">
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors text-lg leading-none p-1"
                aria-label="Fechar notificação"
              >
                ×
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
