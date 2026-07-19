export interface CreateQuotePayload {
  description: string
  dryDockId: string
  title: string
}

export interface DryDockApi {
  id: string
  name: string
}

export interface QuoteApi {
  code: string
  customerName: string
  description: string
  id: string
  position: number
  status: string
  title: string
  updatedAt: string
  version: number
}

export interface QuoteApprovalBoardItemApi {
  dryDock: DryDockApi
  quotes: QuoteApi[]
}

export interface QuoteApprovalBoardMetaApi {
  nextCursor: string | null
  totalQuotes: number
}

export interface QuoteApprovalBoardResponse {
  data: QuoteApprovalBoardItemApi[]
  meta: QuoteApprovalBoardMetaApi
}

export interface QuoteDetailApi {
  costSummary: number
  dryDock: DryDockApi
  quote: QuoteApi
}

export interface UpdateQuotePlacementPayload {
  beforeQuoteId: string | null
  dryDockId: string
  version: number
}
