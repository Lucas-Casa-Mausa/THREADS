import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { authAPI } from '../../lib/api'
import { useUserStore } from '../../store/userStore'

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/

function extractApiError(err) {
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  if (err?.response?.status === 429) return 'Muitas tentativas. Tente novamente em instantes.'
  return 'Erro inesperado. Tente novamente.'
}

export default function AuthModal({ open, mode = 'login', onClose, onSwitchMode }) {
  const login = useUserStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setEmail('')
      setUsername('')
      setPassword('')
      setError(null)
      setLoading(false)
    }
  }, [open, mode])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const isRegister = mode === 'register'

  const validate = () => {
    if (!email.includes('@')) return 'E-mail inválido.'
    if (isRegister && username.trim().length < 3) {
      return 'Username deve ter ao menos 3 caracteres.'
    }
    if (isRegister && !PASSWORD_RULE.test(password)) {
      return 'Senha precisa ter 8+ caracteres com maiúscula, minúscula e número.'
    }
    if (!isRegister && password.length < 1) return 'Informe a senha.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (isRegister) {
        await authAPI.register({ email, username, password })
      }
      const { data: tokenData } = await authAPI.login({ email, password })
      const token = tokenData.access_token
      // Persist token first so the /me request is authenticated by the
      // axios interceptor.
      localStorage.setItem('access_token', token)
      const { data: me } = await authAPI.me()
      login(me, token)
      onClose()
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="auth-modal-title" className="text-2xl font-bold text-white">
                {isRegister ? 'Criar conta' : 'Entrar'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white text-xl leading-none"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="auth-email">
                  E-mail
                </label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-thread-cyan"
                  required
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="auth-username">
                    Username
                  </label>
                  <input
                    id="auth-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={50}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-thread-cyan"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="auth-password">
                  Senha
                </label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-thread-cyan"
                  required
                />
                {isRegister && (
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 8 caracteres, com maiúscula, minúscula e número.
                  </p>
                )}
              </div>

              {error && (
                <div className="text-sm text-thread-coral bg-thread-coral/10 border border-thread-coral/40 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-thread-cyan/10 hover:bg-thread-cyan/20 text-thread-cyan border border-thread-cyan/40 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : isRegister ? 'Criar conta' : 'Entrar'}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
              <button
                type="button"
                onClick={() => onSwitchMode(isRegister ? 'login' : 'register')}
                className="text-thread-cyan hover:underline"
              >
                {isRegister ? 'Entrar' : 'Criar conta'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
