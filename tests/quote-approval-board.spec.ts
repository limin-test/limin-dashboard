import type { QuoteApi, QuoteApprovalBoardResponse } from '@/model/quote-api'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import QuoteApprovalBoard from '@/components/dashboard/QuoteApprovalBoard.vue'
import { resetDashboard, useDashboard } from '@/composable/use-dashboard'
import vuetify from '@/plugins/vuetify'
import router from '@/router'

const serviceMocks = vi.hoisted(() => ({
  createQuote: vi.fn(),
  getQuoteApprovalBoard: vi.fn(),
  updateQuotePlacement: vi.fn(),
}))

vi.mock('@/api/quote-approval-service', () => serviceMocks)

const kempellQuote: QuoteApi = {
  code: 'SEPT2020/DD1',
  customerName: 'Kempell',
  description: 'Review labor estimate and supplier coverage before approval.',
  id: 'quote_01',
  position: 1,
  status: 'needs_review',
  title: 'Labor quotation',
  updatedAt: '2026-07-18T00:00:00.000Z',
  version: 3,
}

const boardResponse: QuoteApprovalBoardResponse = {
  data: [
    {
      dryDock: {
        id: 'dock_01',
        name: 'Ocean Star',
      },
      quotes: [kempellQuote],
    },
    {
      dryDock: {
        id: 'dock_02',
        name: 'MV Glory',
      },
      quotes: [
        {
          code: 'SEPT2020/DD2',
          customerName: 'Bombay Dockyard',
          description: 'Validate material pricing against the latest procurement list.',
          id: 'quote_02',
          position: 1,
          status: 'awaiting_finance',
          title: 'Hull maintenance',
          updatedAt: '2026-07-18T00:00:00.000Z',
          version: 2,
        },
      ],
    },
  ],
  meta: {
    nextCursor: null,
    totalQuotes: 2,
  },
}

const boardWithCreatedQuote: QuoteApprovalBoardResponse = {
  ...boardResponse,
  data: [
    {
      ...boardResponse.data[0],
      quotes: [
        kempellQuote,
        {
          code: 'SEPT2020/DD3',
          customerName: 'Kempell',
          description: 'Prepare a new hull cleaning quotation.',
          id: 'quote_03',
          position: 2,
          status: 'draft',
          title: 'Hull cleaning',
          updatedAt: '2026-07-18T00:00:00.000Z',
          version: 1,
        },
      ],
    },
    boardResponse.data[1],
  ],
}

function mountQuoteApprovalBoard () {
  return mount(QuoteApprovalBoard, {
    attachTo: document.body,
    global: {
      plugins: [vuetify, router],
    },
  })
}

describe('QuoteApprovalBoard', () => {
  beforeEach(() => {
    resetDashboard()
    vi.clearAllMocks()
    serviceMocks.createQuote.mockResolvedValue(kempellQuote)
    serviceMocks.getQuoteApprovalBoard.mockResolvedValue(boardResponse)
    serviceMocks.updateQuotePlacement.mockResolvedValue(kempellQuote)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads the quote board from the dashboard service', async () => {
    const wrapper = mountQuoteApprovalBoard()

    await flushPromises()

    expect(serviceMocks.getQuoteApprovalBoard).toHaveBeenCalledWith('')
    expect(wrapper.text()).toContain('Kempell')
    expect(wrapper.text()).toContain('Bombay Dockyard')
  })

  it('uses backend search after the user enters a search term', async () => {
    vi.useFakeTimers()
    const wrapper = mountQuoteApprovalBoard()

    await flushPromises()
    await wrapper.find('input[name="search-pending-quotes"]').setValue('Kempell')
    await vi.advanceTimersByTimeAsync(250)
    await flushPromises()

    expect(serviceMocks.getQuoteApprovalBoard).toHaveBeenLastCalledWith('Kempell')
  })

  it('opens an inline quote form from a dry dock column', async () => {
    const wrapper = mountQuoteApprovalBoard()

    await flushPromises()
    await wrapper.find('button[aria-label="Add quote for Ocean Star"]').trigger('click')

    expect(wrapper.find('input[name="quote-title-dock_01"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="quote-description-dock_01"]').exists()).toBe(true)
  })

  it('creates a quote through the service and refreshes the board', async () => {
    serviceMocks.getQuoteApprovalBoard
      .mockResolvedValueOnce(boardResponse)
      .mockResolvedValueOnce(boardWithCreatedQuote)
    const wrapper = mountQuoteApprovalBoard()

    await flushPromises()
    await wrapper.find('button[aria-label="Add quote for Ocean Star"]').trigger('click')
    await wrapper.find('input[name="quote-title-dock_01"]').setValue('Hull cleaning')
    await wrapper.find('textarea[name="quote-description-dock_01"]').setValue('Prepare a new hull cleaning quotation.')
    await wrapper.find('form.quote-approval-create-form').trigger('submit')
    await flushPromises()

    expect(serviceMocks.createQuote).toHaveBeenCalledWith({
      description: 'Prepare a new hull cleaning quotation.',
      dryDockId: 'dock_01',
      title: 'Hull cleaning',
    })
    expect(wrapper.text()).toContain('Hull cleaning')
    expect(wrapper.text()).toContain('Prepare a new hull cleaning quotation.')
  })

  it('persists a card move with the card version and refreshes the board', async () => {
    const dashboard = useDashboard()

    await dashboard.loadApprovalBoard()
    await dashboard.persistQuotePlacement('quote_01', 'dock_02', 'quote_02')

    expect(serviceMocks.updateQuotePlacement).toHaveBeenCalledWith('quote_01', {
      beforeQuoteId: 'quote_02',
      dryDockId: 'dock_02',
      version: 3,
    })
    expect(serviceMocks.getQuoteApprovalBoard).toHaveBeenCalledTimes(2)
  })

  it('links each avatar to its quote detail page', async () => {
    const wrapper = mountQuoteApprovalBoard()

    await flushPromises()

    const kempellAvatarLink = wrapper.find('a[aria-label="Open Kempell details"]')

    expect(kempellAvatarLink.attributes('href')).toBe('/quotes/quote_01')
  })
})
