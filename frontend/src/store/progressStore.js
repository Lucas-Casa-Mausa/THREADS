import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { progressAPI } from '../lib/api'
import { useUserStore } from './userStore'

export const useProgressStore = create(
  persist(
    (set, get) => ({
      completedSections: [],

      markComplete: (section) => {
        const current = get().completedSections
        if (current.includes(section)) return
        set({ completedSections: [...current, section] })

        // Sync to backend when authenticated. Fire-and-forget.
        const { isAuthenticated } = useUserStore.getState()
        if (isAuthenticated) {
          progressAPI
            .updateProgress({ section, completed: true })
            .catch((err) => console.warn('Progress sync failed:', err))
        }
      },

      isComplete: (section) => get().completedSections.includes(section),

      getProgress: () => {
        const completed = get().completedSections.length
        const total = 4 // hero, timeline, code, quiz
        return (completed / total) * 100
      },

      reset: () => set({ completedSections: [] }),

      // Pull persisted progress from the backend (called after login).
      hydrateFromBackend: async () => {
        const { isAuthenticated, user } = useUserStore.getState()
        if (!isAuthenticated || !user?.id) return
        try {
          const { data } = await progressAPI.getProgress(user.id)
          const remote = data.filter((p) => p.completed).map((p) => p.section)
          // Merge: local + remote, dedupe.
          const merged = Array.from(new Set([...get().completedSections, ...remote]))
          set({ completedSections: merged })
        } catch (err) {
          console.warn('Progress hydrate failed:', err)
        }
      },
    }),
    { name: 'progress-storage' }
  )
)
