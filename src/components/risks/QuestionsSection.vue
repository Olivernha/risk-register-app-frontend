<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Ad-hoc Questions</h3>
      <button
        v-if="canAddQuestion"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Question
      </button>
    </div>

    <!-- Questions List -->
    <div v-if="risk.questions && risk.questions.length > 0" class="space-y-4">
      <QuestionItem
        v-for="question in risk.questions"
        :key="question.questionId"
        :question="question"
        :risk-id="risk.id"
        :is-rm="isRiskManagement"
        @close-question="handleCloseQuestion"
      />
    </div>
    <div v-else class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
      <div class="flex flex-col items-center gap-2">
         <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
         </svg>
         <p class="text-sm text-gray-500 dark:text-gray-400">No ad-hoc questions raised yet.</p>
         <button
            v-if="canAddQuestion"
            @click="openCreateModal"
            class="mt-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
         >
            Ask a question
         </button>
      </div>
    </div>

    <!-- Create Question Modal -->
    <CreateQuestionModal
      :is-open="showCreateModal"
      :available-owners="risk.owners || []"
      :loading="creating"
      @close="showCreateModal = false"
      @create="handleCreateQuestion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import { useNotifications } from '@/composables/useNotifications'
import { useConfirmStore } from '@/stores/confirm'
import CreateQuestionModal from './CreateQuestionModal.vue'
import QuestionItem from './QuestionItem.vue'
import type { Risk, Question } from '@/types'

const props = defineProps<{
  risk: Risk
}>()

const authStore = useAuthStore()
const riskStore = useRiskStore()
const { showSuccess, showError } = useNotifications()
const confirmStore = useConfirmStore()

const showCreateModal = ref(false)
const creating = ref(false)

const isRiskManagement = computed(() => {
  return authStore.hasRole(['RiskManagement', 'Admin'])
})

const canAddQuestion = computed(() => {
  // Only RM can create questions
  return isRiskManagement.value
})

function openCreateModal() {
  showCreateModal.value = true
}

async function handleCreateQuestion(data: { text: string; assignedToId: string; priority: string; dueDate?: string }) {
  creating.value = true
  try {
    await riskStore.addQuestion(props.risk.id, data)
    showSuccess('Question created successfully')
    showCreateModal.value = false
  } catch (e: any) {
    showError(e.message)
  } finally {
    creating.value = false
  }
}

async function handleCloseQuestion(questionId: string) {
  const confirmed = await confirmStore.ask({
    title: 'Close Question',
    message: 'Are you sure you want to close this question? No further replies will be allowed.',
    confirmText: 'Close Question'
  })

  if (!confirmed) return

  try {
    await riskStore.closeQuestion(props.risk.id, questionId)
    showSuccess('Question closed successfully')
  } catch (e: any) {
    showError(e.message)
  }
}
</script>
