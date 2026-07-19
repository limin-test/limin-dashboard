import type { ApiResponse } from '@/model/api'
import type {
  CreateQuotePayload,
  QuoteApi,
  QuoteApprovalBoardResponse,
  QuoteDetailApi,
  UpdateQuotePlacementPayload,
} from '@/model/quote-api'
import { requestApi } from '@/api/http'

function unwrapApiResponse<T> (response: ApiResponse<T> | T): T {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return response.data as T
  }

  return response
}

export function createQuote (payload: CreateQuotePayload) {
  return requestApi<ApiResponse<QuoteApi> | QuoteApi>('/quotes', {
    body: JSON.stringify(payload),
    method: 'POST',
  }).then(unwrapApiResponse)
}

export function getQuoteApprovalBoard (search = '') {
  const query = new URLSearchParams({ limit: '50' })

  if (search.trim()) {
    query.set('search', search.trim())
  }

  return requestApi<QuoteApprovalBoardResponse>(`/dashboard/quote-approvals?${query.toString()}`)
}

export function getQuoteDetail (quoteId: string) {
  return requestApi<ApiResponse<QuoteDetailApi> | QuoteDetailApi>(`/quotes/${encodeURIComponent(quoteId)}`)
    .then(unwrapApiResponse)
}

export function updateQuotePlacement (quoteId: string, payload: UpdateQuotePlacementPayload) {
  return requestApi<ApiResponse<QuoteApi> | QuoteApi>(`/quotes/${encodeURIComponent(quoteId)}/placement`, {
    body: JSON.stringify(payload),
    method: 'PATCH',
  }).then(unwrapApiResponse)
}
