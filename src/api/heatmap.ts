import api from '@/plugins/axios'

export interface HeatmapCell {
    id: string
    likelihood: number
    impact: number
    riskLevel: string
    color: string
}

class HeatmapService {
    async getHeatmapLookup(): Promise<HeatmapCell[]> {
        const response = await api.get<HeatmapCell[]>('/heatmap')
        return response.data
    }
}

export default new HeatmapService()
