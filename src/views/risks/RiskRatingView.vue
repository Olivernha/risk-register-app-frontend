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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {{ existingRating ? 'Update Risk Rating' : 'Submit Initial Rating' }}
        </h1>
        <p class="text-sm text-gray-500 flex items-center gap-2">
          <span class="font-bold text-blue-600">{{ risk?.refNo }}</span>
          <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
          {{ risk?.title }}
        </p>
      </div>
    </div>

    <!-- Authorization & Status Warnings -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="text-gray-500 animate-pulse">Fetching risk assessment data...</p>
    </div>

    <div v-else-if="!canRate" class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-8 rounded-2xl flex flex-col items-center text-center max-w-2xl mx-auto">
      <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Rating Submission Restricted</h3>
      <p class="text-amber-700 dark:text-amber-400 mb-6">{{ authorizationMessage }}</p>
      <button @click="$router.push(`/risks/${riskId}`)" class="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all">
        Return to Details
      </button>
    </div>

    <!-- Main Rating Form -->
    <div v-else-if="risk" class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Left: Form Controls -->
      <div class="xl:col-span-2 space-y-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Section 1: Inherent Assessment -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 space-y-8">
            <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 font-bold">1</div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 text-gray-900">Inherent Assessment</h3>
                <p class="text-xs text-gray-500">Rate the risk before any controls are applied</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Likelihood -->
              <div class="space-y-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Current Likelihood *</label>
                <div class="space-y-2">
                  <select
                    v-model.number="formData.currentLikelihood"
                    required
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option :value="0">Select Likelihood</option>
                    <option v-for="def in likelihoodDefs" :key="def.value" :value="def.value">
                        {{ def.value }}. {{ def.label }} ({{ def.desc }})
                    </option>
                  </select>
                  <div v-if="formData.currentLikelihood" class="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed italic">
                    {{ likelihoodDefs.find(d => d.value === formData.currentLikelihood)?.detail }}
                  </div>
                </div>
              </div>

              <!-- Impact -->
              <div class="space-y-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Current Impact *</label>
                <div class="space-y-2">
                  <select
                    v-model.number="formData.currentImpact"
                    required
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option :value="0">Select Impact</option>
                    <option v-for="def in impactDefs" :key="def.value" :value="def.value">
                        {{ def.value }}. {{ def.label }} ({{ def.desc }})
                    </option>
                  </select>
                  <div v-if="formData.currentImpact" class="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed italic">
                    {{ impactDefs.find(d => d.value === formData.currentImpact)?.detail }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Residual Assessment -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 space-y-8">
            <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600 font-bold">2</div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Residual Assessment</h3>
                <p class="text-xs text-gray-500 font-medium">Projected risk after mitigation <span class="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded ml-2 uppercase text-[10px]">Optional</span></p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Residual Likelihood</label>
                <select
                  v-model.number="formData.residualLikelihood"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option :value="0">Not Assessed</option>
                  <option v-for="def in likelihoodDefs" :key="'res-'+def.value" :value="def.value">
                    {{ def.value }}. {{ def.label }}
                  </option>
                </select>
              </div>

              <div class="space-y-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Residual Impact</label>
                <select
                  v-model.number="formData.residualImpact"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option :value="0">Not Assessed</option>
                  <option v-for="def in impactDefs" :key="'res-'+def.value" :value="def.value">
                    {{ def.value }}. {{ def.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 3: Justification -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 space-y-8">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-amber-50 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600 font-bold">3</div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Basis for Rating *</h3>
                        <p class="text-xs text-gray-500">Provide detailed justification (minimum 50 characters)</p>
                    </div>
                </div>
                <button
                    v-if="existingRating"
                    type="button"
                    @click="showBasisThread = true"
                    class="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase flex items-center gap-1"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1 9.77 9.77 0 01-6-6m12-2v3m0 4v.01" />
                    </svg>
                    Previous basis
                </button>
            </div>

            <div class="space-y-4">
                <textarea
                    v-if="!existingRating"
                    v-model="formData.basisForRating"
                    required
                    rows="8"
                    :class="[
                        'w-full px-4 py-3 border rounded-xl text-sm bg-gray-50 dark:bg-slate-900 transition-all outline-none focus:ring-2',
                        formData.basisForRating.length < 50 ? 'border-amber-300 focus:ring-amber-400' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500'
                    ]"
                    placeholder="Describe why you selected these values. Mention specific factors, historical data, or expert judgment..."
                ></textarea>
                
                <div v-else class="space-y-4">
                    <label class="block text-xs font-bold text-rose-600 uppercase tracking-wider">Reason for Update (Required for Audit) *</label>
                    <textarea 
                        v-model="formData.updateComment"
                        required
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        placeholder="What has changed since your last assessment? Why are the values being modified?"
                    ></textarea>
                </div>

                <div v-if="!existingRating" class="flex items-center justify-between">
                    <div class="h-1.5 flex-1 bg-gray-100 dark:bg-slate-700 rounded-full mr-4 overflow-hidden">
                        <div 
                            class="h-full transition-all duration-300"
                            :class="formData.basisForRating.length >= 50 ? 'bg-emerald-500' : 'bg-amber-500'"
                            :style="{ width: `${Math.min(100, (formData.basisForRating.length / 50) * 100)}%` }"
                        ></div>
                    </div>
                    <span :class="[
                        'text-[10px] font-bold uppercase tracking-widest',
                        formData.basisForRating.length >= 50 ? 'text-emerald-600' : 'text-amber-600'
                    ]">
                        {{ formData.basisForRating.length }}/50 Characters
                    </span>
                </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              @click="$router.push(`/risks/${riskId}`)"
              class="px-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting || !isFormValid"
              class="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none uppercase tracking-widest flex items-center gap-2"
            >
              <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Processing...' : (existingRating ? 'Confirm Update' : 'Submit Rating') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Right: Preview & Visuals -->
      <div class="space-y-6">
        <!-- Visual Heatmap Result -->
        <div class="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Assessment Result</h3>
            
            <div v-if="formData.currentLikelihood > 0 && formData.currentImpact > 0" class="space-y-8 fade-in">
                <div class="flex flex-col items-center py-6">
                    <div 
                        class="w-24 h-24 rounded-3xl rotate-45 flex items-center justify-center border-4 border-white/10 shadow-lg mb-8"
                        :style="{ backgroundColor: currentHeatmap?.color || '#333' }"
                    >
                        <span class="text-3xl font-black -rotate-45">{{ currentHeatmap?.riskLevel?.charAt(0) }}</span>
                    </div>
                    <div class="text-center">
                        <h4 class="text-2xl font-black uppercase tracking-tighter">{{ currentHeatmap?.riskLevel || 'Unknown' }}</h4>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Calculated Risk Level</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                    <div class="text-center border-r border-white/5">
                        <p class="text-[10px] text-gray-500 font-bold uppercase lg:mb-1">Likelihood</p>
                        <p class="text-xl font-black">{{ formData.currentLikelihood }}<span class="text-xs text-gray-500">/5</span></p>
                    </div>
                    <div class="text-center">
                        <p class="text-[10px] text-gray-500 font-bold uppercase lg:mb-1">Impact</p>
                        <p class="text-xl font-black">{{ formData.currentImpact }}<span class="text-xs text-gray-500">/5</span></p>
                    </div>
                </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <svg class="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A2 2 0 013 15.487V6a2 2 0 011.106-1.789l5.447-2.724a2 2 0 011.894 0l5.447 2.724A2 2 0 0118 6v9.487a2 2 0 01-1.106 1.789L11.447 20a2 2 0 01-1.894 0z" />
                </svg>
                <p class="text-sm font-bold uppercase">Select values to<br/>preview score</p>
            </div>
        </div>

        <!-- Definition Helpers (Fixed Sidebar) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700 pb-4">Scaling Guidelines</h3>
            
            <div class="space-y-4">
                <div class="group">
                    <p class="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-between">
                        Likelihood Scale
                        <span class="text-[10px] text-gray-400 font-normal normal-case">Probability Index</span>
                    </p>
                    <div class="space-y-1.5">
                        <div v-for="def in likelihoodDefs" :key="'guide-l-'+def.value" class="flex items-center gap-2 text-[11px]">
                            <span class="w-4 h-4 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center font-bold">{{ def.value }}</span>
                            <span class="font-semibold text-gray-700 dark:text-gray-300 w-24">{{ def.label }}</span>
                            <span class="text-gray-400">{{ def.desc }}</span>
                        </div>
                    </div>
                </div>

                <div class="group pt-4 border-t border-gray-50 dark:border-gray-700">
                    <p class="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-between">
                        Impact Scale
                        <span class="text-[10px] text-gray-400 font-normal normal-case">Severity Level</span>
                    </p>
                    <div class="space-y-1.5">
                        <div v-for="def in impactDefs" :key="'guide-i-'+def.value" class="flex items-center gap-2 text-[11px]">
                            <span class="w-4 h-4 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center font-bold">{{ def.value }}</span>
                            <span class="font-semibold text-gray-700 dark:text-gray-300 w-24">{{ def.label }}</span>
                            <span class="text-gray-400">{{ def.desc }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- History / SlideOver -->
    <SlideOver
      :is-open="showBasisThread"
      title="Rating Evolution & Basis"
      @close="showBasisThread = false"
    >
      <div v-if="risk && authStore.user" class="h-full overflow-y-auto p-4">
        <BasisThread
          :thread-id="existingRating?.basisThreadId || null"
          :rating="existingRating || null"
          :owner="currentRiskOwner"
          :risk-ref="risk.refNo"
          :version="risk.version"
          :risk-id="risk.id"
          :hide-details="false"
        />
      </div>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import { useNotifications } from '@/composables/useNotifications'
import threadService from '@/api/threads'
import SlideOver from '@/components/common/SlideOver.vue'
import BasisThread from '@/components/risks/BasisThread.vue'
import type { RiskLevel } from '@/types'

// Requirement FR-RR-001 Constants
const likelihoodDefs = [
  { value: 1, label: 'Rare', desc: '<10% probability', detail: 'The event may occur only in exceptional circumstances.' },
  { value: 2, label: 'Unlikely', desc: '10-20% probability', detail: 'The event could occur at some time but it is improbable.' },
  { value: 3, label: 'Possible', desc: '20-50% probability', detail: 'The event should occur at some time.' },
  { value: 4, label: 'Likely', desc: '50-75% probability', detail: 'The event will probably occur in most circumstances.' },
  { value: 5, label: 'Almost Certain', desc: '>75% probability', detail: 'The event is expected to occur in most circumstances.' }
]

const impactDefs = [
  { value: 1, label: 'Negligible', desc: 'Minimal financial impact', detail: 'Minimal impact on core services or financial loss <$10k.' },
  { value: 2, label: 'Minor', desc: 'Low impact, manageable', detail: 'Minor disruption to services or financial loss between $10k-$50k.' },
  { value: 3, label: 'Moderate', desc: 'Attention required', detail: 'Significant disruption to non-core services or financial loss $50k-$200k.' },
  { value: 4, label: 'Major', desc: 'Escalation needed', detail: 'Major service interruption or financial loss $200k-$1M.' },
  { value: 5, label: 'Catastrophic', desc: 'Severe impact / Level Crisis', detail: 'Complete failure of essential services or financial loss >$1M.' }
]

// Fallback matrix for instant calculation if API fails
const fallbackMatrix: Record<string, { level: RiskLevel, color: string }> = {
  '1-1': { level: 'Low', color: '#22c55e' }, '1-2': { level: 'Low', color: '#22c55e' }, '1-3': { level: 'Low', color: '#22c55e' }, '1-4': { level: 'Medium', color: '#eab308' }, '1-5': { level: 'Medium', color: '#eab308' },
  '2-1': { level: 'Low', color: '#22c55e' }, '2-2': { level: 'Low', color: '#22c55e' }, '2-3': { level: 'Medium', color: '#eab308' }, '2-4': { level: 'Medium', color: '#eab308' }, '2-5': { level: 'High', color: '#f97316' },
  '3-1': { level: 'Low', color: '#22c55e' }, '3-2': { level: 'Medium', color: '#eab308' }, '3-3': { level: 'Medium', color: '#eab308' }, '3-4': { level: 'High', color: '#f97316' }, '3-5': { level: 'High', color: '#f97316' },
  '4-1': { level: 'Medium', color: '#eab308' }, '4-2': { level: 'Medium', color: '#eab308' }, '4-3': { level: 'High', color: '#f97316' }, '4-4': { level: 'High', color: '#f97316' }, '4-5': { level: 'Very High', color: '#ef4444' },
  '5-1': { level: 'Medium', color: '#eab308' }, '5-2': { level: 'High', color: '#f97316' }, '5-3': { level: 'High', color: '#f97316' }, '5-4': { level: 'Very High', color: '#ef4444' }, '5-5': { level: 'Very High', color: '#ef4444' }
}

import heatmapService from '@/api/heatmap'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const riskStore = useRiskStore()
const { showSuccess, showError } = useNotifications()

const riskId = route.params.id as string
const risk = computed(() => riskStore.getRiskById(riskId))
const heatmap = ref<any[]>([])

const loading = ref(true)
const submitting = ref(false)
const showBasisThread = ref(false)
const error = ref('')

const formData = ref({
  currentLikelihood: 0,
  currentImpact: 0,
  basisForRating: '',
  residualLikelihood: 0,
  residualImpact: 0,
  updateComment: ''
})

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
        riskStore.fetchRiskById(riskId),
        fetchHeatmap()
    ])
    
    if (existingRating.value) {
      formData.value = {
        currentLikelihood: existingRating.value.currentLikelihood,
        currentImpact: existingRating.value.currentImpact,
        basisForRating: '', 
        residualLikelihood: existingRating.value.residualLikelihood || 0,
        residualImpact: existingRating.value.residualImpact || 0,
        updateComment: ''
      }
    }
  } catch (e: any) {
    error.value = 'Failed to load risk details'
  } finally {
    loading.value = false
  }
})

