import api from '@/plugins/axios'
import type { Mitigation, MitigationStatus } from '@/types'

export interface CreateMitigationRequest {
  title: string
  details: string
  controlOwnerId: string
  actionOwnerId: string
  targetDate: string
  status?: MitigationStatus
}

export interface UpdateMitigationRequest {
  title?: string
  details?: string
  controlOwnerId?: string
  actionOwnerId?: string
  status?: MitigationStatus
  targetDate?: string
  actualCompletionDate?: string
  progressPercentage?: number
}

export interface UpdateMitigationStatusRequest {
  status: MitigationStatus
  progressPercentage?: number
  targetDate?: string
  actualCompletionDate?: string
  comment?: string
}

class MitigationService {
  /**
   * Create a new mitigation measure for a risk
   */
  async createMitigation(riskId: string, data: CreateMitigationRequest) {
    const response = await api.post<Mitigation>(`/risks/${riskId}/mitigations`, data)
    return response.data
  }

  /**
   * Update a mitigation measure (RM only)
   */
  async updateMitigation(riskId: string, mitigationId: string, data: UpdateMitigationRequest) {
    const response = await api.patch<Mitigation>(`/risks/${riskId}/mitigations/${mitigationId}`, data)
    return response.data
  }

  /**
   * Update mitigation status (Action Owner or RM)
   */
  async updateMitigationStatus(
    riskId: string,
    mitigationId: string,
    data: UpdateMitigationStatusRequest
  ) {
    const response = await api.patch<Mitigation>(
      `/risks/${riskId}/mitigations/${mitigationId}/status`,
      data
    )
    return response.data
  }

  /**
   * Delete a mitigation measure
   */
  async deleteMitigation(riskId: string, mitigationId: string) {
    const response = await api.delete(`/risks/${riskId}/mitigations/${mitigationId}`)
    return response.data
  }

  /**
   * Get mitigations assigned to current user
   */
  async getMyMitigations() {
    const response = await api.get<Array<{ mitigation: Mitigation; risk: any }>>('/mitigations/my-actions')
    return response.data
  }

  /**
   * Get overdue mitigations
   */
  async getOverdueMitigations() {
    const response = await api.get<Array<{ mitigation: Mitigation; risk: any }>>('/mitigations/overdue')
    return response.data
  }
}

export default new MitigationService()
