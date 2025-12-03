import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#6366F1', // Indigo
          secondary: '#8B5CF6', // Purple
          accent: '#EC4899', // Pink
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          background: '#F8FAFC',
          surface: '#FFFFFF',
          // Risk level colors
          riskLow: '#34D399',
          riskMedium: '#FBBF24',
          riskHigh: '#FB923C',
          riskVeryHigh: '#F43F5E',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#818CF8',
          secondary: '#A78BFA',
          accent: '#F472B6',
          error: '#F87171',
          info: '#60A5FA',
          success: '#34D399',
          warning: '#FBBF24',
          background: '#0F172A',
          surface: '#1E293B',
          // Risk level colors
          riskLow: '#34D399',
          riskMedium: '#FBBF24',
          riskHigh: '#FB923C',
          riskVeryHigh: '#F43F5E',
        },
      },
    },
  },
})

export default vuetify
