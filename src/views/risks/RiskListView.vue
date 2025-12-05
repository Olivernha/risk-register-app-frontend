<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risks</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage all organizational risks</p>
      </div>
      <button
        v-if="authStore.hasRole(['RiskManagement', 'Admin'])"
        @click="$router.push('/risks/create')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Risk
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <input
            type="text"
            placeholder="Search risks..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <select class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option>All Levels</option>
          <option>Very High</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option>All Categories</option>
          <option>Strategic</option>
          <option>Operational</option>
          <option>Financial</option>
        </select>
      </div>
    </div>

    <!-- Risk List Table -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ref</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Level</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owners</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="risk in sampleRisks" :key="risk.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ risk.ref }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ risk.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ risk.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {{ risk.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  risk.level === 'Very High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : '',
                  risk.level === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : '',
                  risk.level === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : '',
                  risk.level === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''
                ]">
                  {{ risk.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex -space-x-2">
                  <div v-for="(owner, idx) in risk.owners.slice(0, 3)" :key="idx" 
                    class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-slate-800"
                  >
                    {{ owner }}
                  </div>
                  <div v-if="risk.owners.length > 3" 
                    class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-medium border-2 border-white dark:border-slate-800"
                  >
                    +{{ risk.owners.length - 3 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  risk.status === 'Published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : '',
                  risk.status === 'Draft' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : '',
                  risk.status === 'Locked' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : ''
                ]">
                  {{ risk.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="$router.push(`/risks/${risk.id}`)"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">29</span> risks
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
            Previous
          </button>
          <button class="px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded text-sm">1</button>
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">2</button>
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">3</button>
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const sampleRisks = ref([
  {
    id: 1,
    ref: 'R1.1',
    title: 'Energy Transition Risk',
    description: 'Regulatory changes in renewable energy',
    category: 'Strategic',
    level: 'Very High',
    owners: ['JD', 'SM', 'AK'],
    status: 'Published'
  },
  {
    id: 2,
    ref: 'R1.2',
    title: 'Carbon Offset Compliance',
    description: 'Meeting carbon neutrality targets',
    category: 'Compliance',
    level: 'High',
    owners: ['DW', 'KC'],
    status: 'Published'
  },
  {
    id: 3,
    ref: 'R2.1',
    title: 'Supply Chain Disruption',
    description: 'Biomass supply availability',
    category: 'Operational',
    level: 'Medium',
    owners: ['AL', 'TN', 'BR', 'MK'],
    status: 'Draft'
  },
  {
    id: 4,
    ref: 'R2.2',
    title: 'Technology Obsolescence',
    description: 'Legacy systems modernization',
    category: 'Operational',
    level: 'Medium',
    owners: ['JD'],
    status: 'Locked'
  },
  {
    id: 5,
    ref: 'R3.1',
    title: 'Market Price Volatility',
    description: 'Energy market price fluctuations',
    category: 'Financial',
    level: 'High',
    owners: ['SM', 'DW'],
    status: 'Published'
  },
])
</script>
