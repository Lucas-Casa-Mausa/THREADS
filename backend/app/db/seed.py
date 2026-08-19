from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.quiz_question import QuizQuestion

INITIAL_QUESTIONS = [
    {
        "id": "q1",
        "question": "O que melhor descreve Concorrência?",
        "options": [
            {"id": "a", "text": "Duas tarefas executam exatamente ao mesmo tempo"},
            {"id": "b", "text": "Múltiplas tarefas progridem em períodos sobrepostos"},
            {"id": "c", "text": "Uma tarefa espera outra terminar"},
            {"id": "d", "text": "Tarefas em threads separadas do SO"}
        ],
        "correct": "b",
        "feedback": {
            "correct": "Exato! Concorrência é sobre estrutura, não execução simultânea.",
            "incorrect": "Quase! Concorrência significa gerenciar múltiplas tarefas — não necessariamente ao mesmo tempo."
        }
    },
    {
        "id": "q2",
        "question": "Qual afirmação é verdadeira sobre Paralelismo?",
        "options": [
            {"id": "a", "text": "Pode acontecer em um único core de CPU"},
            {"id": "b", "text": "É o mesmo que concorrência"},
            {"id": "c", "text": "Requer múltiplos cores de CPU"},
            {"id": "d", "text": "É sempre mais rápido que código sequencial"}
        ],
        "correct": "c",
        "feedback": {
            "correct": "Correto! Paralelismo verdadeiro precisa de hardware com múltiplos cores.",
            "incorrect": "Não exatamente. Paralelismo requer execução simultânea em diferentes cores de CPU."
        }
    },
    {
        "id": "q3",
        "question": "Quando usar Threading?",
        "options": [
            {"id": "a", "text": "Para operações matemáticas intensivas"},
            {"id": "b", "text": "Para operações I/O (arquivos, rede, database)"},
            {"id": "c", "text": "Para garantir execução paralela"},
            {"id": "d", "text": "Apenas em linguagens compiladas"}
        ],
        "correct": "b",
        "feedback": {
            "correct": "Perfeito! Threading brilha em operações I/O onde há espera (I/O-bound).",
            "incorrect": "Pense em quando seu programa está esperando (I/O), não calculando (CPU)."
        }
    }
]

async def seed_quiz_questions(db: AsyncSession) -> None:
    """Populate default quiz questions if they don't already exist."""
    for q_data in INITIAL_QUESTIONS:
        result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == q_data["id"]))
        existing = result.scalar_one_or_none()
        if not existing:
            new_question = QuizQuestion(
                id=q_data["id"],
                question=q_data["question"],
                options=q_data["options"],
                correct=q_data["correct"],
                feedback=q_data["feedback"],
            )
            db.add(new_question)
    await db.commit()
