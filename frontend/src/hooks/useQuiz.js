import { create } from 'zustand'
import { quizAPI } from '../lib/api'
import { useUserStore } from '../store/userStore'

const FALLBACK_QUESTIONS = [
  {
    id: "q1",
    question: "O que melhor descreve Concorrência?",
    options: [
      { id: "a", text: "Duas tarefas executam exatamente ao mesmo tempo" },
      { id: "b", text: "Múltiplas tarefas progridem em períodos sobrepostos" },
      { id: "c", text: "Uma tarefa espera outra terminar" },
      { id: "d", text: "Tarefas em threads separadas do SO" }
    ],
    correct: "b",
    feedback: {
      correct: "Exato! Concorrência é sobre estrutura, não execução simultânea.",
      incorrect: "Quase! Concorrência significa gerenciar múltiplas tarefas — não necessariamente ao mesmo tempo."
    }
  },
  {
    id: "q2",
    question: "Qual afirmação é verdadeira sobre Paralelismo?",
    options: [
      { id: "a", text: "Pode acontecer em um único core de CPU" },
      { id: "b", text: "É o mesmo que concorrência" },
      { id: "c", text: "Requer múltiplos cores de CPU" },
      { id: "d", text: "É sempre mais rápido que código sequencial" }
    ],
    correct: "c",
    feedback: {
      correct: "Correto! Paralelismo verdadeiro precisa de hardware com múltiplos cores.",
      incorrect: "Não exatamente. Paralelismo requer execução simultânea em diferentes cores de CPU."
    }
  },
  {
    id: "q3",
    question: "Quando usar Threading?",
    options: [
      { id: "a", text: "Para operações matemáticas intensivas" },
      { id: "b", text: "Para operações I/O (arquivos, rede, database)" },
      { id: "c", text: "Para garantir execução paralela" },
      { id: "d", text: "Apenas em linguagens compiladas" }
    ],
    correct: "b",
    feedback: {
      correct: "Perfeito! Threading brilha em operações I/O onde há espera (I/O-bound).",
      incorrect: "Pense em quando seu programa está esperando (I/O), não calculando (CPU)."
    }
  }
]

export const useQuiz = create((set, get) => ({
  questions: FALLBACK_QUESTIONS,
  answers: {},
  currentQuestion: 0,
  showFeedback: false,
  isComplete: false,
  score: 0,
  serverFeedbacks: {},
  isLoading: false,

  fetchQuestions: async () => {
    set({ isLoading: true })
    try {
      const { data } = await quizAPI.getQuestions()
      if (Array.isArray(data) && data.length > 0) {
        // Merge backend questions while preserving any local fallback metadata if matching
        const merged = data.map((remoteQ) => {
          const fallback = FALLBACK_QUESTIONS.find((f) => f.id === remoteQ.id)
          return {
            ...remoteQ,
            correct: fallback?.correct,
            feedback: fallback?.feedback,
          }
        })
        set({ questions: merged })
      }
    } catch (err) {
      console.warn('Could not fetch questions from API, using fallback:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  selectAnswer: (questionId, optionId) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
      showFeedback: false,
    }))
  },

  submitAnswer: async () => {
    const { questions, answers, currentQuestion } = get()
    const question = questions[currentQuestion]
    if (!question) return
    const selectedAnswer = answers[question.id]
    if (!selectedAnswer) return

    const hasLocalGabarito = typeof question.correct === 'string'
    const isLocalCorrect = hasLocalGabarito ? selectedAnswer === question.correct : false

    set((state) => ({
      showFeedback: true,
      score: isLocalCorrect ? state.score + 1 : state.score,
    }))

    // If authenticated, sync with backend API and store server feedback
    if (useUserStore.getState().isAuthenticated) {
      try {
        const { data } = await quizAPI.submitAnswer({
          question_id: question.id,
          selected: selectedAnswer,
        })
        set((state) => ({
          serverFeedbacks: {
            ...state.serverFeedbacks,
            [question.id]: {
              isCorrect: data.is_correct,
              message: data.message,
              correctAnswer: data.correct_answer,
            },
          },
          score: !hasLocalGabarito
            ? (data.is_correct ? state.score + 1 : state.score)
            : state.score,
        }))
      } catch (err) {
        console.warn('Quiz sync to backend failed:', err)
      }
    }
  },

  nextQuestion: () => {
    const { currentQuestion, questions } = get()
    if (currentQuestion < questions.length - 1) {
      set({
        currentQuestion: currentQuestion + 1,
        showFeedback: false,
      })
    } else {
      set({ isComplete: true })
    }
  },

  previousQuestion: () => {
    set((state) => ({
      currentQuestion: Math.max(0, state.currentQuestion - 1),
      showFeedback: false,
    }))
  },

  reset: () => {
    set({
      answers: {},
      currentQuestion: 0,
      showFeedback: false,
      isComplete: false,
      score: 0,
      serverFeedbacks: {},
    })
  },

  getProgress: () => {
    const { answers, questions } = get()
    if (!questions.length) return 0
    return (Object.keys(answers).length / questions.length) * 100
  },

  getCurrentFeedback: () => {
    const { questions, answers, currentQuestion, serverFeedbacks } = get()
    const question = questions[currentQuestion]
    if (!question) return null
    const selectedAnswer = answers[question.id]
    if (!selectedAnswer) return null

    if (serverFeedbacks[question.id]) {
      return serverFeedbacks[question.id]
    }

    if (question.correct && question.feedback) {
      const isCorrect = selectedAnswer === question.correct
      return {
        isCorrect,
        message: isCorrect ? question.feedback.correct : question.feedback.incorrect,
        correctAnswer: question.correct,
      }
    }

    return null
  },
}))
