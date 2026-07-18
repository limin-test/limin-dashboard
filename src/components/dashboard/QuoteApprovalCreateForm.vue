<template>
  <v-form
    v-model="isFormValid"
    class="quote-approval-create-form"
    validate-on="input"
    @submit.prevent="submitQuote"
  >
    <v-text-field
      v-model="draft.title"
      density="compact"
      hide-details="auto"
      label="Judul"
      :name="`quote-title-${columnId}`"
      placeholder="Judul..."
      :rules="quoteApprovalDraftRules.title"
      variant="outlined"
    />

    <v-textarea
      v-model="draft.description"
      auto-grow
      density="compact"
      hide-details="auto"
      label="Deskripsi"
      :name="`quote-description-${columnId}`"
      no-resize
      placeholder="Deskripsi..."
      rows="2"
      :rules="quoteApprovalDraftRules.description"
      variant="outlined"
    />

    <div class="quote-approval-create-form__actions">
      <v-btn
        size="small"
        type="button"
        variant="text"
        @click="cancel"
      >
        Batal
      </v-btn>

      <v-btn
        color="primary"
        size="small"
        type="submit"
        variant="flat"
      >
        Tambah
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
  import type { QuoteApprovalDraft } from '@/model/dashboard'
  import {
    createQuoteApprovalDraft,
    isQuoteApprovalDraftValid,
    quoteApprovalDraftRules,
  } from '@/schemas/quote-approval'

  const props = defineProps<{
    columnId: string
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [draft: QuoteApprovalDraft]
  }>()

  const draft = ref<QuoteApprovalDraft>(createQuoteApprovalDraft())
  const isFormValid = ref<boolean | null>(null)
  const columnId = computed(() => props.columnId)

  function cancel () {
    resetForm()
    emit('cancel')
  }

  function resetForm () {
    draft.value = createQuoteApprovalDraft()
    isFormValid.value = null
  }

  function submitQuote () {
    if (!isQuoteApprovalDraftValid(draft.value)) {
      return
    }

    emit('submit', {
      description: draft.value.description.trim(),
      title: draft.value.title.trim(),
    })
    resetForm()
  }
</script>

<style scoped>
  .quote-approval-create-form {
    background: #fff;
    border: 1px solid #e3e8ef;
    border-radius: 8px;
    display: grid;
    gap: 10px;
    padding: 12px;
  }

  .quote-approval-create-form__actions {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-top: 2px;
  }
</style>
