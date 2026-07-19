import type {
  QuoteApproval,
  QuoteApprovalColumn,
  QuoteApprovalDraft,
} from '@/model/dashboard'
import {
  createQuote as createQuoteRequest,
  getQuoteApprovalBoard,
  updateQuotePlacement,
} from '@/api/quote-approval-service'
import { mapQuoteApprovalBoard } from '@/helper/quote-approval'

const approvalColumns = ref<QuoteApprovalColumn[]>([])
const isBoardLoading = ref(false)
const searchQuery = ref('')
let latestBoardRequest = 0

export function resetDashboard () {
  approvalColumns.value = []
  isBoardLoading.value = false
  latestBoardRequest = 0
  searchQuery.value = ''
}

export function useDashboard () {
  const matchingQuoteCount = computed(() => approvalColumns.value.reduce((total, column) => total + column.quotes.length, 0))

  function loadApprovalBoard () {
    const requestId = latestBoardRequest + 1

    latestBoardRequest = requestId
    isBoardLoading.value = true

    return getQuoteApprovalBoard(searchQuery.value)
      .then(response => {
        if (requestId === latestBoardRequest) {
          approvalColumns.value = mapQuoteApprovalBoard(response)
        }
      })
      .catch(console.error)
      .finally(() => {
        if (requestId === latestBoardRequest) {
          isBoardLoading.value = false
        }
      })
  }

  function createQuote (columnId: string, draft: QuoteApprovalDraft) {
    const title = draft.title.trim()
    const description = draft.description.trim()

    if (!title || !description) {
      return Promise.resolve()
    }

    return createQuoteRequest({
      description,
      dryDockId: columnId,
      title,
    })
      .then(loadApprovalBoard)
      .catch(console.error)
  }

  function persistQuotePlacement (quoteId: string, dryDockId: string, beforeQuoteId: string | null) {
    const quote = approvalColumns.value
      .flatMap(column => column.quotes)
      .find(item => item.id === quoteId)

    if (!quote) {
      return loadApprovalBoard()
    }

    return updateQuotePlacement(quoteId, {
      beforeQuoteId,
      dryDockId,
      version: quote.version,
    })
      .then(loadApprovalBoard)
      .catch(console.error)
  }

  function replaceQuotes (columnId: string, quotes: QuoteApproval[]) {
    const targetColumn = approvalColumns.value.find(column => column.id === columnId)

    if (!targetColumn) {
      return
    }

    targetColumn.quotes = quotes
  }

  return {
    approvalColumns,
    createQuote,
    isBoardLoading,
    loadApprovalBoard,
    matchingQuoteCount,
    persistQuotePlacement,
    replaceQuotes,
    searchQuery,
  }
}
