import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'
import AuthModal from '../auth/AuthModal'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useUserStore()
  const [authMode, setAuthMode] = useState(null) // 'login' | 'register' | null

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold text-gradient">THREADS</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#hero" className="text-sm hover:text-thread-cyan transition-colors">
                Concepts
              </a>
              <a href="#timeline" className="text-sm hover:text-thread-green transition-colors">
                Timeline
              </a>
              <a href="#code" className="text-sm hover:text-thread-coral transition-colors">
                Examples
              </a>
              <a href="#quiz" className="text-sm hover:text-thread-yellow transition-colors">
                Quiz
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:inline text-sm text-gray-400">
                    {user?.username || user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className="px-4 py-2 text-sm bg-thread-cyan/10 hover:bg-thread-cyan/20 text-thread-cyan rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AuthModal
        open={authMode !== null}
        mode={authMode || 'login'}
        onClose={() => setAuthMode(null)}
        onSwitchMode={setAuthMode}
      />
    </>
  )
}
