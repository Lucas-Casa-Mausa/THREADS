import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('UI crash:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-dark-text px-6">
          <div className="max-w-md text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-3">Algo quebrou nesta seção</h1>
            <p className="text-gray-400 mb-6 text-sm">
              {this.state.error.message || 'Erro inesperado.'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2 rounded-lg bg-thread-cyan/10 hover:bg-thread-cyan/20 text-thread-cyan border border-thread-cyan/40 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
