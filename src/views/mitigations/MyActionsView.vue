<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">My Action Items</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your assigned mitigation measures
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Filter by Status -->
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Total Actions</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Not Started</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stats.notStarted }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Ongoing</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stats.ongoing }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stats.completed }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Mitigations List -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Action Items</h2>
      </div>

      <div v-if="loading" class="p-8 text-center text-slate-500 dark:text-slate-400">
        Loading your action items...
      </div>

      <div v-else-if="filteredMitigations.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-slate-500 dark:text-slate-400">
          {{ filterStatus ? 'No action items match the selected filter' : 'No action items assigned to you' }}
        </p>
      </div>

      <div v-else class="divide-y divide-slate-200 dark:divide-slate-700">
        <div
          v-for="item in filteredMitigations"
          :key="item.mitigation.controlId"
          class="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <!-- Risk Context -->
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Risk: {{ item.risk.refNo }}
                </span>
                <span class="text-xs text-slate-400 dark:text-slate-500">•</span>
                <router-link
                  :to="`/risks/${item.risk.id}`"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ item.risk.title }}
                </router-link>
              </div>

              <!-- Mitigation Title -->
              <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {{ item.mitigation.title }}
              </h3>

              <!-- Details -->
              <div class="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2" v-html="item.mitigation.details"></div>

              <!-- Meta Info -->
              <div class="flex flex-wrap items-center gap-4 text-sm">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-slate-600 dark:text-slate-400">
                    Due: {{ formatDate(item.mitigation.targetDate) }}
                  </span>
                  <span
                    v-if="isOverdue(item.mitigation)"
                    class="ml-1 text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    (Overdue)
                  </span>
                </div>

                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span class="text-slate-600 dark:text-slate-400">
                    Progress: {{ item.mitigation.progressPercentage }}%
                  </span>
                </div>

                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-slate-600 dark:text-slate-400">
                    Control Owner: {{ item.mitigation.controlOwner.name }}
                  </span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-3">
                <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{{ item.mitigation.progressPercentage }}%</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all"
                    :class="getProgressBarClass(item.mitigation.progressPercentage)"
                    :style="{ width: `${item.mitigation.progressPercentage}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col items-end gap-3">
              <span :class="[
                'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                getStatusClass(item.mitigation.status)
              ]">
                {{ item.mitigation.status }}
              </span>

              <button
                @click="openUpdateModal(item)"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <UpdateMitigationModal
      :is-open="showUpdateModal"
      :mitigation="selectedMitigation?.mitigation || null"
      :risk-id="selectedMitigation?.risk.id || ''"
      @close="showUpdateModal = false"
      @updated="handleMitigationUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import UpdateMitigationModal from '@/components/mitigations/UpdateMitigationModal.vue'
import type { Risk, Mitigation, MitigationStatus } from '@/types'

interface MitigationWithRisk {
  mitigation: Mitigation
  risk: Risk
}

const authStore = useAuthStore()
const riskStore = useRiskStore()

const loading = ref(true)
const filterStatus = ref<MitigationStatus | ''>('')
const showUpdateModal = ref(false)
const selectedMitigation = ref<MitigationWithRisk | null>(null)

const myMitigations = computed<MitigationWithRisk[]>(() => {
  if (!authStore.user) return []

  const items: MitigationWithRisk[] = []
  
  riskStore.risks.forEach(risk => {
    if (risk.mitigations && risk.mitigations.length > 0) {
      risk.mitigations.forEach(mitigation => {
        if (mitigation.actionOwner.userId === authStore.user?.userId) {
          items.push({ mitigation, risk })
        }
      })
    }
  })

  // Sort by target date (earliest first), then by status
  return items.sort((a, b) => {
    const dateA = new Date(a.mitigation.targetDate).getTime()
    const dateB = new Date(b.mitigation.targetDate).getTime()
    return dateA - dateB
  })
})

const filteredMitigations = computed(() => {
  if (!filterStatus.value) return myMitigations.value
  return myMitigations.value.filter(item => item.mitigation.status === filterStatus.value)
})

const stats = computed(() => {
  const total = myMitigations.value.length
  const notStarted = myMitigations.value.filter(m => m.mitigation.status === 'Not Started').length
  const ongoing = myMitigations.value.filter(m => m.mitigation.status === 'Ongoing').length
  const completed = myMitigations.value.filter(m => m.mitigation.status === 'Completed').length

  return { total, notStarted, ongoing, completed }
})

onMounted(async () => {
  try {
    await riskStore.fetchRisks()
  } finally {
    loading.value = false
  }
})

function getStatusClass(status: MitigationStatus) {
  switch (status) {
    case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Ongoing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    case 'Not Started': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function getProgressBarClass(percentage: number) {
  if (percentage === 100) return 'bg-green-500'
  if (percentage >= 50) return 'bg-blue-500'
  if (percentage > 0) return 'bg-yellow-500'
  return 'bg-gray-400'
}

function formatDate(date: Date | string | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

function isOverdue(mitigation: Mitigation) {
  if (mitigation.status === 'Completed') return false
  const targetDate = new Date(mitigation.targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return targetDate < today
}

function openUpdateModal(item: MitigationWithRisk) {
  selectedMitigation.value = item
  showUpdateModal.value = true
}

async function handleMitigationUpdated() {
  // Refresh risks to get updated mitigation data
  await riskStore.fetchRisks()
}
</script>
