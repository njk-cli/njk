import { jest } from '@jest/globals'
import render from '../lib/render.js'
import { renderOpts } from './common.js'

let mockExit

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
})
it('should render for a markdown with block', async () => {
  expect(
    await render('tests/fixtures/prose.md', {
      ...renderOpts,
      clean: true,
    })
  ).toMatchSnapshot()
})

it('should throw for rendering errors', async () => {
  await expect(() =>
    render('tests/fixtures/prose.md', {
      ...renderOpts,
      templates: ['tests/fix'],
    })
  ).rejects.toThrowError(`(unknown path)
  Error: template not found: default.njk`)
})

it('should exit on unexpected errors', async () => {
  expect(await render('tests/fixtures/pros.md', {})).toBeUndefined()
  expect(mockExit).toHaveBeenCalledWith(1)
})
