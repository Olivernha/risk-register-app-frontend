import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import VersionService, { type CreateVersionRequest } from '@/api/versions'
import type { Version } from '@/types'

export const useVersionStore = defineStore('version', () => {
  // State
  const versions = ref<Version[]>([])
  const selectedVersion = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const activeVersion = computed(() => {
    return versions.value.find(v => v.status === 'Active')
  })

  const currentVersion = computed(() => {
    if (selectedVersion.value) {
      return versions.value.find(v => v.cycle === selectedVersion.value)
    }
    return activeVersion.value
  })

  // Actions
  async function fetchVersions() {
    loading.value = true
    try {
      const data = await VersionService.getVersions()
      versions.value = data
      
      // Set selected version to active if not set
      if (!selectedVersion.value && activeVersion.value) {
        selectedVersion.value = activeVersion.value.cycle
      }
    } catch (error) {
      console.error('Failed to fetch versions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function selectVersion(cycle: string) {
    selectedVersion.value = cycle
  }

  async function createVersion(data: CreateVersionRequest) {
    loading.value = true
    try {
      // Logic to ensure previous version is locked could be here or backend
      // check if there is an active version
      if (activeVersion.value) {
         throw new Error('There is already an active version. Please lock it first.')
      }

      const response = await VersionService.createVersion(data)
      await fetchVersions() // Refresh list
      return response
    } catch (error) {
      console.error('Failed to create version:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Lock a version to finalize quarterly cycle
   */
  async function lockVersion(id: string, force?: boolean) {
    loading.value = true
    try {
      const response = await VersionService.lockVersion(id, { force })
      await fetchVersions() // Refresh list
      return response
    } catch (error) {
      console.error('Failed to lock version:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    versions,
    selectedVersion,
    loading,
    activeVersion,
    currentVersion,
    fetchVersions,
    selectVersion,
    createVersion,
    lockVersion,
  }
})
