/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'liminLight',
    themes: {
      liminLight: {
        dark: false,
        colors: {
          background: '#F6F8FB',
          surface: '#FFFFFF',
          primary: '#2D9BF0',
          secondary: '#0B71C7',
          success: '#1E9C6D',
          warning: '#EAA11C',
          error: '#D94A4A',
        },
      },
    },
  },
})
