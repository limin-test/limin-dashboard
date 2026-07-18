<template>
  <v-app-bar
    class="dashboard-topbar"
    color="primary"
    elevation="0"
    height="80"
  >
    <v-btn
      v-if="mobile"
      aria-label="Open navigation"
      class="ms-2"
      icon="mdi-menu"
      variant="text"
      @click="$emit('toggle-navigation')"
    />

    <div class="dashboard-topbar__brand">
      <v-avatar
        class="dashboard-topbar__brand-mark"
        color="white"
        size="36"
      >
        <v-icon
          color="primary"
          icon="mdi-dock-bottom"
          size="21"
        />
      </v-avatar>

      <span>Dry Dock</span>
    </div>

    <v-app-bar-title class="dashboard-topbar__title">
      Dashboard
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      aria-label="Notifications"
      class="dashboard-topbar__notification me-3 me-sm-6"
      color="white"
      icon="mdi-bell-outline"
      variant="flat"
    />
  </v-app-bar>
</template>

<script setup lang="ts">
  defineProps({
    mobile: {
      default: false,
      type: Boolean,
    },
  })

  defineEmits(['toggle-navigation'])
</script>

<style scoped>
  .dashboard-topbar {
    color: white;
  }

  .dashboard-topbar__brand {
    align-items: center;
    display: flex;
    font-size: 18px;
    font-weight: 700;
    gap: 10px;
    min-width: 256px;
    padding-inline: 22px;
  }

  .dashboard-topbar__brand-mark {
    box-shadow: 0 4px 14px rgb(7 71 123 / 22%);
  }

  .dashboard-topbar__title {
    font-size: 25px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .dashboard-topbar__notification {
    border-radius: 9px;
    color: #dc9711 !important;
    min-width: 48px;
  }

  @media (max-width: 839px) {
    .dashboard-topbar__brand {
      min-width: auto;
      padding-inline: 8px;
    }

    .dashboard-topbar__brand span {
      display: none;
    }

    .dashboard-topbar__title {
      font-size: 20px;
    }
  }
</style>
