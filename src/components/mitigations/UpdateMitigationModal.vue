<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleClose">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="handleClose"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fade-in-down">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Update Mitigation Progress
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {{ mitigation?.title }}
            </p>
          </div>
          <button
            @click="handleClose"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Current Info -->
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-500 dark:text-slate-400">Current Status:</span>
              <span :class="[
                'ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded',
                getStatusClass(mitigation?.status || 'Not Started')
              ]">
                {{ mitigation?.status }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400">Progress:</span>
              <span class="ml-2 font-semibold text-slate-900 dark:text-slate-100">
                {{ mitigation?.progressPercentage || 0 }}%
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400">Target Date:</span>
              <span class="ml-2 font-medium text-slate-900 dark:text-slate-100">
                {{ formatDate(mitigation?.targetDate) }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400">Control Owner:</span>
              <span class="ml-2 font-medium text-slate-900 dark:text-slate-100">
                {{ mitigation?.controlOwner.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Not Started">Not Started</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <!-- Progress Percentage -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Progress Percentage
            </label>
            <div class="flex items-center gap-4">
              <input
                v-model.number="form.progressPercentage"
                type="range"
                min="0"
                max="100"
                step="5"
                class="flex-1"
              />
              <div class="w-20 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-center font-semibold text-slate-900 dark:text-slate-100">
                {{ form.progressPercentage }}%
              </div>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Drag the slider to update progress
            </p>
          </div>

          <!-- Target Date -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Target Date
            </label>
            <input
              v-model="form.targetDate"
              type="date"
              :min="minDate"
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Update if timeline has changed
            </p>
          </div>

          <!-- Actual Completion Date (if Completed) -->
          <div v-if="form.status === 'Completed'">
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Actual Completion Date
            </label>
            <input
              v-model="form.actualCompletionDate"
              type="date"
              :max="today"
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Progress Comment -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Progress Comment
            </label>
            <div class="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <EditorContent :editor="editor" class="prose prose-sm dark:prose-invert max-w-none" />
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add a comment about the progress (optional)
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              @click="handleClose"
              class="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:transform active:scale-95"
            >
              {{ submitting ? 'Updating...' : 'Update Progress' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useNotifications } from '@/composables/useNotifications'
import { useAuthStore } from '@/stores/auth'
import mitigationService from '@/api/mitigations'
import threadService from '@/api/threads'
import type { Mitigation, MitigationStatus } from '@/types'

interface Props {
  isOpen: boolean
  mitigation: Mitigation | null
  riskId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const { showSuccess, showError } = useNotifications()
const authStore = useAuthStore()

// Form state
const form = ref({
  status: 'Not Started' as MitigationStatus,
  progressPercentage: 0,
  targetDate: '',
  actualCompletionDate: ''
})

const submitting = ref(false)

// Rich text editor for progress comment
const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4 min-h-[120px]',
    },
  },
})

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Methods
function getStatusClass(status: MitigationStatus) {
  switch (status) {
    case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Ongoing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    case 'Not Started': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function formatDate(date: Date | string | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

async function handleSubmit() {
  if (!props.mitigation) return

  submitting.value = true

  try {
    const updates: Partial<Mitigation> = {
      status: form.value.status,
      progressPercentage: form.value.progressPercentage,
      targetDate: new Date(form.value.targetDate)
    }

    // Add actual completion date if status is Completed
    if (form.value.status === 'Completed' && form.value.actualCompletionDate) {
      updates.actualCompletionDate = new Date(form.value.actualCompletionDate)
    }

    // Update the mitigation
    await mitigationService.updateMitigation(props.riskId, props.mitigation.controlId, updates)

    // Add progress comment if provided
    const commentContent = editor.value?.getHTML() || ''
    const commentText = editor.value?.getText().trim() || ''
    
    if (commentText && authStore.user) {
      await threadService.addComment(
        props.mitigation.commentsThreadId,
        { message: commentContent },
        authStore.user.userId,
        authStore.user.name,
        authStore.user.role
      )
    }

    showSuccess('Mitigation progress updated successfully')
    emit('updated')
    handleClose()
  } catch (error: any) {
    showError(error.message || 'Failed to update mitigation progress')
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  // Reset form
  if (editor.value) {
    editor.value.commands.clearContent()
  }
  
  emit('close')
}

// Watch for modal open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.mitigation) {
    // Initialize form with current values
    form.value = {
      status: props.mitigation.status,
      progressPercentage: props.mitigation.progressPercentage,
      targetDate: props.mitigation.targetDate ? new Date(props.mitigation.targetDate).toISOString().split('T')[0] : '',
      actualCompletionDate: props.mitigation.actualCompletionDate ? new Date(props.mitigation.actualCompletionDate).toISOString().split('T')[0] : ''
    }
  }
})

// Cleanup
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
.editor-wrapper :deep(.ProseMirror) {
  outline: none;
}

.editor-wrapper :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #9ca3af;
  content: "Describe the progress made...";
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
