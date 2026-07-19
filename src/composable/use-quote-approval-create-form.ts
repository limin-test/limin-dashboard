import type { QuoteApprovalDraft } from '@/model/dashboard'
import {
  createQuoteApprovalDraft,
  isQuoteApprovalDraftValid,
} from '@/schemas/quote-approval'

export function useQuoteApprovalCreateForm (
  onCancel: () => void,
  onSubmit: (draft: QuoteApprovalDraft) => void,
) {
  const draft = ref<QuoteApprovalDraft>(createQuoteApprovalDraft())
  const isFormValid = ref<boolean | null>(null)

  function cancel () {
    resetForm()
    onCancel()
  }

  function resetForm () {
    draft.value = createQuoteApprovalDraft()
    isFormValid.value = null
  }

  function submitQuote () {
    if (!isQuoteApprovalDraftValid(draft.value)) {
      return
    }

    onSubmit({
      description: draft.value.description.trim(),
      title: draft.value.title.trim(),
    })
    resetForm()
  }

  return {
    cancel,
    draft,
    isFormValid,
    submitQuote,
  }
}
