import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-dark-text dark">
          <Home />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
