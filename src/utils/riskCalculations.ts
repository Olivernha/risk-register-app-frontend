import type { RiskLevel, Rating, Mitigation } from '@/types'

/**
 * Heat map matrix mapping likelihood × impact to risk levels
 * Based on Appendix A in the functional specification
 */
const HEATMAP_MATRIX: Record<number, Record<number, { level: RiskLevel; color: string }>> = {
  1: {
    1: { level: 'Low', color: '#80CBC4' },
    2: { level: 'Low', color: '#80CBC4' },
    3: { level: 'Low', color: '#80CBC4' },
    4: { level: 'Low', color: '#80CBC4' },
    5: { level: 'Medium', color: '#FFEB3B' },
  },
  2: {
    1: { level: 'Low', color: '#80CBC4' },
    2: { level: 'Low', color: '#80CBC4' },
    3: { level: 'Low', color: '#80CBC4' },
    4: { level: 'Medium', color: '#FFEB3B' },
    5: { level: 'High', color: '#FF9800' },
  },
  3: {
    1: { level: 'Low', color: '#80CBC4' },
    2: { level: 'Low', color: '#80CBC4' },
    3: { level: 'Medium', color: '#FFEB3B' },
    4: { level: 'High', color: '#FF9800' },
    5: { level: 'High', color: '#FF9800' },
  },
  4: {
    1: { level: 'Low', color: '#80CBC4' },
    2: { level: 'Medium', color: '#FFEB3B' },
    3: { level: 'High', color: '#FF9800' },
    4: { level: 'High', color: '#FF9800' },
    5: { level: 'Very High', color: '#E91E63' },
  },
  5: {
    1: { level: 'Medium', color: '#FFEB3B' },
    2: { level: 'High', color: '#FF9800' },
    3: { level: 'High', color: '#FF9800' },
    4: { level: 'Very High', color: '#E91E63' },
    5: { level: 'Very High', color: '#E91E63' },
  },
}

/**
 * Calculate average likelihood from ratings
 * Rule BR-001: Round to nearest integer (0.5 rounds up)
 */
export function calculateAverageLikelihood(ratings: Rating[]): number | null {
  if (ratings.length === 0) return null

  const sum = ratings.reduce((acc, rating) => acc + rating.currentLikelihood, 0)
  const average = sum / ratings.length
  return Math.round(average)
}

/**
 * Calculate average impact from ratings
 * Rule BR-002: Round to nearest integer (0.5 rounds up)
 */
export function calculateAverageImpact(ratings: Rating[]): number | null {
  if (ratings.length === 0) return null

  const sum = ratings.reduce((acc, rating) => acc + rating.currentImpact, 0)
  const average = sum / ratings.length
  return Math.round(average)
}

/**
 * Get risk level and color from likelihood and impact
 * Rule BR-003: Lookup from heat map matrix
 */
export function getRiskLevel(
  likelihood: number,
  impact: number
): { level: RiskLevel; color: string } | null {
  if (likelihood < 1 || likelihood > 5 || impact < 1 || impact > 5) {
    return null
  }

  return HEATMAP_MATRIX[likelihood][impact]
}

/**
 * Calculate average rating from multiple owner ratings
 * Combines BR-001, BR-002, and BR-003
 */
export function calculateAverageRating(ratings: Rating[]) {
  const avgLikelihood = calculateAverageLikelihood(ratings)
  const avgImpact = calculateAverageImpact(ratings)

  if (avgLikelihood === null || avgImpact === null) {
    return null
  }

  const riskLevelData = getRiskLevel(avgLikelihood, avgImpact)

  if (!riskLevelData) {
    return null
  }

  return {
    likelihood: avgLikelihood,
    impact: avgImpact,
    riskLevel: riskLevelData.level,
    color: riskLevelData.color,
  }
}

/**
 * Calculate residual average rating
 */
export function calculateResidualAverageRating(ratings: Rating[]) {
  const ratingsWithResidual = ratings.filter(
    (r) => r.residualLikelihood !== undefined && r.residualImpact !== undefined
  )

  if (ratingsWithResidual.length === 0) return null

  const avgLikelihood = Math.round(
    ratingsWithResidual.reduce((acc, r) => acc + (r.residualLikelihood || 0), 0) /
      ratingsWithResidual.length
  )

  const avgImpact = Math.round(
    ratingsWithResidual.reduce((acc, r) => acc + (r.residualImpact || 0), 0) /
      ratingsWithResidual.length
  )

  const riskLevelData = getRiskLevel(avgLikelihood, avgImpact)

  if (!riskLevelData) return null

  return {
    residualLikelihood: avgLikelihood,
    residualImpact: avgImpact,
    residualRiskLevel: riskLevelData.level,
  }
}

/**
 * Calculate mitigation completion percentage for a risk
 * Rule BR-007: (Completed mitigations / Total mitigations) × 100
 */
export function calculateMitigationCompletionRate(mitigations: Mitigation[]): number {
  if (mitigations.length === 0) return 0

  const completedCount = mitigations.filter((m) => m.status === 'Completed').length
  return Math.round((completedCount / mitigations.length) * 100)
}

/**
 * Check if a mitigation is overdue
 * Rule BR-006: current_date > target_date AND status != "Completed"
 */
export function isMitigationOverdue(mitigation: Mitigation): boolean {
  if (mitigation.status === 'Completed') return false

  const targetDate = new Date(mitigation.targetDate)
  const now = new Date()

  return now > targetDate
}

/**
 * Get all overdue mitigations from a list
 */
export function getOverdueMitigations(mitigations: Mitigation[]): Mitigation[] {
  return mitigations.filter(isMitigationOverdue)
}

/**
 * Get likelihood label from numeric value
 */
export function getLikelihoodLabel(value: number): string {
  const labels: Record<number, string> = {
    1: 'Rare',
    2: 'Unlikely',
    3: 'Possible',
    4: 'Likely',
    5: 'Almost Certain',
  }
  return labels[value] || 'Unknown'
}

/**
 * Get impact label from numeric value
 */
export function getImpactLabel(value: number): string {
  const labels: Record<number, string> = {
    1: 'Negligible',
    2: 'Minor',
    3: 'Moderate',
    4: 'Major',
    5: 'Catastrophic',
  }
  return labels[value] || 'Unknown'
}

/**
 * Get likelihood definition
 */
export function getLikelihoodDefinition(value: number): string {
  const definitions: Record<number, string> = {
    1: '<10% probability',
    2: '10-20% probability',
    3: '20-50% probability',
    4: '50-75% probability',
    5: '>75% probability',
  }
  return definitions[value] || ''
}

/**
 * Get impact definition
 */
export function getImpactDefinition(value: number): string {
  const definitions: Record<number, string> = {
    1: 'Minimal financial/operational impact',
    2: 'Low impact, manageable',
    3: 'Moderate impact, attention required',
    4: 'Significant impact, escalation needed',
    5: 'Severe impact, crisis level',
  }
  return definitions[value] || ''
}

/**
 * Get the full heat map matrix for visualization
 */
export function getHeatMapMatrix() {
  return HEATMAP_MATRIX
}
