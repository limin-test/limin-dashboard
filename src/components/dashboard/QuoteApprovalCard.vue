<template>
  <v-card
    border="sm"
    class="quote-approval-card"
    elevation="0"
  >
    <div class="quote-approval-card__customer">
      <v-avatar
        :color="quote.avatarColor"
        rounded="md"
        size="42"
      >
        <span class="text-caption font-weight-bold text-white">{{ quote.initials }}</span>
      </v-avatar>

      <div class="min-w-0">
        <div class="quote-approval-card__customer-name">{{ quote.customerName }}</div>
        <div class="quote-approval-card__code">{{ quote.code }}</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import type { QuoteApproval } from '@/model/dashboard'

  defineProps<{
    quote: QuoteApproval
  }>()
</script>

<style scoped>
  .quote-approval-card {
    border-color: #e3e8ef !important;
    border-radius: 8px;
    padding: 14px;
  }

  .quote-approval-card__customer {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .quote-approval-card__customer-name {
    color: #172335;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
  }

  .quote-approval-card__code {
    color: #7c8796;
    font-size: 12px;
    line-height: 1.4;
    margin-top: 2px;
  }
</style>
