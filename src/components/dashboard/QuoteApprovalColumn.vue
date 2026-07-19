<template>
  <section class="quote-approval-column">
    <header class="quote-approval-column__header">
      <h2 class="quote-approval-column__title">{{ column.dockName }}</h2>

      <v-btn
        :aria-label="`Add quote for ${column.dockName}`"
        color="primary"
        icon="mdi-plus"
        size="small"
        variant="text"
        @click="openCreateForm"
      />
    </header>

    <VueDraggable
      v-if="!isSearchActive"
      v-model="draggableQuotes"
      :animation="180"
      chosen-class="quote-approval-column__chosen"
      class="quote-approval-column__cards quote-approval-column__draggable-list"
      :data-column-id="column.id"
      ghost-class="quote-approval-column__ghost"
      group="quote-approvals"
      @end="handleDragEnd"
    >
      <div
        v-for="quote in draggableQuotes"
        :key="quote.id"
        class="quote-approval-column__draggable-card"
        :data-quote-id="quote.id"
      >
        <QuoteApprovalCard :quote="quote" />
      </div>
    </VueDraggable>

    <div
      v-else
      class="quote-approval-column__cards"
    >
      <QuoteApprovalCard
        v-for="quote in visibleQuotes"
        :key="quote.id"
        :quote="quote"
      />
    </div>

    <QuoteApprovalCreateForm
      v-if="isCreateFormOpen"
      :column-id="column.id"
      @cancel="closeCreateForm"
      @submit="createQuote"
    />

    <v-sheet
      v-if="visibleQuotes.length === 0 && !isCreateFormOpen"
      border="sm"
      class="quote-approval-column__empty text-body-2"
    >
      {{ isSearchActive ? 'No quotes match the current search.' : 'No quotes have been added yet.' }}
    </v-sheet>

    <p
      v-if="isSearchActive"
      class="quote-approval-column__search-note"
    >
      Clear search to drag cards.
    </p>
  </section>
</template>

<script setup lang="ts">
  import type { QuoteApproval, QuoteApprovalColumn, QuoteApprovalDraft } from '@/model/dashboard'
  import { VueDraggable } from 'vue-draggable-plus'
  import { useQuoteApprovalColumn } from '@/composable/use-quote-approval-column'
  import QuoteApprovalCard from './QuoteApprovalCard.vue'
  import QuoteApprovalCreateForm from './QuoteApprovalCreateForm.vue'

  const props = defineProps<{
    column: QuoteApprovalColumn
    searchQuery: string
  }>()

  const emit = defineEmits<{
    'create-quote': [columnId: string, draft: QuoteApprovalDraft]
    'move-quote': [quoteId: string, destinationColumnId: string, beforeQuoteId: string | null]
    'update-quotes': [columnId: string, quotes: QuoteApproval[]]
  }>()

  const {
    closeCreateForm,
    createQuote,
    draggableQuotes,
    handleDragEnd,
    isCreateFormOpen,
    isSearchActive,
    openCreateForm,
    visibleQuotes,
  } = useQuoteApprovalColumn(
    () => props.column,
    () => props.searchQuery,
    (columnId, draft) => emit('create-quote', columnId, draft),
    (quoteId, destinationColumnId, beforeQuoteId) => emit('move-quote', quoteId, destinationColumnId, beforeQuoteId),
    (columnId, quotes) => emit('update-quotes', columnId, quotes),
  )
</script>

<style scoped>
  .quote-approval-column {
    background: #fff;
    border: 1px solid #e4e9f0;
    border-radius: 8px;
    min-height: 540px;
    padding: 10px;
  }

  .quote-approval-column__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    min-height: 38px;
    padding-inline: 2px;
  }

  .quote-approval-column__title {
    color: #263447;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.035em;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .quote-approval-column__cards {
    display: grid;
    gap: 10px;
  }

  .quote-approval-column__draggable-list {
    min-height: 84px;
  }

  .quote-approval-column__draggable-card {
    cursor: grab;
  }

  .quote-approval-column__draggable-card:active {
    cursor: grabbing;
  }

  :deep(.quote-approval-column__ghost) {
    opacity: 0.42;
  }

  :deep(.quote-approval-column__chosen) {
    box-shadow: 0 10px 24px rgb(28 58 89 / 16%);
  }

  .quote-approval-column__empty {
    border-color: #e3e8ef !important;
    border-radius: 8px;
    color: #7c8796;
    padding: 18px 14px;
    text-align: center;
  }

  .quote-approval-column__search-note {
    color: #7c8796;
    font-size: 12px;
    line-height: 1.4;
    margin: 12px 2px 0;
  }
</style>
