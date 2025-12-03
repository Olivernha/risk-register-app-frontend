// User types
export type UserRole = 'RiskManagement' | 'RiskOwner' | 'ActionOwner' | 'HOD' | 'Admin'

export interface User {
  userId: string
  name: string
  email: string
  role: UserRole
  department: string
  permissions: Permission[]
  active: boolean
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// Risk types
export type RiskStatus = 'Draft' | 'Published' | 'Locked'
export type RiskCategory = 'Strategic' | 'Operational' | 'Financial' | 'Compliance'
export type TimeHorizon = '< 1 year' | '1-3 years' | '> 3 years'
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High'

export interface Risk {
  _id: string
  refNo: string
  title: string
  description: string
  timeHorizon: TimeHorizon
  category: RiskCategory
  financialImpact: {
    hasImpact: boolean
    amount?: number
  }
  status: RiskStatus
  version: string
  owners: RiskOwner[]
  ratings: Rating[]
  averageRating?: AverageRating
  mitigations: Mitigation[]
  questions: Question[]
  audit: AuditInfo
}

export interface RiskOwner {
  userId: string
  name: string
  email: string
  assignedAt: Date
}

export interface Rating {
  ownerId: string
  currentLikelihood: number
  currentImpact: number
  residualLikelihood?: number
  residualImpact?: number
  basisThreadId: string
  submittedAt: Date
  updatedAt: Date
  history: RatingHistory[]
}

export interface RatingHistory {
  likelihood: number
  impact: number
  changedAt: Date
  reason: string
}

export interface AverageRating {
  likelihood: number
  impact: number
  riskLevel: RiskLevel
  color: string
  residualLikelihood?: number
  residualImpact?: number
  residualRiskLevel?: RiskLevel
}

// Mitigation types
export type MitigationStatus = 'Not Started' | 'Ongoing' | 'Completed'

export interface Mitigation {
  controlId: string
  title: string
  details: string
  controlOwner: {
    userId: string
    name: string
  }
  actionOwner: {
    userId: string
    name: string
  }
  status: MitigationStatus
  targetDate: Date
  actualCompletionDate?: Date
  progressPercentage: number
  commentsThreadId: string
  createdAt: Date
  updatedAt: Date
}

// Question types
export type QuestionStatus = 'Open' | 'Answered' | 'Closed'
export type QuestionPriority = 'Low' | 'Medium' | 'High'

export interface Question {
  questionId: string
  text: string
  assignedTo: {
    userId: string
    name: string
  }
  status: QuestionStatus
  priority: QuestionPriority
  dueDate?: Date
  threadId: string
  createdAt: Date
  createdBy: string
  closedAt?: Date
  closedBy?: string
}

// Thread types
export type ThreadEntityType = 'rating_basis' | 'mitigation_progress' | 'question_reply'

export interface Thread {
  _id: string
  entityType: ThreadEntityType
  entityId: string
  riskRef: string
  version: string
  comments: Comment[]
  createdAt: Date
  lastCommentAt: Date
}

export interface Comment {
  commentId: string
  userId: string
  userName: string
  userRole: string
  message: string
  timestamp: Date
  edited: boolean
  mentions: string[]
}

// Version types
export type VersionStatus = 'Active' | 'Locked'

export interface Version {
  _id: string
  cycle: string
  status: VersionStatus
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: Date
  lockedBy?: string
  lockedAt?: Date
  snapshotIds: string[]
  statistics: VersionStatistics
}

export interface VersionStatistics {
  totalRisks: number
  risksByLevel: {
    veryHigh: number
    high: number
    medium: number
    low: number
  }
  ratingCompletionRate: number
  mitigationCompletionRate: number
}

// Audit types
export interface AuditInfo {
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  lockedBy?: string
  lockedAt?: Date
}

// Dashboard types
export interface HeatmapCell {
  likelihood: number
  impact: number
  riskLevel: RiskLevel
  color: string
  risks: RiskSummary[]
}

export interface RiskSummary {
  _id: string
  refNo: string
  title: string
  riskLevel: RiskLevel
  status: RiskStatus
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  timeout?: number
  action?: {
    label: string
    callback: () => void
  }
}
