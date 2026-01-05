<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Create Risk</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Create a new risk record with complete details</p>
      </div>
      <button
        @click="$router.push('/risks')"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        Cancel
      </button>
    </div>

    <!-- Form Card -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Reference Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reference Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.refNo"
            type="text"
            maxlength="20"
            :class="[
              'w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2',
              errors.refNo ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            ]"
            placeholder="e.g., R1, R2, R3..."
            required
          />
          <p v-if="errors.refNo" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.refNo }}</p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Unique identifier within the version (e.g., R1, R2, R3...)</p>
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
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Hold Ctrl/Cmd to select multiple. Selected: {{ form.owners.length }} owner(s)
          </p>
        </div>

        <!-- Version (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            :value="activeVersion?.cycle || 'No active version'"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            readonly
            disabled
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Auto-set to current active version</p>
        </div>

        <!-- Status (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <input
            value="Draft"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            readonly
            disabled
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">New risks always start as Draft</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$router.push('/risks')"
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
            {{ isSubmitting ? 'Creating...' : 'Create Risk' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVersionStore } from '@/stores/version'
import { useNotifications } from '@/composables/useNotifications'
import { useAuthStore } from '@/stores/auth'
import riskService, { type CreateRiskRequest } from '@/api/risks'
import userService from '@/api/users'
import type { User, TimeHorizon, RiskCategory, RiskOwner, Rating, AuditInfo } from '@/types'

const router = useRouter()
const versionStore = useVersionStore()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotifications()

const form = ref<{
  refNo: string
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
  refNo: '',
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
const error = ref('')
const isSubmitting = ref(false)
const riskOwners = ref<User[]>([])
const loadingOwners = ref(false)

const activeVersion = computed(() => versionStore.activeVersion)

onMounted(async () => {
  // Fetch versions to get active version
  try {
    await versionStore.fetchVersions()
    
    // Auto-generate reference number if active version exists
    if (activeVersion.value) {
      try {
        form.value.refNo = await riskService.getNextRefNo(activeVersion.value.cycle)
      } catch (error) {
        console.warn('Could not auto-generate ref number, user will enter manually')
      }
    }
  } catch (error) {
    console.error('Failed to fetch versions:', error)
  }

  // Fetch risk owners
  loadingOwners.value = true
  try {
    const allUsers = await userService.getUsers()
    riskOwners.value = allUsers.filter(u => u.active !== false)
  } catch (error) {
    console.error('Failed to fetch risk owners:', error)
    showError('Failed to load risk owners. Please refresh the page.')
  } finally {
    loadingOwners.value = false
  }
})

function validateForm(): boolean {
  errors.value = {}

  // Reference Number
  if (!form.value.refNo || form.value.refNo.trim() === '') {
    errors.value.refNo = 'Reference number is required'
  } else if (form.value.refNo.length > 20) {
    errors.value.refNo = 'Reference number must be at most 20 characters'
  }

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

  // Active Version
  if (!activeVersion.value) {
    errors.value.version = 'No active version found. Please create an active version first.'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    showError('Please fix the errors in the form')
    return
  }

  if (!activeVersion.value) {
    showError('No active version found. Please create an active version first.')
    return
  }

  isSubmitting.value = true

  try {
    const selectedOwnerObjects: RiskOwner[] = riskOwners.value
      .filter(u => form.value.owners.includes(u.userId))
      .map(u => ({
        userId: u.userId,
        name: u.name,
        email: u.email,
        assignedAt: new Date()
      }))

    const ratings: Rating[] = selectedOwnerObjects.map(owner => ({
      ownerId: owner.userId,
      currentLikelihood: 0,
      currentImpact: 0,
      basisThreadId: '',
      updatedAt: new Date(),
      history: []
    }))

    const audit: AuditInfo = {
      createdBy: authStore.user?.userId || 'System',
      createdAt: new Date(),
      updatedBy: authStore.user?.userId || 'System',
      updatedAt: new Date()
    }

    const payload: CreateRiskRequest = {
      refNo: form.value.refNo.trim(),
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      timeHorizon: form.value.timeHorizon as TimeHorizon,
      category: form.value.category as RiskCategory,
      financialImpact: {
        hasImpact: form.value.financialImpact.hasImpact,
        amount: form.value.financialImpact.hasImpact ? form.value.financialImpact.amount : undefined,
      },
      owners: selectedOwnerObjects,
      version: activeVersion.value.cycle,
      status: 'Draft',
      ratings,
      mitigations: [],
      questions: [],
      audit
    }

    await riskService.createRisk(payload)
    showSuccess(`Risk "${form.value.title}" created successfully`)
    router.push('/risks')
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create risk'
    showError(errorMessage)
    console.error('Failed to create risk:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
