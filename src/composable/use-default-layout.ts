import { useDisplay } from 'vuetify'

export function useDefaultLayout () {
  const { mobile } = useDisplay({ mobileBreakpoint: 'md' })
  const drawerOpen = ref(true)

  watch(mobile, isMobile => {
    drawerOpen.value = !isMobile
  }, { immediate: true })

  return {
    drawerOpen,
    mobile,
  }
}
