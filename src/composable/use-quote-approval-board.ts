import { useDashboard } from '@/composable/use-dashboard'

export function useQuoteApprovalBoard () {
  const dashboard = useDashboard()
  let searchTimeout: ReturnType<typeof setTimeout> | undefined

  function scheduleBoardLoad () {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      void dashboard.loadApprovalBoard()
    }, 250)
  }

  onMounted(() => {
    void dashboard.loadApprovalBoard()
  })

  onScopeDispose(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
  })

  watch(dashboard.searchQuery, scheduleBoardLoad)

  return dashboard
}
