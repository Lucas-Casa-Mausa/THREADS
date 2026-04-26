import { useState } from 'react'
import { motion } from 'framer-motion'
import CodeBlock from './CodeBlock'
import Badge from '../ui/Badge'

const codeExamples = {
  sequential: {
    python: `# Sequential Execution
import time

def task(name, duration):
    print(f"Starting {name}")
    time.sleep(duration)
    print(f"Finished {name}")

# Execute one at a time
task("A", 2)  # Blocks for 2s
task("B", 2)  # Waits for A, then blocks for 2s
task("C", 2)  # Waits for B, then blocks for 2s

# Total time: 6 seconds`,
    output: `$ python sequential.py
Starting A
Finished A
Starting B
Finished B
Starting C
Finished C

⏱️  Total: 6.02 seconds`
  },
  
  concurrent: {
    python: `# Concurrent Execution (asyncio)
import asyncio

async def task(name, duration):
    print(f"Starting {name}")
    await asyncio.sleep(duration)
    print(f"Finished {name}")

# Execute concurrently (interleaved)
async def main():
    await asyncio.gather(
        task("A", 2),
        task("B", 2),
        task("C", 2),
    )

asyncio.run(main())
# Total time: ~2 seconds (overlapped)`,
    output: `$ python concurrent.py
Starting A
Starting B
Starting C
Finished A
Finished B
Finished C

⏱️  Total: 2.01 seconds`
  },
  
  parallel: {
    python: `# Parallel Execution (multiprocessing)
from multiprocessing import Pool
import os
import time

def task(args):
    name, duration = args
    print(f"Starting {name} on core {os.getpid()}")
    time.sleep(duration)
    print(f"Finished {name}")
    return name

# Execute in parallel on different CPU cores
with Pool(3) as pool:
    pool.map(task, [("A", 2), ("B", 2), ("C", 2)])

# Total time: ~2 seconds (true parallel)`,
    output: `$ python parallel.py
Starting A on core 12345
Starting B on core 12346
Starting C on core 12347
Finished A
Finished B
Finished C

⏱️  Total: 2.00 seconds
🖥️  Used 3 CPU cores`
  }
}

export default function SplitTerminal() {
  const [selectedMode, setSelectedMode] = useState('sequential')
  const currentExample = codeExamples[selectedMode]

  return (
    <section id="code" className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="coral" className="mb-4">Code Examples</Badge>
          <h2 className="text-5xl font-bold mb-4">
            See It <span className="text-gradient">In Action</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Compare real code implementations side by side. Watch how execution patterns change.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {Object.keys(codeExamples).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedMode === mode
                  ? 'bg-thread-coral/20 text-thread-coral border border-thread-coral/40'
                  : 'bg-dark-surface text-gray-400 border border-dark-border hover:border-thread-coral/40'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Split Terminal */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          layout
        >
          {/* Left Pane - Code */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
                <span className="text-sm font-mono text-gray-400">
                  {selectedMode}.py
                </span>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-thread-coral" />
                  <div className="w-3 h-3 rounded-full bg-thread-yellow" />
                  <div className="w-3 h-3 rounded-full bg-thread-green" />
                </div>
              </div>
              <div className="p-4">
                <CodeBlock code={currentExample.python} language="python" />
              </div>
            </div>
          </motion.div>

          {/* Right Pane - Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
                <span className="text-sm font-mono text-gray-400">
                  Terminal Output
                </span>
                <Badge variant="green">Live</Badge>
              </div>
              <div className="p-6 font-mono text-sm space-y-1">
                {currentExample.output.split('\n').map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={
                      line.startsWith('$') 
                        ? 'text-thread-cyan' 
                        : line.includes('⏱️') || line.includes('🖥️')
                        ? 'text-thread-yellow'
                        : 'text-gray-400'
                    }
                  >
                    {line || '\u00A0'}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Insights */}
        <motion.div 
          className="mt-12 bg-dark-bg border border-dark-border rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Key Insight: {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
          </h3>
          <p className="text-gray-400">
            {selectedMode === 'sequential' && 
              'Tasks execute one after another. Simple to reason about, but slowest approach. Total time is the sum of all task durations.'}
            {selectedMode === 'concurrent' && 
              'Tasks start/pause/resume in overlapping time periods. Single CPU can handle multiple tasks by switching between them. Great for I/O-bound work.'}
            {selectedMode === 'parallel' && 
              'Tasks execute simultaneously on different CPU cores. Requires multiple processors. Best for CPU-intensive computations like video encoding or data processing.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
