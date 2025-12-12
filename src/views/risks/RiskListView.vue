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
    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search risks..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <select v-model="selectedLevel" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option>All Levels</option>
          <option>Very High</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select v-model="selectedCategory" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option>All Categories</option>
          <option>Strategic</option>
          <option>Operational</option>
          <option>Financial</option>
          <option>Compliance</option>
        </select>
      </div>
    </div>

    <!-- Risk List Table -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading risks...
      </div>
      <div v-else class="overflow-x-auto">
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
            <tr v-for="risk in paginatedRisks" :key="risk._id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ risk.refNo }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ risk.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{{ risk.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {{ risk.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  getRiskLevelClass(risk.averageRating?.riskLevel)
                ]">
                  {{ risk.averageRating?.riskLevel || 'Unrated' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex -space-x-2">
                  <div v-for="(owner, idx) in risk.owners.slice(0, 3)" :key="owner.userId" 
                    class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-slate-800"
                    :title="owner.name"
                  >
                    {{ getInitials(owner.name) }}
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
                  getStatusClass(risk.status)
                ]">
                  {{ risk.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="$router.push(`/risks/${risk._id}`)"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  View
                </button>
              </td>
            </tr>
            <tr v-if="paginatedRisks.length === 0" class="hover:bg-transparent">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No risks found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalRisks) }}</span> of <span class="font-medium">{{ totalRisks }}</span> risks
        </div>
        <div class="flex gap-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button class="px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded text-sm">{{ currentPage }}</button>
          <button 
            @click="currentPage++"
            :disabled="currentPage * itemsPerPage >= totalRisks"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import type { Risk, RiskLevel, RiskCategory } from '@/types'

const authStore = useAuthStore()
const riskStore = useRiskStore()
const { risks, loading } = storeToRefs(riskStore)

const searchQuery = ref('')
const selectedLevel = ref('All Levels')
const selectedCategory = ref('All Categories')

onMounted(() => {
  riskStore.fetchRisks()
})

const filteredRisks = computed(() => {
  return risks.value.filter(risk => {
    const matchesSearch = 
      risk.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      risk.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      risk.refNo.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesLevel = selectedLevel.value === 'All Levels' || risk.averageRating?.riskLevel === selectedLevel.value
    const matchesCategory = selectedCategory.value === 'All Categories' || risk.category === selectedCategory.value

    return matchesSearch && matchesLevel && matchesCategory
  })
})

// Pagination (mock for now)
const currentPage = ref(1)
const itemsPerPage = 10
const totalRisks = computed(() => filteredRisks.value.length)
const paginatedRisks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRisks.value.slice(start, end)
})

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

// Helper to get initials
function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}
</script>
