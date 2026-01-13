<template>
  <div class="space-y-6 fade-in p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div v-if="risk && subRisk" class="flex items-center justify-between mb-8">
      <div>
        <button
          @click="$router.push(`/risks/${risk.id}/sub-risks/${subRisk.subRiskId}`)"
          class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Details
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Update Sub-risk Status</h1>
        <div class="flex items-center gap-3 mt-1">
            <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-bold">
              {{ subRisk.refNo }}
            </span>
            <p class="text-sm text-gray-500 font-semibold">{{ subRisk.title }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>

    <div v-else-if="risk && subRisk" class="grid grid-cols-1 gap-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
          
          <!-- Section: Mitigation Details (RM Only for editing) -->
          <div class="space-y-6">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Mitigation Strategy</h3>
            </div>

            <div v-if="isRM" class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mitigation Measures</label>
                <textarea 
                  v-model="form.mitigationMeasures"
                  rows="4"
                  class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="Describe the overall mitigation strategy"
                ></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action Item</label>
                <textarea 
                  v-model="form.actionItem"
                  rows="4"
                  class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="Specific immediate actions"
                ></textarea>
              </div>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mitigation Measures</span>
                    <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ subRisk.mitigationMeasures || 'No measures defined.' }}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action Item</span>
                    <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ subRisk.actionItem || 'No specific action item defined.' }}</p>
                </div>
            </div>
          </div>

          <!-- Section: Progress Tracking -->
          <div class="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-1 h-4 bg-emerald-600 rounded-full"></div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Implementation Progress</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Left: Status and Bar -->
              <div class="space-y-6">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Status</label>
                  <select 
                    v-model="form.status"
                    class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Progress Percentage</label>
                    <span class="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">{{ form.progressPercentage }}%</span>
                  </div>
                  <div class="flex flex-col gap-4">
                    <input 
                      v-model.number="form.progressPercentage"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      class="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div class="w-full h-4 bg-gray-100 dark:bg-slate-900 rounded-full border border-gray-200 dark:border-gray-800 p-1 overflow-hidden shadow-inner">
                      <div 
                        class="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" 
                        :style="{ width: `${form.progressPercentage}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Target and Actual Dates -->
              <div class="space-y-6">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Completion Date</label>
                  <input 
                    v-model="form.targetDate"
                    type="date"
                    :readonly="!isRM"
                    :class="[
                        'w-full px-4 py-3 text-sm border rounded-xl outline-none transition-all shadow-sm',
                        isRM ? 'bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500' : 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-gray-700 cursor-not-allowed'
                    ]"
                  />
                </div>

                <div v-if="form.status === 'Completed'">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Actual Completion Date <span class="text-red-500">*</span></label>
                  <input 
                    v-model="form.actualCompletionDate"
                    type="date"
                    :max="new Date().toISOString().split('T')[0]"
                    class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>

                <div v-if="isRM">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action Owner</label>
                    <select 
                        v-model="form.actionOwnerId"
                        class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    >
                        <option value="">Select Action Owner</option>
                        <option v-for="user in users" :key="user.userId" :value="user.userId">{{ user.name }}</option>
                    </select>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="space-y-4">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Progress Updates & Comments</label>
              <textarea 
                v-model="form.progressComments"
                rows="3"
                class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Briefly explain the current progress or reason for status change..."
              ></textarea>

              <div v-if="showDowngradeJustification" class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                  <p class="text-xs text-amber-700 dark:text-amber-400 mb-2 font-bold uppercase tracking-wider flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Downgrade Justification Required
                  </p>
                  <textarea 
                    v-model="form.downgradeJustification"
                    rows="2"
                    required
                    class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Why is this being moved back from 'Completed'?"
                  ></textarea>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
            <button 
              type="button"
              @click="$router.push(`/risks/${risk.id}/sub-risks/${subRisk.subRiskId}`)"
              class="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="submitting"
              class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Updating...' : 'Save Progress' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRiskStore } from '@/stores/riskStore'
import { useAuthStore } from '@/stores/auth'
import userService from '@/api/users'
import type { Risk, SubRisk, User, MitigationStatus } from '@/types'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const riskStore = useRiskStore()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotifications()

const loading = ref(true)
const submitting = ref(false)
const users = ref<User[]>([])

