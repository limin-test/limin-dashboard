/**
 * router/index.ts
 *
 * File-based routes generated from ./src/pages/*.vue
 */

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior () {
    return {
      top: 0,
    }
  },
})

export default router