async function fetchHeatmap() {
    try {
        heatmap.value = await heatmapService.getHeatmapLookup()
    } catch (e) {
        console.error('Failed to load heatmap lookup', e)
    }
}

const currentHeatmap = computed(() => {
    if (!formData.value.currentLikelihood || !formData.value.currentImpact) return null
    
    const apiMatch = heatmap.value.find(h => h.likelihood === formData.value.currentLikelihood && h.impact === formData.value.currentImpact)
    if (apiMatch) return apiMatch

    const key = `${formData.value.currentLikelihood}-${formData.value.currentImpact}`
    const fallback = fallbackMatrix[key]
    return fallback ? { riskLevel: fallback.level, color: fallback.color } : null
})

const existingRating = computed(() => {
  if (!risk.value || !authStore.user) return null
  return risk.value.ratings.find((r: any) => r.ownerId === authStore.user?.userId)
})

const canRate = computed(() => {
  if (!risk.value || !authStore.user) return false
  
  // Validation: Risk must be in "Published" status
  if (risk.value.status !== 'Published') return false
  
  // Validation: User must be assigned as owner
  const isOwner = risk.value.owners.some((o: any) => o.userId === authStore.user?.userId)
  return isOwner
})

const currentRiskOwner = computed(() => {
  if (!risk.value || !authStore.user) return null
  return risk.value.owners.find((o: any) => o.userId === authStore.user?.userId) || null
})

