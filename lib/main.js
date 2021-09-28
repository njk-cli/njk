const chalk = require('chalk')
const path = require('path')
const render = require('./render')
const write = require('./write')
const logger = require('./logger')
const printResult = require('./print-result')
const { isFile } = require('./utils')

/**
 * For a given file or array of files render html pages
 *
 * @param {string} input files or array of files to process
 * @param {object} options extra configuration
 */
module.exports = async (source, opts) => {
  // render and write files based on filename
  const processFile = async (file) => {
    try {
      const result = await render(file, opts)
      return await write(result, opts)
    } catch (err) {
      return logger.fail(
        chalk`Error processing {yellow ${path.basename(file)}}`,
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
