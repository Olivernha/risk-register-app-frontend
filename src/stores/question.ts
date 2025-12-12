import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import questionService from '@/api/questions'
import type { Question, QuestionStatus } from '@/types'
import { useNotifications } from '@/composables/useNotifications'

export const useQuestionStore = defineStore('question', () => {
  const { showSuccess, showError } = useNotifications()

  // State
  const myQuestions = ref<Array<{ question: Question; risk: any }>>([])
  const loading = ref(false)

  // Getters
  const questionCount = computed(() => myQuestions.value.length)
  const openQuestions = computed(() =>
    myQuestions.value.filter((q) => q.question.status === 'Open')
  )
  const openCount = computed(() => openQuestions.value.length)
  const answeredQuestions = computed(() =>
    myQuestions.value.filter((q) => q.question.status === 'Answered')
  )

  // Actions
  async function fetchMyQuestions(status?: QuestionStatus) {
    loading.value = true
    try {
      const questions = await questionService.getMyQuestions(status)
      myQuestions.value = questions
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch your questions')
      console.error('Failed to fetch my questions:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchUnansweredQuestions() {
    loading.value = true
    try {
      const questions = await questionService.getUnansweredQuestions()
      return questions
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch unanswered questions')
      console.error('Failed to fetch unanswered questions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createQuestion(riskId: string, data: any) {
    loading.value = true
    try {
      const question = await questionService.createQuestion(riskId, data)
      showSuccess('Question created successfully')
      return question
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create question')
      console.error('Failed to create question:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function replyToQuestion(riskId: string, questionId: string, reply: string) {
    loading.value = true
    try {
      await questionService.replyToQuestion(riskId, questionId, { reply })
      
      // Update in my questions list
      const index = myQuestions.value.findIndex((q) => q.question.questionId === questionId)
      if (index !== -1) {
        myQuestions.value[index].question.status = 'Answered'
      }

      showSuccess('Reply submitted successfully')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to submit reply')
      console.error('Failed to reply to question:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function closeQuestion(riskId: string, questionId: string, closingComment?: string) {
    loading.value = true
    try {
      const question = await questionService.closeQuestion(riskId, questionId, { closingComment })
      
      // Update in my questions list
      const index = myQuestions.value.findIndex((q) => q.question.questionId === questionId)
      if (index !== -1) {
        myQuestions.value[index].question = question
      }

      showSuccess('Question closed successfully')
      return question
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to close question')
      console.error('Failed to close question:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function reopenQuestion(riskId: string, questionId: string) {
    loading.value = true
    try {
      const question = await questionService.reopenQuestion(riskId, questionId)
      
      // Update in my questions list
      const index = myQuestions.value.findIndex((q) => q.question.questionId === questionId)
      if (index !== -1) {
        myQuestions.value[index].question = question
      }

      showSuccess('Question reopened successfully')
      return question
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to reopen question')
      console.error('Failed to reopen question:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    myQuestions,
    loading,

    // Getters
    questionCount,
    openQuestions,
    openCount,
    answeredQuestions,

    // Actions
    fetchMyQuestions,
    fetchUnansweredQuestions,
    createQuestion,
    replyToQuestion,
    closeQuestion,
    reopenQuestion,
  }
})
