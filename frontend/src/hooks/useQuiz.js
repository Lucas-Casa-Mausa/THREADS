import { create } from 'zustand'

const QUIZ_QUESTIONS = [
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
  questions: QUIZ_QUESTIONS,
  answers: {},
  currentQuestion: 0,
  showFeedback: false,
  isComplete: false,
  score: 0,

  selectAnswer: (questionId, optionId) => {
    set(state => ({
      answers: { ...state.answers, [questionId]: optionId },
      showFeedback: false
    }))
  },

  submitAnswer: () => {
    const { questions, answers, currentQuestion } = get()
    const question = questions[currentQuestion]
    const selectedAnswer = answers[question.id]
    
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === question.correct
    
    set(state => ({
      showFeedback: true,
      score: isCorrect ? state.score + 1 : state.score
    }))
  },

  nextQuestion: () => {
    const { currentQuestion, questions } = get()
    
    if (currentQuestion < questions.length - 1) {
      set({ 
        currentQuestion: currentQuestion + 1,
        showFeedback: false 
      })
    } else {
      set({ isComplete: true })
    }
  },

  previousQuestion: () => {
    set(state => ({
      currentQuestion: Math.max(0, state.currentQuestion - 1),
      showFeedback: false
    }))
  },

  reset: () => {
    set({
      answers: {},
      currentQuestion: 0,
      showFeedback: false,
      isComplete: false,
      score: 0
    })
  },

  getProgress: () => {
    const { answers, questions } = get()
    return Object.keys(answers).length / questions.length * 100
  },

  getCurrentFeedback: () => {
    const { questions, answers, currentQuestion } = get()
    const question = questions[currentQuestion]
    const selectedAnswer = answers[question.id]
    
    if (!selectedAnswer) return null
    
    const isCorrect = selectedAnswer === question.correct
    return {
      isCorrect,
      message: isCorrect ? question.feedback.correct : question.feedback.incorrect
    }
  }
}))
