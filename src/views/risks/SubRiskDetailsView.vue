<template>
  <div class="space-y-6 fade-in">
    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400">
      Loading sub-risk details...
    </div>

    <template v-else-if="risk && subRisk">
      <div class="flex items-center justify-between">
        <div>
          <button
            @click="$router.push(`/risks/${risk.id}`)"
            class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Risk Details
          </button>
          <div class="flex items-center gap-3 mb-1">
            <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-bold">
              {{ subRisk.refNo }}
            </span>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ subRisk.title }}</h1>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Sub-risk of: {{ risk.refNo }} - {{ risk.title }}</p>
        </div>
        <div class="flex gap-2">
            <button
            v-if="canEdit"
            @click="$router.push(`/risks/${risk.id}/sub-risks/${subRisk.subRiskId}/edit`)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Progress
            </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Description</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ subRisk.description }}</p>
          </div>

          <div v-if="subRisk.progressComments" class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Progress Comments</h2>
            <div class="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ subRisk.progressComments }}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Implementation Strategy</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mitigation Measures</h3>
                  <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p v-if="subRisk.mitigationMeasures" class="text-sm text-gray-700 dark:text-gray-300">{{ subRisk.mitigationMeasures }}</p>
                    <p v-else class="text-sm text-gray-400 italic">No mitigation measures defined.</p>
                  </div>
                </div>
                <div>
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action Item</h3>
                  <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p v-if="subRisk.actionItem" class="text-sm text-gray-700 dark:text-gray-300">{{ subRisk.actionItem }}</p>
                    <p v-else class="text-sm text-gray-400 italic">No specific action item defined.</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Implementation Progress</h3>
                    <span v-if="subRisk.status === 'Completed'" class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Verified Complete
                    </span>
                  </div>
                  
                  <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                    <div class="flex items-center justify-between">
                      <span :class="[
                          'px-2 py-0.5 text-[10px] font-bold uppercase rounded',
                          getMitigationStatusClass(subRisk.status || 'Not Started')
                      ]">
                          {{ subRisk.status }}
                      </span>
                      <span class="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">{{ subRisk.progressPercentage || 0 }}%</span>
                    </div>

                    <div class="relative w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                            class="h-full bg-blue-500 transition-all duration-1000 ease-out flex items-center justify-end pr-1" 
                            :style="{ width: `${subRisk.progressPercentage || 0}%` }"
                        >
                          <div v-if="(subRisk.progressPercentage || 0) > 10" class="w-1 h-1 bg-white/40 rounded-full"></div>
                        </div>
                    </div>
                  </div>
                </div>

                <div v-if="subRisk.status === 'Completed' && subRisk.actualCompletionDate" class="flex flex-col gap-2">
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Actual Completion Date</h3>
                  <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm font-semibold">{{ formatDate(subRisk.actualCompletionDate) }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Implementation Date</h3>
                  <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium">{{ formatDate(subRisk.targetDate) }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Action Owner</h3>
                  <div v-if="subRisk.actionOwner" class="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50">
                    <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {{ subRisk.actionOwner.name.substring(0, 2) }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ subRisk.actionOwner.name }}</p>
                      <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase truncate max-w-[150px]">Assigned Owner</p>
                    </div>
                  </div>
                  <p v-else class="text-sm text-gray-400 italic">Unassigned</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Metadata</h3>
            <div class="space-y-4">
              <div>
                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Parent Risk ID</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ risk.refNo }}</span>
              </div>
              <div>
                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Created At</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit.createdAt) }}</span>
              </div>
              <div>
                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Updated</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400 backdrop-blur-sm bg-gray-50/10 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 17.272a4 4 0 115.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-lg font-medium">Sub-risk not found or parent risk invalid.</p>
      <button @click="$router.push('/risks')" class="mt-4 text-blue-600 hover:underline">Return to Risk List</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRiskStore } from '@/stores/riskStore'
import { useAuthStore } from '@/stores/auth'
import userService from '@/api/users'
import type { Risk, User, MitigationStatus } from '@/types'

const route = useRoute()
const riskStore = useRiskStore()
const authStore = useAuthStore()

const loading = ref(true)
const users = ref<User[]>([])

const riskId = computed(() => route.params.id as string)
const subId = computed(() => route.params.subId as string)

const risk = computed<Risk | undefined>(() => riskStore.getRiskById(riskId.value))
const subRisk = computed(() => risk.value?.subRisks?.find(s => s.subRiskId === subId.value))

const canEdit = computed(() => {
  if (!risk.value || !authStore.user) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isAO = subRisk.value?.actionOwner?.userId === authStore.user.userId
  return isRM || isAO
})

onMounted(async () => {
  loading.value = true
  await Promise.all([
    riskStore.fetchRiskById(riskId.value),
    fetchUsers()
  ])
  loading.value = false
})

async function fetchUsers() {
  try {
    const data = await userService.getUsers()
    users.value = data
  } catch (e) {
    console.error('Failed to fetch users', e)
  }
}


function formatDate(date: string | Date | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

function getMitigationStatusClass(status: MitigationStatus) {
  switch (status) {
    case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Ongoing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    case 'Not Started': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}
</script>
