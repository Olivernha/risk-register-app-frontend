<template>
  <div class="space-y-6 fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">User Management</h1>
        <p class="text-slate-500 mt-1">Manage system users and their roles</p>
      </div>
      <button 
        @click="openCreateModal"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm font-medium"
      >
        <span class="mr-2">Add User</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Filters and Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-slate-500 text-sm font-medium">Total Users</div>
        <div class="text-2xl font-bold text-slate-900 mt-1">{{ users.length }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-slate-500 text-sm font-medium">Risk Owners</div>
        <div class="text-2xl font-bold text-indigo-600 mt-1">{{ roleCount('RiskOwner') }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-slate-500 text-sm font-medium">Action Owners</div>
        <div class="text-2xl font-bold text-emerald-600 mt-1">{{ roleCount('ActionOwner') }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-slate-500 text-sm font-medium">Risk Management</div>
        <div class="text-2xl font-bold text-amber-600 mt-1">{{ roleCount('RiskManagement') }}</div>
      </div>
    </div>

    <!-- User Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">Role</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">Department</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="user in users" :key="user.userId" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-medium text-slate-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="roleBadgeColor(user.role)"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ user.department }}</td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'"
                >
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="openEditModal(user)"
                  class="text-indigo-600 hover:text-indigo-900 font-medium text-sm mr-4"
                >
                  Edit
                </button>
                <button 
                  @click="confirmDelete(user)"
                  class="text-rose-600 hover:text-rose-900 font-medium text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Modal -->
    <Modal
      :is-open="showModal"
      :title="isEditing ? 'Edit User' : 'Add New User'"
      size="md"
      @close="showModal = false"
    >
      <form @submit.prevent="saveUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input 
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="email@example.com"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select 
              v-model="formData.role"
              required
              class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <input 
              v-model="formData.department"
              type="text"
              required
              class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. Finance"
            />
          </div>
        </div>
        <div class="flex items-center mt-4">
          <input 
            v-model="formData.active"
            id="user-active"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <label for="user-active" class="ml-2 block text-sm text-slate-700">
            Active Account
          </label>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button 
            type="button"
            @click="showModal = false"
            class="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium disabled:opacity-50"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import userService from '@/api/users'
import type { User, UserRole } from '@/types'
import Modal from '@/components/common/Modal.vue'
import { useConfirmStore } from '@/stores/confirm'

const users = ref<User[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const selectedUser = ref<User | null>(null)

const confirmStore = useConfirmStore()

const roles: UserRole[] = ['Admin', 'RiskManagement', 'RiskOwner', 'ActionOwner', 'HOD', 'User']

const formData = reactive({
  name: '',
  email: '',
  role: 'User' as UserRole,
  department: '',
  active: true
})

const fetchUsers = async () => {
  loading.value = true
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const roleCount = (role: UserRole) => {
  return users.value.filter(u => u.role === role).length
}

const roleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'Admin': return 'bg-purple-100 text-purple-700'
    case 'RiskManagement': return 'bg-amber-100 text-amber-700'
    case 'RiskOwner': return 'bg-indigo-100 text-indigo-700'
    case 'ActionOwner': return 'bg-emerald-100 text-emerald-700'
    case 'HOD': return 'bg-blue-100 text-blue-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.role = 'User'
  formData.department = ''
  formData.active = true
}

const openCreateModal = () => {
  isEditing.value = false
  selectedUser.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (user: User) => {
  isEditing.value = true
  selectedUser.value = user
  formData.name = user.name
  formData.email = user.email
  formData.role = user.role
  formData.department = user.department
  formData.active = user.active
  showModal.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    if (isEditing.value && selectedUser.value) {
      await userService.updateUser(selectedUser.value.userId, formData)
    } else {
      // Mock generate userId for json-server if not provided
      const newUserData = {
        ...formData,
        userId: `U${Date.now()}`
      }
      await userService.createUser(newUserData as any)
    }
    await fetchUsers()
    showModal.value = false
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (user: User) => {
  const confirmed = await confirmStore.ask({
    title: 'Delete User',
    message: `Are you sure you want to delete user ${user.name}? This action cannot be undone.`,
    type: 'error',
    confirmText: 'Delete'
  })

  if (confirmed) {
    try {
      await userService.deleteUser(user.userId)
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

onMounted(fetchUsers)
</script>
