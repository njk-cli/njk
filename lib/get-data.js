import dataDir from 'data-dir'
import fs from 'fs-extra'
import { resolve } from 'path'
import { fail, warn } from './logger.js'

/**
 * Get json form given directory or file. Return empty
 * data if nothing is found.
 *
 * @param {string} src source to read data from
 *
 * @returns {object}
 */
export default (src) => {
  if (src) {
    try {
      const source = resolve(src)
      if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isDirectory()) {
          return dataDir(source)
        } else {
          return fs.readJsonSync(source)
        }
      }
    } catch (err) {
      fail(`Error reading data from ${src}`, err)
    }
  }
  warn(`Using empty global data`)
  return {}
}
