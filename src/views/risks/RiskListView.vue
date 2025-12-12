<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risk Register</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Comprehensive view of all organizational risks</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <VersionSelector @version-changed="handleVersionChange" />
        
        <div class="flex gap-2">
          <button 
            @click="exportData('excel')"
            class="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            title="Export to Excel"
          >
            <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="hidden sm:inline">Excel</span>
          </button>
          <button 
            @click="exportData('pdf')"
            class="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            title="Export to PDF"
          >
            <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">PDF</span>
          </button>
        </div>

        <button
          v-if="authStore.hasRole(['RiskManagement', 'Admin'])"
          @click="$router.push('/risks/create')"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Risk
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
      <div class="flex flex-col lg:flex-row gap-3">
        <!-- Search -->
        <div class="relative flex-grow lg:max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search..."
            class="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap gap-2 flex-grow">
          <select 
            v-model="selectedLevel" 
            @change="loadRisks"
            class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Level: All</option>
            <option value="Very High">Very High</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            v-model="selectedCategory" 
            @change="loadRisks"
            class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Category: All</option>
            <option value="Strategic">Strategic</option>
            <option value="Operational">Operational</option>
            <option value="Financial">Financial</option>
            <option value="Compliance">Compliance</option>
          </select>

          <select 
            v-model="selectedDepartment" 
            @change="loadRisks"
            class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Dept: All</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>

           <select
             v-model="selectedStatus"
             @change="loadRisks"
             class="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="">Status: All</option>
             <option value="Draft">Draft</option>
             <option value="Published">Published</option>
             <option value="Locked">Locked</option>
           </select>
        </div>
      </div>
    </div>

    <!-- Risk List Table -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th 
                v-for="col in columns" 
                :key="col.key"
                @click="col.sortable ? sortBy(col.key) : null"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                :class="{ 'cursor-default': !col.sortable }"
              >
                <div class="flex items-center gap-1">
                  {{ col.label }}
                  <span v-if="col.sortable" class="flex flex-col text-[10px] leading-tight text-gray-400">
                    <svg class="w-2 h-2" :class="{ 'text-blue-600': sortField === col.key && sortOrder === 'asc' }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 15l7-7 7 7" /></svg>
                    <svg class="w-2 h-2" :class="{ 'text-blue-600': sortField === col.key && sortOrder === 'desc' }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="risk in risks" :key="risk._id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors" @click="viewRisk(risk._id)">
              <!-- Ref -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ risk.refNo }}
              </td>
              
              <!-- Title -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{{ risk.description }}</div>
              </td>
              
              <!-- Category -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {{ risk.category }}
                </span>
              </td>
              
              <!-- Level -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="risk.averageRating" :class="['inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', getRiskLevelClasses(risk.averageRating.riskLevel)]">
                  {{ risk.averageRating.riskLevel }}
                </span>
                <span v-else class="text-xs text-gray-400 italic">Not rated</span>
              </td>
              
              <!-- Owners -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex -space-x-2">
                  <div v-for="(owner, idx) in risk.owners.slice(0, 3)" :key="idx" 
                    class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold ring-2 ring-white dark:ring-slate-800"
                    :title="owner.name"
                  >
                    {{ getInitials(owner.name) }}
                  </div>
                  <div v-if="risk.owners.length > 3" 
                    class="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-medium ring-2 ring-white dark:ring-slate-800"
                  >
                    +{{ risk.owners.length - 3 }}
                  </div>
                </div>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', getRiskStatusClasses(risk.status)]">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{ 
                    'bg-slate-400': risk.status === 'Draft',
                    'bg-blue-400': risk.status === 'Published',
                    'bg-purple-400': risk.status === 'Locked'
                  }"></span>
                  {{ risk.status }}
                </span>
              </td>
              
              <!-- Department -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ risk.department || '-' }}
              </td>
              
              <!-- Mitigation % -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                 <div class="flex items-center gap-2">
                   <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                     <div 
                       class="bg-blue-500 h-1.5 rounded-full" 
                       :style="{ width: `${calculateMitigationProgress(risk)}%` }"
                     ></div>
                   </div>
                   <span class="text-xs">{{ Math.round(calculateMitigationProgress(risk)) }}%</span>
                 </div>
              </td>
              
              <!-- Last Updated -->
              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                {{ formatRelativeDate(risk.audit.updatedAt || risk.audit.createdAt) }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8" class="px-6 py-12">
                <LoadingSpinner size="lg" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing <span class="font-medium text-gray-900 dark:text-gray-100">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> to <span class="font-medium text-gray-900 dark:text-gray-100">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of <span class="font-medium text-gray-900 dark:text-gray-100">{{ pagination.total }}</span> risks
        </div>
        <div class="flex gap-2">
          <button
            @click="handlePageChange(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              page === pagination.page
                ? 'bg-gray-900 dark:bg-blue-600 text-white border border-transparent'
                : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="handlePageChange(pagination.page + 1)"
            :disabled="pagination.page >= totalPages"
            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/risk'
import { getInitials, getRiskLevelClasses, getRiskStatusClasses, formatRelativeDate } from '@/utils/formatters'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import VersionSelector from '@/components/VersionSelector.vue'
import { useNotifications } from '@/composables/useNotifications'
import type { Risk } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const riskStore = useRiskStore()
const { showSuccess } = useNotifications()

// Filters
const searchQuery = ref('')
const selectedLevel = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')
const sortField = ref('refNo')
const sortOrder = ref<'asc' | 'desc'>('asc')

const departments = [
  'IT',
  'Finance',
  'Operations',
  'HR',
  'Legal',
  'Sales',
  'Marketing',
  'Compliance',
  'Executive'
]

const risks = computed(() => riskStore.risks)
const loading = computed(() => riskStore.loading)
const pagination = computed(() => riskStore.pagination)

// Columns Def
const columns = [
  { label: 'Ref', key: 'refNo', sortable: true },
  { label: 'Risk Title', key: 'title', sortable: true },
  { label: 'Category', key: 'category', sortable: true },
  { label: 'Risk Level', key: 'riskLevel', sortable: false }, // Sort logic complex due to nested
  { label: 'Owners', key: 'owners', sortable: false }, 
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Department', key: 'department', sortable: true },
  { label: '% Mitigated', key: 'mitigation', sortable: false },
  { label: 'Last Updated', key: 'updatedAt', sortable: true },
]

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit))

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = totalPages.value
  const pages: number[] = []
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const calculateMitigationProgress = (risk: Risk) => {
  if (!risk.mitigations || risk.mitigations.length === 0) return 0
  const total = risk.mitigations.reduce((acc, m) => acc + m.progressPercentage, 0)
  return total / risk.mitigations.length
}

