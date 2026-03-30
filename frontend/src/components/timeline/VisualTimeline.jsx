import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TimelineTrack from './TimelineTrack'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const ExecutionState = {
  IDLE: 'idle',
  RUNNING: 'running',
  BLOCKED: 'blocked',
  COMPLETE: 'complete'
}

// Simulation data
const initialTasks = [
  { id: 't1', name: 'Task A', duration: 100, progress: 0, state: ExecutionState.IDLE },
  { id: 't2', name: 'Task B', duration: 150, progress: 0, state: ExecutionState.IDLE },
  { id: 't3', name: 'Task C', duration: 80, progress: 0, state: ExecutionState.IDLE },
]

export default function VisualTimeline() {
  const [mode, setMode] = useState('sequential')
  const [isRunning, setIsRunning] = useState(false)
  const [sequentialTasks, setSequentialTasks] = useState(initialTasks)
  const [concurrentTasks, setConcurrentTasks] = useState(initialTasks)
  const [parallelTasks, setParallelTasks] = useState(initialTasks)

  const runSequential = async () => {
    setIsRunning(true)
    const tasks = [...initialTasks]
    
    for (let i = 0; i < tasks.length; i++) {
      // Start task
      tasks[i] = { ...tasks[i], state: ExecutionState.RUNNING, progress: 0 }
      setSequentialTasks([...tasks])
      
      // Simulate progress
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(resolve => setTimeout(resolve, tasks[i].duration / 10))
        tasks[i] = { ...tasks[i], progress: p }
        setSequentialTasks([...tasks])
      }
      
      // Complete task
      tasks[i] = { ...tasks[i], state: ExecutionState.COMPLETE, progress: 100 }
      setSequentialTasks([...tasks])
    }
    
    setIsRunning(false)
  }

  const runConcurrent = async () => {
    setIsRunning(true)
    const tasks = initialTasks.map(t => ({ ...t, state: ExecutionState.RUNNING, progress: 0 }))
    setConcurrentTasks([...tasks])

    // Simulate concurrent execution (interleaved)
    const maxDuration = Math.max(...tasks.map(t => t.duration))
    const steps = 10
    
    for (let step = 0; step <= steps; step++) {
      await new Promise(resolve => setTimeout(resolve, maxDuration / steps))
      
      tasks.forEach((task, i) => {
        const progress = Math.min(100, (step / steps) * 100)
        tasks[i] = { ...tasks[i], progress }
        if (progress === 100) {
          tasks[i].state = ExecutionState.COMPLETE
        }
      })
      
      setConcurrentTasks([...tasks])
    }
    
    setIsRunning(false)
  }

  const runParallel = async () => {
    setIsRunning(true)
    const tasks = initialTasks.map(t => ({ ...t, state: ExecutionState.RUNNING, progress: 0 }))
    setParallelTasks([...tasks])

    // True parallel — all complete at same normalized time
    const steps = 10
    const duration = 100 // Fixed duration for visualization
    
    for (let step = 0; step <= steps; step++) {
      await new Promise(resolve => setTimeout(resolve, duration / steps))
      
      tasks.forEach((task, i) => {
        const progress = (step / steps) * 100
        tasks[i] = { ...tasks[i], progress }
        if (progress === 100) {
          tasks[i].state = ExecutionState.COMPLETE
        }
      })
      
      setParallelTasks([...tasks])
    }
    
    setIsRunning(false)
  }

  const reset = () => {
    setSequentialTasks([...initialTasks])
    setConcurrentTasks([...initialTasks])
    setParallelTasks([...initialTasks])
    setIsRunning(false)
  }

  const handleRun = () => {
    reset()
    setTimeout(() => {
      if (mode === 'sequential') runSequential()
      else if (mode === 'concurrent') runConcurrent()
      else if (mode === 'parallel') runParallel()
    }, 100)
  }

  return (
    <section id="timeline" className="min-h-screen py-20 px-6 bg-dark-surface/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="green" className="mb-4">Interactive Demo</Badge>
          <h2 className="text-5xl font-bold mb-4">
            Execution <span className="text-gradient">Timeline</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch how tasks execute in different models: one at a time, interleaved, or truly parallel.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          {['sequential', 'concurrent', 'parallel'].map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'primary' : 'outline'}
              onClick={() => setMode(m)}
              disabled={isRunning}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Button>
          ))}
        </div>

        {/* Timeline Tracks */}
        <motion.div 
          className="bg-dark-bg border border-dark-border rounded-2xl p-8 mb-8"
          layout
        >
          <AnimatePresence mode="wait">
            {mode === 'sequential' && (
              <motion.div
                key="sequential"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <TimelineTrack 
                  title="Sequential Execution" 
                  tasks={sequentialTasks} 
                  type="One at a time"
                />
              </motion.div>
            )}
            
            {mode === 'concurrent' && (
              <motion.div
                key="concurrent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <TimelineTrack 
                  title="Concurrent Execution" 
                  tasks={concurrentTasks} 
                  type="Interleaved"
                />
              </motion.div>
            )}
            
            {mode === 'parallel' && (
              <motion.div
                key="parallel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <TimelineTrack 
                  title="Parallel Execution" 
                  tasks={parallelTasks} 
                  type="Truly simultaneous"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : '▶ Run Simulation'}
          </Button>
          <Button 
            variant="outline" 
            onClick={reset}
            disabled={isRunning}
          >
            ↻ Reset
          </Button>
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <span className="text-gray-400">Idle</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-thread-cyan" />
            <span className="text-gray-400">Running</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-thread-coral" />
            <span className="text-gray-400">Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-thread-green" />
            <span className="text-gray-400">Complete</span>
          </div>
        </div>
      </div>
    </section>
  )
}
