<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <button
          @click="$router.push(`/risks/${riskId}`)"
          class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Risk Details
        </button>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Submit Risk Rating</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ risk?.refNo }} - {{ risk?.title }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading risk...</span>
    </div>

    <!-- Not Authorized -->
    <div v-else-if="!canRate" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Cannot Submit Rating</h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            {{ authorizationMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Rating Form -->
    <div v-else-if="risk" class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Existing Rating Notice -->
        <div v-if="existingRating" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p class="text-sm text-blue-700 dark:text-blue-300">
            You have already submitted a rating for this risk. Submitting again will update your previous rating.
          </p>
        </div>

        <!-- Current Assessment Section -->
        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Current Risk Assessment</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Current Likelihood -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Likelihood <span class="text-red-500">*</span>
              </label>
              <select
                v-model.number="formData.currentLikelihood"
                required
                class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="0">Select likelihood...</option>
                <option :value="1">1 - Rare (&lt;10% probability)</option>
                <option :value="2">2 - Unlikely (10-20% probability)</option>
                <option :value="3">3 - Possible (20-50% probability)</option>
                <option :value="4">4 - Likely (50-75% probability)</option>
                <option :value="5">5 - Almost Certain (&gt;75% probability)</option>
              </select>
            </div>

            <!-- Current Impact -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Impact <span class="text-red-500">*</span>
              </label>
              <select
                v-model.number="formData.currentImpact"
                required
                class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="0">Select impact...</option>
                <option :value="1">1 - Negligible (Minimal impact)</option>
                <option :value="2">2 - Minor (Low impact, manageable)</option>
                <option :value="3">3 - Moderate (Attention required)</option>
                <option :value="4">4 - Major (Escalation needed)</option>
                <option :value="5">5 - Catastrophic (Crisis level)</option>
              </select>
            </div>
          </div>

          <!-- Risk Level Preview -->
          <div v-if="formData.currentLikelihood && formData.currentImpact" class="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Calculated Risk Level:</span>
              <span :class="[
                'inline-block px-3 py-1 text-sm font-medium rounded',
                getRiskLevelClass(calculatedRiskLevel)
              ]">
                {{ calculatedRiskLevel }}
              </span>
            </div>
          </div>
        </div>

        <!-- Basis for Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Basis for Rating <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.basisForRating"
            required
            rows="6"
            minlength="50"
            placeholder="Provide detailed justification for your rating (minimum 50 characters)..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ formData.basisForRating.length }} / 50 characters minimum
          </p>
        </div>

        <!-- Residual Assessment Section (Optional) -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Residual Risk Assessment (Optional)</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If mitigations are in place, assess the residual risk after controls.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Residual Likelihood -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Residual Likelihood
              </label>
              <select
                v-model.number="formData.residualLikelihood"
                class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="0">Not assessed</option>
                <option :value="1">1 - Rare (&lt;10% probability)</option>
                <option :value="2">2 - Unlikely (10-20% probability)</option>
                <option :value="3">3 - Possible (20-50% probability)</option>
                <option :value="4">4 - Likely (50-75% probability)</option>
                <option :value="5">5 - Almost Certain (&gt;75% probability)</option>
              </select>
            </div>

            <!-- Residual Impact -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Residual Impact
              </label>
              <select
                v-model.number="formData.residualImpact"
                class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="0">Not assessed</option>
                <option :value="1">1 - Negligible (Minimal impact)</option>
                <option :value="2">2 - Minor (Low impact, manageable)</option>
                <option :value="3">3 - Moderate (Attention required)</option>
                <option :value="4">4 - Major (Escalation needed)</option>
                <option :value="5">5 - Catastrophic (Crisis level)</option>
              </select>
            </div>
          </div>

          <!-- Residual Risk Level Preview -->
          <div v-if="formData.residualLikelihood && formData.residualImpact" class="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Calculated Residual Risk Level:</span>
              <span :class="[
                'inline-block px-3 py-1 text-sm font-medium rounded',
                getRiskLevelClass(calculatedResidualRiskLevel)
              ]">
                {{ calculatedResidualRiskLevel }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$router.push(`/risks/${riskId}`)"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Submitting...' : 'Submit Rating' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import type { RiskLevel } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const riskStore = useRiskStore()

const riskId = route.params.id as string
const risk = computed(() => riskStore.getRiskById(riskId))
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const formData = ref({
  currentLikelihood: 0,
  currentImpact: 0,
  basisForRating: '',
  residualLikelihood: 0,
  residualImpact: 0
})

// Risk level matrix (5x5)
const riskMatrix: Record<string, RiskLevel> = {
  '1-1': 'Low', '1-2': 'Low', '1-3': 'Medium', '1-4': 'High', '1-5': 'High',
  '2-1': 'Low', '2-2': 'Low', '2-3': 'Medium', '2-4': 'High', '2-5': 'Very High',
  '3-1': 'Medium', '3-2': 'Medium', '3-3': 'Medium', '3-4': 'High', '3-5': 'Very High',
  '4-1': 'High', '4-2': 'High', '4-3': 'High', '4-4': 'Very High', '4-5': 'Very High',
  '5-1': 'High', '5-2': 'High', '5-3': 'Very High', '5-4': 'Very High', '5-5': 'Very High'
}

onMounted(async () => {
  loading.value = true
  try {
    await riskStore.fetchRiskById(riskId)
    
    // Pre-fill if existing rating
    if (existingRating.value) {
      formData.value = {
        currentLikelihood: existingRating.value.currentLikelihood,
        currentImpact: existingRating.value.currentImpact,
        basisForRating: '', // Don't pre-fill basis, require new justification
        residualLikelihood: existingRating.value.residualLikelihood || 0,
        residualImpact: existingRating.value.residualImpact || 0
      }
    }
  } catch (e: any) {
    error.value = 'Failed to load risk details'
  } finally {
    loading.value = false
  }
})

const existingRating = computed(() => {
  if (!risk.value || !authStore.user) return null
  return risk.value.ratings.find((r: any) => r.ownerId === authStore.user?.userId)
})

const canRate = computed(() => {
  if (!risk.value || !authStore.user) return false
  
  // Must be Published
  if (risk.value.status !== 'Published') return false
  
  // Must be assigned as owner
  const isOwner = risk.value.owners.some((o: any) => o.userId === authStore.user?.userId)
  return isOwner
})

const authorizationMessage = computed(() => {
  if (!risk.value) return 'Risk not found'
  if (risk.value.status !== 'Published') return 'Risk must be in Published status to submit ratings'
  if (!authStore.user) return 'You must be logged in'
  return 'You must be assigned as a risk owner to submit a rating'
})

const calculatedRiskLevel = computed(() => {
  if (!formData.value.currentLikelihood || !formData.value.currentImpact) return ''
  const key = `${formData.value.currentLikelihood}-${formData.value.currentImpact}`
  return riskMatrix[key] || ''
})

const calculatedResidualRiskLevel = computed(() => {
  if (!formData.value.residualLikelihood || !formData.value.residualImpact) return ''
  const key = `${formData.value.residualLikelihood}-${formData.value.residualImpact}`
  return riskMatrix[key] || ''
})

const isFormValid = computed(() => {
  return formData.value.currentLikelihood > 0 &&
         formData.value.currentImpact > 0 &&
         formData.value.basisForRating.length >= 50
})

async function handleSubmit() {
  if (!risk.value || !authStore.user) return
  
  error.value = ''
  submitting.value = true

  try {
    const ratingData = {
      ownerId: authStore.user.userId,
      currentLikelihood: formData.value.currentLikelihood,
      currentImpact: formData.value.currentImpact,
      residualLikelihood: formData.value.residualLikelihood || undefined,
      residualImpact: formData.value.residualImpact || undefined,
      basisThreadId: existingRating.value?.basisThreadId || `thread-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: existingRating.value?.history || []
    }

    // Add to history if updating
    if (existingRating.value) {
      ratingData.history.push({
        likelihood: existingRating.value.currentLikelihood,
        impact: existingRating.value.currentImpact,
        changedAt: new Date().toISOString(),
        reason: 'Updated rating'
      })
    }

    // Update or add rating
    const updatedRatings = existingRating.value
      ? risk.value.ratings.map((r: any) => r.ownerId === authStore.user?.userId ? ratingData : r)
      : [...risk.value.ratings, ratingData]

    // Calculate average rating
    const averageRating = calculateAverageRating(updatedRatings)

    // Update risk
    await riskStore.updateRisk(riskId, {
      ratings: updatedRatings,
      averageRating: averageRating
    })

    // TODO: Create/append to basis thread
    // TODO: Notify RM

    alert('Rating submitted successfully!')
    router.push(`/risks/${riskId}`)
  } catch (e: any) {
    error.value = e.message || 'Failed to submit rating'
  } finally {
    submitting.value = false
  }
}

function calculateAverageRating(ratings: any[]) {
  if (ratings.length === 0) return null

  const validRatings = ratings.filter((r: any) => r.submittedAt)
  if (validRatings.length === 0) return null

  const avgLikelihood = validRatings.reduce((sum: number, r: any) => sum + r.currentLikelihood, 0) / validRatings.length
  const avgImpact = validRatings.reduce((sum: number, r: any) => sum + r.currentImpact, 0) / validRatings.length

  const roundedLikelihood = Math.round(avgLikelihood)
  const roundedImpact = Math.round(avgImpact)

  const key = `${roundedLikelihood}-${roundedImpact}`
  const riskLevel = riskMatrix[key] || 'Medium'

  const colorMap: Record<RiskLevel, string> = {
    'Low': '#22c55e',
    'Medium': '#eab308',
    'High': '#f97316',
    'Very High': '#ef4444'
  }

  return {
    likelihood: roundedLikelihood,
    impact: roundedImpact,
    riskLevel: riskLevel,
    color: colorMap[riskLevel]
  }
}

function getRiskLevelClass(level: string) {
  switch (level) {
    case 'Very High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}
</script>
