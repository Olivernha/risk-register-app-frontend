<template>
  <div class="space-y-6">
    <!-- Quick Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div 
        v-for="stat in quickStats" 
        :key="stat.label"
        class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
      >
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stat.value }}</p>
        </div>
        <div :class="['p-3 rounded-lg', stat.colorClass]">
          <component :is="stat.icon" class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Risks Pending Publication -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Pending Publication</h3>
          <button 
            @click="$router.push('/risks?status=Draft')"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            View All
          </button>
        </div>

        <div v-if="pendingRisks.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-slate-500">
           <p>No risks pending publication.</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="risk in pendingRisks.slice(0, 5)" 
            :key="risk._id"
            class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
          >
            <div class="flex justify-between items-start">
              <h4 class="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                <a :href="`/risks/${risk._id}`" class="hover:underline">{{ risk.title }}</a>
              </h4>
              <span class="text-xs font-medium px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                {{ risk.status }}
              </span>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Owner: {{ risk.owner || 'Unassigned' }}</span>
              <span>{{ formatDate(risk.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Unanswered Questions -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Unanswered Questions</h3>
        
        <div v-if="unansweredQuestions.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-slate-500">
          <svg class="w-12 h-12 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>All questions have been answered!</p>
        </div>
        <div v-else class="space-y-3">
           <div 
            v-for="q in unansweredQuestions.slice(0, 5)" 
            :key="q.question.questionId"
            class="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 hover:shadow-sm transition-all"
          >
            <p class="text-sm text-slate-900 dark:text-slate-100 font-medium line-clamp-2">
              {{ q.question.text }}
            </p>
            <div class="mt-2 flex items-center justify-between text-xs">
              <span class="text-slate-500 dark:text-slate-400">
                Risk: {{ q.risk.title.substring(0, 20) }}...
              </span>
              <button 
                class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                @click="$router.push(`/risks/${q.risk._id}`)"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Notifications -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-6">
      <h3 class="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        System Alerts
      </h3>
      <div class="space-y-2">
        <div class="flex items-start gap-3 text-sm text-indigo-800 dark:text-indigo-200">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
          <p>Quarterly Risk Review cycle is closing in 5 days. ensuring all High risks have updated ratings.</p>
        </div>
        <div class="flex items-start gap-3 text-sm text-indigo-800 dark:text-indigo-200">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
          <p>3 new users have been added to the Risk Owners group.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

const props = defineProps<{
  pendingRisks: any[]
  unansweredQuestions: any[]
  risksReadyToLock: any[]
}>()

const quickStats = computed(() => [
  { 
    label: 'Pending Publication', 
    value: props.pendingRisks.length, 
    colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  },
  { 
    label: 'Open Questions', 
    value: props.unansweredQuestions.length,
    colorClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  },
  { 
    label: 'Ready to Lock', 
    value: props.risksReadyToLock.length,
    colorClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
    ])
  },
])

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}
</script>
