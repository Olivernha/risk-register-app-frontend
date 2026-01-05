<template>
  <div class="min-h-screen flex overflow-hidden bg-slate-950">
    <!-- Left Panel - Branding & Animation -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <!-- Animated grid background -->
      <div class="absolute inset-0 opacity-20">
        <div class="grid-background"></div>
      </div>

      <!-- Gradient orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl top-20 left-20 animate-pulse-slow"></div>
        <div class="absolute w-80 h-80 bg-purple-600/30 rounded-full blur-3xl bottom-20 right-20 animate-pulse-slow" style="animation-delay: 1.5s"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16 py-12">
        <!-- Logo -->
        <div class="mb-12 slide-in-left">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <img src="@/assets/img/icon.svg" alt="Logo" class="w-full h-full"></img>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-white">Risk Register</h1>
              <p class="text-slate-400 text-sm mt-1">Enterprise Risk Management</p>
            </div>
          </div>
        </div>

        <!-- Feature highlights -->
        <div class="space-y-8 slide-in-left" style="animation-delay: 0.2s">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
              <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg mb-1">5×5 Risk Heat Map</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Visualize risk distribution with automated likelihood × impact calculations</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20">
              <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg mb-1">Mitigation Tracking</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Track action items with ownership assignments and progress monitoring</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-pink-500/20">
              <svg class="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-lg mb-1">Quarterly Versioning</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Complete audit trail with quarterly snapshots and version control</p>
            </div>
          </div>
        </div>

        <!-- Footer quote -->
        <div class="mt-auto pt-12 fade-in" style="animation-delay: 0.4s">
          <div class="border-l-4 border-indigo-500 pl-4">
            <p class="text-slate-300 italic text-sm leading-relaxed">
              "The essence of risk management is not to eliminate risk, but to understand and manage it effectively."
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-slate-950 relative">
      <!-- Subtle gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-tl from-indigo-950/20 via-transparent to-purple-950/20"></div>

      <!-- Login card -->
      <div class="w-full max-w-md relative z-10 scale-in">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-center gap-3 mb-12">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Risk Register</h1>
        </div>

        <!-- Card -->
        <div class="glass-dark rounded-2xl p-10 shadow-2xl border border-slate-700/50">
          <!-- Header -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p class="text-slate-400">Sign in to access your risk management dashboard</p>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p class="text-sm text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- Login form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email field -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <!-- Password field -->
            <div>
              <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <!-- Sign in button -->
            <button 
              type="submit"
              :disabled="loading"
              class="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              <!-- Shimmer effect -->
              <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <!-- Loading spinner -->
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <span class="relative z-10">{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-slate-800 text-slate-400">Demo Credentials</span>
            </div>
          </div>

          <!-- Demo credentials -->
          <div class="space-y-2 text-xs text-slate-400">
            <p class="font-semibold text-slate-300">Test Accounts (Password: password123):</p>
            <div class="grid grid-cols-1 gap-1">
              <p>• <span class="text-indigo-400">Admin/RM:</span> rm@company.com</p>
              <p>• <span class="text-indigo-400">Risk Owner:</span> michael.wong@company.com</p>
              <p>• <span class="text-indigo-400">Risk Owner:</span> nayha@tuaspower.com.sg</p>
              <p>• <span class="text-indigo-400">Action Owner:</span> david.lee@company.com</p>
              <p>• <span class="text-indigo-400">Control Owner:</span> sarah.chen@company.com</p>
            </div>
           </div>
        </div>

        <!-- Help text -->
        <div class="mt-6 text-center">
          <p class="text-sm text-slate-500">
            Need help? <a href="#" class="text-indigo-400 hover:text-indigo-300 transition-colors">Contact IT Support</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  email: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.loginWithCredentials(form.value.email, form.value.password)
    
    notificationStore.success('Welcome back! Login successful.')

    // Redirect to original destination or dashboard
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.grid-background {
  background-image: 
    linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  width: 100%;
  height: 100%;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(40px, 40px);
  }
}
</style>
