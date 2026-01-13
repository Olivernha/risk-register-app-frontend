import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Risk, Question, QuestionStatus } from '@/types'
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

  async function updateRisk(id: string, data: any) {
    loading.value = true
    error.value = null
    try {
      const updatedRisk = await riskService.updateRisk(id, data)
      
      // Update local cache
      const index = risks.value.findIndex((r: Risk) => r.id === id)
      if (index !== -1) {
        risks.value[index] = updatedRisk
      }
      currentRisk.value = updatedRisk

      return updatedRisk
    } catch (e: any) {
      error.value = e.message || `Failed to update risk ${id}`
      throw e
    } finally {
      loading.value = false
    }
  }

  async function publishRisk(id: string) {
    loading.value = true
    error.value = null
    try {
      // 1. Fetch latest state of risk to validate
      const risk = risks.value.find(r => r.id === id) || await riskService.getRisk(id)
      
      if (!risk) throw new Error('Risk not found')
      
      // 2. Preconditions Check
      if (risk.status !== 'Draft') {
        throw new Error('Only Draft risks can be published')
      }
      if (!risk.owners || risk.owners.length === 0) {
        throw new Error('Risk must have at least one owner assigned')
      }
      
      // 3. Update Status
      const updatedRisk = await riskService.updateRisk(id, { 
          status: 'Published',
          audit: {
            ...risk.audit,
            updatedBy: 'Current User', // TODO: Get from auth store if possible, but store access inside store might be tricky without passing custom arg or using root store
            updatedAt: new Date()
          }
      })
      
      // 4. Update Local State
      const index = risks.value.findIndex(r => r.id === id)
      if (index !== -1) {
        risks.value[index] = updatedRisk
      }
      currentRisk.value = updatedRisk

      // 5. Mock Notifications
      console.log(`[Notification System] Email sent to owners: ${risk.owners.map(o => o.email).join(', ')}`)
      
      return updatedRisk
    } catch (e: any) {
      error.value = e.message || `Failed to publish risk ${id}`
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function lockRisk(id: string, forceOverride: boolean = false) {
    loading.value = true
    error.value = null
    try {
      const risk = risks.value.find((r: Risk) => r.id === id) || await riskService.getRisk(id)
      
      if (!risk) throw new Error('Risk not found')
      
      // Validation: Must be Published
      if (risk.status !== 'Published') {
        throw new Error('Only Published risks can be locked')
      }

      // Check rating completeness
      const pendingOwners = risk.owners.filter((owner: any) => {
        const ownerRating = risk.ratings.find((r: any) => r.ownerId === owner.userId)
        return !ownerRating || !ownerRating.submittedAt
      })

      if (pendingOwners.length > 0 && !forceOverride) {
        const ownerNames = pendingOwners.map((o: any) => o.name).join(', ')
        throw new Error(`INCOMPLETE_RATINGS:${ownerNames}`)
      }

      // Lock the risk
      const updatedRisk = await riskService.updateRisk(id, {
        status: 'Locked',
        audit: {
          ...risk.audit,
          updatedBy: 'Current User',
          updatedAt: new Date(),
          lockedBy: 'Current User',
          lockedAt: new Date()
        }
      })

      // Update local state
      const index = risks.value.findIndex((r: Risk) => r.id === id)
      if (index !== -1) {
        risks.value[index] = updatedRisk
      }
      currentRisk.value = updatedRisk

      return updatedRisk
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateRiskRating(riskId: string, ownerId: string, newRating: any, comment: string) {
    loading.value = true
    error.value = null
    try {
      const risk = risks.value.find((r: Risk) => r.id === riskId) || await riskService.getRisk(riskId)
      if (!risk) throw new Error('Risk not found')

      if (risk.status === 'Locked') {
        throw new Error('Cannot update rating on a locked risk.')
      }

      if (!comment) {
        throw new Error('A comment is required to explain the change.')
      }

      const ratingIndex = risk.ratings.findIndex(r => r.ownerId === ownerId)
      if (ratingIndex === -1) {
        throw new Error('Rating not found for this owner.')
      }

      const oldRating = risk.ratings[ratingIndex]
      const historyEntry = {
        likelihood: oldRating.currentLikelihood,
        impact: oldRating.currentImpact,
        changedAt: new Date(),
        reason: comment
      }

      const updatedRating = {
        ...oldRating,
        ...newRating,
        updatedAt: new Date(),
        history: [...oldRating.history, historyEntry]
      }

      risk.ratings[ratingIndex] = updatedRating

      // Recalculate average rating
      // This is a simplified calculation. A more robust implementation would be needed.
      const totalLikelihood = risk.ratings.reduce((acc, r) => acc + r.currentLikelihood, 0)
      const totalImpact = risk.ratings.reduce((acc, r) => acc + r.currentImpact, 0)
      risk.averageRating = {
        likelihood: totalLikelihood / risk.ratings.length,
        impact: totalImpact / risk.ratings.length,
        riskLevel: 'Medium', // Simplified
        color: 'yellow'
      }

      const updatedRisk = await riskService.updateRisk(riskId, { ratings: risk.ratings, averageRating: risk.averageRating })

      const index = risks.value.findIndex(r => r.id === riskId)
      if (index !== -1) {
        risks.value[index] = updatedRisk
      }
      currentRisk.value = updatedRisk

      // Mock notification
      console.log(`[Notification System] RM notified of rating change for risk ${risk.refNo}`)

      return updatedRisk
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteRisk(id: string, reason: string) {
    loading.value = true
    error.value = null
    try {
      const risk = risks.value.find((r: Risk) => r.id === id) || await riskService.getRisk(id)
      
      if (!risk) throw new Error('Risk not found')
      
      // Validation
      if (risk.status !== 'Draft') {
        throw new Error('Only Draft risks can be deleted')
      }
      const hasActualRatings = risk.ratings && risk.ratings.some((r: any) => r.currentLikelihood > 0 || r.currentImpact > 0)
      if (hasActualRatings) {
        throw new Error('Cannot delete risk that has actual submitted ratings')
      }
      if (risk.mitigations && risk.mitigations.length > 0) {
        throw new Error('Cannot delete risk that has mitigations')
      }

      // Soft Delete
      const updatedRisk = await riskService.updateRisk(id, {
        status: 'Deleted',
        audit: {
          ...risk.audit,
          updatedBy: 'Current User',
          updatedAt: new Date(),
          deletedBy: 'Current User',
          deletedAt: new Date(),
          deleteReason: reason
        }
      })

      // Update local state (remove from list or mark as deleted)
      // Since we want to hide it, removing from local list is appropriate for now
      const index = risks.value.findIndex((r: Risk) => r.id === id)
      if (index !== -1) {
        risks.value.splice(index, 1)
      }
      currentRisk.value = null

      return updatedRisk
    } catch (e: any) {
      error.value = e.message
      throw e
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
    fetchRiskById,
    updateRisk,
    publishRisk,
    lockRisk,
    updateRiskRating,
    deleteRisk,

    async addQuestion(riskId: string, data: { text: string; assignedToId: string; priority: string; dueDate?: string }) {
      loading.value = true
      error.value = null
      try {
        const risk = risks.value.find(r => r.id === riskId) || await riskService.getRisk(riskId)
        if (!risk) throw new Error('Risk not found')

        // Create a new thread for the question
        // We import threadService inside action to avoid circular dependency if any, or just at top
        const { default: threadService } = await import('@/api/threads')
        
        // Find owner name for payload
        const owner = risk.owners.find(o => o.userId === data.assignedToId)
        if (!owner) throw new Error('Owner not found')

        const questionId = crypto.randomUUID()
        
        // Actually threadService.createThread might be better
        const thread = await threadService.createThread({
           entityType: 'question_reply',
           entityId: questionId,
           riskRef: risk.refNo,
           version: risk.version
        })

        const newQuestion: Question = {
           questionId: questionId,
           text: data.text,
           assignedTo: {
             userId: owner.userId,
             name: owner.name
           },
           status: 'Open' as QuestionStatus,
           priority: data.priority as any,
           dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
           threadId: thread.id,
           createdAt: new Date(),
           createdBy: 'Current User' // Should get from authStore
        }

        const currentQuestions = risk.questions || []
        const updatedQuestions = [...currentQuestions, newQuestion]

        // Update Risk
        const updatedRisk = await riskService.updateRisk(riskId, { questions: updatedQuestions })

        // Update local state
        const index = risks.value.findIndex(r => r.id === riskId)
        if (index !== -1) risks.value[index] = updatedRisk
        currentRisk.value = updatedRisk
        
        return updatedRisk
      } catch (e: any) {
        error.value = e.message
        throw e
      } finally {
        loading.value = false
      }
    },

    async closeQuestion(riskId: string, questionId: string) {
       loading.value = true
       try {
         const risk = risks.value.find(r => r.id === riskId) || await riskService.getRisk(riskId)
         if (!risk) throw new Error('Risk not found')
         
         const questions = risk.questions || []
         const qIndex = questions.findIndex((q: any) => q.questionId === questionId)
         
         if (qIndex === -1) throw new Error('Question not found')
         
         const updatedQuestion = {
           ...questions[qIndex],
           status: 'Closed' as QuestionStatus,
           closedAt: new Date(),
           closedBy: 'Current User'
         }
         
         const updatedQuestions = [...questions]
         updatedQuestions[qIndex] = updatedQuestion
         
         const updatedRisk = await riskService.updateRisk(riskId, { questions: updatedQuestions })
         
         const index = risks.value.findIndex(r => r.id === riskId)
         if (index !== -1) risks.value[index] = updatedRisk
         currentRisk.value = updatedRisk

         return updatedRisk
       } catch (e: any) {
         error.value = e.message
         throw e
       } finally { 
         loading.value = false
       }
    }
  }
})
