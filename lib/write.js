import chalkTemplate from 'chalk-template'
import fs from 'fs-extra'
import { minify } from 'html-minifier'
import { dirname, join, parse, relative } from 'path'
import { fail } from './logger.js'
import { isInside } from './utils.js'

/**
 * Minify and write a rendered file with given options
 *
 * @param {object} file
 * @param {object} opts
 *
 * @returns {Promise}
 */
export default async (file, opts) => {
  // this should always return rootPath
  const rootPath = isInside(file.path, opts.rootPaths)
  const dest = join(opts.out, relative(rootPath || '', dirname(file.path)))
  const basefile = parse(file.path).name
  let destfile = join(dest, `${basefile}.html`)
  if (file.isClean) {
    destfile = join(dest, basefile, 'index.html')
  }
  if (opts.minify && file.content) {
    file.content = minify(file.content, opts.minifyOpts)
  }
  try {
    await fs.ensureDir(dest)
    await fs.outputFile(destfile, file.content)
    return destfile
  } catch (err) {
    return fail(
      chalkTemplate`Error writing {yellow ${relative(opts.out, destfile)}}`,
      err
    )
  }
}
