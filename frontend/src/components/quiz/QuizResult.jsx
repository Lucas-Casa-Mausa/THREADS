import { motion } from 'framer-motion'
import { useQuiz } from '../../hooks/useQuiz'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function QuizResult() {
  const { score, questions, reset } = useQuiz()
  const totalQuestions = questions.length
  const percentage = Math.round((score / totalQuestions) * 100)
  const isPassed = percentage >= 67 // 2 out of 3

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dark-surface border border-dark-border rounded-2xl p-10 text-center max-w-2xl mx-auto"
    >
      {/* Result Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-8xl mb-6"
      >
        {isPassed ? '🎉' : '📚'}
      </motion.div>

      {/* Score */}
      <h2 className="text-4xl font-bold mb-4">
        {isPassed ? 'Great Job!' : 'Keep Learning!'}
      </h2>
      
      <div className="mb-6">
        <div className="text-6xl font-bold text-gradient mb-2">
          {score}/{totalQuestions}
        </div>
        <p className="text-xl text-gray-400">
          {percentage}% Correct
        </p>
      </div>

      {/* Performance Badge */}
      <Badge 
        variant={isPassed ? 'green' : 'yellow'} 
        className="text-base px-6 py-2 mb-8"
      >
        {percentage === 100 && '🏆 Perfect Score!'}
        {percentage >= 67 && percentage < 100 && '✨ Well Done!'}
        {percentage < 67 && '💪 Keep Practicing!'}
      </Badge>

      {/* Message */}
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {isPassed 
          ? "You've mastered the fundamentals of concurrency and parallelism. Ready to dive deeper into real-world implementations!"
          : "Understanding concurrency takes time. Review the concepts and try again. You're on the right track!"}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
          variant="primary" 
          size="lg"
          onClick={reset}
        >
          ↻ Retake Quiz
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ← Review Concepts
        </Button>
      </div>

      {/* Social Share (Future) */}
      <div className="mt-8 pt-8 border-t border-dark-border">
        <p className="text-sm text-gray-500 mb-3">Share your result</p>
        <div className="flex items-center justify-center space-x-3">
          <button className="text-gray-500 hover:text-thread-cyan transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </button>
          <button className="text-gray-500 hover:text-thread-cyan transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
