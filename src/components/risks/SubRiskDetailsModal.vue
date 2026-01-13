<template>
  <Modal :is-open="isOpen" title="Manage Sub-risk Details" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        <div>
          <label class="block mb-1">Sub-risk Ref</label>
          <div class="px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
            {{ subRisk.refNo }}
          </div>
        </div>
        <div>
          <label class="block mb-1">Title</label>
          <div class="px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
            {{ subRisk.title }}
          </div>
        </div>
      </div>

      <div v-if="isRM">
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Mitigation Measures</label>
        <textarea 
          v-model="form.mitigationMeasures"
          rows="3"
          class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Describe the mitigation measures for this sub-risk"
        ></textarea>
      </div>
      <div v-else-if="subRisk.mitigationMeasures" class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          <span class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Mitigation Measures</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ subRisk.mitigationMeasures }}</p>
      </div>

      <div v-if="isRM">
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Action Item</label>
        <textarea 
          v-model="form.actionItem"
          rows="3"
          class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Specific action item to be taken"
        ></textarea>
      </div>
      <div v-else-if="subRisk.actionItem" class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          <span class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Action Item</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ subRisk.actionItem }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="isRM">
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Action Owner</label>
          <select 
            v-model="form.actionOwnerId"
            class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="">Select Action Owner</option>
            <option v-for="user in users" :key="user.userId" :value="user.userId">{{ user.name }}</option>
          </select>
        </div>
        <div v-else>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Action Owner</label>
            <div class="px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                {{ subRisk.actionOwner?.name || 'Unassigned' }}
            </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Target Date</label>
          <input 
            v-model="form.targetDate"
            type="date"
            class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</label>
          <select 
            v-model="form.status"
            class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="Not Started">Not Started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
           <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Progress (%)</label>
           <input 
             v-model.number="form.progressPercentage"
             type="number"
             min="0"
             max="100"
             class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
           />
        </div>
      </div>

      <div v-if="form.status === 'Completed'">
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Actual Completion Date</label>
        <input 
          v-model="form.actualCompletionDate"
          type="date"
          :max="new Date().toISOString().split('T')[0]"
          class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Progress Comments</label>
        <textarea 
          v-model="form.progressComments"
          rows="2"
          class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Add comments about the current progress..."
        ></textarea>
      </div>

      <div v-if="showDowngradeJustification" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
          <p class="text-xs text-amber-700 dark:text-amber-400 mb-2 font-medium">Downgrading from 'Completed' requires justification.</p>
          <textarea 
            v-model="form.downgradeJustification"
            rows="2"
            class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Why is this being moved back from completed?"
          ></textarea>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
        >
          Save Details
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import type { SubRisk, User, MitigationStatus } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  subRisk: SubRisk
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', value: Partial<SubRisk>): void
}>()

const authStore = useAuthStore()
const { showError } = useNotifications()

const isRM = computed(() => authStore.hasRole(['RiskManagement', 'Admin']))

const form = ref({
  mitigationMeasures: props.subRisk.mitigationMeasures || '',
  actionItem: props.subRisk.actionItem || '',
  actionOwnerId: props.subRisk.actionOwner?.userId || '',
  status: props.subRisk.status || 'Not Started',
  targetDate: props.subRisk.targetDate ? new Date(props.subRisk.targetDate).toISOString().split('T')[0] : '',
  actualCompletionDate: props.subRisk.actualCompletionDate ? new Date(props.subRisk.actualCompletionDate).toISOString().split('T')[0] : '',
  progressPercentage: props.subRisk.progressPercentage || 0,
  progressComments: props.subRisk.progressComments || '',
  downgradeJustification: ''
})

const showDowngradeJustification = computed(() => {
    return props.subRisk.status === 'Completed' && form.value.status !== 'Completed'
})

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

watch(() => props.subRisk, (newSub) => {
  form.value = {
    mitigationMeasures: newSub.mitigationMeasures || '',
    actionItem: newSub.actionItem || '',
    actionOwnerId: newSub.actionOwner?.userId || '',
    status: newSub.status || 'Not Started',
    targetDate: newSub.targetDate ? new Date(newSub.targetDate).toISOString().split('T')[0] : '',
    actualCompletionDate: newSub.actualCompletionDate ? new Date(newSub.actualCompletionDate).toISOString().split('T')[0] : '',
    progressPercentage: newSub.progressPercentage || 0,
    progressComments: newSub.progressComments || '',
    downgradeJustification: ''
  }
}, { deep: true })

const handleSubmit = () => {
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

  const selectedUser = props.users.find(u => u.userId === form.value.actionOwnerId)
  
  const updatedDetails: Partial<SubRisk> = {
    status: form.value.status as MitigationStatus,
    targetDate: form.value.targetDate ? new Date(form.value.targetDate) : undefined,
    actualCompletionDate: form.value.actualCompletionDate ? new Date(form.value.actualCompletionDate) : undefined,
    progressPercentage: form.value.progressPercentage,
    progressComments: form.value.progressComments + (form.value.downgradeJustification ? `\n\nJustification for status change: ${form.value.downgradeJustification}` : '')
  }

  // RM exclusive fields
  if (isRM.value) {
      updatedDetails.mitigationMeasures = form.value.mitigationMeasures
      updatedDetails.actionItem = form.value.actionItem
      updatedDetails.actionOwner = selectedUser ? { userId: selectedUser.userId, name: selectedUser.name } : undefined
  }

  emit('submit', updatedDetails)
}
</script>
