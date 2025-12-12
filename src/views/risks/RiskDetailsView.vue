<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>

  <div v-else-if="risk" class="space-y-6 fade-in">
    <!-- Header -->
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
          <ul v-if="risk.owners && risk.owners.length > 0" class="space-y-2">
            <li v-for="owner in risk.owners" :key="owner.userId" class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                {{ getInitials(owner.name) }}
              </div>
              <div>
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ owner.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ owner.email }}</div>
              </div>
            </li>
          </ul>
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            No owners assigned
          </div>
        </div>

        <!-- Mitigation Measures -->
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Mitigation Measures</h3>
          </div>
          <div v-if="risk.mitigations && risk.mitigations.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Progress</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="mitigation in risk.mitigations" :key="mitigation.controlId" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ mitigation.title }}</td>
                  <td class="px-4 py-3">
                    <span :class="[
                      'inline-block px-2 py-1 text-xs font-medium rounded',
                      mitigation.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : '',
                      mitigation.status === 'Ongoing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : '',
                      mitigation.status === 'Not Started' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : ''
                    ]">
                      {{ mitigation.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.progressPercentage }}%</td>
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.actionOwner?.name || 'TBD' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No mitigations added yet
          </div>
        </div>
      </div>

      <!-- Right Column - Sidebar -->
      <div class="space-y-6">
        <!-- Likelihood x Impact -->
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Risk Rating</h3>
          <div v-if="risk.averageRating" class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Likelihood</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.averageRating.likelihood }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Impact</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.averageRating.impact }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  risk.averageRating.riskLevel === 'Very High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : '',
                  risk.averageRating.riskLevel === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : '',
                  risk.averageRating.riskLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : '',
                  risk.averageRating.riskLevel === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''
                ]">
                  {{ risk.averageRating.riskLevel }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            Not rated yet
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
                risk.status === 'Published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : '',
                risk.status === 'Draft' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : '',
                risk.status === 'Locked' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : ''
              ]">
                {{ risk.status }}
              </span>
            </div>
            <div v-if="risk.financialImpact && risk.financialImpact.hasImpact">
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Financial Impact</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">${{ formatNumber(risk.financialImpact.amount) }}</span>
            </div>
            <div v-if="risk.audit">
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-gray-600 dark:text-gray-400">Risk not found</p>
      <button
        @click="$router.push('/risks')"
        class="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      >
        Back to Risks
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRiskStore } from '@/stores/risk'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const riskStore = useRiskStore()
const authStore = useAuthStore()

const loading = ref(true)
const risk = computed(() => riskStore.currentRisk)

const canEdit = computed(() => {
  if (!risk.value) return false
  if (risk.value.status === 'Locked') return false
  return authStore.hasRole(['RiskManagement', 'Admin'])
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

onMounted(async () => {
  const riskId = route.params.id as string
  try {
    await riskStore.fetchRisk(riskId)
  } catch (error) {
    console.error('Failed to load risk:', error)
  } finally {
    loading.value = false
  }
})
</script>