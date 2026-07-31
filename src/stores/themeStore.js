import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function applyTheme(dark) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  function init() {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      applyTheme(saved === 'true')
    } else {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    watch(isDark, (val) => localStorage.setItem('darkMode', val))
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) applyTheme(e.matches)
    })
  }

  function toggle() {
    applyTheme(!isDark.value)
  }

  return { isDark, init, toggle }
})