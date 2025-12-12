<template>
  <div class="space-y-6 fade-in p-1">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          My Tasks
        </h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Welcome back, {{ authStore.userName }}. Here's what needs your attention today.
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Export/Email Actions -->
        <div class="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
          <button 
            @click="exportToExcel"
            title="Export to Excel"
            class="p-2 text-slate-500 hover:text-green-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <div class="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button 
            @click="sendEmailDigest"
            title="Email Digest"
            class="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <button
          v-if="authStore.hasRole(['RiskManagement', 'Admin'])"
          @click="$router.push('/risks/create')"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Risk
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      
      <!-- Role Toggles (if multiple roles) -->
      <div v-if="availableRoles.length > 1" class="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
        <button 
          v-for="role in availableRoles" 
          :key="role.key"
          @click="activeView = role.key"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-px',
            activeView === role.key 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-slate-50 dark:bg-slate-800/50' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          ]"
        >
          {{ role.label }}
        </button>
      </div>

      <!-- Risk Management View -->
      <div v-if="authStore.hasRole(['RiskManagement', 'Admin']) && activeView === 'management'">
        <DashboardRiskManagement 
          :pending-risks="pendingPublicationRisks" 
          :unanswered-questions="unansweredQuestions"
          :risks-ready-to-lock="risksReadyToLock"
        />
      </div>

      <!-- Risk Owner View -->
      <div v-if="activeView === 'owner'" class="space-y-6">
        <DashboardStats :stats="riskOwnerStats" />
        <DashboardRiskOwner 
          :pending-ratings="ratingStore.pendingRatings"
          :assigned-questions="questionStore.myQuestions.filter(q => q.question.status === 'Open')"
          :loading-ratings="ratingStore.loading"
        />
      </div>

      <!-- Action Owner View -->
      <div v-if="activeView === 'action'" class="space-y-6">
        <DashboardStats :stats="actionOwnerStats" />
        <DashboardActionOwner 
          :my-mitigations="mitigationStore.myMitigations"
          :overdue-items="mitigationStore.overdueMitigations"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/risk'
import { useRatingStore } from '@/stores/rating'
import { useQuestionStore } from '@/stores/question'
import { useMitigationStore } from '@/stores/mitigation'
import { useNotifications } from '@/composables/useNotifications'

// Components
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardRiskOwner from '@/components/dashboard/DashboardRiskOwner.vue'
import DashboardActionOwner from '@/components/dashboard/DashboardActionOwner.vue'
import DashboardRiskManagement from '@/components/dashboard/DashboardRiskManagement.vue'

const router = useRouter()
const authStore = useAuthStore()
const riskStore = useRiskStore()
const ratingStore = useRatingStore()
const questionStore = useQuestionStore()
const mitigationStore = useMitigationStore()
const { showSuccess } = useNotifications()

const isLoading = ref(true)
const activeView = ref('owner') // Default view

// Derived Data for Risk Management
const pendingPublicationRisks = computed(() => {
  return riskStore.risks.filter(r => ['Draft', 'Review'].includes(r.status))
})

const unansweredQuestions = ref<any[]>([])

const risksReadyToLock = computed(() => {
  // Mock logic: Risks invalid for > 30 days or specifically marked
  return riskStore.risks.filter(r => r.status === 'Published').slice(0, 3) 
})

// Navigation/View Logic
const availableRoles = computed(() => {
  const roles: { key: string; label: string }[] = []
  // Basic logic: Everyone can be a risk owner or action owner technically, 
  // but let's prioritize primary roles. 
  // For this generic dashboard, we'll offer all views if they have permissions or if it's open.
  
  if (authStore.hasRole(['RiskManagement', 'Admin'])) {
    roles.push({ key: 'management', label: 'Risk Management' })
  }
  roles.push({ key: 'owner', label: 'My Risks' })
  roles.push({ key: 'action', label: 'My Actions' })
  
  return roles
})

// Set default active view based on role
watchEffect(() => {
  if (authStore.hasRole(['RiskManagement', 'Admin']) && activeView.value === 'owner' && isLoading.value) {
    activeView.value = 'management'
  }
})

// Stats for Risk Owner
const riskOwnerStats = computed(() => [
  { label: 'Assigned Risks', value: riskStore.risks.length, trend: 'neutral' as const }, // Need specific "My Risks" count
  { label: 'Pending Ratings', value: ratingStore.pendingCount, trend: 'up' as const },
  { label: 'Questions', value: questionStore.openCount, trend: 'down' as const },
])

// Stats for Action Owner
const actionOwnerStats = computed(() => [
  { label: 'My Actions', value: mitigationStore.mitigationCount, trend: 'neutral' as const },
  { label: 'Overdue', value: mitigationStore.overdueCount, trend: 'down' as const, change: mitigationStore.overdueCount > 0 ? 'Action Needed' : 'Good' },
  { label: 'Completed', value: mitigationStore.completedMitigations.length, trend: 'up' as const },
])

onMounted(async () => {
  isLoading.value = true
  try {
    // Parallel data fetching based on likely needs
    const promises = []
    
    // Always fetch user's tasks
    promises.push(ratingStore.fetchPendingRatings())
    promises.push(questionStore.fetchMyQuestions())
    promises.push(mitigationStore.fetchMyMitigations())
    
    // If Management, fetch broader data
    if (authStore.hasRole(['RiskManagement', 'Admin'])) {
      promises.push(riskStore.fetchRisks()) // Fetch all risks for the table
      promises.push(questionStore.fetchUnansweredQuestions().then(res => unansweredQuestions.value = res))
    } else {
      // Just fetch my affiliated risks
      promises.push(riskStore.fetchMyRisks())
    }

    await Promise.all(promises)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})

// Mock Actions
const exportToExcel = () => {
  showSuccess('Dashboard exported to Excel')
}

const sendEmailDigest = () => {
  showSuccess('Email digest sent to ' + authStore.userEmail)
}
</script>