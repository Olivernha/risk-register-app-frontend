<template>
  <div class="space-y-6 fade-in">
    <!-- Loading State -->
    <div v-if="!risk" class="p-8 text-center text-gray-500 dark:text-gray-400">
      Loading risk details...
    </div>

    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <button
            @click="$router.push('/risks')"
            class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Risks
          </button>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risk Details</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ risk.refNo }} - {{ risk.title }}</p>
        </div>
        <div class="flex gap-2">
            <button
            v-if="canPublish"
            @click="handlePublish"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Publish Risk
            </button>
            <button
            v-if="canLock"
            @click="handleLock"
            class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Lock Risk
            </button>
            <button
            v-if="canDelete"
            @click="handleDelete"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Risk
            </button>
            <button
            v-if="canEdit"
            @click="$router.push(`/risks/${risk.id}/edit`)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Risk
            </button>
        </div>
      </div>

      <!-- Locked Warning Banner -->
      <div v-if="risk.status === 'Locked'" class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div class="flex-1">
            <h3 class="font-medium text-purple-900 dark:text-purple-100 mb-1">Risk is Locked</h3>
            <p class="text-sm text-purple-700 dark:text-purple-300">
              This risk has been locked for the quarterly cycle. Master data and ratings are read-only. Mitigations can still be updated by action owners.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Risk Information -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ risk.title }}
            </h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ risk.description }}</p>
              </div>
            </div>
          </div>

          <!-- Risk Owners -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Risk Owners</h3>
            <ul class="space-y-2">
              <li v-for="owner in risk.owners" :key="owner.userId" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                  {{ owner.name?.substring(0, 2).toUpperCase() }}
                </div>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ owner.name }}</span>
              </li>
            </ul>
          </div>

          <!-- Mitigation Measures -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Mitigation Measures</h3>
              <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                Action thread →
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action Item</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Details</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="mitigation in risk.mitigations" :key="mitigation.controlId" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ mitigation.title }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.details }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {{ mitigation.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.actionOwner.name }}</td>
                  </tr>
                  <tr v-if="risk.mitigations?.length === 0">
                    <td colspan="4" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No mitigation measures recorded.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Likelihood x Impact -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Likelihood x Impact</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Likelihood</span>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.averageRating?.likelihood || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Impact</span>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.averageRating?.impact || 'N/A' }}</span>
              </div>
              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
                  <span :class="[
                    'inline-block px-2 py-1 text-xs font-medium rounded',
                    getRiskLevelClass(risk.averageRating?.riskLevel)
                  ]">
                    {{ risk.averageRating?.riskLevel || 'Unrated' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Additional Information</h3>
            <div class="space-y-3">
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time Horizon</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ risk.timeHorizon }}</span>
              </div>
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</span>
                <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {{ risk.category }}
                </span>
              </div>
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Status</span>
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  getStatusClass(risk.status)
                ]">
                  {{ risk.status }}
                </span>
              </div>
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit?.updatedAt) }}</span>
              </div>
              <div v-if="risk.status === 'Locked' && risk.audit?.lockedBy">
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Locked By</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ risk.audit.lockedBy }}</span>
              </div>
              <div v-if="risk.status === 'Locked' && risk.audit?.lockedAt">
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Locked At</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit.lockedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import type { RiskLevel } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const riskStore = useRiskStore()

const risk = computed(() => {
  const id = route.params.id as string

  return riskStore.getRiskById(id)
})

onMounted(() => {
  const id = route.params.id as string
  riskStore.fetchRiskById(id)
})

const canEdit = computed(() => {
  return authStore.hasRole(['RiskManagement', 'Admin'])
})

const canPublish = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isDraft = risk.value.status === 'Draft'
  const hasOwners = risk.value.owners && risk.value.owners.length > 0
  return isRM && isDraft && hasOwners
})

const canDelete = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isDraft = risk.value.status === 'Draft'
  const hasNoRatings = (!risk.value.ratings || risk.value.ratings.length === 0)
  const hasNoMitigations = (!risk.value.mitigations || risk.value.mitigations.length === 0)
  return isRM && isDraft && hasNoRatings && hasNoMitigations
})

const canLock = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isPublished = risk.value.status === 'Published'
  return isRM && isPublished
})

async function handlePublish() {
  if (!risk.value) return
  
  if (!confirm('Are you sure you want to publish this risk? It will be visible to all assigned owners for rating.')) {
    return
  }

  try {
    await riskStore.publishRisk(risk.value.id)
    alert('Risk published successfully!')
    // No need to reload, store is reactive
  } catch (e: any) {
    alert(e.message)
  }
}

async function handleDelete() {
  if (!risk.value) return

  const reason = prompt('Please enter a reason for deleting this risk:')
  if (reason === null) return // user cancelled
  if (!reason.trim()) {
    alert('Deletion reason is required.')
    return
  }

  try {
    await riskStore.deleteRisk(risk.value.id, reason)
    alert('Risk deleted successfully.')
    route.push('/risks')
  } catch (e: any) {
    alert(e.message)
  }
}

async function handleLock() {
  if (!risk.value) return

  try {
    // First attempt without override
    await riskStore.lockRisk(risk.value.id, false)
    alert('Risk locked successfully!')
  } catch (e: any) {
    // Check if error is due to incomplete ratings
    if (e.message.startsWith('INCOMPLETE_RATINGS:')) {
      const pendingOwners = e.message.substring('INCOMPLETE_RATINGS:'.length)
      const confirmOverride = confirm(
        `Warning: The following owners have not submitted ratings:\n\n${pendingOwners}\n\n` +
        `Do you want to lock this risk anyway?`
      )
      
      if (confirmOverride) {
        try {
          await riskStore.lockRisk(risk.value.id, true)
          alert('Risk locked successfully (with incomplete ratings).')
        } catch (overrideError: any) {
          alert(overrideError.message)
        }
      }
    } else {
      alert(e.message)
    }
  }
}

function getRiskLevelClass(level?: RiskLevel) {
  switch (level) {
    case 'Very High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Published': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    case 'Locked': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function formatDate(date: string | Date | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}
</script>
