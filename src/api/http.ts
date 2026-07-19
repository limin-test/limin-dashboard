import type { ApiErrorResponse } from '@/model/api'
import { apiBaseUrl } from '@/constants/api'

export class ApiRequestError extends Error {
  readonly status: number

  constructor (status: number, payload: unknown) {
    super(getErrorMessage(status, payload))
    this.name = 'ApiRequestError'
    this.status = status
  }
}

function getErrorMessage (status: number, payload: unknown) {
  if (isApiErrorResponse(payload)) {
    return payload.error?.message || payload.errors?.[0] || payload.message || `Request failed with status ${status}.`
  }

  return `Request failed with status ${status}.`
}

function isApiErrorResponse (payload: unknown): payload is ApiErrorResponse {
  return typeof payload === 'object' && payload !== null
}

function parseResponseBody (response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function requestApi<T> (path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  }).then(response => parseResponseBody(response).then(payload => {
    if (!response.ok) {
      throw new ApiRequestError(response.status, payload)
    }

    return payload as T
  }))
}
