import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Example', () => {
  it('renders without crashing', () => {
    const { container } = render(<div>Hello</div>)
    expect(container).toBeTruthy()
  })
})
