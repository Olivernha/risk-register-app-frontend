<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {{ isUpdate ? 'Update Rating' : 'Submit Rating' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Current Likelihood and Impact -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Likelihood -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Likelihood <span class="text-red-500">*</span>
          </label>
          <select
            v-model.number="form.currentLikelihood"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          >
            <option :value="null" disabled>Select likelihood</option>
            <option v-for="i in 5" :key="i" :value="i">
              {{ i }} - {{ getLikelihoodLabel(i) }}
            </option>
          </select>
          <p v-if="form.currentLikelihood" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ getLikelihoodDefinition(form.currentLikelihood) }}
          </p>
        </div>

        <!-- Impact -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Impact <span class="text-red-500">*</span>
          </label>
          <select
            v-model.number="form.currentImpact"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          >
            <option :value="null" disabled>Select impact</option>
            <option v-for="i in 5" :key="i" :value="i">
              {{ i }} - {{ getImpactLabel(i) }}
            </option>
          </select>
          <p v-if="form.currentImpact" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ getImpactDefinition(form.currentImpact) }}
          </p>
        </div>
      </div>

      <!-- Risk Level Preview -->
      <div v-if="currentRiskLevel" class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current Risk Level:</span>
          <StatusBadge type="risk-level" :value="currentRiskLevel.level" />
        </div>
      </div>

      <!-- Basis for Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Basis for Rating <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.basisForRating"
          rows="5"
          :placeholder="isUpdate ? 'Explain why you are updating this rating...' : 'Provide detailed justification for your rating (minimum 50 characters)...'"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
          minlength="50"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ form.basisForRating.length }} / 50 characters minimum
        </p>
      </div>

      <!-- Residual Risk (Optional) -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
          Residual Risk (After Mitigation) - Optional
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Residual Likelihood -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Residual Likelihood
            </label>
            <select
              v-model.number="form.residualLikelihood"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option :value="null">Not specified</option>
              <option v-for="i in 5" :key="i" :value="i">
                {{ i }} - {{ getLikelihoodLabel(i) }}
              </option>
            </select>
          </div>

          <!-- Residual Impact -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Residual Impact
            </label>
            <select
              v-model.number="form.residualImpact"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option :value="null">Not specified</option>
              <option v-for="i in 5" :key="i" :value="i">
                {{ i }} - {{ getImpactLabel(i) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Residual Risk Level Preview -->
        <div v-if="residualRiskLevel" class="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Residual Risk Level:</span>
            <StatusBadge type="risk-level" :value="residualRiskLevel.level" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!isFormValid || loading"
          class="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Submitting...' : (isUpdate ? 'Update Rating' : 'Submit Rating') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getRiskLevel, getLikelihoodLabel, getImpactLabel, getLikelihoodDefinition, getImpactDefinition } from '@/utils/riskCalculations'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import type { Rating } from '@/types'

interface Props {
  existingRating?: Rating
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const isUpdate = computed(() => !!props.existingRating)

const form = ref({
  currentLikelihood: props.existingRating?.currentLikelihood || null as number | null,
  currentImpact: props.existingRating?.currentImpact || null as number | null,
  basisForRating: '',
  residualLikelihood: props.existingRating?.residualLikelihood || null as number | null,
  residualImpact: props.existingRating?.residualImpact || null as number | null,
})

const currentRiskLevel = computed(() => {
  if (form.value.currentLikelihood && form.value.currentImpact) {
    return getRiskLevel(form.value.currentLikelihood, form.value.currentImpact)
  }
  return null
})

const residualRiskLevel = computed(() => {
  if (form.value.residualLikelihood && form.value.residualImpact) {
    return getRiskLevel(form.value.residualLikelihood, form.value.residualImpact)
  }
  return null
})

const isFormValid = computed(() => {
  return (
    form.value.currentLikelihood !== null &&
    form.value.currentImpact !== null &&
    form.value.basisForRating.length >= 50
  )
})

function handleSubmit() {
  if (isFormValid.value) {
    const data: any = {
      currentLikelihood: form.value.currentLikelihood,
      currentImpact: form.value.currentImpact,
      basisForRating: form.value.basisForRating,
    }

    if (form.value.residualLikelihood !== null) {
      data.residualLikelihood = form.value.residualLikelihood
    }

    if (form.value.residualImpact !== null) {
      data.residualImpact = form.value.residualImpact
    }

    if (isUpdate.value) {
      data.reason = form.value.basisForRating
    }

    emit('submit', data)
  }
}
</script>
