<template>
  <v-container
    class="quote-detail"
    fluid
  >
    <div
      v-if="isLoading"
      class="quote-detail__loading"
      role="status"
    >
      Loading quote...
    </div>

    <section
      v-else-if="quoteDetail"
      aria-labelledby="quote-detail-title"
    >
      <div class="quote-detail__topbar">
        <div class="quote-detail__breadcrumb">
          <RouterLink
            aria-label="Back to dashboard"
            class="quote-detail__back-link"
            to="/"
          >
            <v-icon icon="mdi-chevron-left" size="20" />
            Dashboard
          </RouterLink>

          <span aria-hidden="true">/</span>
          <strong>{{ quoteDetail.quote.code }}</strong>
        </div>

        <nav
          aria-label="Quote detail sections"
          class="quote-detail__section-nav"
        >
          <span
            v-for="section in detailSections"
            :key="section"
            class="quote-detail__section-nav-item"
            :class="{ 'quote-detail__section-nav-item--active': section === 'General' }"
          >
            {{ section }}
          </span>
        </nav>
      </div>

      <header class="quote-detail__hero">
        <v-avatar
          class="quote-detail__hero-avatar"
          :color="quoteDetail.quote.avatarColor"
          rounded="lg"
          size="112"
        >
          <span class="text-h5 font-weight-bold text-white">{{ quoteDetail.quote.initials }}</span>
        </v-avatar>

        <div class="quote-detail__hero-copy">
          <p class="quote-detail__eyebrow">{{ quoteDetail.dockName }}</p>
          <h1 id="quote-detail-title">{{ quoteDetail.quote.code }}</h1>
          <p class="quote-detail__description">{{ quoteDetail.quote.description }}</p>
        </div>

        <v-chip
          class="quote-detail__status"
          :color="quoteDetail.quote.statusTone"
          label
          size="small"
          variant="flat"
        >
          {{ quoteDetail.quote.statusLabel }}
        </v-chip>
      </header>

      <div class="quote-detail__content">
        <v-card
          border="sm"
          class="quote-detail__facts-card"
          elevation="0"
        >
          <dl class="quote-detail__facts">
            <div>
              <dt>Quote number</dt>
              <dd>{{ quoteDetail.quote.code }}</dd>
            </div>

            <div>
              <dt>Supplier</dt>
              <dd>{{ quoteDetail.quote.customerName }}</dd>
            </div>

            <div>
              <dt>Work scope</dt>
              <dd>{{ quoteDetail.quote.title }}</dd>
            </div>

            <div>
              <dt>Approval status</dt>
              <dd>{{ quoteDetail.quote.statusLabel }}</dd>
            </div>
          </dl>
        </v-card>

        <v-card
          border="sm"
          class="quote-detail__summary-card"
          elevation="0"
        >
          <p class="quote-detail__summary-label">Quote description</p>
          <h2>{{ quoteDetail.quote.title }}</h2>
          <p>{{ quoteDetail.quote.description }}</p>
        </v-card>
      </div>
    </section>

    <v-card
      v-else
      border="sm"
      class="quote-detail__not-found"
      elevation="0"
    >
      <v-icon color="primary" icon="mdi-file-search-outline" size="44" />
      <h1>Quote not found</h1>
      <p>The selected quote is no longer available in this dashboard.</p>
      <RouterLink class="quote-detail__return-link" to="/">Return to dashboard</RouterLink>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { useQuoteDetail } from '@/composable/use-quote-detail'

  const { detailSections, isLoading, quoteDetail } = useQuoteDetail()
</script>

