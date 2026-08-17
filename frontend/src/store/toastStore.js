import { create } from 'zustand'

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ message, type = 'info', duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5)
    const newToast = { id, message, type, duration }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  clearAll: () => set({ toasts: [] }),
}))

// Standalone toast helper for use in non-React files (like axios interceptors)
export const toast = {
  success: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'success', duration }),
  error: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'error', duration }),
  info: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'info', duration }),
}
