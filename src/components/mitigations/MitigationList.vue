<template>
  <div class="space-y-3">
    <div
      v-for="mitigation in mitigations"
      :key="mitigation.controlId"
      class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {{ mitigation.title }}
          </h4>
          <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ mitigation.details }}
          </p>
        </div>
        <StatusBadge type="mitigation-status" :value="mitigation.status" />
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div>
          <span class="text-gray-500 dark:text-gray-400">Action Owner:</span>
          <span class="ml-1 text-gray-900 dark:text-gray-100">{{ mitigation.actionOwner.name }}</span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Target Date:</span>
          <span class="ml-1 text-gray-900 dark:text-gray-100" :class="{ 'text-red-600 dark:text-red-400': isOverdue(mitigation) }">
            {{ formatDate(mitigation.targetDate, 'short') }}
          </span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="mitigation.status !== 'Not Started'" class="mb-3">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600 dark:text-gray-400">Progress</span>
          <span class="text-gray-900 dark:text-gray-100 font-medium">{{ mitigation.progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
            :style="{ width: `${mitigation.progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Overdue Badge -->
      <div v-if="isOverdue(mitigation)" class="mb-3">
        <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          Overdue
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          v-if="canUpdateStatus"
          @click="$emit('update-status', mitigation)"
          class="flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Update Status
        </button>
        <button
          @click="$emit('view-details', mitigation)"
          class="flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="mitigations.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
      No mitigations found
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/formatters'
import { isMitigationOverdue } from '@/utils/riskCalculations'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import type { Mitigation } from '@/types'

interface Props {
  mitigations: Mitigation[]
  canUpdateStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canUpdateStatus: true,
})

const emit = defineEmits<{
  'update-status': [mitigation: Mitigation]
  'view-details': [mitigation: Mitigation]
}>()

function isOverdue(mitigation: Mitigation): boolean {
  return isMitigationOverdue(mitigation)
}
</script>
