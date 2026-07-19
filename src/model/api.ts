export interface ApiErrorResponse {
  error?: {
    code?: string
    message?: string
  }
  errors?: string[]
  message?: string
}

export interface ApiResponse<T> {
  data: T
}
