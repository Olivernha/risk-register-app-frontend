<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {{ authStore.userName }}! 👋
        </h1>
        <p class="text-slate-600">
          Here's what's happening with your risks today
        </p>
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 scale-in"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
            :style="{ background: stat.gradient }"
          >
            <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath" />
            </svg>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            ]"
          >
            {{ stat.change }}
          </span>
        </div>
        <div class="text-3xl font-bold text-slate-900 mb-1">{{ stat.value }}</div>
        <div class="text-sm text-slate-600">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pending Tasks -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Tasks Card -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-slate-900">Pending Tasks</h2>
              </div>
              <span class="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                5 Urgent
              </span>
            </div>
          </div>
          <div class="divide-y divide-slate-100">
            <div
              v-for="task in pendingTasks"
              :key="task.id"
              @click="$router.push(task.link)"
              class="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    task.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                  ]"
                >
                  <svg
                    :class="[
                      'w-5 h-5',
                      task.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                    ]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="task.iconPath" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {{ task.title }}
                  </h3>
                  <p class="text-sm text-slate-600 mt-1">{{ task.description }}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <span
                    :class="[
                      'inline-block px-2 py-1 rounded-md text-xs font-semibold mb-1',
                      task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    ]"
                  >
                    {{ task.priority }}
                  </span>
                  <div class="text-xs text-slate-500">{{ task.dueDate }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-slate-900">Recent Activity</h2>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex gap-4"
              >
                <div class="flex flex-col items-center">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      activity.color === 'success' ? 'bg-emerald-500' : '',
                      activity.color === 'info' ? 'bg-blue-500' : '',
                      activity.color === 'warning' ? 'bg-yellow-500' : ''
                    ]"
                  ></div>
                  <div class="w-0.5 h-full bg-slate-200 mt-2"></div>
                </div>
                <div class="flex-1 pb-6">
                  <h3 class="font-semibold text-slate-900">{{ activity.title }}</h3>
                  <p class="text-sm text-slate-600 mt-1">{{ activity.description }}</p>
                  <div class="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ activity.time }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Risk Distribution -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-rose-50 to-orange-50">
            <h2 class="text-xl font-bold text-slate-900">Risk Distribution</h2>
          </div>
          <div class="p-6 space-y-4">
            <div
              v-for="risk in riskDistribution"
              :key="risk.level"
              class="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: risk.color }"
                  ></div>
                  <span class="font-semibold text-slate-900">{{ risk.level }}</span>
                </div>
                <span class="text-xl font-bold text-slate-900">{{ risk.count }}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${risk.percentage}%`, backgroundColor: risk.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 class="text-xl font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div class="p-4 space-y-2">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="$router.push(action.link)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                action.color === 'primary' ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : '',
                action.color === 'info' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : '',
                action.color === 'secondary' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' : ''
              ]"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  {
    label: 'Total Risks',
    value: '29',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trend: 'up',
    change: '+12%',
  },
  {
    label: 'High Priority',
    value: '8',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    trend: 'down',
    change: '-5%',
  },
  {
    label: 'Pending Reviews',
    value: '5',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    trend: 'up',
    change: '+3',
  },
  {
    label: 'Completed',
    value: '16',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    trend: 'up',
    change: '+8',
  },
])

const pendingTasks = ref([
  {
    id: 1,
    title: 'Submit Risk Rating',
    description: 'Energy Transition Risk - Awaiting your assessment',
    iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    priority: 'high',
    dueDate: 'Due today',
    link: '/risks/1',
  },
  {
    id: 2,
    title: 'Update Mitigation Status',
    description: 'Carbon offset project - Progress update required',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    priority: 'medium',
    dueDate: 'Due in 2 days',
    link: '/risks/2',
  },
  {
    id: 3,
    title: 'Answer Question',
    description: 'Biomass conversion timeline clarification',
    iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    priority: 'high',
    dueDate: 'Due today',
    link: '/risks/3',
  },
])

const recentActivity = ref([
  {
    id: 1,
    title: 'Risk Rating Submitted',
    description: 'John Doe submitted rating for R1.2',
    time: '2 hours ago',
    color: 'success',
  },
  {
    id: 2,
    title: 'New Risk Created',
    description: 'Cybersecurity Risk added by Risk Management',
    time: '5 hours ago',
    color: 'info',
  },
  {
    id: 3,
    title: 'Mitigation Completed',
    description: 'CCP upgrade project marked as completed',
    time: '1 day ago',
    color: 'success',
  },
  {
    id: 4,
    title: 'Version Locked',
    description: '2025 Q2 version finalized',
    time: '2 days ago',
    color: 'warning',
  },
])

const riskDistribution = ref([
  { level: 'Very High', count: 5, percentage: 17, color: '#f43f5e' },
  { level: 'High', count: 12, percentage: 41, color: '#fb923c' },
  { level: 'Medium', count: 10, percentage: 34, color: '#fbbf24' },
  { level: 'Low', count: 2, percentage: 7, color: '#34d399' },
])

const quickActions = ref([
  {
    title: 'View Heat Map',
    iconPath: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z',
    color: 'primary',
    link: '/heatmap',
  },
  {
    title: 'Generate Report',
    iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'info',
    link: '/reports',
  },
  {
    title: 'Manage Versions',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: 'secondary',
    link: '/versions',
  },
])
</script>