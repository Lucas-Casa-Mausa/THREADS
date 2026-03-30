# 🧵 THREADS

> **Interactive Educational Platform for Concurrency Concepts**  
> Full-stack application exploring threads, concurrency, and parallelism through stunning visual animations

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-00C7B7?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Overview

**THREADS** is an immersive learning experience that transforms abstract concurrency concepts into interactive visual narratives. Through animated SVG threads, split-screen terminal simulations, and an intelligent quiz system, users grasp the difference between concurrency and parallelism in an intuitive way.

### Why This Project?

- **🎨 Visual-First Learning**: Watch threads weave and interleave in real-time
- **⚡ Modern Stack**: Built with Vite for lightning-fast HMR, not over-engineered with SSR
- **🧠 Progressive Difficulty**: From concept cards to interactive code terminals
- **📊 Progress Tracking**: PostgreSQL-backed user progress and quiz analytics

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

### 🧩 Quiz System
- 3 carefully crafted questions testing conceptual understanding
- Instant feedback with detailed explanations
- Score tracking and historical analytics (requires authentication)

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
│         SQLAlchemy · Pydantic · JWT Auth                 │
└──────────────────────┬──────────────────────────────────┘
                       │ asyncpg
                       ▼
┌─────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL 14+)                  │
│       users · progress · quiz_results                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **State Management**: Zustand 4
- **HTTP Client**: Axios
- **Syntax Highlighting**: Shiki
- **Fonts**: Syne (headings), JetBrains Mono (code)

### Backend
- **Framework**: FastAPI 0.111+
- **Server**: Uvicorn (ASGI)
- **ORM**: SQLAlchemy 2 (async)
- **Database Driver**: asyncpg
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Auth**: JWT (python-jose + bcrypt)

### Database
- **PostgreSQL 14+** with UUID extensions

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **PostgreSQL** 14+ (running locally or via Docker)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/threads.git
cd threads
```

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Configure API URL
npm run dev           # Starts on http://localhost:5173
```

### 3️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env  # Set DATABASE_URL, SECRET_KEY

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload  # Runs on http://localhost:8000
```

### 4️⃣ Database Setup (Docker)
```bash
docker run --name threads-db \
  -e POSTGRES_PASSWORD=threads123 \
  -e POSTGRES_DB=threads \
  -p 5432:5432 \
  -d postgres:14-alpine
```

---

## 🗂️ Project Structure

```
threads/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── hero/          # ThreadCanvas, ConceptCards
│   │   │   ├── timeline/      # VisualTimeline
│   │   │   ├── code/          # SplitTerminal, CodeBlock
│   │   │   ├── quiz/          # Quiz components
│   │   │   └── ui/            # Reusable primitives
│   │   ├── hooks/             # useScroll, useMousePosition, useQuiz
│   │   ├── store/             # Zustand stores
│   │   ├── lib/               # API client, constants
│   │   └── pages/             # Main views
│   └── public/
│       └── noise.svg          # Grain texture (performance-optimized)
│
├── backend/
│   ├── app/
│   │   ├── api/routes/        # Endpoint handlers
│   │   ├── core/              # Config, security
│   │   ├── db/                # Models, session
│   │   ├── schemas/           # Pydantic models
│   │   └── services/          # Business logic
│   ├── alembic/               # Database migrations
│   └── tests/
│
└── docs/                      # Architecture, API spec
```

---

## 🌐 API Endpoints

### Authentication
```http
POST   /api/auth/register      # Create new user
POST   /api/auth/login         # Get JWT token
```

### Progress Tracking
```http
GET    /api/progress/{user_id}     # Fetch completed sections
POST   /api/progress/              # Mark section as complete
```

### Quiz
```http
GET    /api/quiz/questions          # Fetch all questions (no answers)
POST   /api/quiz/submit             # Submit answer → feedback + score
GET    /api/quiz/results/{user_id} # Get user's quiz history
```

---

## 🎨 Design Decisions

| Choice | Why? |
|--------|------|
| **Vite over Next.js** | No SSR needed for this SPA; faster HMR, smaller bundle |
| **Zustand over Redux** | Minimal boilerplate, sufficient for app scope |
| **SVG over Canvas** | Better accessibility, easier to animate with Framer Motion |
| **Shiki over Prism** | Superior syntax highlighting quality, better dark themes |
| **asyncpg over psycopg2** | Native async support, aligns with FastAPI's async model |

---

## 🧪 Performance Optimizations

### Grain Texture
```css
/* Fixed position SVG — zero repaints during scroll */
body::after {
  background-image: url("/noise.svg");
  position: fixed;
  opacity: 0.04;
}
```

### Thread Animations
- Uses `pathLength` with `will-change` only during animation
- Staggered entrance delays reduce simultaneous renders
- Mobile fallback: simplified thread paths

---

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000
```

### Backend (`.env`)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/threads
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🧑‍💻 Development

### Run Tests
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && pytest
```

### Code Quality
```bash
# Frontend linting
npm run lint

# Backend formatting
black app/ && ruff check app/
```

---

## 🚢 Deployment

### Recommended Stack
- **Frontend**: [Vercel](https://vercel.com/) or Netlify
- **Backend**: [Railway](https://railway.app/) or [Render](https://render.com/)
- **Database**: Railway PostgreSQL or AWS RDS

### Build Commands
```bash
# Frontend production build
npm run build  # Output: dist/

# Backend
# No build needed — deploy directly with uvicorn
```

---

## 🗺️ Roadmap

- [x] Core ThreadCanvas animation system
- [x] Quiz with instant feedback
- [ ] User authentication (JWT)
- [ ] Progress tracking dashboard
- [ ] Dark/Light theme toggle
- [ ] Export quiz results as PDF
- [ ] Multiplayer quiz mode (WebSocket)
- [ ] Mobile-native swipe gestures

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Framer Motion** for making complex animations simple
- **FastAPI** for the best Python web framework experience
- **Vite** for instant HMR and superior DX
- **Vercel** for inspiring clean, performance-first design

---

<div align="center">

**Built with ❤️ and ☕ by the THREADS Team**

[Report Bug](https://github.com/yourusername/threads/issues) · [Request Feature](https://github.com/yourusername/threads/issues)

</div>