const riskId = computed(() => route.params.id as string)
const subId = computed(() => route.params.subId as string)

const risk = computed<Risk | undefined>(() => riskStore.getRiskById(riskId.value))
const subRisk = computed(() => risk.value?.subRisks?.find(s => s.subRiskId === subId.value))

const isRM = computed(() => authStore.hasRole(['RiskManagement', 'Admin']))

const form = ref({
  mitigationMeasures: '',
  actionItem: '',
  actionOwnerId: '',
  status: 'Not Started' as MitigationStatus,
  targetDate: '',
  actualCompletionDate: '',
  progressPercentage: 0,
  progressComments: '',
  downgradeJustification: ''
})

const showDowngradeJustification = computed(() => {
    return subRisk.value?.status === 'Completed' && form.value.status !== 'Completed'
})

onMounted(async () => {
    loading.value = true
    await Promise.all([
        riskStore.fetchRiskById(riskId.value),
        fetchUsers()
    ])
    
    if (subRisk.value) {
        form.value = {
            mitigationMeasures: subRisk.value.mitigationMeasures || '',
            actionItem: subRisk.value.actionItem || '',
            actionOwnerId: subRisk.value.actionOwner?.userId || '',
            status: subRisk.value.status || 'Not Started',
            targetDate: subRisk.value.targetDate ? new Date(subRisk.value.targetDate).toISOString().split('T')[0] : '',
            actualCompletionDate: subRisk.value.actualCompletionDate ? new Date(subRisk.value.actualCompletionDate).toISOString().split('T')[0] : '',
            progressPercentage: subRisk.value.progressPercentage || 0,
            progressComments: subRisk.value.progressComments || '',
            downgradeJustification: ''
        }
    }
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

watch(() => form.value.status, (newStatus) => {
    if (newStatus === 'Completed') {
        form.value.progressPercentage = 100
        if (!form.value.actualCompletionDate) {
            form.value.actualCompletionDate = new Date().toISOString().split('T')[0]
        }
    } else if (newStatus === 'Not Started') {
        form.value.progressPercentage = 0
    }
})

async function handleSubmit() {
  if (!risk.value || !subRisk.value) return

  // Validation
  if (form.value.status === 'Completed') {
      if (!form.value.actualCompletionDate) {
          showError('Actual completion date is required for Completed status')
          return
      }
      const completionDate = new Date(form.value.actualCompletionDate)
      const now = new Date()
      if (completionDate > now) {
          showError('Completion date cannot be in the future')
          return
      }
  }

  if (showDowngradeJustification.value && !form.value.downgradeJustification.trim()) {
      showError('Justification is required when downgrading from Completed status')
      return
  }
  
  submitting.value = true
  try {
    const selectedUser = users.value.find(u => u.userId === form.value.actionOwnerId)
    
    const updatedDetails: Partial<SubRisk> = {
      status: form.value.status,
      targetDate: form.value.targetDate ? new Date(form.value.targetDate) : undefined,
      actualCompletionDate: form.value.actualCompletionDate ? new Date(form.value.actualCompletionDate) : undefined,
      progressPercentage: form.value.progressPercentage,
      progressComments: form.value.progressComments + (form.value.downgradeJustification ? `\n\nJustification for status change: ${form.value.downgradeJustification}` : '')
    }

    if (isRM.value) {
        updatedDetails.mitigationMeasures = form.value.mitigationMeasures
        updatedDetails.actionItem = form.value.actionItem
        updatedDetails.actionOwner = selectedUser ? { userId: selectedUser.userId, name: selectedUser.name } : undefined
    }

    const updatedSubRisks = risk.value.subRisks?.map(s => 
      s.subRiskId === subRisk.value!.subRiskId ? { ...s, ...updatedDetails } : s
    ) || []
    
    await riskStore.updateRisk(risk.value.id, { 
        subRisks: updatedSubRisks,
        audit: {
            ...risk.value.audit,
            updatedAt: new Date(),
            updatedBy: authStore.user?.name || 'Current User'
        }
    })
    
    showSuccess('Progress updated successfully')
    router.push(`/risks/${risk.value.id}/sub-risks/${subRisk.value.subRiskId}`)
  } catch (e: any) {
    showError(e.message || 'Failed to update sub-risk')
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom range slider styling */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin-top: -6px;
}

input[type=range]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>
