<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</span>
        <div 
          v-if="stat.change"
          :class="[
            'text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1',
            stat.trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 
            stat.trend === 'down' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
            'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          ]"
        >
          <span v-if="stat.trend === 'up'">↑</span>
          <span v-if="stat.trend === 'down'">↓</span>
          {{ stat.change }}
        </div>
        <div v-else-if="stat.icon" class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
          <component :is="stat.icon" class="w-4 h-4" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ stat.value }}</h3>
        <span v-if="stat.subtext" class="text-xs text-slate-500 dark:text-slate-400">{{ stat.subtext }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

interface Stat {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  change?: string
  subtext?: string
  icon?: Component
}

defineProps<{
  stats: Stat[]
}>()
</script>
