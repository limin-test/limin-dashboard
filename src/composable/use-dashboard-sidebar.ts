export function useDashboardSidebar () {
  const activeItem = ref('dashboard')

  function selectNavigationItem (itemValue: string) {
    activeItem.value = itemValue
  }

  return {
    activeItem,
    selectNavigationItem,
  }
}
