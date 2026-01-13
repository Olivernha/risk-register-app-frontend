<template>
  <div class="space-y-6 fade-in p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <button
          @click="$router.push(`/risks/${riskId}`)"
          class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Parent Risk
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Sub-risk</h1>
        <p v-if="risk" class="text-sm text-gray-500 mt-1">For Risk: <span class="font-semibold text-blue-600">{{ risk.refNo }} - {{ risk.title }}</span></p>
      </div>
    </div>

    <!-- Main Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
        
        <!-- Section: Basic Information -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sub-risk Ref No</label>
              <div class="px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-mono font-bold">
                {{ generatedRefNo }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title *</label>
              <input 
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Brief title for this sub-risk"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description *</label>
            <textarea 
              v-model="form.description"
              required
              rows="4"
              class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              placeholder="Detailed description of the specific sub-risk or potential event"
            ></textarea>
          </div>
        </div>

        <div class="h-px bg-gray-100 dark:bg-gray-700 my-8"></div>

        <!-- Section: Initial Implementation Strategy (Optional during creation) -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Initial Implementation Strategy
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mitigation Measures</label>
              <textarea 
                v-model="form.mitigationMeasures"
                rows="3"
                class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="High-level mitigation strategy"
              ></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specific Action Item</label>
              <textarea 
                v-model="form.actionItem"
                rows="3"
                class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Immediate action to be taken"
              ></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action Owner</label>
              <select 
                v-model="form.actionOwnerId"
                class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              >
                <option value="">Select Action Owner</option>
                <option v-for="user in users" :key="user.userId" :value="user.userId">
                  {{ user.name }} ({{ user.department }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Completion Date</label>
              <input 
                v-model="form.targetDate"
                type="date"
                class="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="button"
            @click="$router.push(`/risks/${riskId}`)"
            class="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="submitting || !risk"
            class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Creating...' : 'Create Sub-risk' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRiskStore } from '@/stores/riskStore'
import userService from '@/api/users'
import type { Risk, SubRisk, User } from '@/types'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const riskStore = useRiskStore()
const { showSuccess, showError } = useNotifications()

const riskId = computed(() => route.params.id as string)
const risk = computed<Risk | undefined>(() => riskStore.getRiskById(riskId.value))
const users = ref<User[]>([])
const submitting = ref(false)

const form = ref({
  title: '',
  description: '',
  mitigationMeasures: '',
  actionItem: '',
  actionOwnerId: '',
  targetDate: ''
})

const generatedRefNo = computed(() => {
  if (!risk.value) return '---'
  const parentRef = risk.value.refNo
  const nextNumber = (risk.value.subRisks?.length || 0) + 1
  return `${parentRef}.${nextNumber}`
})

onMounted(async () => {
  if (!risk.value) {
    await riskStore.fetchRiskById(riskId.value)
  }
  fetchUsers()
})

async function fetchUsers() {
  try {
    const data = await userService.getUsers()
    users.value = data
  } catch (e) {
    console.error('Failed to fetch users', e)
  }
}

async function handleSubmit() {
  if (!risk.value) return
  
  submitting.value = true
  try {
    const selectedUser = users.value.find(u => u.userId === form.value.actionOwnerId)
    
    const newSubRisk: SubRisk = {
      subRiskId: `SR${Date.now()}`,
      refNo: generatedRefNo.value,
      title: form.value.title,
      description: form.value.description,
      mitigationMeasures: form.value.mitigationMeasures || undefined,
      actionItem: form.value.actionItem || undefined,
      actionOwner: selectedUser ? { userId: selectedUser.userId, name: selectedUser.name } : undefined,
      status: 'Not Started',
      targetDate: form.value.targetDate ? new Date(form.value.targetDate) : undefined,
      progressPercentage: 0,
      progressComments: ''
    }

    const updatedSubRisks = [...(risk.value.subRisks || []), newSubRisk]
    
    await riskStore.updateRisk(risk.value.id, { 
      subRisks: updatedSubRisks,
      audit: {
          ...risk.value.audit,
          updatedAt: new Date(),
          updatedBy: 'Current User'
      }
    })
    
    showSuccess('Sub-risk created successfully')
    router.push(`/risks/${risk.value.id}`)
  } catch (e: any) {
    showError(e.message || 'Failed to create sub-risk')
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
