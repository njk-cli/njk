const njk = require('../lib/command')
const fs = require('fs-extra')

const sample = 'tests/fixtures/example'

beforeAll(() => {
  fs.ensureDir = jest.fn()
  fs.outputFile = jest.fn()
  console.log = jest.fn()
})

it('should render single page', async () => {
  expect(
    await njk(
      `${sample}/pages/prose.html -b -v -c -t ${sample}/templates -d ${sample}/data`.split(
        ' '
      )
    )
  ).toBeUndefined()

  expect(console.log).toBeCalledTimes(3)
  expect(fs.outputFile.mock.calls[0]).toMatchSnapshot()
})

it('should render multiple pages', async () => {
  expect(
    await njk(
      `${sample}/pages/*.{html,md} -b -c -t ${sample}/templates -d ${sample}/data`.split(
        ' '
      )
    )
  ).toBeUndefined()

  expect(console.log).toBeCalledTimes(1)

  expect(
    Object.assign(
      {},
      ...Array.from(fs.outputFile.mock.calls, ([k, v]) => ({ [k]: v }))
    )
  ).toMatchSnapshot()
})
