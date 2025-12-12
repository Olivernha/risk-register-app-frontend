import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Risk, RiskStatus } from '@/types'

/**
 * Composable for checking risk-specific permissions
 */
export function useRiskPermissions() {
  const authStore = useAuthStore()

  /**
   * Check if user can create risks
   */
  const canCreateRisk = computed(() => {
    return authStore.hasRole(['RiskManagement', 'Admin'])
  })

  /**
   * Check if user can edit a specific risk
   */
  const canEditRisk = (risk: Risk) => {
    // Cannot edit locked risks
    if (risk.status === 'Locked') return false

    // Only RM and Admin can edit
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can delete a risk
   */
  const canDeleteRisk = (risk: Risk) => {
    // Can only delete draft risks with no ratings
    if (risk.status !== 'Draft') return false
    if (risk.ratings && risk.ratings.length > 0) return false

    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can publish a risk
   */
  const canPublishRisk = (risk: Risk) => {
    if (risk.status !== 'Draft') return false
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can lock a risk
   */
  const canLockRisk = (risk: Risk) => {
    if (risk.status !== 'Published') return false
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can submit rating for a risk
   */
  const canSubmitRating = (risk: Risk) => {
    // Risk must be published
    if (risk.status !== 'Published') return false

    // User must be assigned as owner
    const userId = authStore.user?.userId
    if (!userId) return false

    return risk.owners.some((owner) => owner.userId === userId)
  }

  /**
   * Check if user can create mitigation for a risk
   */
  const canCreateMitigation = (risk: Risk) => {
    // Cannot add mitigations to locked risks
    if (risk.status === 'Locked') return false

    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can update mitigation
   */
  const canUpdateMitigation = (risk: Risk) => {
    if (risk.status === 'Locked') return false
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can update mitigation status
   */
  const canUpdateMitigationStatus = (mitigation: any) => {
    const userId = authStore.user?.userId
    if (!userId) return false

    // Action owner can update status
    if (mitigation.actionOwner.userId === userId) return true

    // RM and Admin can also update
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can create question for a risk
   */
  const canCreateQuestion = (risk: Risk) => {
    if (risk.status === 'Locked') return false
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can reply to a question
   */
  const canReplyToQuestion = (question: any) => {
    const userId = authStore.user?.userId
    if (!userId) return false

    // Only assigned user can reply
    return question.assignedTo.userId === userId
  }

  /**
   * Check if user can close a question
   */
  const canCloseQuestion = () => {
    return authStore.hasRole(['RiskManagement', 'Admin'])
  }

  /**
   * Check if user can manage versions
   */
  const canManageVersions = computed(() => {
    return authStore.hasRole(['RiskManagement', 'Admin'])
  })

  /**
   * Check if user can manage users
   */
  const canManageUsers = computed(() => {
    return authStore.hasRole(['Admin'])
  })

  return {
    canCreateRisk,
    canEditRisk,
    canDeleteRisk,
    canPublishRisk,
    canLockRisk,
    canSubmitRating,
    canCreateMitigation,
    canUpdateMitigation,
    canUpdateMitigationStatus,
    canCreateQuestion,
    canReplyToQuestion,
    canCloseQuestion,
    canManageVersions,
    canManageUsers,
  }
}
