import api from '@/plugins/axios'
import type { User, UserRole } from '@/types'

class UserService {
  /**
   * Get all users
   */
  async getUsers() {
    const response = await api.get<User[]>('/users')
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
   * Get a single user by ID
   */
  async getUser(id: string) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }
}

export default new UserService()

