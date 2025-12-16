<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleClose">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="handleClose"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full p-6 animate-fade-in-down">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Create Mitigation
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Add a mitigation measure for {{ riskRef }}
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

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Mitigation Title -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Mitigation Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              maxlength="500"
              required
              placeholder="Enter mitigation title"
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.title }"
            />
            <div class="flex justify-between mt-1">
              <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
              <p class="text-xs text-slate-400 ml-auto">{{ form.title.length }}/500</p>
            </div>
          </div>

          <!-- Details (Rich Text) -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Details <span class="text-red-500">*</span>
            </label>
            <div 
              class="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
              :class="{ 'border-red-500': errors.details }"
            >
              <EditorContent :editor="editor" class="prose prose-sm dark:prose-invert max-w-none" />
            </div>
            <p v-if="errors.details" class="text-xs text-red-500 mt-1">{{ errors.details }}</p>
          </div>

          <!-- Action Owner -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Action Owner <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.actionOwnerId"
              required
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.actionOwner }"
            >
              <option value="">Select action owner...</option>
              <option v-for="user in actionOwners" :key="user.userId" :value="user.userId">
                {{ user.name }} - {{ user.department }}
              </option>
            </select>
            <p v-if="errors.actionOwner" class="text-xs text-red-500 mt-1">{{ errors.actionOwner }}</p>
          </div>

          <!-- Target Date -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Target Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.targetDate"
              type="date"
              required
              :min="minDate"
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.targetDate }"
            />
            <p v-if="errors.targetDate" class="text-xs text-red-500 mt-1">{{ errors.targetDate }}</p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Not Started">Not Started</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
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
              {{ submitting ? 'Creating...' : 'Create Mitigation' }}
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
import mitigationService from '@/api/mitigations'
import userService from '@/api/users'
import type { User, MitigationStatus } from '@/types'

interface Props {
  isOpen: boolean
  riskId: string
  riskRef: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const { showSuccess, showError } = useNotifications()

// Form state
const form = ref({
  title: '',
  actionOwnerId: '',
  targetDate: '',
  status: 'Not Started' as MitigationStatus
})

const errors = ref({
  title: '',
  details: '',
  actionOwner: '',
  targetDate: ''
})

const submitting = ref(false)
const actionOwners = ref<User[]>([])

// Rich text editor for details
const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4 min-h-[150px]',
    },
  },
})

// Computed
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Methods
async function loadActionOwners() {
  try {
    const users = await userService.getUsers()
    // Filter for Action Owners or users who can be assigned
    actionOwners.value = users.filter(u => u.active)
  } catch (error: any) {
    showError('Failed to load users')
  }
}

function validateForm(): boolean {
  errors.value = {
    title: '',
    details: '',
    actionOwner: '',
    targetDate: ''
  }

  let isValid = true

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  } else if (form.value.title.length > 500) {
    errors.value.title = 'Title must not exceed 500 characters'
    isValid = false
  }

  const detailsContent = editor.value?.getText().trim() || ''
  if (!detailsContent) {
    errors.value.details = 'Details are required'
    isValid = false
  }

  if (!form.value.actionOwnerId) {
    errors.value.actionOwner = 'Action owner is required'
    isValid = false
  }

  if (!form.value.targetDate) {
    errors.value.targetDate = 'Target date is required'
    isValid = false
  } else {
    const targetDate = new Date(form.value.targetDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (targetDate <= today) {
      errors.value.targetDate = 'Target date must be in the future'
      isValid = false
    }
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    const actionOwner = actionOwners.value.find(u => u.userId === form.value.actionOwnerId)
    
    if (!actionOwner) {
      throw new Error('Selected action owner not found')
    }

    await mitigationService.addMitigation(props.riskId, {
      title: form.value.title,
      details: editor.value?.getHTML() || '',
      actionOwner: {
        userId: actionOwner.userId,
        name: actionOwner.name
      },
      targetDate: new Date(form.value.targetDate),
      status: form.value.status
    })

    showSuccess('Mitigation created successfully')
    emit('created')
    handleClose()
  } catch (error: any) {
    showError(error.message || 'Failed to create mitigation')
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  // Reset form
  form.value = {
    title: '',
    actionOwnerId: '',
    targetDate: '',
    status: 'Not Started'
  }
  
  if (editor.value) {
    editor.value.commands.clearContent()
  }
  
  errors.value = {
    title: '',
    details: '',
    actionOwner: '',
    targetDate: ''
  }
  
  emit('close')
}

// Watch for modal open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadActionOwners()
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
  content: "Describe the mitigation measure in detail...";
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
