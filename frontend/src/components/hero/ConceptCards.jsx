import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

const concepts = [
  {
    id: 'concurrency',
    title: 'Concurrency',
    badge: 'Concept',
    badgeVariant: 'cyan',
    description: 'Multiple tasks making progress in overlapping time periods. Not necessarily simultaneous.',
    icon: '🔄',
    examples: [
      'Handling multiple HTTP requests',
      'Managing UI events while processing data',
      'I/O operations with async/await'
    ]
  },
  {
    id: 'parallelism',
    title: 'Parallelism',
    badge: 'Execution',
    badgeVariant: 'green',
    description: 'Multiple tasks executing simultaneously on different CPU cores. True simultaneous execution.',
    icon: '⚡',
    examples: [
      'Multi-core video encoding',
      'Parallel matrix multiplication',
      'Distributed data processing'
    ]
  },
  {
    id: 'threading',
    title: 'Threading',
    badge: 'Implementation',
    badgeVariant: 'coral',
    description: 'A mechanism to achieve concurrency. Threads share memory space and can run concurrently or in parallel.',
    icon: '🧵',
    examples: [
      'Background workers in web servers',
      'Concurrent database connections',
      'Multi-threaded game engines'
    ]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export default function ConceptCards() {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {concepts.map((concept) => (
        <motion.div key={concept.id} variants={cardVariants}>
          <Card className="h-full flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <span className="text-4xl">{concept.icon}</span>
              <Badge variant={concept.badgeVariant}>{concept.badge}</Badge>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{concept.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {concept.description}
              </p>
            </div>

            {/* Examples */}
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Examples
              </h4>
              <ul className="space-y-2">
                {concept.examples.map((example, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start">
                    <span className="text-thread-cyan mr-2">›</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
