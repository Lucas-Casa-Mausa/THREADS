from typing import List, Dict
from app.schemas.quiz import QuizQuestion, QuizQuestionWithFeedback

QUIZ_DATA: List[QuizQuestionWithFeedback] = [
    QuizQuestionWithFeedback(
        id="q1",
        question="O que melhor descreve Concorrência?",
        options=[
            {"id": "a", "text": "Duas tarefas executam exatamente ao mesmo tempo"},
            {"id": "b", "text": "Múltiplas tarefas progridem em períodos sobrepostos"},
            {"id": "c", "text": "Uma tarefa espera outra terminar"},
            {"id": "d", "text": "Tarefas em threads separadas do SO"}
        ],
        correct="b",
        feedback={
            "correct": "Exato! Concorrência é sobre estrutura, não execução simultânea.",
            "incorrect": "Quase! Concorrência significa gerenciar múltiplas tarefas — não necessariamente ao mesmo tempo."
        }
    ),
    QuizQuestionWithFeedback(
        id="q2",
        question="Qual afirmação é verdadeira sobre Paralelismo?",
        options=[
            {"id": "a", "text": "Pode acontecer em um único core de CPU"},
            {"id": "b", "text": "É o mesmo que concorrência"},
            {"id": "c", "text": "Requer múltiplos cores de CPU"},
            {"id": "d", "text": "É sempre mais rápido que código sequencial"}
        ],
        correct="c",
        feedback={
            "correct": "Correto! Paralelismo verdadeiro precisa de hardware com múltiplos cores.",
            "incorrect": "Não exatamente. Paralelismo requer execução simultânea em diferentes cores de CPU."
        }
    ),
    QuizQuestionWithFeedback(
        id="q3",
        question="Quando usar Threading?",
        options=[
            {"id": "a", "text": "Para operações matemáticas intensivas"},
            {"id": "b", "text": "Para operações I/O (arquivos, rede, database)"},
            {"id": "c", "text": "Para garantir execução paralela"},
            {"id": "d", "text": "Apenas em linguagens compiladas"}
        ],
        correct="b",
        feedback={
            "correct": "Perfeito! Threading brilha em operações I/O onde há espera (I/O-bound).",
            "incorrect": "Pense em quando seu programa está esperando (I/O), não calculando (CPU)."
        }
    )
]

def get_questions() -> List[QuizQuestion]:
    """Return quiz questions without correct answers."""
    return [
        QuizQuestion(
            id=q.id,
            question=q.question,
            options=q.options
        )
        for q in QUIZ_DATA
    ]

def get_question_by_id(question_id: str) -> QuizQuestionWithFeedback:
    """Get a specific question with feedback."""
    for question in QUIZ_DATA:
        if question.id == question_id:
            return question
    return None

def check_answer(question_id: str, selected: str) -> Dict:
    """Check if the selected answer is correct."""
    question = get_question_by_id(question_id)
    
    if not question:
        return {"is_correct": False, "message": "Question not found", "score": 0}
    
    is_correct = selected == question.correct
    
    return {
        "is_correct": is_correct,
        "message": question.feedback["correct"] if is_correct else question.feedback["incorrect"],
        "correct_answer": question.correct,
        "score": 1 if is_correct else 0
    }
