import chalkTemplate from 'chalk-template'
import { basename } from 'path'
import { fail } from './logger.js'
import printResult from './print-result.js'
import render from './render.js'
import { isFile } from './utils.js'
import write from './write.js'

/**
 * For a given file or array of files render html pages
 *
 * @param {string} input files or array of files to process
 * @param {object} options extra configuration
 */
export default async (source, opts) => {
  // render and write files based on filename
  const processFile = async (file) => {
    try {
      const result = await render(file, opts)
      return await write(result, opts)
    } catch (err) {
      return fail(
        chalkTemplate`Error processing {yellow ${basename(file)}}`,
        err
      )
    }
  }
  // multiple files
  if (Array.isArray(source)) {
    await printResult(
      source.filter(isFile).map(processFile),
      opts,
      process.hrtime()
    )
  } else if (isFile(source)) {
    // single/changed file
    await printResult([processFile(source)], opts, process.hrtime())
  }
}
