<template>
  <div class="space-y-3">
    <div
      v-for="item in questions"
      :key="item.question.questionId"
      class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <StatusBadge type="question-status" :value="item.question.status" />
            <span
              v-if="item.question.priority === 'High'"
              class="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            >
              High Priority
            </span>
          </div>
          <p class="text-sm text-gray-900 dark:text-gray-100 mb-2">
            {{ item.question.text }}
          </p>
          <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span>Risk: {{ item.risk.refNo }}</span>
            <span v-if="item.question.dueDate">
              Due: {{ formatDate(item.question.dueDate, 'short') }}
            </span>
            <span>Asked {{ formatDate(item.question.createdAt, 'relative') }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          v-if="item.question.status === 'Open' && canReply"
          @click="$emit('reply', item)"
          class="flex-1 px-3 py-2 text-xs font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          Reply
        </button>
        <button
          @click="$emit('view-details', item)"
          class="flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          View Thread
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="questions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
      No questions found
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatters'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import type { Question } from '@/types'

interface QuestionWithRisk {
  question: Question
  risk: any
}

interface Props {
  questions: QuestionWithRisk[]
  canReply?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canReply: true,
})

const emit = defineEmits<{
  reply: [item: QuestionWithRisk]
  'view-details': [item: QuestionWithRisk]
}>()
</script>
