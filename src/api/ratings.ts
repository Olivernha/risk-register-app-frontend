import api from '@/plugins/axios'
import type { Rating, RatingHistory } from '@/types'

export interface SubmitRatingRequest {
  currentLikelihood: number
  currentImpact: number
  basisForRating: string
  residualLikelihood?: number
  residualImpact?: number
}

export interface UpdateRatingRequest {
  currentLikelihood?: number
  currentImpact?: number
  basisForRating?: string
  residualLikelihood?: number
  residualImpact?: number
  reason: string // Required for updates
}

class RatingService {
  /**
   * Submit or update a rating for a risk
   */
  async submitRating(riskId: string, data: SubmitRatingRequest) {
    const response = await api.post<Rating>(`/risks/${riskId}/ratings`, data)
    return response.data
  }

  /**
   * Update an existing rating
   */
  async updateRating(riskId: string, data: UpdateRatingRequest) {
    const response = await api.patch<Rating>(`/risks/${riskId}/ratings`, data)
    return response.data
  }

  /**
   * Get rating history for a specific owner
   */
  async getRatingHistory(riskId: string, ownerId: string) {
    const response = await api.get<RatingHistory[]>(`/risks/${riskId}/ratings/${ownerId}/history`)
    return response.data
  }

  /**
   * Get all ratings for a risk
   */
  async getRiskRatings(riskId: string) {
    const response = await api.get<Rating[]>(`/risks/${riskId}/ratings`)
    return response.data
  }

  /**
   * Get pending ratings for current user
   */
  async getPendingRatings() {
    const response = await api.get<Array<{ risk: any; hasSubmitted: boolean }>>('/ratings/pending')
    return response.data
  }
}

export default new RatingService()
