<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Risk Management</h1>
        <p class="text-slate-600">Manage and track all organizational risks</p>
      </div>
      <button
        v-if="authStore.hasRole(['RiskManagement', 'Admin'])"
        @click="$router.push('/risks/create')"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Risk
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">Search Risks</label>
          <div class="relative">
            <input
              type="text"
              placeholder="Search by title, reference, or description..."
              class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Risk Level</label>
          <select class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Levels</option>
            <option>Very High</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Categories</option>
            <option>Strategic</option>
            <option>Operational</option>
            <option>Financial</option>
            <option>Compliance</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Risk List Card -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-red-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">Risk Register</h2>
              <p class="text-sm text-slate-600">Comprehensive list of all identified risks</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-white rounded-lg transition-colors">
              <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button class="p-2 hover:bg-white rounded-lg transition-colors">
              <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ref</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk Title</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk Level</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Owners</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="risk in sampleRisks" :key="risk.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-slate-900">{{ risk.ref }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">{{ risk.title }}</div>
                <div class="text-xs text-slate-500 mt-1">{{ risk.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {{ risk.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full',
                  risk.level === 'Very High' ? 'bg-rose-100 text-rose-700' : '',
                  risk.level === 'High' ? 'bg-orange-100 text-orange-700' : '',
                  risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' : '',
                  risk.level === 'Low' ? 'bg-emerald-100 text-emerald-700' : ''
                ]">
                  {{ risk.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex -space-x-2">
                  <div v-for="(owner, idx) in risk.owners.slice(0, 3)" :key="idx" 
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                  >
                    {{ owner }}
                  </div>
                  <div v-if="risk.owners.length > 3" 
                    class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold border-2 border-white"
                  >
                    +{{ risk.owners.length - 3 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  risk.status === 'Published' ? 'bg-green-100 text-green-700' : '',
                  risk.status === 'Draft' ? 'bg-gray-100 text-gray-700' : '',
                  risk.status === 'Locked' ? 'bg-purple-100 text-purple-700' : ''
                ]">
                  {{ risk.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-indigo-600 hover:text-indigo-900 font-medium">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-600">
            Showing <span class="font-semibold">1</span> to <span class="font-semibold">10</span> of <span class="font-semibold">29</span> risks
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
              Previous
            </button>
            <button class="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium">1</button>
            <button class="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">2</button>
            <button class="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">3</button>
            <button class="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
              Next
            </button>
          </div>
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
    description: 'Regulatory changes in renewable energy requirements',
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
    description: 'Biomass supply availability concerns',
    category: 'Operational',
    level: 'Medium',
    owners: ['AL', 'TN', 'BR', 'MK'],
    status: 'Draft'
  },
  {
    id: 4,
    ref: 'R2.2',
    title: 'Technology Obsolescence',
    description: 'Legacy systems requiring modernization',
    category: 'Operational',
    level: 'Medium',
    owners: ['JD'],
    status: 'Locked'
  },
  {
    id: 5,
    ref: 'R3.1',
    title: 'Market Price Volatility',
    description: 'Fluctuations in energy market prices',
    category: 'Financial',
    level: 'High',
    owners: ['SM', 'DW'],
    status: 'Published'
  },
])
</script>
