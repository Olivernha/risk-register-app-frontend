import api from '@/plugins/axios'
import type { User, UserRole } from '@/types'

export interface CreateUserRequest {
  name: string
  email: string
  role: UserRole
  department: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  department?: string
  active?: boolean
}

class UserService {
  /**
   * Get all users
   */
  async getUsers() {
    const response = await api.get<User[]>('/users')
    return response.data
  }

  /**
   * Get a specific user by ID
   */
  async getUser(id: string) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }

  /**
   * Create a new user (Admin only)
   */
  async createUser(data: CreateUserRequest) {
    const response = await api.post<User>('/users', data)
    return response.data
  }

  /**
   * Update a user (Admin only)
   */
  async updateUser(id: string, data: UpdateUserRequest) {
    const response = await api.patch<User>(`/users/${id}`, data)
    return response.data
  }

  /**
   * Deactivate a user (Admin only)
   */
  async deactivateUser(id: string) {
    const response = await api.patch<User>(`/users/${id}`, { active: false })
    return response.data
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole) {
    const response = await api.get<User[]>('/users', {
      params: { role },
    })
    return response.data
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(department: string) {
    const response = await api.get<User[]>('/users', {
      params: { department },
    })
    return response.data
  }
}

export default new UserService()
