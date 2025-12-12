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
          <div class="grid grid-cols-1 gap-2 mb-4">
            <div v-for="row in rows" :key="row" class="grid grid-cols-5 gap-2">
              <div v-for="col in cols" :key="col" 
                class="aspect-square rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/30 p-1 overflow-hidden hover:bg-white dark:hover:bg-slate-700 transition-colors relative group"
              >
                <!-- Risks in this cell -->
                <div class="flex flex-wrap gap-1 content-start h-full overflow-y-auto">
                    <div v-for="risk in getRisksForCell(row, col)" :key="risk.id"
                        :class="[
                            'w-full h-full flex items-center justify-center text-xs font-bold text-white rounded cursor-pointer transition-transform hover:scale-105',
                            getRiskColorClass(risk)
                        ]"
                        :title="risk.title"
                        @click="$router.push(`/risks/${risk.id}`)"
                    >
                        {{ risk.refNo }}
                    </div>
                    
                    <!-- Fallback visualization if multiple risks (not fitting in one big box) -->
                    <!-- Actually the wireframe showed big boxes. If multiple risks exist in same cell (Likelihood/Impact pair), they should probably share the space or be small pills. -->
                    <!-- But usually 5x5 matrix cells are large enough? -->
                    <!-- Let's assume for now we just stack them or show them as pills. -->
                    <!-- Re-reading wireframe: "grid grid-cols-5 gap-2" implies the CELL is the grid item. -->
                    <!-- If I have multiple risks, I can't simple put multiple full-size divs. -->
                    <!-- I'll change the styling to Grid/Flex inside the cell. -->
                </div>
                
                <!-- Empty State -->
                <div v-if="getRisksForCell(row, col).length === 0" class="w-full h-full flex items-center justify-center">
                    <span class="text-gray-300 dark:text-gray-600 text-[10px]">-</span>
                </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRiskStore } from '@/stores/riskStore'
import { storeToRefs } from 'pinia'
import type { Risk } from '@/types'

const riskStore = useRiskStore()
const { risks } = storeToRefs(riskStore)

onMounted(() => {
  riskStore.fetchRisks()
})

// Grid configuration
const rows = [5, 4, 3, 2, 1] // Likelihood (High to Low)
const cols = [1, 2, 3, 4, 5] // Impact (Low to High)

// Helper to get risks for a specific cell
const getRisksForCell = (likelihood: number, impact: number) => {
  return risks.value.filter(risk => 
    (risk.averageRating?.likelihood === likelihood) && 
    (risk.averageRating?.impact === impact)
  )
}

// Helper to get color for a cell/risk
const getRiskColorClass = (risk: Risk) => {
  const level = risk.averageRating?.riskLevel
  switch (level) {
    case 'Very High': return 'bg-red-500 dark:bg-red-600'
    case 'High': return 'bg-orange-500 dark:bg-orange-600' // Changed from red-400 for better distinction
    case 'Medium': return 'bg-yellow-400 dark:bg-yellow-500'
    case 'Low': return 'bg-green-500 dark:bg-green-600' // Changed from gray-400/300
    default: return 'bg-gray-300 dark:bg-gray-600'
  }
}
</script>
