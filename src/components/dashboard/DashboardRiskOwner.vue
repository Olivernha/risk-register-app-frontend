<template>
  <div class="space-y-6">
    <!-- Section: Risks Awaiting Rating -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-rose-500"></span>
          Risks Awaiting My Rating
        </h3>
        <span class="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
          {{ pendingRatings.length }} Pending
        </span>
      </div>
      
      <div v-if="loadingRatings" class="py-8 text-center text-slate-500">
        Loading...
      </div>
      <div v-else-if="pendingRatings.length === 0" class="py-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
        No risks currently await your rating.
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="item in pendingRatings" 
          :key="item.risk._id"
          class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
        >
          <div>
            <h4 class="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ item.risk.title }}
            </h4>
            <div class="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span v-if="item.risk.dueDate" :class="isOverdue(item.risk.dueDate) ? 'text-rose-600 dark:text-rose-400 font-medium' : ''">
                Due: {{ formatDate(item.risk.dueDate) }}
              </span>
              <span>ID: #{{ item.risk.riskId || item.risk._id.substring(0,6) }}</span>
            </div>
          </div>
          <button 
            @click="$router.push(`/risks/${item.risk._id}`)"
            class="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            Rate Now
          </button>
        </div>
      </div>
    </div>

    <!-- Grid for Questions and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Ad-hoc Questions -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Assigned Questions
        </h3>
        <div class="space-y-3">
          <div v-if="assignedQuestions.length === 0" class="text-sm text-slate-500">
            No pending questions.
          </div>
          <div 
            v-for="q in assignedQuestions" 
            :key="q.question.questionId"
            class="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700/50"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                Pending Reply
              </span>
              <span class="text-xs text-slate-400">{{ formatDate(q.question.createdAt) }}</span>
            </div>
            <p class="text-sm text-slate-800 dark:text-slate-200 line-clamp-2 mt-2">
              {{ q.question.text }}
            </p>
             <button 
                @click="$router.push(`/risks/${q.risk._id}`)"
                class="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
              View Risk
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Submissions (Mocked for now as per requirements) -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
         <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Recent Activity on My Risks
        </h3>
        <div class="space-y-4">
           <!-- Mock data -->
           <div class="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
              <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                JM
              </div>
              <div>
                <p class="text-sm text-slate-700 dark:text-slate-300">
                  <span class="font-medium text-slate-900 dark:text-slate-100">John Miller</span> submitted a rating for risk <span class="font-medium">Cyber Security Threat</span>
                </p>
                <p class="text-xs text-slate-500 mt-0.5">2 hours ago</p>
              </div>
           </div>
           <div class="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
              <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold">
                AS
              </div>
              <div>
                <p class="text-sm text-slate-700 dark:text-slate-300">
                  <span class="font-medium text-slate-900 dark:text-slate-100">Alice Smith</span> commented on <span class="font-medium">Supply Chain Delay</span>
                </p>
                <p class="text-xs text-slate-500 mt-0.5">5 hours ago</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  pendingRatings: any[]
  assignedQuestions: any[]
  loadingRatings: boolean
}>()

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const isOverdue = (date: string) => {
  return new Date(date) < new Date()
}
</script>
