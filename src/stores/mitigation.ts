import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import mitigationService from '@/api/mitigations'
import type { Mitigation } from '@/types'
import { useNotifications } from '@/composables/useNotifications'
import { isMitigationOverdue } from '@/utils/riskCalculations'

export const useMitigationStore = defineStore('mitigation', () => {
  const { showSuccess, showError } = useNotifications()

  // State
  const myMitigations = ref<Array<{ mitigation: Mitigation; risk: any }>>([])
  const loading = ref(false)

  // Getters
  const mitigationCount = computed(() => myMitigations.value.length)
  const overdueMitigations = computed(() =>
    myMitigations.value.filter((m) => isMitigationOverdue(m.mitigation))
  )
  const overdueCount = computed(() => overdueMitigations.value.length)
  const ongoingMitigations = computed(() =>
    myMitigations.value.filter((m) => m.mitigation.status === 'Ongoing')
  )
  const completedMitigations = computed(() =>
    myMitigations.value.filter((m) => m.mitigation.status === 'Completed')
  )

  // Actions
  async function fetchMyMitigations() {
    loading.value = true
    try {
      const mitigations = await mitigationService.getMyMitigations()
      myMitigations.value = mitigations
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch your mitigations')
      console.error('Failed to fetch my mitigations:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchOverdueMitigations() {
    loading.value = true
    try {
      const mitigations = await mitigationService.getOverdueMitigations()
      return mitigations
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch overdue mitigations')
      console.error('Failed to fetch overdue mitigations:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createMitigation(riskId: string, data: any) {
    loading.value = true
    try {
      const mitigation = await mitigationService.createMitigation(riskId, data)
      showSuccess('Mitigation created successfully')
      return mitigation
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create mitigation')
      console.error('Failed to create mitigation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateMitigation(riskId: string, mitigationId: string, data: any) {
    loading.value = true
    try {
      const mitigation = await mitigationService.updateMitigation(riskId, mitigationId, data)
      showSuccess('Mitigation updated successfully')
      return mitigation
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update mitigation')
      console.error('Failed to update mitigation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateMitigationStatus(riskId: string, mitigationId: string, data: any) {
    loading.value = true
    try {
      const mitigation = await mitigationService.updateMitigationStatus(riskId, mitigationId, data)
      
      // Update in my mitigations list
      const index = myMitigations.value.findIndex((m) => m.mitigation.controlId === mitigationId)
      if (index !== -1) {
        myMitigations.value[index].mitigation = mitigation
      }

      showSuccess('Mitigation status updated successfully')
      return mitigation
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update mitigation status')
      console.error('Failed to update mitigation status:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteMitigation(riskId: string, mitigationId: string) {
    loading.value = true
    try {
      await mitigationService.deleteMitigation(riskId, mitigationId)
      
      // Remove from my mitigations
      myMitigations.value = myMitigations.value.filter(
        (m) => m.mitigation.controlId !== mitigationId
      )

      showSuccess('Mitigation deleted successfully')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to delete mitigation')
      console.error('Failed to delete mitigation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    myMitigations,
    loading,

    // Getters
    mitigationCount,
    overdueMitigations,
    overdueCount,
    ongoingMitigations,
    completedMitigations,

    // Actions
    fetchMyMitigations,
    fetchOverdueMitigations,
    createMitigation,
    updateMitigation,
    updateMitigationStatus,
    deleteMitigation,
  }
})
