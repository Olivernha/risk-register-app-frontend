import api from '@/plugins/axios'
import type { Thread, Comment, ThreadEntityType } from '@/types'

export interface CreateThreadRequest {
  entityType: ThreadEntityType
  entityId: string
  riskRef: string
  version: string
}

export interface AddCommentRequest {
  message: string
  mentions?: string[]
  parentId?: string
}

class ThreadService {
  /**
   * Get all threads
   */
  async getThreads() {
    const response = await api.get<Thread[]>('/threads')
    return response.data
  }

  /**
   * Get a specific thread by ID
   */
  async getThread(id: string) {
    const response = await api.get<Thread>(`/threads/${id}`)
    return response.data
  }

  /**
   * Get thread by entity (for rating basis, mitigation, question)
   */
  async getThreadByEntity(entityType: ThreadEntityType, entityId: string) {
    const response = await api.get<Thread[]>('/threads')
    // Filter client-side for json-server
    return response.data.find(
      t => t.entityType === entityType && t.entityId === entityId
    ) || null
  }

  /**
   * Create a new thread
   */
  async createThread(data: CreateThreadRequest) {
    const response = await api.post<Thread>('/threads', {
      ...data,
      comments: [],
      createdAt: new Date().toISOString(),
      lastCommentAt: new Date().toISOString(),
    })
    return response.data
  }

  /**
   * Add a comment to a thread
   */
  async addComment(threadId: string, data: AddCommentRequest, userId: string, userName: string, userRole: string) {
    const thread = await this.getThread(threadId)
    if (!thread) throw new Error('Thread not found')

    const newComment: Comment = {
      commentId: `comment-${Date.now()}`,
      userId,
      userName,
      userRole,
      message: data.message,
      timestamp: new Date(),
      edited: false,
      mentions: data.mentions || [],
      parentId: data.parentId,
    }

    const updatedThread: Thread = {
      ...thread,
      comments: [...thread.comments, newComment],
      lastCommentAt: new Date(),
    }

    const response = await api.put<Thread>(`/threads/${threadId}`, updatedThread)
    return response.data
  }

  /**
   * Delete a comment from a thread (only if user owns it)
   */
  async deleteComment(threadId: string, commentId: string, userId: string) {
    const thread = await this.getThread(threadId)
    if (!thread) throw new Error('Thread not found')

    const comment = thread.comments.find(c => c.commentId === commentId)
    if (!comment) throw new Error('Comment not found')

    if (comment.userId !== userId) {
      throw new Error('You can only delete your own comments')
    }

    const updatedThread: Thread = {
      ...thread,
      comments: thread.comments.filter(c => c.commentId !== commentId),
    }

    const response = await api.put<Thread>(`/threads/${threadId}`, updatedThread)
    return response.data
  }
}

export default new ThreadService()

