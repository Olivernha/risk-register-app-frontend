<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risk Heat Map</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">5×5 Likelihood × Impact Matrix</p>
      </div>
      
      <!-- Version Selector -->
      <VersionSelector
        v-if="versions.length > 0"
        v-model="selectedVersionId"
        :versions="versions"
        @change="handleVersionChange"
      />
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" size="lg" />

    <!-- Heat Map Grid -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <HeatMapGrid
        :risks="risks"
        @risk-click="handleRiskClick"
      />
    </div>

    <!-- Statistics -->
    <div v-if="!loading && risks.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Risks</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ risks.length }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Very High</div>
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ veryHighCount }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">High</div>
        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ highCount }}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Medium & Low</div>
        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ mediumLowCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRiskStore } from '@/stores/risk'
import versionService from '@/api/versions'
import HeatMapGrid from '@/components/dashboard/HeatMapGrid.vue'
import VersionSelector from '@/components/versions/VersionSelector.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { Risk, Version } from '@/types'

const router = useRouter()
const riskStore = useRiskStore()

const loading = ref(true)
const versions = ref<Version[]>([])
const selectedVersionId = ref('')

const risks = computed(() => riskStore.risks)

const veryHighCount = computed(() => 
  risks.value.filter(r => r.averageRating?.riskLevel === 'Very High').length
)

const highCount = computed(() => 
  risks.value.filter(r => r.averageRating?.riskLevel === 'High').length
)

const mediumLowCount = computed(() => 
  risks.value.filter(r => 
    r.averageRating?.riskLevel === 'Medium' || r.averageRating?.riskLevel === 'Low'
  ).length
)

async function loadVersions() {
  try {
    versions.value = await versionService.getVersions()
    const activeVersion = versions.value.find(v => v.status === 'Active')
    if (activeVersion) {
      selectedVersionId.value = activeVersion._id
    }
  } catch (error) {
    console.error('Failed to load versions:', error)
  }
}

async function loadRisks() {
  loading.value = true
  try {
    await riskStore.fetchRisks({
      version: selectedVersionId.value,
      status: 'Published', // Only show published risks
    })
  } catch (error) {
    console.error('Failed to load risks:', error)
  } finally {
    loading.value = false
  }
}

function handleVersionChange(versionId: string) {
  selectedVersionId.value = versionId
  loadRisks()
}

function handleRiskClick(risk: Risk) {
  router.push(`/risks/${risk._id}`)
}

onMounted(async () => {
  await loadVersions()
  await loadRisks()
})
</script>
