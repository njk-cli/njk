import chalkTemplate from 'chalk-template'
import { relative } from 'path'
import { success } from './logger.js'
import { humanSize, humanTime } from './utils.js'

export default async (results, opts, time) => {
  if (opts.quiet) return
  // print results for various modes
  const outputs = await Promise.all(results)
  const timelog = process.hrtime(time)

  // watch mode without verbose
  if (!opts.verbose) {
    console.log(
      chalkTemplate`${opts.watch ? '' : '\n'}Wrote {yellow ${
        outputs.length
      }} file(s) in {dim ${humanTime(timelog)}}`
    )
  }

  // watch mode with verbose
  if (opts.watch && opts.verbose) {
    outputs.forEach((res) => {
      success(chalkTemplate`Wrote {yellow ${relative(opts.out, res)}}`)
    })
  }

  // build mode with verbose
  if (!opts.watch && opts.verbose) {
    console.log(
      chalkTemplate`\n{green Rendered in} {dim ${humanTime(timelog)}}`
    )
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
          chalkTemplate`  {dim ${res.size}} ${' '.repeat(
            largest - res.size.length
          )} {cyan ${res.name}}`
        )
      })
  }
}
