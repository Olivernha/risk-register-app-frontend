import api from '@/plugins/axios'
import type { Thread, Comment, ThreadEntityType } from '@/types'

export interface AddCommentRequest {
  message: string
  mentions?: string[] // User IDs
}

export interface UpdateCommentRequest {
  message: string
}

class ThreadService {
  /**
   * Get a thread by ID
   */
  async getThread(threadId: string) {
    const response = await api.get<Thread>(`/threads/${threadId}`)
    return response.data
  }

  /**
   * Add a comment to a thread
   */
  async addComment(threadId: string, data: AddCommentRequest) {
    const response = await api.post<Comment>(`/threads/${threadId}/comments`, data)
    return response.data
  }

  /**
   * Update a comment (own comments only)
   */
  async updateComment(threadId: string, commentId: string, data: UpdateCommentRequest) {
    const response = await api.patch<Comment>(`/threads/${threadId}/comments/${commentId}`, data)
    return response.data
  }

  /**
   * Delete a comment (own comments only)
   */
  async deleteComment(threadId: string, commentId: string) {
    const response = await api.delete(`/threads/${threadId}/comments/${commentId}`)
    return response.data
  }

  /**
   * Get threads for a specific entity
   */
  async getEntityThreads(entityType: ThreadEntityType, entityId: string) {
    const response = await api.get<Thread[]>('/threads', {
      params: { entityType, entityId },
    })
    return response.data
  }
}

export default new ThreadService()
