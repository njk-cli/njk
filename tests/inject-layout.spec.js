import getData from '../lib/get-data.js'
import injectData from '../lib/inject-data.js'
import injectLayout from '../lib/inject-layout.js'

let injectedMd, injectedHtml, noLayout

beforeAll(async () => {
  injectedMd = await injectData(
    'tests/fixtures/prose.md',
    getData('tests/fixtures/data.json')
  )
  injectedHtml = await injectData(
    'tests/fixtures/prose.html',
    getData('tests/fixtures/data.json')
  )
  noLayout = await injectData(
    'tests/fixtures/no-layout.md',
    getData('tests/fixtures/data.json')
  )
})

it('should inject layout for a markdown with block', () => {
  expect(injectLayout(injectedMd, true)).toMatchSnapshot()
})

it('should inject layout for a html without block', async () => {
  expect(injectLayout(injectedHtml, false)).toMatchSnapshot()
})

it('should throw when no layout is found', async () => {
  expect(() => injectLayout(noLayout, true)).toThrowError()
})
