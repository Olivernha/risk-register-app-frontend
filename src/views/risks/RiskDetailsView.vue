<template>
  <div class="space-y-6 fade-in">
    <!-- Loading State -->
    <div v-if="!risk" class="p-8 text-center text-gray-500 dark:text-gray-400">
      Loading risk details...
    </div>

    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <button
            @click="$router.push('/risks')"
            class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Risks
          </button>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Risk Details</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ risk.refNo }} - {{ risk.title }}</p>
        </div>
        <div class="flex gap-2">
            <button
            v-if="canPublish"
            @click="handlePublish"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Publish Risk
            </button>
            <button
            v-if="canLock"
            @click="handleLock"
            class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Lock Risk
            </button>
            <button
            v-if="canDelete"
            @click="handleDelete"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Risk
            </button>
            <button
            v-if="canRate"
            @click="$router.push(`/risks/${risk.id}/rate`)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ userHasRated ? 'Update Rating' : 'Rate Risk' }}
            </button>
            <button
            v-if="canEdit"
            @click="$router.push(`/risks/${risk.id}/edit`)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Risk
            </button>
        </div>
      </div>

      <!-- Locked Warning Banner -->
      <div v-if="risk.status === 'Locked'" class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div class="flex-1">
            <h3 class="font-medium text-purple-900 dark:text-purple-100 mb-1">Risk is Locked</h3>
            <p class="text-sm text-purple-700 dark:text-purple-300">
              This risk has been locked for the quarterly cycle. Master data and ratings are read-only. Mitigations can still be updated by action owners.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Risk Information -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ risk.title }}
            </h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ risk.description }}</p>
              </div>
            </div>
          </div>



          <!-- Rating Basis Threads -->
          <div v-if="risk.status !== 'Draft' && risk.ratings && risk.ratings.length > 0" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Rating Discussions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="rating in risk.ratings" 
                :key="rating.ownerId"
                class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                  <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                          {{ risk.owners.find(o => o.userId === rating.ownerId)?.name?.substring(0, 2).toUpperCase() }}
                        </div>
                        <span class="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {{ risk.owners.find(o => o.userId === rating.ownerId)?.name }}
                        </span>
                      </div>
                      <span class="text-xs text-gray-500">{{ formatDate(rating.updatedAt) }}</span>
                  </div>
                  <div class="flex items-center justify-between mb-4">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Current Rating</span>
                      <span class="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                          {{ rating.currentLikelihood }} x {{ rating.currentImpact }}
                      </span>
                  </div>
                  <button 
                    @click="openDiscussion(rating)"
                    class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1 9.77 9.77 0 01-6-6m12-2v3m0 4v.01" />
                    </svg>
                    View Discussion
                  </button>
              </div>
            </div>
          </div>

          <!-- Mitigation Measures -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Mitigation Measures</h3>
              <button
                v-if="canAddMitigation"
                @click="showCreateMitigationModal = true"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Mitigation
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action Item</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Details</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Target Date</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="mitigation in risk.mitigations" :key="mitigation.controlId" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ mitigation.title }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <div class="max-w-xs truncate" :title="stripHtml(mitigation.details)">
                        {{ stripHtml(mitigation.details) }}
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span :class="[
                        'inline-block px-2 py-1 text-xs font-medium rounded',
                        getMitigationStatusClass(mitigation.status)
                      ]">
                        {{ mitigation.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ mitigation.actionOwner.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(mitigation.targetDate) }}</td>
                    <td class="px-4 py-3 text-sm">
                      <button
                        v-if="canUpdateMitigation(mitigation)"
                        @click="openUpdateMitigation(mitigation)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr v-if="risk.mitigations?.length === 0">
                    <td colspan="6" class="px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                      <div class="flex flex-col items-center gap-2">
                        <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No mitigation measures recorded.</p>
                        <button
                          v-if="canAddMitigation"
                          @click="showCreateMitigationModal = true"
                          class="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                        >
                          Add your first mitigation
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Ad-hoc Questions -->
          <QuestionsSection :risk="risk" />
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Risk Owners -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Risk Owners</h3>
            <ul class="space-y-2">
              <li v-for="owner in risk.owners" :key="owner.userId" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                  {{ owner.name?.substring(0, 2).toUpperCase() }}
                </div>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ owner.name }}</span>
              </li>
            </ul>
          </div>

          <!-- Likelihood x Impact -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Likelihood x Impact</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Likelihood</span>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.averageRating?.likelihood || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Impact</span>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ risk.averageRating?.impact || 'N/A' }}</span>
              </div>
              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
                  <span :class="[
                    'inline-block px-2 py-1 text-xs font-medium rounded',
                    getRiskLevelClass(risk.averageRating?.riskLevel)
                  ]">
                    {{ risk.averageRating?.riskLevel || 'Unrated' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Additional Information</h3>
            <div class="space-y-3">
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time Horizon</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ risk.timeHorizon }}</span>
              </div>
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</span>
                <span class="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {{ risk.category }}
                </span>
              </div>
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Status</span>
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded',
                  getStatusClass(risk.status)
                ]">
                  {{ risk.status }}
                </span>
              </div>
              <div>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit?.updatedAt) }}</span>
              </div>
              <div v-if="risk.status === 'Locked' && risk.audit?.lockedBy">
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Locked By</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ risk.audit.lockedBy }}</span>
              </div>
              <div v-if="risk.status === 'Locked' && risk.audit?.lockedAt">
                <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Locked At</span>
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(risk.audit.lockedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>



    <CreateMitigationModal
      :is-open="showCreateMitigationModal"
      :risk-id="risk?.id || ''"
      :risk-ref="risk?.refNo || ''"
      @close="showCreateMitigationModal = false"
      @created="handleMitigationCreated"
    />

    <UpdateMitigationModal
      :is-open="showUpdateMitigationModal"
      :risk-id="risk?.id || ''"
      :mitigation="selectedMitigation"
      @close="showUpdateMitigationModal = false"
      @updated="handleMitigationUpdated"
    />

    <Modal
      :is-open="showDiscussionModal"
      size="6xl"
      :title="selectedRatingOwner ? `Basis Discussion: ${selectedRatingOwner.name}` : 'Basis Discussion'"
      @close="showDiscussionModal = false"
    >
      <div v-if="selectedRating && risk" class="max-h-[60vh] overflow-y-auto pr-2">
        <BasisThread
          :thread-id="selectedRating.basisThreadId || null"
          :rating="selectedRating"
          :owner="selectedRatingOwner"
          :risk-id="risk.id"
          :risk-ref="risk.refNo"
          :version="risk.version"
          :is-locked="risk.status === 'Locked'"
          @update-thread-id="(newId) => handleThreadIdUpdate(selectedRating!.ownerId, newId)"
        />
      </div>
    </Modal>
    
    <!-- Delete Reason Modal -->
    <Modal
      :is-open="showDeleteModal"
      title="Delete Risk"
      @close="showDeleteModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this risk? This action cannot be undone.
          Please provide a reason for deletion.
        </p>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for Deletion <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="deleteReason"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter reason for deletion..."
          ></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="!deleteReason.trim()"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRiskStore } from '@/stores/riskStore'
