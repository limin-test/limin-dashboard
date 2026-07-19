import type { QuoteApprovalColumn as QuoteApprovalColumnModel } from '@/model/dashboard'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { VueDraggable } from 'vue-draggable-plus'
import QuoteApprovalColumn from '@/components/dashboard/QuoteApprovalColumn.vue'
import vuetify from '@/plugins/vuetify'

const column: QuoteApprovalColumnModel = {
  dockName: 'Ocean Star',
  id: 'dock_01',
  quotes: [
    {
      avatarColor: '#274C5E',
      code: 'SEPT2020/DD1',
      customerName: 'Kempell',
      description: 'Review labor estimate and supplier coverage before approval.',
      id: 'quote_01',
      initials: 'KE',
      position: 1,
      statusLabel: 'Needs review',
      statusTone: 'warning',
      title: 'Labor quotation',
      version: 3,
    },
  ],
}

describe('QuoteApprovalColumn', () => {
  it('emits the target dry dock and next card when a card is dragged', async () => {
    const wrapper = mount(QuoteApprovalColumn, {
      props: {
        column,
        searchQuery: '',
      },
      global: {
        plugins: [vuetify],
      },
    })
    const destination = document.createElement('div')
    const draggedCard = document.createElement('div')
    const nextCard = document.createElement('div')

    destination.dataset.columnId = 'dock_02'
    draggedCard.dataset.quoteId = 'quote_01'
    nextCard.dataset.quoteId = 'quote_02'
    destination.append(draggedCard, nextCard)

    await wrapper.findComponent(VueDraggable).vm.$emit('end', {
      from: document.createElement('div'),
      item: draggedCard,
      newIndex: 0,
      oldIndex: 0,
      to: destination,
    })
    await flushPromises()

    expect(wrapper.emitted('move-quote')).toEqual([
      ['quote_01', 'dock_02', 'quote_02'],
    ])
  })
})
