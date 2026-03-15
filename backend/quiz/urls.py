from django.urls import path

from .views import (
    GenerateQuizView,
    GenerateQuizFromPDFView,
    QuizDetailView,
    SubmitQuizView,
    AttemptDetailView,
    HistoryView,
)

urlpatterns = [
    path("quiz/generate", GenerateQuizView.as_view(), name="quiz-generate"),
    path("quiz/generate-from-pdf", GenerateQuizFromPDFView.as_view(), name="quiz-generate-pdf"),
    path("quiz/<int:quiz_id>", QuizDetailView.as_view(), name="quiz-detail"),
    path("quiz/<int:quiz_id>/submit", SubmitQuizView.as_view(), name="quiz-submit"),
    path("attempt/<int:attempt_id>", AttemptDetailView.as_view(), name="attempt-detail"),
    path("history", HistoryView.as_view(), name="history"),
]