import { useConfirmStore } from '@/stores/confirm'
import BasisThread from '@/components/risks/BasisThread.vue'
import QuestionsSection from '@/components/risks/QuestionsSection.vue'
import CreateMitigationModal from '@/components/mitigations/CreateMitigationModal.vue'
import UpdateMitigationModal from '@/components/mitigations/UpdateMitigationModal.vue'
import Modal from '@/components/common/Modal.vue'
import type { RiskLevel, MitigationStatus, Rating, Mitigation } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const riskStore = useRiskStore()
const confirmStore = useConfirmStore()

const showCreateMitigationModal = ref(false)
const showUpdateMitigationModal = ref(false)
const showDiscussionModal = ref(false)
const showDeleteModal = ref(false)
const deleteReason = ref('')
const selectedRating = ref<Rating | null>(null)
const selectedMitigation = ref<Mitigation | null>(null)

const selectedRatingOwner = computed(() => {
    if (!risk.value || !selectedRating.value) return null
    return risk.value.owners.find((o: any) => o.userId === selectedRating.value!.ownerId) || null
})

function openDiscussion(rating: Rating) {
    selectedRating.value = rating
    showDiscussionModal.value = true
}

function openUpdateMitigation(mitigation: Mitigation) {
  selectedMitigation.value = mitigation
  showUpdateMitigationModal.value = true
}

function canUpdateMitigation(mitigation: Mitigation) {
  if (!risk.value || !authStore.user) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isActionOwner = mitigation.actionOwner.userId === authStore.user.userId
  return isRM || isActionOwner
}

const risk = computed(() => {
  const id = route.params.id as string

  return riskStore.getRiskById(id)
})

const userHasRated = computed(() => {
  if (!risk.value || !authStore.user) return false
  return risk.value.ratings.some(r => r.ownerId === authStore.user?.userId)
})

onMounted(() => {
  const id = route.params.id as string
  riskStore.fetchRiskById(id)
})

