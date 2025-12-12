import api from '@/plugins/axios'
import type { Version, VersionStatus } from '@/types'

export interface CreateVersionRequest {
  cycle: string // Format: "YYYY Qn"
  copyFromVersionId?: string
  riskIdsToCopy?: string[]
}

export interface LockVersionRequest {
  force?: boolean // Force lock even if incomplete
}

export interface UnlockVersionRequest {
  reason: string
}

class VersionService {
  /**
   * Get all versions
   */
  async getVersions() {
    const response = await api.get<Version[]>('/versions')
    return response.data
  }

  /**
   * Get a specific version by ID
   */
  async getVersion(id: string) {
    const response = await api.get<Version>(`/versions/${id}`)
    return response.data
  }

  /**
   * Get the current active version
   */
  async getActiveVersion() {
    const response = await api.get<Version>('/versions/active')
    return response.data
  }

  /**
   * Create a new version
   */
  async createVersion(data: CreateVersionRequest) {
    const response = await api.post<Version>('/versions', data)
    return response.data
  }

  /**
   * Lock a version to finalize quarterly cycle
   */
  async lockVersion(id: string, data?: LockVersionRequest) {
    const response = await api.post<Version>(`/versions/${id}/lock`, data)
    return response.data
  }

  /**
   * Unlock a version (requires admin approval)
   */
  async unlockVersion(id: string, data: UnlockVersionRequest) {
    const response = await api.post<Version>(`/versions/${id}/unlock`, data)
    return response.data
  }

  /**
   * Get version statistics
   */
  async getVersionStatistics(id: string) {
    const response = await api.get(`/versions/${id}/statistics`)
    return response.data
  }

  /**
   * Check version completeness before locking
   */
  async checkVersionCompleteness(id: string) {
    const response = await api.get(`/versions/${id}/completeness`)
    return response.data
  }
}

export default new VersionService()
