<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risk List Report</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Comprehensive view of all organizational risks</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportToCSV"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
        <button
          v-if="authStore.hasRole(['RiskManagement', 'Admin'])"
          @click="$router.push('/risks/create')"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Risk
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div class="md:col-span-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search risks..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <select v-model="selectedLevel" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="All Levels">All Levels</option>
          <option>Very High</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select v-model="selectedCategory" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="All Categories">All Categories</option>
          <option>Strategic</option>
          <option>Operational</option>
          <option>Financial</option>
          <option>Compliance</option>
        </select>
        <select v-model="selectedStatus" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="All Statuses">All Statuses</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Locked</option>
        </select>
        <select v-model="selectedDepartment" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="All Departments">All Departments</option>
          <option v-for="dept in availableDepartments" :key="dept" :value="dept">{{ dept }}</option>
        </select>
        <select v-model="selectedOwner" class="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="All Owners">All Owners</option>
          <option v-for="user in users" :key="user.userId" :value="user.userId">{{ user.name }}</option>
        </select>
      </div>
    </div>

    <!-- Risk List Table -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading risks...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th 
                v-for="col in columns" 
                :key="col.key"
                @click="sortBy(col.key)"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors select-none"
              >
                <div class="flex items-center gap-1">
                  {{ col.label }}
                  <span v-if="sortKey === col.key" class="text-gray-400">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-for="risk in paginatedRisks" :key="risk.id">
              <tr 
                class="hover:bg-gray-50 dark:hover:bg-slate-700/30 cursor-pointer group"
                :class="{ 'bg-blue-50/30 dark:bg-blue-900/10': expandedRisks.has(risk.id) }"
                @click="toggleExpand(risk.id)"
              >
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span class="w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                    <svg 
                      class="w-3.5 h-3.5 transform transition-transform" 
                      :class="{ 'rotate-90': expandedRisks.has(risk.id) }"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  {{ risk.refNo }}
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ risk.title }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 truncate max-w-md">{{ risk.description }}</div>
                    </div>
                    <button 
                      @click.stop="$router.push(`/risks/${risk.id}`)"
                      class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-all rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ risk.category }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-block px-2 py-1 text-xs font-medium rounded',
                    getRiskLevelClass(risk.averageRating?.riskLevel)
                  ]">
                    {{ risk.averageRating?.riskLevel || 'Unrated' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex flex-col gap-0.5">
                    <span v-for="owner in risk.owners.slice(0, 2)" :key="owner.userId">
                      {{ owner.name }}
                      <span class="text-xs text-gray-400">({{ getOwnerDepartment(owner.userId) }})</span>
                    </span>
                    <span v-if="risk.owners.length > 2" class="text-xs text-gray-400">+{{ risk.owners.length - 2 }} more</span>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-block px-2 py-1 text-xs font-medium rounded',
                    getStatusClass(risk.status)
                  ]">
                    {{ risk.status }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-16 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: getMitigationProgress(risk) + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-600 dark:text-gray-400">{{ getMitigationProgress(risk) }}%</span>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(risk.audit?.updatedAt) || '-' }}
                </td>
              </tr>
              <!-- Sub-risks Expanded Row -->
              <tr v-if="expandedRisks.has(risk.id)" class="bg-gray-50/50 dark:bg-slate-900/20">
                <td colspan="8" class="px-6 py-4">
                  <div class="pl-6 border-l-2 border-blue-500/30">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Sub-risks Breakdown ({{ risk.subRisks?.length || 0 }})
                    </h4>
                    <div v-if="!risk.subRisks || risk.subRisks.length === 0" class="text-xs text-gray-500 italic py-2">
                      No sub-risks added for this risk.
                    </div>
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div 
                        v-for="sub in risk.subRisks" 
                        :key="sub.subRiskId" 
                        @click="$router.push(`/risks/${risk.id}/sub-risks/${sub.subRiskId}`)"
                        class="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer group/sub relative overflow-hidden"
                      >
                        <!-- Top Bar -->
                        <div class="flex items-center justify-between mb-3">
                          <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-[10px] font-bold tracking-tight">
                            {{ sub.refNo }}
                          </span>
                          <span :class="[
                            'px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide',
                            getMitigationStatusClass(sub.status || 'Not Started')
                          ]">
                            {{ sub.status || 'Not Started' }}
                          </span>
                        </div>

                        <!-- Content -->
                        <div class="mb-4">
                          <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400 transition-colors line-clamp-1 mb-1" :title="sub.title">
                            {{ sub.title }}
                          </h5>
                          <p class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed" :title="sub.description">
                            {{ sub.description }}
                          </p>
                        </div>

                        <!-- Footer Info -->
                        <div class="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                          <div class="flex items-center gap-2">
                             <div v-if="sub.actionOwner" class="flex items-center gap-1.5">
                                <div class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[8px] font-bold uppercase ring-1 ring-emerald-200 dark:ring-emerald-800/50">
                                  {{ sub.actionOwner.name.substring(0, 2) }}
                                </div>
                                <span class="text-[10px] text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{{ sub.actionOwner.name }}</span>
                             </div>
                          </div>
                          <div class="flex flex-col items-end">
                            <span class="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 mb-1">{{ sub.progressPercentage || 0 }}%</span>
                            <div class="w-16 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                class="h-full bg-blue-500 rounded-full transition-all duration-700"
                                :style="{ width: `${sub.progressPercentage || 0}%` }"
                              ></div>
                            </div>
                          </div>
                        </div>

                        <!-- Hover Icon -->
                        <div class="absolute top-4 right-4 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                           <svg class="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                           </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="paginatedRisks.length === 0" class="hover:bg-transparent">
              <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No risks found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredRisks.length) }}</span> of <span class="font-medium">{{ filteredRisks.length }}</span> risks
        </div>
        <div class="flex gap-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button class="px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded text-sm">{{ currentPage }}</button>
          <button 
            @click="currentPage++"
            :disabled="currentPage * itemsPerPage >= filteredRisks.length"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import userService from '@/api/users'
