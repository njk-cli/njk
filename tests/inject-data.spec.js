import { jest } from '@jest/globals'
import getData from '../lib/get-data.js'
import injectData from '../lib/inject-data.js'

let fixtureData
let mockExit

beforeAll(() => {
  console.error = jest.fn()
  mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  fixtureData = getData('tests/fixtures/data.json')
})

it('should parse markdown with data', async () => {
  expect(
    await injectData('tests/fixtures/prose.md', fixtureData)
  ).toMatchSnapshot()
})
it('should parse html with data', async () => {
  expect(
    await injectData('tests/fixtures/prose.html', fixtureData)
  ).toMatchSnapshot()
})
it('should be okay without front-matter or data', async () => {
  expect(
    await injectData('tests/fixtures/no-frontmatter.html', fixtureData)
  ).toMatchSnapshot()
})
it('should fail with exit for wrong file', async () => {
  expect(
    await injectData('tests/fixtures/prose.htm', fixtureData)
  ).toBeUndefined()
  expect(mockExit).toBeCalledWith(1)
  expect(console.error).toBeCalledTimes(1)
})
