<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mb-6">
        <span class="text-5xl font-bold text-slate-600">404</span>
      </div>
      <h1 class="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
      <p class="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
      <button
        @click="$router.push('/')"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Go to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
