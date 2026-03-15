# AI-Powered Quiz Application

This is a fullstack AI-powered quiz application built for an interview assignment.

- **Frontend**: Next.js (App Router), Tailwind CSS, Axios
- **Backend**: Django, Django REST Framework, PostgreSQL, JWT (SimpleJWT), Gemini API

## Backend (Django)

### Setup

```bash
cd quiz-app/backend
python -m venv env
env\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Configure `backend/.env` (already created) with:

- `SECRET_KEY`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `AI_API_KEY`

Run migrations and start the server:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Key API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/quiz/generate`
- `GET /api/quiz/{quiz_id}`
- `POST /api/quiz/{quiz_id}/submit`
- `GET /api/attempt/{attempt_id}`
- `GET /api/history`

## Frontend (Next.js)

### Setup

```bash
cd quiz-app/frontend
npm install
npm run dev
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend uses:

- `localStorage` key `token` for JWT
- Axios interceptor to attach `Authorization: Bearer <token>`

## Deployment Notes

- **Backend (Render)**: Use `gunicorn quizapp.wsgi:application` as the start command, configure environment variables, and PostgreSQL database.
- **Frontend (Vercel)**: Import `quiz-app/frontend`, set `NEXT_PUBLIC_API_URL` to the deployed backend URL.

