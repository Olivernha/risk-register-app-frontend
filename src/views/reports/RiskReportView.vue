<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Risk Reports</h1>
        <p class="text-slate-600">Generate comprehensive risk analysis and compliance reports</p>
      </div>
      <button class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export All Reports
      </button>
    </div>

    <!-- Report Types Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Executive Summary Report -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div class="p-6">
          <div class="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Executive Summary</h3>
          <p class="text-sm text-slate-600 mb-4">High-level overview of risk landscape for senior management</p>
          <button class="w-full px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Detailed Risk Analysis -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="h-2 bg-gradient-to-r from-orange-500 to-red-600"></div>
        <div class="p-6">
          <div class="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Detailed Analysis</h3>
          <p class="text-sm text-slate-600 mb-4">Comprehensive breakdown of all risks with ratings and mitigations</p>
          <button class="w-full px-4 py-2 bg-orange-50 text-orange-700 font-medium rounded-lg hover:bg-orange-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Heat Map Report -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="h-2 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
        <div class="p-6">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Heat Map Report</h3>
          <p class="text-sm text-slate-600 mb-4">Visual representation of risk distribution across likelihood and impact</p>
          <button class="w-full px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Trend Analysis -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div class="p-6">
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Trend Analysis</h3>
          <p class="text-sm text-slate-600 mb-4">Historical comparison of risk levels across quarterly versions</p>
          <button class="w-full px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Mitigation Status -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="h-2 bg-gradient-to-r from-purple-500 to-pink-600"></div>
        <div class="p-6">
          <div class="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Mitigation Status</h3>
          <p class="text-sm text-slate-600 mb-4">Progress tracking of all mitigation measures and action items</p>
          <button class="w-full px-4 py-2 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Compliance Report -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="h-2 bg-gradient-to-r from-yellow-500 to-amber-600"></div>
        <div class="p-6">
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Compliance Report</h3>
          <p class="text-sm text-slate-600 mb-4">Regulatory compliance status and audit trail documentation</p>
          <button class="w-full px-4 py-2 bg-yellow-50 text-yellow-700 font-medium rounded-lg hover:bg-yellow-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <h2 class="text-xl font-bold text-slate-900">Recent Reports</h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-for="report in recentReports" :key="report.id" class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900">{{ report.name }}</h3>
                <p class="text-sm text-slate-500">Generated {{ report.date }} • {{ report.size }}</p>
              </div>
            </div>
            <button class="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const recentReports = ref([
  {
    id: 1,
    name: 'Q2 2025 Executive Summary',
    date: '2 days ago',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Detailed Risk Analysis - June 2025',
    date: '1 week ago',
    size: '5.8 MB'
  },
  {
    id: 3,
    name: 'Heat Map Report - Q2 2025',
    date: '2 weeks ago',
    size: '1.2 MB'
  },
])
</script>
