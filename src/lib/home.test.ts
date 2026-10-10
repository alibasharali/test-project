import { describe, expect, it } from 'vitest'
import { HOME_HEADING, HOME_LINE } from './home'

describe('home copy', () => {
  it('says hello world and that the webpage is working', () => {
    expect(HOME_HEADING).toBe('Hello world')
    expect(HOME_LINE).toBe('This webpage is working.')
  })

  it('has no placeholder copy', () => {
    expect(`${HOME_HEADING} ${HOME_LINE}`).not.toContain('v1 is on its way')
  })
})
