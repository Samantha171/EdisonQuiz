from rest_framework import serializers

from .models import Quiz, Question, QuizAttempt, UserAnswer


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "topic", "difficulty", "num_questions", "created_at"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "id",
            "question_text",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
        ]


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "topic", "difficulty", "num_questions", "questions"]

    def get_questions(self, obj):
        questions = obj.questions.all()
        data = []
        for q in questions:
            data.append(
                {
                    "question_id": q.id,
                    "question": q.question_text,
                    "options": [
                        {"key": "A", "text": q.option_a},
                        {"key": "B", "text": q.option_b},
                        {"key": "C", "text": q.option_c},
                        {"key": "D", "text": q.option_d},
                    ],
                }
            )
        return data


class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ["id", "quiz", "score", "attempted_at"]


class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ["id", "attempt", "question", "selected_answer", "is_correct"]