watch(risk, (newRisk) => {
  if (newRisk && newRisk.status === 'Draft') {
    const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
    if (!isRM) {
      confirmStore.alert('Access Denied', 'This risk is still a draft and is only visible to Risk Management.')
      router.push('/risks')
    }
  }
})

const canEdit = computed(() => {
  return authStore.hasRole(['RiskManagement', 'Admin'])
})

const canPublish = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isDraft = risk.value.status === 'Draft'
  const hasOwners = risk.value.owners && risk.value.owners.length > 0
  return isRM && isDraft && hasOwners
})

const canDelete = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isDraft = risk.value.status === 'Draft'
  // Check for actual submitted ratings (non-zero)
  const hasNoActualRatings = !risk.value.ratings || risk.value.ratings.every(r => r.currentLikelihood === 0 && r.currentImpact === 0)
  const hasNoMitigations = !risk.value.mitigations || risk.value.mitigations.length === 0
  return isRM && isDraft && hasNoActualRatings && hasNoMitigations
})

const canRate = computed(() => {
  if (!risk.value || !authStore.user) return false
  const isPublished = risk.value.status === 'Published'
  const isOwner = risk.value.owners.some((o: any) => o.userId === authStore.user?.userId)
  return isPublished && isOwner
})

const canLock = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isPublished = risk.value.status === 'Published'
  return isRM && isPublished
})

const canAddMitigation = computed(() => {
  if (!risk.value) return false
  const isRM = authStore.hasRole(['RiskManagement', 'Admin'])
  const isNotDraft = risk.value.status !== 'Draft'
  return isRM && isNotDraft
})

async function handlePublish() {
  if (!risk.value) return
  
  const confirmed = await confirmStore.ask({
    title: 'Publish Risk',
    message: 'Are you sure you want to publish this risk? It will be visible to all assigned owners for rating.'
  })
  
  if (!confirmed) {
    return
  }

  try {
    await riskStore.publishRisk(risk.value.id)
    confirmStore.alert('Success', 'Risk published successfully!')
    // No need to reload, store is reactive
  } catch (e: any) {
    confirmStore.alert('Error', e.message)
  }
}

async function handleDelete() {
  if (!risk.value) return
  deleteReason.value = ''
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!risk.value) return
  
  if (!deleteReason.value.trim()) {
    confirmStore.alert('Required', 'Deletion reason is required.')
    return
  }

  try {
    await riskStore.deleteRisk(risk.value.id, deleteReason.value.trim())
    showDeleteModal.value = false
    await confirmStore.alert('Success', 'Risk deleted successfully.')
    router.push('/risks')
  } catch (e: any) {
    confirmStore.alert('Error', e.message)
  }
}

async function handleLock() {
  if (!risk.value) return

  try {
    // First attempt without override
    await riskStore.lockRisk(risk.value.id, false)
    confirmStore.alert('Success', 'Risk locked successfully!')
  } catch (e: any) {
    // Check if error is due to incomplete ratings
    if (e.message.startsWith('INCOMPLETE_RATINGS:')) {
      const pendingOwners = e.message.substring('INCOMPLETE_RATINGS:'.length)
      const confirmOverride = await confirmStore.ask({
        title: 'Confirm Override',
        message: `Warning: The following owners have not submitted ratings:\n\n${pendingOwners}\n\nDo you want to lock this risk anyway?`,
        confirmText: 'Lock Anyway',
        type: 'warning'
      })
      
      if (confirmOverride) {
        try {
          await riskStore.lockRisk(risk.value.id, true)
          confirmStore.alert('Success', 'Risk locked successfully (with incomplete ratings).')
        } catch (overrideError: any) {
          confirmStore.alert('Error', overrideError.message)
        }
      }
    } else {
      confirmStore.alert('Error', e.message)
    }
  }
}

async function handleMitigationCreated() {
  // Refresh risk data
  const id = route.params.id as string
  await riskStore.fetchRiskById(id)
}

async function handleMitigationUpdated() {
  const id = route.params.id as string
  await riskStore.fetchRiskById(id)
}

function getRiskLevelClass(level?: RiskLevel) {
  switch (level) {
    case 'Very High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

function getMitigationStatusClass(status: MitigationStatus) {
  switch (status) {
    case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'Ongoing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    case 'Not Started': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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

function formatDate(date: string | Date | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

async function handleThreadIdUpdate(ownerId: string, newThreadId: string) {
  if (!risk.value) return

  try {
    const updatedRatings = risk.value.ratings.map(r => 
      r.ownerId === ownerId ? { ...r, basisThreadId: newThreadId } : r
    )
    
    await riskStore.updateRisk(risk.value.id, { ratings: updatedRatings })
  } catch (e) {
    console.error('Failed to update risk with new thread ID', e)
  }
}
</script>
