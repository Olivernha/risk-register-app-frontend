<template>
  <div class="space-y-6 fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">User Management</h1>
        <p class="text-slate-500 mt-1">Manage system users and their roles</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="openCreateModalWithRole('RiskOwner')"
          class="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all shadow-sm font-medium text-sm"
        >
          Add Risk Owner
        </button>
        <button 
          @click="openCreateModalWithRole('ActionOwner')"
          class="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all shadow-sm font-medium text-sm"
        >
          Add Action Owner
        </button>
        <button 
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm font-medium"
        >
          <span class="mr-2 text-sm">Add Other User</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters and Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-slate-500 text-sm font-medium">Total Users</div>
        <div class="text-2xl font-bold text-slate-900 mt-1">{{ users.length }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all" @click="searchQuery = ''; filterRole = 'RiskOwner'">
        <div class="text-slate-500 text-sm font-medium">Risk Owners</div>
        <div class="text-2xl font-bold text-indigo-600 mt-1">{{ roleCount('RiskOwner') }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-300 transition-all" @click="searchQuery = ''; filterRole = 'ActionOwner'">
        <div class="text-slate-500 text-sm font-medium">Action Owners</div>
        <div class="text-2xl font-bold text-emerald-600 mt-1">{{ roleCount('ActionOwner') }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-slate-500 text-sm font-medium">Risk Management</div>
        <div class="text-2xl font-bold text-amber-600 mt-1">{{ roleCount('RiskManagement') }}</div>
      </div>
    </div>

    <!-- Search and Quick Filters -->
    <div class="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div class="relative flex-1 group">
        <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search owners by name or email..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>
      <select 
        v-model="filterRole"
        class="w-full md:w-48 px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
      >
        <option value="All">All Roles</option>
        <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
      </select>
      <button 
        @click="searchQuery = ''; filterRole = 'All'"
        class="text-sm text-slate-500 hover:text-indigo-600 font-medium px-2"
      >
        Reset
      </button>
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
            <tr v-for="user in filteredUsers" :key="user.userId" class="hover:bg-slate-50 transition-colors">
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
            :class="{ 'border-rose-500 focus:ring-rose-500': formData.email && !formData.email.toLowerCase().endsWith('@tuaspower.com.sg') }"
            placeholder="username@tuaspower.com.sg"
          />
          <p v-if="formData.email && !formData.email.toLowerCase().endsWith('@tuaspower.com.sg')" class="mt-1 text-xs text-rose-500">
            Email must be a valid @tuaspower.com.sg address
          </p>
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
import { ref, onMounted, reactive, computed } from 'vue'
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
const searchQuery = ref('')
const filterRole = ref('All')

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = filterRole.value === 'All' || user.role === filterRole.value
    
    return matchesSearch && matchesRole
  })
})

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

const openCreateModalWithRole = (role: UserRole) => {
  openCreateModal()
  formData.role = role
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
  if (!formData.email.toLowerCase().endsWith('@tuaspower.com.sg')) {
    alert('Please enter a valid @tuaspower.com.sg email address.')
    return
  }

  saving.value = true
  try {
    if (isEditing.value && selectedUser.value) {
      await userService.updateUser(selectedUser.value.userId, formData)
    } else {
      // json-server requires an 'id' field for internal routing and auto-generation
      const newUserId = `U${Date.now()}`
      const newUserData = {
        ...formData,
        userId: newUserId,
        id: newUserId
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
