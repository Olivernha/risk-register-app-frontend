<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Edit Risk</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Modify unlocked risk details</p>
      </div>
      <button
        @click="$router.push(`/risks/${riskId}`)"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        Cancel
      </button>
    </div>
?:
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading risk...</span>
    </div>

    <!-- Locked Warning -->
    <div v-else-if="risk && risk.status === 'Locked'" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h3 class="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Risk is Locked</h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            This risk is locked and cannot be edited. Locked risks are read-only.
          </p>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div v-else-if="risk" class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Reference Number (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reference Number
          </label>
          <input
            :value="risk.refNo"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            readonly
            disabled
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Reference number cannot be changed</p>
        </div>

        <!-- Risk Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            maxlength="200"
            :class="[
              'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2',
              errors.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            ]"
            placeholder="Enter risk title (max 200 characters)"
            required
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.title }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ form.title.length }}/200 characters</p>
        </div>

        <!-- Risk Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="6"
            maxlength="2000"
            :class="[
              'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2',
              errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            ]"
            placeholder="Describe the risk in detail (max 2000 characters)"
            required
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.description }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ form.description.length }}/2000 characters</p>
        </div>

        <!-- Time Horizon and Category -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Horizon <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.timeHorizon"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2',
                errors.timeHorizon ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              required
            >
              <option value="">Select time horizon</option>
              <option value="< 1 year">&lt; 1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="> 3 years">&gt; 3 years</option>
            </select>
            <p v-if="errors.timeHorizon" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.timeHorizon }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risk Category <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2',
                errors.category ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              required
            >
              <option value="">Select category</option>
              <option value="Strategic">Strategic</option>
              <option value="Operational">Operational</option>
              <option value="Financial">Financial</option>
              <option value="Compliance">Compliance</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.category }}</p>
          </div>
        </div>

        <!-- Financial Impact -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Financial Impact <span class="text-red-500">*</span>
          </label>
          <div class="space-y-3">
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  v-model="form.financialImpact.hasImpact"
                  type="radio"
                  :value="true"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Yes</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.financialImpact.hasImpact"
                  type="radio"
                  :value="false"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">No</span>
              </label>
            </div>
            <div v-if="form.financialImpact.hasImpact">
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Financial Impact Amount <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.financialImpact.amount"
                type="number"
                min="0"
                step="0.01"
                :class="[
                  'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2',
                  errors.financialImpact ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                ]"
                placeholder="Enter amount"
                required
              />
              <p v-if="errors.financialImpact" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.financialImpact }}</p>
            </div>
          </div>
        </div>

        <!-- Risk Owners -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk Owners <span class="text-red-500">*</span>
          </label>
          <div class="space-y-3">
            <select
              v-model="form.owners"
              multiple
              size="5"
              :class="[
                'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2',
                errors.owners ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              required
            >
              <option v-for="user in riskOwners" :key="user.userId" :value="user.userId">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
            <p v-if="errors.owners" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.owners }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Hold Ctrl/Cmd to select multiple. Selected: {{ form.owners.length }} owner(s)
            </p>
            <!-- Owner Change Warning -->
            <div v-if="removedOwners.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p class="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Warning:</strong> The following owners will be removed: {{ removedOwners.map(o => o.name).join(', ') }}.
                Their ratings will be marked inactive but retained for audit purposes.
              </p>
            </div>
            <div v-if="addedOwners.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p class="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> New owners will be notified and blank rating records will be created for: {{ addedOwners.map(o => o.name).join(', ') }}.
              </p>
            </div>
          </div>
        </div>

        <!-- Version (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            :value="risk.version"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            readonly
            disabled
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Version cannot be changed</p>
        </div>

        <!-- Status (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <input
            :value="risk.status"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            readonly
            disabled
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$router.push(`/risks/${riskId}`)"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            {{ isSubmitting ? 'Updating...' : 'Update Risk' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import riskService, { type UpdateRiskRequest } from '@/api/risks'
import userService from '@/api/users'
import type { Risk, User, TimeHorizon, RiskCategory, RiskOwner } from '@/types'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useNotifications()

const riskId = computed(() => route.params.id as string)
const risk = ref<Risk | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const riskOwners = ref<User[]>([])
const originalOwnerIds = ref<string[]>([])

const form = ref<{
  title: string
  description: string
  timeHorizon: TimeHorizon | ''
  category: RiskCategory | ''
  financialImpact: {
    hasImpact: boolean
    amount?: number
  }
  owners: string[]
}>({
  title: '',
  description: '',
  timeHorizon: '',
  category: '',
  financialImpact: {
    hasImpact: false,
    amount: undefined,
  },
  owners: [],
})

const errors = ref<Record<string, string>>({})

// Track owner changes
const removedOwners = computed(() => {
  if (!risk.value) return []
  const currentOwnerIds = new Set(form.value.owners)
  return risk.value.owners.filter(owner => !currentOwnerIds.has(owner.userId))
})

const addedOwners = computed(() => {
  if (!riskOwners.value.length) return []
  const originalOwnerIdsSet = new Set(originalOwnerIds.value)
  return riskOwners.value.filter(user => 
    form.value.owners.includes(user.userId) && !originalOwnerIdsSet.has(user.userId)
  )
})

onMounted(async () => {
  await loadRisk()
  await loadRiskOwners()
})

async function loadRisk() {
  loading.value = true
  error.value = ''
  
  try {
    const riskData = await riskService.getRisk(riskId.value)
    risk.value = riskData
    
    // Check if locked
    if (riskData.status === 'Locked') {
      return
    }
    
    // Populate form
    form.value = {
      title: riskData.title,
      description: riskData.description,
      timeHorizon: riskData.timeHorizon,
      category: riskData.category,
      financialImpact: {
        hasImpact: riskData.financialImpact.hasImpact,
        amount: riskData.financialImpact.amount,
      },
      owners: riskData.owners.map(o => o.userId),
    }
    
    originalOwnerIds.value = [...form.value.owners]
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to load risk'
    showError(errorMessage)
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}

async function loadRiskOwners() {
  try {
    riskOwners.value = await userService.getUsersByRole('RiskOwner')
  } catch (err) {
    console.error('Failed to fetch risk owners:', err)
  }
}

// Watch for owner changes to show warnings
watch(() => form.value.owners, (newOwners, oldOwners) => {
  // Check if trying to remove all owners
  if (newOwners.length === 0 && oldOwners && oldOwners.length > 0) {
    errors.value.owners = 'At least one risk owner is required'
  } else if (errors.value.owners && newOwners.length > 0) {
    delete errors.value.owners
  }
}, { deep: true })

function validateForm(): boolean {
  errors.value = {}

  // Title
  if (!form.value.title || form.value.title.trim() === '') {
    errors.value.title = 'Risk title is required'
  } else if (form.value.title.length > 200) {
    errors.value.title = 'Title must be at most 200 characters'
  }

  // Description
  if (!form.value.description || form.value.description.trim() === '') {
    errors.value.description = 'Risk description is required'
  } else if (form.value.description.length > 2000) {
    errors.value.description = 'Description must be at most 2000 characters'
  }

  // Time Horizon
  if (!form.value.timeHorizon) {
    errors.value.timeHorizon = 'Time horizon is required'
  }

  // Category
  if (!form.value.category) {
    errors.value.category = 'Risk category is required'
  }

  // Financial Impact Amount
  if (form.value.financialImpact.hasImpact) {
    if (!form.value.financialImpact.amount || form.value.financialImpact.amount <= 0) {
      errors.value.financialImpact = 'Financial impact amount is required when financial impact is Yes'
    }
  }

  // Risk Owners
  if (!form.value.owners || form.value.owners.length === 0) {
    errors.value.owners = 'At least one risk owner is required'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!risk.value) return

  // Check if locked
  if (risk.value.status === 'Locked') {
    showError('Cannot edit locked risk')
    return
  }

  if (!validateForm()) {
    showError('Please fix the errors in the form')
    return
  }

  // Confirm if owners are being removed
  if (removedOwners.value.length > 0) {
    const ownerNames = removedOwners.value.map(o => o.name).join(', ')
    if (!confirm(`Are you sure you want to remove the following owners: ${ownerNames}? Their ratings will be marked inactive but retained for audit.`)) {
      return
    }
  }

  isSubmitting.value = true
  error.value = ''

  try {
    const payload: UpdateRiskRequest = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      timeHorizon: form.value.timeHorizon as TimeHorizon,
      category: form.value.category as RiskCategory,
      financialImpact: {
        hasImpact: form.value.financialImpact.hasImpact,
        amount: form.value.financialImpact.hasImpact ? form.value.financialImpact.amount : undefined,
      },
      owners: form.value.owners,
    }

    await riskService.updateRisk(riskId.value, payload)
    showSuccess(`Risk "${form.value.title}" updated successfully`)
    router.push(`/risks/${riskId.value}`)
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update risk'
    showError(errorMessage)
    error.value = errorMessage
  } finally {
    isSubmitting.value = false
  }
}
</script>
