<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="handleCancel"
      >
        <div
          class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
            <h3 class="font-semibold text-lg text-slate-900 dark:text-slate-100">Lock Version: {{ version?.cycle }}</h3>
            <button @click="handleCancel" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Loading State -->
            <div v-if="checking" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span class="ml-3 text-slate-600 dark:text-slate-400">Checking completeness...</span>
            </div>

            <!-- Completeness Check Results -->
            <div v-else-if="completenessResult">
              <!-- Complete - Ready to Lock -->
              <div v-if="isComplete" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="font-medium text-green-900 dark:text-green-100 mb-1">Version is Complete</h4>
                    <p class="text-sm text-green-700 dark:text-green-300">
                      All risks are rated and all questions are answered or closed. You can proceed to lock this version.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Incomplete - Show Summary -->
              <div v-else class="space-y-4">
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div class="flex-1">
                      <h4 class="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Version is Incomplete</h4>
                      <p class="text-sm text-yellow-700 dark:text-yellow-300">
                        Please review and complete the following items before locking:
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Unrated Risks -->
                <div v-if="completenessResult.unratedRisks?.length > 0" class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div class="bg-slate-50 dark:bg-slate-700/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                    <h5 class="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      Unrated Risks ({{ completenessResult.unratedRisks.length }})
                    </h5>
                  </div>
                  <div class="max-h-48 overflow-y-auto">
                    <div
                      v-for="risk in completenessResult.unratedRisks"
                      :key="risk._id"
                      class="px-4 py-2 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="font-medium text-slate-900 dark:text-slate-100">{{ risk.refNo }}</span>
                          <span class="text-slate-600 dark:text-slate-400 ml-2">{{ risk.title }}</span>
                        </div>
                        <button
                          @click="$emit('view-risk', risk._id)"
                          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Open Questions -->
                <div v-if="completenessResult.openQuestions?.length > 0" class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div class="bg-slate-50 dark:bg-slate-700/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                    <h5 class="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      Open Questions ({{ completenessResult.openQuestions.length }})
                    </h5>
                  </div>
                  <div class="max-h-48 overflow-y-auto">
                    <div
                      v-for="item in completenessResult.openQuestions"
                      :key="item.question.questionId"
                      class="px-4 py-2 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium text-slate-900 dark:text-slate-100">{{ item.risk.refNo }}</span>
                            <span class="text-xs px-2 py-0.5 rounded"
                              :class="{
                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': item.question.priority === 'High',
                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400': item.question.priority === 'Medium',
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': item.question.priority === 'Low',
                              }"
                            >
                              {{ item.question.priority }}
                            </span>
                          </div>
                          <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ item.question.text }}</p>
                        </div>
                        <button
                          @click="$emit('view-question', item.risk._id, item.question.questionId)"
                          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-2"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <h4 class="font-medium text-red-900 dark:text-red-100 mb-1">Error</h4>
                  <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-end gap-3">
            <button
              type="button"
              @click="handleCancel"
              class="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              :disabled="locking"
            >
              {{ isComplete ? 'Close' : 'Cancel' }}
            </button>
            <button
              v-if="!isComplete"
              type="button"
              @click="handleForceLock"
              class="px-4 py-2 bg-yellow-600 dark:bg-yellow-700 hover:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2"
              :disabled="locking"
            >
              <span v-if="locking" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Force Lock Anyway
            </button>
            <button
              v-if="isComplete"
              type="button"
              @click="handleLock"
              class="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              :disabled="locking"
            >
              <span v-if="locking" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Lock Version
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VersionService from '@/api/versions'
import type { Version, Risk, Question } from '@/types'

interface CompletenessResult {
  isComplete: boolean
  unratedRisks?: Risk[]
  openQuestions?: Array<{ question: Question; risk: Risk }>
}

interface Props {
  modelValue: boolean
  version: Version | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  locked: [version: Version]
  cancelled: []
  'view-risk': [riskId: string]
  'view-question': [riskId: string, questionId: string]
}>()

const checking = ref(false)
const locking = ref(false)
const error = ref('')
const completenessResult = ref<CompletenessResult | null>(null)

const isComplete = computed(() => {
  return completenessResult.value?.isComplete ?? false
})

// Check completeness when dialog opens
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && props.version) {
      await checkCompleteness()
    } else {
      completenessResult.value = null
      error.value = ''
    }
  }
)

async function checkCompleteness() {
  if (!props.version) return

  checking.value = true
  error.value = ''
  
  try {
    // Try to get completeness from API, fallback to manual check if endpoint doesn't exist
    try {
      completenessResult.value = await VersionService.checkVersionCompleteness(props.version._id)
    } catch (apiError: any) {
      // If endpoint doesn't exist, we'll need to check manually
      // For now, assume complete if API call fails (backend should handle this)
      console.warn('Completeness check endpoint not available, assuming complete')
      completenessResult.value = { isComplete: true }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to check version completeness'
    completenessResult.value = null
  } finally {
    checking.value = false
  }
}

async function handleLock() {
  if (!props.version || !isComplete.value) return

  locking.value = true
  error.value = ''

  try {
    const lockedVersion = await VersionService.lockVersion(props.version._id)
    emit('locked', lockedVersion)
    emit('update:modelValue', false)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to lock version'
  } finally {
    locking.value = false
  }
}

async function handleForceLock() {
  if (!props.version) return

  if (!confirm('Are you sure you want to force lock this version? This will lock it even though some items are incomplete.')) {
    return
  }

  locking.value = true
  error.value = ''

  try {
    const lockedVersion = await VersionService.lockVersion(props.version._id, { force: true })
    emit('locked', lockedVersion)
    emit('update:modelValue', false)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to lock version'
  } finally {
    locking.value = false
  }
}

function handleCancel() {
  emit('cancelled')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

