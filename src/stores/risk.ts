import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import riskService from '@/api/risks'
import type { Risk, RiskFilters } from '@/api/risks'
import { useNotifications } from '@/composables/useNotifications'

export const useRiskStore = defineStore('risk', () => {
  const { showSuccess, showError } = useNotifications()

  // State
  const risks = ref<Risk[]>([])
  const currentRisk = ref<Risk | null>(null)
  const loading = ref(false)
  const filters = ref<RiskFilters>({})
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
  })

  // Getters
  const riskCount = computed(() => risks.value.length)
  const hasRisks = computed(() => risks.value.length > 0)

  // Actions
  async function fetchRisks(newFilters?: RiskFilters) {
    loading.value = true
    try {
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters }
      }

      const response = await riskService.getRisks({
        ...filters.value,
        page: pagination.value.page,
        limit: pagination.value.limit,
      })

      risks.value = response.data
      pagination.value.total = response.total
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch risks')
      console.error('Failed to fetch risks:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchRisk(id: string) {
    loading.value = true
    try {
      const risk = await riskService.getRisk(id)
      currentRisk.value = risk
      return risk
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch risk')
      console.error('Failed to fetch risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createRisk(data: any) {
    loading.value = true
    try {
      const risk = await riskService.createRisk(data)
      risks.value.unshift(risk)
      showSuccess('Risk created successfully')
      return risk
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create risk')
      console.error('Failed to create risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateRisk(id: string, data: any) {
    loading.value = true
    try {
      const risk = await riskService.updateRisk(id, data)
      
      // Update in list
      const index = risks.value.findIndex((r) => r._id === id)
      if (index !== -1) {
        risks.value[index] = risk
      }
      
      // Update current risk if it's the same
      if (currentRisk.value?._id === id) {
        currentRisk.value = risk
      }

      showSuccess('Risk updated successfully')
      return risk
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update risk')
      console.error('Failed to update risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteRisk(id: string, reason: string) {
    loading.value = true
    try {
      await riskService.deleteRisk(id, reason)
      
      // Remove from list
      risks.value = risks.value.filter((r) => r._id !== id)
      
      // Clear current risk if it's the same
      if (currentRisk.value?._id === id) {
        currentRisk.value = null
      }

      showSuccess('Risk deleted successfully')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to delete risk')
      console.error('Failed to delete risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function publishRisk(id: string) {
    loading.value = true
    try {
      const risk = await riskService.publishRisk(id)
      
      // Update in list
      const index = risks.value.findIndex((r) => r._id === id)
      if (index !== -1) {
        risks.value[index] = risk
      }
      
      // Update current risk
      if (currentRisk.value?._id === id) {
        currentRisk.value = risk
      }

      showSuccess('Risk published successfully')
      return risk
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to publish risk')
      console.error('Failed to publish risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function lockRisk(id: string, force?: boolean) {
    loading.value = true
    try {
      const risk = await riskService.lockRisk(id, force)
      
      // Update in list
      const index = risks.value.findIndex((r) => r._id === id)
      if (index !== -1) {
        risks.value[index] = risk
      }
      
      // Update current risk
      if (currentRisk.value?._id === id) {
        currentRisk.value = risk
      }

      showSuccess('Risk locked successfully')
      return risk
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to lock risk')
      console.error('Failed to lock risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function unlockRisk(id: string, reason: string) {
    loading.value = true
    try {
      const risk = await riskService.unlockRisk(id, reason)
      
      // Update in list
      const index = risks.value.findIndex((r) => r._id === id)
      if (index !== -1) {
        risks.value[index] = risk
      }
      
      // Update current risk
      if (currentRisk.value?._id === id) {
        currentRisk.value = risk
      }

      showSuccess('Risk unlocked successfully')
      return risk
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to unlock risk')
      console.error('Failed to unlock risk:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMyRisks() {
    loading.value = true
    try {
      const myRisks = await riskService.getMyRisks()
      risks.value = myRisks
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch your risks')
      console.error('Failed to fetch my risks:', error)
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: RiskFilters) {
    filters.value = newFilters
    pagination.value.page = 1
  }

  function setPage(page: number) {
    pagination.value.page = page
  }

  function clearCurrentRisk() {
    currentRisk.value = null
  }

  return {
    // State
    risks,
    currentRisk,
    loading,
    filters,
    pagination,

    // Getters
    riskCount,
    hasRisks,

    // Actions
    fetchRisks,
    fetchRisk,
    createRisk,
    updateRisk,
    deleteRisk,
    publishRisk,
    lockRisk,
    unlockRisk,
    fetchMyRisks,
    setFilters,
    setPage,
    clearCurrentRisk,
  }
})
