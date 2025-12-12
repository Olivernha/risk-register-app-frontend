<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Update Status
      </h3>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="Not Started">Not Started</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <!-- Progress Percentage -->
      <div v-if="form.status !== 'Not Started'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Progress
        </label>
        <div class="flex items-center gap-4">
          <input
            v-model.number="form.progressPercentage"
            type="range"
            min="0"
            max="100"
            class="flex-1"
          />
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100 w-12">
            {{ form.progressPercentage }}%
          </span>
        </div>
      </div>

      <!-- Target Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Date
        </label>
        <input
          v-model="form.targetDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <!-- Completion Date (if Completed) -->
      <div v-if="form.status === 'Completed'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Completion Date <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.actualCompletionDate"
          type="date"
          :max="todayDate"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          :required="form.status === 'Completed'"
        />
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Progress Note (Optional)
        </label>
        <textarea
          v-model="form.comment"
          rows="3"
          placeholder="Add a note about this update..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
        ></textarea>
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
          {{ loading ? 'Updating...' : 'Update Status' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Mitigation } from '@/types'

interface Props {
  mitigation: Mitigation
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const form = ref({
  status: props.mitigation.status,
  progressPercentage: props.mitigation.progressPercentage || 0,
  targetDate: props.mitigation.targetDate ? new Date(props.mitigation.targetDate).toISOString().split('T')[0] : '',
  actualCompletionDate: props.mitigation.actualCompletionDate ? new Date(props.mitigation.actualCompletionDate).toISOString().split('T')[0] : '',
  comment: '',
})

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

function handleSubmit() {
  const data: any = {
    status: form.value.status,
  }

  if (form.value.status !== 'Not Started') {
    data.progressPercentage = form.value.progressPercentage
  }

  if (form.value.targetDate) {
    data.targetDate = form.value.targetDate
  }

  if (form.value.status === 'Completed' && form.value.actualCompletionDate) {
    data.actualCompletionDate = form.value.actualCompletionDate
  }

  if (form.value.comment) {
    data.comment = form.value.comment
  }

  emit('submit', data)
}
</script>
