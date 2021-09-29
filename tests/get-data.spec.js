import { jest } from '@jest/globals'
import getData from '../lib/get-data.js'

let mockExit

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
})
it('should read a file', () => {
  expect(getData('tests/fixtures/data.json')).toMatchSnapshot()
})
it('should read a directory with mixed data', () => {
  expect(getData('tests/fixtures/data')).toMatchSnapshot()
})
it('should return empty data for missing/wrong path', () => {
  expect(getData('tests/fixtures/data.yml')).toMatchObject({})
  expect(getData()).toMatchObject({})
})
it('should fail with exit for broken data', () => {
  expect(getData('tests/fixtures/broken-data')).toMatchObject({})
  expect(mockExit).toHaveBeenCalledWith(1)
})
