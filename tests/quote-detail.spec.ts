import type { QuoteDetailApi } from '@/model/quote-api'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import QuoteDetailPage from '@/pages/quotes/[quoteId].vue'
import vuetify from '@/plugins/vuetify'

const serviceMocks = vi.hoisted(() => ({
  getQuoteDetail: vi.fn(),
}))

vi.mock('@/api/quote-approval-service', () => serviceMocks)

const quoteDetail: QuoteDetailApi = {
  costSummary: 125_000,
  dryDock: {
    id: 'dock_01',
    name: 'Ocean Star',
  },
  quote: {
    code: 'SEPT2020/DD1',
    customerName: 'Kempell',
    description: 'Review labor estimate and supplier coverage before approval.',
    id: 'quote_01',
    position: 1,
    status: 'needs_review',
    title: 'Labor quotation',
    updatedAt: '2026-07-18T00:00:00.000Z',
    version: 3,
  },
}

async function mountQuoteDetailPage (quoteId: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        component: QuoteDetailPage,
        path: '/quotes/:quoteId',
      },
    ],
  })

  await router.push(`/quotes/${quoteId}`)
  await router.isReady()

  return mount(QuoteDetailPage, {
    global: {
      plugins: [vuetify, router],
    },
  })
}

describe('QuoteDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    serviceMocks.getQuoteDetail.mockResolvedValue(quoteDetail)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads the selected quote using the current route parameter', async () => {
    const wrapper = await mountQuoteDetailPage('quote_01')

    await flushPromises()

    expect(serviceMocks.getQuoteDetail).toHaveBeenCalledWith('quote_01')
    expect(wrapper.text()).toContain('Ocean Star')
    expect(wrapper.text()).toContain('SEPT2020/DD1')
    expect(wrapper.text()).toContain('Kempell')
    expect(wrapper.text()).toContain('Labor quotation')
    expect(wrapper.find('a[aria-label="Back to dashboard"]').attributes('href')).toBe('/')
  })

  it('shows a helpful state when the service cannot find the quote', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    serviceMocks.getQuoteDetail.mockRejectedValue(new Error('Not found'))

    const wrapper = await mountQuoteDetailPage('missing-quote')

    await flushPromises()

    expect(wrapper.text()).toContain('Quote not found')
    expect(wrapper.find('a[href="/"]').text()).toBe('Return to dashboard')
    expect(consoleError).toHaveBeenCalled()
  })
})
