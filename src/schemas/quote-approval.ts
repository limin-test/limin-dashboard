import type { QuoteApprovalDraft } from '@/model/dashboard'

function requiredText (fieldName: string) {
  return (value: string) => value.trim().length > 0 || `${fieldName} wajib diisi.`
}

export function createQuoteApprovalDraft (): QuoteApprovalDraft {
  return {
    description: '',
    title: '',
  }
}

export const quoteApprovalDraftRules = {
  description: [requiredText('Deskripsi')],
  title: [requiredText('Judul')],
}

export function isQuoteApprovalDraftValid (draft: QuoteApprovalDraft) {
  return draft.description.trim().length > 0 && draft.title.trim().length > 0
}
