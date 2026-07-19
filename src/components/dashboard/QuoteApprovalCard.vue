<template>
  <v-card
    border="sm"
    class="quote-approval-card"
    elevation="0"
  >
    <div class="quote-approval-card__customer">
      <RouterLink
        :aria-label="`Open ${quote.customerName} details`"
        class="quote-approval-card__avatar-link"
        :to="`/quotes/${quote.id}`"
        @click.stop
        @pointerdown.stop
      >
        <v-avatar
          :color="quote.avatarColor"
          rounded="md"
          size="42"
        >
          <span class="text-caption font-weight-bold text-white">{{ quote.initials }}</span>
        </v-avatar>
      </RouterLink>

      <div class="min-w-0">
        <div class="quote-approval-card__customer-name">{{ cardTitle }}</div>
        <div class="quote-approval-card__code">{{ cardSubtitle }}</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import type { QuoteApproval } from '@/model/dashboard'
  import { useQuoteApprovalCard } from '@/composable/use-quote-approval-card'

  const props = defineProps<{
    quote: QuoteApproval
  }>()

  const { cardSubtitle, cardTitle } = useQuoteApprovalCard(() => props.quote)
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

  .quote-approval-card__avatar-link {
    border-radius: 6px;
    display: flex;
    flex: 0 0 auto;
    text-decoration: none;
  }

  .quote-approval-card__avatar-link:focus-visible {
    outline: 3px solid rgb(var(--v-theme-primary) / 42%);
    outline-offset: 3px;
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