import type { Risk, RiskLevel, User } from '@/types'

const authStore = useAuthStore()
const riskStore = useRiskStore()
const { risks, loading } = storeToRefs(riskStore)

const users = ref<User[]>([])
const searchQuery = ref('')
const selectedLevel = ref('All Levels')
const selectedCategory = ref('All Categories')
const selectedStatus = ref('All Statuses')
const selectedDepartment = ref('All Departments')
const selectedOwner = ref('All Owners')

const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 10

const columns = [
  { key: 'refNo', label: 'Ref' },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'averageRating.riskLevel', label: 'Risk Level' },
  { key: 'owners', label: 'Owners' },
  { key: 'status', label: 'Status' },
  { key: 'mitigation', label: '% Mitigation' },
  { key: 'updatedAt', label: 'Last Updated' }
]

onMounted(async () => {
  await Promise.all([
    riskStore.fetchRisks(),
    fetchUsers()
  ])
  
  // Default sort
  sortBy('refNo')
})

async function fetchUsers() {
    try {
        const data = await userService.getUsers()
        users.value = data
    } catch (e) {
        console.error("Failed to fetch users", e)
    }
}

// Derived State
const availableDepartments = computed(() => {
    const depts = new Set(users.value.map((u: User) => u.department).filter(Boolean))
    return Array.from(depts).sort()
})

const getOwnerDepartment = (userId: string) => {
    const user = users.value.find((u: User) => u.userId === userId)
    return user?.department || 'N/A'
}

const getMitigationProgress = (risk: Risk) => {
    if (!risk.mitigations || risk.mitigations.length === 0) return 0
    const totalProgress = risk.mitigations.reduce((sum, m) => sum + (m.progressPercentage || 0), 0)
    return Math.round(totalProgress / risk.mitigations.length)
}

const expandedRisks = ref<Set<string>>(new Set())

function toggleExpand(riskId: string) {
    if (expandedRisks.value.has(riskId)) {
        expandedRisks.value.delete(riskId)
    } else {
        expandedRisks.value.add(riskId)
    }
}

