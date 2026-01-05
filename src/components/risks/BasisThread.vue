<template>
  <div class="basis-thread bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Basis for Rating Discussion
      </h3>
      <span v-if="owner" class="text-sm text-gray-600 dark:text-gray-400">
        Owner: {{ owner.name }}
      </span>
    </div>

    <!-- Rating History Section -->
    <div v-if="rating && rating.history && rating.history.length > 0" class="mb-6">
      <button 
        @click="showHistory = !showHistory"
        class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none w-full text-left"
      >
        <span>Rating History ({{ rating.history.length }})</span>
        <svg 
          class="w-4 h-4 transition-transform duration-200" 
          :class="{ 'rotate-180': showHistory }" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="showHistory" class="space-y-2 fade-in">
        <div
          v-for="(entry, idx) in rating.history"
          :key="idx"
          class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-100 dark:border-gray-700"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 text-sm">
              <span class="font-medium text-gray-900 dark:text-gray-100">
                Likelihood: {{ entry.likelihood }} | Impact: {{ entry.impact }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(entry.changedAt) }}
              </span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ entry.reason }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Rating Display -->
    <div v-if="rating" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">Current Rating:</span>
        <span class="text-sm text-blue-700 dark:text-blue-300">
          Likelihood: {{ rating.currentLikelihood }} | Impact: {{ rating.currentImpact }}
        </span>
      </div>
      <div v-if="rating.submittedAt" class="mt-2 text-xs text-blue-600 dark:text-blue-400">
        Submitted: {{ formatDate(rating.submittedAt) }}
      </div>
    </div>

    <!-- Comments List -->
    <div class="space-y-4 mb-6">
      <div v-if="thread && thread.comments.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Comments ({{ thread.comments.length }})
        </h4>
        <div class="space-y-4">
          <ThreadComment
            v-for="comment in commentTree"
            :key="comment.commentId"
            :comment="comment"
            :users="users"
            :current-user-id="authStore.user?.userId"
            :is-locked="isLocked"
            :depth="0"
            @delete="handleDeleteComment"
            @reply="handleThreadReply"
          />
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No comments yet. Start the discussion below.</p>
      </div>
    </div>

    <!-- Add Comment Form -->
    <div v-if="!isLocked" class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Add Comment
      </h4>
      
      <!-- Rich Text Editor -->
      <div class="relative">
        <div class="editor-wrapper border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-shadow">
          <EditorContent :editor="editor" class="prose prose-sm dark:prose-invert max-w-none" />
        </div>

        <!-- Mention Suggestions -->
        <div
          v-if="showMentionSuggestions"
          class="absolute z-50 bottom-full left-0 mb-1 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 shadow-xl max-h-48 overflow-y-auto w-64"
        >
          <div class="px-2 py-1.5 text-xs font-medium text-gray-400 border-b border-gray-100 dark:border-gray-700">
            Select a user...
          </div>
          <button
            v-for="user in mentionableUsers"
            :key="user.userId"
            @click="insertMention(user)"
            class="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 text-sm text-gray-900 dark:text-gray-100 flex flex-col"
          >
            <span class="font-medium">{{ user.name }}</span>
            <span class="text-xs text-gray-500">{{ user.email }}</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between mt-3">
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Type <span class="text-blue-600 dark:text-blue-400 font-bold">@</span> to mention someone
        </div>
        <button
          @click="handleAddComment"
          :disabled="!canSubmitComment || submitting"
          class="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:transform active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {{ submitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </div>
    </div>
    <div v-else class="border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400">
      This risk is locked. Comments are read-only for audit purposes.
    </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ThreadComment from './ThreadComment.vue'
import threadService from '@/api/threads'
import userService from '@/api/users'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'
import { useConfirmStore } from '@/stores/confirm'
import type { Thread, Comment, Rating, RiskOwner, User } from '@/types'


interface Props {
  threadId: string | null
  rating: Rating | null
  owner: RiskOwner | null
  riskRef: string
  version: string
  riskId?: string
  isLocked?: boolean
}

const emit = defineEmits<{
  (e: 'update-thread-id', id: string): void
}>()

const props = withDefaults(defineProps<Props>(), {
  isLocked: false,
})

const authStore = useAuthStore()
const { showSuccess, showError } = useNotifications()
const confirmStore = useConfirmStore()

const thread = ref<Thread | null>(null)
const users = ref<User[]>([])
const submitting = ref(false)
const showMentionSuggestions = ref(false)
const mentionableUsers = ref<User[]>([])
const currentMentionQuery = ref('')
const showHistory = ref(false)

const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3 min-h-[100px]',
    },
  },
})

interface ThreadedComment extends Comment {
  children: ThreadedComment[]
}

