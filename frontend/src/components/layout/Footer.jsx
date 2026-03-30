import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-32">
      <div className="max-w-8xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">THREADS</h3>
            <p className="text-sm text-gray-400 max-w-md">
              An interactive educational platform for mastering concurrency, 
              parallelism, and threading concepts through stunning visual animations.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#hero" className="hover:text-thread-cyan transition-colors">Concepts</a></li>
              <li><a href="#timeline" className="hover:text-thread-green transition-colors">Timeline</a></li>
              <li><a href="#code" className="hover:text-thread-coral transition-colors">Code Examples</a></li>
              <li><a href="#quiz" className="hover:text-thread-yellow transition-colors">Take Quiz</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://github.com/yourusername/threads" target="_blank" rel="noopener noreferrer" className="hover:text-thread-cyan transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-thread-cyan transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-thread-cyan transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-thread-cyan transition-colors">Contributing</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            © {currentYear} THREADS. Built with ❤️ and ☕
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            <a href="#" className="hover:text-thread-cyan transition-colors">Privacy</a>
            <a href="#" className="hover:text-thread-cyan transition-colors">Terms</a>
            <a href="#" className="hover:text-thread-cyan transition-colors">MIT License</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
