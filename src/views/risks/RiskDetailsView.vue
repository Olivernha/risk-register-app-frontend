<template>
  <div class="space-y-6 fade-in">
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
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ risk.ref }} - {{ risk.title }}</p>
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
          <ul class="space-y-2">
            <li v-for="owner in risk.owners" :key="owner" class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                {{ owner.substring(0, 2).toUpperCase() }}
              </div>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ owner }}</span>
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
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="mitigation in risk.mitigations" :key="mitigation.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ mitigation.item }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.action }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {{ mitigation.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.owner }}</td>
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
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.likelihood }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Impact</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.impact }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  risk.level === 'Very High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : '',
                  risk.level === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : '',
                  risk.level === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : '',
                  risk.level === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''
                ]">
                  {{ risk.level }}
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
              <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                {{ risk.status }}
              </span>
            </div>
            <div>
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ risk.lastUpdated }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Sample risk data - would come from API
const risk = ref({
  id: 1,
  ref: 'R1.1',
  title: 'Energy Transition: Decarbonisation and Competition from New Energy Sources',
  description: 'Technology advancement and evolving business models in renewable energy and clean energy are likely to accelerate the shift away from fossil fuels. And governments and investors are increasingly demanding that companies take action to address climate change, making business decisions or investments as appropriate.',
  owners: ['Michael Wong', 'Tan Chok Liang', 'Ehan Liang', 'Lim Sam San'],
  likelihood: 'Very High',
  impact: 'Very High',
  level: 'Very High',
  timeHorizon: '1-3 years',
  category: 'Strategic',
  status: 'Published',
  lastUpdated: '2 days ago',
  mitigations: [
    { id: 1, item: 'Add Mitigation', action: 'Commence', status: 'Ongoing', owner: 'Wa Hinola' },
    { id: 2, item: 'Add Question', action: '', status: '', owner: 'Lim Sam' }
  ]
})

const canEdit = computed(() => {
  return authStore.hasRole(['RiskManagement', 'Admin'])
})
</script>