const authorizationMessage = computed(() => {
  if (!risk.value) return 'Risk document not found'
  if (risk.value.status !== 'Published' && risk.value.status !== 'Locked') return 'This risk is not in Published status. Ratings can only be submitted for Published risks.'
  if (risk.value.status === 'Locked') return 'FR-RR-002: This risk is currently Locked and cannot be modified.'
  if (!authStore.user) return 'Session expired. Please log in.'
  return 'Access Denied: You must be an assigned Risk Owner to submit or update an assessment for this specific risk.'
})

const isFormValid = computed(() => {
  const baseValid = formData.value.currentLikelihood > 0 &&
                  formData.value.currentImpact > 0
  
  if (existingRating.value) {
    // FR-RR-002: Must provide reason in new comment
    return baseValid && formData.value.updateComment.trim().length > 0
  }
  // FR-RR-001: Basis for rating required (min 50 chars)
  return baseValid && formData.value.basisForRating.trim().length >= 50
})

async function handleSubmit() {
  if (!risk.value || !authStore.user) return
  
  // Final safeguard: FR-RR-002: Cannot edit if risk is "Locked"
  if (risk.value.status === 'Locked') {
      showError('Assessment is locked and cannot be updated.')
      return
  }

  error.value = ''
  submitting.value = true

  try {
    let threadId = existingRating.value?.basisThreadId
    
    // Logic: Create new thread or append to existing
    if (!threadId) {
      const newThread = await threadService.createThread({
        entityType: 'rating_basis',
        entityId: `${riskId}-${authStore.user.userId}`,
        riskRef: risk.value.refNo,
        version: risk.value.version,
      })
      threadId = newThread.id
      
      // Initial Basis Comment
      await threadService.addComment(
        threadId,
        { message: formData.value.basisForRating, mentions: [] },
        authStore.user.userId,
        authStore.user.name,
        authStore.user.role
      )
    } else if (formData.value.updateComment.trim()) {
      // Append Update Reason
      await threadService.addComment(
        threadId,
        { message: `[Rating Update] ${formData.value.updateComment}`, mentions: [] },
        authStore.user.userId,
        authStore.user.name,
        authStore.user.role
      )
    }

    const ratingData = {
      ownerId: authStore.user.userId,
      currentLikelihood: formData.value.currentLikelihood,
      currentImpact: formData.value.currentImpact,
      residualLikelihood: formData.value.residualLikelihood || undefined,
      residualImpact: formData.value.residualImpact || undefined,
      basisThreadId: threadId,
      submittedAt: existingRating.value?.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: existingRating.value ? [...(existingRating.value.history || [])] : []
    }

    // FR-RR-002: Previous values saved to history array
    if (existingRating.value) {
      ratingData.history.push({
        likelihood: existingRating.value.currentLikelihood,
        impact: existingRating.value.currentImpact,
        changedAt: new Date(),
        reason: formData.value.updateComment
      })
    }

    const updatedRatings = risk.value.ratings?.map((r: any) => 
        r.ownerId === authStore.user?.userId ? ratingData : r
    ) || [ratingData]

    // Business Logic: Recalculate average immediately using matrix lookup
    const averageRating = calculateRecalculatedAverage(updatedRatings)

    await riskStore.updateRisk(riskId, {
      ratings: updatedRatings,
      averageRating: averageRating,
      audit: {
          ...risk.value.audit,
          updatedAt: new Date().toISOString(),
          updatedBy: authStore.user.name
      }
    })

    // Mock Business Notifications
    console.log(`[FR-RR-001/002 Notification] RM notified of assessment from ${authStore.user.name}`)
    const allSubmitted = risk.value.owners.every(owner => 
        updatedRatings.some(r => r.ownerId === owner.userId && r.submittedAt)
    )
    if (allSubmitted) {
        console.log(`[Consolidation Notification] RM notified: All owners have submitted ratings for ${risk.value.refNo}`)
    }

    showSuccess(existingRating.value ? 'Assessment updated successfully' : 'Rating submitted successfully')
    router.push(`/risks/${riskId}`)
  } catch (e: any) {
    showError(e.message || 'Failed to process rating')
  } finally {
    submitting.value = false
  }
}

function calculateRecalculatedAverage(ratings: any[]) {
  const submittedRatings = ratings.filter(r => r.currentLikelihood > 0 && r.currentImpact > 0)
  if (submittedRatings.length === 0) return undefined

  const avgL = Math.round(submittedRatings.reduce((sum, r) => sum + r.currentLikelihood, 0) / submittedRatings.length)
  const avgI = Math.round(submittedRatings.reduce((sum, r) => sum + r.currentImpact, 0) / submittedRatings.length)

  // Lookup risk level and color
  const apiMatch = heatmap.value.find(h => h.likelihood === avgL && h.impact === avgI)
  const fallback = fallbackMatrix[`${avgL}-${avgI}`]
  
  return {
    likelihood: avgL,
    impact: avgI,
    riskLevel: apiMatch?.riskLevel || fallback?.level || 'Medium',
    color: apiMatch?.color || fallback?.color || '#eab308'
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 4px solid #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Hide scrollbar but keep functionality */
.h-full::-webkit-scrollbar {
  display: none;
}
.h-full {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
