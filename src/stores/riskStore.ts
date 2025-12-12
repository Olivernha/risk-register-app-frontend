import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Risk, RiskStatus } from '@/types'
import riskService from '@/api/risks'

export const useRiskStore = defineStore('risk', () => {
  // State
  const risks = ref<Risk[]>([])
  const currentRisk = ref<Risk | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getRiskById = computed(() => {
    return (id: string) => risks.value.find(r => r.id === id)
  })

  // Actions
  async function fetchRisks() {
    loading.value = true
    error.value = null
    try {
      risks.value = await riskService.getRisks()
    } catch (e: any) {
      error.value = 'Failed to fetch risks'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchRiskById(id: string) {
    loading.value = true
    error.value = null
    try {
      const risk = await riskService.getRisk(id)
      currentRisk.value = risk
      // Update local cache if exists
      const index = risks.value.findIndex(r => r.id === id)
      if (index !== -1) {
        risks.value[index] = risk
      } else {
        risks.value.push(risk)
      }
      return risk
    } catch (e: any) {
      error.value = `Failed to fetch risk ${id}`
      console.error(e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    risks,
    currentRisk,
    loading,
    error,
    getRiskById,
    fetchRisks,
    fetchRiskById
  }
})
