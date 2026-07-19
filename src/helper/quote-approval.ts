import type {
  QuoteApproval,
  QuoteApprovalColumn,
  QuoteApprovalDetail,
  QuoteApprovalStatusTone,
} from '@/model/dashboard'
import type {
  QuoteApi,
  QuoteApprovalBoardResponse,
  QuoteDetailApi,
} from '@/model/quote-api'

const avatarColors = [
  '#274C5E',
  '#A6392F',
  '#0E7587',
  '#5B4636',
  '#495057',
  '#5B6B83',
  '#7A5A3A',
  '#33658A',
]

const statusPresentation: Record<string, { label: string, tone: QuoteApprovalStatusTone }> = {
  approved: { label: 'Approved', tone: 'success' },
  awaiting_finance: { label: 'Awaiting finance', tone: 'primary' },
  clarification_needed: { label: 'Clarification needed', tone: 'error' },
  draft: { label: 'Draft', tone: 'primary' },
  needs_review: { label: 'Needs review', tone: 'warning' },
  ready_to_approve: { label: 'Ready to approve', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'error' },
}

function getAvatarColor (value: string) {
  const colorIndex = Array.from(value).reduce((total, character) => total + (character.codePointAt(0) || 0), 0) % avatarColors.length

  return avatarColors[colorIndex] || avatarColors[0]
}

function getInitials (value: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word.charAt(0).toLocaleUpperCase())
    .join('')

  return initials || 'QT'
}

function getStatusPresentation (status: string) {
  const presentation = statusPresentation[status]

  if (presentation) {
    return presentation
  }

  return {
    label: status.replaceAll('_', ' ').replace(/\b\w/g, character => character.toLocaleUpperCase()),
    tone: 'secondary' as const,
  }
}

export function mapQuoteApproval (quote: QuoteApi): QuoteApproval {
  const customerName = quote.customerName || quote.title
  const presentation = getStatusPresentation(quote.status)

  return {
    avatarColor: getAvatarColor(quote.id),
    code: quote.code,
    customerName,
    description: quote.description,
    id: quote.id,
    initials: getInitials(customerName),
    position: quote.position,
    statusLabel: presentation.label,
    statusTone: presentation.tone,
    title: quote.title,
    version: quote.version,
  }
}

export function mapQuoteApprovalBoard (response: QuoteApprovalBoardResponse): QuoteApprovalColumn[] {
  return response.data.map(item => ({
    dockName: item.dryDock.name,
    id: item.dryDock.id,
    quotes: item.quotes.map(quote => mapQuoteApproval(quote)),
  }))
}

export function mapQuoteApprovalDetail (response: QuoteDetailApi): QuoteApprovalDetail {
  return {
    dockName: response.dryDock.name,
    quote: mapQuoteApproval(response.quote),
  }
}
