import { Helmet } from 'react-helmet-async'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/hero/HeroSection'
import VisualTimeline from '../components/timeline/VisualTimeline'
import SplitTerminal from '../components/code/SplitTerminal'
import QuizSection from '../components/quiz/QuizSection'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>THREADS - Interactive Concurrency Learning</title>
        <meta name="description" content="Master concurrency and parallelism through stunning visual animations" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-20">
        <HeroSection />
        <VisualTimeline />
        <SplitTerminal />
        <QuizSection />
      </main>
      
      <Footer />
    </>
  )
}
