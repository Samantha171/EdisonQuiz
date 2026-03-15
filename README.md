# EdisonQuiz — AI-Powered Quiz Application

EdisonQuiz is a web application that generates quizzes using AI.  
Users can create quizzes from a **topic** or from **uploaded study material (PDF or TXT)**, attempt the quiz, review their answers, and track their quiz history.

The goal of this project was to build a practical application that combines **AI, modern web development, and backend API design** into a single learning platform.

---

## Live Demo

Frontend  
https://edisonquiz.vercel.app  

Backend API  
https://edisonquiz-backend.onrender.com  

GitHub Repository  
https://github.com/Samantha171/EdisonQuiz

---

# Features

### Topic-Based Quiz Generation
Users can generate quizzes by entering any topic.  
The AI model creates multiple-choice questions based on the topic and difficulty level.

Options available:
- Easy / Medium / Hard difficulty
- 5–20 questions per quiz

---

### PDF-Based Quiz Generation
Users can upload study material as a PDF or TXT file and generate questions directly from it.

How it works:
1. The backend extracts text from the uploaded material
2. The extracted content is sent to the AI model
3. The AI generates questions from the material

Limits applied:
- Maximum file size: **10MB**
- Maximum pages processed: **50 pages**

---

### Quiz Attempt Interface
The quiz interface is designed to be simple and focused.

Features:
- One question displayed at a time
- Option selection with visual feedback
- Navigation between questions
- Submit answers at the end

---

### Result Review
After submitting a quiz, users can see:

- Final score
- Percentage accuracy
- Correct vs incorrect answers
- Full review of each question

---

### Quiz History
Each quiz attempt is stored so users can track progress.

The history page shows:
- Topic
- Difficulty
- Score
- Date attempted

Users can also retake previous quizzes.

---

### Retake Options

Users have two ways to retake a quiz from the history page.

**Retake Same Quiz**  
Loads the same set of questions again and creates a new attempt.  
This allows users to track improvement on the same material.

**Retake New Quiz**  
Generates a brand new quiz on the same topic, difficulty, and number of questions.  
This gives variety while keeping the same learning goal.

### Authentication
The application includes a basic authentication system.

Users can:
- Register an account
- Log in
- Access protected quiz features

Authentication is implemented using **JWT tokens**.

---

### UI Design
The interface uses a dark theme with purple highlights.

Design features include:
- Card-based layout
- Responsive design
- Mobile-friendly UI
- Smooth hover interactions

---

# Tech Stack

### Frontend
- Next.js (React framework)
- Tailwind CSS
- Axios for API requests
- Lucide Icons

Frontend is deployed on **Vercel**.

---

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Gunicorn

Backend is deployed on **Render**.

---

### AI Integration
- Groq API
- LLaMA 3.3 70B model

The AI model is used to generate quiz questions based on topic or PDF content.

---

# System Architecture


```
User (Browser)
      │
      │  HTTP Requests
      ▼
Frontend — Next.js
(Deployed on Vercel)
      │
      │  REST API Calls (Axios)
      │  JWT Token in Headers
      ▼
Backend — Django REST Framework
(Deployed on Render)
      │
      ├──────────────────────┐
      │                      │
      ▼                      ▼
PostgreSQL Database     Groq AI API
(Render)                (LLaMA 3.3 70B)
```


---

# Running the Project Locally

## Prerequisites

Make sure the following are installed:

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL
- Groq API key

---

# Backend Setup

## Clone the repository

```bash
git clone https://github.com/Samantha171/EdisonQuiz.git
cd EdisonQuiz/backend
```

---

# Running the Project Locally

## Prerequisites

Make sure the following are installed:

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL
- Groq API key

---

# Backend Setup

## Clone the repository

```bash
git clone https://github.com/Samantha171/EdisonQuiz.git
cd EdisonQuiz/backend
```

## Create virtual environment

```bash
python -m venv venv
```

## Activate environment

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Create .env file inside the backend folder
```bash
SECRET_KEY=your-secret-key
DB_NAME=quizdb
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
AI_API_KEY=your-groq-api-key
DEBUG=True
```

## Run database migrations
```bash
python manage.py migrate
```

## Start backend server
```bash
python manage.py runserver
```

## Backend runs on:
```bash
http://localhost:8000
```

