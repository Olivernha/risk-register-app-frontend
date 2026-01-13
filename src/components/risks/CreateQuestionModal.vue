<template>
  <Modal
    :is-open="isOpen"
    title="Create Ad-hoc Question"
    @close="handleClose"
  >
    <div class="space-y-4">
      <!-- Warning if Assigned Owner is missing -->
      <div v-if="availableOwners.length === 0" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md text-sm">
        No owners assigned to this risk. Please assign owners first.
      </div>

      <!-- Question Text -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Question <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.text"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white sm:text-sm"
          placeholder="Enter your question here..."
          maxlength="500"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500 text-right">{{ form.text.length }}/500</p>
      </div>

      <!-- Assigned To -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Assign To <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.assignedToId"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white sm:text-sm"
        >
          <option value="" disabled>Select an owner</option>
          <option v-for="owner in availableOwners" :key="owner.userId" :value="owner.userId">
            {{ owner.name }}
          </option>
        </select>
      </div>

      <!-- Grid for Priority and Due Date -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            v-model="form.priority"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white sm:text-sm"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date (Optional)
          </label>
          <input
            type="date"
            v-model="form.dueDate"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white sm:text-sm"
            :min="today"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleClose"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="!isValid || loading"
          class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating...' : 'Create Question' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import type { RiskOwner } from '@/types'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  availableOwners: RiskOwner[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', data: { text: string; assignedToId: string; priority: string; dueDate?: string }): void
}>()

const { showError } = useNotifications()

const today = new Date().toISOString().split('T')[0]

const form = ref({
  text: '',
  assignedToId: '',
  priority: 'Medium',
  dueDate: ''
})

const isValid = computed(() => {
  return form.value.text.trim().length > 0 && form.value.assignedToId !== ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset form when opened
    form.value = {
      text: '',
      assignedToId: '',
      priority: 'Medium',
      dueDate: ''
    }
    // Pre-select if only one owner
    if (props.availableOwners.length === 1) {
      form.value.assignedToId = props.availableOwners[0].userId
    }
  }
})

function handleClose() {
  emit('close')
}

function handleSubmit() {
  if (!isValid.value) return
  
  // Validation
  if (form.value.text.length > 500) {
    showError('Question text must be less than 500 characters')
    return
  }

  emit('create', { ...form.value })
}
</script>
