import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HOME_HEADING, HOME_LINE } from './home'
import { HomePage } from './home-page'

describe('home copy', () => {
  it('says hello world and that the webpage is working', () => {
    expect(HOME_HEADING).toBe('Hello world')
    expect(HOME_LINE).toBe('This webpage is working.')
  })
})

describe('home page', () => {
  const html = renderToStaticMarkup(createElement(HomePage))

  it('renders hello world and that the webpage is working', () => {
    expect(html).toContain('Hello world')
    expect(html).toContain('This webpage is working.')
  })

  it('renders an Increment button and a counter showing 0', () => {
    expect(html).toMatch(/<button[^>]*>Increment<\/button>/)
    expect(html).toMatch(/<output[^>]*>0<\/output>/)
  })

  it('has no placeholder copy', () => {
    expect(html).not.toContain('v1 is on its way')
  })
})
