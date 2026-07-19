import type { QuoteApprovalDetail } from '@/model/dashboard'
import { getQuoteDetail } from '@/api/quote-approval-service'
import { mapQuoteApprovalDetail } from '@/helper/quote-approval'

const detailSections = [
  'General',
  'Specifications',
  'Tasks',
  'Sourcing',
  'Execution',
  'Reporting',
  'Costs',
  'Purchase Orders',
] as const

export function useQuoteDetail () {
  const route = useRoute('/quotes/[quoteId]')
  const quoteId = computed(() => {
    const quoteIdParam = route.params.quoteId

    return typeof quoteIdParam === 'string' ? quoteIdParam : ''
  })
  const isLoading = ref(false)
  const quoteDetail = ref<QuoteApprovalDetail | null>(null)

  function loadQuoteDetail () {
    const requestedQuoteId = quoteId.value

    if (!requestedQuoteId) {
      quoteDetail.value = null

      return Promise.resolve()
    }

    isLoading.value = true
    quoteDetail.value = null

    return getQuoteDetail(requestedQuoteId)
      .then(response => {
        if (requestedQuoteId === quoteId.value) {
          quoteDetail.value = mapQuoteApprovalDetail(response)
        }
      })
      .catch(console.error)
      .finally(() => {
        if (requestedQuoteId === quoteId.value) {
          isLoading.value = false
        }
      })
  }

  onMounted(() => {
    void loadQuoteDetail()
  })

  watch(quoteId, () => {
    void loadQuoteDetail()
  })

  return {
    detailSections,
    isLoading,
    loadQuoteDetail,
    quoteDetail,
  }
}
