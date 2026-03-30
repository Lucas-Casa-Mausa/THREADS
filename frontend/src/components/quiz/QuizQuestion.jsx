import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../../hooks/useQuiz'
import Badge from '../ui/Badge'

export default function QuizQuestion() {
  const {
    questions,
    answers,
    currentQuestion,
    showFeedback,
    selectAnswer,
    submitAnswer,
    getCurrentFeedback
  } = useQuiz()

  const question = questions[currentQuestion]
  const selectedAnswer = answers[question.id]
  const feedback = getCurrentFeedback()

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-dark-surface border border-dark-border rounded-2xl p-8"
    >
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <Badge variant="yellow">
          Question {currentQuestion + 1} of {questions.length}
        </Badge>
        <span className="text-sm text-gray-500">
          {Object.keys(answers).length}/{questions.length} answered
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-2xl font-bold mb-8 text-white">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id
          const isCorrect = option.id === question.correct
          const showCorrect = showFeedback && isCorrect
          const showIncorrect = showFeedback && isSelected && !isCorrect

          return (
            <motion.button
              key={option.id}
              onClick={() => !showFeedback && selectAnswer(question.id, option.id)}
              disabled={showFeedback}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                ${!showFeedback && !isSelected && 'border-dark-border bg-dark-bg hover:border-thread-yellow/40 hover:bg-dark-surface'}
                ${isSelected && !showFeedback && 'border-thread-yellow bg-thread-yellow/10'}
                ${showCorrect && 'border-thread-green bg-thread-green/10'}
                ${showIncorrect && 'border-thread-coral bg-thread-coral/10'}
                ${showFeedback && 'cursor-not-allowed'}
              `}
              whileHover={!showFeedback ? { scale: 1.01 } : {}}
              whileTap={!showFeedback ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center justify-between">
                <span className={`
                  ${showCorrect ? 'text-thread-green' : ''}
                  ${showIncorrect ? 'text-thread-coral' : ''}
                  ${!showFeedback ? 'text-white' : ''}
                `}>
                  {option.text}
                </span>
                
                {showCorrect && <span className="text-xl">✓</span>}
                {showIncorrect && <span className="text-xl">✗</span>}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Submit Button */}
      {!showFeedback && (
        <motion.button
          onClick={submitAnswer}
          disabled={!selectedAnswer}
          className={`
            w-full py-3 rounded-xl font-semibold transition-all
            ${selectedAnswer 
              ? 'bg-thread-yellow/20 text-thread-yellow border border-thread-yellow/40 hover:bg-thread-yellow/30' 
              : 'bg-dark-border text-gray-600 border border-dark-border cursor-not-allowed'}
          `}
          whileHover={selectedAnswer ? { scale: 1.02 } : {}}
          whileTap={selectedAnswer ? { scale: 0.98 } : {}}
        >
          Submit Answer
        </motion.button>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`
              mt-6 p-4 rounded-xl border-2
              ${feedback.isCorrect 
                ? 'bg-thread-green/10 border-thread-green text-thread-green' 
                : 'bg-thread-coral/10 border-thread-coral text-thread-coral'}
            `}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">
                {feedback.isCorrect ? '🎉' : '💡'}
              </span>
              <div>
                <h4 className="font-bold mb-1">
                  {feedback.isCorrect ? 'Correct!' : 'Not quite!'}
                </h4>
                <p className="text-sm opacity-90">
                  {feedback.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
