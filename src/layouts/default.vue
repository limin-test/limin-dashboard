<template>
  <v-app class="dashboard-app">
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
  import { useDefaultLayout } from '@/composable/use-default-layout'
  import DashboardSidebar from './components/DashboardSidebar.vue'

  const { drawerOpen, mobile } = useDefaultLayout()
</script>

<style scoped>
  .dashboard-app {
    background: rgb(var(--v-theme-background));
  }

  .dashboard-main {
    min-height: 100dvh;
  }
</style>
