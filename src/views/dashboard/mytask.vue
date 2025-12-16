<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          My Tasks Dashboard
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {{ authStore.userName || 'User' }}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportDashboard"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
        <button
          @click="toggleDigest"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Digest
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

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(stat, index) in dashboardStats" :key="index" class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
        </div>
        <div class="text-3xl font-semibold text-gray-900 dark:text-gray-100">{{ stat.value }}</div>
        <p class="text-xs text-gray-500 mt-2">{{ stat.description }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="space-y-8">
      
      <!-- Section: Risk Owner Tasks -->
      <div v-if="authStore.hasRole(['RiskOwner'])" class="space-y-6">
        <!-- Risks Awaiting Rating -->
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
            <h3 class="font-semibold text-blue-900 dark:text-blue-100">Risks Awaiting My Rating</h3>
            <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">{{ pendingRatings.length }} pending</span>
          </div>
          <div v-if="pendingRatings.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            No pending ratings. Good job!
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-700/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th class="px-6 py-3">Risk Ref</th>
                <th class="px-6 py-3">Title</th>
                <th class="px-6 py-3">Due Date</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="risk in pendingRatings" :key="risk.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.refNo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ risk.title }}</td>
                <td class="px-6 py-4 text-sm text-red-600 dark:text-red-400 font-medium">Internal Deadline: TBD</td>
                <td class="px-6 py-4 text-right">
                  <button @click="$router.push(`/risks/${risk.id}`)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Rate Now →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- My Questions -->
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-purple-50 dark:bg-purple-900/10">
            <h3 class="font-semibold text-purple-900 dark:text-purple-100">Questions Assigned to Me</h3>
            <span class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">{{ myQuestions.length }} open</span>
          </div>
          <div v-if="myQuestions.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            No open questions assigned to you.
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-700/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th class="px-6 py-3">Related Risk</th>
                <th class="px-6 py-3">Question</th>
                <th class="px-6 py-3">Priority</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in myQuestions" :key="item.question.questionId" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.riskRef }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ item.question.text }}</td>
                <td class="px-6 py-4">
                  <span :class="['px-2 py-1 text-xs rounded-full', item.question.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800']">
                    {{ item.question.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button @click="$router.push(`/risks/${item.riskId}?tab=questions`)" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium">
                    Reply →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section: Action Owner Tasks -->
      <div v-if="authStore.hasRole(['ActionOwner'])" class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-green-50 dark:bg-green-900/10">
            <h3 class="font-semibold text-green-900 dark:text-green-100">My Action Items</h3>
            <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">{{ myMitigations.length }} active</span>
          </div>
           <div v-if="myMitigations.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            No ongoing mitigations assigned to you.
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-700/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th class="px-6 py-3">Related Risk</th>
                <th class="px-6 py-3">Action Title</th>
                <th class="px-6 py-3">Target Date</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Progress</th>
                 <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in myMitigations" :key="item.mitigation.controlId" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.riskRef }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ item.mitigation.title }}</td>
                <td class="px-6 py-4 text-sm">
                  <span :class="{'text-red-600 font-bold': isOverdue(item.mitigation.targetDate)}">
                    {{ formatDate(item.mitigation.targetDate) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">{{ item.mitigation.status }}</td>
                <td class="px-6 py-4 text-sm">
                    <div class="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: item.mitigation.progressPercentage + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ item.mitigation.progressPercentage }}%</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button @click="$router.push(`/risks/${item.riskId}?tab=mitigations`)" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium">
                    Update →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       <!-- Section: Risk Management Tasks -->
      <div v-if="authStore.hasRole(['RiskManagement', 'Admin'])" class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-orange-50 dark:bg-orange-900/10">
            <h3 class="font-semibold text-orange-900 dark:text-orange-100">Risks Pending Publication</h3>
            <span class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full">{{ draftRisks.length }} drafts</span>
          </div>
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-700/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th class="px-6 py-3">Ref</th>
                <th class="px-6 py-3">Title</th>
                <th class="px-6 py-3">Category</th>
                <th class="px-6 py-3">Owners</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="risk in draftRisks" :key="risk.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.refNo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ risk.title }}</td>
                <td class="px-6 py-4 text-sm">{{ risk.category }}</td>
                 <td class="px-6 py-4 text-sm">{{ risk.owners.map(o => o.name).join(', ') }}</td>
                <td class="px-6 py-4 text-right">
                  <button @click="$router.push(`/risks/${risk.id}`)" class="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm font-medium">
                    Review →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import { storeToRefs } from 'pinia'
import type { Risk, Question, Mitigation, RiskOwner, Rating } from '@/types'

const authStore = useAuthStore()
const riskStore = useRiskStore()
const { risks } = storeToRefs(riskStore)

onMounted(async () => {
  await riskStore.fetchRisks()
  // Ensure we have current user profile loaded?
  if (!authStore.user) {
      await authStore.fetchUserProfile() // Or simpler init
  }
})

// Current User ID for filtering
const currentUserId = computed(() => authStore.user?.userId || '')

// --- Computed Data for Dashboard ---

// 1. Pending Ratings (For Risk Owners)
// Find risks where I am an owner, AND (I have no rating OR my rating is incomplete/zero)
const pendingRatings = computed(() => {
    if (!currentUserId.value) return []
    return risks.value.filter((risk: Risk) => {
        const isOwner = risk.owners.some((o: RiskOwner) => o.userId === currentUserId.value)
        if (!isOwner || risk.status === 'Locked') return false
        
        const myRating = risk.ratings.find((r: Rating) => r.ownerId === currentUserId.value)
        // Considered pending if no rating object exists OR likelihood/impact are 0
        const isPending = !myRating || (myRating.currentLikelihood === 0 || myRating.currentImpact === 0)
        
        return isPending
    })
})

// 2. My Questions (For Risk Owners / anyone assigned questions)
const myQuestions = computed(() => {
    if (!currentUserId.value) return []
    const list: { riskId: string, riskRef: string, question: Question }[] = []
    
    risks.value.forEach((risk: Risk) => {
        const assignedQs = risk.questions.filter((q: Question) => q.assignedTo.userId === currentUserId.value && q.status === 'Open')
        assignedQs.forEach((q: Question) => {
            list.push({ riskId: risk.id, riskRef: risk.refNo, question: q })
        })
    })
    return list
})

// 3. My Mitigations (For Action Owners)
const myMitigations = computed(() => {
    if (!currentUserId.value) return []
    const list: { riskId: string, riskRef: string, mitigation: Mitigation }[] = []

    risks.value.forEach((risk: Risk) => {
        const assignedMs = risk.mitigations.filter((m: Mitigation) => m.actionOwner.userId === currentUserId.value && m.status !== 'Completed')
        assignedMs.forEach((m: Mitigation) => {
            list.push({ riskId: risk.id, riskRef: risk.refNo, mitigation: m })
        })
    })
    return list
})

// 4. Draft Risks (For Risk Management)
const draftRisks = computed(() => {
    return risks.value.filter((r: Risk) => r.status === 'Draft')
})


// --- Stats for Top Cards ---
const dashboardStats = computed(() => {
    const stats = []
    
    if (authStore.hasRole(['RiskOwner'])) {
        stats.push({ label: 'Pending Ratings', value: pendingRatings.value.length, description: 'Risks awaiting your assessment' })
        stats.push({ label: 'Open Questions', value: myQuestions.value.length, description: 'Queries requiring your response' })
    }
    
    if (authStore.hasRole(['ActionOwner'])) {
        stats.push({ label: 'Active Mitigations', value: myMitigations.value.length, description: 'Action items in progress' })
        const overdue = myMitigations.value.filter((i: any) => new Date(i.mitigation.targetDate) < new Date()).length
        stats.push({ label: 'Overdue Items', value: overdue, description: 'Actions past target date' })
    }
    
    if (authStore.hasRole(['RiskManagement', 'Admin'])) {
         stats.push({ label: 'Total Risks', value: risks.value.length, description: 'All registered risks' })
         stats.push({ label: 'Draft Risks', value: draftRisks.value.length, description: 'Pending publication' })
    }
    
    return stats
})

// Helper
const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
}

const isOverdue = (date: Date | string) => {
    return new Date(date) < new Date()
}

const exportDashboard = () => {
    alert('Exporting dashboard data to Excel/CSV...')
}

const toggleDigest = () => {
    alert('Email digest preferences updated.')
}
</script>