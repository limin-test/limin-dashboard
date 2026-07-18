import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import QuoteApprovalBoard from '@/components/dashboard/QuoteApprovalBoard.vue'
import { useDashboard } from '@/composable/use-dashboard'
import vuetify from '@/plugins/vuetify'

function mountQuoteApprovalBoard () {
  return mount(QuoteApprovalBoard, {
    attachTo: document.body,
    global: {
      plugins: [vuetify],
    },
  })
}

describe('QuoteApprovalBoard', () => {
  it('filters quotes when the user enters a search term', async () => {
    const wrapper = mountQuoteApprovalBoard()
    const searchInput = wrapper.find('input[name="search-pending-quotes"]')

    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Kempell')

    expect(wrapper.text()).toContain('Kempell')
    expect(wrapper.text()).not.toContain('Bombay Dockyard')
  })

  it('opens an inline quote form from a dry dock column', async () => {
    const wrapper = mountQuoteApprovalBoard()
    const addQuoteButton = wrapper.find('button[aria-label="Add quote for Ocean Star"]')

    expect(addQuoteButton.exists()).toBe(true)

    await addQuoteButton.trigger('click')

    expect(wrapper.find('input[name="quote-title-ocean-star"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="quote-description-ocean-star"]').exists()).toBe(true)
  })

  it('adds a local quote after the inline form is submitted', async () => {
    const wrapper = mountQuoteApprovalBoard()

    await wrapper.find('button[aria-label="Add quote for Ocean Star"]').trigger('click')
    await wrapper.find('input[name="quote-title-ocean-star"]').setValue('Hull cleaning')
    await wrapper.find('textarea[name="quote-description-ocean-star"]').setValue('Prepare a new hull cleaning quotation.')
    await wrapper.find('form.quote-approval-create-form').trigger('submit')

    expect(wrapper.text()).toContain('Hull cleaning')
    expect(wrapper.text()).toContain('DRAFT-001')
  })

  it('moves a quote between vessel columns', () => {
    const { approvalColumns, moveQuote } = useDashboard()

    moveQuote({
      destinationColumnId: 'mv-glory',
      destinationIndex: 0,
      quoteId: 'quote-kempell',
      sourceColumnId: 'ocean-star',
    })

    const oceanStarColumn = approvalColumns.value.find(column => column.id === 'ocean-star')
    const mvGloryColumn = approvalColumns.value.find(column => column.id === 'mv-glory')

    expect(oceanStarColumn?.quotes.some(quote => quote.id === 'quote-kempell')).toBe(false)
    expect(mvGloryColumn?.quotes[0]?.id).toBe('quote-kempell')
  })
})
