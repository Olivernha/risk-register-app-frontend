<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
        5×5 Risk Heat Map
      </h3>
      <div class="flex items-center gap-4">
        <!-- Current vs Residual Toggle -->
        <div class="flex items-center gap-2">
          <button
            @click="showResidual = false"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              !showResidual
                ? 'bg-gray-800 dark:bg-gray-700 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            Current
          </button>
          <button
            @click="showResidual = true"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              showResidual
                ? 'bg-gray-800 dark:bg-gray-700 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            Residual
          </button>
        </div>
      </div>
    </div>

    <!-- Heat Map Grid -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full">
        <!-- Grid Container -->
        <div class="grid grid-cols-6 gap-1">
          <!-- Top-left corner (empty) -->
          <div class="aspect-square"></div>

          <!-- Impact Headers (top row) -->
          <div
            v-for="impact in impactLevels"
            :key="`header-impact-${impact.value}`"
            class="aspect-square flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300 p-2 text-center"
          >
            {{ impact.label }}
          </div>

          <!-- Rows (likelihood + cells) -->
          <template v-for="likelihood in likelihoodLevels" :key="`row-${likelihood.value}`">
            <!-- Likelihood Header (left column) -->
            <div
              class="aspect-square flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300 p-2 text-center"
            >
              {{ likelihood.label }}
            </div>

            <!-- Heat Map Cells -->
            <div
              v-for="impact in impactLevels"
              :key="`cell-${likelihood.value}-${impact.value}`"
              @click="handleCellClick(likelihood.value, impact.value)"
              class="aspect-square rounded cursor-pointer transition-all hover:ring-2 hover:ring-gray-900 dark:hover:ring-gray-100 relative group"
              :style="{ backgroundColor: getCellColor(likelihood.value, impact.value) }"
            >
              <!-- Risk Count -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {{ getCellRiskCount(likelihood.value, impact.value) }}
                </span>
              </div>

              <!-- Tooltip on Hover -->
              <div
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
              >
                {{ getCellRiskLevel(likelihood.value, impact.value)?.level }}
                <br />
                {{ getCellRiskCount(likelihood.value, impact.value) }} risk(s)
              </div>
            </div>
          </template>
        </div>

        <!-- Legend -->
        <div class="mt-6 flex flex-wrap gap-4 justify-center">
          <div v-for="level in riskLevels" :key="level.name" class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded"
              :style="{ backgroundColor: level.color }"
            ></div>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ level.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtered Risks (if cell clicked) -->
    <div v-if="selectedCell" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Risks in Selected Cell
          <span class="text-gray-500 dark:text-gray-400 ml-2">
            ({{ filteredRisks.length }})
          </span>
        </h4>
        <button
          @click="selectedCell = null"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          Clear Filter
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="risk in filteredRisks"
          :key="risk._id"
          @click="$emit('risk-click', risk)"
          class="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ risk.refNo }}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {{ risk.title }}
              </span>
            </div>
            <StatusBadge type="risk-level" :value="risk.averageRating?.riskLevel" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getHeatMapMatrix, getRiskLevel } from '@/utils/riskCalculations'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import type { Risk } from '@/types'

interface Props {
  risks: Risk[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'risk-click': [risk: Risk]
}>()

const showResidual = ref(false)
const selectedCell = ref<{ likelihood: number; impact: number } | null>(null)

const likelihoodLevels = [
  { value: 5, label: 'Almost Certain' },
  { value: 4, label: 'Likely' },
  { value: 3, label: 'Possible' },
  { value: 2, label: 'Unlikely' },
  { value: 1, label: 'Rare' },
]

const impactLevels = [
  { value: 1, label: 'Negligible' },
  { value: 2, label: 'Minor' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Major' },
  { value: 5, label: 'Catastrophic' },
]

const riskLevels = [
  { name: 'Low', color: '#80CBC4' },
  { name: 'Medium', color: '#FFEB3B' },
  { name: 'High', color: '#FF9800' },
  { name: 'Very High', color: '#E91E63' },
]

const heatMapMatrix = getHeatMapMatrix()

function getCellColor(likelihood: number, impact: number): string {
  const cellData = heatMapMatrix[likelihood]?.[impact]
  return cellData?.color || '#E5E7EB'
}

function getCellRiskLevel(likelihood: number, impact: number) {
  return getRiskLevel(likelihood, impact)
}

function getCellRiskCount(likelihood: number, impact: number): number {
  return props.risks.filter((risk) => {
    if (!risk.averageRating) return false

    if (showResidual.value) {
      return (
        risk.averageRating.residualLikelihood === likelihood &&
        risk.averageRating.residualImpact === impact
      )
    } else {
      return (
        risk.averageRating.likelihood === likelihood &&
        risk.averageRating.impact === impact
      )
    }
  }).length
}

function handleCellClick(likelihood: number, impact: number) {
  selectedCell.value = { likelihood, impact }
}

const filteredRisks = computed(() => {
  if (!selectedCell.value) return []

  return props.risks.filter((risk) => {
    if (!risk.averageRating) return false

    if (showResidual.value) {
      return (
        risk.averageRating.residualLikelihood === selectedCell.value!.likelihood &&
        risk.averageRating.residualImpact === selectedCell.value!.impact
      )
    } else {
      return (
        risk.averageRating.likelihood === selectedCell.value!.likelihood &&
        risk.averageRating.impact === selectedCell.value!.impact
      )
    }
  })
})
</script>
