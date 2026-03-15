from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import pdfplumber
from .ai_service import generate_questions, generate_questions_from_text, AI_ERROR_MESSAGE
from .models import Quiz, Question, QuizAttempt, UserAnswer
from .serializers import QuizDetailSerializer
from .utils import create_quiz_with_questions


class GenerateQuizFromPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pdf_file = request.FILES.get("pdf")
        difficulty = request.data.get("difficulty")
        num_questions = request.data.get("num_questions")

        if not pdf_file or not difficulty or not num_questions:
            return Response({"error": "PDF file, difficulty, and number of questions are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            num_questions = int(num_questions)
            if not (5 <= num_questions <= 20):
                raise ValueError
        except ValueError:
            return Response({"error": "Number of questions must be between 5 and 20."}, status=status.HTTP_400_BAD_REQUEST)

        if not pdf_file.name.lower().endswith(".pdf"):
            return Response({"error": "Invalid file type. Only PDF files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

        if pdf_file.size > 10 * 1024 * 1024:
            return Response({"error": "PDF exceeds 10MB limit"}, status=status.HTTP_400_BAD_REQUEST)

        extracted_text = ""
        try:
            with pdfplumber.open(pdf_file) as pdf:
                # Limit extraction: max_pages = 15
                pages_to_extract = pdf.pages[:50]
                for page in pages_to_extract:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        except Exception as e:
            return Response({"error": f"Failed to extract text from PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        if len(extracted_text.strip()) < 100:
            return Response({"error": "This PDF appears to be scanned or image-based. Please upload a text-based PDF."}, status=status.HTTP_400_BAD_REQUEST)

        # Limit Text Sent to AI: max_chars = 8000
        truncated_text = extracted_text[:20000]

        try:
            questions_data = generate_questions_from_text(truncated_text, difficulty, num_questions)
        except Exception:
            return Response(AI_ERROR_MESSAGE, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if not questions_data:
            return Response(AI_ERROR_MESSAGE, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        topic = pdf_file.name[:100]  # Use filename as topic
        quiz = create_quiz_with_questions(request.user, topic, difficulty, num_questions, questions_data)

        return Response({"quiz_id": quiz.id}, status=status.HTTP_201_CREATED)


class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get("topic")
        difficulty = request.data.get("difficulty")
        num_questions = int(request.data.get("num_questions", 0))

        if not topic or not difficulty or not (5 <= num_questions <= 20):
            return Response(
                {"error": "Invalid input data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            questions_data = generate_questions(topic, difficulty, num_questions)
        except Exception:
            return Response(AI_ERROR_MESSAGE, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if not questions_data:
            return Response(AI_ERROR_MESSAGE, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        quiz = create_quiz_with_questions(request.user, topic, difficulty, num_questions, questions_data)
        return Response(
            {
                "quiz_id": quiz.id,
                "topic": quiz.topic,
                "difficulty": quiz.difficulty,
                "num_questions": quiz.num_questions,
            },
            status=status.HTTP_201_CREATED,
        )


class QuizDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id: int):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        serializer = QuizDetailSerializer(quiz)
        data = serializer.data
        return Response(
            {
                "quiz_id": data["id"],
                "topic": data["topic"],
                "difficulty": data["difficulty"],
                "num_questions": data["num_questions"],
                "questions": data["questions"],
            }
        )


class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id: int):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        answers = request.data.get("answers", [])

        if not isinstance(answers, list) or not answers:
            return Response({"error": "Answers are required"}, status=status.HTTP_400_BAD_REQUEST)

        question_map = {q.id: q for q in quiz.questions.all()}
        score = 0

        attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, score=0)

        for ans in answers:
            qid = ans.get("question_id")
            selected = ans.get("selected_answer")
            if qid not in question_map or selected not in ["A", "B", "C", "D"]:
                continue
            question = question_map[qid]
            is_correct = question.correct_answer == selected
            if is_correct:
                score += 1
            UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected,
                is_correct=is_correct,
            )

        attempt.score = score
        attempt.save(update_fields=["score"])

        return Response(
            {
                "attempt_id": attempt.id,
                "quiz_id": quiz.id,
                "score": attempt.score,
            }
        )


class AttemptDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, attempt_id: int):
        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
        quiz = attempt.quiz
        answers_qs = attempt.answers.select_related("question").all()

        answers_data = []
        for ans in answers_qs:
            q = ans.question
            choice_map = {
                "A": "option_a",
                "B": "option_b",
                "C": "option_c",
                "D": "option_d",
            }
            correct_answer_text = getattr(q, choice_map[q.correct_answer])
            selected_answer_text = getattr(q, choice_map.get(ans.selected_answer, "option_a"))
            answers_data.append(
                {
                    "question": q.question_text,
                    "selected_answer": selected_answer_text,
                    "correct_answer": correct_answer_text,
                    "is_correct": ans.is_correct,
                }
            )

        return Response(
            {
                "attempt_id": attempt.id,
                "quiz_id": quiz.id,
                "topic": quiz.topic,
                "difficulty": quiz.difficulty,
                "num_questions": quiz.num_questions,
                "score": attempt.score,
                "answers": answers_data,
            }
        )


class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = (
            QuizAttempt.objects.filter(user=request.user)
            .select_related("quiz")
            .order_by("-attempted_at")
        )
        data = []
        for attempt in attempts:
            quiz = attempt.quiz
            data.append(
                {
                    "attempt_id": attempt.id,
                    "quiz_id": quiz.id,
                    "topic": quiz.topic,
                    "difficulty": quiz.difficulty,
                    "num_questions": quiz.num_questions,
                    "score": attempt.score,
                    "attempted_at": attempt.attempted_at,
                }
            )
        return Response(data)
