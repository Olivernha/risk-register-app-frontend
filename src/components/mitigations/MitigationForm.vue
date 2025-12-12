<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {{ isEdit ? 'Edit Mitigation' : 'Add Mitigation Measure' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mitigation Title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          maxlength="500"
          placeholder="Brief description of the mitigation measure"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ form.title.length }} / 500 characters
        </p>
      </div>

      <!-- Details -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Details <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.details"
          rows="4"
          placeholder="Detailed description of the mitigation measure and implementation plan"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        ></textarea>
      </div>

      <!-- Owners -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Control Owner -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Control Owner <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.controlOwnerId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          >
            <option value="">Select control owner</option>
            <option v-for="user in users" :key="user.userId" :value="user.userId">
              {{ user.name }} ({{ user.department }})
            </option>
          </select>
        </div>

        <!-- Action Owner -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Action Owner <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.actionOwnerId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          >
            <option value="">Select action owner</option>
            <option v-for="user in users" :key="user.userId" :value="user.userId">
              {{ user.name }} ({{ user.department }})
            </option>
          </select>
        </div>
      </div>

      <!-- Target Date and Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Target Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Date <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.targetDate"
            type="date"
            :min="minDate"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

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
      </div>

      <!-- Progress Percentage (if Ongoing or Completed) -->
      <div v-if="form.status !== 'Not Started'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Progress Percentage
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

      <!-- Actual Completion Date (if Completed) -->
      <div v-if="form.status === 'Completed'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Actual Completion Date <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.actualCompletionDate"
          type="date"
          :max="todayDate"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          :required="form.status === 'Completed'"
        />
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
          {{ loading ? 'Saving...' : (isEdit ? 'Update Mitigation' : 'Create Mitigation') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Mitigation, User } from '@/types'

interface Props {
  mitigation?: Mitigation
  users: User[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const isEdit = computed(() => !!props.mitigation)

const form = ref({
  title: props.mitigation?.title || '',
  details: props.mitigation?.details || '',
  controlOwnerId: props.mitigation?.controlOwner.userId || '',
  actionOwnerId: props.mitigation?.actionOwner.userId || '',
  targetDate: props.mitigation?.targetDate ? new Date(props.mitigation.targetDate).toISOString().split('T')[0] : '',
  status: props.mitigation?.status || 'Not Started',
  progressPercentage: props.mitigation?.progressPercentage || 0,
  actualCompletionDate: props.mitigation?.actualCompletionDate ? new Date(props.mitigation.actualCompletionDate).toISOString().split('T')[0] : '',
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

function handleSubmit() {
  const data: any = {
    title: form.value.title,
    details: form.value.details,
    controlOwnerId: form.value.controlOwnerId,
    actionOwnerId: form.value.actionOwnerId,
    targetDate: form.value.targetDate,
    status: form.value.status,
  }

  if (form.value.status !== 'Not Started') {
    data.progressPercentage = form.value.progressPercentage
  }

  if (form.value.status === 'Completed' && form.value.actualCompletionDate) {
    data.actualCompletionDate = form.value.actualCompletionDate
  }

  emit('submit', data)
}
</script>
