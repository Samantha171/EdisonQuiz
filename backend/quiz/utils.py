from typing import Dict, Any, List

from .models import Quiz, Question


def create_quiz_with_questions(user, topic: str, difficulty: str, num_questions: int, questions_data: List[Dict[str, Any]]):
    quiz = Quiz.objects.create(
        user=user,
        topic=topic,
        difficulty=difficulty,
        num_questions=num_questions,
    )

    for item in questions_data[:num_questions]:
        options = item["options"]
        correct = item["correct_answer"]
        Question.objects.create(
            quiz=quiz,
            question_text=item["question"],
            option_a=options[0],
            option_b=options[1],
            option_c=options[2],
            option_d=options[3],
            correct_answer=correct,
        )

    return quiz