// Access Control & Filtering
const allowedRisks = computed(() => {
    const user = authStore.user
    if (!user) return []

    // Base filter: exclude deleted risks
    let activeRisks = risks.value.filter((r: Risk) => r.status !== 'Deleted')

    // RM/Admin: View All (including Drafts)
    if (['RiskManagement', 'Admin'].includes(user.role)) {
        return activeRisks
    }
    
    // For all other roles, hide Draft risks
    activeRisks = activeRisks.filter((r: Risk) => r.status !== 'Draft')

    // HOD: View risks where owners match HOD department
    if (user.role === 'HOD') {
        return activeRisks.filter((risk: Risk) => 
            risk.owners.some((owner: any) => getOwnerDepartment(owner.userId) === user.department)
        )
    }

    // Role Owner / Action Owner: View Assigned
    return activeRisks.filter((risk: Risk) => 
        risk.owners.some((o: any) => o.userId === user.userId) || 
        risk.mitigations.some((m: any) => m.actionOwner.userId === user.userId) ||
        risk.subRisks?.some((s: any) => s.actionOwner?.userId === user.userId)
    )
})

const filteredRisks = computed(() => {
  let result = allowedRisks.value.filter((risk: Risk) => {
    const matchesSearch = 
      risk.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      risk.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      risk.refNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      risk.owners.some((o: any) => o.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      risk.subRisks?.some((s: any) => 
        s.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        s.actionOwner?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        s.actionItem?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    
    const matchesLevel = selectedLevel.value === 'All Levels' || risk.averageRating?.riskLevel === selectedLevel.value
    const matchesCategory = selectedCategory.value === 'All Categories' || risk.category === selectedCategory.value
    const matchesStatus = selectedStatus.value === 'All Statuses' || risk.status === selectedStatus.value
    
    let matchesDept = true
    if (selectedDepartment.value !== 'All Departments') {
        matchesDept = risk.owners.some((o: any) => getOwnerDepartment(o.userId) === selectedDepartment.value)
    }

    let matchesOwner = true
    if (selectedOwner.value !== 'All Owners') {
        matchesOwner = risk.owners.some((o: any) => o.userId === selectedOwner.value)
    }

    return matchesSearch && matchesLevel && matchesCategory && matchesStatus && matchesDept && matchesOwner
  })

  // Sorting
  if (sortKey.value) {
    result.sort((a: any, b: any) => {
        let valA, valB
        
        switch (sortKey.value) {
            case 'averageRating.riskLevel':
                const levels: Record<string, number> = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'Unrated': 0 }
                valA = levels[a.averageRating?.riskLevel || 'Unrated'] || 0
                valB = levels[b.averageRating?.riskLevel || 'Unrated'] || 0
                break
            case 'mitigation':
                valA = getMitigationProgress(a)
                valB = getMitigationProgress(b)
                break
            case 'updatedAt':
                valA = new Date(a.audit?.updatedAt || 0).getTime()
                valB = new Date(b.audit?.updatedAt || 0).getTime()
                break
            default:
                valA = a[sortKey.value]
                valB = b[sortKey.value]
        }
        
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
    })
  }

  return result
})

const paginatedRisks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRisks.value.slice(start, end)
})

// Actions
function sortBy(key: string) {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = 'asc'
    }
}

function exportToCSV() {
    const headers = ['Ref', 'Title', 'Category', 'Risk Level', 'Owners', 'Status', 'Mitigation %', 'Last Updated']
    const rows = filteredRisks.value.map((r: Risk) => [
        r.refNo,
        `"${r.title.replace(/"/g, '""')}"`,
        r.category,
        r.averageRating?.riskLevel || 'Unrated',
        `"${r.owners.map((o: any) => o.name).join(', ')}"`,
        r.status,
        getMitigationProgress(r) + '%',
        formatDate(r.audit?.updatedAt)
    ])
    
    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `risk_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
}

// Styles
function getRiskLevelClass(level?: RiskLevel) {
  switch (level) {
    case 'Very High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Published': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    case 'Locked': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

import type { MitigationStatus } from '@/types'

function getMitigationStatusClass(status: MitigationStatus) {
  switch (status) {
    case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Ongoing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    case 'Not Started': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function formatDate(date?: Date | string) {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
}

// Reset pagination on filter change
watch([searchQuery, selectedLevel, selectedCategory, selectedStatus, selectedDepartment, selectedOwner], () => {
    currentPage.value = 1
})
</script>
