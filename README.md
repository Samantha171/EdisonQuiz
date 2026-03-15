# EdisonQuiz

An AI-powered quiz app where you can generate quizzes on any topic, take them, and track how you improve over time. You can also upload your own study material (PDF or TXT) and the AI will generate questions directly from it.

**Live App:** https://edisonquiz.vercel.app  
**Backend API:** https://edisonquiz-backend.onrender.com  
**GitHub:** https://github.com/Samantha171/EdisonQuiz

---

## What it does

- Register and log in securely
- Generate a quiz on any topic — just type what you want to be tested on
- Upload a PDF or TXT file and get questions based on your own material
- Take the quiz one question at a time with a progress bar
- See your score and review every answer after submitting
- Retake the same quiz to track improvement, or generate fresh questions on the same topic
- View your full quiz history with scores and dates

---

## Running it locally

You'll need Python 3.10+, Node.js 18+, PostgreSQL, and a free Groq API key from [console.groq.com](https://console.groq.com).

**Backend**

```bash
git clone https://github.com/Samantha171/EdisonQuiz.git
cd EdisonQuiz/backend

python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
SECRET_KEY=any-random-string
DB_NAME=quizdb
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
AI_API_KEY=your-groq-api-key
DEBUG=True
```

Then run:

```bash
python manage.py migrate
python manage.py runserver
```

**Frontend**

```bash
cd EdisonQuiz/frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

---

## Database design

I kept the schema as simple as possible — 4 tables total.

**User** — I used Django's built-in User model instead of building a custom one. It already handles password hashing, authentication, and the admin panel out of the box.

**Quiz** — Stores the topic, difficulty, and number of questions. Questions are generated upfront when a quiz is created and saved to the database. This makes quiz-taking instant and independent of AI availability.

**Question** — Each question has `option_a`, `option_b`, `option_c`, `option_d`, and `correct_answer` stored directly on the row. I considered a separate Choice table but since the AI always generates exactly 4 options, it would've just added extra joins with no real benefit.

**QuizAttempt** — Every time someone takes a quiz, a new attempt row is created. This is what makes the retake feature work cleanly — each attempt is fully independent. I intentionally didn't store `total_questions` here since it's already on the Quiz table — no point storing the same value twice.

**UserAnswer** — Stores the answer the user picked for each question along with whether it was correct. Keeping `is_correct` here means the result page doesn't need to re-join through Question to figure out what was right or wrong.

---

## API structure

```
POST   /api/auth/register
POST   /api/auth/login

POST   /api/quiz/generate
POST   /api/quiz/generate-from-pdf
GET    /api/quiz/{quiz_id}
POST   /api/quiz/{quiz_id}/submit

GET    /api/attempt/{attempt_id}
GET    /api/history
```

One thing I was deliberate about — `GET /api/quiz/{quiz_id}` does not return correct answers. Anyone could open the network tab and cheat otherwise. Correct answers only come back through `GET /api/attempt/{attempt_id}` after the quiz is submitted.

---

## Features implemented vs skipped

**Built:**
- JWT authentication with protected routes
- Topic-based quiz generation using Groq LLaMA 3.3 70B
- PDF and TXT upload — AI generates questions from your own material (up to 50 pages, 10MB)
- Full quiz-taking flow with progress bar
- Score calculation and per-question answer review with correct/incorrect indicators
- Retake same quiz and retake with new AI-generated questions
- Full quiz history with color-coded scores
- Dashboard with real stats from history (quizzes taken, avg score, best score)
- Loading states, error handling, and empty states throughout

**Skipped:**
- Forgot password — needs an email service to work. Not worth the complexity for the core flow.
- Social login — not needed for the MVP.
- PDF drag and drop — the file picker works fine for what's needed here.

---

## Challenges I ran into

**Getting consistent JSON from the AI** — Groq would sometimes return JSON inside markdown code blocks. Built a parser with multiple fallback strategies: direct parse, fenced block extraction, and raw brace block extraction.

**Duplicate option labels** — The AI was returning options like "A) Overfitting" and the frontend was also adding "A." — showing "A. A) Overfitting". Fixed with a regex in `ai_service.py` that strips the AI's label before saving.

**Model got deprecated mid-project** — Was using `mixtral-8x7b-32768` and Groq decommissioned it. Switched to `llama-3.3-70b-versatile` which has a bigger context window — better for PDF content anyway.

**No shell access on Render free tier** — Couldn't run migrations manually. Solved by adding `python manage.py migrate` to the build command so it runs automatically on every deploy.

**Retake design decision** — Went back and forth on whether retaking should show same questions or new ones. Built both. Retake Same reuses existing questions and creates a new attempt — good for tracking improvement. Retake New generates fresh questions — good for variety. Both buttons are on the result page and history page.

---

## Tech stack

| | |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Django, Django REST Framework |
| Database | PostgreSQL |
| AI | Groq API — LLaMA 3.3 70B |
| Auth | JWT via djangorestframework-simplejwt |
| PDF parsing | pdfplumber |
| Deployed on | Vercel (frontend) and Render (backend) |

---

> The backend runs on Render's free tier which spins down after inactivity. The first request after a quiet period can take around 50 seconds. After that it's fast.
