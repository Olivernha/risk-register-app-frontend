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
}

export default new UserService()

