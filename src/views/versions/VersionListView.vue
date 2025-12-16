<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Version Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage quarterly risk assessment cycles</p>
      </div>
      <button
        v-if="authStore.hasRole(['RiskManagement', 'Admin'])"
        @click="showCreateDialog = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create New Version
      </button>
    </div>

    <!-- Active Version Card -->
    <div v-if="activeVersion" class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ activeVersion.cycle }}</h2>
            <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              Active
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(activeVersion.startDate) }}</span>
            </div>
            <div>
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(activeVersion.endDate) }}</span>
            </div>
            <div>
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Total Risks</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ activeVersion.statistics?.totalRisks || 0 }}</span>
            </div>
            <div>
              <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Rating Completion</span>
              <span class="text-sm text-gray-900 dark:text-gray-100">{{ activeVersion.statistics?.ratingCompletionRate || 0 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Versions List -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">All Versions</h3>
      </div>
      
      <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading versions...
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Risks</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="version in sortedVersions" :key="version.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ version.cycle }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  version.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                ]">
                  {{ version.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(version.startDate) }} - {{ formatDate(version.endDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ version.statistics?.totalRisks || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ version.createdBy }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="viewVersion(version.id)"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
            <tr v-if="versions.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No versions found. Create your first quarterly cycle.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Version Dialog -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeCreateDialog">
      <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Version</h3>
        
        <form @submit.prevent="handleCreateVersion" class="space-y-4">
          <!-- Version Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Version Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newVersion.cycle"
              type="text"
              placeholder="e.g., 2025 Q3"
              pattern="\d{4} Q[1-4]"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Format: YYYY Qn (e.g., 2025 Q3)</p>
          </div>

          <!-- Copy From Version -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Copy From Previous Version (Optional)
            </label>
            <select
              v-model="newVersion.copyFromVersionId"
              class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option :value="null">Start fresh (no copy)</option>
              <option v-for="version in lockedVersions" :key="version.id" :value="version.id">
                {{ version.cycle }} ({{ version.statistics?.totalRisks || 0 }} risks)
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Copy risks from a previous locked version</p>
          </div>

          <!-- Warning Messages -->
          <div v-if="validationError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
          </div>

          <div v-if="activeVersion" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Warning: There is already an active version ({{ activeVersion.cycle }}). It should be locked before creating a new version.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeCreateDialog"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ creating ? 'Creating...' : 'Create Version' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useVersionStore } from '@/stores/version'
import { useConfirmStore } from '@/stores/confirm'
import versionService from '@/api/versions'
import riskService from '@/api/risks'
import type { Version, RiskStatus } from '@/types'

const authStore = useAuthStore()
const versionStore = useVersionStore()
const confirmStore = useConfirmStore()

const { versions, loading, activeVersion } = versionStore
const showCreateDialog = ref(false)
const creating = ref(false)
const validationError = ref('')

const newVersion = ref({
  cycle: '',
  copyFromVersionId: null as string | null
})

onMounted(async () => {
  await versionStore.fetchVersions()
})

const sortedVersions = computed(() => {
  return [...versions].sort((a: Version, b: Version) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const lockedVersions = computed(() => {
  return versions.filter((v: Version) => v.status === 'Locked')
})

function closeCreateDialog() {
  showCreateDialog.value = false
  validationError.value = ''
  newVersion.value = {
    cycle: '',
    copyFromVersionId: null
  }
}

async function handleCreateVersion() {
  validationError.value = ''
  
  // Validation: Check for duplicate version name
  const duplicate = versions.find((v: Version) => v.cycle === newVersion.value.cycle)
  if (duplicate) {
    validationError.value = 'A version with this name already exists.'
    return
  }

  // Validation: Check for active version
  // Validation: Check for active version
  if (activeVersion) {
    const confirmed = await confirmStore.ask({
        title: 'Create New Version',
        message: `Warning: Version "${activeVersion.cycle}" is still active. Creating a new version will make it the active one. Continue?`,
        type: 'warning'
    })
    if (!confirmed) return
  }

  creating.value = true

  try {
    // Parse quarter from cycle name
    const match = newVersion.value.cycle.match(/(\d{4}) Q([1-4])/)
    if (!match) {
      validationError.value = 'Invalid version format. Use YYYY Qn (e.g., 2025 Q3)'
      creating.value = false
      return
    }

    // Create version via API
    const createdVersion = await versionService.createVersion({
      cycle: newVersion.value.cycle,
      copyFromVersionId: newVersion.value.copyFromVersionId || undefined
    })

    // If copying from previous version, copy risks
    if (newVersion.value.copyFromVersionId) {
      await copyRisksFromVersion(newVersion.value.copyFromVersionId, createdVersion.id)
    }

    // Refresh versions list
    await versionStore.fetchVersions()

    confirmStore.alert('Success', `Version "${newVersion.value.cycle}" created successfully!`)
    closeCreateDialog()
  } catch (e: any) {
    validationError.value = e.message || 'Failed to create version'
  } finally {
    creating.value = false
  }
}

async function copyRisksFromVersion(sourceVersionId: string, targetVersionId: string) {
  try {
    // Get all risks from source version
    const sourceRisks = await riskService.getRisks({ version: sourceVersionId })
    
    // Filter only non-locked risks
    const risksToCopy = sourceRisks.filter((r: any) => r.status !== 'Locked')

    // Copy each risk
    for (const risk of risksToCopy) {
      const newRisk = {
        ...risk,
        id: undefined, // Let backend generate new ID
        version: targetVersionId,
        status: 'Draft' as RiskStatus,
        owners: risk.owners.map((o: any) => o.userId), // Map owners to IDs
        ratings: [], // Clear ratings for new cycle
        questions: [], // Fresh start for questions
        mitigations: risk.mitigations.map((m: any) => ({
          ...m,
          // Carry over completed mitigations, reset others
          status: m.status === 'Completed' ? 'Completed' : 'Not Started',
          progressPercentage: m.status === 'Completed' ? 100 : 0
        })),
        audit: {
          createdBy: authStore.user?.name || 'System',
          createdAt: new Date().toISOString(),
          updatedBy: authStore.user?.name || 'System',
          updatedAt: new Date().toISOString()
        }
      }

      await riskService.createRisk(newRisk)
    }

    console.log(`Copied ${risksToCopy.length} risks to new version`)
  } catch (e) {
    console.error('Error copying risks:', e)
    throw new Error('Failed to copy risks from previous version')
  }
}

function viewVersion(versionId: string) {
  // Navigate to version details (to be implemented)
  console.log('View version:', versionId)
}

function formatDate(date?: Date | string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}
</script>
