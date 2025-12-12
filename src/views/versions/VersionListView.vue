<template>
  <div class="space-y-6 fade-in p-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Version Management</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage quarterly risk assessment cycles</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!!activeVersion"
        :title="activeVersion ? 'Please lock existing active version first' : ''"
      >
      
       <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        Create New Version
      </button>
    </div>

    <!-- Active Version Warning -->
    <div v-if="activeVersion" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 class="font-medium text-blue-900 dark:text-blue-100">Active Version In Progress</h3>
        <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Currently <strong>{{ activeVersion.cycle }}</strong> is active. You must lock this version before creating a new one.
        </p>
      </div>
    </div>

    <!-- Versions Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
      
      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Cycle</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Period</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right">Completion</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="version in versions" :key="version._id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <td class="px-6 py-4">
              <span class="font-medium text-slate-900 dark:text-slate-100">{{ version.cycle }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
              {{ formatDate(version.startDate) }} - {{ formatDate(version.endDate) }}
            </td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="version.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'"
              >
                {{ version.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex flex-col items-end gap-1">
                <span class="text-xs text-slate-500 dark:text-slate-400">Rating: {{ Math.round(version.statistics?.ratingCompletionRate || 0) }}%</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">Mitigation: {{ Math.round(version.statistics?.mitigationCompletionRate || 0) }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  v-if="version.status === 'Active'"
                  @click="openLockDialog(version)"
                  class="px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors flex items-center gap-1"
                  title="Lock this version"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Lock
                </button>
                <button
                  @click="viewVersion(version)"
                  class="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="View version details"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="versions.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
              No versions found. Create your first cycle.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
          <h3 class="font-semibold text-lg text-slate-900 dark:text-slate-100">Create New Version</h3>
          <button @click="closeCreateModal" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleCreate" class="p-6 space-y-4">
          <!-- Active Version Error (Double check) -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex gap-2">
            <svg class="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Version Name <span class="text-red-500 dark:text-red-400">*</span></label>
            <input 
              v-model="form.cycle"
              type="text" 
              placeholder="YYYY Qn (e.g. 2025 Q3)"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              @input="calculateDates"
            />
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Format must be "YYYY Q1", "YYYY Q2", etc.</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
              <input 
                :value="formatDateDisplay(form.startDate)"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 pointer-events-none"
                readonly
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <input 
                :value="formatDateDisplay(form.endDate)"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 pointer-events-none"
                readonly
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Copy Risks From</label>
            <select 
              v-model="form.copyFromVersionId"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="">Do not copy (Fresh Start)</option>
              <option v-for="v in sortedVersions" :key="v._id" :value="v._id">
                {{ v.cycle }} ({{ v.status }})
              </option>
            </select>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a previous version to copy all unlocked risks and mitigations.
            </p>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeCreateModal"
              class="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
              :disabled="creating || !isValidFormat"
            >
              <span v-if="creating" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Create Version
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Lock Version Dialog -->
    <LockVersionDialog
      v-model="showLockDialog"
      :version="selectedVersionForLock"
      @locked="handleVersionLocked"
      @cancelled="showLockDialog = false"
      @view-risk="handleViewRisk"
      @view-question="handleViewQuestion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVersionStore } from '@/stores/version'
import { useNotifications } from '@/composables/useNotifications'
import LockVersionDialog from '@/components/versions/LockVersionDialog.vue'
import type { CreateVersionRequest } from '@/api/versions'
import type { Version } from '@/types'

const router = useRouter()
const versionStore = useVersionStore()
const { versions, activeVersion, loading } = storeToRefs(versionStore)
const { showSuccess } = useNotifications()

const showCreateModal = ref(false)
const creating = ref(false)
const error = ref('')
const showLockDialog = ref(false)
const selectedVersionForLock = ref<Version | null>(null)

const form = reactive<{
  cycle: string
  copyFromVersionId: string
  startDate: Date | null
  endDate: Date | null
}>({
  cycle: '',
  copyFromVersionId: '',
  startDate: null,
  endDate: null
})

const sortedVersions = computed(() => {
  return [...versions.value].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
})

const isValidFormat = computed(() => {
  return form.startDate !== null && form.endDate !== null
})

onMounted(() => {
  versionStore.fetchVersions()
})

const formatDate = (date: Date | string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatDateDisplay = (date: Date | null) => {
  if (!date) return '-'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const openCreateModal = () => {
  form.cycle = ''
  form.copyFromVersionId = ''
  form.startDate = null
  form.endDate = null
  error.value = ''
  
  // Pre-select the most recent version to copy from
  if (sortedVersions.value.length > 0) {
    form.copyFromVersionId = sortedVersions.value[0]._id
  }
  
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const calculateDates = () => {
  const regex = /^(\d{4})\s*Q([1-4])$/i
  const match = form.cycle.trim().match(regex)
  
  if (match) {
    const year = parseInt(match[1])
    const quarter = parseInt(match[2])
    
    const startMonth = (quarter - 1) * 3 // 0, 3, 6, 9
    const endMonth = startMonth + 2      // 2, 5, 8, 11
    
    const start = new Date(year, startMonth, 1)
    // Last day of end month
    const end = new Date(year, endMonth + 1, 0)
    
    form.startDate = start
    form.endDate = end
  } else {
    form.startDate = null
    form.endDate = null
  }
}

const handleCreate = async () => {
  if (!isValidFormat.value) return
  
  creating.value = true
  error.value = ''
  
  try {
    const payload: CreateVersionRequest = {
      cycle: form.cycle,
      copyFromVersionId: form.copyFromVersionId || undefined
    }
    
    await versionStore.createVersion(payload)
    showSuccess(`Version "${form.cycle}" created successfully`)
    closeCreateModal()
  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Failed to create version'
  } finally {
    creating.value = false
  }
}

const openLockDialog = (version: Version) => {
  selectedVersionForLock.value = version
  showLockDialog.value = true
}

const handleVersionLocked = (version: Version) => {
  showSuccess(`Version "${version.cycle}" has been locked successfully`)
  showLockDialog.value = false
  selectedVersionForLock.value = null
}

const viewVersion = (version: Version) => {
  // Navigate to version details or filter risks by version
  versionStore.selectVersion(version.cycle)
  router.push({ path: '/risks', query: { version: version.cycle } })
}

const handleViewRisk = (riskId: string) => {
  router.push(`/risks/${riskId}`)
  showLockDialog.value = false
}

const handleViewQuestion = (riskId: string, questionId: string) => {
  router.push(`/risks/${riskId}?question=${questionId}`)
  showLockDialog.value = false
}
</script>
