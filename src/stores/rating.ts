import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ratingService from '@/api/ratings'
import type { Rating } from '@/types'
import { useNotifications } from '@/composables/useNotifications'

export const useRatingStore = defineStore('rating', () => {
  const { showSuccess, showError } = useNotifications()

  // State
  const pendingRatings = ref<Array<{ risk: any; hasSubmitted: boolean }>>([])
  const currentRatings = ref<Rating[]>([])
  const loading = ref(false)

  // Getters
  const pendingCount = computed(() => pendingRatings.value.filter((r) => !r.hasSubmitted).length)
  const hasPendingRatings = computed(() => pendingCount.value > 0)

  // Actions
  async function fetchPendingRatings() {
    loading.value = true
    try {
      const ratings = await ratingService.getPendingRatings()
      pendingRatings.value = ratings
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch pending ratings')
      console.error('Failed to fetch pending ratings:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchRiskRatings(riskId: string) {
    loading.value = true
    try {
      const ratings = await ratingService.getRiskRatings(riskId)
      currentRatings.value = ratings
      return ratings
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch ratings')
      console.error('Failed to fetch risk ratings:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function submitRating(riskId: string, data: any) {
    loading.value = true
    try {
      const rating = await ratingService.submitRating(riskId, data)
      
      // Update pending ratings
      const index = pendingRatings.value.findIndex((r) => r.risk._id === riskId)
      if (index !== -1) {
        pendingRatings.value[index].hasSubmitted = true
      }

      showSuccess('Rating submitted successfully')
      return rating
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to submit rating')
      console.error('Failed to submit rating:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateRating(riskId: string, data: any) {
    loading.value = true
    try {
      const rating = await ratingService.updateRating(riskId, data)
      showSuccess('Rating updated successfully')
      return rating
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update rating')
      console.error('Failed to update rating:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchRatingHistory(riskId: string, ownerId: string) {
    loading.value = true
    try {
      const history = await ratingService.getRatingHistory(riskId, ownerId)
      return history
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch rating history')
      console.error('Failed to fetch rating history:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    pendingRatings,
    currentRatings,
    loading,

    // Getters
    pendingCount,
    hasPendingRatings,

    // Actions
    fetchPendingRatings,
    fetchRiskRatings,
    submitRating,
    updateRating,
    fetchRatingHistory,
  }
})
