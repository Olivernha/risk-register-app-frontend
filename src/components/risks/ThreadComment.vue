<template>
  <div class="thread-comment relative text-left">
    <!-- Main Comment Container -->
    <div :class="['group p-3 -mx-3 rounded-lg transition-colors duration-200', 
      isHighlighted ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
    ]">
      <div class="flex gap-3">
        <!-- Avatar -->
        <div class="flex-shrink-0 mt-1">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-slate-800">
            {{ comment.userName?.substring(0, 2).toUpperCase() }}
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 min-w-0">
          <!-- Header -->
          <div class="flex items-center gap-x-2 gap-y-1 mb-1 flex-wrap">
            <span class="text-sm font-bold text-slate-900 dark:text-slate-100">
              {{ comment.userName }}
            </span>
            <span v-if="comment.userRole" class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600">
              {{ formatRole(comment.userRole) }}
            </span>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              &bull; {{ formatDate(comment.timestamp) }}
            </span>
            <span v-if="comment.edited" class="text-xs text-slate-400 italic">
              (edited)
            </span>
          </div>

          <!-- Message Body -->
          <div 
            class="text-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none leading-relaxed"
            v-html="formattedMessage"
          ></div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-4 mt-2">
            <button
              v-if="!isReplying && !isLocked"
              @click="startReply"
              class="text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
            
            <button
              v-if="canDelete"
              @click="$emit('delete', comment.commentId)"
              class="text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>

          <!-- Inline Reply Form -->
          <div v-if="isReplying" class="mt-4 animate-fade-in-down">
            <div class="relative">
              <div class="editor-wrapper border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-shadow">
                <EditorContent :editor="replyEditor" class="prose prose-sm dark:prose-invert max-w-none" />
              </div>
              
              <!-- Mention Suggestions -->
              <div
                v-if="showReplyMentions"
                class="absolute z-50 bottom-full left-0 mb-1 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 shadow-xl max-h-48 overflow-y-auto w-64"
              >
                <div class="px-2 py-1.5 text-xs font-medium text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  Select a user...
                </div>
                <button
                  v-for="user in mentionableUsers"
                  :key="user.userId"
                  @click="insertReplyMention(user)"
                  class="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 text-sm text-gray-900 dark:text-gray-100 flex flex-col"
                >
                  <span class="font-medium">{{ user.name }}</span>
                  <span class="text-xs text-gray-500">{{ user.email }}</span>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 mt-3">
              <button
                @click="cancelReply"
                class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="submitReply"
                :disabled="!canSubmitReply"
                class="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recursive Children -->
    <div v-if="comment.children && comment.children.length > 0" class="pl-4 sm:pl-10 relative mt-1">
      <!-- Thread Visual Line -->
      <div 
        class="absolute left-[1.1rem] sm:left-[2.75rem] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors"
      ></div>
      
      <div class="space-y-0.5">
        <ThreadComment
          v-for="child in comment.children"
          :key="child.commentId"
          :comment="child"
          :users="users"
          :current-user-id="currentUserId"
          :is-locked="isLocked"
          :depth="depth + 1"
          @delete="$emit('delete', $event)"
          @reply="$emit('reply', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify'
import type { Comment, User } from '@/types'

// Extended comment interface for tree structure
interface ThreadedComment extends Comment {
  children?: ThreadedComment[]
}

const props = defineProps<{
  comment: ThreadedComment
  users: User[]
  currentUserId: string | undefined
  isLocked: boolean
  depth: number
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'reply', data: { parentId: string, message: string, mentions: string[] }): void
}>()

const isReplying = ref(false)
const showReplyMentions = ref(false)
const currentMentionQuery = ref('')
const mentionableUsers = ref<User[]>([])

// Formatting helpers
const formatRole = (role: string) => {
  return role.replace(/([A-Z])/g, ' $1').trim()
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString()
}

const formattedMessage = computed(() => {
  let formatted = DOMPurify.sanitize(props.comment.message)
  
  // Sort users by name length (descending)
  const sortedUsers = [...props.users].sort((a, b) => b.name.length - a.name.length)
  
  sortedUsers.forEach(user => {
    const safeName = user.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`@${safeName}`, 'g')
    formatted = formatted.replace(regex, `<span class="font-medium text-blue-600 dark:text-blue-400">@${user.name}</span>`)
  })
  
  return formatted
})

const canDelete = computed(() => {
  return props.currentUserId && props.comment.userId === props.currentUserId
})

const isHighlighted = computed(() => {
  // Highlight if it's new (less than 5 seconds old) logic could go here
  return false
})

// TipTap Editor Logic for Reply
const replyEditor = useEditor({
  extensions: [StarterKit],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3 min-h-[80px]',
    },
  },
  onUpdate: ({ editor }) => {
    const content = editor.getText()
    const match = content.match(/@(\w+)$/)
    if (match) {
      currentMentionQuery.value = match[1]
      showReplyMentions.value = true
      filterMentionableUsers()
    } else {
      showReplyMentions.value = false
    }
  }
})

const canSubmitReply = computed(() => {
  if (!replyEditor.value) return false
  const content = replyEditor.value.getHTML()
  return content.trim().length > 0 && content !== '<p></p>'
})

function startReply() {
  isReplying.value = true
  // Auto-mention the person being replied to
  setTimeout(() => {
    if (replyEditor.value) {
        replyEditor.value.commands.setContent(`@${props.comment.userName} `)
        replyEditor.value.commands.focus()
    }
  }, 50)
}

function cancelReply() {
  isReplying.value = false
  if (replyEditor.value) {
    replyEditor.value.commands.clearContent()
  }
}

function submitReply() {
  if (!replyEditor.value) return
  
  const htmlContent = replyEditor.value.getHTML()
  const textContent = replyEditor.value.getText()
  
  // Extract mentions
  const mentions: string[] = []
  props.users.forEach(user => {
    if (textContent.includes(`@${user.name}`)) {
      mentions.push(user.userId)
    }
  })
  
  emit('reply', {
    parentId: props.comment.commentId,
    message: htmlContent,
    mentions
  })
  
  cancelReply()
}

function filterMentionableUsers() {
  const query = currentMentionQuery.value.toLowerCase()
  mentionableUsers.value = props.users.filter(
    u => u.active && (u.name.toLowerCase().includes(query))
  )
}

function insertReplyMention(user: User) {
  if (!replyEditor.value) return
  
  const content = replyEditor.value.getText()
  const match = content.match(/@(\w+)$/)
  
  if (match) {
    const before = content.substring(0, content.length - match[0].length)
     replyEditor.value.commands.setContent(before + `@${user.name} `)
  }
  
  showReplyMentions.value = false
}

// Cleanup
onBeforeUnmount(() => {
  if (replyEditor.value) {
    replyEditor.value.destroy()
  }
})
</script>

<style scoped>
.editor-wrapper :deep(.ProseMirror) {
  outline: none;
}
.editor-wrapper :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #9ca3af;
  content: "Write a reply...";
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
