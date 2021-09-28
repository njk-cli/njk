const render = require('../lib/render')
const write = require('../lib/write')
const fs = require('fs-extra')
const { renderOpts, baseOpts, minifyOpts } = require('./common')

let mockExit, rendered, renderedClean

beforeAll(async () => {
  fs.ensureDir = jest.fn()
  fs.outputFile = jest.fn()
  console.error = jest.fn()
  mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  rendered = await render('tests/fixtures/prose.md', renderOpts)
  renderedClean = await render('tests/fixtures/prose.md', {
    ...renderOpts,
    clean: true,
  })
})

it('should write a file with clean path', async () => {
  expect(
    await write(renderedClean, {
      ...baseOpts,
      minify: true,
      minifyOpts,
    })
  ).toBe('dist/prose/index.html')
  expect(fs.ensureDir).toBeCalledWith('dist')
  expect(fs.outputFile.mock.calls[0]).toMatchSnapshot()
})

it('should write a file without clean path', async () => {
  expect(
    await write(rendered, {
      ...baseOpts,
      minify: false,
    })
  ).toBe('dist/prose.html')
  expect(fs.ensureDir).toBeCalledWith('dist')
  expect(fs.outputFile.mock.calls[0]).toMatchSnapshot()
})
it('should error when write fails', async () => {
  fs.outputFile.mockImplementationOnce(() =>
    Promise.reject(new Error('failed to write'))
  )
  expect(await write(rendered, { ...baseOpts, minify: false })).toBeUndefined()
  expect(mockExit).toBeCalledWith(1)
  expect(console.error).toBeCalledTimes(1)
})
