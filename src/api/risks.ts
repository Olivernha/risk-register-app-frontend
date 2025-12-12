import api from '@/plugins/axios'
import type { Risk, RiskStatus, RiskCategory, TimeHorizon } from '@/types'

export interface CreateRiskRequest {
  refNo: string
  title: string
  description: string
  timeHorizon: TimeHorizon
  category: RiskCategory
  financialImpact: {
    hasImpact: boolean
    amount?: number
  }
  owners: string[] // User IDs
  version: string
}

export interface UpdateRiskRequest {
  title?: string
  description?: string
  timeHorizon?: TimeHorizon
  category?: RiskCategory
  financialImpact?: {
    hasImpact: boolean
    amount?: number
  }
  owners?: string[]
}

export interface RiskFilters {
  version?: string
  status?: RiskStatus
  category?: RiskCategory
  search?: string
}

class RiskService {
  /**
   * Get list of risks with optional filters
   */
  async getRisks(filters?: RiskFilters) {
    const response = await api.get<Risk[]>('/risks', {
      params: filters,
    })
    return response.data
  }

  /**
   * Get a single risk by ID
   */
  async getRisk(id: string) {
    const response = await api.get<Risk>(`/risks/${id}`)
    return response.data
  }

  /**
   * Create a new risk
   */
  async createRisk(data: CreateRiskRequest) {
    const response = await api.post<Risk>('/risks', data)
    return response.data
  }

  /**
   * Update an existing risk
   */
  async updateRisk(id: string, data: UpdateRiskRequest) {
    const response = await api.patch<Risk>(`/risks/${id}`, data)
    return response.data
  }

  /**
   * Delete a risk (only if Draft and no ratings)
   */
  async deleteRisk(id: string) {
    const response = await api.delete(`/risks/${id}`)
    return response.data
  }

  /**
   * Get next reference number for a version
   */
  async getNextRefNo(version: string) {
    const response = await api.get<{ nextRefNo: string }>(`/risks/next-ref-no`, {
      params: { version },
    })
    return response.data.nextRefNo
  }
}

export default new RiskService()

