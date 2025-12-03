<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">5×5 Risk Heat Map</h1>
        <p class="text-slate-600">Interactive visualization of risk distribution by likelihood and impact</p>
      </div>
      <div class="flex items-center gap-3">
        <select class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
          <option>Current Risks</option>
          <option>Residual Risks</option>
        </select>
      </div>
    </div>

    <!-- Heat Map Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Interactive Heat Map Visualization</h2>
        <p class="text-slate-600 mb-8">The 5×5 risk heat map will display here with automated likelihood × impact calculations</p>
        
        <!-- Placeholder Grid Preview -->
        <div class="inline-block p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
          <div class="grid grid-cols-5 gap-3">
            <div v-for="i in 25" :key="i" 
              class="w-20 h-20 bg-white rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium hover:bg-slate-50 hover:border-indigo-300 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              Cell {{ i }}
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-10 flex items-center justify-center gap-8 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-lg bg-emerald-400 shadow-sm"></div>
            <span class="text-slate-700 font-medium">Low</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-lg bg-yellow-400 shadow-sm"></div>
            <span class="text-slate-700 font-medium">Medium</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-lg bg-orange-400 shadow-sm"></div>
            <span class="text-slate-700 font-medium">High</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-lg bg-rose-400 shadow-sm"></div>
            <span class="text-slate-700 font-medium">Very High</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-blue-900 mb-2">How It Works</h3>
            <p class="text-sm text-blue-700 leading-relaxed">The heat map visualizes risks based on their likelihood (probability of occurrence) and impact (severity of consequences). Each cell represents a specific risk level combination.</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-purple-900 mb-2">Interactive Features</h3>
            <p class="text-sm text-purple-700 leading-relaxed">Click on any cell to filter and view specific risks. Hover over cells to see risk counts and details. Toggle between current and residual risk views.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Heat map component will be implemented in Task 22.1
</script>
