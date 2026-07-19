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
  position: number
  statusLabel: string
  statusTone: QuoteApprovalStatusTone
  title: string
  version: number
}

export type QuoteApprovalStatusTone = 'error' | 'primary' | 'secondary' | 'success' | 'warning'

export interface QuoteApprovalDraft {
  description: string
  title: string
}

export interface QuoteApprovalDetail {
  dockName: string
  quote: QuoteApproval
}

export interface QuoteApprovalColumn {
  dockName: string
  id: string
  quotes: QuoteApproval[]
}
