<template>
  <v-container
    class="quote-approval-board"
    fluid
  >
    <section aria-labelledby="quote-approval-title">
      <div class="quote-approval-board__header">
        <h1 id="quote-approval-title">Quotes Pending Approval</h1>

        <v-text-field
          v-model="searchQuery"
          class="quote-approval-board__search"
          clearable
          density="compact"
          hide-details
          name="search-pending-quotes"
          placeholder="Search quotes"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
        />
      </div>

      <div
        v-if="matchingQuoteCount > 0"
        class="quote-approval-board__scroll-area"
      >
        <div class="quote-approval-board__columns">
          <QuoteApprovalColumn
            v-for="column in approvalColumns"
            :key="column.id"
            :column="column"
            :search-query="searchQuery"
            @create-quote="createQuote"
            @update-quotes="replaceQuotes"
          />
        </div>
      </div>

      <v-empty-state
        v-else
        class="quote-approval-board__empty-state"
        icon="mdi-magnify-remove-outline"
        text="Try a customer name, vessel, or quote number."
        title="No quotes found"
      />
    </section>
  </v-container>
</template>

<script setup lang="ts">
  import { useDashboard } from '@/composable/use-dashboard'
  import QuoteApprovalColumn from './QuoteApprovalColumn.vue'

  const {
    approvalColumns,
    createQuote,
    matchingQuoteCount,
    replaceQuotes,
    searchQuery,
  } = useDashboard()
</script>

<style scoped>
  .quote-approval-board {
    min-height: calc(100dvh - 80px);
    padding: 24px 36px 30px;
  }

  .quote-approval-board__header {
    align-items: center;
    display: flex;
    gap: 18px;
    justify-content: space-between;
    margin: 0 auto 18px;
    max-width: 1660px;
  }

  .quote-approval-board h1 {
    color: #172335;
    font-size: clamp(24px, 1.8vw, 28px);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }

  .quote-approval-board__search {
    flex: 0 1 300px;
    max-width: 300px;
  }

  .quote-approval-board__search :deep(.v-field) {
    background: #edf1f5;
    border-radius: 9px;
    box-shadow: none;
  }

  .quote-approval-board__scroll-area {
    margin: 0 auto;
    max-width: 1660px;
    overflow-x: auto;
    padding-bottom: 14px;
  }

  .quote-approval-board__columns {
    display: grid;
    gap: 14px;
    grid-auto-columns: minmax(292px, 1fr);
    grid-auto-flow: column;
    min-width: max-content;
  }

  .quote-approval-board__columns > * {
    width: min(330px, calc(100vw - 64px));
  }

  .quote-approval-board__empty-state {
    background: white;
    border: 1px solid #e4e9f0;
    border-radius: 12px;
    margin: 56px auto;
    max-width: 440px;
  }

  @media (max-width: 839px) {
    .quote-approval-board {
      padding: 24px 18px;
    }

    .quote-approval-board__header {
      align-items: stretch;
      flex-direction: column;
      gap: 18px;
      margin-bottom: 20px;
    }

    .quote-approval-board__search {
      flex-basis: auto;
      max-width: none;
    }

    .quote-approval-board__columns > * {
      width: min(330px, calc(100vw - 36px));
    }
  }
</style>
