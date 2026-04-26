import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { useUserStore } from './store/userStore'
import { useProgressStore } from './store/progressStore'
import { authAPI } from './lib/api'

function App() {
  const { isAuthenticated, user, login, logout } = useUserStore()
  const hydrateFromBackend = useProgressStore((s) => s.hydrateFromBackend)

  // On boot, if a token is in localStorage but the store has no user.id
  // (e.g. older sessions before /me wiring), refresh the user from /me.
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && (!user || !user.id)) {
      authAPI
        .me()
        .then(({ data }) => login(data, token))
        .catch(() => logout())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Whenever the user becomes authenticated, pull their progress.
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      hydrateFromBackend()
    }
  }, [isAuthenticated, user?.id, hydrateFromBackend])

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-dark-text dark">
          <ErrorBoundary>
            <Home />
          </ErrorBoundary>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
