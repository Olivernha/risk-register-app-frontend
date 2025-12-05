<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risk Heatmap</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">5×5 risk matrix visualization</p>
      </div>
      <div class="flex items-center gap-3">
        <select class="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option>Current Risks</option>
          <option>Residual Risks</option>
        </select>
      </div>
    </div>

    <!-- Heat Map Card -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Risk Heatmap</h2>
      </div>

      <!-- Heatmap Grid -->
      <div class="flex gap-4">
        <!-- Y-axis label -->
        <div class="flex flex-col justify-between py-8">
          <div class="text-xs font-medium text-gray-600 dark:text-gray-400 -rotate-90 whitespace-nowrap origin-center">
            Likelihood
          </div>
        </div>

        <!-- Grid Container -->
        <div class="flex-1">
          <!-- Grid -->
          <div class="grid grid-cols-5 gap-2 mb-4">
            <!-- Row 5 - Catastrophic -->
            <div class="col-span-5 grid grid-cols-5 gap-2">
              <div class="aspect-square bg-red-500 dark:bg-red-600 rounded flex items-center justify-center text-white text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R1
              </div>
              <div class="aspect-square bg-red-500 dark:bg-red-600 rounded flex items-center justify-center text-white text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R10
              </div>
              <div class="aspect-square bg-red-500 dark:bg-red-600 rounded flex items-center justify-center text-white text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R10
              </div>
              <div class="aspect-square bg-red-500 dark:bg-red-600 rounded flex items-center justify-center text-white text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R10
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
            </div>

            <!-- Row 4 - Major -->
            <div class="col-span-5 grid grid-cols-5 gap-2">
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-red-400 dark:bg-red-500 rounded flex items-center justify-center text-white text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R2
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
            </div>

            <!-- Row 3 - Moderate -->
            <div class="col-span-5 grid grid-cols-5 gap-2">
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-yellow-400 dark:bg-yellow-500 rounded flex items-center justify-center text-gray-900 dark:text-gray-100 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R3
              </div>
              <div class="aspect-square bg-yellow-400 dark:bg-yellow-500 rounded flex items-center justify-center text-gray-900 dark:text-gray-100 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R3
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
            </div>

            <!-- Row 2 - Minor -->
            <div class="col-span-5 grid grid-cols-5 gap-2">
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R1
              </div>
              <div class="aspect-square bg-gray-400 dark:bg-gray-500 rounded flex items-center justify-center text-white text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                H3
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                H
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
            </div>

            <!-- Row 1 - Negligible -->
            <div class="col-span-5 grid grid-cols-5 gap-2">
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R1
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R1
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                R1
              </div>
              <div class="aspect-square bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity">
                
              </div>
            </div>
          </div>

          <!-- X-axis labels -->
          <div class="grid grid-cols-5 gap-2 text-center">
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Negligible</div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Minor</div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Moderate</div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Major</div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Catastrophic</div>
          </div>

          <!-- X-axis title -->
          <div class="text-center mt-2">
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Impact</div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Legend</h3>
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-red-500"></div>
            <span class="text-gray-600 dark:text-gray-400">Very High</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-red-400"></div>
            <span class="text-gray-600 dark:text-gray-400">High</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-yellow-400"></div>
            <span class="text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gray-400"></div>
            <span class="text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gray-300 border border-gray-400"></div>
            <span class="text-gray-600 dark:text-gray-400">No data/Unassigned</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Heat map component matching wireframe design
</script>
