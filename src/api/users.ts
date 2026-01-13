import api from '@/plugins/axios'
import type { User, UserRole } from '@/types'

class UserService {
  /**
   * Get all users
   */
  async getUsers() {
    const response = await api.get<User[]>('/users')
    return Array.isArray(response.data) ? response.data : []
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole) {
    const response = await api.get<User[]>('/users')
    // Filter by role since json-server doesn't support complex queries
    return response.data.filter(user => user.role === role)
  }

  /**
   * Get a single user by ID
   */
  async getUser(id: string) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }

  /**
   * Create a new user
   */
  async createUser(data: Omit<User, 'permissions'>) {
    // Add default permissions based on role if needed
    const newUser = {
      ...data,
      permissions: [], // Default empty or based on role
      active: true
    }
    const response = await api.post<User>('/users', newUser)
    return response.data
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: Partial<User>) {
    const response = await api.patch<User>(`/users/${id}`, data)
    return response.data
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

export default new UserService()

