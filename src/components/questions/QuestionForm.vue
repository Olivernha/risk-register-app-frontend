<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Create Question
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Question Text -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Question <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.text"
          rows="4"
          maxlength="500"
          placeholder="Enter your question for the risk owner..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        ></textarea>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ form.text.length }} / 500 characters
        </p>
      </div>

      <!-- Assign To -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Assign To <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.assignedToUserId"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        >
          <option value="">Select a risk owner</option>
          <option v-for="owner in riskOwners" :key="owner.userId" :value="owner.userId">
            {{ owner.name }}
          </option>
        </select>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Select from the risk owners assigned to this risk
        </p>
      </div>

      <!-- Priority and Due Date -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.priority"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date (Optional)
          </label>
          <input
            v-model="form.dueDate"
            type="date"
            :min="minDate"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating...' : 'Create Question' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RiskOwner } from '@/types'

interface Props {
  riskOwners: RiskOwner[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const form = ref({
  text: '',
  assignedToUserId: '',
  priority: 'Medium' as 'Low' | 'Medium' | 'High',
  dueDate: '',
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

function handleSubmit() {
  const data: any = {
    text: form.value.text,
    assignedToUserId: form.value.assignedToUserId,
    priority: form.value.priority,
  }

  if (form.value.dueDate) {
    data.dueDate = form.value.dueDate
  }

  emit('submit', data)
}
</script>
