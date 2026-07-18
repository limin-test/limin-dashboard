<template>
  <v-app class="dashboard-app">
    <DashboardTopbar
      :mobile="mobile"
      @toggle-navigation="drawerOpen = !drawerOpen"
    />

    <DashboardSidebar
      v-model="drawerOpen"
      :mobile="mobile"
    />

    <v-main class="dashboard-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useDisplay } from 'vuetify'
  import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
  import DashboardTopbar from '@/components/dashboard/DashboardTopbar.vue'

  const { mobile } = useDisplay({ mobileBreakpoint: 'md' })
  const drawerOpen = ref(true)

  watch(mobile, isMobile => {
    drawerOpen.value = !isMobile
  }, { immediate: true })
</script>

<style scoped>
  .dashboard-app {
    background: rgb(var(--v-theme-background));
  }

  .dashboard-main {
    min-height: 100dvh;
  }
</style>
