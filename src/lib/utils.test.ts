import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('handles objects', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})
