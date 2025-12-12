<template>
  <div class="relative inline-block">
    <button
      @click="isOpen = !isOpen"
      class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{{ currentVersion?.cycle || 'Select Version' }}</span>
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
    >
      <div class="p-2">
        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          Select Version
        </div>
        
        <button
          v-for="version in versions"
          :key="version.id"
          @click="selectVersion(version)"
          :class="[
            'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
            version.cycle === currentVersion?.cycle
              ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
          ]"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">{{ version.cycle }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDateRange(version.startDate, version.endDate) }}
              </div>
            </div>
            <span
              :class="[
                'inline-block px-2 py-1 text-xs font-medium rounded',
                version.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : '',
                version.status === 'Locked' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : '',
                version.status === 'Draft' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : ''
              ]"
            >
              {{ version.status }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVersionStore } from '@/stores/version'

const versionStore = useVersionStore()
const isOpen = ref(false)

const versions = computed(() => versionStore.versions)
const currentVersion = computed(() => versionStore.currentVersion)

function selectVersion(version: any) {
  versionStore.selectVersion(version.cycle)
  isOpen.value = false
  // Emit event to parent to reload data
  emit('versionChanged', version.cycle)
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  versionStore.fetchVersions()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const emit = defineEmits<{
  versionChanged: [cycle: string]
}>()
</script>
