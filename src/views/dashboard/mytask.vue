<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Dashboard
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {{ authStore.userName }}
        </p>
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
          <span
            :class="[
              'text-xs font-medium px-2 py-0.5 rounded',
              stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            ]"
          >
            {{ stat.change }}
          </span>
        </div>
        <div class="text-3xl font-semibold text-gray-900 dark:text-gray-100">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Risk Table -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Risk Title</h2>
            <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              See all
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Title</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Owner</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Horizon</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Level</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="risk in sampleRisks" :key="risk.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ risk.title }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ risk.owner }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ risk.timeHorizon }}</td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'inline-block px-2 py-1 text-xs font-medium rounded',
                      risk.level === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                      risk.level === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    ]">
                      {{ risk.level }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      {{ risk.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              ← Previous
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">1</span>
            <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              Next →
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Risk Distribution -->
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Risk Distribution</h3>
          <div class="space-y-3">
            <div v-for="risk in riskDistribution" :key="risk.level">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">{{ risk.level }}</span>
                <span class="font-medium text-gray-900 dark:text-gray-100">{{ risk.count }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${risk.percentage}%`, backgroundColor: risk.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="$router.push(action.link)"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.iconPath" />
              </svg>
              {{ action.title }}
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

const stats = ref([
  { label: 'Total Risks', value: '29', trend: 'up', change: '+12%' },
  { label: 'High Priority', value: '8', trend: 'down', change: '-5%' },
  { label: 'Pending Reviews', value: '5', trend: 'up', change: '+3' },
  { label: 'Completed', value: '16', trend: 'up', change: '+8' },
])

const sampleRisks = ref([
  {
    id: 1,
    title: 'Energy Transition: Decarbonisation and Competition from New Energy Sources',
    owner: 'Michael Wong',
    timeHorizon: '1-3 years',
    level: 'High',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Tan Chok Liang',
    owner: 'Tan Chok Liang',
    timeHorizon: '4-5 years',
    level: 'Medium',
    status: 'Valid'
  },
  {
    id: 3,
    title: 'Chan Liang',
    owner: 'Chan Liang',
    timeHorizon: '2-5 years',
    level: 'High',
    status: 'Published'
  },
  {
    id: 4,
    title: 'Lim San San',
    owner: 'Lim San San',
    timeHorizon: '2-3 years',
    level: 'VeryHigh',
    status: 'Published'
  },
])

const riskDistribution = ref([
  { level: 'Very High', count: 5, percentage: 17, color: '#ef4444' },
  { level: 'High', count: 12, percentage: 41, color: '#f97316' },
  { level: 'Medium', count: 10, percentage: 34, color: '#eab308' },
  { level: 'Low', count: 2, percentage: 7, color: '#22c55e' },
])

const quickActions = ref([
  {
    title: 'View Heat Map',
    iconPath: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z',
    link: '/heatmap',
  },
  {
    title: 'Generate Report',
    iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    link: '/reports',
  },
  {
    title: 'Manage Versions',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    link: '/versions',
  },
])
</script>