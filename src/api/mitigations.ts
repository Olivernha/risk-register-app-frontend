import api from '@/plugins/axios'
import type { Risk, Mitigation, MitigationStatus } from '@/types'
import threadService from './threads'

export interface CreateMitigationRequest {
  title: string
  details: string
  actionOwner: {
    userId: string
    name: string
  }
  targetDate: Date
  status?: MitigationStatus
}

class MitigationService {
  /**
   * Add a mitigation to a risk
   */
  async addMitigation(riskId: string, data: CreateMitigationRequest) {
    // Get the current risk
    const risk = await api.get<Risk>(`/risks/${riskId}`)
    const currentRisk = risk.data

    // Generate unique control ID
    const controlId = `mit-${Date.now()}`

    // Create a thread for mitigation comments
    const thread = await threadService.createThread({
      entityType: 'mitigation_progress',
      entityId: controlId,
      riskRef: currentRisk.refNo,
      version: currentRisk.version
    })

    // Create the mitigation object
    const newMitigation: Mitigation = {
      controlId,
      title: data.title,
      details: data.details,
      controlOwner: {
        userId: 'RM001', // Default to current RM user - should be from auth context
        name: 'Risk Manager'
      },
      actionOwner: data.actionOwner,
      status: data.status || 'Not Started',
      targetDate: data.targetDate,
      progressPercentage: 0,
      commentsThreadId: thread.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Update the risk with the new mitigation
    const updatedMitigations = [...(currentRisk.mitigations || []), newMitigation]
    
    const response = await api.patch<Risk>(`/risks/${riskId}`, {
      mitigations: updatedMitigations,
      audit: {
        ...currentRisk.audit,
        updatedBy: 'Current User',
        updatedAt: new Date().toISOString()
      }
    })

    return response.data
  }

  /**
   * Update a mitigation
   */
  async updateMitigation(riskId: string, controlId: string, updates: Partial<Mitigation>) {
    const risk = await api.get<Risk>(`/risks/${riskId}`)
    const currentRisk = risk.data

    const updatedMitigations = currentRisk.mitigations.map(m =>
      m.controlId === controlId
        ? { ...m, ...updates, updatedAt: new Date() }
        : m
    )

    const response = await api.patch<Risk>(`/risks/${riskId}`, {
      mitigations: updatedMitigations,
      audit: {
        ...currentRisk.audit,
        updatedBy: 'Current User',
        updatedAt: new Date().toISOString()
      }
    })

    return response.data
  }

  /**
   * Delete a mitigation
   */
  async deleteMitigation(riskId: string, controlId: string) {
    const risk = await api.get<Risk>(`/risks/${riskId}`)
    const currentRisk = risk.data

    const updatedMitigations = currentRisk.mitigations.filter(m => m.controlId !== controlId)

    const response = await api.patch<Risk>(`/risks/${riskId}`, {
      mitigations: updatedMitigations,
      audit: {
        ...currentRisk.audit,
        updatedBy: 'Current User',
        updatedAt: new Date().toISOString()
      }
    })

    return response.data
  }
}

export default new MitigationService()
