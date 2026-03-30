// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Theme Colors
export const THREAD_COLORS = {
  cyan: '#00FFD1',
  green: '#39FF14',
  coral: '#FF6B6B',
  yellow: '#FFD700',
};

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Animation Timings
export const ANIMATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  verySlow: 1.2,
};

// Quiz Config
export const QUIZ_CONFIG = {
  totalQuestions: 3,
  scorePerQuestion: 1,
  passingScore: 2,
};

// Thread Paths (for ThreadCanvas)
export const THREAD_PATHS = [
  { d: "M0,200 C200,100 400,300 800,150", color: THREAD_COLORS.cyan },
  { d: "M0,250 C150,350 500,100 800,200", color: THREAD_COLORS.green },
  { d: "M0,300 C300,200 600,400 800,250", color: THREAD_COLORS.coral },
  { d: "M0,180 C250,280 550,80  800,300", color: THREAD_COLORS.yellow },
];

// Sections for Progress Tracking
export const SECTIONS = {
  HERO: 'hero',
  TIMELINE: 'timeline',
  CODE: 'code',
  QUIZ: 'quiz',
};