const commentTree = computed<ThreadedComment[]>(() => {
  if (!thread.value) return []
  
  // Create nodes map
  const map = new Map<string, ThreadedComment>()
  // Deep copy comments to avoid mutating original
  const comments = JSON.parse(JSON.stringify(thread.value.comments)) as Comment[]
  
  // Sort by date first to ensure order
  comments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  
  comments.forEach(c => {
    map.set(c.commentId, { ...c, children: [] })
  })
  
  const roots: ThreadedComment[] = []
  
  comments.forEach(c => {
    const node = map.get(c.commentId)
    if (!node) return
    
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  
  return roots
})

const canSubmitComment = computed(() => {
  if (!editor.value) return false
  const content = editor.value.getHTML()
  return content.trim().length > 0 && content !== '<p></p>'
})



onMounted(async () => {
  await loadThread()
  await loadUsers()
  
  if (editor.value) {
    editor.value.on('update', handleEditorUpdate)
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.off('update', handleEditorUpdate)
    editor.value.destroy()
  }
})

watch(() => props.threadId, async () => {
  await loadThread()
})

async function loadThread() {
  thread.value = null
  
  // 1. Try to load by ID if available
  if (props.threadId) {
    try {
      thread.value = await threadService.getThread(props.threadId)
    } catch (error: any) {
      console.warn('Failed to load thread by ID:', props.threadId)
      // If 404, we continue to try finding by entity
    }
  }

  // 2. If not found and we have context, try to find by business key (entityId)
  if (!thread.value && props.riskId && props.owner) {
    try {
      const entityId = `${props.riskId}-${props.owner.userId}`
      // We assume the entityType for BasisThread is always 'rating_basis' for now
      // Ideally this should be a prop too, but for this fix we assume context.
      const found = await threadService.getThreadByEntity('rating_basis', entityId)
      
      if (found) {
        thread.value = found
        // If we found it by entity but the prop ID was wrong/missing, let parent know
        if (props.threadId !== found.id) {
          emit('update-thread-id', found.id)
        }
      }
    } catch (error) {
      console.error('Failed to look up thread by entity', error)
    }
  }
}

async function loadUsers() {
  try {
    users.value = await userService.getUsers()
  } catch (error: any) {
    console.error('Failed to load users:', error)
  }
}

function handleEditorUpdate() {
  if (!editor.value) return
  
  const content = editor.value.getText()
  const mentionMatch = content.match(/@(\w+)$/)
  
  if (mentionMatch) {
    currentMentionQuery.value = mentionMatch[1]
    showMentionSuggestions.value = true
    filterMentionableUsers()
  } else {
    showMentionSuggestions.value = false
  }
}

function filterMentionableUsers() {
  if (!currentMentionQuery.value) {
    mentionableUsers.value = users.value.filter(u => u.active)
    return
  }
  
  const query = currentMentionQuery.value.toLowerCase()
  mentionableUsers.value = users.value.filter(
    u => u.active && (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  )
}

function insertMention(user: User) {
  if (!editor.value) return
  
  const content = editor.value.getText()
  const mentionMatch = content.match(/@(\w+)$/)
  
  if (mentionMatch) {
    const beforeMention = content.substring(0, content.length - mentionMatch[0].length)
    editor.value.commands.setContent(beforeMention + `@${user.name} `)
  }
  
  showMentionSuggestions.value = false
  currentMentionQuery.value = ''
}

async function handleAddComment() {
  if (!editor.value || !authStore.user) return
  
  const htmlContent = editor.value.getHTML()
  const textContent = editor.value.getText().trim()
  
  if (!textContent) {
    showError('Please enter a comment')
    return
  }

  submitting.value = true

  try {
    // Extract mentions from content
    const mentions: string[] = []
    
    // Check key users against content to handle names with spaces correctly
    // This replaces the simple regex which failed on names with spaces
    users.value.forEach(user => {
      if (textContent.includes(`@${user.name}`)) {
        mentions.push(user.userId)
      }
    })

    // Ensure thread exists
    let activeThreadId = props.threadId
    
    // If we don't have a loaded thread, we need to create one or use the one we just found/created
    if (!thread.value) {
      if (!props.riskId || !props.owner) {
        throw new Error('Cannot create thread: missing context')
      }

      const entityId = `${props.riskId}-${props.owner.userId}`
      const newThread = await threadService.createThread({
        entityType: 'rating_basis',
        entityId,
        riskRef: props.riskRef,
        version: props.version
      })
      
      thread.value = newThread
      activeThreadId = newThread.id
      emit('update-thread-id', newThread.id)
    } else {
      activeThreadId = thread.value.id
    }

    if (!activeThreadId) throw new Error('No thread ID available')

    await threadService.addComment(
      activeThreadId,
      {
        message: htmlContent,
        mentions,
      },
      authStore.user.userId,
      authStore.user.name,
      authStore.user.role
    )

    await loadThread()
    editor.value.commands.clearContent()
    showSuccess('Comment added successfully')
  } catch (error: any) {
    showError(error.message || 'Failed to add comment')
  } finally {
    submitting.value = false
  }
}

async function handleThreadReply(data: { parentId: string, message: string, mentions: string[] }) {
  if (!authStore.user) return
  if (!props.threadId && !thread.value) return // Should not happen if replying to existing comment

  try {
    await threadService.addComment(
      props.threadId || thread.value!.id,
      {
        message: data.message,
        mentions: data.mentions,
        parentId: data.parentId
      },
      authStore.user.userId,
      authStore.user.name,
      authStore.user.role
    )
    await loadThread()
    showSuccess('Reply added successfully')
  } catch (error: any) {
    showError(error.message || 'Failed to add reply')
  }
}

async function handleDeleteComment(commentId: string) {
  if (!props.threadId || !authStore.user) return

  const confirmed = await confirmStore.ask({
    title: 'Delete Comment',
    message: 'Are you sure you want to delete this comment?',
    type: 'warning'
  })

  if (!confirmed) {
    return
  }

  try {
    await threadService.deleteComment(props.threadId, commentId, authStore.user.userId)
    await loadThread()
    showSuccess('Comment deleted successfully')
  } catch (error: any) {
    showError(error.message || 'Failed to delete comment')
  }
}



function formatDate(date: string | Date): string {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleString()
}


</script>

<style scoped>
.editor-wrapper :deep(.ProseMirror) {
  outline: none;
}

.editor-wrapper :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>

