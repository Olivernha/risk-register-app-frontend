<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Edit Risk</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Modify risk information</p>
      </div>
      <button
        @click="$router.push('/risks')"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        Cancel
      </button>
    </div>

    <!-- Form Card -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter risk title"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Describe the risk"
          ></textarea>
        </div>

        <!-- Risk Owners and Time Horizon -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risk Owners
            </label>
            <select
              v-model="form.owners"
              multiple
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="michael">Michael Wong</option>
              <option value="tan">Tan Chok Liang</option>
              <option value="chan">Chan Liang</option>
              <option value="lim">Lim San San</option>
            </select>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Horizon
            </label>
            <select
              v-model="form.timeHorizon"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="1-3">1-3 years</option>
              <option value="2-5">2-5 years</option>
              <option value="4-5">4-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
        </div>

        <!-- Financial Impact -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Financial Impact
          </label>
          <div class="flex gap-4">
            <input
              v-model="form.financialImpact"
              type="number"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Amount"
            />
            <select
              v-model="form.currency"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SGD">SGD</option>
            </select>
          </div>
        </div>

        <!-- Likelihood x Impact -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Likelihood x Impact
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-2">Likelihood</label>
              <select
                v-model="form.likelihood"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="1">1 - Negligible</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Major</option>
                <option value="5">5 - Catastrophic</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-2">Impact</label>
              <select
                v-model="form.impact"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="1">1 - Negligible</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Major</option>
                <option value="5">5 - Catastrophic</option>
              </select>
            </div>
          </div>
          <div v-if="riskLevel" class="mt-3 inline-block px-3 py-1 text-sm font-medium rounded" :class="riskLevelClass">
            Risk Level: {{ riskLevel }}
          </div>
        </div>

        <!-- Mitigation Measures -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mitigation Measures
          </label>
          <div class="space-y-2">
            <div v-for="(measure, index) in form.mitigations" :key="index" class="flex gap-2">
              <input
                v-model="form.mitigations[index]"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Mitigation action"
              />
              <button
                type="button"
                @click="removeMitigation(index)"
                class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              @click="addMitigation"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              + Add Mitigation
            </button>
          </div>
        </div>

        <!-- Additional Questions -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Questions
          </label>
          <textarea
            v-model="form.additionalQuestions"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Any additional questions or notes"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$router.push('/risks')"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Update Risk
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = ref({
  title: 'Energy Transition: Decarbonisation and Competition from New Energy Sources',
  description: 'Technology advancement and evolving business models in renewable energy...',
  owners: ['michael', 'tan'],
  timeHorizon: '1-3',
  financialImpact: '1000000',
  currency: 'USD',
  likelihood: '5',
  impact: '5',
  mitigations: ['Implement renewable energy strategy', 'Monitor regulatory changes'],
  additionalQuestions: ''
})

const riskLevel = computed(() => {
  const score = parseInt(form.value.likelihood) * parseInt(form.value.impact)
  if (score >= 20) return 'Very High'
  if (score >= 15) return 'High'
  if (score >= 8) return 'Medium'
  if (score >= 1) return 'Low'
  return ''
})

const riskLevelClass = computed(() => {
  switch (riskLevel.value) {
    case 'Very High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    default: return ''
  }
})

const addMitigation = () => {
  form.value.mitigations.push('')
}

const removeMitigation = (index: number) => {
  form.value.mitigations.splice(index, 1)
}

const handleSubmit = () => {
  console.log('Form updated:', form.value)
  // TODO: API call to update risk
  router.push(`/risks/${route.params.id}`)
}

onMounted(() => {
  // TODO: Load risk data from API
  console.log('Loading risk:', route.params.id)
})
</script>