async function loadRisks() {
  const filters: any = {
    _sort: sortField.value,
    _order: sortOrder.value
  }
  
  if (searchQuery.value) filters.q = searchQuery.value
  if (selectedLevel.value) filters.riskLevel = selectedLevel.value
  if (selectedCategory.value) filters.category = selectedCategory.value
  if (selectedStatus.value) filters.status = selectedStatus.value
  if (selectedDepartment.value) filters.department = selectedDepartment.value
  
  await riskStore.fetchRisks(filters)
}

function handleSearch() {
  // Debounce could be added here
  riskStore.setPage(1)
  loadRisks()
}

function handlePageChange(page: number) {
  riskStore.setPage(page)
  loadRisks()
}

function handleVersionChange(cycle: string) {
  console.log('Version changed to:', cycle)
  // Reset to page 1 and reload risks for the new version
  // ... existing code ...
  riskStore.setPage(1)
  loadRisks()
}

function sortBy(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  loadRisks()
}

function viewRisk(riskId: string) {
  router.push(`/risks/${riskId}`)
}

function exportData(type: 'excel' | 'pdf') {
  // In a real app, this would trigger a backend download or use a library
  const format = type === 'excel' ? 'Excel (XLSX)' : 'PDF'
  showSuccess(`Exporting data to ${format}... This may take a moment.`)
}

onMounted(() => {
  loadRisks()
})
</script>
