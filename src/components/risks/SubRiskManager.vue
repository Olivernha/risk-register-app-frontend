<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Sub-risks (Mini Risks)</h3>
      <button 
        type="button"
        @click="addSubRisk"
        class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Sub-risk
      </button>
    </div>

    <div v-if="subRisks.length === 0" class="text-sm text-gray-500 dark:text-gray-400 py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-slate-900/20">
      <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      No sub-risks added. Break down the main risk into specific sub-components.
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(sub, index) in subRisks" 
        :key="sub.subRiskId || index"
        class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative group"
      >
        <button 
          type="button" 
          @click="removeSubRisk(index)"
          class="absolute top-4 right-4 text-gray-400 hover:text-rose-600 transition-colors p-1"
          title="Remove sub-risk"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
          <div class="md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ref No</label>
            <input 
              v-model="sub.refNo"
              type="text"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. 1.1"
              required
            />
          </div>
          <div class="md:col-span-3">
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Title</label>
            <input 
              v-model="sub.title"
              type="text"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Sub-risk title"
              required
            />
          </div>
          <div class="md:col-span-4">
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</label>
            <textarea 
              v-model="sub.description"
              rows="2"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Describe the sub-risk"
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SubRisk } from '@/types'

const props = defineProps<{
  modelValue: SubRisk[]
  primaryRefNo?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SubRisk[]): void
}>()

const subRisks = ref<SubRisk[]>([...props.modelValue])

watch(() => props.modelValue, (newVal) => {
  subRisks.value = [...newVal]
}, { deep: true })

const addSubRisk = () => {
  subRisks.value.push({
    subRiskId: `SR${Date.now()}`,
    refNo: props.primaryRefNo ? `${props.primaryRefNo.replace('R', '')}.${subRisks.value.length + 1}` : `${subRisks.value.length + 1}`,
    title: '',
    description: ''
  })
  emit('update:modelValue', subRisks.value)
}

const removeSubRisk = (index: number) => {
  subRisks.value.splice(index, 1)
  emit('update:modelValue', subRisks.value)
}
</script>
