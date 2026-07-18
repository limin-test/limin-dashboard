import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import vuetify from '@/plugins/vuetify'

async function mountDefaultLayout () {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        component: {
          template: '<div>Dashboard content</div>',
        },
        path: '/',
      },
    ],
  })

  await router.push('/')
  await router.isReady()

  return mount(DefaultLayout, {
    attachTo: document.body,
    global: {
      plugins: [router, vuetify],
    },
  })
}

describe('DefaultLayout', () => {
  it('renders the application shell around the routed dashboard page', async () => {
    const wrapper = await mountDefaultLayout()

    expect(wrapper.text()).toContain('Dry Dock')
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Dashboard content')
  })
})
