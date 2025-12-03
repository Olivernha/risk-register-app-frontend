import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'
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
      const response = await api.get<Version[]>('/versions')
      versions.value = response.data
      
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

  return {
    versions,
    selectedVersion,
    loading,
    activeVersion,
    currentVersion,
    fetchVersions,
    selectVersion,
  }
})
