<template>
  <div class="space-y-6">
    <!-- Overdue Items - High Priority -->
    <div v-if="overdueItems.length > 0" class="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6">
      <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Overdue Action Items
      </h3>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="item in overdueItems" 
          :key="item.mitigation.controlId"
          class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-red-200 dark:border-red-800 shadow-sm"
        >
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
              OVERDUE
            </span>
             <span class="text-xs text-slate-500">{{ formatDate(item.mitigation.deadline) }}</span>
          </div>
          <h4 class="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">{{ item.mitigation.description }}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">Risk: {{ item.risk.title }}</p>
          <button 
             @click="$router.push(`/risks/${item.risk._id}`)"
             class="w-full py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Deadlines (Next 7 Days) -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Upcoming Deadlines</h3>
          <span class="text-xs text-slate-500">Next 7 Days</span>
        </div>
        
        <div v-if="upcomingItems.length === 0" class="text-center py-6 text-slate-500">
          No upcoming deadlines in the next 7 days.
        </div>
        <div v-else class="space-y-3">
           <div 
            v-for="item in upcomingItems" 
            :key="item.mitigation.controlId"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex flex-col items-center justify-center text-orange-700 dark:text-orange-400">
              <span class="text-xs font-bold">{{ getDay(item.mitigation.deadline) }}</span>
              <span class="text-[10px] uppercase">{{ getMonth(item.mitigation.deadline) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ item.mitigation.description }}</p>
              <p class="text-xs text-slate-500 truncate">{{ item.risk.title }}</p>
            </div>
            <div class="flex-shrink-0">
               <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(item.mitigation.status)]">
                 {{ item.mitigation.status }}
               </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Assigned Mitigations Summary -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">My Mitigations</h3>
        <div class="space-y-4">
          <div v-for="status in ['Proposed', 'Ongoing', 'Completed']" :key="status">
             <div class="flex items-center justify-between text-sm mb-1">
               <span class="text-slate-600 dark:text-slate-400">{{ status }}</span>
               <span class="font-medium text-slate-900 dark:text-slate-100">{{ getCountByStatus(status) }}</span>
             </div>
             <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
               <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="{
                    'bg-blue-500': status === 'Proposed',
                    'bg-amber-500': status === 'Ongoing',
                    'bg-emerald-500': status === 'Completed'
                  }"
                  :style="{ width: `${getTotalCount() > 0 ? (getCountByStatus(status) / getTotalCount()) * 100 : 0}%` }"
               ></div>
             </div>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
           <button 
              class="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              @click="$router.push('/risks')"
            >
             View All Assigned Risks
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  myMitigations: any[]
  overdueItems: any[]
}>()

const upcomingItems = computed(() => {
  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)
  
  return props.myMitigations.filter(m => {
    if (!m.mitigation.deadline) return false
    const d = new Date(m.mitigation.deadline)
    return d >= today && d <= nextWeek && m.mitigation.status !== 'Completed'
  }).sort((a, b) => new Date(a.mitigation.deadline).getTime() - new Date(b.mitigation.deadline).getTime())
})

const getCountByStatus = (status: string) => {
  return props.myMitigations.filter(m => m.mitigation.status === status).length
}

const getTotalCount = () => props.myMitigations.length

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const getDay = (date: string) => {
  if (!date) return ''
  return new Date(date).getDate()
}

const getMonth = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('default', { month: 'short' })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    case 'Ongoing': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
  }
}
</script>
