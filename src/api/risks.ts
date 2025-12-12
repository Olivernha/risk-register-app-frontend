import api from '@/plugins/axios'
import type { Risk, RiskStatus, RiskCategory, TimeHorizon, RiskOwner, Rating, AverageRating, AuditInfo } from '@/types'

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
  status?: RiskStatus
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
  owners?: string[] | RiskOwner[]
  ratings?: Rating[]
  averageRating?: AverageRating
  audit?: AuditInfo
  status?: RiskStatus
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
    // json-server returns array directly
    let risks = Array.isArray(response.data) ? response.data : []
    
    // Apply filters manually if needed (json-server handles basic filtering via query params)
    if (filters?.version) {
      risks = risks.filter(r => r.version === filters.version)
    }
    if (filters?.status) {
      risks = risks.filter(r => r.status === filters.status)
    }
    if (filters?.category) {
      risks = risks.filter(r => r.category === filters.category)
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      risks = risks.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.refNo.toLowerCase().includes(searchLower)
      )
    }
    
    return risks
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
    try {
      // Try to get existing risks for the version
      const risks = await this.getRisks({ version })
      const refNumbers = risks
        .map(r => r.refNo)
        .filter(ref => /^R\d+$/.test(ref))
        .map(ref => parseInt(ref.replace('R', '')))
        .filter(num => !isNaN(num))
      
      const nextNum = refNumbers.length > 0 ? Math.max(...refNumbers) + 1 : 1
      return `R${nextNum}`
    } catch (error) {
      // Fallback if API call fails
      console.warn('Could not fetch existing risks, using default R1')
      return 'R1'
    }
  }
}

export default new RiskService()

