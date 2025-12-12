<template>
  <span
    class="inline-block px-2 py-1 text-xs font-medium rounded"
    :class="badgeClass"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getRiskLevelClasses,
  getMitigationStatusClasses,
  getQuestionStatusClasses,
  getRiskStatusClasses,
} from '@/utils/formatters'
import type { RiskLevel, MitigationStatus, QuestionStatus, RiskStatus } from '@/types'

interface Props {
  type: 'risk-level' | 'mitigation-status' | 'question-status' | 'risk-status' | 'custom'
  value?: RiskLevel | MitigationStatus | QuestionStatus | RiskStatus | string
  label?: string
  customClass?: string
}

const props = defineProps<Props>()

const badgeClass = computed(() => {
  if (props.type === 'custom' && props.customClass) {
    return props.customClass
  }

  if (!props.value) return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'

  switch (props.type) {
    case 'risk-level':
      return getRiskLevelClasses(props.value as RiskLevel)
    case 'mitigation-status':
      return getMitigationStatusClasses(props.value as MitigationStatus)
    case 'question-status':
      return getQuestionStatusClasses(props.value as QuestionStatus)
    case 'risk-status':
      return getRiskStatusClasses(props.value as RiskStatus)
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
})
</script>
