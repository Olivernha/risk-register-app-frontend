<template>
  <div class="space-y-8 fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1">Risk Heatmap</h1>
        <div class="flex items-center gap-2">
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">5×5 Strategic Risk Matrix</p>
            <span class="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
            <span class="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold uppercase tracking-wider">{{ activeRisks.length }} Active Risks</span>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <button 
            @click="viewType = 'Current'"
            :class="[
                'px-5 py-2 text-sm font-bold rounded-xl transition-all',
                viewType === 'Current' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
        >
            Current
        </button>
        <button 
            @click="viewType = 'Residual'"
            :class="[
                'px-5 py-2 text-sm font-bold rounded-xl transition-all',
                viewType === 'Residual' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
        >
            Residual
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Heat Map Card (Main Canvas) -->
      <div class="lg:col-span-3 bg-white dark:bg-slate-900/50 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden relative">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Y-axis Title -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600">Probability / Likelihood</span>
        </div>

        <div class="ml-10">
          <!-- Grid Container -->
          <div class="relative">
            <!-- Y-axis Numbers -->
            <div class="absolute -left-8 top-0 bottom-12 flex flex-col justify-between py-6">
                <span v-for="n in rows" :key="n" class="text-xs font-bold text-gray-400">{{ n }}</span>
            </div>

            <!-- Main Matrix -->
            <div class="grid grid-cols-1 gap-2 mb-6">
                <div v-for="row in rows" :key="row" class="grid grid-cols-5 gap-2">
                    <div v-for="col in cols" :key="col" 
                        class="aspect-[4/3] sm:aspect-square rounded-xl border-2 p-2 transition-all relative group overflow-hidden shadow-sm"
                        :style="{ 
                            backgroundColor: getHeatmapCell(row, col) ? getHeatmapCell(row, col).color + '25' : '#f9fafb',
                            borderColor: getHeatmapCell(row, col) ? getHeatmapCell(row, col).color + '40' : '#f3f4f6'
                        }"
                    >
                        <!-- Cell Background Glow (Always visible now, stronger on hover) -->
                        <div class="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            :style="{ background: `linear-gradient(135deg, ${getHeatmapCell(row, col)?.color}15 0%, transparent 100%)` }"
                        ></div>

                        <!-- Cell Level Label (Subtle background text) -->
                        <div class="absolute bottom-1 right-2 pointer-events-none opacity-[0.15] dark:opacity-[0.05]">
                             <span class="text-[10px] font-black uppercase tracking-tighter" :style="{ color: getHeatmapCell(row, col)?.color }">
                                {{ getHeatmapCell(row, col)?.riskLevel }}
                             </span>
                        </div>

                        <!-- Risks Container -->
                        <div class="flex flex-wrap gap-2 content-start h-full relative z-10">
                            <div v-for="risk in getRisksForCell(row, col)" :key="risk.id"
                                class="min-w-[40px] h-8 px-2 flex items-center justify-center text-[11px] font-black text-white rounded-xl shadow-lg border border-white/20 cursor-pointer transition-all hover:scale-110 hover:brightness-110 active:scale-95"
                                :style="{ 
                                    backgroundColor: getHeatmapCell(row, col)?.color,
                                    boxShadow: `0 4px 12px ${getHeatmapCell(row, col)?.color}40`
                                }"
                                :title="risk.title"
                                @click="$router.push(`/risks/${risk.id}`)"
                            >
                                {{ risk.refNo }}
                            </div>
                        </div>

                        <!-- Empty Indicator -->
                        <div v-if="getRisksForCell(row, col).length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span class="text-[10px] text-gray-200 dark:text-gray-800 font-bold uppercase tracking-tighter">{{ row }}×{{ col }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- X-axis Labels -->
            <div class="grid grid-cols-5 gap-3">
                <div v-for="(label, idx) in ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic']" :key="label" class="text-center">
                    <span class="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider block">{{ idx + 1 }}</span>
                    <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400 hidden sm:block">{{ label }}</span>
                </div>
            </div>

            <!-- X-axis Title -->
            <div class="mt-8 text-center">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600">Severity / Impact</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend & Info Sidebar -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 class="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em] mb-6">Risk Levels</h3>
            <div class="space-y-4">
                <div class="flex items-center gap-4 group">
                    <div class="w-10 h-10 rounded-2xl bg-[#E91E63]/10 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-md bg-[#E91E63] shadow-[0_0_12px_#E91E6360]"></div>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-gray-100">Very High</p>
                        <p class="text-[10px] text-gray-500 uppercase font-black tracking-tight">Immediate Action</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 group">
                    <div class="w-10 h-10 rounded-2xl bg-[#f97316]/10 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-md bg-[#f97316] shadow-[0_0_12px_#f9731660]"></div>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-gray-100">High</p>
                        <p class="text-[10px] text-gray-500 uppercase font-black tracking-tight">Active Mitigation</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 group">
                    <div class="w-10 h-10 rounded-2xl bg-[#eab308]/10 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-md bg-[#eab308] shadow-[0_0_12px_#eab30860]"></div>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-gray-100">Medium</p>
                        <p class="text-[10px] text-gray-500 uppercase font-black tracking-tight">Ongoing Monitoring</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 group">
                    <div class="w-10 h-10 rounded-2xl bg-[#22c55e]/10 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-md bg-[#22c55e] shadow-[0_0_12px_#22c55e60]"></div>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-gray-100">Low</p>
                        <p class="text-[10px] text-gray-500 uppercase font-black tracking-tight">Periodic Review</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 group pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-gray-100 text-gray-400">Not Rated</p>
                        <p class="text-[10px] text-gray-500 uppercase font-black tracking-tight">Pending Input</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-blue-600 rounded-3xl p-6 text-white overflow-hidden relative group">
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 class="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Quick Tip</h4>
            <p class="text-xs leading-relaxed font-medium">Click on any risk badge within the matrix to view its full details and current assessment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRiskStore } from '@/stores/riskStore'
import { storeToRefs } from 'pinia'
import type { Risk } from '@/types'

import heatmapService from '@/api/heatmap'

const riskStore = useRiskStore()
const { risks } = storeToRefs(riskStore)
const heatmap = ref<any[]>([])
const viewType = ref<'Current' | 'Residual'>('Current')

// Filtered risks: only show Published or Locked risks in heatmap
const activeRisks = computed(() => {
    return risks.value.filter(r => r.status === 'Published' || r.status === 'Locked')
})

onMounted(() => {
  riskStore.fetchRisks()
  fetchHeatmap()
})

async function fetchHeatmap() {
    try {
        heatmap.value = await heatmapService.getHeatmapLookup()
    } catch (e) {
        console.error('Failed to load heatmap lookup', e)
    }
}

// Grid configuration
const rows = [5, 4, 3, 2, 1] // Likelihood (High to Low)
const cols = [1, 2, 3, 4, 5] // Impact (Low to High)

// Helper to get heatmap cell config
const getHeatmapCell = (likelihood: number, impact: number) => {
    return heatmap.value.find(h => h.likelihood === likelihood && h.impact === impact)
}

// Helper to get risks for a specific cell
const getRisksForCell = (likelihood: number, impact: number) => {
  return activeRisks.value.filter((risk: Risk) => {
    if (viewType.value === 'Current') {
        return (risk.averageRating?.likelihood === likelihood) && 
               (risk.averageRating?.impact === impact)
    } else {
        // For residual, we might need to calculate the average residual rating
        // or just use the first one for individual owners? 
        // Typically averageRating object only stores Current.
        // Let's assume for now we only support Current until we have averageResidualRating.
        return false 
    }
  })
}
</script>
