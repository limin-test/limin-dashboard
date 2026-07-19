import { describe, expect, it } from 'vitest'
import router from '@/router'

describe('File-based router', () => {
  it('resolves the dashboard page from src/pages/index.vue', () => {
    const resolved = router.resolve('/')

    expect(resolved.fullPath).toBe('/')
    expect(resolved.matched).toHaveLength(1)
    expect(resolved.matched[0]?.path).toBe('/')
  })

  it('resolves a quote detail page from a dynamic file-based route', () => {
    const resolved = router.resolve('/quotes/quote-kempell')

    expect(resolved.fullPath).toBe('/quotes/quote-kempell')
    expect(resolved.matched.at(-1)?.path).toBe('/quotes/:quoteId')
  })
})
