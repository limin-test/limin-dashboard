import type { QuoteApproval } from '@/model/dashboard'

export function useQuoteApprovalCard (getQuote: () => QuoteApproval) {
  const cardTitle = computed(() => {
    const quote = getQuote()

    return quote.statusLabel === 'Draft' ? quote.title : quote.customerName
  })
  const cardSubtitle = computed(() => {
    const quote = getQuote()

    return quote.statusLabel === 'Draft' ? quote.description : quote.code
  })

  return {
    cardSubtitle,
    cardTitle,
  }
}
