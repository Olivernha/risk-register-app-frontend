<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 transition-shadow hover:shadow-sm">
    <!-- Header / Summary Row -->
    <div 
      @click="toggleExpand"
      class="p-4 cursor-pointer flex items-start gap-4"
    >
      <!-- Expand Icon -->
      <div class="mt-1 text-gray-400">
        <svg 
          class="w-5 h-5 transition-transform duration-200" 
          :class="{ 'rotate-90': expanded }" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-4 mb-2">
          <div class="flex items-center gap-3">
             <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusClass(question.status)
            ]">
              {{ question.status }}
            </span>
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getPriorityClass(question.priority)
            ]">
              {{ question.priority }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Assigned to: <span class="font-medium text-gray-900 dark:text-gray-100">{{ question.assignedTo.name }}</span>
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
             <span v-if="question.dueDate" :class="{'text-red-600 font-medium': isOverdue}">
              Due: {{ formatDate(question.dueDate) }}
            </span>
            <span>&bull;</span>
            <span>Created: {{ formatDate(question.createdAt) }}</span>
          </div>
        </div>
        
        <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {{ question.text }}
        </h4>
      </div>

       <!-- Actions (Right side catch) -->
       <div v-if="canClose" class="ml-2" @click.stop>
          <button
            @click="$emit('close-question', question.questionId)"
            class="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Mark as Closed"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
       </div>
    </div>

    <!-- Expanded Content -->
    <div v-if="expanded" class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-b-lg">
      
      <!-- Full Question Text -->
      <div class="mb-6">
        <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Question</h5>
        <div class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ question.text }}</div>
      </div>

      <!-- Thread Section -->
      <div>
        <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Discussion</h5>
        
        <div v-if="loadingThread" class="text-center py-4 text-sm text-gray-500">
          Loading conversation...
        </div>
        <div v-else-if="error" class="text-center py-4 text-sm text-red-500">
          {{ error }}
        </div>
        <div v-else>
          <!-- Comments -->
          <div v-if="comments.length > 0" class="space-y-4 mb-6">
             <ThreadComment
                v-for="comment in comments"
                :key="comment.commentId"
                :comment="comment"
                :users="users"
                :current-user-id="authStore.user?.userId"
                :is-locked="question.status === 'Closed'"
                :depth="0"
                @delete="handleDeleteComment"
                @reply="handleReply"
              />
          </div>
          <div v-else class="text-center py-4 text-sm text-gray-500 dark:text-gray-400 italic">
            No replies yet.
          </div>

          <!-- Add Reply Form -->
          <div v-if="question.status !== 'Closed'" class="mt-4">
             <div class="flex items-start gap-3">
               <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold">
                    {{ authStore.user?.name?.substring(0, 2).toUpperCase() }}
                  </div>
               </div>
               <div class="flex-1">
                 <div class="editor-wrapper border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500">
                    <EditorContent :editor="editor" class="prose prose-sm dark:prose-invert max-w-none p-3 min-h-[80px]" />
                 </div>
                 <div class="flex justify-end mt-2">
                   <button
                    @click="handleSubmitComment"
                    :disabled="!canSubmit || submitting"
                    class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     {{ submitting ? 'Posting...' : 'Post Reply' }}
                   </button>
                 </div>
               </div>
             </div>
          </div>
          <div v-else class="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded text-center text-sm text-gray-500">
            This question is closed.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'
import threadService from '@/api/threads'
import userService from '@/api/users'
import ThreadComment from '@/components/risks/ThreadComment.vue'
import type { Question, Thread, Comment, User } from '@/types'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  question: Question
  riskId: string // used if we need to create thread (though assumed created with question)
  isRm: boolean
}>()

const emit = defineEmits<{
  (e: 'close-question', questionId: string): void
}>()

const authStore = useAuthStore()
const { showError } = useNotifications()

const expanded = ref(false)
const loadingThread = ref(false)
const error = ref<string | null>(null)
const thread = ref<Thread | null>(null)
const users = ref<User[]>([])
const submitting = ref(false)

const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  editorProps: {
    attributes: {
      class: 'focus:outline-none',
      placeholder: 'Write a reply...'
    }
  }
})

// Comment Tree Logic (similar to BasisThread)
interface ThreadedComment extends Comment {
  children: ThreadedComment[]
}

const comments = computed<ThreadedComment[]>(() => {
  if (!thread.value) return []
  const map = new Map<string, ThreadedComment>()
  const rawComments = JSON.parse(JSON.stringify(thread.value.comments)) as Comment[]
  
  rawComments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  
  rawComments.forEach(c => map.set(c.commentId, { ...c, children: [] }))
  
  const roots: ThreadedComment[] = []
  rawComments.forEach(c => {
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

const canClose = computed(() => {
  return props.isRm && props.question.status !== 'Closed'
})

const isOverdue = computed(() => {
  if (!props.question.dueDate) return false
  return new Date(props.question.dueDate) < new Date() && props.question.status !== 'Closed'
})

const canSubmit = computed(() => {
  if (!editor.value) return false
  const text = editor.value.getText().trim()
  return text.length > 0
})

function toggleExpand() {
  expanded.value = !expanded.value
  if (expanded.value && !thread.value) {
    loadData()
  }
}

async function loadData() {
  loadingThread.value = true
  error.value = null
  try {
    const [threadData, usersData] = await Promise.all([
      props.question.threadId ? threadService.getThread(props.question.threadId) : null,
      userService.getUsers()
    ])
    thread.value = threadData
    users.value = usersData
  } catch (e: any) {
    error.value = 'Failed to load conversation'
    console.error(e)
  } finally {
    loadingThread.value = false
  }
}

async function handleSubmitComment() {
  if (!editor.value || !authStore.user || !thread.value) return
  
  const content = editor.value.getHTML()
  const text = editor.value.getText()
  
  submitting.value = true
  try {
    // Extract mentions (simple version)
    const mentions: string[] = []
    users.value.forEach(u => {
      if (text.includes(`@${u.name}`)) mentions.push(u.userId)
    })

    await threadService.addComment(
      thread.value.id,
      { message: content, mentions },
      authStore.user.userId,
      authStore.user.name,
      authStore.user.role
    )
    
    editor.value.commands.clearContent()
    await loadData() // Refresh
  } catch (e: any) {
    showError(e.message)
  } finally {
    submitting.value = false
  }
}

async function handleReply(data: { parentId: string, message: string, mentions: string[] }) {
  if (!authStore.user || !thread.value) return
  try {
    await threadService.addComment(
      thread.value.id,
      { ...data },
      authStore.user.userId,
      authStore.user.name,
      authStore.user.role
    )
    await loadData()
  } catch (e: any) {
    showError(e.message)
  }
}

async function handleDeleteComment(commentId: string) {
   if (!thread.value || !authStore.user) return
   try {
     await threadService.deleteComment(thread.value.id, commentId, authStore.user.userId)
     await loadData()
   } catch (e: any) {
     showError(e.message)
   }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'Answered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'Closed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityClass(p: string) {
  switch (p) {
    case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default: return 'bg-gray-100'
  }
}

function formatDate(d: string | Date | undefined) {
  if (!d) return ''
  return new Date(d).toLocaleDateString()
}

onBeforeUnmount(() => {
  if (editor.value) editor.value.destroy()
})
</script>
