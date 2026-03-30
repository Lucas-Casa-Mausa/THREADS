import { motion } from 'framer-motion'

const ExecutionState = {
  IDLE: 'idle',
  RUNNING: 'running',
  BLOCKED: 'blocked',
  COMPLETE: 'complete'
}

const stateColors = {
  [ExecutionState.IDLE]: 'bg-gray-600',
  [ExecutionState.RUNNING]: 'bg-thread-cyan',
  [ExecutionState.BLOCKED]: 'bg-thread-coral',
  [ExecutionState.COMPLETE]: 'bg-thread-green',
}

export default function TimelineTrack({ 
  title, 
  tasks, 
  type = 'sequential' 
}) {
  return (
    <div className="space-y-3">
      {/* Track Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{type}</span>
      </div>
      
      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Task Bar */}
            <div className="flex items-center space-x-3">
              {/* State Indicator */}
              <motion.div
                className={`w-3 h-3 rounded-full ${stateColors[task.state]}`}
                animate={task.state === ExecutionState.RUNNING ? {
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                } : {}}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Task Name */}
              <div className="flex-1 flex items-center justify-between bg-dark-surface border border-dark-border rounded-lg px-4 py-2">
                <span className="text-sm font-mono">{task.name}</span>
                
                {/* Progress Bar */}
                <div className="ml-4 w-32 h-2 bg-dark-bg rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${stateColors[task.state]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Duration */}
                <span className="ml-4 text-xs text-gray-500 font-mono w-12 text-right">
                  {task.duration}ms
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
