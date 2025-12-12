<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ title }}
        <span v-if="comments.length > 0" class="text-gray-500 dark:text-gray-400 ml-2">
          ({{ comments.length }})
        </span>
      </h3>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="space-y-3">
      <div
        v-for="comment in sortedComments"
        :key="comment.commentId"
        class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4"
      >
        <!-- Comment Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
              {{ getInitials(comment.userName) }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ comment.userName }}
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {{ comment.userRole }}
                </span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(comment.timestamp, 'relative') }}
                <span v-if="comment.edited" class="ml-1">(edited)</span>
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="canEditComment(comment)" class="flex gap-2">
            <button
              @click="$emit('edit-comment', comment)"
              class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Edit
            </button>
            <button
              @click="$emit('delete-comment', comment)"
              class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Comment Content -->
        <div
          class="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
          v-html="sanitizeHtml(comment.message)"
        ></div>

        <!-- Mentions -->
        <div v-if="comment.mentions && comment.mentions.length > 0" class="mt-2 flex items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">Mentioned:</span>
          <div class="flex gap-1">
            <span
              v-for="mention in comment.mentions"
              :key="mention"
              class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
            >
              @{{ mention }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
      No comments yet. Be the first to comment!
    </div>

    <!-- Add Comment Form -->
    <div v-if="!readonly" class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <textarea
        v-model="newComment"
        :placeholder="placeholder"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 mb-2"
      ></textarea>
      <div class="flex justify-end">
        <button
          @click="handleAddComment"
          :disabled="!newComment.trim() || loading"
          class="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Posting...' : 'Post Comment' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatDate, getInitials } from '@/utils/formatters'
import type { Comment } from '@/types'
import DOMPurify from 'dompurify'

interface Props {
  comments: Comment[]
  title?: string
  placeholder?: string
  readonly?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Comments',
  placeholder: 'Add a comment...',
  readonly: false,
  loading: false,
})

const emit = defineEmits<{
  'add-comment': [message: string]
  'edit-comment': [comment: Comment]
  'delete-comment': [comment: Comment]
}>()

const authStore = useAuthStore()
const newComment = ref('')

const sortedComments = computed(() => {
  return [...props.comments].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
})

function canEditComment(comment: Comment): boolean {
  return comment.userId === authStore.user?.userId
}

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  })
}

function handleAddComment() {
  if (newComment.value.trim()) {
    emit('add-comment', newComment.value)
    newComment.value = ''
  }
}
</script>
