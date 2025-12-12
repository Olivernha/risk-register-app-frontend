<template>
  <div class="inline-block relative">
    <select
      v-model="selectedVersion"
      @change="handleChange"
      class="px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none cursor-pointer"
    >
      <option v-for="version in versions" :key="version._id" :value="version._id">
        {{ version.cycle }}
        <span v-if="version.status === 'Active'"> (Active)</span>
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Version } from '@/types'

interface Props {
  versions: Version[]
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [versionId: string]
}>()

const selectedVersion = ref(props.modelValue || (props.versions.find(v => v.status === 'Active')?._id || ''))

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedVersion.value = newValue
  }
})

function handleChange() {
  emit('update:modelValue', selectedVersion.value)
  emit('change', selectedVersion.value)
}
</script>
