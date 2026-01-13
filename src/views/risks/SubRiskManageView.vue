<template>
  <div class="space-y-6 fade-in p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <button
          @click="$router.push(`/risks/${riskId}`)"
          class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Risk Details
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Sub-risks</h1>
        <p v-if="risk" class="text-sm text-gray-500 mt-1">Structure and organization for: <span class="font-semibold text-blue-600">{{ risk.refNo }} - {{ risk.title }}</span></p>
      </div>

      <div class="flex gap-3">
          <button 
            @click="handleSave"
            :disabled="submitting || !hasChanges"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Saving Changes...' : 'Save Structure' }}
          </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="risk" class="space-y-6">
      <!-- Info Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3 text-blue-800 dark:text-blue-300">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm">
          <p class="font-bold mb-1">Structural Management Mode</p>
          <p class="opacity-80">Use this page to add, remove, or reorder sub-risks. To update progress or implementation comments, use the "Update Progress" button on the individual sub-risk pages.</p>
        </div>
      </div>

      <!-- Sub-risk Manager Component -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <SubRiskManager 
          v-model="localSubRisks"
          :primary-ref-no="risk.refNo"
        />
      </div>

      <!-- Confirmation Footer -->
      <div v-if="hasChanges" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 border-2 border-white dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {{ localSubRisks.length }}
                  </div>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">Total sub-risks in new structure</span>
          </div>
          <button 
            @click="localSubRisks = risk?.subRisks ? JSON.parse(JSON.stringify(risk.subRisks)) : []"
            class="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Discard Changes
          </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRiskStore } from '@/stores/riskStore'
import { useNotifications } from '@/composables/useNotifications'
import SubRiskManager from '@/components/risks/SubRiskManager.vue'
import type { Risk, SubRisk } from '@/types'

const route = useRoute()
const router = useRouter()
const riskStore = useRiskStore()
const { showSuccess, showError } = useNotifications()

const loading = ref(true)
const submitting = ref(false)
const riskId = computed(() => route.params.id as string)

const risk = computed<Risk | undefined>(() => riskStore.getRiskById(riskId.value))
const localSubRisks = ref<SubRisk[]>([])

const hasChanges = computed(() => {
    return JSON.stringify(localSubRisks.value) !== JSON.stringify(risk.value?.subRisks || [])
})

onMounted(async () => {
  loading.value = true
  if (!risk.value) {
    await riskStore.fetchRiskById(riskId.value)
  }
  
  if (risk.value) {
    // Deep copy to local state for manipulation
    localSubRisks.value = JSON.parse(JSON.stringify(risk.value.subRisks || []))
  }
  loading.value = false
})

async function handleSave() {
  if (!risk.value) return
  
  submitting.value = true
  try {
    // Audit check: If any sub-risks were removed, they are gone from the list.
    // In a real system, the backend would handle the "isDeleted" flag if required for soft-deletes.
    
    await riskStore.updateRisk(risk.value.id, { 
      subRisks: localSubRisks.value,
      audit: {
          ...risk.value.audit,
          updatedAt: new Date(),
          updatedBy: 'Current User'
      }
    })
    
    showSuccess('Risk structure updated successfully')
    router.push(`/risks/${risk.value.id}`)
  } catch (e: any) {
    showError(e.message || 'Failed to update structure')
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
