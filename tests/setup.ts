import { afterEach, beforeAll, vi } from 'vitest'

class ResizeObserverMock {
  disconnect () {}

  observe () {}

  unobserve () {}
}

class IntersectionObserverMock {
  disconnect () {}

  observe () {}

  unobserve () {}
}

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation(query => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
    writable: true,
  })

  Object.defineProperty(window, 'ResizeObserver', {
    value: ResizeObserverMock,
    writable: true,
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    value: IntersectionObserverMock,
    writable: true,
  })

  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  })
})

afterEach(() => {
  document.body.innerHTML = ''
})
