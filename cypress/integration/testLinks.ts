import flattenedNavigationData from '../../autoGeneratedData/rootTopics.json'
import isExternalLink from '../../src/utils/isExternalLink'

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
chai.use(require('chai-string'))

const ignore = [
  'mailto',
  // github responds with 429 too many requests because it thinks we are spamming them
  'https://github.com',
  'https://stream.launchdarkly.',
  'https://events.launchdarkly.',
  'https://app.launchdarkly.',
  'https://console.aws.',
  'https://mockbin.org',
  'https://glitch.com',
  'https://app.logdna.com',
  'https://help.sleuth.io',
]

describe('Verify links', () => {
  flattenedNavigationData.forEach(({ label, allItems }) => {
    allItems.forEach(path => {
      it(`${label}: ${path}`, () => {
        if (isExternalLink(path)) {
          cy.request(path).then(resp => {
            expect(resp.status).to.eq(200)
          })
        } else {
          cy.visit(path)
          cy.get('main a').each($a => {
            const href = $a.prop('href')

            const included = !ignore.find(prefix => href.startsWith(prefix))
            if (included) {
              cy.request(`${href}`).then(resp => {
                expect(resp.status).to.eq(200)
              })
            }
          })
        }
      })
    })
  })
})
