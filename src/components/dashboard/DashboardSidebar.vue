<template>
  <v-navigation-drawer
    color="primary"
    :model-value="modelValue"
    :permanent="!mobile"
    :scrim="mobile"
    :temporary="mobile"
    width="256"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-list
      class="dashboard-sidebar__list pt-5"
      nav
    >
      <v-list-item
        v-for="item in dashboardNavigationItems"
        :key="item.value"
        :active="activeItem === item.value"
        base-color="white"
        class="dashboard-sidebar__item mb-1"
        :prepend-icon="item.icon"
        rounded="lg"
        :title="item.label"
        @click="activeItem = item.value"
      />
    </v-list>

    <template #append>
      <div class="dashboard-sidebar__footer px-5 pb-5">
        <v-divider class="mb-4" color="white" opacity="0.22" />
        <div class="text-caption text-white text-medium-emphasis">Limin Operations</div>
        <div class="text-body-2 text-white font-weight-medium">Quote approval workspace</div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { dashboardNavigationItems } from '@/constants/dashboard-navigation'

  defineProps({
    mobile: {
      default: false,
      type: Boolean,
    },
    modelValue: {
      default: true,
      type: Boolean,
    },
  })

  defineEmits(['update:model-value'])

  const activeItem = ref('dashboard')
</script>

<style scoped>
  .dashboard-sidebar__list {
    padding-inline: 12px;
  }

  .dashboard-sidebar__item {
    color: rgb(255 255 255 / 86%);
    font-weight: 500;
    min-height: 46px;
  }

  .dashboard-sidebar__item :deep(.v-list-item__prepend > .v-icon) {
    opacity: 0.92;
  }

  .dashboard-sidebar__item.v-list-item--active {
    background: rgb(255 255 255 / 15%);
    color: white;
  }

  .dashboard-sidebar__footer {
    color: white;
  }
</style>
