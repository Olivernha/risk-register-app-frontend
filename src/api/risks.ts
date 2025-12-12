import api from '@/plugins/axios'
import type { Risk, RiskStatus } from '@/types'

export interface CreateRiskRequest {
  refNo: string
  title: string
  description: string
  timeHorizon: string
  category: string
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
  timeHorizon?: string
  category?: string
  financialImpact?: {
    hasImpact: boolean
    amount?: number
  }
  owners?: string[]
}

export interface RiskFilters {
  version?: string
  status?: RiskStatus
  category?: string
  department?: string
  riskLevel?: string
  search?: string
  page?: number
  limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
}

class RiskService {
  /**
   * Get list of risks with optional filters
   */
  async getRisks(filters?: RiskFilters) {
    const response = await api.get<Risk[]>('/risks', {
      params: filters,
    })
    
    // json-server returns array directly, not nested in data
    return {
      data: response.data,
      total: response.data.length,
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    }
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
  async deleteRisk(id: string, reason: string) {
    const response = await api.delete(`/risks/${id}`, {
      data: { reason },
    })
    return response.data
  }

  /**
   * Publish a risk to make it available for rating
   */
  async publishRisk(id: string) {
    const response = await api.post<Risk>(`/risks/${id}/publish`)
    return response.data
  }

  /**
   * Lock a risk to finalize quarterly cycle
   */
  async lockRisk(id: string, force?: boolean) {
    const response = await api.post<Risk>(`/risks/${id}/lock`, { force })
    return response.data
  }

  /**
   * Unlock a risk (requires admin approval)
   */
  async unlockRisk(id: string, reason: string) {
    const response = await api.post<Risk>(`/risks/${id}/unlock`, { reason })
    return response.data
  }

  /**
   * Get risks assigned to current user
   */
  async getMyRisks() {
    const response = await api.get<Risk[]>('/risks/my-risks')
    return response.data
  }

  /**
   * Get risks by department
   */
  async getRisksByDepartment(department: string) {
    const response = await api.get<Risk[]>(`/risks/department/${department}`)
    return response.data
  }
}

export default new RiskService()