<style scoped>
  .quote-detail {
    min-height: calc(100dvh - 80px);
    padding: 0 36px 36px;
  }

  .quote-detail__topbar {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 20px 32px;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1660px;
    padding: 20px 0;
  }

  .quote-detail__loading {
    color: #66758a;
    margin: 72px auto;
    text-align: center;
  }

  .quote-detail__breadcrumb {
    align-items: center;
    color: #7c8796;
    display: flex;
    font-size: 14px;
    gap: 8px;
  }

  .quote-detail__breadcrumb strong {
    color: #172335;
    font-weight: 700;
  }

  .quote-detail__back-link {
    align-items: center;
    color: #6f7c8b;
    display: inline-flex;
    gap: 2px;
    text-decoration: none;
  }

  .quote-detail__back-link:focus-visible,
  .quote-detail__return-link:focus-visible {
    outline: 3px solid rgb(var(--v-theme-primary) / 42%);
    outline-offset: 3px;
  }

  .quote-detail__section-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .quote-detail__section-nav-item {
    border: 1px solid #dfe6ee;
    border-radius: 8px;
    color: #475569;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 14px;
  }

  .quote-detail__section-nav-item--active {
    background: rgb(var(--v-theme-primary));
    border-color: rgb(var(--v-theme-primary));
    color: white;
  }

  .quote-detail__hero {
    align-items: center;
    background: rgb(var(--v-theme-primary));
    color: white;
    display: flex;
    gap: 18px;
    margin-inline: -36px;
    padding: 18px 36px;
  }

  .quote-detail__hero-avatar {
    border: 1px solid rgb(255 255 255 / 58%);
  }

  .quote-detail__hero-copy {
    min-width: 0;
  }

  .quote-detail__eyebrow {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .quote-detail__hero h1 {
    font-size: clamp(25px, 2vw, 32px);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.15;
    margin-top: 2px;
  }

  .quote-detail__description {
    font-size: 15px;
    line-height: 1.5;
    margin-top: 6px;
    max-width: 680px;
  }

  .quote-detail__status {
    margin-left: auto;
  }

  .quote-detail__content {
    display: grid;
    gap: 24px;
    margin: 0 auto;
    max-width: 1660px;
    padding-top: 24px;
  }

  .quote-detail__facts-card,
  .quote-detail__summary-card,
  .quote-detail__not-found {
    border-color: #e3e8ef !important;
    border-radius: 10px;
  }

  .quote-detail__facts {
    display: grid;
    gap: 24px 38px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 22px 26px;
  }

  .quote-detail__facts dt,
  .quote-detail__summary-label {
    color: #7c8796;
    font-size: 13px;
    line-height: 1.35;
  }

  .quote-detail__facts dd {
    color: #172335;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.45;
    margin-top: 4px;
  }

  .quote-detail__summary-card {
    padding: 24px 26px;
  }

  .quote-detail__summary-card h2 {
    color: #172335;
    font-size: 20px;
    font-weight: 750;
    letter-spacing: -0.015em;
    line-height: 1.3;
    margin-top: 4px;
  }

  .quote-detail__summary-card > p:last-child {
    color: #66758a;
    line-height: 1.55;
    margin-top: 10px;
    max-width: 760px;
  }

  .quote-detail__not-found {
    margin: 72px auto;
    max-width: 520px;
    padding: 36px;
    text-align: center;
  }

  .quote-detail__not-found h1 {
    color: #172335;
    font-size: 24px;
    margin-top: 16px;
  }

  .quote-detail__not-found p {
    color: #66758a;
    margin-top: 8px;
  }

  .quote-detail__return-link {
    color: rgb(var(--v-theme-primary));
    display: inline-block;
    font-weight: 700;
    margin-top: 20px;
  }

  @media (max-width: 1040px) {
    .quote-detail__topbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .quote-detail__section-nav {
      overflow-x: auto;
      padding-bottom: 2px;
      width: 100%;
    }

    .quote-detail__section-nav-item {
      flex: 0 0 auto;
    }

    .quote-detail__facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 839px) {
    .quote-detail {
      padding: 0 18px 24px;
    }

    .quote-detail__hero {
      align-items: flex-start;
      flex-wrap: wrap;
      margin-inline: -18px;
      padding: 18px;
    }

    .quote-detail__hero-avatar {
      height: 68px !important;
      width: 68px !important;
    }

    .quote-detail__status {
      margin-left: 86px;
      margin-top: -34px;
    }

    .quote-detail__facts {
      gap: 20px;
      grid-template-columns: 1fr;
      padding: 20px;
    }

    .quote-detail__summary-card {
      padding: 20px;
    }
  }
</style>
