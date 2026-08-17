import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../../hooks/useQuiz'
import QuizQuestion from './QuizQuestion'
import QuizResult from './QuizResult'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function QuizSection() {
  const {
    currentQuestion,
    questions,
    showFeedback,
    isComplete,
    nextQuestion,
    previousQuestion,
    getProgress,
    fetchQuestions,
  } = useQuiz()

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const progress = getProgress()

  return (
    <section id="quiz" className="min-h-screen py-20 px-6 bg-dark-surface/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="yellow" className="mb-4">Test Your Knowledge</Badge>
          <h2 className="text-5xl font-bold mb-4">
            Final <span className="text-gradient">Challenge</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Put your understanding to the test. Three questions stand between you and mastery.
          </p>
        </motion.div>

        {/* Progress Bar */}
        {!isComplete && (
          <div className="mb-8">
            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-thread-cyan via-thread-green to-thread-yellow"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Quiz Content */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <div key="quiz">
              <QuizQuestion />
              
              {/* Navigation */}
              {showFeedback && (
                <motion.div 
                  className="flex items-center justify-between mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    ← Previous
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={nextQuestion}
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            <QuizResult key="result" />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
