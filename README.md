# 🧵 THREADS

> **Interactive Educational Platform for Concurrency Concepts**  
> Full-stack application exploring threads, concurrency, and parallelism through stunning visual animations

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-00C7B7?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Overview

**THREADS** is an immersive learning experience that transforms abstract concurrency concepts into interactive visual narratives. Through animated SVG threads, split-screen terminal simulations, and an intelligent quiz system, users grasp the difference between concurrency and parallelism in an intuitive way.

### Why This Project?

- **🎨 Visual-First Learning**: Watch threads weave and interleave in real-time
- **⚡ Modern Stack**: Built with Vite for lightning-fast HMR and Tailwind CSS
- **🧠 Progressive Difficulty**: From concept cards to interactive code terminals
- **📊 Progress & Quiz Tracking**: PostgreSQL 17-backed user progress and quiz analytics
- **🛡️ Secure & Robust**: JWT authentication, rate limiting, and automated CI test suite

---

## ✨ Features

### 🎭 Hero Section — ThreadCanvas
- **SVG Path Animations** powered by Framer Motion
- Scroll-triggered thread progression with `useScroll`
- Mouse parallax effects on desktop (subtle, performance-optimized)
- Color-coded threads representing different execution paths

### 📈 Visual Timeline
- Interactive comparison: Sequential vs Concurrent vs Parallel
- Animated state transitions (`isRunning`, `isBlocked`, `isComplete`)
- Real-time progress bars synced with visual elements

### 💻 Split Terminal
- Dual panes showing code execution side-by-side
- Syntax highlighting via `shiki` (GitHub Dark theme)
- Simulated terminal output with typing animations

### 🧩 Dynamic Quiz System
- Questions stored in PostgreSQL with automated database seeding
- Instant feedback with detailed explanations
- Score tracking, summaries, and historical analytics for authenticated users

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                 │
│         Tailwind · Framer Motion · Zustand               │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                       │
│      SQLAlchemy 2 Async · Pydantic · JWT Auth            │
└──────────────────────┬──────────────────────────────────┘
                       │ asyncpg
                       ▼
┌─────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL 17+)                  │
│   users · progress · quiz_questions · quiz_results       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS 4 + PostCSS
- **Animations**: Framer Motion 12
- **State Management**: Zustand
- **HTTP Client**: Axios (with auth interceptors)
- **Syntax Highlighting**: Shiki
- **Fonts**: Syne (headings), JetBrains Mono (code)

### Backend
- **Framework**: FastAPI 0.111+
- **Server**: Uvicorn (ASGI)
- **ORM**: SQLAlchemy 2 (Async)
- **Database Driver**: asyncpg 0.31+
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Auth**: JWT (`python-jose` + native `bcrypt`)
- **Rate Limiting**: SlowAPI

### Database & DevOps
- **PostgreSQL 17+** (via Docker Compose)
- **CI/CD**: GitHub Actions (automated test runner and build checks on PRs to `main`)

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 20+ (for frontend)
- **Python** 3.11+ (Python 3.13 recommended)
- **Docker** and Docker Compose

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/threads.git
cd threads
```

### 2️⃣ Start the Database (PostgreSQL 17)
```bash
docker compose up -d
```

### 3️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --reload  # Runs on http://localhost:8000
```

### 4️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev                    # Starts on http://localhost:5173
```

---

## 🌐 API Endpoints

### System & Health
```http
GET    /health                 # Checks API & PostgreSQL connectivity
GET    /                       # API metadata and documentation link
```

### Authentication
```http
POST   /api/auth/register      # Create new user account
POST   /api/auth/login         # Login and receive JWT access token
GET    /api/auth/me            # Get current authenticated user profile
```

### Progress Tracking
```http
GET    /api/progress/{user_id} # Fetch completed sections for user
POST   /api/progress/          # Mark section as complete
```

### Quiz
```http
GET    /api/quiz/questions          # Fetch all active questions (sanitized)
POST   /api/quiz/submit             # Submit answer → receive score & feedback
GET    /api/quiz/results/{user_id} # Get user's quiz submission history
GET    /api/quiz/summary/{user_id} # Get user's score summary & percentage
```

---

## 🧪 Testing & CI Pipeline

### Run Backend Tests (Automated with Pytest)
```bash
cd backend
pytest -v
```
The test suite includes 22 tests covering:
- Health check database connectivity
- User registration, duplicate validation, and secure password hashing
- Authentication, JWT issuance, `/me` profile, and expired/invalid token handling
- Progress persistence and IDOR protection
- Quiz questions sanitation, answer validation, score calculation, and seed idempotency

### Build Frontend
```bash
cd frontend
npm run build
```

### Continuous Integration (CI)
A GitHub Actions workflow is located at [`.github/workflows/ci.yml`](.github/workflows/ci.yml), automatically triggering on pushes and pull requests to `main`:
- Spins up PostgreSQL 17 service container
- Runs complete Python backend pytest suite
- Validates frontend dependencies and production build

---

## 🗺️ Roadmap

- [x] Core ThreadCanvas animation system
- [x] Interactive Visual Timeline simulation
- [x] Split Terminal with Shiki syntax highlighting
- [x] Dynamic Quiz stored in PostgreSQL 17 with instant feedback
- [x] User authentication (JWT + bcrypt + protected endpoints)
- [x] Automated test suite & GitHub Actions CI pipeline
- [ ] Progress tracking dashboard
- [ ] Dark/Light theme toggle
- [ ] Export quiz results as PDF
- [ ] Multiplayer quiz mode (WebSocket)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
