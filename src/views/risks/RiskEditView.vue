<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Edit Risk</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Modify risk information</p>
      </div>
      <button
        @click="$router.push('/risks')"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        Cancel
      </button>
    </div>

    <!-- Locked Status Warning -->
    <div v-if="risk && risk.status === 'Locked'" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-500">Risk is Locked</h3>
          <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">This risk cannot be edited because its status is "Locked". Please contact an administrator to unlock it.</p>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            v-model="form.title"
            :disabled="isFormDisabled"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter risk title"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            :disabled="isFormDisabled"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Describe the risk"
          ></textarea>
        </div>

        <!-- Risk Owners and Time Horizon -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risk Owners
            </label>
            <select
              v-model="form.owners"
              multiple
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="michael">Michael Wong</option>
              <option value="tan">Tan Chok Liang</option>
              <option value="chan">Chan Liang</option>
              <option value="lim">Lim San San</option>
            </select>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Horizon
            </label>
            <select
              v-model="form.timeHorizon"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="1-3">1-3 years</option>
              <option value="2-5">2-5 years</option>
              <option value="4-5">4-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
        </div>

        <!-- Financial Impact -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Financial Impact
          </label>
          <div class="flex gap-4">
            <input
              v-model="form.financialImpact"
              type="number"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Amount"
            />
            <select
              v-model="form.currency"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SGD">SGD</option>
            </select>
          </div>
        </div>

        <!-- Likelihood x Impact -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Likelihood x Impact
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-2">Likelihood</label>
              <select
                v-model="form.likelihood"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="1">1 - Negligible</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Major</option>
                <option value="5">5 - Catastrophic</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-2">Impact</label>
              <select
                v-model="form.impact"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="1">1 - Negligible</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Major</option>
                <option value="5">5 - Catastrophic</option>
              </select>
            </div>
          </div>
          <div v-if="riskLevel" class="mt-3 inline-block px-3 py-1 text-sm font-medium rounded" :class="riskLevelClass">
            Risk Level: {{ riskLevel }}
          </div>
        </div>

        <!-- Mitigation Measures -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mitigation Measures
          </label>
          <div class="space-y-2">
            <div v-for="(measure, index) in form.mitigations" :key="index" class="flex gap-2">
              <input
                v-model="form.mitigations[index]"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Mitigation action"
              />
              <button
                type="button"
                @click="removeMitigation(index)"
                class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              @click="addMitigation"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              + Add Mitigation
            </button>
          </div>
        </div>

        <!-- Additional Questions -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Questions
          </label>
          <textarea
            v-model="form.additionalQuestions"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Any additional questions or notes"
          ></textarea>
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
            :disabled="isFormDisabled"
            class="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Risk
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRiskStore } from '@/stores/risk'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const riskStore = useRiskStore()
const authStore = useAuthStore()

const loading = ref(true)
const submitting = ref(false)
const risk = computed(() => riskStore.currentRisk)
const originalOwners = ref<string[]>([])

const isLocked = computed(() => risk.value?.status === 'Locked')
const isFormDisabled = computed(() => isLocked.value || submitting.value)

const form = ref({
  title: '',
  description: '',
  owners: [] as string[],
  timeHorizon: '1-3',
  financialImpact: '',
  currency: 'USD',
  likelihood: '3',
  impact: '3',
  mitigations: [''] as string[],
  additionalQuestions: ''
})

const riskLevel = computed(() => {
  const score = parseInt(form.value.likelihood) * parseInt(form.value.impact)
  if (score >= 20) return 'Very High'
  if (score >= 15) return 'High'
  if (score >= 8) return 'Medium'
  if (score >= 1) return 'Low'
  return ''
})

const riskLevelClass = computed(() => {
  switch (riskLevel.value) {
    case 'Very High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    default: return ''
  }
})

const addMitigation = () => {
  form.value.mitigations.push('')
}

const removeMitigation = (index: number) => {
  form.value.mitigations.splice(index, 1)
}

async function handleSubmit() {
  if (!risk.value) return

  // Check if locked
  if (isLocked.value) {
    alert('Cannot edit a locked risk. Please contact an administrator to unlock it.')
    return
  }

  // Validate owners
  if (!form.value.owners || form.value.owners.length === 0) {
    alert('Cannot remove all owners. At least one risk owner is required.')
    return
  }

  // Check if owners were removed
  const removedOwners = originalOwners.value.filter(o => !form.value.owners.includes(o))
  if (removedOwners.length > 0) {
    const ownerNames = removedOwners.map(id => getOwnerName(id)).join(', ')
    const confirmed = confirm(`You are removing the following owner(s): ${ownerNames}. Do you want to continue?`)
    if (!confirmed) {
      return
    }
  }

  submitting.value = true
  try {
    const riskId = route.params.id as string
    
    // Prepare update data
    const updateData = {
      title: form.value.title,
      description: form.value.description,
      timeHorizon: `${form.value.timeHorizon} years`,
      financialImpact: {
        hasImpact: !!form.value.financialImpact,
        amount: parseFloat(form.value.financialImpact) || 0,
      },
      owners: form.value.owners.map((owner: string) => ({
        userId: owner,
        name: getOwnerName(owner),
        email: `${owner}@company.com`,
        assignedAt: new Date().toISOString(),
      })),
      mitigations: form.value.mitigations
        .filter(m => m.trim())
        .map((mitigation, index) => ({
          controlId: `mit-${Date.now()}-${index}`,
          title: mitigation,
          details: '',
          controlOwner: { userId: 'user-001', name: 'TBD' },
          actionOwner: { userId: 'user-001', name: 'TBD' },
          status: 'Not Started',
          targetDate: null,
          actualCompletionDate: null,
          progressPercentage: 0,
          commentsThreadId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      audit: {
        ...risk.value.audit,
        updatedBy: authStore.user?.userId || 'current-user',
        updatedAt: new Date().toISOString(),
      },
    }

    await riskStore.updateRisk(riskId, updateData)
    router.push(`/risks/${riskId}`)
  } catch (error) {
    console.error('Failed to update risk:', error)
    alert('Failed to update risk. Please try again.')
  } finally {
    submitting.value = false
  }
}

function getOwnerName(userId: string): string {
  const names: Record<string, string> = {
    michael: 'Michael Wong',
    tan: 'Tan Chok Liang',
    chan: 'Chan Liang',
    lim: 'Lim San San',
  }
  return names[userId] || userId
}

onMounted(async () => {
  const riskId = route.params.id as string
  try {
    await riskStore.fetchRisk(riskId)
    
    if (risk.value) {
      // Save original owners for comparison
      originalOwners.value = risk.value.owners?.map((o: any) => o.userId) || []
      
      // Populate form with existing data
      form.value = {
        title: risk.value.title,
        description: risk.value.description,
        owners: [...originalOwners.value],
        timeHorizon: risk.value.timeHorizon?.replace(' years', '') || '1-3',
        financialImpact: risk.value.financialImpact?.amount?.toString() || '',
        currency: 'USD',
        likelihood: '3',
        impact: '3',
        mitigations: risk.value.mitigations?.map((m: any) => m.title) || [''],
        additionalQuestions: ''
      }
    }
  } catch (error) {
    console.error('Failed to load risk:', error)
    alert('Risk not found')
    router.push('/risks')
  } finally {
    loading.value = false
  }
})
</script>
