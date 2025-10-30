# Career Radar

Full-stack MERN app (TypeScript) to suggest careers based on profile or a questionnaire.

## Stack
- Frontend: Vite + React + TypeScript + Tailwind CSS, React Router, React Hook Form, Zod, Axios
- Backend: Express + Node.js + MongoDB (Mongoose), JWT auth with httpOnly cookies

## Setup

1) Backend
- cd backend
- npm install
- Create .env with:
  - MONGO_URI=your_mongodb_atlas_uri
  - JWT_SECRET=some_long_secret
  - PORT=4000
  - FRONTEND_ORIGIN=http://localhost:5173
- Run dev server: npm run dev

2) Frontend
- cd frontend
- npm install
- Create .env with:
  - VITE_API_URL=http://localhost:4000
- Run dev: npm run dev

Open http://localhost:5173

## Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/user/me
- PUT /api/user/profile
- GET /api/questions
- POST /api/career/user-details
- POST /api/career/qa/submit
- GET /api/career/history
- GET /api/career/attempt/:id
