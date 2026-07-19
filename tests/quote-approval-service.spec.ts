import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createQuote,
  getQuoteApprovalBoard,
  getQuoteDetail,
  updateQuotePlacement,
} from '@/api/quote-approval-service'

const fetchMock = vi.fn()

function createJsonResponse (body: unknown) {
  return Response.json(body)
}

describe('quote approval service', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the quote approval board with its documented endpoint', async () => {
    fetchMock.mockResolvedValue(createJsonResponse({
      data: [],
      meta: {
        nextCursor: null,
        totalQuotes: 0,
      },
    }))

    await getQuoteApprovalBoard('Ocean Star')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/v1/dashboard/quote-approvals?limit=50&search=Ocean+Star',
      expect.objectContaining({ method: undefined }),
    )
  })

  it('sends only the required payload when creating a quote', async () => {
    fetchMock.mockResolvedValue(createJsonResponse({
      data: {
        code: 'SEPT2020/DD3',
        customerName: 'Kempell',
        description: 'Prepare a new hull cleaning quotation.',
        id: 'quote_03',
        position: 3,
        status: 'draft',
        title: 'Hull cleaning',
        updatedAt: '2026-07-18T00:00:00.000Z',
        version: 1,
      },
    }))

    await createQuote({
      description: 'Prepare a new hull cleaning quotation.',
      dryDockId: 'dock_01',
      title: 'Hull cleaning',
    })

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit]

    expect(request.method).toBe('POST')
    expect(request.body).toBe(JSON.stringify({
      description: 'Prepare a new hull cleaning quotation.',
      dryDockId: 'dock_01',
      title: 'Hull cleaning',
    }))
  })

  it('uses the detail and placement endpoints required by the current UI', async () => {
    fetchMock
      .mockResolvedValueOnce(createJsonResponse({
        data: {
          costSummary: 0,
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
        },
      }))
      .mockResolvedValueOnce(createJsonResponse({
        data: {
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
      }))

    await getQuoteDetail('quote_01')
    await updateQuotePlacement('quote_01', {
      beforeQuoteId: null,
      dryDockId: 'dock_02',
      version: 3,
    })

    const [detailUrl] = fetchMock.mock.calls[0] as [string, RequestInit]
    const [placementUrl, placementRequest] = fetchMock.mock.calls[1] as [string, RequestInit]

    expect(detailUrl).toBe('https://api.test/v1/quotes/quote_01')
    expect(placementUrl).toBe('https://api.test/v1/quotes/quote_01/placement')
    expect(placementRequest.method).toBe('PATCH')
    expect(placementRequest.body).toBe(JSON.stringify({
      beforeQuoteId: null,
      dryDockId: 'dock_02',
      version: 3,
    }))
  })
})
