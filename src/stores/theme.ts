import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Get initial theme from localStorage or default to 'light'
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Set specific theme
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  // Watch for theme changes and apply them
  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
    },
    { immediate: true }
  )

  return {
    theme,
    toggleTheme,
    setTheme,
  }
})
