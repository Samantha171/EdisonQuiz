EdisonQuiz — AI-Powered Quiz Application

Generate personalized quizzes instantly using AI. Practice smarter, stay motivated, and track your learning progress over time.

Live Demo

Frontend: https://edisonquiz.vercel.app
Backend API: https://edisonquiz-backend.onrender.com

GitHub Repository
https://github.com/Samantha171/EdisonQuiz

Tech Stack
LayerTechnologyFrontendNext.js 14 (App Router), Tailwind CSSBackendDjango 5, Django REST FrameworkDatabasePostgreSQLAIGroq API (LLaMA 3.3 70B)AuthJWT (djangorestframework-simplejwt)PDF ParsingpdfplumberFrontend DeployVercelBackend DeployRender

How to Run Locally
Prerequisites

Python 3.10+
Node.js 18+
PostgreSQL
Groq API key (free at console.groq.com)

Backend Setup
bash# Clone the repository
git clone https://github.com/Samantha171/EdisonQuiz.git
cd EdisonQuiz/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file in backend/ folder
SECRET_KEY=your-secret-key
DB_NAME=quizdb
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
AI_API_KEY=your-groq-api-key
DEBUG=True

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
Frontend Setup
bashcd EdisonQuiz/frontend

# Install dependencies
npm install

# Create .env.local file in frontend/ folder
NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
Open http://localhost:3000

Database Design Decisions
Schema — 4 Tables
User ──< Quiz ──< Question
User ──< QuizAttempt ──< UserAnswer
Quiz ──< QuizAttempt
Question ──< UserAnswer
User
Django's built-in User model. No custom model needed since Django provides authentication, password hashing, and admin panel out of the box.
Quiz
Stores quiz metadata — topic, difficulty, num_questions. Questions are generated once at creation and stored permanently. This means quiz-taking is fast and does not depend on AI availability at quiz time.
Question
Stores each MCQ with option_a, option_b, option_c, option_d and correct_answer as direct fields instead of a separate Choice table. Since AI always generates exactly 4 options, a flat structure is simpler, faster to query, and easier to maintain.
QuizAttempt
Each time a user takes a quiz, a new attempt row is created. This enables retake tracking and full performance history. total_questions is intentionally NOT stored here — it is derived from quiz.num_questions to avoid redundant data.
UserAnswer
Stores each answer submitted per attempt with is_correct denormalized for fast result retrieval without re-joining through Question.

API Structure
Authentication
POST /api/auth/register   — Register new user
POST /api/auth/login      — Login, returns JWT token
Quiz
POST /api/quiz/generate            — Generate quiz from topic using AI
POST /api/quiz/generate-from-pdf   — Generate quiz from uploaded PDF
GET  /api/quiz/{quiz_id}           — Get quiz questions (correct answers excluded)
POST /api/quiz/{quiz_id}/submit    — Submit answers, calculate score
Results and History
GET /api/attempt/{attempt_id}  — Get result with answer review
GET /api/history               — Get all attempts for logged-in user
Key API Decision
Correct answers are deliberately excluded from GET /api/quiz/{quiz_id}. Users cannot inspect the network tab to cheat. Correct answers are only returned after submission via GET /api/attempt/{attempt_id}.

Features Implemented vs Skipped
Implemented
FeatureNotesUser registration and loginJWT authenticationTopic-based quiz generationGroq LLaMA 3.3 70BPDF-based quiz generationpdfplumber, 50 pages max, 10MB limitQuiz taking with progress barOne question at a timeScore calculationAutomatic on submitAnswer review with correct/incorrect indicatorsPer question breakdownQuiz historyAll attempts with scores and datesRetake same quizNew attempt, same questions — tracks improvementRetake new quizFresh AI generation on same topicDashboard statsReal data — quizzes taken, avg score, best scoreResponsive UITailwind CSS, dark purple themeLoading and error statesThroughout all pages
Skipped
FeatureReasonForgot passwordRequires email service configuration — significant complexity with minimal impact on core functionalitySocial loginOut of scope for MVPMultiplayer quizComplex real-time requirement, not in assignment scopePDF drag and dropNice to have — basic upload works correctly

Challenges Faced and Solutions
1. AI JSON Parsing Reliability
Groq sometimes returns JSON wrapped in markdown code blocks instead of plain JSON. Built a robust parser in ai_service.py with three fallback strategies — direct JSON parse, fenced block extraction via regex, and raw brace block extraction.
2. Duplicate Option Labels
AI was returning options like "A) Overfitting" and the frontend was adding an "A." prefix — resulting in "A. A) Overfitting". Fixed with a regex pattern in ai_service.py that strips leading A), B. patterns before storing questions in the database.
3. Model Deprecation
Initially used mixtral-8x7b-32768 which was decommissioned by Groq mid-development. Switched to llama-3.3-70b-versatile which has a 32k context window — actually better for PDF processing.
4. Render Free Tier Limitations
Shell access is not available on Render free tier making it impossible to run manage.py migrate manually. Solved by adding python manage.py migrate to the build command so migrations run automatically on every deploy.
5. Browser Autofill Styling
Browser autofill was overriding input background colors and breaking the dark theme. Fixed with -webkit-box-shadow CSS inset override in global styles.
6. Retake Logic Design
Considered two approaches — same questions on retake vs generating new questions. Chose to offer both options. Retake Same uses existing Quiz and creates a new QuizAttempt — allowing users to track improvement. Retake New calls the generate endpoint with the same parameters — giving variety without any schema changes.

Architectural Decisions
Why JWT over sessions?
JWT is stateless — works perfectly with a separate Next.js frontend and Django API without requiring server-side session storage.
Why generate questions upfront?
AI calls happen at quiz creation, not during quiz-taking. This ensures a fast, reliable quiz experience even if the AI service is temporarily unavailable.
Why a separate QuizAttempt model?
Enables retake functionality cleanly. Each attempt is independent with its own score and answers — no need to delete or modify previous data when retaking.
Why flat options on the Question model?
AI always generates exactly 4 options (A, B, C, D). A separate Choice table would add unnecessary joins with zero benefit for this fixed structure.
Why Groq over OpenAI?
Groq offers a generous free tier with no credit card required — making it ideal for a portfolio project. The LLaMA 3.3 70B model performs well for structured JSON generation.

Note on Free Tier Deployment
The backend is hosted on Render free tier. Free instances spin down after inactivity and may take up to 50 seconds to respond on the first request after a period of inactivity. Subsequent requests are fast. This is expected behavior on the free plan.
