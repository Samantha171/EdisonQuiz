import logging
import os
from typing import List, Dict, Any

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

logger = logging.getLogger(__name__)

AI_ERROR_MESSAGE = {"error": "Failed to generate quiz. Please try again."}


def _get_client() -> "Groq":
    """
    Initialize and return a Groq client using the API key from the environment.
    """
    api_key = os.getenv("AI_API_KEY")
    logger.info("Initializing Groq client. AI_API_KEY loaded: %s", bool(api_key))
    print("Initializing Groq client. AI_API_KEY loaded:", bool(api_key))

    if not api_key:
        raise RuntimeError("AI_API_KEY is not configured")

    return Groq(api_key=api_key)


def _parse_model_response(raw_text: str) -> Dict[str, Any]:
    """
    Parse AI model response content into a Python dict.
    Handles plain JSON as well as markdown ```json fenced blocks.
    """
    import json
    import re
    from json import JSONDecodeError

    text = (raw_text or "").strip()

    # First, try to parse the whole response as JSON directly.
    try:
        return json.loads(text)
    except JSONDecodeError:
        logger.warning("Model response is not plain JSON. Attempting to extract JSON via regex.")

    # Try to extract a fenced ```json ... ``` block (or ``` ... ```).
    fenced_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text, flags=re.IGNORECASE)
    json_candidate = None
    if fenced_match:
        json_candidate = fenced_match.group(1).strip()
        logger.info("Extracted JSON from fenced markdown block.")
    else:
        # Fallback: grab the first {...} block.
        brace_match = re.search(r"\{[\s\S]*\}", text)
        if brace_match:
            json_candidate = brace_match.group(0)
            logger.info("Extracted JSON from first brace block in response.")

    if not json_candidate:
        raise ValueError("No JSON content found in model response.")

    try:
        return json.loads(json_candidate)
    except JSONDecodeError as exc:
        logger.error("Failed to parse extracted JSON candidate from model response: %s", exc)
        raise


def generate_questions(topic: str, difficulty: str, num_questions: int) -> List[Dict[str, Any]]:
    """
    Call the AI model to generate multiple choice questions based on a topic.
    """
    prompt = (
        "You are a quiz generator. Create strictly JSON output.\n"
        "Generate {num} multiple choice questions about the topic \"{topic}\" "
        "with overall difficulty \"{difficulty}\".\n"
        "Respond ONLY with a JSON object named 'questions' like:\n"
        "{{\"questions\": [{{\"question\": \"...\", \"options\": [\"A ...\", \"B ...\", \"C ...\", \"D ...\"], "
        "\"correct_answer\": \"A\"}}]}}\n"
        "Rules:\n"
        "- Exactly 4 options per question.\n"
        "- correct_answer must be one of: 'A', 'B', 'C', 'D'.\n"
    ).format(num=num_questions, topic=topic, difficulty=difficulty)

    return _generate_with_prompt(prompt, num_questions)


def generate_questions_from_text(text: str, difficulty: str, num_questions: int) -> List[Dict[str, Any]]:
    """
    Call the AI model to generate multiple choice questions based on provided text.
    """
    prompt = (
        "You are an AI tutor. Generate {num} multiple choice questions based on the following study material.\n"
        "Material:\n{text}\n\n"
        "Rules:\n"
        "- 4 options per question.\n"
        "- Only one correct answer.\n"
        "- Difficulty: {difficulty}.\n"
        "Respond ONLY with a JSON object named 'questions' like:\n"
        "{{\"questions\": [{{\"question\": \"...\", \"options\": [\"A ...\", \"B ...\", \"C ...\", \"D ...\"], "
        "\"correct_answer\": \"A\"}}]}}\n"
    ).format(num=num_questions, text=text, difficulty=difficulty)

    return _generate_with_prompt(prompt, num_questions)


def _generate_with_prompt(prompt: str, num_questions: int) -> List[Dict[str, Any]]:
    """
    Common logic to call AI model with a prompt and normalize output.
    """
    try:
        import traceback
        client = _get_client()

        # Ensure we always use the intended Groq model.
        model_name = "llama-3.3-70b-versatile"
        logger.info("Using Groq model: %s", model_name)
        print("Using Groq model:", model_name)

        logger.info(
            "Sending prompt to Groq for num_questions=%s",
            num_questions,
        )

        completion = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
        )

        # Extract text content from the first choice.
        text = ""
        if (
            completion
            and getattr(completion, "choices", None)
            and len(completion.choices) > 0
            and completion.choices[0].message
        ):
            text = (completion.choices[0].message.content or "").strip()

        logger.info("Groq raw response text length: %s", len(text))
        print("Groq raw response:", text)

        data = _parse_model_response(text)
        logger.info("Parsed model response keys: %s", list(data.keys()))

        questions = data.get("questions", [])
        if not isinstance(questions, list) or not questions:
            raise ValueError("Invalid 'questions' structure in model response.")

        import re

        normalized: List[Dict[str, Any]] = []
        # Strip leading "A)", "B.", etc. from option text so we don't duplicate labels in the UI.
        option_label_pat = re.compile(r"^[A-D][.)]\s*", re.IGNORECASE)

        for idx, q in enumerate(questions):
            question_text = q.get("question")
            options = q.get("options", [])
            correct = q.get("correct_answer")

            if (
                not question_text
                or not isinstance(options, list)
                or len(options) != 4
                or correct not in ["A", "B", "C", "D"]
            ):
                logger.warning("Skipping invalid question at index %s: %s", idx, q)
                continue

            options_clean = [
                (option_label_pat.sub("", str(o)).strip() or str(o)) for o in options
            ]
            normalized.append(
                {
                    "question": question_text,
                    "options": options_clean,
                    "correct_answer": correct,
                }
            )

        if not normalized:
            raise ValueError("No valid questions generated from model response.")

        # Trim to requested number of questions if Gemini returned more.
        if len(normalized) > num_questions:
            normalized = normalized[:num_questions]

        logger.info("Returning %s normalized questions from model.", len(normalized))
        return normalized

    except Exception as exc:
        # Log full exception details for debugging while still letting the view handle the 503.
        logger.error("Error during AI quiz generation: %s", exc, exc_info=True)
        print("Error during AI quiz generation:", repr(exc))
        traceback.print_exc()
        raise
