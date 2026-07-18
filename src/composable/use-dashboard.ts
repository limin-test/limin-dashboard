import type {
  QuoteApproval,
  QuoteApprovalColumn,
  QuoteApprovalDraft,
  QuoteMove,
} from '@/model/dashboard'

const initialApprovalColumns: QuoteApprovalColumn[] = [
  {
    dockName: 'Ocean Star',
    id: 'ocean-star',
    quotes: [
      {
        avatarColor: '#274C5E',
        code: 'SEPT2020/DD1',
        customerName: 'Kempell',
        description: 'Review labor estimate and supplier coverage before approval.',
        id: 'quote-kempell',
        initials: 'KE',
        statusLabel: 'Needs review',
        statusTone: 'warning',
        title: 'Labor quotation',
      },
      {
        avatarColor: '#5B6B83',
        code: 'SEPT2020/DD4',
        customerName: 'Harborline Marine',
        description: 'Confirm the revised dry dock window with the operations team.',
        id: 'quote-harborline',
        initials: 'HM',
        statusLabel: 'Ready to approve',
        statusTone: 'success',
        title: 'Docking schedule',
      },
    ],
  },
  {
    dockName: 'MV Glory',
    id: 'mv-glory',
    quotes: [
      {
        avatarColor: '#A6392F',
        code: 'SEPT2020/DD1',
        customerName: 'Bombay Dockyard',
        description: 'Validate material pricing against the latest procurement list.',
        id: 'quote-bombay',
        initials: 'BD',
        statusLabel: 'Needs review',
        statusTone: 'warning',
        title: 'Hull maintenance',
      },
      {
        avatarColor: '#7A5A3A',
        code: 'SEPT2020/DD5',
        customerName: 'Mooring Works',
        description: 'Check the contingency amount before it moves to finance.',
        id: 'quote-mooring',
        initials: 'MW',
        statusLabel: 'Awaiting finance',
        statusTone: 'primary',
        title: 'Mooring equipment',
      },
    ],
  },
  {
    dockName: 'MV Happy',
    id: 'mv-happy',
    quotes: [
      {
        avatarColor: '#0E7587',
        code: 'OCT2020/DD2',
        customerName: 'Hindustan Shipyard Limited',
        description: 'Align scope details with the current work order revision.',
        id: 'quote-hindustan',
        initials: 'HS',
        statusLabel: 'Needs review',
        statusTone: 'warning',
        title: 'Engine room scope',
      },
      {
        avatarColor: '#33658A',
        code: 'OCT2020/DD6',
        customerName: 'Seaway Services',
        description: 'The approval package is complete and ready for sign-off.',
        id: 'quote-seaway',
        initials: 'SS',
        statusLabel: 'Ready to approve',
        statusTone: 'success',
        title: 'Safety equipment',
      },
    ],
  },
  {
    dockName: 'MV Judas',
    id: 'mv-judas',
    quotes: [
      {
        avatarColor: '#5B4636',
        code: 'OCT2020/DD2',
        customerName: 'Timblo Drydocks Private Limited',
        description: 'Review the submitted paint-system specification with QA.',
        id: 'quote-timblo',
        initials: 'TD',
        statusLabel: 'Awaiting finance',
        statusTone: 'primary',
        title: 'Paint system',
      },
    ],
  },
  {
    dockName: 'MT Vega',
    id: 'mt-vega',
    quotes: [
      {
        avatarColor: '#495057',
        code: 'OCT2020/DD8',
        customerName: 'Sembawang Shipyard',
        description: 'A technical clarification is required before approval.',
        id: 'quote-sembawang',
        initials: 'SS',
        statusLabel: 'Clarification needed',
        statusTone: 'error',
        title: 'Propeller inspection',
      },
    ],
  },
]

function copyApprovalColumns () {
  return initialApprovalColumns.map(column => ({
    ...column,
    quotes: column.quotes.map(quote => ({ ...quote })),
  }))
}

export function useDashboard () {
  const searchQuery = ref('')
  const approvalColumns = ref<QuoteApprovalColumn[]>(copyApprovalColumns())
  const draftCount = ref(1)

  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase())
  const matchingQuoteCount = computed(() => approvalColumns.value.reduce(
    (total, column) => total + column.quotes.filter(quote => {
      if (!normalizedSearchQuery.value) {
        return true
      }

      return [quote.code, quote.customerName, quote.title].some(value => (
        value.toLocaleLowerCase().includes(normalizedSearchQuery.value)
      ))
    }).length,
    0,
  ))

  function createQuote (columnId: string, draft: QuoteApprovalDraft) {
    const targetColumn = approvalColumns.value.find(column => column.id === columnId)

    if (!targetColumn) {
      return
    }

    const title = draft.title.trim()
    const description = draft.description.trim()

    if (!title || !description) {
      return
    }

    const draftNumber = draftCount.value

    targetColumn.quotes.push({
      avatarColor: '#547AA5',
      code: `DRAFT-${String(draftNumber).padStart(3, '0')}`,
      customerName: title,
      description,
      id: `draft-${columnId}-${draftNumber}`,
      initials: 'NQ',
      statusLabel: 'Draft',
      statusTone: 'primary',
      title,
    })

    draftCount.value += 1
  }

  function moveQuote ({
    destinationColumnId,
    destinationIndex,
    quoteId,
    sourceColumnId,
  }: QuoteMove) {
    const sourceColumn = approvalColumns.value.find(column => column.id === sourceColumnId)
    const destinationColumn = approvalColumns.value.find(column => column.id === destinationColumnId)

    if (!sourceColumn || !destinationColumn) {
      return
    }

    const sourceIndex = sourceColumn.quotes.findIndex(quote => quote.id === quoteId)

    if (sourceIndex === -1) {
      return
    }

    const [movedQuote] = sourceColumn.quotes.splice(sourceIndex, 1)

    if (!movedQuote) {
      return
    }

    const targetIndex = Math.max(0, Math.min(destinationIndex, destinationColumn.quotes.length))

    destinationColumn.quotes.splice(targetIndex, 0, movedQuote)
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
    matchingQuoteCount,
    moveQuote,
    replaceQuotes,
    searchQuery,
  }
}
