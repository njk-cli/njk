const path = require('path')
const chalk = require('chalk')
const logger = require('./logger')
const { humanSize, humanTime } = require('./utils')

module.exports = async (results, opts, time) => {
  if (opts.quiet) return
  // print results for various modes
  const outputs = await Promise.all(results)
  const timelog = process.hrtime(time)

  // watch mode without verbose
  if (!opts.verbose) {
    console.log(
      chalk`${opts.watch ? '' : '\n'}Wrote {yellow ${
        outputs.length
      }} file(s) in {dim ${humanTime(timelog)}}`
    )
  }

  // watch mode with verbose
  if (opts.watch && opts.verbose) {
    outputs.forEach((res) => {
      logger.success(chalk`Wrote {yellow ${path.relative(opts.out, res)}}`)
    })
  }

  // build mode with verbose
  if (!opts.watch && opts.verbose) {
    console.log(chalk`\n{green Rendered in} {dim ${humanTime(timelog)}}`)
    const sizedOutputs = outputs.map((res) => ({
      name: res,
      size: humanSize(res),
    }))
    const largest = Math.max.apply(
      null,
      sizedOutputs.map((res) => res.size.length)
    )
    console.log('\nFile sizes after gzip: \n')
    sizedOutputs
      .sort((a, b) => a.size.length - b.size.length)
      .forEach((res) => {
        console.log(
          chalk`  {dim ${res.size}} ${' '.repeat(
            largest - res.size.length
          )} {cyan ${res.name}}`
        )
      })
  }
}
