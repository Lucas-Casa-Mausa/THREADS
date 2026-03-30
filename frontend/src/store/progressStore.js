import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set, get) => ({
      completedSections: new Set(),
      
      markComplete: (section) => set((state) => ({
        completedSections: new Set([...state.completedSections, section])
      })),
      
      isComplete: (section) => get().completedSections.has(section),
      
      getProgress: () => {
        const completed = get().completedSections.size
        const total = 4 // hero, timeline, code, quiz
        return (completed / total) * 100
      },
      
      reset: () => set({ completedSections: new Set() }),
      
      loadFromAPI: (progressData) => {
        const completed = progressData
          .filter(p => p.completed)
          .map(p => p.section)
        set({ completedSections: new Set(completed) })
      }
    }),
    {
      name: 'progress-storage',
      serialize: (state) => JSON.stringify({
        completedSections: Array.from(state.completedSections)
      }),
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        return {
          completedSections: new Set(parsed.completedSections)
        }
      }
    }
  )
)