# Frontend Setup

## Open a new terminal
```bash
cd EdisonQuiz/frontend
```

## Install dependencies
```bash
npm install
```

## Create .env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Start development server
```bash
npm run dev
```

## Frontend runs on:
```bash
http://localhost:3000
```


---

# Database Design Decisions

The database was designed with simplicity and performance in mind.

## User

Uses Django’s built-in User model.

Reasons:

- Secure password hashing
- Built-in authentication
- Admin panel support

---

## Quiz

Stores quiz metadata.

Fields include:

- topic
- difficulty
- number of questions
- creation timestamp

Questions are generated **once when the quiz is created**.

This ensures:

- Faster quiz loading
- No dependency on AI availability during quiz attempts

---

## Question

Each quiz contains multiple questions.

Each question stores:

- question text
- option A
- option B
- option C
- option D
- correct answer

A flat structure was chosen instead of a separate choices table because each question always contains exactly four options.

---

## QuizAttempt

Stores each time a user attempts a quiz.

Allows:

- multiple attempts
- performance tracking
- quiz history

---

## UserAnswer

Stores each answer submitted during a quiz attempt.

Includes:

- selected option
- whether the answer was correct

Correctness is stored directly to avoid recalculating results later.

---

# Database Relationships

### User → Quiz
One user can create many quizzes.

### User → QuizAttempt
One user can have many attempts.

### Quiz → Question
One quiz has many questions.

### Quiz → QuizAttempt
One quiz can have many attempts (retakes).

### QuizAttempt → UserAnswer
One attempt has many answers (one per question).

### Question → UserAnswer
One question can appear in many answers (across attempts).

---

# API Structure

## Authentication

Register user


POST /api/auth/register


Login user


POST /api/auth/login


Returns JWT token.

---

## Quiz Generation

Generate quiz from topic


POST /api/quiz/generate


Example request


{
"topic": "Machine Learning",
"difficulty": "medium",
"num_questions": 10
}


---

Generate quiz from PDF


POST /api/quiz/generate-from-pdf


Backend process:

1. Extract text using pdfplumber
2. Limit pages to avoid extremely large inputs
3. Send extracted text to AI model
4. Store generated questions

---

## Quiz Retrieval


GET /api/quiz/{quiz_id}


Returns quiz questions.

Correct answers are not included at this stage.

---

## Quiz Submission


POST /api/quiz/{quiz_id}/submit


Submits answers and calculates the score.

---

## Results


GET /api/attempt/{attempt_id}


Returns full result and answer review.

---

## Quiz History


GET /api/history


Returns all quiz attempts for the logged-in user.

---

# Key API Security Decision

Correct answers are **not returned when fetching quiz questions**.


GET /api/quiz/{quiz_id}


This prevents users from inspecting the browser network tab to obtain answers before submitting.

Correct answers are only revealed after submission.

---

# Challenges Faced

## AI Output Formatting

The AI sometimes returned JSON wrapped inside markdown code blocks.

Solution:

A parser was implemented to handle:

- plain JSON
- markdown blocks
- raw text extraction

---

## Duplicate Option Labels

AI sometimes returned answers like


A) Overfitting


while the frontend added labels again.

This produced:


A. A) Overfitting


The backend now cleans labels before storing options.

---

## Model Deprecation

An earlier AI model used during development was deprecated.

The system was updated to use


LLaMA 3.3 70B


which also supports larger context sizes for PDF processing.

---

## Deployment Issues

Since frontend and backend were deployed on different platforms (Vercel and Render), CORS configuration was required.

---

# Features Implemented

- User registration and login
- Topic-based quiz generation
- PDF-based quiz generation
- Interactive quiz interface
- Result analysis and review
- Quiz history
- Retake quiz functionality 
- Responsive UI
- Deployment to Vercel and Render

---

# Features Skipped

Some features were considered but not implemented:

- Password reset via email
- Social login
- Multiplayer quizzes

These would require additional infrastructure and were outside the scope of the assignment.

---

# Future Improvements

Possible future enhancements include:

- AI explanations for answers
- Leaderboards
- Timed quizzes
- Quiz sharing via link
- Download quiz results as PDF
- OCR support for scanned PDFs

---

# Author

Samantha  
Integrated MSc Software Systems  
PSG College of Technology
