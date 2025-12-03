import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { initializeMsal } from './plugins/msal'
import './plugins/axios'
import './assets/main.css'
import { useAuthStore } from './stores/auth'

// Initialize MSAL and then create app
initializeMsal().then(() => {
  const app = createApp(App)
  const pinia = createPinia()
  
  // Add persisted state plugin
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  app.use(router)

  // Initialize auth after pinia is available
  const authStore = useAuthStore()
  authStore.initializeAuth()

  app.mount('#app')
}).catch((error) => {
  console.error('Failed to initialize MSAL:', error)
})
