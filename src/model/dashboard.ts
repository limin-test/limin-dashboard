export interface DashboardNavigationItem {
  icon: string
  label: string
  value: string
}

export interface QuoteApproval {
  avatarColor: string
  code: string
  customerName: string
  description: string
  id: string
  initials: string
  statusLabel: string
  statusTone: string
  title: string
}

export interface QuoteApprovalDraft {
  description: string
  title: string
}

export interface QuoteApprovalColumn {
  dockName: string
  id: string
  quotes: QuoteApproval[]
}

export interface QuoteMove {
  destinationColumnId: string
  destinationIndex: number
  quoteId: string
  sourceColumnId: string
}
