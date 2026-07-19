import type { QuoteApproval, QuoteApprovalColumn, QuoteApprovalDraft } from '@/model/dashboard'
import type { SortableEvent } from 'sortablejs'

export function useQuoteApprovalColumn (
  getColumn: () => QuoteApprovalColumn,
  getSearchQuery: () => string,
  onCreateQuote: (columnId: string, draft: QuoteApprovalDraft) => void,
  onMoveQuote: (quoteId: string, destinationColumnId: string, beforeQuoteId: string | null) => void,
  onUpdateQuotes: (columnId: string, quotes: QuoteApproval[]) => void,
) {
  const isCreateFormOpen = ref(false)
  const normalizedSearchQuery = computed(() => getSearchQuery().trim().toLocaleLowerCase())
  const isSearchActive = computed(() => normalizedSearchQuery.value.length > 0)
  const draggableQuotes = computed<QuoteApproval[]>({
    get: () => getColumn().quotes,
    set: quotes => {
      onUpdateQuotes(getColumn().id, quotes)
    },
  })
  const visibleQuotes = computed(() => getColumn().quotes.filter(quote => {
    if (!normalizedSearchQuery.value) {
      return true
    }

    return [getColumn().dockName, quote.code, quote.customerName, quote.title].some(value => (
      value.toLocaleLowerCase().includes(normalizedSearchQuery.value)
    ))
  }))

  function closeCreateForm () {
    isCreateFormOpen.value = false
  }

  function createQuote (draft: QuoteApprovalDraft) {
    onCreateQuote(getColumn().id, draft)
    closeCreateForm()
  }

  function openCreateForm () {
    isCreateFormOpen.value = true
  }

  function handleDragEnd (event: SortableEvent) {
    const quoteId = event.item.dataset.quoteId
    const destinationColumnId = event.to.dataset.columnId
    const newIndex = event.newIndex

    if (!quoteId || !destinationColumnId || typeof newIndex !== 'number') {
      return
    }

    if (event.from === event.to && event.oldIndex === newIndex) {
      return
    }

    nextTick().then(() => {
      const nextCard = event.to.children.item(newIndex + 1)
      const beforeQuoteId = nextCard instanceof HTMLElement ? nextCard.dataset.quoteId || null : null

      onMoveQuote(quoteId, destinationColumnId, beforeQuoteId)
    })
  }

  return {
    closeCreateForm,
    createQuote,
    draggableQuotes,
    handleDragEnd,
    isCreateFormOpen,
    isSearchActive,
    openCreateForm,
    visibleQuotes,
  }
}
