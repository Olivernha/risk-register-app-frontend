import api from '@/plugins/axios'
import type { Question, QuestionPriority, QuestionStatus } from '@/types'

export interface CreateQuestionRequest {
  text: string
  assignedToUserId: string
  priority: QuestionPriority
  dueDate?: string
}

export interface ReplyToQuestionRequest {
  reply: string
}

export interface CloseQuestionRequest {
  closingComment?: string
}

class QuestionService {
  /**
   * Create an ad-hoc question for a risk owner
   */
  async createQuestion(riskId: string, data: CreateQuestionRequest) {
    const response = await api.post<Question>(`/risks/${riskId}/questions`, data)
    return response.data
  }

  /**
   * Reply to a question (Risk Owner)
   */
  async replyToQuestion(riskId: string, questionId: string, data: ReplyToQuestionRequest) {
    const response = await api.post(`/risks/${riskId}/questions/${questionId}/replies`, data)
    return response.data
  }

  /**
   * Close a question (RM)
   */
  async closeQuestion(riskId: string, questionId: string, data?: CloseQuestionRequest) {
    const response = await api.patch<Question>(`/risks/${riskId}/questions/${questionId}/close`, data)
    return response.data
  }

  /**
   * Reopen a question (RM)
   */
  async reopenQuestion(riskId: string, questionId: string) {
    const response = await api.patch<Question>(`/risks/${riskId}/questions/${questionId}/reopen`)
    return response.data
  }

  /**
   * Get questions assigned to current user
   */
  async getMyQuestions(status?: QuestionStatus) {
    const response = await api.get<Array<{ question: Question; risk: any }>>('/questions/my-questions', {
      params: { status },
    })
    return response.data
  }

  /**
   * Get all unanswered questions (RM)
   */
  async getUnansweredQuestions() {
    const response = await api.get<Array<{ question: Question; risk: any }>>('/questions/unanswered')
    return response.data
  }
}

export default new QuestionService()
